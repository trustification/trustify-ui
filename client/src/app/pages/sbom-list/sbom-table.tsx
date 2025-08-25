import React from "react";
import { generatePath, NavLink } from "react-router-dom";

import { Modal, ModalBody, ModalHeader } from "@patternfly/react-core";
import type { AxiosError } from "axios";

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

import { joinKeyValueAsString } from "@app/api/model-utils";
import type { SbomSummary } from "@app/client";
import { ConfirmDialog } from "@app/components/ConfirmDialog";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import {
  sbomDeletedErrorMessage,
  sbomDeleteDialogProps,
  sbomDeletedSuccessMessage,
} from "@app/Constants";
import { useDownload } from "@app/hooks/domain-controls/useDownload";
import { useDeleteSbomMutation } from "@app/queries/sboms";
import { Paths } from "@app/Routes";
import { formatDate } from "@app/utils/utils";

import { SBOMEditLabelsForm } from "./components/SBOMEditLabelsForm";
import { SBOMVulnerabilities } from "./components/SbomVulnerabilities";
import { SbomSearchContext } from "./sbom-context";

export const SbomTable: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(SbomSearchContext);

  const [editLabelsModalState, setEditLabelsModalState] =
    React.useState<SbomSummary | null>(null);
  const isEditLabelsModalOpen = editLabelsModalState !== null;
  const rowLabelsToUpdate = editLabelsModalState;

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
    filterState: { filterValues, setFilterValues },
  } = tableControls;

  const { downloadSBOM, downloadSBOMLicenses } = useDownload();

  const closeEditLabelsModal = () => {
    setEditLabelsModalState(null);
  };

  // Delete action

  const [sbomToDelete, setSbomToDelete] = React.useState<SbomSummary | null>(
    null,
  );

  const onDeleteSbomSuccess = (sbom: SbomSummary) => {
    setSbomToDelete(null);
    pushNotification({
      title: sbomDeletedSuccessMessage(sbom),
      variant: "success",
    });
  };

  const onDeleteAdvisoryError = (error: AxiosError) => {
    pushNotification({
      title: sbomDeletedErrorMessage(error),
      variant: "danger",
    });
  };

  const { mutate: deleteSbom, isPending: isDeletingSbom } =
    useDeleteSbomMutation(onDeleteSbomSuccess, onDeleteAdvisoryError);

  return (
    <>
      <Table {...tableProps} aria-label="sbom-table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "supplier" })} />
              <Th {...getThProps({ columnKey: "labels" })} />
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
                      width={20}
                      modifier="breakWord"
                      {...getTdProps({
                        columnKey: "name",
                        isCompoundExpandToggle: true,
                        item: item,
                        rowIndex,
                      })}
                    >
                      <NavLink
                        to={generatePath(Paths.sbomDetails, {
                          sbomId: item.id,
                        })}
                      >
                        {item.name}
                      </NavLink>
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item.described_by
                        .map((e) => e.version)
                        .filter((e) => e)
                        .join(", ")}
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "supplier" })}
                    >
                      {item.suppliers.join(", ")}
                    </Td>
                    <Td
                      width={20}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "labels" })}
                    >
                      <LabelsAsList
                        value={item.labels}
                        onClick={({ key, value }) => {
                          const labelString = joinKeyValueAsString({
                            key,
                            value,
                          });

                          const filterValue = filterValues.labels;
                          if (!filterValue?.includes(labelString)) {
                            const newFilterValue = filterValue
                              ? [...filterValue, labelString]
                              : [labelString];

                            setFilterValues({
                              ...filterValues,
                              labels: newFilterValue,
                            });
                          }
                        }}
                      />
                    </Td>
                    <Td
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "published" })}
                    >
                      {formatDate(item.published)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "packages" })}>
                      {item.number_of_packages}
                    </Td>
                    <Td
                      width={20}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    >
                      <SBOMVulnerabilities sbomId={item.id} />
                    </Td>
                    <Td isActionCell>
                      <ActionsColumn
                        items={[
                          {
                            title: "Edit labels",
                            onClick: () => {
                              setEditLabelsModalState(item);
                            },
                          },
                          {
                            isSeparator: true,
                          },
                          {
                            title: "Download SBOM",
                            onClick: () => {
                              downloadSBOM(item.id, `${item.name}.json`);
                            },
                          },
                          {
                            title: "Download License Report",
                            onClick: () => {
                              downloadSBOMLicenses(item.id);
                            },
                          },
                          {
                            isSeparator: true,
                          },
                          {
                            title: "Delete",
                            onClick: () => {
                              setSbomToDelete(item);
                            },
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
        paginationProps={paginationProps}
      />

      <Modal
        isOpen={isEditLabelsModalOpen}
        variant="medium"
        onClose={closeEditLabelsModal}
      >
        <ModalHeader title="Edit labels" />
        <ModalBody>
          {rowLabelsToUpdate && (
            <SBOMEditLabelsForm
              sbom={rowLabelsToUpdate}
              onClose={closeEditLabelsModal}
            />
          )}
        </ModalBody>
      </Modal>

      <ConfirmDialog
        {...sbomDeleteDialogProps(sbomToDelete)}
        inProgress={isDeletingSbom}
        titleIconVariant="warning"
        isOpen={!!sbomToDelete}
        confirmBtnVariant={ButtonVariant.danger}
        confirmBtnLabel="Delete"
        cancelBtnLabel="Cancel"
        onCancel={() => setSbomToDelete(null)}
        onClose={() => setSbomToDelete(null)}
        onConfirm={() => {
          if (sbomToDelete) {
            deleteSbom(sbomToDelete.id);
          }
        }}
      />
    </>
  );
};
