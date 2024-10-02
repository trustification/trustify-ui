import React from "react";

import {
  Button,
  ButtonVariant,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { SbomSummary } from "@app/client";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { PageDrawerContent } from "@app/components/PageDrawerContext";
import { SbomInDrawerInfo } from "@app/components/SbomInDrawerInfo";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
} from "@app/components/TableControls";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchSbomsByPackageId } from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";

interface SbomsByPackageProps {
  packageId: string;
}

export const SbomsByPackage: React.FC<SbomsByPackageProps> = ({
  packageId,
}) => {
  type RowAction = "showSbom";
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<SbomSummary | null>(
    null
  );

  const showDrawer = (action: RowAction, row: SbomSummary) => {
    setSelectedRowAction(action);
    setSelectedRow(row);
  };

  //
  const tableControlState = useTableControlState({
    tableName: "sboms",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms_by_package,
    columnNames: {
      name: "Name",
      published: "Published",
      labels: "Labels",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: [],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
    ],
  });

  const {
    result: { data: sboms, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchSbomsByPackageId(
    packageId,
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {},
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: sboms,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: sboms,
      isEqual: (a, b) => a.id === b.id,
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
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="sbom-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="SBOM table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "labels" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalItemCount === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item) => {
            return (
              <Tbody key={item.id}>
                <Tr {...getTrProps({ item })}>
                  <Td width={35} {...getTdProps({ columnKey: "name" })}>
                    <Button
                      size="sm"
                      variant={ButtonVariant.secondary}
                      onClick={() => showDrawer("showSbom", item)}
                    >
                      {item.name}
                    </Button>
                  </Td>
                  <Td
                    width={10}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "published" })}
                  >
                    {formatDate(item.published)}
                  </Td>
                  <Td
                    width={35}
                    modifier="truncate"
                    {...getTdProps({ columnKey: "labels" })}
                  >
                    {item.labels && <LabelsAsList value={item.labels} />}
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="sboms-table"
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
            {selectedRowAction === "showSbom" && (
              <TextContent>
                <Title headingLevel="h2" size="lg" className={spacing.mtXs}>
                  Advisory
                </Title>
              </TextContent>
            )}
          </>
        }
      >
        {selectedRowAction === "showSbom" && (
          <>{selectedRow && <SbomInDrawerInfo sbomId={selectedRow.id} />}</>
        )}
      </PageDrawerContent>
    </>
  );
};
