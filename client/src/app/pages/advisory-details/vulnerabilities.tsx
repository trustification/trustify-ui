import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { VulnerabilityWithinAdvisory } from "@app/api/models";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { formatDate } from "@app/utils/utils";

interface VulnerabilitiesProps {
  vulnerabilities: VulnerabilityWithinAdvisory[];
}

export const Vulnerabilities: React.FC<VulnerabilitiesProps> = ({
  vulnerabilities,
}) => {
  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "identifier",
    items: vulnerabilities,
    columnNames: {
      identifier: "Identifier",
      title: "Title",
      severity: "Severity",
      discovered: "Discovered",
      released: "Released",
      cwe: "CWE",
    },
    hasActionsColumn: true,
    isSortEnabled: true,
    sortableColumns: ["identifier", "discovered", "released"],
    getSortValues: (vuln) => ({
      identifier: vuln?.identifier || "",
      discovered: vuln ? dayjs(vuln.non_normative.discovered).millisecond() : 0,
      released: vuln ? dayjs(vuln.non_normative.released).millisecond() : 0,
    }),
    isPaginationEnabled: true,
    isExpansionEnabled: false,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "id",
        title: "ID",
        type: FilterType.search,
        placeholderText: "Search by ID...",
        getItemValue: (item) => item.identifier || "",
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

      <Table {...tableProps} aria-label="Vulnerability table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "discovered" })} />
              <Th {...getThProps({ columnKey: "released" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "cwe" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={false}
          isError={undefined}
          isNoData={vulnerabilities.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.identifier}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={15} {...getTdProps({ columnKey: "identifier" })}>
                      <NavLink to={`/vulnerabilities/${item.identifier}`}>
                        {item.identifier}
                      </NavLink>
                    </Td>
                    <Td
                      width={40}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "title" })}
                    >
                      {item.non_normative.title}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "discovered" })}>
                      {formatDate(item.non_normative.discovered)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "released" })}>
                      {formatDate(item.non_normative.released)}
                    </Td>
                    <Td width={15} {...getTdProps({ columnKey: "severity" })}>
                      <SeverityShieldAndText value={item.severity} />
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "cwe" })}>
                      {/* {item.cwe} */}
                      <p style={{ color: "red" }}>issue-281</p>
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
