import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
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

import { DecomposedPurl } from "@app/api/models";
import { PurlSummary } from "@app/client";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchPackagesBySbomId } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

interface TableData extends PurlSummary {
  decomposedPurl?: DecomposedPurl;
}

interface PackagesProps {
  sbomId: string;
}

export const PackagesBySbom: React.FC<PackagesProps> = ({ sbomId }) => {
  const {
    result: { data: allPackages },
    isFetching,
    fetchError,
  } = useFetchPackagesBySbomId(sbomId, {
    page: { pageNumber: 1, itemsPerPage: 0 },
  });

  const tableData = useMemo(() => {
    return allPackages
      .flatMap((item) => item.purl)
      .map((item) => {
        const result: TableData = {
          ...item,
          decomposedPurl: decomposePurl(item.purl),
        };
        return result;
      });
  }, [allPackages]);

  const tableControls = useLocalTableControls({
    tableName: "package-table",
    idProperty: "uuid",
    items: tableData,
    isLoading: isFetching,
    columnNames: {
      name: "Name",
      version: "Version",
      qualifiers: "Qualifiers",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["name", "version"],
    getSortValues: (item) => ({
      name: `${item.decomposedPurl?.name}/${item.decomposedPurl?.namespace}`,
      version: item.version.version,
    }),
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Filter",
        getItemValue: (item) => {
          return (
            `${item.decomposedPurl?.name}/${item.decomposedPurl?.namespace}` ||
            ""
          );
        },
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
              <Th {...getThProps({ columnKey: "qualifiers" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={tableData?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.uuid}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={30} {...getTdProps({ columnKey: "name" })}>
                      <Flex>
                        <FlexItem
                          spacer={{ default: "spacerSm" }}
                        >{`${item.decomposedPurl?.name}/${item.decomposedPurl?.namespace}`}</FlexItem>
                        <FlexItem>
                          <Label isCompact color="blue">
                            {item.decomposedPurl?.type}
                          </Label>
                        </FlexItem>
                      </Flex>
                    </Td>
                    <Td width={20} {...getTdProps({ columnKey: "version" })}>
                      {item.decomposedPurl?.version}
                    </Td>
                    <Td width={50} {...getTdProps({ columnKey: "qualifiers" })}>
                      {item.decomposedPurl?.qualifiers && (
                        <PackageQualifiers
                          value={item.decomposedPurl?.qualifiers}
                        />
                      )}
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
                        <DescriptionList
                          columnModifier={{
                            default: "3Col",
                          }}
                        >
                          <DescriptionListGroup>
                            <DescriptionListTerm>Packages</DescriptionListTerm>
                            <DescriptionListDescription>
                              <List>
                                <ListItem>
                                  <Link to={`/packages/${item.uuid}`}>
                                    {item.purl}
                                  </Link>
                                </ListItem>
                              </List>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>
                              Base package
                            </DescriptionListTerm>
                            <DescriptionListDescription>
                              {item.base.purl}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Versions</DescriptionListTerm>
                            <DescriptionListDescription>
                              <List>
                                <ListItem>{item.version.version}</ListItem>
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
