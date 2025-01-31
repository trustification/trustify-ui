import React from "react";
import { Link } from "react-router-dom";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
} from "@app/components/TableControls";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchSbomsByPackageId } from "@app/queries/sboms";

interface SbomsByPackageProps {
  purl: string;
}

export const SbomsByPackage: React.FC<SbomsByPackageProps> = ({ purl }) => {
  const tableControlState = useTableControlState({
    tableName: "sboms",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms_by_package,
    columnNames: {
      name: "Name",
      version: "Version",
      supplier: "Supplier",
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
    purl,
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
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
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
                    <Link to={`/sboms/${item.id}`}>{item.name}</Link>
                  </Td>
                  <Td
                    width={15}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "version" })}
                  >
                    {item.described_by.map((item) => item.version).join(", ")}
                  </Td>
                  <Td
                    width={50}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "supplier" })}
                  >
                    {item.authors.join(", ")}
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="sbom-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
