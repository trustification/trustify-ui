import React from "react";
import { NavLink } from "react-router-dom";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
    ConditionalTableBody,
    TableHeaderContentWithControls,
} from "@app/components/TableControls";
import { getHubRequestParams, useTableControlProps, useTableControlState } from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchSbomsByPackageId } from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";

interface SbomsByPackageProps {
  packageId: string;
}

export const SbomsByPackage: React.FC<SbomsByPackageProps> = ({ packageId }) => {
  const tableControlState = useTableControlState({
    tableName: "sboms",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms_by_package,
    columnNames: {
      name: "Name",
      version: "Version",
      supplier: "Supplier",
      published: "Published",
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
  });

  const {
    result: { data: sboms, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchSbomsByPackageId(
    packageId,
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {},
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: sboms,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: sboms,
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
  } = tableControls;

  return (
    <>
      <p style={{ color: "red" }}>issue-438</p>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="sbom-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="SBOM table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "supplier" })} />
              <Th {...getThProps({ columnKey: "published" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalItemCount === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item) => {
            return (
              <Tbody key={item.id}>
                <Tr {...getTrProps({ item })}>
                  <Td width={35} {...getTdProps({ columnKey: "name" })}>
                    <NavLink to={`/sboms/${item.id}`}>{item.name}</NavLink>
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "version" })}
                  >
                    <p style={{ color: "red" }}>issue-284</p>
                  </Td>
                  <Td
                    width={30}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "supplier" })}
                  >
                    {item.authors}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "published" })}
                  >
                    {formatDate(item.published)}
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="sboms-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
