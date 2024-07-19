import React from "react";
import { NavLink } from "react-router-dom";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
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

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { DecomposedPurl, Package } from "@app/api/models";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchPackages } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

interface TableData extends Package {
  decomposedPurl?: DecomposedPurl;
}

export const PackageList: React.FC = () => {
  const tableControlState = useTableControlState({
    tableName: "packages",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.packages,
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      version: "Version",
      type: "Type",
      qualifiers: "Qualifiers",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: [],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
    ],
    isExpansionEnabled: true,
    expandableVariant: "single",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackages(
    getHubRequestParams({
      ...tableControlState,
    })
  );

  const enrichedPackages = React.useMemo(() => {
    return packages.map((item) => {
      const result: TableData = {
        ...item,
        decomposedPurl: decomposePurl(item.purl),
      };
      return result;
    });
  }, [packages]);

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "uuid",
    currentPageItems: enrichedPackages,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: enrichedPackages,
      isEqual: (a, b) => a.uuid === b.uuid,
    }),
  });

  const {
    numRenderedColumns,
    currentPageItems,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
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
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Packages</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <Toolbar {...toolbarProps}>
            <ToolbarContent>
              <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
              <ToolbarItem {...paginationToolbarItemProps}>
                <SimplePagination
                  idPrefix="packages-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="Advisories table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "namespace" })} />
                  <Th {...getThProps({ columnKey: "version" })} />
                  <Th {...getThProps({ columnKey: "type" })} />
                  <Th {...getThProps({ columnKey: "qualifiers" })} />
                </TableHeaderContentWithControls>
              </Tr>
            </Thead>
            <ConditionalTableBody
              isLoading={isFetching}
              isError={!!fetchError}
              isNoData={totalItemCount === 0}
              numRenderedColumns={numRenderedColumns}
            >
              {currentPageItems.map((item, rowIndex) => {
                return (
                  <Tbody key={item.uuid}>
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td width={25} {...getTdProps({ columnKey: "name" })}>
                          <NavLink
                            to={`/packages/${encodeURIComponent(item.uuid)}`}
                          >
                            {item.decomposedPurl
                              ? item.decomposedPurl?.name
                              : item.purl}
                          </NavLink>
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "namespace" })}
                        >
                          {item.decomposedPurl?.namespace}
                        </Td>
                        <Td
                          width={15}
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
                          width={40}
                          {...getTdProps({ columnKey: "qualifiers" })}
                        >
                          {item.decomposedPurl?.qualifiers && (
                            <PackageQualifiers
                              value={item.decomposedPurl?.qualifiers}
                            />
                          )}
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <Tr isExpanded>
                        <Td colSpan={7}>
                          <ExpandableRowContent>
                            <div className="pf-v5-u-m-md">
                              <DescriptionList>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Purl
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {item.purl}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Path
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {item.decomposedPurl?.path}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
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
            idPrefix="packages-table"
            isTop={false}
            isCompact
            paginationProps={paginationProps}
          />
        </div>
      </PageSection>
    </>
  );
};
