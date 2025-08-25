import React from "react";

import type { AxiosError } from "axios";
import dayjs from "dayjs";

import {
  Bullseye,
  Button,
  ButtonVariant,
  Content,
  DataList,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Flex,
  FlexItem,
  Icon,
  Label,
  MenuToggle,
  type MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";

import { ActionsColumn } from "@patternfly/react-table";

import BoxesIcon from "@patternfly/react-icons/dist/esm/icons/boxes-icon";
import CalendarAltIcon from "@patternfly/react-icons/dist/esm/icons/calendar-alt-icon";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import ClockIcon from "@patternfly/react-icons/dist/esm/icons/clock-icon";
import CodeBranchIcon from "@patternfly/react-icons/dist/esm/icons/code-branch-icon";
import FileAltIcon from "@patternfly/react-icons/dist/esm/icons/file-alt-icon";
import InProgressIcon from "@patternfly/react-icons/dist/esm/icons/in-progress-icon";
import InfoCircleIcon from "@patternfly/react-icons/dist/esm/icons/info-circle-icon";
import MinusIcon from "@patternfly/react-icons/dist/esm/icons/minus-icon";
import PendingIcon from "@patternfly/react-icons/dist/esm/icons/pending-icon";
import RunningIcon from "@patternfly/react-icons/dist/esm/icons/running-icon";
import SortAmountDownIcon from "@patternfly/react-icons/dist/esm/icons/sort-amount-down-icon";
import SortAmountUpIcon from "@patternfly/react-icons/dist/esm/icons/sort-amount-up-icon";
import TimesCircleIcon from "@patternfly/react-icons/dist/esm/icons/times-circle-icon";

import {
  ConfirmDialog,
  type ConfirmDialogProps,
} from "@app/components/ConfirmDialog";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useFetchImporters,
  useUpdateImporterMutation,
} from "@app/queries/importers";
import { getAxiosErrorMessage, toCamelCase } from "@app/utils/utils";

import { client } from "@app/axios-config/apiInit";
import {
  type Importer,
  type ImporterConfiguration,
  type SbomImporter,
  forceRunImporter,
} from "@app/client";
import { SimplePagination } from "@app/components/SimplePagination";
import { useLocalTableControls } from "@app/hooks/table-controls";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { ConditionalDataListBody } from "@app/components/DataListControls/ConditionalDataListBody";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useWithUiId } from "@app/utils/query-utils";
import { ImporterAdditionalInfo } from "./components/importer-additional-info";
import { ImporterDetailDrawer } from "./components/importer-detail-drawer";
import { ImporterProgress } from "./components/importer-progress";
import { ReportStatusMessage } from "./components/report-status-message";
import { WatchLastImporterReport } from "./components/watch-last-importer-report";

type ImporterStatus = "disabled" | "scheduled" | "running";

interface ListData {
  importer: Importer;
  type: string;
  configuration: SbomImporter;
  status: ImporterStatus;
}

export const getConfiguration = (importer: Importer) => {
  const type = Object.keys(importer.configuration ?? {})[0];

  // biome-ignore lint/suspicious/noExplicitAny: allowed
  const configuration = (importer.configuration as any)[type] as SbomImporter;

  const status: ImporterStatus =
    configuration?.disabled === true
      ? "disabled"
      : importer.state === "running"
        ? "running"
        : "scheduled";

  return {
    type,
    configuration,
    status,
  };
};

