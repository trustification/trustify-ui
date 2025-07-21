import React from "react";
import { Link } from "react-router-dom";

import type { AxiosError } from "axios";
import dayjs from "dayjs";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  List,
  ListItem,
  PageSection,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { InProgressIcon } from "@patternfly/react-icons";
import {
  ExpandableRowContent,
  Table,
  TableText,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import type { ExtractResult } from "@app/client";
import { SimplePagination } from "@app/components/SimplePagination";
import { StateError } from "@app/components/StateError";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { UploadFiles } from "@app/pages/upload/components/upload-file";
import { useVulnerabilitiesOfSbomByPurls } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useUploadAndAnalyzeSBOM } from "@app/queries/sboms-analysis";
import { useWithUiId } from "@app/utils/query-utils";
import { TdWithFocusStatus } from "@app/components/TdWithFocusStatus";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import { formatDate } from "@app/utils/utils";

export const SbomScan: React.FC = () => {
  const [extractedData, setExtractedData] =
    React.useState<ExtractResult | null>(null);

  const purls = React.useMemo(() => {
    return Object.entries(extractedData?.packages ?? {}).flatMap(
      ([_packageName, { purls }]) => {
        return purls;
      },
    );
  }, [extractedData]);

  const { uploads, handleUpload, handleRemoveUpload } = useUploadAndAnalyzeSBOM(
    (extractedData, _file) => setExtractedData(extractedData),
  );

  const {
    data: { vulnerabilities, summary },
    isFetching,
    fetchError,
  } = useVulnerabilitiesOfSbomByPurls(purls);

  const affectedVulnerabilities = React.useMemo(() => {
    return vulnerabilities.filter((item) => item.status === "affected");
  }, [vulnerabilities]);

  const tableDataWithUiId = useWithUiId(
    affectedVulnerabilities,
    (d) => `${d.vulnerability.identifier}-${d.status}`,
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetching,
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
      cvss: "",
      affectedDependencies: item.purls.size,
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
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/sboms">SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Scan SBOM</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Content>
          <Content component="h1">Scan SBOM</Content>
          <Content component="p">
            This is a temporary scan to help you assess an SBOM. Your file will
            not be uploaded or stored.
          </Content>
        </Content>
      </PageSection>
      <PageSection>
        {isFetching ? (
          <EmptyState
            titleText="Scanning SBOM"
            headingLevel="h4"
            icon={InProgressIcon}
          >
            <EmptyStateBody>
              Analyzing your SBOM for security vulnerabilities, license issues
              and dependency details.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link">Cancel</Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : fetchError ? (
          <StateError />
        ) : !extractedData ? (
          <UploadFiles
            uploads={uploads}
            handleUpload={handleUpload}
            handleRemoveUpload={handleRemoveUpload}
            extractSuccessMessage={() => {
              return "Ready for analysis";
            }}
            // biome-ignore lint/suspicious/noExplicitAny: allowed
            extractErrorMessage={(error: AxiosError<any>) => {
              console.log(error);
              return error.response?.data?.message
                ? error.response?.data?.message
                : (error.message ?? "Error while uploading file");
            }}
            dropzoneProps={{
              multiple: false,
            }}
          />
        ) : (
          <>
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
                    <Th
                      {...getThProps({ columnKey: "affectedDependencies" })}
                    />
                    <Th {...getThProps({ columnKey: "published" })} />
                    <Th {...getThProps({ columnKey: "updated" })} />
                  </TableHeaderContentWithControls>
                </Tr>
              </Thead>
              <ConditionalTableBody
                isLoading={isFetching}
                isError={!!fetchError}
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
                          <Td
                            width={15}
                            modifier="breakWord"
                            {...getTdProps({ columnKey: "id" })}
                          >
                            <Link
                              to={`/vulnerabilities/${item.vulnerability.identifier}`}
                            >
                              {item.vulnerability.identifier}
                            </Link>
                          </Td>
                          <TdWithFocusStatus>
                            {(isFocused, setIsFocused) => (
                              <Td
                                width={35}
                                modifier="truncate"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                tabIndex={0}
                                {...getTdProps({ columnKey: "description" })}
                              >
                                <TableText
                                  focused={isFocused}
                                  wrapModifier="truncate"
                                >
                                  {item.vulnerability && (
                                    <VulnerabilityDescription
                                      vulnerability={item.vulnerability}
                                    />
                                  )}
                                </TableText>
                              </Td>
                            )}
                          </TdWithFocusStatus>
                          <Td
                            width={10}
                            modifier="breakWord"
                            {...getTdProps({
                              columnKey: "cvss",
                              // isCompoundExpandToggle: item.advisories.size > 1,
                              isCompoundExpandToggle: true,
                              item: item,
                              rowIndex,
                            })}
                          >
                            {/* {item.advisories.size === 1 ? (
                              <SeverityShieldAndText
                                value={item.advisories.values().next().value?.severity}
                                score={item.advisories.values().next().value?.severity_score ?? 0}
                                showLabel
                                showScore
                              />
                            ) : (
                              `${item.advisories.size} Severities`
                            )} */}
                            {item.advisories.size} Advisories
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
                            {item.purls.size}
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
                              {isCellExpanded(item, "cvss") ? (
                                <List isPlain>
                                  {Array.from(item.advisories.values()).map((e) => (
                                    <ListItem key={`${e.advisory.identifier}`}>
                                      {e.advisory.identifier}
                                    </ListItem>
                                  ))}
                                </List>
                              ) : null}
                              {isCellExpanded(item, "affectedDependencies") ? (
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
                                  <Tbody>affected dependencies</Tbody>
                                </Table>
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
              paginationProps={paginationProps}
            />
          </>
        )}
      </PageSection>
    </>
  );
};

export { SbomScan as default };
