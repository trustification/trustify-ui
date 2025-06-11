import type React from "react";
import { Link } from "react-router-dom";

import {
  Content,
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
  List,
  ListItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import ShieldAltIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";

import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import { ConditionalDataListBody } from "@app/components/DataListControls/ConditionalDataListBody";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useFetchPackagesBySbomId } from "@app/queries/packages";
import { useFetchSbomsLicenseIds } from "@app/queries/sboms";

import { PackageVulnerabilities } from "../package-list/components/PackageVulnerabilities";

interface PackagesProps {
  sbomId: string;
}

export const PackagesBySbom: React.FC<PackagesProps> = ({ sbomId }) => {
  const { licenseIds } = useFetchSbomsLicenseIds(sbomId);

  const tableControlState = useTableControlState({
    tableName: "package-table",
    columnNames: {
      name: "Name",
      version: "Version",
    },
    isSortEnabled: true,
    sortableColumns: ["name"],
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "Text",
        title: "License",
        placeholderText: "Filter results by license",
        type: FilterType.multiselect,
        selectOptions: licenseIds.map((licenseId) => ({
          value: licenseId,
          label: licenseId,
        })),
      },
    ],
    isExpansionEnabled: true,
    expandableVariant: "single",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackagesBySbomId(
    sbomId,
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
      },
    }),
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: packages,
    totalItemCount,
    isLoading: isFetching,
  });

  const {
    currentPageItems,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
    expansionDerivedState: { isCellExpanded, setCellExpanded },
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="package-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <DataList aria-label="Packages table">
        <ConditionalDataListBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={packages.length === 0}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <DataListItem
                key={item.id}
                id={item.id}
                isExpanded={isCellExpanded(item)}
              >
                <DataListItemRow>
                  <DataListToggle
                    id={`toggle-${item.id}`}
                    aria-label={`toggle-${rowIndex}`}
                    onClick={() => {
                      setCellExpanded({
                        item,
                        isExpanding: !isCellExpanded(item),
                      });
                    }}
                    isExpanded={isCellExpanded(item)}
                  />
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="info" wrapModifier="breakWord">
                        <Flex direction={{ default: "column" }}>
                          <FlexItem>
                            <Content component="p">
                              {[item.name, item.group]
                                .filter(Boolean)
                                .join("/")}
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Content component="small">{item?.version}</Content>
                          </FlexItem>
                        </Flex>
                      </DataListCell>,
                      <DataListCell
                        key="purls"
                        wrapModifier="breakWord"
                        width={4}
                      >
                        <List>
                          {item.purl.map((e) => {
                            return (
                              <ListItem key={e.uuid}>
                                <Stack>
                                  <StackItem>
                                    <Split>
                                      <SplitItem>
                                        <Tooltip
                                          content={<div>Vulnerabilities</div>}
                                        >
                                          <ShieldAltIcon />
                                        </Tooltip>
                                      </SplitItem>
                                      <SplitItem>
                                        <PackageVulnerabilities
                                          packageId={e.uuid}
                                        />
                                      </SplitItem>
                                    </Split>
                                  </StackItem>
                                  <StackItem>
                                    <Content component="small">
                                      Purl:{" "}
                                      <Link to={`/packages/${e.uuid}`}>
                                        {e.purl}
                                      </Link>
                                    </Content>
                                  </StackItem>
                                </Stack>
                              </ListItem>
                            );
                          })}
                        </List>
                      </DataListCell>,
                      <DataListCell
                        key="license"
                        wrapModifier="breakWord"
                        width={2}
                      >
                        <List>
                          {item.licenses.map((e) => (
                            <ListItem key={e.license_name}>
                              {e.license_name}{" "}
                              <Label isCompact>{e.license_type}</Label>
                            </ListItem>
                          ))}
                        </List>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
                <DataListContent
                  aria-label={`expanded-area-${rowIndex}`}
                  isHidden={!isCellExpanded(item)}
                >
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>CPEs</DescriptionListTerm>
                      <DescriptionListDescription>
                        {item.cpe.length > 0 ? (
                          <List>
                            {item.cpe.map((e) => (
                              <ListItem key={e}>{e}</ListItem>
                            ))}
                          </List>
                        ) : (
                          <Content component="small">None</Content>
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </DataListContent>
              </DataListItem>
            );
          })}
        </ConditionalDataListBody>
      </DataList>

      <SimplePagination
        idPrefix="package-table"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};
