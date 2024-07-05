import React from "react";
import { NavLink } from "react-router-dom";

import { AxiosError, AxiosResponse } from "axios";

import {
  Button,
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
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
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
import { useFetchSBOMs, useUploadSBOM } from "@app/queries/sboms";
import { formatDate } from "@app/utils/utils";

export const SbomList: React.FC = () => {
  const [showUploadComponent, setShowUploadComponent] = React.useState(false);
  const { uploads, handleUpload, handleRemoveUpload } = useUploadSBOM();

  const tableControlState = useTableControlState({
    tableName: "sboms",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms,
    columnNames: {
      name: "Name",
      supplier: "Supplier",
      published: "Published",
      packages: "Packages",
      vulnerabilities: "Vulnerabilities",
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
    expandableVariant: "single",
  });

  const {
    result: { data: advisories, total: totalItemCount },
    isFetching,
    fetchError,
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

          <Table {...tableProps} aria-label="Sboms details table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th
                    aria-label="name"
                    {...getThProps({ columnKey: "name" })}
                  />
                  <Th
                    aria-label="supplier"
                    {...getThProps({ columnKey: "supplier" })}
                  />
                  <Th
                    aria-label="published"
                    {...getThProps({ columnKey: "published" })}
                  />
                  <Th
                    aria-label="packages"
                    {...getThProps({ columnKey: "packages" })}
                  />
                  <Th
                    aria-label="vulnerabilities"
                    {...getThProps({ columnKey: "vulnerabilities" })}
                  />
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
                  <Tbody key={item.id}>
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td width={20} {...getTdProps({ columnKey: "name" })}>
                          <NavLink to={`/sboms/${item.id}`}>
                            {item.name}
                          </NavLink>
                        </Td>
                        <Td
                          width={40}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "supplier" })}
                        >
                          {item.authors}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "published" })}
                        >
                          {formatDate(item.published)}
                        </Td>
                        <Td
                          width={10}
                          {...getTdProps({ columnKey: "packages" })}
                        >
                          <PackagesCount sbomId={item.id} />
                        </Td>
                        <Td
                          width={20}
                          {...getTdProps({ columnKey: "vulnerabilities" })}
                        >
                          <p style={{ color: "red" }}>issue-285</p>
                        </Td>
                        <Td isActionCell>
                          <ActionsColumn
                            items={[
                              {
                                title: "Download",
                                onClick: () => {
                                  downloadSBOM(item.id, `${item.name}.json`);
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
                          <ExpandableRowContent>
                            <div className="pf-v5-u-m-md">
                              {item.described_by && (
                                <SbomExpandedArea
                                  described_by={item.described_by}
                                />
                              )}
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
        extractSuccessMessage={(response: AxiosResponse<string>) => {
          return `${response.data} uploaded`;
        }}
        extractErrorMessage={(error: AxiosError) =>
          error.response?.data ? error.message : "Error while uploading file"
        }
        onCloseClick={() => setShowUploadComponent(false)}
      />
    </>
  );
};

interface SbomExpandedAreaProps {
  described_by: {
    name: string;
    version: string;
  }[];
}

export const SbomExpandedArea: React.FC<SbomExpandedAreaProps> = ({
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
              <Th aria-label="name" {...getThProps({ columnKey: "name" })} />
              <Th
                aria-label="version"
                {...getThProps({ columnKey: "version" })}
              />
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
