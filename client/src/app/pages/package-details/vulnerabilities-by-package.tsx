import React from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { getSeverityPriority } from "@app/api/model-utils";
import { VulnerabilityStatus } from "@app/api/models";
import { PurlAdvisory, VulnerabilityDetails } from "@app/client";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { VulnerabilityDescription } from "@app/components/VulnerabilityDescription";
import { useVulnerabilitiesOfPackage } from "@app/hooks/domain-controls/useVulnerabilitiesOfPackage";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useWithUiId } from "@app/utils/query-utils";
import { formatDate } from "@app/utils/utils";

interface TableData {
  vulnerabilityId: string;
  advisory: PurlAdvisory;
  status: VulnerabilityStatus;
  vulnerability?: VulnerabilityDetails;
}

interface VulnerabilitiesByPackageProps {
  packageId: string;
}

export const VulnerabilitiesByPackage: React.FC<
  VulnerabilitiesByPackageProps
> = ({ packageId }) => {
  const {
    data: { vulnerabilities, summary },
    isFetching: isFetchingVulnerabilities,
    fetchError: fetchErrorVulnerabilities,
  } = useVulnerabilitiesOfPackage(packageId);

  const affectedVulnerabilities = React.useMemo(() => {
    return vulnerabilities.filter(
      (item) => item.vulnerabilityStatus === "affected"
    );
  }, [vulnerabilities]);

  const tableDataWithUiId = useWithUiId(
    affectedVulnerabilities,
    (d) => `${d.vulnerability.identifier}-${d.vulnerabilityStatus}`
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetchingVulnerabilities,
    columnNames: {
      identifier: "ID",
      description: "Description",
      severity: "CVSS",
      published: "Date published",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["identifier", "severity", "published"],
    getSortValues: (item) => ({
      identifier: item.vulnerability.identifier,
      severity: item.vulnerability?.average_severity
        ? getSeverityPriority(item.vulnerability?.average_severity)
        : 0,
      published: item.vulnerability?.published
        ? dayjs(item.vulnerability?.published).valueOf()
        : 0,
    }),
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
              <Th {...getThProps({ columnKey: "description" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "published" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetchingVulnerabilities}
          isError={!!fetchErrorVulnerabilities}
          isNoData={tableDataWithUiId.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item._ui_unique_id} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={15} {...getTdProps({ columnKey: "identifier" })}>
                      <Link
                        to={`/vulnerabilities/${item.vulnerability.identifier}`}
                      >
                        {item.vulnerability.identifier}
                      </Link>
                    </Td>
                    <Td
                      width={60}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "description" })}
                    >
                      {item.vulnerability && (
                        <VulnerabilityDescription
                          vulnerability={item.vulnerability}
                        />
                      )}
                    </Td>
                    <Td width={15} {...getTdProps({ columnKey: "severity" })}>
                      {item.vulnerability?.average_severity && (
                        <SeverityShieldAndText
                          value={item.vulnerability.average_severity}
                        />
                      )}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "published" })}
                    >
                      {formatDate(item.vulnerability?.published)}
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
