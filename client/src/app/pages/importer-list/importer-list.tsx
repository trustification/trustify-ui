import React from "react";

import { AxiosError } from "axios";

import {
  Button,
  ButtonVariant,
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

import {
  ConfirmDialog,
  ConfirmDialogProps,
} from "@app/components/ConfirmDialog";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useDeleteIporterMutation,
  useFetchImporterReports,
  useFetchImporters,
  useUpdateImporterMutation,
} from "@app/queries/importers";
import { getAxiosErrorMessage } from "@app/utils/utils";

import { client } from "@app/axios-config/apiInit";
import {
  forceRunImporter,
  Importer,
  ImporterConfiguration,
  SbomImporter,
} from "@app/client";
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

  // Actions that each row can trigger
  type RowAction = "enable" | "disable" | "run" | "delete";
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<Importer | null>(null);

  const prepareActionOnRow = (action: RowAction, row: Importer) => {
    setSelectedRowAction(action);
    setSelectedRow(row);
  };

  // Create/Update mangement
  const [createUpdateModalState, setCreateUpdateModalState] = React.useState<
    "create" | Importer | null
  >(null);
  const isCreateUpdateModalOpen = createUpdateModalState !== null;
  const entityToUpdate =
    createUpdateModalState !== "create" ? createUpdateModalState : null;

  const { importers, isFetching, fetchError, refetch } = useFetchImporters(
    selectedRowAction == "delete" || createUpdateModalState !== null
  );

  const closeCreateUpdateModal = () => {
    setCreateUpdateModalState(null);
    refetch;
  };

  // Enable/Disable Importer

  const onEnableDisableError = (_error: AxiosError) => {
    pushNotification({
      title: "Error while enabling/disabling the Importer",
      variant: "danger",
    });
  };

  const { mutate: updateImporter } = useUpdateImporterMutation(
    () => {},
    onEnableDisableError
  );

  const execEnableDisableImporter = (row: Importer, enable: boolean) => {
    const importerType = Object.keys(row.configuration ?? {})[0];
    const currentConfigValues = (row.configuration as any)[
      importerType
    ] as SbomImporter;

    const newConfigValues: SbomImporter = {
      ...currentConfigValues,
      disabled: !enable,
    };

    const payload = {
      [importerType]: newConfigValues,
    } as ImporterConfiguration;

    updateImporter({
      importerName: row.name,
      configuration: payload,
    });
  };

  // Run Importer

  const onRunImporterSuccess = () => {
    pushNotification({
      title: "Importer scheduled to run as soon as possible",
      variant: "success",
    });
  };

  const onRunImporterError = (error: AxiosError) => {
    pushNotification({
      title: getAxiosErrorMessage(error),
      variant: "danger",
    });
  };

  const execRunImporter = (id: string) => {
    forceRunImporter({ client, path: { name: id }, body: true })
      .then(onRunImporterSuccess)
      .catch(onRunImporterError);
  };

  // Delete importer

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

  const { mutate: execDeleteImporter } = useDeleteIporterMutation(
    onDeleteImporterSuccess,
    onDeleteImporterError
  );

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

  // Dialog confirm config
  let confirmDialogProps: Pick<
    ConfirmDialogProps,
    | "title"
    | "titleIconVariant"
    | "message"
    | "confirmBtnVariant"
    | "confirmBtnLabel"
    | "cancelBtnLabel"
  > | null;
  switch (selectedRowAction) {
    case "enable":
      confirmDialogProps = {
        title: "Enable Importer",
        titleIconVariant: "info",
        message: `Are you sure you want to enable the Importer ${selectedRow?.name}?`,
        confirmBtnVariant: ButtonVariant.primary,
        confirmBtnLabel: "Enable",
        cancelBtnLabel: "Cancel",
      };
      break;
    case "disable":
      confirmDialogProps = {
        title: "Disable Importer",
        titleIconVariant: "info",
        message: `Are you sure you want to disable the Importer ${selectedRow?.name}?`,
        confirmBtnVariant: ButtonVariant.primary,
        confirmBtnLabel: "Disable",
        cancelBtnLabel: "Cancel",
      };
      break;
    case "run":
      confirmDialogProps = {
        title: "Run Importer",
        titleIconVariant: "info",
        message: `Are you sure you want to run the Importer ${selectedRow?.name}?`,
        confirmBtnVariant: ButtonVariant.primary,
        confirmBtnLabel: "Run",
        cancelBtnLabel: "Cancel",
      };
      break;
    case "delete":
      confirmDialogProps = {
        title: "Delete Importer",
        titleIconVariant: "warning",
        message: `Are you sure you want to delete the Importer ${selectedRow?.name}?`,
        confirmBtnVariant: ButtonVariant.danger,
        confirmBtnLabel: "Delete",
        cancelBtnLabel: "Cancel",
      };
      break;
    default:
      confirmDialogProps = null;
      break;
  }

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
                const importerType = Object.keys(item.configuration ?? {})[0];
                const configValues = (item.configuration as any)[
                  importerType
                ] as SbomImporter;
                const isImporterEnabled = configValues?.disabled === false;

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
                          {item.state && isImporterEnabled ? (
                            <ImporterStatusIcon state={item.state} />
                          ) : (
                            <Label color="orange">Disabled</Label>
                          )}
                        </Td>
                        <Td isActionCell>
                          <ActionsColumn
                            items={[
                              ...(isImporterEnabled
                                ? [
                                    {
                                      title: "Run",
                                      onClick: () => {
                                        prepareActionOnRow("run", item);
                                      },
                                    },
                                  ]
                                : []),
                              ...(!isImporterEnabled
                                ? [
                                    {
                                      title: "Enable",
                                      onClick: () => {
                                        prepareActionOnRow("enable", item);
                                      },
                                    },
                                  ]
                                : [
                                    {
                                      title: "Disable",
                                      onClick: () => {
                                        prepareActionOnRow("disable", item);
                                      },
                                    },
                                  ]),
                              {
                                isSeparator: true,
                              },
                              {
                                title: "Edit",
                                onClick: () => setCreateUpdateModalState(item),
                              },
                              {
                                title: "Delete",
                                onClick: () => {
                                  prepareActionOnRow("delete", item);
                                },
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
          importer={entityToUpdate}
          onClose={closeCreateUpdateModal}
        />
      </Modal>

      {selectedRowAction && confirmDialogProps && (
        <ConfirmDialog
          {...confirmDialogProps}
          isOpen={true}
          onCancel={() => setSelectedRowAction(null)}
          onClose={() => setSelectedRowAction(null)}
          onConfirm={() => {
            if (selectedRow) {
              switch (selectedRowAction) {
                case "enable":
                  execEnableDisableImporter(selectedRow, true);
                  break;
                case "disable":
                  execEnableDisableImporter(selectedRow, false);
                  break;
                case "run":
                  execRunImporter(selectedRow.name);
                  break;
                case "delete":
                  execDeleteImporter(selectedRow.name);
                  break;
                default:
                  break;
              }
            }

            setSelectedRow(null);
            setSelectedRowAction(null);
          }}
        />
      )}
    </>
  );
};

interface ImporterExpandedAreaProps {
  importerId: string;
}

export const ImporterExpandedArea: React.FC<ImporterExpandedAreaProps> = ({
  importerId,
}) => {
  const {
    result: { data: importers },
    isFetching,
    fetchError,
  } = useFetchImporterReports(importerId);

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
    // sortableColumns: ["startDate", "endDate"],
    sortableColumns: [],
    getSortValues: (report) => ({
      // startDate: dayjs(report.report.startDate).valueOf(),
      // endDate: dayjs(report.report.endDate).valueOf(),
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
                      {...getTdProps({ columnKey: "startDate" })}
                    >
                      {"formatDateTime(item.report.startDate)"}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "endDate" })}
                    >
                      {"formatDateTime(item.report.endDate)"}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "numberOfItems" })}
                    >
                      {"item.report.numberOfItems"}
                    </Td>
                    <Td
                      width={50}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "error" })}
                    >
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
