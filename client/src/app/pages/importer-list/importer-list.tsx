import React from "react";

import { AxiosError } from "axios";

import {
  Button,
  ButtonVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  ActionsColumn,
  Caption,
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import dayjs from "dayjs";

import { Importer, ImporterType } from "@app/api/models";
import { ConfirmDialog } from "@app/components/ConfirmDialog";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useDeleteiIporterMutation as useDeleteIporterMutation,
  useFetchImporterReports,
  useFetchImporters,
} from "@app/queries/importers";
import {
  formatDate,
  formatDateTime,
  getAxiosErrorMessage,
} from "@app/utils/utils";

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";

import { ImporterForm } from "./components/importer-form";
import { ImporterStatusIcon } from "./components/importer-status-icon";

export const ImporterList: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    React.useState<boolean>(false);
  const [importerToDelete, setImporterToDelete] = React.useState<Importer>();

  const [createUpdateModalState, setCreateUpdateModalState] = React.useState<
    "create" | Importer | null
  >(null);
  const isCreateUpdateModalOpen = createUpdateModalState !== null;
  const entityToUpdate =
    createUpdateModalState !== "create" ? createUpdateModalState : null;

  const onDeleteImporterSuccess = () => {
    pushNotification({
      title: "Importer deleted",
      variant: "success",
    });
  };

  const onDeleteImporterError = (error: AxiosError) => {
    pushNotification({
      title: getAxiosErrorMessage(error),
      variant: "danger",
    });
  };

  const { importers, isFetching, fetchError, refetch } = useFetchImporters(
    isDeleteConfirmDialogOpen || createUpdateModalState !== null
  );

  const { mutate: deleteImporter } = useDeleteIporterMutation(
    onDeleteImporterSuccess,
    onDeleteImporterError
  );

  const closeCreateUpdateModal = () => {
    setCreateUpdateModalState(null);
    refetch;
  };

  // Table config
  const tableControls = useLocalTableControls({
    tableName: "importers-table",
    idProperty: "name",
    items: importers,
    columnNames: {
      name: "Name",
      type: "Type",
      description: "Description",
      source: "Source",
      period: "Period",
      state: "State",
    },
    hasActionsColumn: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    getSortValues: (item) => ({
      name: item.name,
    }),
    isPaginationEnabled: true,
    isExpansionEnabled: true,
    expandableVariant: "single",
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

  const deleteRow = (row: Importer) => {
    setImporterToDelete(row);
    setIsDeleteConfirmDialogOpen(true);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Importers</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <Toolbar {...toolbarProps}>
            <ToolbarContent>
              <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
              <ToolbarItem>
                <Button
                  type="button"
                  id="create-importer"
                  aria-label="Create new importer"
                  variant={ButtonVariant.primary}
                  onClick={() => setCreateUpdateModalState("create")}
                >
                  Create Importer
                </Button>
              </ToolbarItem>
              <ToolbarItem {...paginationToolbarItemProps}>
                <SimplePagination
                  idPrefix="importer-table"
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
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "type" })} />
                  <Th {...getThProps({ columnKey: "description" })} />
                  <Th {...getThProps({ columnKey: "source" })} />
                  <Th {...getThProps({ columnKey: "period" })} />
                  <Th {...getThProps({ columnKey: "state" })} />
                </TableHeaderContentWithControls>
              </Tr>
            </Thead>
            <ConditionalTableBody
              isLoading={isFetching}
              isError={!!fetchError}
              isNoData={importers.length === 0}
              numRenderedColumns={numRenderedColumns}
            >
              {currentPageItems?.map((item, rowIndex) => {
                const importerType = Object.keys(
                  item.configuration ?? {}
                )[0] as ImporterType;
                const configValues = item.configuration[importerType];

                return (
                  <Tbody key={item.name}>
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td
                          width={15}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "name" })}
                        >
                          {item.name}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "type" })}
                        >
                          {importerType}
                        </Td>
                        <Td
                          width={25}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "description" })}
                        >
                          {configValues?.description}
                        </Td>
                        <Td
                          width={30}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "source" })}
                        >
                          {configValues?.source}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "period" })}
                        >
                          {configValues?.period}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "state" })}
                        >
                          {item.state && configValues?.disabled == false ? (
                            <ImporterStatusIcon state={item.state} />
                          ) : (
                            <Label color="orange">Disabled</Label>
                          )}
                        </Td>
                        <Td isActionCell>
                          <ActionsColumn
                            items={[
                              {
                                title: "Edit",
                                onClick: () => setCreateUpdateModalState(item),
                              },
                              {
                                title: "Delete",
                                onClick: () => deleteRow(item),
                              },
                            ]}
                          />
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <Tr isExpanded>
                        <Td colSpan={7}>
                          <div className="pf-v5-u-m-md">
                            <ExpandableRowContent>
                              <ImporterExpandedArea importerId={item.name} />
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
            idPrefix="importer-table"
            isTop={false}
            isCompact
            paginationProps={paginationProps}
          />
        </div>
      </PageSection>

      <Modal
        id="create-edit-importer-modal"
        title={entityToUpdate ? "Update Importer" : "New Importer"}
        variant={ModalVariant.medium}
        isOpen={isCreateUpdateModalOpen}
        onClose={closeCreateUpdateModal}
      >
        <ImporterForm
          importer={entityToUpdate ? entityToUpdate : undefined}
          onClose={closeCreateUpdateModal}
        />
      </Modal>

      {isDeleteConfirmDialogOpen && (
        <ConfirmDialog
          title="Delete Importer"
          isOpen={true}
          titleIconVariant={"warning"}
          message={`Are you sure you want to delete the Importer ${importerToDelete?.name}?`}
          confirmBtnVariant={ButtonVariant.danger}
          confirmBtnLabel="Delete"
          cancelBtnLabel="Cancel"
          onCancel={() => setIsDeleteConfirmDialogOpen(false)}
          onClose={() => setIsDeleteConfirmDialogOpen(false)}
          onConfirm={() => {
            if (importerToDelete) {
              deleteImporter(importerToDelete.name);
              setImporterToDelete(undefined);
            }
            setIsDeleteConfirmDialogOpen(false);
          }}
        />
      )}
    </>
  );
};


