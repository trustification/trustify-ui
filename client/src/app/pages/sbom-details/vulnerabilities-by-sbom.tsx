import React from "react";
import { Link } from "react-router-dom";

import { ChartDonut } from "@patternfly/react-charts";
import {
  Card,
  CardBody,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { compareBySeverityFn, severityList } from "@app/api/model-utils";
import { VulnerabilityStatus } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  getVulnerability,
  SbomAdvisory,
  SbomPackage,
  Severity,
  VulnerabilityDetails,
} from "@app/client";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchSBOMById, useFetchSbomsAdvisory } from "@app/queries/sboms";
import { useWithUiId } from "@app/utils/query-utils";
import { decomposePurl, formatDate } from "@app/utils/utils";

interface DonutChartData {
  total: number;
  summary: { [key in Severity]: number };
}

const DEFAULT_DONUT_CHART_DATA: DonutChartData = {
  total: 0,
  summary: { none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

interface TableData {
  vulnerabilityId: string;
  advisory: SbomAdvisory;
  status: VulnerabilityStatus;
  packages: SbomPackage[];
  vulnerability?: VulnerabilityDetails;
}

interface VulnerabilitiesBySbomProps {
  sbomId: string;
}

export const VulnerabilitiesBySbom: React.FC<VulnerabilitiesBySbomProps> = ({
  sbomId,
}) => {
  const {
    sbom,
    isFetching: isFetchingSbom,
    fetchError: fetchErrorSbom,
  } = useFetchSBOMById(sbomId);
  const {
    advisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  } = useFetchSbomsAdvisory(sbomId);

  const [allVulnerabilities, setAllVulnerabilities] = React.useState<
    TableData[]
  >([]);
  const [vulnerabilitiesById, setVulnerabilitiesById] = React.useState<
    Map<string, VulnerabilityDetails>
  >(new Map());
  const [isFetchingVulnerabilities, setIsFetchingVulnerabilities] =
    React.useState(false);

  React.useEffect(() => {
    if (advisories.length === 0) {
      return;
    }

    const vulnerabilities = (advisories ?? [])
      .flatMap((advisory) => {
        return (advisory.status ?? []).map((status) => {
          const result: TableData = {
            vulnerabilityId: status.vulnerability_id,
            status: status.status as VulnerabilityStatus,
            packages: status.packages || [],
            advisory: { ...advisory },
          };
          return result;
        });
      })
      // Take only "affected"
      .filter((item) => item.status === "affected")
      // Remove dupplicates if exists
      .reduce((prev, current) => {
        const exists = prev.find(
          (item) =>
            item.vulnerabilityId === current.vulnerabilityId &&
            item.advisory.uuid === current.advisory.uuid
        );
        if (!exists) {
          return [...prev, current];
        } else {
          return prev;
        }
      }, [] as TableData[]);

    setAllVulnerabilities(vulnerabilities);
    setIsFetchingVulnerabilities(true);

    Promise.all(
      vulnerabilities
        .map(async (item) => {
          const response = await getVulnerability({
            client,
            path: { id: item.vulnerabilityId },
          });
          return response.data;
        })
        .map((vulnerability) => vulnerability.catch(() => null))
    ).then((vulnerabilities) => {
      const validVulnerabilities = vulnerabilities.reduce((prev, current) => {
        if (current) {
          return [...prev, current];
        } else {
          // Filter out error responses
          return prev;
        }
      }, [] as VulnerabilityDetails[]);

      const vulnerabilitiesById = new Map<string, VulnerabilityDetails>();
      validVulnerabilities.forEach((vulnerability) => {
        vulnerabilitiesById.set(vulnerability.identifier, vulnerability);
      });

      setVulnerabilitiesById(vulnerabilitiesById);
      setIsFetchingVulnerabilities(false);
    });
  }, [advisories]);

  const tableData = React.useMemo(() => {
    return allVulnerabilities.map((item) => {
      const result: TableData = {
        ...item,
        vulnerability: vulnerabilitiesById.get(item.vulnerabilityId),
      };
      return result;
    });
  }, [allVulnerabilities, vulnerabilitiesById]);

  const tableDataWithUiId = useWithUiId(
    tableData,
    (d) => `${d.vulnerabilityId}-${d.advisory.identifier}-${d.advisory.uuid}`
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetchingAdvisories || isFetchingVulnerabilities,
    columnNames: {
      id: "Id",
      description: "Description",
      cvss: "CVSS",
      affectedDependencies: "Affected dependencies",
      published: "Published",
      updated: "Updated",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["id"],
    isPaginationEnabled: true,
    isFilterEnabled: false,
    isExpansionEnabled: true,
    expandableVariant: "compound",
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
      getExpandedContentTdProps,
    },
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  //

  const donutChartData = React.useMemo(() => {
    return tableData.reduce((prev, current) => {
      if (current.vulnerability?.average_severity) {
        const severity = current.vulnerability?.average_severity;
        return {
          ...prev,
          total: prev.total + 1,
          summary: {
            ...prev.summary,
            [severity]: prev.summary[severity] + 1,
          },
        };
      } else {
        return prev;
      }
    }, DEFAULT_DONUT_CHART_DATA);
  }, [tableData]);

  const donutChart = React.useMemo(() => {
    return Object.keys(donutChartData.summary)
      .map((item) => {
        const severity = item as Severity;
        const count = donutChartData.summary[severity];
        const severityProps = severityList[severity];
        return {
          severity,
          count,
          label: severityProps.name,
          color: severityProps.color.value,
        };
      })
      .sort(compareBySeverityFn((item) => item.severity));
  }, [donutChartData]);

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <LoadingWrapper
                isFetching={
                  isFetchingAdvisories ||
                  isFetchingVulnerabilities ||
                  isFetchingSbom
                }
              >
                <Grid hasGutter>
                  <GridItem md={6}>
                    <div style={{ height: "230px", width: "350px" }}>
                      <ChartDonut
                        constrainToVisibleArea
                        legendOrientation="vertical"
                        legendPosition="right"
                        padding={{
                          bottom: 20,
                          left: 20,
                          right: 140,
                          top: 20,
                        }}
                        title={`${donutChartData.total}`}
                        subTitle="Total vulnerabilities"
                        width={350}
                        legendData={donutChart.map(({ label, count }) => ({
                          name: `${label}: ${count}`,
                        }))}
                        data={donutChart.map(({ label, count }) => ({
                          x: label,
                          y: count,
                        }))}
                        labels={({ datum }) => `${datum.x}: ${datum.y}`}
                        colorScale={donutChart.map(({ color }) => color)}
                      />
                    </div>
                  </GridItem>
                  <GridItem md={6}>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          {sbom?.name}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Version</DescriptionListTerm>
                        <DescriptionListDescription>
                          {sbom?.described_by
                            .map((item) => item.version)
                            .join(", ")}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Creation date</DescriptionListTerm>
                        <DescriptionListDescription>
                          {formatDate(sbom?.published)}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                </Grid>
              </LoadingWrapper>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Toolbar {...toolbarProps}>
            <ToolbarContent>
              <ToolbarItem {...paginationToolbarItemProps}>
                <SimplePagination
                  idPrefix="vulnerability-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="Vulnerability table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "id" })} />
                  <Th {...getThProps({ columnKey: "description" })} />
                  <Th {...getThProps({ columnKey: "cvss" })} />
                  <Th {...getThProps({ columnKey: "affectedDependencies" })} />
                  <Th {...getThProps({ columnKey: "published" })} />
                  <Th {...getThProps({ columnKey: "updated" })} />
                </TableHeaderContentWithControls>
              </Tr>
            </Thead>
            <ConditionalTableBody
              isLoading={isFetchingAdvisories || isFetchingVulnerabilities}
              isError={!!fetchErrorAdvisories}
              isNoData={tableDataWithUiId.length === 0}
              numRenderedColumns={numRenderedColumns}
            >
              {currentPageItems?.map((item, rowIndex) => {
                return (
                  <Tbody
                    key={item._ui_unique_id}
                    isExpanded={isCellExpanded(item)}
                  >
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td width={15} {...getTdProps({ columnKey: "id" })}>
                          <Link to={`/vulnerabilities/${item.vulnerabilityId}`}>
                            {item.vulnerabilityId}
                          </Link>
                        </Td>
                        <Td
                          width={35}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "description" })}
                        >
                          {item.vulnerability?.title ||
                            item.vulnerability?.description}
                        </Td>
                        <Td width={10} {...getTdProps({ columnKey: "cvss" })}>
                          {item.vulnerability?.average_severity && (
                            <SeverityShieldAndText
                              value={item.vulnerability.average_severity}
                            />
                          )}
                        </Td>
                        <Td
                          width={15}
                          modifier="truncate"
                          {...getTdProps({
                            columnKey: "affectedDependencies",
                            isCompoundExpandToggle: true,
                            item: item,
                            rowIndex,
                          })}
                        >
                          {item.packages.length}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "published" })}
                        >
                          {formatDate(item.vulnerability?.published)}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "updated" })}
                        >
                          CREATE_ISSUE
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <Tr isExpanded>
                        <Td
                          {...getExpandedContentTdProps({
                            item,
                          })}
                        >
                          <ExpandableRowContent>
                            {isCellExpanded(item, "affectedDependencies") ? (
                              <>
                                <Table variant="compact">
                                  <Thead>
                                    <Tr>
                                      <Th>Type</Th>
                                      <Th>Namespace</Th>
                                      <Th>Name</Th>
                                      <Th>Version</Th>
                                      <Th>Path</Th>
                                      <Th>Qualifiers</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {item.packages
                                      .flatMap((item) => item.purl)
                                      .map((purl, index) => {
                                        const props = decomposePurl(purl.purl);
                                        return (
                                          <Tr key={index}>
                                            <Td>{props?.type}</Td>
                                            <Td>{props?.namespace}</Td>
                                            <Td>{props?.name}</Td>
                                            <Td>{props?.version}</Td>
                                            <Td>{props?.path}</Td>
                                            <Td>
                                              {props?.qualifiers && (
                                                <PackageQualifiers
                                                  value={props?.qualifiers}
                                                />
                                              )}
                                            </Td>
                                          </Tr>
                                        );
                                      })}
                                  </Tbody>
                                </Table>
                              </>
                            ) : null}
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    ) : null}
                  </Tbody>
                );
              })}
            </ConditionalTableBody>
          </Table>
          <SimplePagination
            idPrefix="vulnerability-table"
            isTop={false}
            isCompact
            paginationProps={paginationProps}
          />
        </StackItem>
      </Stack>
    </>
  );
};
