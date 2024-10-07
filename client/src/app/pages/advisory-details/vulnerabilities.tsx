import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import {
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { AdvisoryVulnerabilityHead } from "@app/client";
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
  enableToolbar?: boolean;
  variant?: TableProps["variant"];
  vulnerabilities: AdvisoryVulnerabilityHead[];
}

export const Vulnerabilities: React.FC<VulnerabilitiesProps> = ({
  enableToolbar,
  variant,
  vulnerabilities,
}) => {
  const tableControls = useLocalTableControls({
    variant: variant,
    tableName: "vulnerability-table",
    idProperty: "identifier",
    items: vulnerabilities,
    columnNames: {
      identifier: "Name",
      title: "Description",
      severity: "CVSS",
      discovered: "Discovered",
      released: "Released",
      cwe: "CWE",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["identifier", "discovered", "released"],
    getSortValues: (vuln) => ({
      identifier: vuln?.identifier || "",
      discovered: vuln.discovered ? dayjs(vuln.discovered).valueOf() : 0,
      released: vuln.released ? dayjs(vuln.released).valueOf() : 0,
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
      {enableToolbar && (
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
      )}

      <Table {...tableProps} aria-label="Vulnerability table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "discovered" })} />
              <Th {...getThProps({ columnKey: "released" })} />
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
                      {item.title || item.description}
                    </Td>
                    <Td width={15} {...getTdProps({ columnKey: "severity" })}>
                      <SeverityShieldAndText value={item.severity} />
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "discovered" })}>
                      {formatDate(item.discovered)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "released" })}>
                      {formatDate(item.released)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "cwe" })}>
                      {"item.cwe"}
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
