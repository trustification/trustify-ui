import React from "react";
import { NavLink } from "react-router-dom";

import { AxiosError } from "axios";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
} from "@patternfly/react-core";
import {
  ActionsColumn,
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { SbomPackage, SbomSummary } from "@app/client";
import { EditLabelsModal } from "@app/components/EditLabelsModal";
import { FilterType } from "@app/components/FilterToolbar";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { PackagesCount } from "@app/components/PackagesCount";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useDownload } from "@app/hooks/useDownload";
import {
  useDeleteSbomMutation,
  useUpdateSbomLabelsMutation,
} from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";

import { SbomSearchContext } from "./sbom-context";

export const SbomTable: React.FC = ({}) => {
  const { isFetching, fetchError, totalItemCount, tableControls } =
    React.useContext(SbomSearchContext);

  const { pushNotification } = React.useContext(NotificationsContext);

  // Actions that each row can trigger
  type RowAction = "editLabels";
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<SbomSummary | null>(
    null
  );

  const prepareActionOnRow = (action: RowAction, row: SbomSummary) => {
    setSelectedRowAction(action);
    setSelectedRow(row);
  };

  const onUpdateLabelsError = (_error: AxiosError) => {
    pushNotification({
      title: "Error while updating labels",
      variant: "danger",
    });
  };

  const { mutate: updateSbomLabels } = useUpdateSbomLabelsMutation(
    () => {},
    onUpdateLabelsError
  );

  const onDeleteSbomSuccess = (sbom: SbomSummary) => {
    pushNotification({
      title: `The SBOM ${sbom.name} was deleted`,
      variant: "danger",
    });
  };

  const onDeleteAdvisoryError = (_error: AxiosError) => {
    pushNotification({
      title: "Error occurred while deleting the SBOM",
      variant: "danger",
    });
  };

  const deleteSBOMByIdMutation = useDeleteSbomMutation(
    onDeleteSbomSuccess,
    onDeleteAdvisoryError
  );

  const execSaveLabels = (
    row: SbomSummary,
    labels: { [key: string]: string }
  ) => {
    updateSbomLabels({ ...row, labels });
  };

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
                      width={40}
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
                      width={10}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    ></Td>
                    <Td
                      width={20}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "supplier" })}
                    ></Td>

                    <Td width={10} {...getTdProps({ columnKey: "published" })}>
                      {formatDate(item.published)}
                    </Td>
                    <Td width={10} {...getTdProps({ columnKey: "packages" })}>
                      <PackagesCount sbomId={item.id} />
                    </Td>
                    <Td
                      width={10}
                      {...getTdProps({ columnKey: "vulnerabilities" })}
                    ></Td>
                    <Td isActionCell>
                      <ActionsColumn
                        items={[
                          {
                            title: "Edit labels",
                            onClick: () => {
                              prepareActionOnRow("editLabels", item);
                            },
                          },
                          {
                            title: "Download",
                            onClick: () => {
                              downloadSBOM(item.id, `${item.name}.json`);
                            },
                          },
                          {
                            title: "Delete",
                            onClick: () =>
                              deleteSBOMByIdMutation.mutate(item.id),
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

      {selectedRowAction === "editLabels" && selectedRow && (
        <EditLabelsModal
          resourceName={selectedRow.name}
          value={selectedRow.labels ?? {}}
          onSave={(labels) => {
            execSaveLabels(selectedRow, labels);

            setSelectedRow(null);
            setSelectedRowAction(null);
          }}
          onClose={() => setSelectedRowAction(null)}
        />
      )}
    </>
  );
};
