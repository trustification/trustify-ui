import React from "react";
import { generatePath, NavLink } from "react-router-dom";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { Skeleton, Tooltip } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { Paths } from "@app/Routes";
import { decodePurl } from "@app/utils/utils";
import { useFetchRecommendations } from "@app/queries/recommendations";
import { PackageSearchContext } from "./package-context";
import { PackageVulnerabilities } from "./components/PackageVulnerabilities";
import { List, ListItem } from "@patternfly/react-core";
import { WithPackage } from "../../components/WithPackage";
import { PackageLicenses } from "./components/PackageLicences";

export const PackageTable: React.FC = () => {
  const { isFetching, fetchError, tableControls } =
    React.useContext(PackageSearchContext);

  const {
    numRenderedColumns,
    currentPageItems,
    propHelpers: {
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
    () => [...currentPageItems.map((item) => item.purl)].sort(),
    [currentPageItems],
  );
  const { recommendationsMap } = useFetchRecommendations(allPurls);

  return (
    <>
      <Table {...tableProps} aria-label="Package table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "namespace" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "type" })} />
              <Th {...getThProps({ columnKey: "licenses" })} />
              <Th {...getThProps({ columnKey: "remediation" })}>
                Remediations{" "}
                <Tooltip content="Number of CVEs with a fix available for this package. Open the package to see remediations per CVE in the Vulnerabilities tab.">
                  <OutlinedQuestionCircleIcon />
                </Tooltip>
              </Th>
              <Th {...getThProps({ columnKey: "path" })} />
              <Th {...getThProps({ columnKey: "qualifiers" })} />
              <Th {...getThProps({ columnKey: "vulnerabilities" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={currentPageItems.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems.map((item, rowIndex) => {
            const rowRecs = recommendationsMap.get(item.purl) ?? [];

            return (
              <WithPackage key={item.uuid} packageId={item.uuid}>
                {(pkg, packageIsFetching, packageFetchError) => {
                  // Only count CVEs with "affected" status — mirrors the Vulnerabilities tab filter
                  const affectedStatuses = (pkg?.advisories ?? []).flatMap(
                    (a) => a.status.filter((s) => s.status === "affected"),
                  );
                  const affectedCveIds = pkg
                    ? new Set(
                        affectedStatuses.map((s) => s.vulnerability.identifier),
                      )
                    : null;
                  const hasCveAgnosticBackport = rowRecs.some(
                    (rec) => rec.vulnerabilities.length === 0,
                  );
                  const cveIdsWithRemediation = new Set<string>();
                  if (hasCveAgnosticBackport && affectedCveIds) {
                    for (const id of affectedCveIds)
                      cveIdsWithRemediation.add(id);
                  }
                  for (const rec of rowRecs) {
                    for (const vuln of rec.vulnerabilities) {
                      if (!affectedCveIds || affectedCveIds.has(vuln.id))
                        cveIdsWithRemediation.add(vuln.id);
                    }
                  }
                  for (const s of affectedStatuses) {
                    if (s.fixed_versions.length > 0) {
                      cveIdsWithRemediation.add(s.vulnerability.identifier);
                    }
                  }
                  const remediationCount = cveIdsWithRemediation.size;
                  return (
                    <Tbody>
                      <Tr {...getTrProps({ item })}>
                        <TableRowContentWithControls
                          {...tableControls}
                          item={item}
                          rowIndex={rowIndex}
                        >
                          <Td
                            width={15}
                            modifier="breakWord"
                            {...getTdProps({ columnKey: "name" })}
                          >
                            <NavLink
                              to={generatePath(Paths.packageDetails, {
                                packageId: item.uuid,
                              })}
                            >
                              {item.decomposedPurl
                                ? item.decomposedPurl?.name
                                : decodePurl(item.purl)}
                            </NavLink>
                          </Td>
                          <Td
                            width={15}
                            modifier="truncate"
                            {...getTdProps({ columnKey: "namespace" })}
                          >
                            {item.decomposedPurl?.namespace}
                          </Td>
                          <Td
                            width={10}
                            modifier="truncate"
                            {...getTdProps({ columnKey: "version" })}
                          >
                            {item.decomposedPurl?.version}
                          </Td>
                          <Td
                            width={10}
                            modifier="truncate"
                            {...getTdProps({ columnKey: "type" })}
                          >
                            {item.decomposedPurl?.type}
                          </Td>
                          <Td
                            width={10}
                            modifier="truncate"
                            {...getTdProps({
                              columnKey: "licenses",
                              isCompoundExpandToggle: true,
                              item,
                              rowIndex,
                            })}
                          >
                            <PackageLicenses
                              pkg={pkg}
                              isFetching={packageIsFetching}
                              fetchError={packageFetchError}
                            />
                          </Td>
                          <Td
                            width={15}
                            {...getTdProps({ columnKey: "remediation" })}
                          >
                            {packageIsFetching ? (
                              <Skeleton screenreaderText="Loading remediations" />
                            ) : (
                              `${remediationCount} ${remediationCount === 1 ? "Remediation" : "Remediations"}`
                            )}
                          </Td>
                          <Td
                            width={10}
                            modifier="truncate"
                            {...getTdProps({ columnKey: "path" })}
                          >
                            {item.decomposedPurl?.path}
                          </Td>
                          <Td
                            width={20}
                            {...getTdProps({ columnKey: "qualifiers" })}
                          >
                            {item.decomposedPurl?.qualifiers && (
                              <PackageQualifiers
                                value={item.decomposedPurl?.qualifiers}
                              />
                            )}
                          </Td>
                          <Td
                            width={10}
                            {...getTdProps({ columnKey: "vulnerabilities" })}
                          >
                            <PackageVulnerabilities
                              pkg={pkg}
                              isFetching={packageIsFetching}
                              fetchError={packageFetchError}
                            />
                          </Td>
                        </TableRowContentWithControls>
                      </Tr>
                      {isCellExpanded(item) ? (
                        <Tr isExpanded>
                          <Td
                            {...getExpandedContentTdProps({
                              item,
                            })}
                            className={spacing.pLg}
                          >
                            <ExpandableRowContent>
                              <div className={spacing.ptLg}>
                                {isCellExpanded(item, "licenses") ? (
                                  <List isPlain>
                                    {pkg?.licenses?.map((license, idx) => (
                                      <ListItem
                                        key={`${license.license_name}-${idx}`}
                                      >
                                        {license.license_name}
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : null}
                              </div>
                            </ExpandableRowContent>
                          </Td>
                        </Tr>
                      ) : null}
                    </Tbody>
                  );
                }}
              </WithPackage>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="package-table"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};
