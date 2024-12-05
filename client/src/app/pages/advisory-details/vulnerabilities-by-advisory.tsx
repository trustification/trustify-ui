import React from "react";
import { Link } from "react-router-dom";

import { AxiosError } from "axios";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { AdvisoryVulnerabilitySummary } from "@app/client";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { formatDate } from "@app/utils/utils";

interface VulnerabilitiesByAdvisoryProps {
  isFetching: boolean;
  fetchError?: AxiosError;
  vulnerabilities: AdvisoryVulnerabilitySummary[];
}

export const VulnerabilitiesByAdvisory: React.FC<
  VulnerabilitiesByAdvisoryProps
> = ({ isFetching, fetchError, vulnerabilities }) => {
  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "identifier",
    items: vulnerabilities,
    isLoading: isFetching,
    columnNames: {
      identifier: "ID",
      title: "Title",
      discovery: "Discovery",
      release: "Release",
      score: "Score",
      cwe: "Score",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: [],
    getSortValues: (item) => ({}),
    isPaginationEnabled: true,
    isFilterEnabled: false,
    filterCategories: [],
    isExpansionEnabled: false,
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
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "discovery" })} />
              <Th {...getThProps({ columnKey: "release" })} />
              <Th {...getThProps({ columnKey: "score" })} />
              <Th {...getThProps({ columnKey: "cwe" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={vulnerabilities.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.identifier} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={15} {...getTdProps({ columnKey: "identifier" })}>
                      <Link to={`/vulnerabilities/${item.identifier}`}>
                        {item.identifier}
                      </Link>
                    </Td>
                    <Td
                      width={40}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "title" })}
                    >
                      <VulnerabilityDescription vulnerability={item} />
                    </Td>
                    <Td width={15} {...getTdProps({ columnKey: "discovery" })}>
                      {formatDate(item.discovered)}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "release" })}
                    >
                      {formatDate(item.released)}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "score" })}
                    >
                      {item.severity && (
                        <SeverityShieldAndText value={item.severity} />
                      )}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "cwe" })}
                    >
                      {item.cwes.join(", ")}
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
