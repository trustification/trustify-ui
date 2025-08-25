import React from "react";

import dayjs from "dayjs";

import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import type { Importer } from "@app/client";
import { IconedStatus } from "@app/components/IconedStatus";
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
import { useFetchImporterReports } from "@app/queries/importers";
import { formatDateTime } from "@app/utils/utils";

import { ReportStatusMessage } from "./report-status-message";

interface IImporterExecutionsProps {
  allImporters: Importer[];
  importer: Importer;
}

export const ImporterExecutions: React.FC<IImporterExecutionsProps> = ({
  allImporters,
  importer,
}) => {
  const tableControlState = useTableControlState({
    tableName: "executions",
    columnNames: {
      creationDate: "Created",
      completed: "Completed",
      duration: "Duration",
      numberOfItems: "Items",
      status: "Status",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["creationDate"],
    initialSort: { columnKey: "creationDate", direction: "desc" },
    isFilterEnabled: false,
    isExpansionEnabled: false,
  });

  const {
    result: { data: executions, total: totalItemCount },
    isFetching,
    fetchError,
    refetch,
  } = useFetchImporterReports(
    importer.name,
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        creationDate: "creation",
      },
    }),
    true,
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: executions,
    totalItemCount,
    isLoading: isFetching,
  });

  const {
    numRenderedColumns,
    currentPageItems,
    propHelpers: {
      toolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
  } = tableControls;

  // Refetch executions if there was a change in the state of the importer
  const prevAllImporters = React.useRef<Importer[]>(allImporters);
  React.useEffect(() => {
    const prevImporter = prevAllImporters.current?.find(
      (item) => item.name === importer.name,
    );
    const currentImporter = allImporters?.find(
      (item) => item.name === importer.name,
    );

    if (
      prevImporter &&
      currentImporter &&
      prevImporter.state !== currentImporter.state
    ) {
      refetch();
    }

    prevAllImporters.current = allImporters;
  }, [allImporters, importer, refetch]);

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="executions-table"
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
              <Th {...getThProps({ columnKey: "creationDate" })} />
              <Th {...getThProps({ columnKey: "completed" })} />
              <Th {...getThProps({ columnKey: "duration" })} />
              <Th {...getThProps({ columnKey: "numberOfItems" })} />
              <Th {...getThProps({ columnKey: "status" })} />
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
            let duration: number | undefined;
            if (item.report?.startDate && item.report.endDate) {
              const fromDate = dayjs(item.report.startDate);
              const toDate = dayjs(item.report.endDate);
              duration = toDate.diff(fromDate);
            }

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
                      {...getTdProps({ columnKey: "creationDate" })}
                    >
                      {formatDateTime(item.creation)}
                    </Td>
                    <Td
                      width={15}
                      modifier="wrap"
                      {...getTdProps({ columnKey: "completed" })}
                    >
                      {item?.report?.endDate
                        ? dayjs(item.report.endDate).fromNow()
                        : "-"}
                    </Td>
                    <Td
                      width={15}
                      modifier="wrap"
                      {...getTdProps({ columnKey: "duration" })}
                    >
                      {`${duration ? dayjs.duration(duration).humanize() : ""}`}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "numberOfItems" })}
                    >
                      {item.report?.numberOfItems}
                    </Td>
                    <Td
                      width={20}
                      modifier="wrap"
                      {...getTdProps({ columnKey: "status" })}
                    >
                      <ReportStatusMessage
                        description={item?.error || ""}
                        messages={item.report?.messages ?? null}
                      >
                        {({ toggleLogModal }) => {
                          return item.error ? (
                            <Button
                              isInline
                              variant="link"
                              onClick={toggleLogModal}
                            >
                              <IconedStatus
                                preset="Failed"
                                label={item.error}
                              />
                            </Button>
                          ) : (
                            <IconedStatus
                              preset="Completed"
                              label="Completed"
                            />
                          );
                        }}
                      </ReportStatusMessage>
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="executions-table"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};
