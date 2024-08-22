import React from "react";

import {
  Button,
  ButtonVariant,
  Label,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import {
  Caption,
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { AdvisoryWithinSbom, VulnerabilityStatus } from "@app/api/models";
import { getVulnerabilityById } from "@app/api/rest";
import { AdvisoryInDrawerInfo } from "@app/components/AdvisoryInDrawerInfo";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { PageDrawerContent } from "@app/components/PageDrawerContext";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { VulnerabilityInDrawerInfo } from "@app/components/VulnerabilityInDrawerInfo";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchSBOMById } from "@app/queries/sboms";
import { useWithUiId } from "@app/utils/query-utils";
import {
  getVulnerability,
  SbomPackage,
  VulnerabilityDetails,
} from "@app/client";
import { client } from "@app/axios-config/apiInit";

interface TableData {
  vulnerabilityId: string;
  advisory: AdvisoryWithinSbom;
  status: VulnerabilityStatus;
  context: { cpe: string };
  packages: SbomPackage[];
  vulnerability?: VulnerabilityDetails;
}

interface VulnerabilitiesBySbomProps {
  sbomId: string;
}

export const VulnerabilitiesBySbom: React.FC<VulnerabilitiesBySbomProps> = ({
  sbomId,
}) => {
  type RowAction = "showVulnerability" | "showAdvisory";
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<TableData | null>(null);

  const showDrawer = (action: RowAction, row: TableData) => {
    setSelectedRowAction(action);
    setSelectedRow(row);
  };

  //
  const { sbom, isFetching, fetchError } = useFetchSBOMById(sbomId);

  const [allVulnerabilities, setAllVulnerabilities] = React.useState<
    TableData[]
  >([]);
  const [vulnerabilitiesById, setVulnerabilitiesById] = React.useState<
    Map<string, VulnerabilityDetails>
  >(new Map());
  const [isFetchingVulnerabilities, setIsFetchingVulnerabilities] =
    React.useState(false);

  const [allAdvisoryStatus, setAllAdvisoryStatus] = React.useState<
    Set<VulnerabilityStatus>
  >(new Set());

  React.useEffect(() => {
    const vulnerabilities = (sbom?.advisories ?? [])
      .flatMap((advisory) => {
        return (advisory.status ?? []).map(
          (status) =>
            ({
              vulnerabilityId: status.vulnerability_id,
              status: status.status,
              context: { ...status.context },
              packages: status.packages || [],
              advisory: { ...advisory },
            }) as TableData
        );
      })
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

    const allUniqueStatus = new Set<VulnerabilityStatus>();
    vulnerabilities.forEach((item) => allUniqueStatus.add(item.status));

    setAllVulnerabilities(vulnerabilities);
    setAllAdvisoryStatus(allUniqueStatus);
    setIsFetchingVulnerabilities(true);

    Promise.all(
      vulnerabilities
        .map(
          async (item) =>
            (
              await getVulnerability({
                client,
                path: { id: item.vulnerabilityId },
              })
            ).data
        )
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
  }, [sbom]);

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
      identifier: "Identifier",
      title: "Title",
      severity: "Severity",
      advisory: "Advisory",
      context: "Context",
      status: "Status",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["identifier"],
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search...",
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
    isExpansionEnabled: true,
    expandableVariant: "single",
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

      <Table {...tableProps} aria-label="vulnerability table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "severity" })} />
              <Th {...getThProps({ columnKey: "advisory" })} />
              <Th {...getThProps({ columnKey: "context" })} />
              <Th {...getThProps({ columnKey: "status" })} />
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
                    <Td width={15} {...getTdProps({ columnKey: "identifier" })}>
                      <Button
                        size="sm"
                        variant={ButtonVariant.secondary}
                        onClick={() => showDrawer("showVulnerability", item)}
                      >
                        {item.vulnerabilityId}
                      </Button>
                    </Td>
                    <Td
                      width={35}
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
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "advisory" })}
                    >
                      <Button
                        size="sm"
                        variant={ButtonVariant.secondary}
                        onClick={() => showDrawer("showAdvisory", item)}
                      >
                        {item.advisory.identifier}
                      </Button>
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "context" })}
                    >
                      {item.context.cpe}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "status" })}
                    >
                      <Label>
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1).replace("_", " ")}
                      </Label>
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
                {isCellExpanded(item) ? (
                  <Tr isExpanded>
                    <Td colSpan={7}>
                      <div className="pf-v5-u-m-md">
                        <ExpandableRowContent>
                          <VulnerabilitiesExpandedArea
                            packages={item.packages ?? []}
                          />
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

      <PageDrawerContent
        isExpanded={selectedRowAction !== null}
        onCloseClick={() => setSelectedRowAction(null)}
        pageKey="drawer"
        drawerPanelContentProps={{ defaultSize: "600px" }}
        header={
          <>
            {selectedRowAction === "showVulnerability" && (
              <TextContent>
                <Title headingLevel="h2" size="lg" className={spacing.mtXs}>
                  Vulnerability
                </Title>
              </TextContent>
            )}
            {selectedRowAction === "showAdvisory" && (
              <TextContent>
                <Title headingLevel="h2" size="lg" className={spacing.mtXs}>
                  Advisory
                </Title>
              </TextContent>
            )}
          </>
        }
      >
        {selectedRowAction === "showVulnerability" && (
          <>
            {selectedRow?.vulnerabilityId && (
              <VulnerabilityInDrawerInfo
                vulnerabilityId={selectedRow?.vulnerabilityId}
              />
            )}
          </>
        )}
        {selectedRowAction === "showAdvisory" && (
          <>
            {selectedRow?.advisory && (
              <AdvisoryInDrawerInfo advisoryId={selectedRow?.advisory.uuid} />
            )}
          </>
        )}
      </PageDrawerContent>
    </>
  );
};

interface VulnerabilitiesExpandedAreaProps {
  packages: SbomPackage[];
}

export const VulnerabilitiesExpandedArea: React.FC<
  VulnerabilitiesExpandedAreaProps
> = ({ packages }) => {
  const tableControls = useLocalTableControls({
    variant: "compact",
    tableName: "package-table",
    idProperty: "id",
    items: packages ?? [],
    columnNames: {
      name: "Name",
      version: "Version",
    },
    isPaginationEnabled: true,
    initialItemsPerPage: 5,
    isSortEnabled: true,
    sortableColumns: ["name"],
    getSortValues: (item) => ({
      name: item.name,
    }),
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "name",
        title: "Name",
        type: FilterType.search,
        placeholderText: "Search by name...",
        getItemValue: (item) => item.name || "",
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      tableProps,
      paginationToolbarItemProps,
      paginationProps,
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
              idPrefix="package-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Report table">
        <Caption>Packages</Caption>
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={false}
          isError={undefined}
          isNoData={packages?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.id}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={50}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "name" })}
                    >
                      {item.name}
                    </Td>
                    <Td
                      width={50}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item.version}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="package-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
