import React from "react";
import { NavLink } from "react-router-dom";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import {
  AdvisoryWithinPackage,
  StatusType,
  Vulnerability,
} from "@app/api/models";
import { getVulnerabilityById } from "@app/api/rest";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
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
import dayjs from "dayjs";

interface TableData {
  vulnerabilityId: string;
  advisory: AdvisoryWithinPackage;
  status: StatusType;
  vulnerability?: Vulnerability;
}

interface VulnerabilitiesByPackageProps {
  packageId: string;
}

export const VulnerabilitiesByPackage: React.FC<
  VulnerabilitiesByPackageProps
> = ({ packageId }) => {
  const { pkg, isFetching, fetchError } = useFetchPackageById(packageId);

  const [allVulnerabilities, setAllVulnerabilities] = React.useState<
    TableData[]
  >([]);
  const [vulnerabilitiesById, setVulnerabilitiesById] = React.useState<
    Map<string, Vulnerability>
  >(new Map());
  const [isFetchingVulnerabilities, setIsFetchingVulnerabilities] =
    React.useState(false);

  const [allAdvisoryStatus, setAllAdvisoryStatus] = React.useState<
    Set<StatusType>
  >(new Set());

  React.useEffect(() => {
    const vulnerabilities: TableData[] = (pkg?.advisories ?? [])
      .flatMap((advisory) => {
        return advisory.status.map((status) => ({
          vulnerabilityId: status.vulnerability.identifier,
          status: status.status,
          advisory: { ...advisory },
        }));
      })
      // TODO remove this reduce once https://github.com/trustification/trustify/issues/477 is fixed
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

    const allUniqueStatus = new Set<StatusType>();
    allUniqueStatus.add("affected"); // Make sure this one always exists
    vulnerabilities.forEach((item) => allUniqueStatus.add(item.status));

    setAllVulnerabilities(vulnerabilities);
    setAllAdvisoryStatus(allUniqueStatus);
    setIsFetchingVulnerabilities(true);

    Promise.all(
      vulnerabilities
        .map((item) => getVulnerabilityById(item.vulnerabilityId))
        .map((vulnerability) => vulnerability.catch(() => null))
    ).then((vulnerabilities) => {
      const validVulnerabilities = vulnerabilities.reduce((prev, current) => {
        if (current) {
          return [...prev, current];
        } else {
          // Filter out error responses
          return prev;
        }
      }, [] as Vulnerability[]);

      const vulnerabilitiesById = new Map<string, Vulnerability>();
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
    isLoading: false,
    columnNames: {
      id: "ID",
      title: "Title",
      severity: "Severity",
      published: "Published",
      modified: "Modified",
      advisory: "Advisory",
    },
    hasActionsColumn: true,
    isSortEnabled: true,
    sortableColumns: ["id", "published", "modified"],
    getSortValues: (item) => ({
      id: item.vulnerabilityId,
      published: item.vulnerability?.published
        ? dayjs(item.vulnerability.published).millisecond()
        : 0,
      modified: item.vulnerability?.published
        ? dayjs(item.vulnerability.modified).millisecond()
        : 0,
    }),
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
        getItemValue: (item) => item.vulnerabilityId,
      },
      {
        categoryKey: "status",
        title: "Status",
        placeholderText: "Status",
        type: FilterType.multiselect,
        selectOptions: Array.from(allAdvisoryStatus).map((item) => ({
          value: item,
          label: item.charAt(0).toUpperCase() + item.slice(1).replace("_", " "),
        })),
        matcher: (filter: string, item: TableData) => item.status === filter,
      },
    ],
    initialFilterValues: {
      status: ["affected"],
    },
    isExpansionEnabled: true,
    expandableVariant: "compound",
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
      getExpandedContentTdProps,
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

      <Table {...tableProps} aria-label="vulnerability table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "id" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "modified" })} />
              <Th {...getThProps({ columnKey: "advisory" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching || isFetchingVulnerabilities}
          isError={!!fetchError}
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
                    <Td width={15} {...getTdProps({ columnKey: "id" })}>
                      <NavLink to={`/vulnerabilities/${item.vulnerabilityId}`}>
                        {item.vulnerabilityId}
                      </NavLink>
                    </Td>
                    <Td
                      width={45}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "title" })}
                    >
                      {item.vulnerability?.title}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "severity" })}>
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
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "modified" })}
                    >
                      {formatDate(item.vulnerability?.modified)}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({
                        columnKey: "advisory",
                        isCompoundExpandToggle: true,
                        item: item,
                        rowIndex,
                      })}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1).replace("_", " ")}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
                {isCellExpanded(item) ? (
                  <Tr isExpanded>
                    <Td
                      {...getExpandedContentTdProps({
                        item,
                      })}
                    >
                      <div className="pf-v5-u-m-md">
                        <ExpandableRowContent>
                          {isCellExpanded(item, "advisory") ? (
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  Identifier
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <NavLink
                                    to={`/advisories/${item.advisory.uuid}`}
                                  >
                                    {item.advisory.identifier}
                                  </NavLink>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                              <DescriptionListGroup>
                                <DescriptionListTerm>Title</DescriptionListTerm>
                                <DescriptionListDescription>
                                  {item.advisory.title}
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  Published
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  {formatDate(item.advisory.published)}
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  Modified
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  {formatDate(item.advisory.modified)}
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          ) : null}
                        </ExpandableRowContent>
                      </div>
                    </Td>
                  </Tr>
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