export const ImporterListTable: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);
  const { importers, isFetching, fetchError } = useFetchImporters();

  // Actions that each row can trigger
  type RowAction = "enable" | "disable" | "run";
  const [selectedRow, setSelectedRow] = React.useState<ListData | null>(null);
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);

  const prepareActionOnRow = (action: RowAction, row: ListData) => {
    setSelectedRowAction(action);
    setSelectedRow(row);
  };

  //
  const [viewDetails, setViewDetails] = React.useState<ListData | null>(null);

  //

  const [isSortByOpen, setIsSortByOpen] = React.useState<boolean>(false);

  //

  const tableData = React.useMemo(() => {
    return importers.map((item) => {
      const { configuration, type, status } = getConfiguration(item);

      const result: ListData = {
        importer: item,
        configuration,
        type,
        status,
      };
      return result;
    });
  }, [importers]);

  const tableDataWithUiId = useWithUiId(
    tableData,
    (item) => item.importer.name,
  );

  // Enable/Disable Importer

  const onEnableDisableError = (_error: AxiosError) => {
    pushNotification({
      title: "Error while enabling/disabling the Importer",
      variant: "danger",
    });
  };

  const { mutate: updateImporter } = useUpdateImporterMutation(
    () => {},
    onEnableDisableError,
  );

  const execEnableDisableImporter = (row: ListData, enable: boolean) => {
    const newConfigValues: SbomImporter = {
      ...row.configuration,
      disabled: !enable,
    };

    const payload = {
      [row.type]: newConfigValues,
    } as ImporterConfiguration;

    updateImporter({
      importerName: row.importer.name,
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

  // Table config
  const tableControls = useLocalTableControls({
    tableName: "importers-table",
    persistTo: "urlParams",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.importers,
    idProperty: "_ui_unique_id",
    items: tableDataWithUiId,
    columnNames: {
      name: "Name",
    },
    hasActionsColumn: false,
    isSortEnabled: true,
    sortableColumns: ["name"],
    initialSort: { columnKey: "name", direction: "asc" },
    getSortValues: (item) => ({
      name: item.importer.name,
    }),
    isPaginationEnabled: true,
    isExpansionEnabled: true,
    expandableVariant: "single",
    initialItemsPerPage: 10,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "name",
        title: "Name",
        type: FilterType.search,
        placeholderText: "Search by name...",
        getItemValue: (item) => item.importer.name || "",
      },
      {
        categoryKey: "status",
        title: "Status",
        type: FilterType.multiselect,
        logicOperator: "OR",
        selectOptions: [
          {
            value: "scheduled",
            label: "Scheduled",
          },
          {
            value: "running",
            label: "Running",
          },
          {
            value: "disabled",
            label: "Disabled",
          },
        ],
        placeholderText: "Status",
        matcher: (filter, item) => {
          return filter === item.status;
        },
      },
    ],
  });

  const {
    currentPageItems,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
    expansionDerivedState: { isCellExpanded, setCellExpanded },
    sortableColumns,
    sortState: { activeSort, setActiveSort },
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
        message: `Are you sure you want to enable the Importer ${selectedRow?.importer.name}?`,
        confirmBtnVariant: ButtonVariant.primary,
        confirmBtnLabel: "Enable",
        cancelBtnLabel: "Cancel",
      };
      break;
    case "disable":
      confirmDialogProps = {
        title: "Disable Importer",
        titleIconVariant: "info",
        message: `Are you sure you want to disable the Importer ${selectedRow?.importer.name}?`,
        confirmBtnVariant: ButtonVariant.primary,
        confirmBtnLabel: "Disable",
        cancelBtnLabel: "Cancel",
      };
      break;
    case "run":
      confirmDialogProps = {
        title: "Run Importer",
        titleIconVariant: "info",
        message: `Are you sure you want to run the Importer ${selectedRow?.importer.name}?`,
        confirmBtnVariant: ButtonVariant.primary,
        confirmBtnLabel: "Run",
        cancelBtnLabel: "Cancel",
      };
      break;
    default:
      confirmDialogProps = null;
      break;
  }

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              {activeSort && (
                <Button
                  variant="control"
                  onClick={() => {
                    setActiveSort({
                      columnKey: activeSort.columnKey,
                      direction:
                        activeSort?.direction === "asc" ? "desc" : "asc",
                    });
                  }}
                >
                  {activeSort.direction === "asc" ? (
                    <SortAmountDownIcon />
                  ) : (
                    <SortAmountUpIcon />
                  )}
                </Button>
              )}
            </ToolbarItem>
            <ToolbarItem>
              <Select
                id="sort-by"
                isOpen={isSortByOpen}
                selected={activeSort?.columnKey}
                onSelect={(_e, value) => {
                  setActiveSort({
                    // biome-ignore lint/suspicious/noExplicitAny: allowed
                    columnKey: value as any,
                    direction: activeSort?.direction ?? "asc",
                  });
                }}
                onOpenChange={(isOpen) => setIsSortByOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsSortByOpen(!isSortByOpen)}
                    isExpanded={isSortByOpen}
                    style={
                      {
                        width: "200px",
                      } as React.CSSProperties
                    }
                  >
                    {toCamelCase(activeSort?.columnKey ?? "")}
                  </MenuToggle>
                )}
                shouldFocusToggleOnSelect
              >
                <SelectList>
                  {sortableColumns?.map((e) => (
                    <SelectOption key={e} value={e}>
                      {toCamelCase(activeSort?.columnKey ?? "")}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="importer-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <DataList
        aria-label="Importer table"
        selectedDataListItemId={viewDetails?.importer.name}
      >
        <ConditionalDataListBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={importers.length === 0}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <WatchLastImporterReport
                key={item._ui_unique_id}
                importer={item.importer}
              >
                {({ reports, isFetching, fetchError }) => {
                  const lastReport = reports[0] ? reports[0] : null;

                  let mainIcon = (
                    <Icon size="xl">
                      <MinusIcon />
                    </Icon>
                  );
                  if (item.status === "running") {
                    mainIcon = (
                      <Flex direction={{ default: "column" }}>
                        <FlexItem>
                          <Icon size="xl" status="info">
                            <InProgressIcon />
                          </Icon>
                        </FlexItem>
                        <FlexItem>
                          <Bullseye>...</Bullseye>
                        </FlexItem>
                      </Flex>
                    );
                  } else if (lastReport) {
                    mainIcon = (
                      <ReportStatusMessage
                        description={lastReport.error ?? ""}
                        messages={lastReport.report?.messages ?? null}
                      >
                        {({ toggleLogModal }) => {
                          return lastReport.error ? (
                            <Button
                              isInline
                              variant="link"
                              onClick={toggleLogModal}
                            >
                              <Flex direction={{ default: "column" }}>
                                <FlexItem>
                                  <Icon size="xl" status="danger">
                                    <TimesCircleIcon />
                                  </Icon>
                                </FlexItem>
                                <FlexItem>Log</FlexItem>
                              </Flex>
                            </Button>
                          ) : (
                            <Flex direction={{ default: "column" }}>
                              <FlexItem>
                                <Icon size="xl" status="success">
                                  <CheckCircleIcon />
                                </Icon>
                              </FlexItem>
                              <FlexItem>OK</FlexItem>
                            </Flex>
                          );
                        }}
                      </ReportStatusMessage>
                    );
                  } else if (item.status === "scheduled") {
                    mainIcon = (
                      <Icon size="xl" status="info">
                        <PendingIcon />
                      </Icon>
                    );
                  }

                  //

                  let lastStatusComponent = null;

                  let duration: number | undefined;
                  if (
                    lastReport?.report?.startDate &&
                    lastReport?.report?.endDate
                  ) {
                    const fromDate = dayjs(lastReport.report.startDate);
                    const toDate = dayjs(lastReport.report.endDate);
                    duration = toDate.diff(fromDate);
                  }

                  const numberDocuments =
                    item.status === "running"
                      ? item.importer.progress?.total
                      : lastReport?.report?.numberOfItems;

                  lastStatusComponent = (
                    <Flex direction={{ default: "column" }}>
                      <FlexItem>
                        <Flex spaceItems={{ default: "spaceItemsSm" }}>
                          <FlexItem>
                            <Tooltip content={<div>Completed</div>}>
                              <span>
                                <CalendarAltIcon />{" "}
                                {lastReport?.report?.endDate
                                  ? dayjs(lastReport.report.endDate).fromNow()
                                  : "-"}
                              </span>
                            </Tooltip>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: "spaceItemsSm" }}>
                          <FlexItem>
                            <Tooltip content={<div>Duration</div>}>
                              <span>
                                <ClockIcon />{" "}
                                {duration
                                  ? dayjs.duration(duration).humanize()
                                  : "-"}
                              </span>
                            </Tooltip>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: "spaceItemsSm" }}>
                          <FlexItem>
                            <Tooltip content={<div>Documents ingested</div>}>
                              <span>
                                <FileAltIcon /> {numberDocuments} documents
                              </span>
                            </Tooltip>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  );

                  let currentStatus = null;
                  switch (item.status) {
                    case "running":
                      {
                        const timeRemaining = item.importer.progress
                          ?.estimatedSecondsRemaining
                          ? item.importer.progress?.estimatedSecondsRemaining *
                            1000
                          : undefined;
                        currentStatus = item.importer.progress ? (
                          <ImporterProgress
                            value={item.importer.progress}
                            timeRemaining={timeRemaining}
                          />
                        ) : null;
                      }
                      break;
                    case "scheduled":
                      currentStatus = (
                        <Flex spaceItems={{ default: "spaceItemsSm" }}>
                          <FlexItem>
                            <PendingIcon /> Scheduled
                          </FlexItem>
                        </Flex>
                      );
                      break;
                    case "disabled":
                      currentStatus = <Label color="yellow">Disabled</Label>;
                      break;
                    default:
                      break;
                  }

                  return (
                    <LoadingWrapper
                      isFetching={isFetching}
                      fetchError={fetchError}
                      isFetchingState={
                        <DataListItem>
                          <DataListItemRow>
                            <DataListItemCells
                              dataListCells={[...Array(5).keys()].map(
                                (element) => (
                                  <DataListCell key={element}>
                                    <Skeleton />
                                  </DataListCell>
                                ),
                              )}
                            />
                          </DataListItemRow>
                        </DataListItem>
                      }
                      fetchErrorState={(error) => (
                        <DataListItem>
                          <DataListItemRow>
                            <DataListItemCells
                              dataListCells={[
                                <DataListCell key="error">
                                  <Flex>
                                    <FlexItem>
                                      <Icon size="md" status="danger">
                                        <InfoCircleIcon />
                                      </Icon>
                                    </FlexItem>
                                    <FlexItem>
                                      <Content>Error {error.code}</Content>
                                    </FlexItem>
                                    <FlexItem>
                                      There was an error retrieving data. Check
                                      your connection and try again.
                                    </FlexItem>
                                  </Flex>
                                </DataListCell>,
                              ]}
                            />
                          </DataListItemRow>
                        </DataListItem>
                      )}
                    >
                      <DataListItem
                        id={item.importer.name}
                        isExpanded={isCellExpanded(item)}
                      >
                        <DataListItemRow>
                          <DataListToggle
                            id={`toggle-${item.importer.name}`}
                            aria-label={`toggle-${rowIndex}`}
                            onClick={() => {
                              setCellExpanded({
                                item,
                                isExpanding: !isCellExpanded(item),
                              });
                            }}
                            isExpanded={isCellExpanded(item)}
                          />
                          <DataListItemCells
                            dataListCells={[
                              <DataListCell key="icon" isIcon>
                                {mainIcon}
                              </DataListCell>,
                              <DataListCell
                                key="info"
                                wrapModifier="breakWord"
                                width={2}
                              >
                                <Flex direction={{ default: "column" }}>
                                  <FlexItem>
                                    <Content component="p">
                                      {item.importer.name}
                                    </Content>
                                  </FlexItem>
                                  <FlexItem>
                                    <Content component="dd">
                                      <Flex
                                        spaceItems={{
                                          default: "spaceItemsSm",
                                        }}
                                      >
                                        <FlexItem>
                                          <CodeBranchIcon />{" "}
                                          {item.configuration.source}
                                        </FlexItem>
                                      </Flex>
                                    </Content>
                                  </FlexItem>
                                  <FlexItem>
                                    <Flex
                                      spaceItems={{
                                        default: "spaceItemsSm",
                                      }}
                                    >
                                      <FlexItem>
                                        <BoxesIcon /> {item.type}
                                      </FlexItem>
                                    </Flex>
                                  </FlexItem>
                                </Flex>
                              </DataListCell>,
                              <DataListCell
                                key="description"
                                wrapModifier="breakWord"
                              >
                                <Flex direction={{ default: "column" }}>
                                  <FlexItem>
                                    <Content component="p">
                                      {item.configuration.description}
                                    </Content>
                                  </FlexItem>
                                </Flex>
                              </DataListCell>,
                              <DataListCell key="status" alignRight>
                                {lastStatusComponent}
                              </DataListCell>,
                              <DataListCell key="progress" alignRight>
                                <Flex direction={{ default: "column" }}>
                                  <FlexItem>
                                    <Tooltip
                                      content={<div>Execution frecuency</div>}
                                    >
                                      <span>
                                        <RunningIcon />{" "}
                                        {item.configuration.period}
                                      </span>
                                    </Tooltip>
                                  </FlexItem>
                                  <FlexItem>{currentStatus}</FlexItem>
                                </Flex>
                              </DataListCell>,
                            ]}
                          />
                          <DataListAction
                            id="row-actions"
                            aria-labelledby="row-actions"
                            aria-label="Row actions"
                          >
                            <Button
                              variant="secondary"
                              onClick={() => setViewDetails(item)}
                            >
                              Executions
                            </Button>
                          </DataListAction>
                          <DataListAction
                            id="actions"
                            aria-label="Actions"
                            aria-labelledby="actions"
                          >
                            <ActionsColumn
                              items={[
                                ...(item.status === "disabled"
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
                                        title: "Run",
                                        onClick: () => {
                                          prepareActionOnRow("run", item);
                                        },
                                        isDisabled: item.status === "running",
                                      },
                                      {
                                        title: "Disable",
                                        onClick: () => {
                                          prepareActionOnRow("disable", item);
                                        },
                                      },
                                    ]),
                              ]}
                            />
                          </DataListAction>
                        </DataListItemRow>
                        <DataListContent
                          aria-label={`expanded-area-${rowIndex}`}
                          isHidden={!isCellExpanded(item)}
                        >
                          <ImporterAdditionalInfo importer={item.importer} />
                        </DataListContent>
                      </DataListItem>
                    </LoadingWrapper>
                  );
                }}
              </WatchLastImporterReport>
            );
          })}
        </ConditionalDataListBody>
      </DataList>

      <SimplePagination
        idPrefix="importer-table"
        isTop={false}
        paginationProps={paginationProps}
      />

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
                  execRunImporter(selectedRow.importer.name);
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

      <ImporterDetailDrawer
        allImporters={importers}
        importer={viewDetails?.importer ?? null}
        onCloseClick={() => setViewDetails(null)}
      />
    </>
  );
};
