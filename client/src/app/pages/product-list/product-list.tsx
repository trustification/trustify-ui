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

import { useFetchOrganizations } from "@app/queries/organizations";
import {
  useDeleteProductMutation,
  useFetchProducts,
} from "@app/queries/products";
import { useNotifyErrorCallback } from "@app/hooks/useNotifyErrorCallback";

export const ProductList: React.FC = () => {
  const { result: organizations } = useFetchOrganizations({
    page: { pageNumber: 1, itemsPerPage: 1000 },
  });

  // Table config
  const tableControlState = useTableControlState({
    tableName: "products",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.advisories,
    columnNames: {
      name: "Name",
      vendor: "Vendor",
      versions: "Versions",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "organization",
        title: "Organization",
        placeholderText: "Organization",
        type: FilterType.multiselect,
        selectOptions: [
          ...(organizations.data ?? []).map((org) => ({
            value: org.id,
            label: org.name,
          })),
        ],
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

  const deleteProductByIdMutation = useDeleteProductMutation(
    useNotifyErrorCallback("Error occurred while deleting the product")
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
      getExpandedContentTdProps,
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
                  <Th {...getThProps({ columnKey: "vendor" })} />
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
                        <Td width={30} {...getTdProps({ columnKey: "name" })}>
                          <NavLink to={`/products/${item.id}`}>
                            {item.name}
                          </NavLink>
                        </Td>
                        <Td
                          width={50}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "vendor" })}
                        >
                          {item.vendor?.name}
                        </Td>
                        <Td
                          width={20}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "versions" })}
                        >
                          {item.versions?.length}
                        </Td>
                        <Td isActionCell>
                          <ActionsColumn
                            items={[
                              {
                                title: "Delete",
                                onClick: () =>
                                  deleteProductByIdMutation.mutate(item.id),
                              },
                            ]}
                          />
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