interface ImporterExpandedAreaProps {
  importerId: string;
}

export const ImporterExpandedArea: React.FC<ImporterExpandedAreaProps> = ({ importerId }) => {
  const { importers, isFetching, fetchError } = useFetchImporterReports(importerId);

  const tableControls = useLocalTableControls({
    variant: "compact",
    tableName: "report-table",
    idProperty: "id",
    items: importers,
    columnNames: {
      startDate: "Start date",
      endDate: "End date",
      numberOfItems: "Number of items",
      error: "Error",
    },
    isPaginationEnabled: true,
    initialItemsPerPage: 5,
    isSortEnabled: true,
    sortableColumns: ["startDate", "endDate"],
    getSortValues: (report) => ({
      startDate: dayjs(report.report.startDate).millisecond(),
      endDate: dayjs(report.report.startDate).millisecond(),
    }),
    isFilterEnabled: false,
    isExpansionEnabled: false,
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
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
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="report-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Report table">
        <Caption>Importer reports</Caption>
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "startDate" })} />
              <Th {...getThProps({ columnKey: "endDate" })} />
              <Th {...getThProps({ columnKey: "numberOfItems" })} />
              <Th {...getThProps({ columnKey: "error" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={importers?.length === 0}
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
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "startDate" })}>
                      {formatDateTime(item.report.startDate)}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "endDate" })}>
                      {formatDateTime(item.report.endDate)}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "numberOfItems" })}>
                      {item.report.numberOfItems}
                    </Td>
                    <Td
                      width={50}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "error" })}>
                      {item.error}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="report-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};