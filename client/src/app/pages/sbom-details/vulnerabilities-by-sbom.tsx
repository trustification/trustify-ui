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
import { Severity } from "@app/client";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useVulnerabilitiesOfSbom } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchSBOMById } from "@app/queries/sboms";
import { useWithUiId } from "@app/utils/query-utils";
import { decomposePurl, formatDate } from "@app/utils/utils";

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
    vulnerabilities: vulnerabilities,
    summary: vulnerabilitiesSummary,
    isFetching: isFetchingVulnerabilities,
    fetchError: fetchErrorVulnerabilities,
  } = useVulnerabilitiesOfSbom(sbomId);

  const tableDataWithUiId = useWithUiId(
    vulnerabilities,
    (d) => `${d.vulnerabilityId}-${d.advisory.identifier}-${d.advisory.uuid}`
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetchingVulnerabilities,
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

  const donutChart = React.useMemo(() => {
    return Object.keys(vulnerabilitiesSummary.severities)
      .map((item) => {
        const severity = item as Severity;
        const count = vulnerabilitiesSummary.severities[severity];
        const severityProps = severityList[severity];
        return {
          severity,
          count,
          label: severityProps.name,
          color: severityProps.color.value,
        };
      })
      .sort(compareBySeverityFn((item) => item.severity));
  }, [vulnerabilitiesSummary]);

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <LoadingWrapper
                isFetching={isFetchingVulnerabilities || isFetchingSbom}
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
                        title={`${vulnerabilitiesSummary.total}`}
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
              isLoading={isFetchingVulnerabilities}
              isError={!!fetchErrorVulnerabilities}
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
                          {formatDate(item.vulnerability?.modified)}
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
                                        const decomposedPurl = decomposePurl(
                                          purl.purl
                                        );
                                        return (
                                          <Tr key={index}>
                                            <Td>{decomposedPurl?.type}</Td>
                                            <Td>{decomposedPurl?.namespace}</Td>
                                            <Td>{decomposedPurl?.name}</Td>
                                            <Td>{decomposedPurl?.version}</Td>
                                            <Td>{decomposedPurl?.path}</Td>
                                            <Td>
                                              {decomposedPurl?.qualifiers && (
                                                <PackageQualifiers
                                                  value={
                                                    decomposedPurl?.qualifiers
                                                  }
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
