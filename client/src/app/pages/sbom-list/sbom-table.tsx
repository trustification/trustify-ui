import React from "react";
import { NavLink } from "react-router-dom";

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

import {
  sbomDeletedErrorMessage,
  sbomDeletedSuccessMessage,
} from "@app/Constants";
import type { SbomSummary } from "@app/client";
import { ConfirmDialog } from "@app/components/ConfirmDialog";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useDownload } from "@app/hooks/domain-controls/useDownload";
import { useDeleteSbomMutation } from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";

import { SBOMVulnerabilities } from "./components/SbomVulnerabilities";
import { SbomSearchContext } from "./sbom-context";

export const SbomTable: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(SbomSearchContext);

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

  const { downloadSBOM, downloadSBOMLicenses } = useDownload();

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
                      width={25}
                      modifier="breakWord"
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
                      {item.suppliers.join(", ")}
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

      <ConfirmDialog
        inProgress={isDeletingSbom}
        title={`Delete ${sbomToDelete?.name}`}
        titleIconVariant="warning"
        isOpen={!!sbomToDelete}
        message="Are you sure you want to delete this SBOM? This action cannot be undone."
        aria-label="Delete SBOM"
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
