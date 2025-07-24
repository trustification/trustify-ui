import React from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  List,
  ListItem,
  MenuToggle,
  type MenuToggleElement,
  PageSection,
  Split,
  SplitItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
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

import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import InProgressIcon from "@patternfly/react-icons/dist/esm/icons/in-progress-icon";

import type { ExtractResult } from "@app/client";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { TdWithFocusStatus } from "@app/components/TdWithFocusStatus";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import { useVulnerabilitiesOfSbomByPurls } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useUploadAndAnalyzeSBOM } from "@app/queries/sboms-analysis";
import { useWithUiId } from "@app/utils/query-utils";
import { formatDate } from "@app/utils/utils";

import { UploadFiles } from "./components/UploadFile";

export const SbomScan: React.FC = () => {
  // Actions dropdown
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] =
    React.useState(false);

  const handleActionsDropdownToggle = () => {
    setIsActionsDropdownOpen(!isActionsDropdownOpen);
  };

  //

  const [extractedData, setExtractedData] =
    React.useState<ExtractResult | null>(null);

  const purls = React.useMemo(() => {
    return Object.entries(extractedData?.packages ?? {}).flatMap(
      ([_packageName, { purls }]) => {
        return purls;
      },
    );
  }, [extractedData]);

  const { uploads, handleUpload, handleCancelUpload, handleRemoveUpload } =
    useUploadAndAnalyzeSBOM((extractedData, _file) => {
      setExtractedData(extractedData);
    });

  const scanAnotherFile = () => {
    for (const file of uploads.keys()) {
      handleRemoveUpload(file);
    }

    setExtractedData(null);
  };

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
            <Link to="/sboms/list">SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Scan SBOM</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Split>
          <SplitItem isFilled>
            <Content>
              <Content component="h1">Scan SBOM</Content>
              <Content component="p">
                This is a temporary scan to help you assess an SBOM. Your file
                will not be uploaded or stored.
              </Content>
            </Content>
          </SplitItem>
          <SplitItem>
            {extractedData !== null && !isFetching && !fetchError && (
              <Dropdown
                isOpen={isActionsDropdownOpen}
                onSelect={() => setIsActionsDropdownOpen(false)}
                onOpenChange={(isOpen) => setIsActionsDropdownOpen(isOpen)}
                popperProps={{ position: "right" }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={handleActionsDropdownToggle}
                    isExpanded={isActionsDropdownOpen}
                  >
                    Actions
                  </MenuToggle>
                )}
                ouiaId="BasicDropdown"
                shouldFocusToggleOnSelect
              >
                <DropdownList>
                  <DropdownItem key="scan-another" onClick={scanAnotherFile}>
                    Scan another
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            )}
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection>
        {extractedData === null ? (
          <UploadFiles
            uploads={uploads}
            handleUpload={handleUpload}
            handleRemoveUpload={handleRemoveUpload}
            handleCancelUpload={handleCancelUpload}
          />
        ) : isFetching ? (
          <EmptyState
            titleText="Generating SBOM report"
            headingLevel="h4"
            icon={InProgressIcon}
          >
            <EmptyStateBody>
              Analyzing your SBOM for security vulnerabilities, license issues
              and dependency details.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={scanAnotherFile}>
                  Cancel scan
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : fetchError ? (
          <EmptyState
            status="danger"
            headingLevel="h4"
            titleText="Scan failed"
            icon={ExclamationCircleIcon}
            variant={EmptyStateVariant.sm}
          >
            <EmptyStateBody>
              The file could not be analyzed. The file might be corrupted or an
              unsupported format.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="primary" onClick={scanAnotherFile}>
                  Try another file
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
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
                                  {Array.from(item.advisories.values()).map(
                                    (e) => (
                                      <ListItem
                                        key={`${e.advisory.identifier}`}
                                      >
                                        {e.advisory.identifier}
                                      </ListItem>
                                    ),
                                  )}
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
