import React from "react";
import { NavLink } from "react-router-dom";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Table,
  TableProps,
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
import {
  getHubRequestParams,
  useLocalTableControls,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchPackagesBySbomId } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

interface PackagesProps {
  variant?: TableProps["variant"];
  sbomId: string;
}

export const PackagesBySbom: React.FC<PackagesProps> = ({
  variant,
  sbomId,
}) => {
  const tableControlState = useTableControlState({
    tableName: "packages-table",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.packages,
    columnNames: {
      name: "Name",
      version: "Version",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: [],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search...",
      },
    ],
    isExpansionEnabled: true,
    expandableVariant: "single",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackagesBySbomId(
    sbomId,
    getHubRequestParams({
      ...tableControlState,
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
                    <Td width={60} {...getTdProps({ columnKey: "name" })}>
                      {item.name}
                    </Td>
                    <Td width={40} {...getTdProps({ columnKey: "version" })}>
                      {item.version}
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
                      <NavLink to={`/packages/${item.uuid}`}>
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
