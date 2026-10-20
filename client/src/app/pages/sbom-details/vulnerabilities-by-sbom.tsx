import React from "react";
import { generatePath, Link } from "react-router-dom";

import dayjs from "dayjs";

import {
  Alert,
  AlertActionCloseButton,
  Button,
  Card,
  CardBody,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  Popover,
  Skeleton,
  Stack,
  StackItem,
  Switch,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import {
  ActionsColumn,
  ExpandableRowContent,
  Table,
  TableText,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { ReadOnlyContext } from "@app/components/ReadOnlyContext";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SbomVulnerabilitiesDonutChart } from "@app/components/SbomVulnerabilitiesDonutChart";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { TdWithFocusStatus } from "@app/components/TdWithFocusStatus";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import {
  buildVexByPurl,
  useVulnerabilitiesOfSbom,
} from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useExploitIntelligenceOfSbom } from "@app/hooks/domain-controls/useExploitIntelligenceOfSbom";
import { useSubmitExploitAnalysisMutation } from "@app/queries/exploit-intelligence";
import { useFetchRecommendations } from "@app/queries/recommendations";
import { useIsExploitIntelligenceEnabled } from "@app/queries/trustifyInfo";
import { useFetchSBOMById } from "@app/queries/sboms";
import { Paths } from "@app/Routes";
import { useWithUiId } from "@app/utils/query-utils";
import { decomposePurl, formatDate, purlBaseEquals } from "@app/utils/utils";

import { WithPackage } from "@app/components/WithPackage";

import { ExploitIntelligenceAnalysisCell } from "./components/exploit-intelligence-analysis-cell";
import { VulnerabilityScoreBreakdown } from "./components/vulnerability-score-breakdown";

interface VulnerabilitiesBySbomProps {
  sbomId: string;
}

