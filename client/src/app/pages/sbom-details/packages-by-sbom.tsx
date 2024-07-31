import React from "react";
import { NavLink } from "react-router-dom";

import {
  Checkbox,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
  TextVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
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

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import {
  getHubRequestParams,
  useLocalTableControls,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchPackagesBySbomId } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";
import { PageDrawerContent } from "@app/components/PageDrawerContext";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";

interface PackagesProps {
  sbomId: string;
}

export const PackagesBySbom: React.FC<PackagesProps> = ({ sbomId }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const tableControlState = useTableControlState({
    tableName: "packages-table",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.packages,
    columnNames: {
      name: "Name",
      version: "Version",
      vulnerabilities: "Vulnerabilities",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search by name...",
      },
    ],
    isExpansionEnabled: false,
    // expandableVariant: "single",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackagesBySbomId(
    sbomId,
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
      },
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: packages,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: packages,
      isEqual: (a, b) => a.name === b.name,
    }),
  });

  const {
    numRenderedColumns,
    currentPageItems,
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
          <ToolbarItem>
            <Checkbox
              label="Show only affected packages"
              id="uncontrolled-check-1"
              isChecked
            />
          </ToolbarItem>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="package-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Package table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "vulnerabilities" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
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
                    <Td width={50} {...getTdProps({ columnKey: "name" })}>
                      <a onClick={() => setIsExpanded(true)}>{item.name}</a>
                    </Td>
                    <Td width={20} {...getTdProps({ columnKey: "version" })}>
                      {item.version}
                    </Td>
                    <Td
                      width={30}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    >
                      <VulnerabilityGallery
                        severities={{
                          critical: Math.floor(Math.random() * 10),
                          high: Math.floor(Math.random() * 10),
                          medium: Math.floor(Math.random() * 10),
                          low: Math.floor(Math.random() * 10),
                          none: Math.floor(Math.random() * 10),
                        }}
                      />
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
                {isCellExpanded(item) ? (
                  <Tr isExpanded>
                    <Td colSpan={7}>
                      <div className="pf-v5-u-m-md">
                        <ExpandableRowContent>
                          <PackageExpandedArea purls={item.purl ?? []} />
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
        idPrefix="package-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />

      <PageDrawerContent
        isExpanded={isExpanded}
        onCloseClick={() => setIsExpanded(!isExpanded)}
        pageKey="drawer"
        drawerPanelContentProps={{ defaultSize: "600px" }}
        header={
          <>
            <TextContent>
              <Title headingLevel="h2" size="lg">
                Package Overview
              </Title>
            </TextContent>
          </>
        }
      >
        <Stack hasGutter>
          <StackItem>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  org.aesh/aesh
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Version</DescriptionListTerm>
                <DescriptionListDescription>
                  1.1.1.Final
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Architecture</DescriptionListTerm>
                <DescriptionListDescription>x64</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </StackItem>
          <StackItem>
            <Tabs
              defaultActiveKey={0}
              aria-label="Tabs in the uncontrolled example"
              role="region"
              isBox
            >
              <Tab
                eventKey={0}
                title={<TabTitleText>Affected</TabTitleText>}
                aria-label="Uncontrolled ref content - users"
              >
                <DataList aria-label="Simple data list example" isCompact>
                  <DataListItem aria-labelledby="simple-item1">
                    <DataListItemRow>
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell key="primary content">
                            <Text component={TextVariants.a}>CVE-123456</Text>
                          </DataListCell>,
                          <DataListCell key="secondary content">
                            <SeverityShieldAndText value="high" />
                          </DataListCell>,
                        ]}
                      />
                    </DataListItemRow>
                  </DataListItem>
                  <DataListItem aria-labelledby="simple-item2">
                    <DataListItemRow>
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell key="primary content">
                            <Text component={TextVariants.a}>CVE-98765</Text>
                          </DataListCell>,
                          <DataListCell key="secondary content">
                            <SeverityShieldAndText value="low" />
                          </DataListCell>,
                        ]}
                      />
                    </DataListItemRow>
                  </DataListItem>
                </DataList>
              </Tab>
              <Tab eventKey={1} title={<TabTitleText>Fixed</TabTitleText>}>
                Containers
              </Tab>
            </Tabs>
          </StackItem>
        </Stack>
      </PageDrawerContent>
    </>
  );
};

interface PackageExpandedAreaProps {
  purls: {
    uuid: string;
    purl: string;
  }[];
}

export const PackageExpandedArea: React.FC<PackageExpandedAreaProps> = ({
  purls,
}) => {
  const packages = React.useMemo(() => {
    return purls.map((purl) => {
      return {
        uuid: purl.uuid,
        purl: purl.purl,
        ...decomposePurl(purl.purl),
      };
    });
  }, [purls]);

  const tableControls = useLocalTableControls({
    variant: "compact",
    tableName: "purl-table",
    idProperty: "purl",
    items: packages,
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      version: "Version",
      type: "Type",
      path: "Path",
      qualifiers: "qualifiers",
    },
    isPaginationEnabled: false,
    isSortEnabled: true,
    sortableColumns: [],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search...",
        getItemValue: (item) => {
          return item.purl;
        },
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: { tableProps, getThProps, getTrProps, getTdProps },
  } = tableControls;

  return (
    <>
      <Table {...tableProps} aria-label="Purl table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "namespace" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "type" })} />
              <Th {...getThProps({ columnKey: "path" })} />
              <Th {...getThProps({ columnKey: "qualifiers" })} />
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
              <Tbody key={item.purl}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={20}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "name" })}
                    >
                      <NavLink
                        to={`/packages/${encodeURIComponent(item.purl)}`}
                      >
                        {item.name}
                      </NavLink>
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "namespace" })}
                    >
                      {item.namespace}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item.version}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "type" })}
                    >
                      {item.type}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "path" })}
                    >
                      {item.path}
                    </Td>
                    <Td
                      width={30}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "qualifiers" })}
                    >
                      {item.qualifiers && (
                        <PackageQualifiers value={item.qualifiers} />
                      )}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
    </>
  );
};
