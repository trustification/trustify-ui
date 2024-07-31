import React from "react";
import { NavLink } from "react-router-dom";

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  ActionsColumn,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
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
import { useFetchProducts } from "@app/queries/products";

export const ProductList: React.FC = () => {
  // Table config
  const tableControlState = useTableControlState({
    tableName: "products",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.advisories,
    columnNames: {
      name: "Name",
      versions: "SBOM count",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search by name...",
        type: FilterType.search,
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    result: { data: products, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchProducts(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
      },
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: products,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: products,
      isEqual: (a, b) => a.id === b.id,
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
          <Text component="h1">Products</Text>
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
                  idPrefix="product-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="Product table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "versions" })} />
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
                  <Tbody key={item.id} isExpanded={isCellExpanded(item)}>
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td width={80} {...getTdProps({ columnKey: "name" })}>
                          <NavLink to={`/products/${item.id}`}>
                            {item.name}
                          </NavLink>
                        </Td>
                        <Td
                          width={20}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "versions" })}
                        >
                          {item.versions?.length}
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                  </Tbody>
                );
              })}
            </ConditionalTableBody>
          </Table>
          <SimplePagination
            idPrefix="product-table"
            isTop={false}
            isCompact
            paginationProps={paginationProps}
          />
        </div>
      </PageSection>
    </>
  );
};
