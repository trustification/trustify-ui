import React from "react";
import { NavLink } from "react-router-dom";

import { AxiosError } from "axios";

import { ButtonVariant } from "@patternfly/react-core";
import {
  ActionsColumn,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { SbomSummary } from "@app/client";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { PackagesCount } from "@app/components/PackagesCount";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useDownload } from "@app/hooks/useDownload";
import { useDeleteSbomMutation } from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";

import { ConfirmDialog } from "@app/components/ConfirmDialog";
import { SbomSearchContext } from "./sbom-context";

export const SbomTable: React.FC = ({}) => {
  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(SbomSearchContext);

  const { pushNotification } = React.useContext(NotificationsContext);

  // Actions that each row can trigger
  type RowAction = "delete";
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<SbomSummary | null>(
    null
  );

  const prepareActionOnRow = (action: RowAction, row: SbomSummary) => {
    setSelectedRowAction(action);
    setSelectedRow(row);
  };

  const onDeleteSbomSuccess = (sbom: SbomSummary) => {
    pushNotification({
      title: `The SBOM ${sbom.name} was deleted`,
      variant: "success",
    });
  };

  const onDeleteAdvisoryError = (_error: AxiosError) => {
    pushNotification({
      title: "Error occurred while deleting the SBOM",
      variant: "danger",
    });
  };

  const { mutate: deleteSbom } = useDeleteSbomMutation(
    onDeleteSbomSuccess,
    onDeleteAdvisoryError
  );

  const {
    numRenderedColumns,
    currentPageItems,
    propHelpers: {
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  const { downloadSBOM } = useDownload();

  return (
    <>
      <Table {...tableProps} aria-label="sbom-table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "supplier" })} />
              <Th {...getThProps({ columnKey: "published" })} />
              <Th {...getThProps({ columnKey: "packages" })} />
              <Th {...getThProps({ columnKey: "vulnerabilities" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalItemCount === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems.map((item, rowIndex) => {
            return (
              <Tbody key={item.id} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={30}
                      {...getTdProps({
                        columnKey: "name",
                        isCompoundExpandToggle: true,
                        item: item,
                        rowIndex,
                      })}
                    >
                      <NavLink to={`/sboms/${item.id}`}>{item.name}</NavLink>
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item.described_by
                        .map((e) => e.version)
                        .filter((e) => e)
                        .join(", ")}
                    </Td>
                    <Td
                      width={20}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "supplier" })}
                    >
                      {item.authors.join(", ")}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "published" })}>
                      {formatDate(item.published)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "packages" })}>
                      <PackagesCount sbomId={item.id} />
                    </Td>
                    <Td
                      width={15}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    ></Td>
                    <Td isActionCell>
                      <ActionsColumn
                        items={[
                          {
                            title: "Download",
                            onClick: () => {
                              downloadSBOM(item.id, `${item.name}.json`);
                            },
                          },
                          {
                            title: "Delete",
                            onClick: () => prepareActionOnRow("delete", item),
                          },
                        ]}
                      />
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="sbom-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />

      <ConfirmDialog
        title={`Delete ${selectedRow?.name}`}
        titleIconVariant="warning"
        isOpen={selectedRowAction === "delete"}
        message="Are you sure you want to delete this SBOM? This action cannot be undone."
        aria-label="Delete SBOM"
        confirmBtnVariant={ButtonVariant.danger}
        confirmBtnLabel="Delete"
        cancelBtnLabel="Cancel"
        onCancel={() => setSelectedRowAction(null)}
        onClose={() => setSelectedRowAction(null)}
        onConfirm={() => {
          if (selectedRow) {
            deleteSbom(selectedRow.id);
          }
          setSelectedRowAction(null);
        }}
      />
    </>
  );
};
