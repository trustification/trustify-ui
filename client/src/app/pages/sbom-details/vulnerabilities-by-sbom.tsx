import React from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";

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

import { getSeverityPriority } from "@app/api/model-utils";
import {
  extendedSeverityFromSeverity,
  VulnerabilityStatus,
} from "@app/api/models";
import {
  PurlSummary,
  SbomAdvisory,
  SbomPackage,
  SbomStatus,
} from "@app/client";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SbomVulnerabilitiesDonutChart } from "@app/components/SbomVulnerabilitiesDonutChart";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import { useVulnerabilitiesOfSbom } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchSBOMById } from "@app/queries/sboms";
import { useWithUiId } from "@app/utils/query-utils";
import { decomposePurl, formatDate } from "@app/utils/utils";

interface TableData {
  vulnerability: SbomStatus;
  vulnerabilityStatus: VulnerabilityStatus;
  relatedPackages: {
    advisory: SbomAdvisory;
    packages: SbomPackage[];
  }[];
  summary: {
    totalPackages: number;
    allPackages: SbomPackage[];
  };
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
    data: { vulnerabilities, summary: vulnerabilitiesSummary },
    isFetching: isFetchingVulnerabilities,
    fetchError: fetchErrorVulnerabilities,
  } = useVulnerabilitiesOfSbom(sbomId);

  const affectedVulnerabilities = React.useMemo(() => {
    return vulnerabilities.filter(
      (item) => item.vulnerabilityStatus === "affected"
    );
  }, [vulnerabilities]);

  const tableData = React.useMemo(() => {
    return affectedVulnerabilities.map((item) => {
      const allPackages = item.relatedPackages
        .flatMap((i) => i.packages)
        .reduce((prev, current) => {
          const existingElement = prev.find((item) => item.id === current.id);
          if (existingElement) {
            return prev;
          } else {
            return [...prev, current];
          }
        }, [] as SbomPackage[]);
      const result: TableData = {
        ...item,
        summary: {
          totalPackages: allPackages.length,
          allPackages,
        },
      };

      return result;
    });
  }, [affectedVulnerabilities]);

  const tableDataWithUiId = useWithUiId(
    tableData,
    (d) => `${d.vulnerability.identifier}-${d.vulnerabilityStatus}`
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
    sortableColumns: [
      "id",
      "cvss",
      "affectedDependencies",
      "published",
      "updated",
    ],
    getSortValues: (item) => ({
      id: item.vulnerability.identifier,
      cvss: getSeverityPriority(item.vulnerability.average_severity),
      affectedDependencies: item.summary.totalPackages,
      published: item.vulnerability?.published
        ? dayjs(item.vulnerability.published).valueOf()
        : 0,
      updated: item.vulnerability?.modified
        ? dayjs(item.vulnerability.modified).valueOf()
        : 0,
    }),
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

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <LoadingWrapper
                isFetching={isFetchingSbom || isFetchingVulnerabilities}
                fetchError={fetchErrorSbom}
              >
                <Grid hasGutter>
                  <GridItem md={6}>
                    <SbomVulnerabilitiesDonutChart
                      vulnerabilitiesSummary={
                        vulnerabilitiesSummary.vulnerabilityStatus.affected
                      }
                    />
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
                          <Link
                            to={`/vulnerabilities/${item.vulnerability.identifier}`}
                          >
                            {item.vulnerability.identifier}
                          </Link>
                        </Td>
                        <Td
                          width={35}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "description" })}
                        >
                          {item.vulnerability && (
                            <VulnerabilityDescription
                              vulnerability={item.vulnerability}
                            />
                          )}
                        </Td>
                        <Td width={10} {...getTdProps({ columnKey: "cvss" })}>
                          <SeverityShieldAndText
                            value={extendedSeverityFromSeverity(
                              item.vulnerability.average_severity
                            )}
                          />
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
                          {item.summary.totalPackages}
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
                                    {item.summary.allPackages
                                      .flatMap((item) => {
                                        // Some packages do not have purl neither ID. So we render only the parent name meanwhile
                                        type EnrichedPurlSummary = {
                                          parentName: string;
                                          purlSummary?: PurlSummary;
                                        };

                                        const hasNoPurlsButOnlyName =
                                          item.name && item.purl.length == 0;

                                        if (hasNoPurlsButOnlyName) {
                                          const result: EnrichedPurlSummary = {
                                            parentName: item.name,
                                          };
                                          return [result];
                                        } else {
                                          return item.purl.map((i) => {
                                            const result: EnrichedPurlSummary =
                                              {
                                                parentName: item.name,
                                                purlSummary: i,
                                              };
                                            return result;
                                          });
                                        }
                                      })
                                      .map((purl, index) => {
                                        if (purl.purlSummary) {
                                          const decomposedPurl = decomposePurl(
                                            purl.purlSummary.purl
                                          );
                                          return (
                                            <Tr key={`${index}-purl`}>
                                              <Td>{decomposedPurl?.type}</Td>
                                              <Td>
                                                {decomposedPurl?.namespace}
                                              </Td>
                                              <Td>
                                                <Link
                                                  to={`/packages/${purl.purlSummary.uuid}`}
                                                >
                                                  {decomposedPurl?.name}
                                                </Link>
                                              </Td>
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
                                        } else {
                                          return (
                                            <Tr key={`${index}-name`}>
                                              <Td></Td>
                                              <Td></Td>
                                              <Td>{purl.parentName}</Td>
                                              <Td></Td>
                                              <Td></Td>
                                              <Td></Td>
                                            </Tr>
                                          );
                                        }
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
