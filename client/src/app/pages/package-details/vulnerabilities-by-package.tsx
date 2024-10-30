import React from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { getSeverityPriority } from "@app/api/model-utils";
import { VulnerabilityStatus } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  getVulnerability,
  PurlAdvisory,
  VulnerabilityDetails,
} from "@app/client";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchPackageById } from "@app/queries/packages";
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
    pkg,
    isFetching: isFetchingPackage,
    fetchError: fetchErrorPackage,
  } = useFetchPackageById(packageId);

  const [allVulnerabilities, setAllVulnerabilities] = React.useState<
    TableData[]
  >([]);
  const [vulnerabilitiesById, setVulnerabilitiesById] = React.useState<
    Map<string, VulnerabilityDetails>
  >(new Map());
  const [isFetchingVulnerabilities, setIsFetchingVulnerabilities] =
    React.useState(false);

  React.useEffect(() => {
    const vulnerabilities: TableData[] = (pkg?.advisories ?? [])
      .flatMap((advisory) => {
        return advisory.status.map((status) => {
          const result: TableData = {
            vulnerabilityId: status.vulnerability.identifier,
            status: status.status as VulnerabilityStatus,
            advisory: advisory,
          };
          return result;
        });
      })
      // Take only "affected"
      .filter((item) => item.status === "affected")
      // Remove dupplicates if exists
      .reduce((prev, current) => {
        const exists = prev.find(
          (item) =>
            item.vulnerabilityId === current.vulnerabilityId &&
            item.advisory.uuid === current.advisory.uuid
        );
        if (!exists) {
          return [...prev, current];
        } else {
          return prev;
        }
      }, [] as TableData[]);

    setAllVulnerabilities(vulnerabilities);
    setIsFetchingVulnerabilities(true);

    Promise.all(
      vulnerabilities
        .map(async (item) => {
          const response = await getVulnerability({
            client,
            path: { id: item.vulnerabilityId },
          });
          return response.data;
        })
        .map((vulnerability) => vulnerability.catch(() => null))
    ).then((vulnerabilities) => {
      const validVulnerabilities = vulnerabilities.reduce((prev, current) => {
        if (current) {
          return [...prev, current];
        } else {
          // Filter out error responses
          return prev;
        }
      }, [] as VulnerabilityDetails[]);

      const vulnerabilitiesById = new Map<string, VulnerabilityDetails>();
      validVulnerabilities.forEach((vulnerability) =>
        vulnerabilitiesById.set(vulnerability.identifier, vulnerability)
      );

      setVulnerabilitiesById(vulnerabilitiesById);
      setIsFetchingVulnerabilities(false);
    });
  }, [pkg]);

  const tableData = React.useMemo(() => {
    return allVulnerabilities.map((item) => {
      const result: TableData = {
        ...item,
        vulnerability: vulnerabilitiesById.get(item.vulnerabilityId),
      };
      return result;
    });
  }, [allVulnerabilities, vulnerabilitiesById]);

  const tableDataWithUiId = useWithUiId(
    tableData,
    (d) => `${d.vulnerabilityId}-${d.advisory.identifier}-${d.advisory.uuid}`
  );

  const tableControls = useLocalTableControls({
    tableName: "vulnerability-table",
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    isLoading: isFetchingPackage || isFetchingVulnerabilities,
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
      identifier: item.vulnerabilityId,
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
          isLoading={isFetchingPackage || isFetchingVulnerabilities}
          isError={!!fetchErrorPackage}
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
                      <Link to={`/vulnerabilities/${item.vulnerabilityId}`}>
                        {item.vulnerabilityId}
                      </Link>
                    </Td>
                    <Td
                      width={60}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "description" })}
                    >
                      {item.vulnerability?.title ||
                        item.vulnerability?.description}
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
