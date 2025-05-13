import React from "react";

import dayjs from "dayjs";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";
import {
  Caption,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { useFetchImporterReports } from "@app/queries/importers";
import { formatDateTime } from "@app/utils/utils";

import type { Importer, Message } from "@app/client";
import { IconedStatus } from "@app/components/IconedStatus";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";

import { ANSICOLOR } from "@app/Constants";

import { ImporterStatusIcon } from "./importer-status-icon";

const messagesToLogData = (messages: {
  [key: string]: {
    [key: string]: Array<Message>;
  };
}) => {
  return Object.entries(messages).map(([groupKey, value]) => {
    return Object.entries(value)
      .map(([objectKey, objectValue]) => {
        return {
          title: `${groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}: "${objectKey}"`,
          body: objectValue
            .map((item) => {
              let color: string | null = null;
              switch (item.severity) {
                case "none":
                  color = ANSICOLOR.green;
                  break;
                case "low":
                  color = ANSICOLOR.cyan;
                  break;
                case "medium":
                  color = ANSICOLOR.yellow;
                  break;
                case "high":
                  color = ANSICOLOR.lightBlue;
                  break;
                case "critical":
                  color = ANSICOLOR.red;
                  break;
                default:
                  break;
              }
              return `${color ?? ""}${item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}: ${ANSICOLOR.defaultForegroundColorAtStartup} ${item.message}`;
            })
            .join(ANSICOLOR.endLine),
        };
      })
      .map((item) => {
        return `${ANSICOLOR.underline}${item.title}${ANSICOLOR.reset}${ANSICOLOR.endLine}${item.body}`;
      })
      .join(`${ANSICOLOR.endLine}${ANSICOLOR.endLine}`);
  });
};

interface TableReportData {
  isRunning: boolean;
  id: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  numberOfItems?: number;
  error?: string;
  messages?: {
    [key: string]: {
      [key: string]: Array<Message>;
    };
  };
}

interface IImporterExecutionsProps {
  importer: Importer;
}

export const ImporterExecutions: React.FC<IImporterExecutionsProps> = ({
  importer,
}) => {
  const [logData, setLogData] = React.useState<string[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const toggleLogModal = () => setIsLogModalOpen(!isLogModalOpen);

  const {
    result: { data: reports },
    isFetching,
    fetchError,
  } = useFetchImporterReports(importer.name);

  const tableData = React.useMemo(() => {
    const currentTask: TableReportData = {
      isRunning: true,
      id: "root",
      startDate: undefined,
      endDate: undefined,
      duration: importer.progress?.estimatedSecondsRemaining
        ? importer.progress?.estimatedSecondsRemaining * 1000
        : undefined,
      numberOfItems: importer.progress?.current,
      error: undefined,
      messages: undefined,
    };

    const reportsMapped = reports.map((item) => {
      let duration: number | undefined;
      if (item.report?.startDate && item.report.endDate) {
        const fromDate = dayjs(item.report.startDate);
        const toDate = dayjs(item.report.endDate);
        duration = toDate.diff(fromDate);
      }

      const result: TableReportData = {
        isRunning: false,
        id: item.id,
        startDate: item.report?.startDate,
        endDate: item.report?.endDate,
        duration: duration,
        numberOfItems: item.report?.numberOfItems,
        error: item.error ?? undefined,
        messages: item.report?.messages,
      };
      return result;
    });
    return [
      ...(importer.state === "running" ? [currentTask] : []),
      ...reportsMapped,
    ];
  }, [importer, reports]);

  const tableControls = useLocalTableControls({
    variant: "compact",
    tableName: "report-table",
    idProperty: "id",
    items: tableData,
    columnNames: {
      startDate: "Start date",
      endDate: "End date",
      numberOfItems: "Number of items",
      status: "Status",
      duration: "Duration",
    },
    isPaginationEnabled: true,
    initialItemsPerPage: 5,
    isSortEnabled: true,
    sortableColumns: ["startDate", "endDate"],
    initialSort: { columnKey: "startDate", direction: "desc" },
    getSortValues: (report) => ({
      startDate: report.startDate ? dayjs(report.startDate).valueOf() : true,
      endDate: report.endDate ? dayjs(report.endDate).valueOf() : true,
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
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "startDate" })} />
              <Th {...getThProps({ columnKey: "endDate" })} />
              <Th {...getThProps({ columnKey: "numberOfItems" })} />
              <Th {...getThProps({ columnKey: "status" })} />
              <Th {...getThProps({ columnKey: "duration" })} />
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
            const LogButton = ({ children }: { children: React.ReactNode }) => {
              if (item.messages) {
                return (
                  <Button
                    isInline
                    variant="link"
                    onClick={() => {
                      const newLogData = messagesToLogData(item.messages ?? {});
                      setLogData(newLogData);
                      toggleLogModal();
                    }}
                  >
                    {children}
                  </Button>
                );
              }
              return children;
            };

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
                      modifier="wrap"
                      {...getTdProps({ columnKey: "startDate" })}
                    >
                      {formatDateTime(item.startDate)}
                    </Td>
                    <Td
                      width={15}
                      modifier="wrap"
                      {...getTdProps({ columnKey: "endDate" })}
                    >
                      {formatDateTime(item.endDate)}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "numberOfItems" })}
                    >
                      {item.numberOfItems}
                    </Td>
                    <Td
                      width={30}
                      modifier="wrap"
                      {...getTdProps({ columnKey: "status" })}
                    >
                      {item.isRunning ? (
                        <ImporterStatusIcon state="running" />
                      ) : (
                        <LogButton>
                          {item.error ? (
                            <IconedStatus preset="Failed" label={item.error} />
                          ) : (
                            <IconedStatus
                              preset="Completed"
                              label="Finished successfully"
                            />
                          )}
                        </LogButton>
                      )}
                    </Td>
                    <Td
                      width={25}
                      modifier="wrap"
                      {...getTdProps({ columnKey: "duration" })}
                    >
                      {item.duration
                        ? item.isRunning
                          ? `Time remaining: ${dayjs.duration(item.duration).humanize()}`
                          : `Run for: ${dayjs.duration(item.duration).humanize()}`
                        : ""}
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
        paginationProps={paginationProps}
      />

      <Modal variant="large" isOpen={isLogModalOpen} onClose={toggleLogModal}>
        <ModalHeader title="Log" />
        <ModalBody>
          <LogViewer
            hasLineNumbers={false}
            height={400}
            data={logData}
            theme="dark"
            toolbar={
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <LogViewerSearch
                      placeholder="Search value"
                      minSearchChars={1}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button key="cancel" variant="link" onClick={toggleLogModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