export const VulnerabilitiesBySbom: React.FC<VulnerabilitiesBySbomProps> = ({
  sbomId,
}) => {
  const [includeResolved, setIncludeResolved] = React.useState(false);

  const {
    sbom,
    isFetching: isFetchingSbom,
    fetchError: fetchErrorSbom,
  } = useFetchSBOMById(sbomId);
  const {
    data: { vulnerabilities, summary: vulnerabilitiesSummary },
    advisories: rawAdvisories,
    isFetching: isFetchingVulnerabilities,
    fetchError: fetchErrorVulnerabilities,
  } = useVulnerabilitiesOfSbom(sbomId, includeResolved);

  const { areMutationsDisabled } = React.useContext(ReadOnlyContext);
  const isEiEnabled = useIsExploitIntelligenceEnabled();

  const [showErrorBanner, setShowErrorBanner] = React.useState(false);

  const { stateMap: eiStates, trackJob } = useExploitIntelligenceOfSbom(
    isEiEnabled ? sbomId : undefined,
    {
      onJobFailed: () => {
        setShowErrorBanner(true);
      },
    },
  );

  const submitAnalysis = useSubmitExploitAnalysisMutation();

  const handleRequestAnalysis = React.useCallback(
    (vulnerabilityId: string) => {
      submitAnalysis.mutate(
        { sbom_id: sbomId, vulnerability_id: vulnerabilityId },
        {
          onSuccess: (data) => {
            if (data.data?.job_id) {
              trackJob(data.data.job_id);
            }
          },
          onError: () => {
            setShowErrorBanner(true);
          },
        },
      );
    },
    [sbomId, submitAnalysis, trackJob],
  );

  const affectedVulnerabilities = React.useMemo(() => {
    return vulnerabilities.filter(
      (item) => item.vulnerabilityStatus === "affected",
    );
  }, [vulnerabilities]);

  const vexByPurl = React.useMemo(
    () => (includeResolved ? buildVexByPurl(rawAdvisories) : new Map()),
    [rawAdvisories, includeResolved],
  );

  // Build a map of CVE ID → Set of PURLs that have upstream fixed_versions
  // from SBOM-level advisory data, so the count on the CVE row includes both
  // vendor backports (from recommendationsMap) and upstream fixes.
  const fixedPurlsByCve = React.useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const advisory of rawAdvisories) {
      for (const status of advisory.status ?? []) {
        if ((status.fixed_versions ?? []).length > 0) {
          const cveId = status.identifier;
          if (!map.has(cveId)) map.set(cveId, new Set());
          const purlSet = map.get(cveId)!;
          for (const pkg of status.packages ?? []) {
            for (const p of pkg.purl ?? []) {
              purlSet.add(p.purl);
            }
          }
        }
      }
    }
    return map;
  }, [rawAdvisories]);

  const tableDataWithUiId = useWithUiId(
    affectedVulnerabilities,
    (d) => `${d.vulnerability.identifier}-${d.vulnerabilityStatus}`,
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
      exploitAnalysis: "Exploit Intelligence",
      affectedDependencies: "Affected dependencies",
      remediation: "Remediations",
      published: "Published",
      updated: "Updated",
    },
    hasActionsColumn: isEiEnabled,
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
      cvss: item.opinionatedAdvisory.score?.value ?? 0,
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

  const allPurls = React.useMemo(
    () =>
      currentPageItems.flatMap((vuln) =>
        Array.from(vuln.purls.values())
          .filter((p) => !p.isOrphan)
          .map((p) => p.purlSummary.purl),
      ),
    [currentPageItems],
  );

  const { recommendationsMap, isFetching: isFetchingRecommendations } =
    useFetchRecommendations(allPurls);

  return (
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
        {showErrorBanner && (
          <Alert
            isInline
            variant="danger"
            title="Analysis failed"
            style={{ marginBlockEnd: "var(--pf-t--global--spacer--md)" }}
            actionClose={
              <AlertActionCloseButton
                onClose={() => setShowErrorBanner(false)}
              />
            }
            timeout={8000}
            onTimeout={() => setShowErrorBanner(false)}
          >
            The analysis could not be completed due to an unsupported SBOM
            format or a system error. Verify that your SBOM is in a supported
            format. If the issue persists, contact your administrator.
          </Alert>
        )}
        <Toolbar {...toolbarProps}>
          <ToolbarContent>
            <ToolbarItem>
              <Tooltip content="When enabled, shows VEX resolution data alongside affected vulnerabilities to help identify suppressed findings">
                <Switch
                  id="include-resolved-toggle"
                  label="Show VEX resolutions"
                  isChecked={includeResolved}
                  onChange={(_event, checked) => setIncludeResolved(checked)}
                />
              </Tooltip>
            </ToolbarItem>
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
                {isEiEnabled && (
                  <Th {...getThProps({ columnKey: "exploitAnalysis" })} />
                )}
                <Th {...getThProps({ columnKey: "affectedDependencies" })} />
                <Th {...getThProps({ columnKey: "remediation" })}>
                  Remediations{" "}
                  <Tooltip content="Number of affected packages with a fix available for this CVE. Expand Affected dependencies to see remediations per package.">
                    <OutlinedQuestionCircleIcon />
                  </Tooltip>
                </Th>
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
              const eiState = eiStates[item.vulnerability.identifier];
              const isReanalysisDisabled =
                !eiState ||
                eiState.kind === "not_run" ||
                (eiState.kind === "finding" &&
                  eiState.finding.variant === "in_progress");
              const purlResolutions = vexByPurl.get(
                item.vulnerability.identifier,
              );

              const rowPurls = Array.from(item.purls.values())
                .filter((p) => !p.isOrphan)
                .map((p) => p.purlSummary.purl);

              const fixedPurls =
                fixedPurlsByCve.get(item.vulnerability.identifier) ??
                new Set<string>();
              const remediationCount = rowPurls.filter(
                (purl) =>
                  (recommendationsMap.get(purl) ?? []).some((rec) =>
                    rec.vulnerabilities.some(
                      (v) =>
                        v.id === item.vulnerability.identifier &&
                        (v.status === "Fixed" || v.status === "NotAffected"),
                    ),
                  ) || fixedPurls.has(purl),
              ).length;

              const hasVexResolution =
                purlResolutions &&
                Array.from(item.purls.values()).some(
                  (p) => !p.isOrphan && purlResolutions.has(p.purlSummary.purl),
                );

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
                        width={10}
                        modifier="breakWord"
                        {...getTdProps({ columnKey: "id" })}
                      >
                        <Flex
                          spaceItems={{ default: "spaceItemsSm" }}
                          alignItems={{ default: "alignItemsCenter" }}
                          flexWrap={{ default: "nowrap" }}
                        >
                          <FlexItem>
                            <Link
                              to={generatePath(Paths.vulnerabilityDetails, {
                                vulnerabilityId: item.vulnerability.identifier,
                              })}
                            >
                              {item.vulnerability.identifier}
                            </Link>
                          </FlexItem>
                          {hasVexResolution && (
                            <FlexItem>
                              <Tooltip content="VEX data indicates some affected dependencies may be resolved. Expand the row to see per-package status.">
                                <Label color="green" isCompact>
                                  VEX
                                </Label>
                              </Tooltip>
                            </FlexItem>
                          )}
                        </Flex>
                      </Td>
                      <TdWithFocusStatus>
                        {(isFocused, setIsFocused) => (
                          <Td
                            width={20}
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
                      <Td width={15} {...getTdProps({ columnKey: "cvss" })}>
                        <Flex>
                          <FlexItem>
                            <SeverityShieldAndText
                              value={item.opinionatedAdvisory.extendedSeverity}
                              score={
                                item.opinionatedAdvisory.score?.value ?? null
                              }
                              showLabel
                              showScore
                            />
                          </FlexItem>
                          <FlexItem>
                            <Popover
                              hasAutoWidth
                              aria-label="CVSS Score Breakdown"
                              headerContent={<div>CVSS Score Breakdown</div>}
                              bodyContent={
                                <VulnerabilityScoreBreakdown
                                  opinionatedAdvisory={{
                                    advisory: item.opinionatedAdvisory.advisory,
                                    score: item.opinionatedAdvisory.score,
                                    extendedSeverity:
                                      item.opinionatedAdvisory.extendedSeverity,
                                  }}
                                  advisories={Array.from(
                                    item.advisories.values(),
                                  )}
                                />
                              }
                            >
                              <Button
                                variant="link"
                                disabled
                                size="sm"
                              >{`${item.advisories.size} Sources`}</Button>
                            </Popover>
                          </FlexItem>
                        </Flex>
                      </Td>
                      {isEiEnabled && (
                        <Td
                          width={15}
                          {...getTdProps({
                            columnKey: "exploitAnalysis",
                          })}
                        >
                          <ExploitIntelligenceAnalysisCell
                            vulnerabilityIdentifier={
                              item.vulnerability.identifier
                            }
                            state={eiState ?? { kind: "not_run" }}
                            onRequestAnalysis={handleRequestAnalysis}
                            isDisabled={
                              areMutationsDisabled || submitAnalysis.isPending
                            }
                          />
                        </Td>
                      )}
                      <Td
                        width={10}
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
                        width={15}
                        {...getTdProps({ columnKey: "remediation" })}
                      >
                        {isFetchingRecommendations ? (
                          <Skeleton screenreaderText="Loading remediations" />
                        ) : (
                          `${remediationCount} ${remediationCount === 1 ? "Remediation" : "Remediations"}`
                        )}
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
                      {isEiEnabled && (
                        <Td isActionCell>
                          <ActionsColumn
                            items={[
                              {
                                title: "Request new analysis",
                                onClick: () =>
                                  handleRequestAnalysis(
                                    item.vulnerability.identifier,
                                  ),
                                isDisabled:
                                  areMutationsDisabled ||
                                  submitAnalysis.isPending ||
                                  isReanalysisDisabled,
                              },
                            ]}
                          />
                        </Td>
                      )}
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
                            <Table variant="compact">
                              <Thead>
                                <Tr>
                                  <Th>Type</Th>
                                  <Th>Namespace</Th>
                                  <Th>Name</Th>
                                  <Th>Version</Th>
                                  <Th>Path</Th>
                                  <Th>Qualifiers</Th>
                                  <Th>Remediations</Th>
                                  {purlResolutions && <Th>VEX Status</Th>}
                                </Tr>
                              </Thead>
                              <Tbody>
                                {Array.from(item.purls.values()).map(
                                  (purl, index) => {
                                    if (!purl.isOrphan) {
                                      const decomposedPurl = decomposePurl(
                                        purl.purlSummary.purl,
                                      );
                                      const resolution = purlResolutions?.get(
                                        purl.purlSummary.purl,
                                      );
                                      return (
                                        <Tr key={purl.purlSummary.uuid}>
                                          <Td>{decomposedPurl?.type}</Td>
                                          <Td>{decomposedPurl?.namespace}</Td>
                                          <Td>
                                            <Link
                                              to={generatePath(
                                                Paths.packageDetails,
                                                {
                                                  packageId:
                                                    purl.purlSummary.uuid,
                                                },
                                              )}
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
                                          <Td>
                                            <WithPackage
                                              packageId={purl.purlSummary.uuid}
                                            >
                                              {(pkg, isFetching) => {
                                                if (isFetching) {
                                                  return (
                                                    <Skeleton screenreaderText="Loading remediations" />
                                                  );
                                                }
                                                const purlRecs = (
                                                  recommendationsMap.get(
                                                    purl.purlSummary.purl,
                                                  ) ?? []
                                                ).filter((rec) =>
                                                  rec.vulnerabilities.some(
                                                    (v) =>
                                                      v.id ===
                                                        item.vulnerability
                                                          .identifier &&
                                                      (v.status === "Fixed" ||
                                                        v.status ===
                                                          "NotAffected"),
                                                  ),
                                                );
                                                const vendorVersionSet =
                                                  new Set(
                                                    purlRecs.map(
                                                      (rec) =>
                                                        decomposePurl(
                                                          rec.package,
                                                        )?.version ??
                                                        rec.package,
                                                    ),
                                                  );
                                                const fixedVersions =
                                                  new Set<string>();
                                                for (const advisory of pkg?.advisories ??
                                                  []) {
                                                  for (const pkgStatus of advisory.status ??
                                                    []) {
                                                    if (
                                                      pkgStatus.vulnerability
                                                        .identifier ===
                                                      item.vulnerability
                                                        .identifier
                                                    ) {
                                                      for (const v of pkgStatus.fixed_versions ??
                                                        []) {
                                                        fixedVersions.add(v);
                                                      }
                                                    }
                                                  }
                                                }
                                                const nonVendorVersions = [
                                                  ...fixedVersions,
                                                ].filter(
                                                  (v) =>
                                                    !vendorVersionSet.has(v),
                                                );
                                                const isRemediationApplied =
                                                  purlRecs.some((rec) =>
                                                    purlBaseEquals(
                                                      rec.package,
                                                      purl.purlSummary.purl,
                                                    ),
                                                  );
                                                if (
                                                  purlRecs.length === 0 &&
                                                  nonVendorVersions.length === 0
                                                ) {
                                                  return null;
                                                }
                                                if (isRemediationApplied) {
                                                  return (
                                                    <Label
                                                      color="blue"
                                                      isCompact
                                                    >
                                                      Applied
                                                    </Label>
                                                  );
                                                }
                                                return (
                                                  <LabelGroup>
                                                    {purlRecs.map((rec) => {
                                                      const version =
                                                        decomposePurl(
                                                          rec.package,
                                                        )?.version ??
                                                        rec.package;
                                                      return (
                                                        <Tooltip
                                                          key={rec.package}
                                                          content="Vendor backport — security fix applied in the same version stream (no major upgrade required)."
                                                        >
                                                          <Label
                                                            color="blue"
                                                            variant="outline"
                                                            isCompact
                                                          >
                                                            {version}
                                                          </Label>
                                                        </Tooltip>
                                                      );
                                                    })}
                                                    {nonVendorVersions.map(
                                                      (v) => (
                                                        <Tooltip
                                                          key={v}
                                                          content="Version upgrade — move to this newer release to get the fix."
                                                        >
                                                          <Label
                                                            color="green"
                                                            variant="outline"
                                                            isCompact
                                                          >
                                                            {v}
                                                          </Label>
                                                        </Tooltip>
                                                      ),
                                                    )}
                                                  </LabelGroup>
                                                );
                                              }}
                                            </WithPackage>
                                          </Td>
                                          {purlResolutions && (
                                            <Td>
                                              {resolution ? (
                                                <Flex
                                                  spaceItems={{
                                                    default: "spaceItemsSm",
                                                  }}
                                                  alignItems={{
                                                    default: "alignItemsCenter",
                                                  }}
                                                  flexWrap={{
                                                    default: "nowrap",
                                                  }}
                                                >
                                                  <FlexItem>
                                                    <Label
                                                      color="green"
                                                      isCompact
                                                    >
                                                      {resolution.status ===
                                                      "not_affected"
                                                        ? "Not affected"
                                                        : resolution.status ===
                                                            "known_not_affected"
                                                          ? "Known not affected"
                                                          : "Fixed"}
                                                    </Label>
                                                  </FlexItem>
                                                  <FlexItem>
                                                    <Link
                                                      to={generatePath(
                                                        Paths.advisoryDetails,
                                                        {
                                                          advisoryId:
                                                            resolution.advisory
                                                              .uuid,
                                                        },
                                                      )}
                                                    >
                                                      {
                                                        resolution.advisory
                                                          .identifier
                                                      }
                                                    </Link>
                                                  </FlexItem>
                                                </Flex>
                                              ) : null}
                                            </Td>
                                          )}
                                        </Tr>
                                      );
                                    } else {
                                      return (
                                        <Tr
                                          key={`${purl.parentName}-${index}-name`}
                                        >
                                          <Td />
                                          <Td />
                                          <Td>{purl.parentName}</Td>
                                          <Td />
                                          <Td />
                                          <Td />
                                          <Td />
                                          {purlResolutions && <Td />}
                                        </Tr>
                                      );
                                    }
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
  );
};
