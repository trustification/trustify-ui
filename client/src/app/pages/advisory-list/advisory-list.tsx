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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import {
  RENDER_DATE_FORMAT,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
} from "@app/components/TableControls";
import { UploadFilesDrawer } from "@app/components/UploadFilesDrawer";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useDownload } from "@app/hooks/useDownload";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchAdvisories, useUploadAdvisory } from "@app/queries/advisories";

import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { VulnerabilitiesGalleryCount } from "./components/VulnerabilitiesGaleryCount";
import { formatDate } from "@app/utils/utils";

export const AdvisoryList: React.FC = () => {
  const [showUploadComponent, setShowUploadComponent] = React.useState(false);
  const { uploads, handleUpload, handleRemoveUpload } = useUploadAdvisory();

  const tableControlState = useTableControlState({
    tableName: "advisories",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.advisories,
    columnNames: {
      identifier: "Identifier",
      title: "Title",
      severity: "Severity",
      published: "Published",
      modified: "Modified",
      vulnerabilities: "Vulnerabilities",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["identifier", "severity", "published", "modified"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "average_severity",
        title: "Severity",
        placeholderText: "Severity",
        type: FilterType.multiselect,
        selectOptions: [
          { value: "none", label: "None" },
          { value: "low", label: "Low" },
          { value: "moderate", label: "Moderate" },
          { value: "important", label: "Important" },
          { value: "critical", label: "Critical" },
        ],
      },
    ],
  });

  const {
    result: { data: advisories, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchAdvisories(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        identifier: "identifier",
        severity: "average_score",
        published: "published",
        modified: "modified",
      },
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "uuid",
    currentPageItems: advisories,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: advisories,
      isEqual: (a, b) => a.identifier === b.identifier,
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
  } = tableControls;

  const { downloadAdvisory } = useDownload();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Advisories</Text>
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
                  idPrefix="advisories-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="Advisories table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "identifier" })} />
                  <Th {...getThProps({ columnKey: "title" })} />
                  <Th {...getThProps({ columnKey: "severity" })} />
                  <Th {...getThProps({ columnKey: "published" })} />
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
              {currentPageItems.map((item) => {
                return (
                  <Tbody key={item.identifier}>
                    <Tr {...getTrProps({ item })}>
                      <Td
                        width={15}
                        {...getTdProps({ columnKey: "identifier" })}
                      >
                        <NavLink to={`/advisories/${item.uuid}`}>
                          {item.identifier}
                        </NavLink>
                      </Td>
                      <Td
                        width={40}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "title" })}
                      >
                        {item.title}
                      </Td>
                      <Td
                        width={10}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "severity" })}
                      >
                        {item.average_severity && (
                          <SeverityShieldAndText
                            value={item.average_severity}
                          />
                        )}
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
                        modifier="truncate"
                        {...getTdProps({ columnKey: "modified" })}
                      >
                        {formatDate(item.modified)}
                      </Td>
                      <Td
                        width={15}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "vulnerabilities" })}
                      >
                        <VulnerabilitiesGalleryCount
                          vulnerabilities={item.vulnerabilities}
                        />
                      </Td>
                      <Td isActionCell>
                        <ActionsColumn
                          items={[
                            {
                              title: "Download",
                              onClick: () => {
                                downloadAdvisory(
                                  item.uuid,
                                  `${item.identifier}.json`
                                );
                              },
                            },
                          ]}
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                );
              })}
            </ConditionalTableBody>
          </Table>
          <SimplePagination
            idPrefix="advisories-table"
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
        extractErrorMessage={(error: AxiosError<{ message: string }>) => {
          return error.response?.data.message ?? "Error while uploading file";
        }}
        onCloseClick={() => setShowUploadComponent(false)}
      />
    </>
  );
};
