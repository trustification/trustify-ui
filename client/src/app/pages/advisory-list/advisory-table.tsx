import React from "react";
import { NavLink } from "react-router-dom";

import type { AxiosError } from "axios";

import {
  ButtonVariant,
  Modal,
  ModalBody,
  ModalHeader,
} from "@patternfly/react-core";
import {
  ActionsColumn,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import type { AdvisorySummary } from "@app/client";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { useDownload } from "@app/hooks/domain-controls/useDownload";
import {
  type ExtendedSeverity,
  extendedSeverityFromSeverity,
} from "@app/api/models";
import { formatDate } from "@app/utils/utils";
import { NotificationsContext } from "@app/components/NotificationsContext.tsx";
import { useDeleteAdvisoryMutation } from "@app/queries/advisories.ts";
import { LabelsAsList } from "@app/components/LabelsAsList.tsx";
import { joinKeyValueAsString } from "@app/api/model-utils.ts";
import { ConfirmDialog } from "@app/components/ConfirmDialog.tsx";

import { AdvisorySearchContext } from "./advisory-context";
import { AdvisoryEditLabelsForm } from "./components/AdvisoryEditLabelsForm";

export const AdvisoryTable: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(AdvisorySearchContext);

  const [editLabelsModalState, setEditLabelsModalState] =
    React.useState<AdvisorySummary | null>(null);
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

  const { downloadAdvisory } = useDownload();

  const closeEditLabelsModal = () => {
    setEditLabelsModalState(null);
  };

  // Delete action

  const [advisoryToDelete, setAdvisoryToDelete] =
    React.useState<AdvisorySummary | null>(null);

  const onDeleteAdvisorySuccess = (advisory: AdvisorySummary) => {
    setAdvisoryToDelete(null);
    pushNotification({
      title: `The Advisory ${advisory.identifier} was deleted`,
      variant: "success",
    });
  };

  const onDeleteAdvisoryError = (_error: AxiosError) => {
    pushNotification({
      title: "Error occurred while deleting the Advisory",
      variant: "danger",
    });
  };

  const { mutate: deleteAdvisory, isPending: isDeletingAdvisory } =
    useDeleteAdvisoryMutation(onDeleteAdvisorySuccess, onDeleteAdvisoryError);

  return (
    <>
      <Table {...tableProps} aria-label="advisory-table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "identifier" })} />
              <Th {...getThProps({ columnKey: "title" })} />
              <Th {...getThProps({ columnKey: "type" })} />
              <Th {...getThProps({ columnKey: "labels" })} />
              <Th {...getThProps({ columnKey: "modified" })} />
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
            type SeverityGroup = { [key in ExtendedSeverity]: number };
            const defaultSeverityGroup: SeverityGroup = {
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
              none: 0,
              unknown: 0,
            };

            const severities = item.vulnerabilities.reduce((prev, current) => {
              const extendedSeverity = extendedSeverityFromSeverity(
                current.severity,
              );
              prev[extendedSeverity] = prev[extendedSeverity] + 1;
              return prev;
            }, defaultSeverityGroup);

            return (
              <Tbody key={item.identifier} isExpanded={isCellExpanded(item)}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={15}
                      modifier="breakWord"
                      {...getTdProps({
                        columnKey: "identifier",
                        isCompoundExpandToggle: true,
                        item: item,
                        rowIndex,
                      })}
                    >
                      <NavLink to={`/advisories/${item.uuid}`}>
                        {item.document_id}
                      </NavLink>
                    </Td>
                    <Td
                      width={35}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "title" })}
                    >
                      {item.title}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "type" })}>
                      {item.labels.type}
                    </Td>
                    <Td width={20} {...getTdProps({ columnKey: "labels" })}>
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
                      {...getTdProps({ columnKey: "modified" })}
                    >
                      {formatDate(item.modified)}
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    >
                      <VulnerabilityGallery severities={severities} />
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
                            title: "Download",
                            onClick: () => {
                              downloadAdvisory(
                                item.uuid,
                                `${item.identifier}.json`,
                              );
                            },
                          },
                          { isSeparator: true },
                          {
                            title: "Delete",
                            onClick: () => {
                              setAdvisoryToDelete(item);
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
        idPrefix="advisory-table"
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
            <AdvisoryEditLabelsForm
              advisory={rowLabelsToUpdate}
              onClose={closeEditLabelsModal}
            />
          )}
        </ModalBody>
      </Modal>

      <ConfirmDialog
        inProgress={isDeletingAdvisory}
        title={`Delete ${advisoryToDelete?.identifier}`}
        titleIconVariant="warning"
        isOpen={!!advisoryToDelete}
        message="Are you sure you want to delete this Advisory? This action cannot be undone."
        aria-label="Delete SBOM"
        confirmBtnVariant={ButtonVariant.danger}
        confirmBtnLabel="Delete"
        cancelBtnLabel="Cancel"
        onCancel={() => setAdvisoryToDelete(null)}
        onClose={() => setAdvisoryToDelete(null)}
        onConfirm={() => {
          if (advisoryToDelete) {
            deleteAdvisory(advisoryToDelete.uuid);
          }
        }}
      />
    </>
  );
};
