import type React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";

import {
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  List,
  ListItem,
  MenuToggle,
  type MenuToggleElement,
  PageSection,
  Popover,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import {
  Caption,
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
import { Paths } from "@app/Routes";
import { useWithUiId } from "@app/utils/query-utils";
import { decomposePurl, formatDate } from "@app/utils/utils";

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { UploadFileForAnalysis } from "./components/UploadFileForAnalysis";

export const SbomScan: React.FC = () => {
  // Actions dropdown
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

  const handleActionsDropdownToggle = () => {
    setIsActionsDropdownOpen(!isActionsDropdownOpen);
  };

  // Upload handlers
  const [uploadResponseData, setUploadResponseData] =
    useState<ExtractResult | null>(null);

  const { uploads, handleUpload, handleCancelUpload, handleRemoveUpload } =
    useUploadAndAnalyzeSBOM((extractedData, _file) => {
      setUploadResponseData(extractedData);
    });

  // Post Upload handlers
  const allPurls = useMemo(() => {
    return Object.entries(uploadResponseData?.packages ?? {}).flatMap(
      ([_packageName, { purls }]) => {
        return purls;
      },
    );
  }, [uploadResponseData]);

  const {
    data: { vulnerabilities, summary },
    isFetching,
    fetchError,
  } = useVulnerabilitiesOfSbomByPurls(allPurls);

  // Other actions

  const scanAnotherFile = () => {
    for (const file of uploads.keys()) {
      handleRemoveUpload(file);
    }

    setUploadResponseData(null);
  };

  // Table handlers
  const tableDataWithUiId = useWithUiId(
    vulnerabilities,
    (d) => `${d.vulnerability.identifier}-${d.status}`,
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetching,
    columnNames: {
      vulnerabilityId: "Vulnerability ID",
      description: "Description",
      status: "Status",
      severity: "Severity",
      affectedPackages: "Affected packages",
      published: "Published",
      updated: "Updated",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: [
      "vulnerabilityId",
      "severity",
      "affectedPackages",
      "published",
      "updated",
    ],
    getSortValues: (item) => ({
      vulnerabilityId: item.vulnerability.identifier,
      severity: item.opinionatedAvisory.score?.value ?? 0,
      affectedPackages: item.purls.size,
      published: item.vulnerability?.published
        ? dayjs(item.vulnerability.published).valueOf()
        : 0,
      updated: item.vulnerability?.modified
        ? dayjs(item.vulnerability.modified).valueOf()
        : 0,
    }),
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "vulnerabilityId",
        title: "Vulnerability id",
        type: FilterType.search,
        placeholderText: "Search by Vulnerability id",
        getItemValue: (item) => item.vulnerability.identifier,
      },
      {
        categoryKey: "severity",
        title: "Severity",
        type: FilterType.multiselect,
        placeholderText: "Severity",
        selectOptions: [
          { value: "null", label: "Unknown" },
          { value: "none", label: "None" },
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: "critical", label: "Critical" },
        ],
        matcher: (filter, item) => {
          return filter === item.opinionatedAvisory.extendedSeverity;
        },
      },
      {
        categoryKey: "status",
        title: "Status",
        type: FilterType.multiselect,
        placeholderText: "Status",
        selectOptions: [
          {
            value: "affected",
            label: "Affected",
          },
          {
            value: "under_investigation",
            label: "Under investigation",
          },
        ],
        matcher: (filter, item) => {
          return filter === item.status;
        },
      },
    ],
    isPaginationEnabled: true,
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
      filterToolbarProps,
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
            <Link to={Paths.sboms}>SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Generate SBOM report</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Split>
          <SplitItem isFilled>
            <Content>
              <Content component="h1">Scan SBOM</Content>
              <Content component="p">
                Upload an SBOM file to generate a temporary vulnerability and
                license report. The file and report will not be saved.
              </Content>
            </Content>
          </SplitItem>
          <SplitItem>
            {uploadResponseData !== null && !isFetching && !fetchError && (
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
        {uploadResponseData === null ? (
          <UploadFileForAnalysis
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
          <Stack hasGutter>
            <StackItem>
              <Grid hasGutter>
                <GridItem md={4}>
                  <Card>
                    <CardTitle>
                      <Bullseye>Total vulnerabilities</Bullseye>
                    </CardTitle>
                    <CardBody>
                      <Bullseye>
                        {summary.vulnerabilityStatus.affected.total}
                      </Bullseye>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem md={4}>
                  <Card>
                    <CardTitle>
                      <Bullseye>Affected packages</Bullseye>
                    </CardTitle>
                    <CardBody>
                      <Bullseye>
                        {summary.vulnerabilityStatus.affected.total}
                      </Bullseye>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem md={4}>
                  <Card>
                    <CardTitle>
                      <Bullseye>Vulnerabilities by severity</Bullseye>
                    </CardTitle>
                    <CardBody>
                      <Bullseye>
                        <VulnerabilityGallery
                          severities={
                            summary.vulnerabilityStatus.affected.severities
                          }
                        />
                      </Bullseye>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </StackItem>
            <StackItem>
              <Toolbar {...toolbarProps}>
                <ToolbarContent>
                  <FilterToolbar {...filterToolbarProps} />
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
                      <Th {...getThProps({ columnKey: "vulnerabilityId" })} />
                      <Th {...getThProps({ columnKey: "description" })} />
                      <Th {...getThProps({ columnKey: "status" })} />
                      <Th {...getThProps({ columnKey: "severity" })} />
                      <Th {...getThProps({ columnKey: "affectedPackages" })} />
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
                              {...getTdProps({
                                columnKey: "vulnerabilityId",
                                isCompoundExpandToggle: true,
                                item: item,
                                rowIndex,
                              })}
                            >
                              {item.vulnerability.identifier}
                            </Td>
                            <TdWithFocusStatus>
                              {(isFocused, setIsFocused) => (
                                <Td
                                  width={35}
                                  modifier="truncate"
                                  onFocus={() => setIsFocused(true)}
                                  onBlur={() => setIsFocused(false)}
                                  tabIndex={0}
                                  {...getTdProps({
                                    columnKey: "description",
                                  })}
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
                              modifier="truncate"
                              {...getTdProps({ columnKey: "status" })}
                            >
                              {item.status}
                            </Td>
                            <Td
                              width={10}
                              modifier="breakWord"
                              {...getTdProps({ columnKey: "severity" })}
                            >
                              <Popover
                                triggerAction="hover"
                                aria-label="Hoverable popover"
                                headerContent={
                                  <div>
                                    {
                                      item.opinionatedAvisory.advisory?.issuer
                                        ?.name
                                    }
                                  </div>
                                }
                                bodyContent={
                                  <div>
                                    CVSS v{item.opinionatedAvisory.score?.type}
                                  </div>
                                }
                              >
                                <SeverityShieldAndText
                                  value={
                                    item.opinionatedAvisory.extendedSeverity
                                  }
                                  score={
                                    item.opinionatedAvisory.score?.value ?? null
                                  }
                                  showLabel
                                  showScore
                                />
                              </Popover>
                            </Td>
                            <Td
                              width={10}
                              modifier="truncate"
                              {...getTdProps({
                                columnKey: "affectedPackages",
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
                                {isCellExpanded(item, "vulnerabilityId") ? (
                                  <div className={spacing.mMd}>
                                    <Gallery
                                      hasGutter
                                      minWidths={{
                                        md: "350px",
                                      }}
                                    >
                                      {Array.from(item.advisories.values()).map(
                                        ({
                                          advisory,
                                          scores,
                                          opinionatedExtendedSeverity:
                                            advisoryOpinionatedExtendedSeverity,
                                          opinionatedScore:
                                            advisoryOpinionatedScore,
                                        }) => (
                                          <GalleryItem
                                            key={advisory.document_id}
                                          >
                                            <Card isCompact>
                                              <CardBody>
                                                <Split>
                                                  <SplitItem isFilled>
                                                    {advisory.issuer?.name}
                                                  </SplitItem>
                                                  <SplitItem>
                                                    <SeverityShieldAndText
                                                      value={
                                                        advisoryOpinionatedExtendedSeverity
                                                      }
                                                      score={
                                                        advisoryOpinionatedScore?.value ??
                                                        0
                                                      }
                                                      showLabel
                                                      showScore
                                                    />
                                                  </SplitItem>
                                                </Split>
                                              </CardBody>
                                              <CardBody
                                                style={{
                                                  padding: "0 0 15px 0",
                                                }}
                                              >
                                                <Table variant="compact">
                                                  <Caption>Scores</Caption>
                                                  <Tbody>
                                                    {scores.map(
                                                      (score, index) => (
                                                        <Tr
                                                          key={`${index}-${score.type}-${score.value}`}
                                                        >
                                                          <Td>
                                                            <SeverityShieldAndText
                                                              value={
                                                                score.severity
                                                              }
                                                              score={
                                                                score.value
                                                              }
                                                              showLabel
                                                              showScore
                                                            />
                                                          </Td>
                                                          <Td>
                                                            CVSS v{score.type}
                                                          </Td>
                                                        </Tr>
                                                      ),
                                                    )}
                                                  </Tbody>
                                                </Table>
                                              </CardBody>
                                            </Card>
                                          </GalleryItem>
                                        ),
                                      )}
                                    </Gallery>
                                  </div>
                                ) : null}
                                {isCellExpanded(item, "severity") ? (
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
                                {isCellExpanded(item, "affectedPackages") ? (
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
                                      {Array.from(item.purls.values()).map(
                                        (purl) => {
                                          const decomposedPurl =
                                            decomposePurl(purl);

                                          if (decomposedPurl) {
                                            return (
                                              <Tr key={purl}>
                                                <Td>{decomposedPurl?.type}</Td>
                                                <Td>
                                                  {decomposedPurl?.namespace}
                                                </Td>
                                                <Td>{decomposedPurl?.name}</Td>
                                                <Td>
                                                  {decomposedPurl?.version}
                                                </Td>
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
                                          }

                                          return (
                                            <Tr key={purl}>
                                              <Td colSpan={6}>{purl}</Td>
                                            </Tr>
                                          );
                                        },
                                      )}
                                    </Tbody>
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
            </StackItem>
          </Stack>
        )}
      </PageSection>
    </>
  );
};
