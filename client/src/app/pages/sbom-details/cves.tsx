import React from "react";

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

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchVulnerabilitiesBySbomId } from "@app/queries/vulnerabilities";
import { formatDate } from "@app/utils/utils";

interface CVEsProps {
  sbomId: string;
}

export const CVEs: React.FC<CVEsProps> = ({ sbomId }) => {
  const { cves, isFetching, fetchError } = useFetchVulnerabilitiesBySbomId(sbomId);

  const tableControls = useLocalTableControls({
    tableName: "cves-table",
    idProperty: "identifier",
    items: cves,
    isLoading: isFetching,
    columnNames: {
      id: "ID",
      description: "Description",
      severity: "Severity",
      datePublished: "Date published",
      packages: "Packages",
    },
    isSortEnabled: false,
    isPaginationEnabled: true,
    initialItemsPerPage: 10,
    isExpansionEnabled: true,
    expandableVariant: "single",
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search...",
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
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="cves-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="CVEs table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "id" })} />
              <Th {...getThProps({ columnKey: "description" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "datePublished" })} />
              <Th {...getThProps({ columnKey: "packages" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={cves?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.identifier}>
                <Tr {...getTrProps({ item })}>
                  <Td
                    width={15}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "id" })}
                  >
                    {item.identifier}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "description" })}
                  >
                    {/* {item.description} */}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "severity" })}
                  >
                    {item.average_severity && (
                      <SeverityShieldAndText value={item.average_severity} />
                    )}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "datePublished" })}
                  >
                    {formatDate(item.published)}
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "packages" })}
                  >
                    TODO packages affected
                  </Td>
                </Tr>
                {isCellExpanded(item) ? (
                  <PFTr isExpanded>
                    <PFTd colSpan={7}>
                      <div className="pf-v5-u-m-md">
                        <ExpandableRowContent>
                          TODO: CVE details and package tree details
                        </ExpandableRowContent>
                      </div>
                    </PFTd>
                  </PFTr>
                ) : null}
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="cves-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
