import type React from "react";
import { Link } from "react-router-dom";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchPackagesBySbomId } from "@app/queries/packages";

interface PackagesProps {
  sbomId: string;
}

export const PackagesBySbom: React.FC<PackagesProps> = ({ sbomId }) => {
  const tableControlState = useTableControlState({
    tableName: "package-table",
    columnNames: {
      name: "Name",
      version: "Version",
    },
    isSortEnabled: true,
    sortableColumns: ["name"],
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
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
      hubSortFieldKeys: {
        name: "name",
      },
    }),
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: packages,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: packages,
      isEqual: (a, b) => a.id === b.id,
    }),
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
          isNoData={totalItemCount === 0}
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
                    <Td width={80} {...getTdProps({ columnKey: "name" })}>
                      {[item.name, item.group].filter(Boolean).join("/")}
                    </Td>
                    <Td width={20} {...getTdProps({ columnKey: "version" })}>
                      {item?.version}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
                {isCellExpanded(item) ? (
                  <Tr isExpanded>
                    <Td />
                    <Td
                      {...getExpandedContentTdProps({
                        item,
                      })}
                      className={spacing.pyLg}
                    >
                      <ExpandableRowContent>
                        <DescriptionList>
                          <DescriptionListGroup>
                            <DescriptionListTerm>
                              External identifier
                            </DescriptionListTerm>
                            <DescriptionListDescription>
                              <List>
                                {item.purl.map((item) => (
                                  <ListItem key={item.uuid}>
                                    <Link to={`/packages/${item.uuid}`}>
                                      {item.purl}
                                    </Link>
                                  </ListItem>
                                ))}
                              </List>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </ExpandableRowContent>
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
