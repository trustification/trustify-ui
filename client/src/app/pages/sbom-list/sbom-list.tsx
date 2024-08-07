import React from "react";
import { NavLink } from "react-router-dom";

import { AxiosError, AxiosResponse } from "axios";

import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
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
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { SBOM } from "@app/api/models";
import { EditLabelsModal } from "@app/components/EditLabelsModal";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { PackagesCount } from "@app/components/PackagesCount";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { UploadFilesDrawer } from "@app/components/UploadFilesDrawer";
import {
  getHubRequestParams,
  useLocalTableControls,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useDownload } from "@app/hooks/useDownload";
import { useSelectionState } from "@app/hooks/useSelectionState";
import {
  useDeleteSbomMutation,
  useFetchSBOMs,
  useUpdateSbomLabelsMutation,
  useUploadSBOM,
} from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";
import {useNotifyErrorCallback} from "@app/hooks/useNotifyErrorCallback";

export const SbomList: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const [showUploadComponent, setShowUploadComponent] = React.useState(false);
  const { uploads, handleUpload, handleRemoveUpload } = useUploadSBOM();

  // Actions that each row can trigger
  type RowAction = "editLabels";
  const [selectedRowAction, setSelectedRowAction] =
    React.useState<RowAction | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<SBOM | null>(null);

  const prepareActionOnRow = (action: RowAction, row: SBOM) => {
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

  const deleteSBOMByIdMutation = useDeleteSbomMutation(
    useNotifyErrorCallback("Error occurred while deleting the SBOM")
  );

  const execSaveLabels = (row: SBOM, labels: { [key: string]: string }) => {
    updateSbomLabels({ ...row, labels });
  };

  // Table configs
  const tableControlState = useTableControlState({
    tableName: "sboms",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms,
    columnNames: {
      name: "Name",
      published: "Published",
      labels: "Labels",
      packages: "Packages",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["published"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
    ],
    isExpansionEnabled: true,
    expandableVariant: "compound",
  });

  const {
    result: { data: advisories, total: totalItemCount },
    isFetching,
    fetchError,
    refetch,
  } = useFetchSBOMs(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        published: "published",
      },
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: advisories,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: advisories,
      isEqual: (a, b) => a.id === b.id,
    }),
  });

  const {
    numRenderedColumns,
    currentPageItems,
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

  const { downloadSBOM } = useDownload();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">SBOMs</Text>
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
                  id="upload"
                  aria-label="Upload"
                  variant="secondary"
                  onClick={() => setShowUploadComponent(true)}
                >
                  Upload
                </Button>
              </ToolbarItem>
              <ToolbarItem {...paginationToolbarItemProps}>
                <SimplePagination
                  idPrefix="sboms-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="SBOM table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "published" })} />
                  <Th {...getThProps({ columnKey: "labels" })} />
                  <Th {...getThProps({ columnKey: "packages" })} />
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
                          <NavLink to={`/sboms/${item.id}`}>
                            {item.name}
                          </NavLink>
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "published" })}
                        >
                          {formatDate(item.published)}
                        </Td>
                        <Td
                          width={25}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "labels" })}
                        >
                          {item.labels && <LabelsAsList value={item.labels} />}
                        </Td>

                        <Td width={10} {...getTdProps({ columnKey: "packages" })}>
                          <PackagesCount sbomId={item.id} />
                        </Td>
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
                                onClick: () => deleteSBOMByIdMutation.mutate(item.id),
                              },
                            ]}
                          />
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <Tr isExpanded>
                        <Td colSpan={7}>
                          <ExpandableRowContent>
                            <div className="pf-v5-u-m-md">
                              {isCellExpanded(item, "name") ? (
                                <>
                                  <DescriptionList>
                                    <DescriptionListGroup>
                                      <DescriptionListTerm>
                                        Author
                                      </DescriptionListTerm>
                                      <DescriptionListDescription>
                                        <List>
                                          {item.authors.map((elem, index) => (
                                            <ListItem key={index}>
                                              {elem}
                                            </ListItem>
                                          ))}
                                        </List>
                                      </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                      <DescriptionListTerm>
                                        Described by
                                      </DescriptionListTerm>
                                      <DescriptionListDescription>
                                        {item.described_by && (
                                          <SbomDescribedBy
                                            described_by={item.described_by}
                                          />
                                        )}
                                      </DescriptionListDescription>
                                    </DescriptionListGroup>
                                  </DescriptionList>
                                </>
                              ) : null}
                            </div>
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    ) : null}
                  </Tbody>
                );
              })}
            </ConditionalTableBody>
          </Table>
          <SimplePagination
            idPrefix="sboms-apps-table"
            isTop={false}
            isCompact
            paginationProps={paginationProps}
          />
        </div>
      </PageSection>

      <UploadFilesDrawer
        isExpanded={showUploadComponent}
        uploads={uploads}
        handleUpload={handleUpload}
        handleRemoveUpload={handleRemoveUpload}
        extractSuccessMessage={(
          response: AxiosResponse<{ document_id: string }>
        ) => {
          return `${response.data.document_id} uploaded`;
        }}
        extractErrorMessage={(error: AxiosError) =>
          error.response?.data ? error.message : "Error while uploading file"
        }
        onCloseClick={() => setShowUploadComponent(false)}
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

interface SbomDescribedByProps {
  described_by: {
    name: string;
    version: string;
  }[];
}

export const SbomDescribedBy: React.FC<SbomDescribedByProps> = ({
  described_by,
}) => {
  const tableControls = useLocalTableControls({
    variant: "compact",
    tableName: "version-table",
    idProperty: "name",
    items: described_by,
    columnNames: {
      name: "Name",
      version: "Version",
    },
    isPaginationEnabled: false,
    isSortEnabled: true,
    sortableColumns: [],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter tex",
        type: FilterType.search,
        placeholderText: "Search...",
        getItemValue: (item) => {
          return item.name;
        },
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: { tableProps, getThProps, getTrProps, getTdProps },
  } = tableControls;

  return (
    <>
      <Table {...tableProps} aria-label="Version table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "name" })} />
              <Th {...getThProps({ columnKey: "version" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={false}
          isError={undefined}
          isNoData={described_by?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.name}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td
                      width={20}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "name" })}
                    >
                      {item.name}
                    </Td>
                    <Td
                      width={15}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "version" })}
                    >
                      {item.version}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
    </>
  );
};
