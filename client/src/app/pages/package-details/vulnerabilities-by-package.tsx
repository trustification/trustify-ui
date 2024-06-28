import React from "react";
import { NavLink } from "react-router-dom";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
    ConditionalTableBody,
    TableHeaderContentWithControls,
    TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchPackageById } from "@app/queries/packages";
import { useWithUiId } from "@app/utils/query-utils";

interface VulnerabilitiesByPackageProps {
  packageId: string;
}

export const VulnerabilitiesByPackage: React.FC<VulnerabilitiesByPackageProps> = ({ packageId }) => {
  const {
    pkg,
    isFetching: isFetching,
    fetchError: fetchError,
  } = useFetchPackageById(packageId);

  const tableData = React.useMemo(() => {
    return (pkg?.advisories ?? []).flatMap(advisory => {
      return advisory.status.map(status => ({ identifier: status.vulnerability.identifier }))
    })
  }, [pkg]);

  const tableDataWithUiId = useWithUiId(
    tableData,
    (d) => `${d.identifier}-${Math.floor(Math.random() * 10000)}`
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: false,
    columnNames: {
      id: "ID",
    },
    hasActionsColumn: true,
    isSortEnabled: false,
    isPaginationEnabled: true,
    initialItemsPerPage: 10,
    isExpansionEnabled: false,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
        getItemValue: (item) => item.identifier,
      },
    ],
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
    },
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
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
              <Th {...getThProps({ columnKey: "id" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={tableDataWithUiId.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item._ui_unique_id}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={15} {...getTdProps({ columnKey: "id" })}>
                      <NavLink to={`/vulnerabilities/${item.identifier}`}>
                        {item.identifier}
                      </NavLink>
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
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
