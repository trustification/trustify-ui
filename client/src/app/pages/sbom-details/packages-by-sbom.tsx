import type React from "react";
import { generatePath, Link } from "react-router-dom";

import {
  Label,
  List,
  ListItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import type { LicenseRefMapping } from "@app/client";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useFetchPackagesBySbomId } from "@app/queries/packages";
import { useFetchSbomsLicenseIds } from "@app/queries/sboms";
import { Paths } from "@app/Routes";

import { PackageVulnerabilities } from "../package-list/components/PackageVulnerabilities";

const renderLicenseWithMappings = (
  license: string,
  mappings: LicenseRefMapping[],
) => {
  return mappings.reduce((prev, { license_id, license_name }) => {
    return prev.replaceAll(license_id, license_name);
  }, `${license}`);
};

interface PackagesProps {
  sbomId: string;
}

export const PackagesBySbom: React.FC<PackagesProps> = ({ sbomId }) => {
  const { licenseIds } = useFetchSbomsLicenseIds(sbomId);

  const tableControlState = useTableControlState({
    tableName: "package-table",
    columnNames: {
      name: "Name",
      version: "Version",
      vulnerabilities: "Vulnerabilities",
      licenses: "Licenses",
      purls: "PURLs",
      cpes: "CPEs",
    },
    isSortEnabled: true,
    sortableColumns: ["name"],
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "license",
        title: "License",
        placeholderText: "Filter results by license",
        type: FilterType.multiselect,
        operator: "~",
        logicOperator: "OR",
        selectOptions: licenseIds.map((license) => ({
          value: license.license_id,
          label: license.license_name,
        })),
      },
    ],
    isExpansionEnabled: true,
    expandableVariant: "compound",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackagesBySbomId(
    sbomId,
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
      },
    }),
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: packages,
    totalItemCount,
    isLoading: isFetching,
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
      <Toolbar {...toolbarProps} aria-label="Package toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="package-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Package table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "vulnerabilities" })} />
              <Th {...getThProps({ columnKey: "licenses" })} />
              <Th {...getThProps({ columnKey: "purls" })} />
              <Th {...getThProps({ columnKey: "cpes" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalItemCount === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.id} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={15} {...getTdProps({ columnKey: "name" })}>
                      {[item.name, item.group].filter(Boolean).join("/")}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item?.version}
                    </Td>
                    <Td
                      width={10}
                      modifier="breakWord"
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    >
                      {item.purl[0] && (
                        <PackageVulnerabilities packageId={item.purl[0].uuid} />
                      )}
                    </Td>
                    <Td
                      width={20}
                      modifier="breakWord"
                      {...getTdProps({
                        columnKey: "licenses",
                        isCompoundExpandToggle: item.licenses.length > 1,
                        item: item,
                        rowIndex,
                      })}
                    >
                      {item.licenses.length === 1
                        ? renderLicenseWithMappings(
                            item.licenses[0].license_name,
                            item.licenses_ref_mapping,
                          )
                        : `${item.licenses.length} Licenses`}
                    </Td>
                    <Td
                      width={20}
                      modifier="breakWord"
                      {...getTdProps({
                        columnKey: "purls",
                        isCompoundExpandToggle: item.purl.length > 1,
                        item: item,
                        rowIndex,
                      })}
                    >
                      {item.purl.length === 1 ? (
                        <Link
                          to={generatePath(Paths.packageDetails, {
                            packageId: item.purl[0].uuid,
                          })}
                        >
                          {item.purl[0].purl}
                        </Link>
                      ) : (
                        `${item.purl.length} PURLs`
                      )}
                    </Td>
                    <Td
                      width={20}
                      modifier="breakWord"
                      {...getTdProps({
                        columnKey: "cpes",
                        isCompoundExpandToggle: item.cpe.length > 0,
                        item,
                        rowIndex,
                      })}
                    >
                      {item.cpe.length} CPEs
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
                              {item.licenses.map((e) => (
                                <ListItem
                                  key={`${e.license_name}-${e.license_type}`}
                                >
                                  {renderLicenseWithMappings(
                                    e.license_name,
                                    item.licenses_ref_mapping,
                                  )}{" "}
                                  <Label isCompact>{e.license_type}</Label>
                                </ListItem>
                              ))}
                            </List>
                          ) : null}
                          {isCellExpanded(item, "purls") ? (
                            <List isPlain>
                              {item.purl.map((e) => {
                                return (
                                  <ListItem key={e.uuid}>
                                    <Link
                                      to={generatePath(Paths.packageDetails, {
                                        packageId: e.uuid,
                                      })}
                                    >
                                      {e.purl}
                                    </Link>
                                  </ListItem>
                                );
                              })}
                            </List>
                          ) : null}
                          {isCellExpanded(item, "cpes") ? (
                            <List isPlain>
                              {item.cpe.map((e) => (
                                <ListItem key={e}>{e}</ListItem>
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
