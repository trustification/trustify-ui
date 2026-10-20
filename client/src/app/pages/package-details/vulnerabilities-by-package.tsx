import React from "react";
import { generatePath, Link } from "react-router-dom";

import dayjs from "dayjs";

import {
  Label,
  LabelGroup,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import {
  Table,
  TableText,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { TdWithFocusStatus } from "@app/components/TdWithFocusStatus";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import { useVulnerabilitiesOfPackageId } from "@app/hooks/domain-controls/useVulnerabilitiesOfPackage";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchPackageById } from "@app/queries/packages";
import { useFetchRecommendations } from "@app/queries/recommendations";
import { Paths } from "@app/Routes";
import { useWithUiId } from "@app/utils/query-utils";
import { decomposePurl, formatDate, purlBaseEquals } from "@app/utils/utils";

interface VulnerabilitiesByPackageProps {
  packageId: string;
}

export const VulnerabilitiesByPackage: React.FC<
  VulnerabilitiesByPackageProps
> = ({ packageId }) => {
  const { pkg } = useFetchPackageById(packageId);

  const {
    data: { vulnerabilities },
    isFetching: isFetchingVulnerabilities,
    fetchError: fetchErrorVulnerabilities,
  } = useVulnerabilitiesOfPackageId(packageId);

  const packagePurls = React.useMemo(
    () => (pkg?.purl ? [pkg.purl] : []),
    [pkg?.purl],
  );
  const { recommendationsMap } = useFetchRecommendations(packagePurls);

  const affectedVulnerabilities = React.useMemo(() => {
    return vulnerabilities.filter(
      (item) => item.vulnerabilityStatus === "affected",
    );
  }, [vulnerabilities]);

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
      identifier: "ID",
      description: "Description",
      severity: "CVSS",
      published: "Date published",
      remediation: "Remediations",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["identifier", "severity", "published"],
    getSortValues: (item) => {
      return {
        identifier: item.vulnerability.identifier,
        severity: item.vulnerability?.average_score || 0,
        published: item.vulnerability?.published
          ? dayjs(item.vulnerability?.published).valueOf()
          : 0,
      };
    },
    isPaginationEnabled: true,
    isFilterEnabled: false,
    filterCategories: [],
    isExpansionEnabled: false,
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
    },
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps} aria-label="vulnerability toolbar">
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

      <Table {...tableProps} aria-label="vulnerability table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "description" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "remediation" })} />
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
            const allRecs = recommendationsMap.get(pkg?.purl ?? "") ?? [];
            const rowRecs = allRecs.filter((rec) =>
              rec.vulnerabilities.some(
                (v) =>
                  v.id === item.vulnerability.identifier &&
                  (v.status === "Fixed" || v.status === "NotAffected"),
              ),
            );
            const isRemediationApplied = rowRecs.some((rec) =>
              purlBaseEquals(rec.package, pkg?.purl ?? ""),
            );
            const vendorVersionSet = new Set(
              rowRecs.map(
                (rec) => decomposePurl(rec.package)?.version ?? rec.package,
              ),
            );
            const fixedVersionsForCve = new Set<string>();
            for (const { advisory } of item.relatedSboms ?? []) {
              for (const pkgStatus of advisory.status ?? []) {
                if (
                  pkgStatus.vulnerability.identifier ===
                  item.vulnerability.identifier
                ) {
                  for (const v of pkgStatus.fixed_versions ?? []) {
                    fixedVersionsForCve.add(v);
                  }
                }
              }
            }
            const nonVendorFixedVersions = [...fixedVersionsForCve].filter(
              (v) => !vendorVersionSet.has(v),
            );

            return (
              <Tbody key={item._ui_unique_id} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={15}
                      modifier="breakWord"
                      {...getTdProps({ columnKey: "identifier" })}
                    >
                      <Link
                        to={generatePath(Paths.vulnerabilityDetails, {
                          vulnerabilityId: item.vulnerability.identifier,
                        })}
                      >
                        {item.vulnerability.identifier}
                      </Link>
                    </Td>
                    <TdWithFocusStatus>
                      {(isFocused, setIsFocused) => (
                        <Td
                          width={60}
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
                    <Td width={15} {...getTdProps({ columnKey: "severity" })}>
                      {item.vulnerability?.average_severity && (
                        <SeverityShieldAndText
                          value={item.vulnerability.average_severity}
                          score={item.vulnerability.average_score}
                          showLabel
                          showScore
                        />
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
                      width={15}
                      {...getTdProps({ columnKey: "remediation" })}
                    >
                      {isRemediationApplied ? (
                        <Label color="blue" isCompact>
                          Applied
                        </Label>
                      ) : rowRecs.length > 0 ||
                        nonVendorFixedVersions.length > 0 ? (
                        <LabelGroup>
                          {rowRecs.map((rec) => {
                            const version =
                              decomposePurl(rec.package)?.version ??
                              rec.package;
                            return (
                              <Tooltip
                                key={rec.package}
                                content="Vendor backport — security fix applied in the same version stream (no major upgrade required)."
                              >
                                <Label color="blue" variant="outline" isCompact>
                                  {version}
                                </Label>
                              </Tooltip>
                            );
                          })}
                          {nonVendorFixedVersions.map((v) => (
                            <Tooltip
                              key={v}
                              content="Version upgrade — move to this newer release to get the fix."
                            >
                              <Label color="green" variant="outline" isCompact>
                                {v}
                              </Label>
                            </Tooltip>
                          ))}
                        </LabelGroup>
                      ) : null}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
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
  );
};
