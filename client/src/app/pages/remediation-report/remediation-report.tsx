import React from "react";
import {
  type BlockerFunction,
  Link,
  useBlocker,
  useSearchParams,
} from "react-router-dom";

import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  Label,
  LabelGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Progress,
  ProgressMeasureLocation,
  ProgressSize,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { REMEDIATION_VENDOR_LABEL } from "@trustify-ui/common";

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useWithUiId } from "@app/utils/query-utils";
import { Paths } from "@app/Routes";
import { useFetchRemediationReport } from "@app/queries/recommendations";
import type { RecommendReportPackage } from "@app/client";

import { downloadCsv } from "./csv-export";
import { extractName, extractVersion } from "./purl-utils";
import "./remediation-report.css";

/** View model for a package row in the packages-with-remediations table. */
interface PackageRow {
  purl: string;
  recommendedPurl: string;
  packageName: string;
  version: string;
  recommendedVersion: string;
  isApplied: boolean;
  foundInNames: string[];
  vulnerabilities: string[];
}

const toPackageRows = (
  packages: RecommendReportPackage[],
  sbomNameById: Map<string, string>,
): PackageRow[] =>
  packages.map((pkg) => ({
    purl: pkg.purl,
    recommendedPurl: pkg.recommended_purl,
    packageName: extractName(pkg.purl),
    version: extractVersion(pkg.purl),
    recommendedVersion: extractVersion(pkg.recommended_purl),
    isApplied: pkg.purl === pkg.recommended_purl,
    foundInNames: (pkg.found_in ?? []).map((id) => sbomNameById.get(id) ?? id),
    vulnerabilities: pkg.vulnerabilities ?? [],
  }));

