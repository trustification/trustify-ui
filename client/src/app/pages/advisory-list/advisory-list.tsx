import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

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
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useDownload } from "@app/hooks/useDownload";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchAdvisories } from "@app/queries/advisories";

import { UploadFilesDrawer } from "./components/UploadFilesDrawer";
import { VulnerabilitiesGalleryCount } from "./components/VulnerabilitiesGaleryCount";

export const AdvisoryList: React.FC = () => {
  const [showUploadComponent, setShowUploadComponent] = React.useState(false);

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
    sortableColumns: ["identifier", "published", "modified"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
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
        published: "published",
        modified: "modified",
      },
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "sha256",
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
                        <NavLink to={`/advisories/${item.sha256}`}>
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
                        {/* <SeverityShieldAndText
                          value={item.severity}
                        /> */}
                      </Td>
                      <Td
                        width={10}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "published" })}
                      >
                        {dayjs(item.published).format(RENDER_DATE_FORMAT)}
                      </Td>
                      <Td
                        width={10}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "modified" })}
                      >
                        {dayjs(item.modified).format(RENDER_DATE_FORMAT)}
                      </Td>
                      <Td
                        width={15}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "vulnerabilities" })}
                      >
                        <VulnerabilitiesGalleryCount vulnerabilities={item.vulnerabilities} />
                      </Td>
                      <Td isActionCell>
                        <ActionsColumn
                          items={[
                            {
                              title: "Download",
                              onClick: () => downloadAdvisory(item.identifier),
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
        onCloseClick={() => setShowUploadComponent(false)}
      />
    </>
  );
};
