import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Td as PFTd,
  Tr as PFTr,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { Severity, VulnerabilityBase } from "@app/api/models";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { RENDER_DATE_FORMAT } from "@app/Constants";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";

interface VulnerabilitiesProps {
  vulnerabilities: VulnerabilityBase[];
}

export const Vulnerabilities: React.FC<VulnerabilitiesProps> = ({
  vulnerabilities,
}) => {
  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "identifier",
    items: vulnerabilities,
    columnNames: {
      vulnerabilityId: "ID",
      title: "Title",
      published: "Published",
      modified: "Modified",
      severity: "Severity",
      cwe: "CWE",
    },
    hasActionsColumn: true,
    isSortEnabled: true,
    sortableColumns: ["vulnerabilityId", "published", "modified"],
    getSortValues: (vuln) => ({
      vulnerabilityId: vuln?.identifier || "",
      published: vuln ? dayjs(vuln.published).millisecond() : 0,
      modified: vuln ? dayjs(vuln.modified).millisecond() : 0,
    }),
    isPaginationEnabled: true,
    initialItemsPerPage: 10,
    isExpansionEnabled: true,
    expandableVariant: "single",
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
    expansionDerivedState: { isCellExpanded },
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
              <Th {...getThProps({ columnKey: "vulnerabilityId" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "modified" })} />
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
                    <Td
                      width={15}
                      {...getTdProps({ columnKey: "vulnerabilityId" })}
                    >
                      <NavLink to={`/vulnerabilities/${item.identifier}`}>
                        {item.identifier}
                      </NavLink>
                    </Td>
                    <Td
                      width={40}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "title" })}
                    >
                      {item.title}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "published" })}>
                      {dayjs(item.published).format(RENDER_DATE_FORMAT)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "modified" })}>
                      {dayjs(item.modified).format(RENDER_DATE_FORMAT)}
                    </Td>
                    <Td width={15} {...getTdProps({ columnKey: "severity" })}>
                      <SeverityShieldAndText value={item.severity} />
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "cwe" })}>
                      {item.cwe}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
                {isCellExpanded(item) ? (
                  <PFTr isExpanded>
                    <PFTd colSpan={7}>
                      <ExpandableRowContent>
                        Some content here
                      </ExpandableRowContent>
                    </PFTd>
                  </PFTr>
                ) : null}
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