/** Remediation report page — renders an impact summary and per-package remediations for selected SBOMs. */
export const RemediationReport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sbomIds = React.useMemo(() => {
    const ids = searchParams.get("ids");
    return ids ? ids.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const { report, isFetching, fetchError, isLimitExceeded } =
    useFetchRemediationReport(sbomIds);

  const sbomNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const sbom of report?.sboms ?? []) {
      map.set(sbom.id, sbom.name);
    }
    return map;
  }, [report]);

  const sbomNames = React.useMemo(
    () =>
      (report?.sboms ?? [])
        .filter((s) => s.addressable_packages > 0)
        .map((s) => s.name)
        .sort(),
    [report],
  );

  const packageRows = React.useMemo(
    () => toPackageRows(report?.packages ?? [], sbomNameById),
    [report, sbomNameById],
  );

  const tableDataWithUiId = useWithUiId(
    packageRows,
    (d) => `${d.purl}-${d.recommendedVersion}`,
  );

  const tableControls = useLocalTableControls({
    tableName: "remediation-packages",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetching,
    columnNames: {
      packageName: "Package",
      version: "Version",
      recommendedVersion: "Recommended version",
      vulnerabilities: "Vulnerabilities addressed",
      foundInNames: "Found in",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["packageName"],
    getSortValues: (item) => ({
      packageName: item.packageName,
    }),
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "foundInNames",
        title: "SBOM",
        placeholderText: "Filter by SBOM...",
        type: FilterType.multiselect,
        selectOptions: sbomNames.map((name) => ({
          value: name,
          label: name,
        })),
        matcher: (filterValue: string, item: PackageRow) =>
          item.foundInNames.includes(filterValue),
      },
      {
        categoryKey: "vulnerabilities",
        title: "CVE",
        placeholderText: "Filter by CVE...",
        type: FilterType.search,
        matcher: (filterValue: string, item: PackageRow) =>
          item.vulnerabilities.some((v) =>
            v.toLowerCase().includes(filterValue.toLowerCase()),
          ),
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps: pkgToolbarProps,
      filterToolbarProps: pkgFilterToolbarProps,
      paginationToolbarItemProps: pkgPaginationToolbarItemProps,
      paginationProps: pkgPaginationProps,
      tableProps: pkgTableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
  } = tableControls;

  const [hasDownloaded, setHasDownloaded] = React.useState(false);

  const shouldBlock = React.useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      !!report &&
      packageRows.length > 0 &&
      !hasDownloaded &&
      currentLocation.pathname !== nextLocation.pathname,
    [report, packageRows.length, hasDownloaded],
  );

  const blocker = useBlocker(shouldBlock);

  const handleDownload = () => {
    downloadCsv(report?.packages ?? [], sbomNameById);
    setHasDownloaded(true);
  };

  const addressableSboms = (report?.sboms ?? []).filter(
    (s) => s.addressable_packages > 0,
  );
  const impact = report?.impact_summary;

  return (
    <>
      {/* Breadcrumb section */}
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.sboms}>SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Remediation report</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Header section */}
      <PageSection>
        <div className="rr-report__header">
          <div className="rr-report__header-text">
            <Content>
              <Content component="h1">Remediation report</Content>
              <Content component="p">
                Impact summary for your selected SBOMs. Download a copy if you
                want to keep it.
              </Content>
            </Content>
          </div>
          {report ? (
            <Button
              variant="primary"
              isDisabled={packageRows.length === 0}
              onClick={handleDownload}
              icon={<DownloadIcon />}
            >
              Download CSV
            </Button>
          ) : null}
        </div>
      </PageSection>

      {/* Content section */}
      <PageSection>
        {/* No SBOMs selected */}
        {sbomIds.length === 0 ? (
          <EmptyState
            headingLevel="h4"
            titleText="No SBOMs selected"
            variant={EmptyStateVariant.sm}
          >
            <EmptyStateBody>
              Go back to the SBOMs page and select one or more SBOMs to generate
              a report.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button
                  variant="primary"
                  component={(props) => <Link {...props} to={Paths.sboms} />}
                >
                  Go to SBOMs
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : isFetching ? (
          /* Loading */
          <EmptyState
            titleText="Generating remediation report"
            headingLevel="h4"
            icon={Spinner}
          >
            <EmptyStateBody>
              Analyzing {sbomIds.length} selected SBOM
              {sbomIds.length === 1 ? "" : "s"} for remediations.
            </EmptyStateBody>
          </EmptyState>
        ) : isLimitExceeded ? (
          /* 413 error */
          <Alert variant="danger" title="Package limit exceeded" isInline>
            The selected SBOMs contain too many packages to process at once.
            Select fewer SBOMs and try again.
          </Alert>
        ) : fetchError ? (
          /* Generic error */
          <Alert variant="danger" title="Error generating report" isInline>
            {fetchError.message}
          </Alert>
        ) : report ? (
          /* Report content */
          <div className="rr-report">
            <Alert
              variant="custom"
              title={`${REMEDIATION_VENDOR_LABEL} remediations available`}
              isInline
            >
              Based on the selected SBOMs, {REMEDIATION_VENDOR_LABEL} can
              address {addressableSboms.length} of {sbomIds.length} SBOMs and{" "}
              {impact?.addressable_packages ?? 0} related package
              {(impact?.addressable_packages ?? 0) === 1 ? "" : "s"}.
            </Alert>

            {/* Impact summary card */}
            <Card>
              <CardTitle>
                <span className="rr-report__card-title">Impact summary</span>
              </CardTitle>
              <CardBody>
                <div className="rr-report__impact-grid">
                  <div className="rr-report__stat">
                    <div className="rr-report__stat-label">
                      SBOMs with remediations
                    </div>
                    <div className="rr-report__stat-value">
                      {impact?.sboms_with_recommendations ?? 0}
                      <span className="rr-report__stat-suffix">
                        / {sbomIds.length}
                      </span>
                    </div>
                    <div className="rr-report__stat-help">
                      You selected {sbomIds.length} SBOM
                      {sbomIds.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="rr-report__stat">
                    <div className="rr-report__stat-label">
                      Addressable packages
                    </div>
                    <div className="rr-report__stat-value">
                      {impact?.addressable_packages ?? 0}
                    </div>
                    <div className="rr-report__stat-help">
                      Unique packages across selected SBOMs
                    </div>
                  </div>
                </div>

                <div className="rr-report__progress">
                  <Progress
                    value={
                      sbomIds.length > 0
                        ? Math.round(
                            (addressableSboms.length / sbomIds.length) * 100,
                          )
                        : 0
                    }
                    title="SBOM coverage"
                    measureLocation={ProgressMeasureLocation.outside}
                    size={ProgressSize.md}
                    aria-label="Percent of selected SBOMs with remediations"
                  />
                </div>

                <DescriptionList
                  isHorizontal
                  isCompact
                  horizontalTermWidthModifier={{ default: "20ch" }}
                >
                  <DescriptionListGroup>
                    <DescriptionListTerm>Selected SBOMs</DescriptionListTerm>
                    <DescriptionListDescription>
                      {sbomIds.length}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Addressable SBOMs</DescriptionListTerm>
                    <DescriptionListDescription>
                      {impact?.sboms_with_recommendations ?? 0}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      Addressable packages
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {impact?.addressable_packages ?? 0}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>

            {/* SBOMs with remediations card */}
            <Card>
              <CardTitle>
                <span className="rr-report__card-title">
                  SBOMs with remediations
                </span>
              </CardTitle>
              <CardBody>
                {addressableSboms.length === 0 ? (
                  <Content component="p" className="rr-report__empty">
                    None of the selected SBOMs have remediations available.
                  </Content>
                ) : (
                  <Table aria-label="SBOMs with remediations" variant="compact">
                    <Thead>
                      <Tr>
                        <Th width={40}>SBOM</Th>
                        <Th width={30}>Addressable packages</Th>
                        <Th width={30}>Vulnerabilities</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {addressableSboms.map((sbom) => (
                        <Tr key={sbom.id}>
                          <Td dataLabel="SBOM">{sbom.name}</Td>
                          <Td dataLabel="Addressable packages">
                            {sbom.addressable_packages}
                          </Td>
                          <Td dataLabel="Vulnerabilities">
                            {sbom.vulnerability_count}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </CardBody>
            </Card>

            {/* Packages with remediations card */}
            <Card>
              <CardTitle>
                <span className="rr-report__card-title">
                  Packages with remediations
                </span>
              </CardTitle>
              <CardBody>
                <Toolbar {...pkgToolbarProps} aria-label="packages-toolbar">
                  <ToolbarContent>
                    <FilterToolbar {...pkgFilterToolbarProps} />
                    <ToolbarItem {...pkgPaginationToolbarItemProps}>
                      <SimplePagination
                        idPrefix="remediation-packages"
                        isTop
                        paginationProps={pkgPaginationProps}
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>
                <Table
                  {...pkgTableProps}
                  aria-label="Packages with remediations"
                  variant="compact"
                >
                  <Thead>
                    <Tr>
                      <TableHeaderContentWithControls {...tableControls}>
                        <Th {...getThProps({ columnKey: "packageName" })} />
                        <Th {...getThProps({ columnKey: "version" })} />
                        <Th
                          {...getThProps({ columnKey: "recommendedVersion" })}
                        />
                        <Th {...getThProps({ columnKey: "vulnerabilities" })} />
                        <Th {...getThProps({ columnKey: "foundInNames" })} />
                      </TableHeaderContentWithControls>
                    </Tr>
                  </Thead>
                  <ConditionalTableBody
                    isLoading={false}
                    isError={false}
                    isNoData={packageRows.length === 0}
                    numRenderedColumns={numRenderedColumns}
                  >
                    {currentPageItems?.map((item, rowIndex) => (
                      <Tbody key={item._ui_unique_id}>
                        <Tr {...getTrProps({ item })}>
                          <TableRowContentWithControls
                            {...tableControls}
                            item={item}
                            rowIndex={rowIndex}
                          >
                            <Td {...getTdProps({ columnKey: "packageName" })}>
                              {item.packageName}
                            </Td>
                            <Td {...getTdProps({ columnKey: "version" })}>
                              {item.version}
                            </Td>
                            <Td
                              {...getTdProps({
                                columnKey: "recommendedVersion",
                              })}
                            >
                              {item.isApplied ? (
                                <Label color="blue" isCompact>
                                  Applied
                                </Label>
                              ) : (
                                <Tooltip content={item.recommendedPurl}>
                                  <Label
                                    color="blue"
                                    variant="outline"
                                    isCompact
                                  >
                                    {item.recommendedVersion}
                                  </Label>
                                </Tooltip>
                              )}
                            </Td>
                            <Td
                              {...getTdProps({ columnKey: "vulnerabilities" })}
                            >
                              <LabelGroup>
                                {item.vulnerabilities.map((cve) => (
                                  <Label
                                    key={cve}
                                    isCompact
                                    color="orange"
                                    variant="outline"
                                  >
                                    {cve}
                                  </Label>
                                ))}
                              </LabelGroup>
                            </Td>
                            <Td {...getTdProps({ columnKey: "foundInNames" })}>
                              <div className="rr-report__app-labels">
                                {item.foundInNames.map((name) => (
                                  <Label
                                    key={name}
                                    isCompact
                                    color="grey"
                                    variant="outline"
                                  >
                                    {name}
                                  </Label>
                                ))}
                              </div>
                            </Td>
                          </TableRowContentWithControls>
                        </Tr>
                      </Tbody>
                    ))}
                  </ConditionalTableBody>
                </Table>
                <SimplePagination
                  idPrefix="remediation-packages"
                  isTop={false}
                  paginationProps={pkgPaginationProps}
                />
              </CardBody>
            </Card>
          </div>
        ) : null}
      </PageSection>

      {/* Leave-page modal — unchanged */}
      <Modal
        variant="small"
        isOpen={blocker.state === "blocked"}
        onClose={() => blocker.state === "blocked" && blocker.reset()}
        aria-label="Leave remediation report"
      >
        <ModalHeader title="Leave remediation report?" />
        <ModalBody>
          This report is not saved and will be unavailable after leaving this
          page. To save the report, download it first.
        </ModalBody>
        <ModalFooter>
          <Button
            key="download-and-leave"
            variant="primary"
            icon={<DownloadIcon />}
            onClick={() => {
              handleDownload();
              if (blocker.state === "blocked") blocker.proceed();
            }}
          >
            Download and leave
          </Button>
          <Button
            key="leave-without-downloading"
            variant="secondary"
            onClick={() => {
              if (blocker.state === "blocked") blocker.proceed();
            }}
          >
            Leave without downloading
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={() => {
              if (blocker.state === "blocked") blocker.reset();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
