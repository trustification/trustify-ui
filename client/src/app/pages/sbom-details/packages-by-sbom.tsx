import type React from "react";
import { Link } from "react-router-dom";

import {
  Content,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  FlexItem,
  Label,
  List,
  ListItem,
  Stack,
  StackItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";
import type { LicenseRefMapping } from "@app/client";
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

const renderLicenseWithMappings = (
  license: string,
  mappings: LicenseRefMapping[],
) => {
  return mappings.reduce((prev, { license_id, license_name }) => {
    return prev.replaceAll(license_id, license_name);
  }, `${license}`);
};

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
        categoryKey: "license",
        title: "License",
        placeholderText: "Filter results by license",
        type: FilterType.multiselect,
        selectOptions: licenseIds.map((license) => ({
          value: license.license_id,
          label: license.license_name,
        })),
      },
    ],
    isExpansionEnabled: false,
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
          {currentPageItems?.map((item) => {
            return (
              <DataListItem key={item.id}>
                <DataListItemRow>
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
                          <FlexItem>
                            <Divider />
                          </FlexItem>
                          <FlexItem>
                            <DescriptionList>
                              <DescriptionListGroup>
                                <DescriptionListTerm>PURLs</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <List isPlain>
                                    {item.purl.map((e) => {
                                      return (
                                        <ListItem key={e.uuid}>
                                          <Stack>
                                            <StackItem>
                                              <Link to={`/packages/${e.uuid}`}>
                                                {e.purl}
                                              </Link>
                                            </StackItem>
                                          </Stack>
                                        </ListItem>
                                      );
                                    })}
                                  </List>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            </DescriptionList>
                          </FlexItem>
                          <FlexItem>
                            <Divider />
                          </FlexItem>
                          <FlexItem>
                            <DescriptionList
                              columnModifier={{
                                default: "2Col",
                              }}
                            >
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  Licenses
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <List isPlain>
                                    {item.licenses.map((e) => (
                                      <ListItem
                                        key={`${e.license_name}-${e.license_type}`}
                                      >
                                        {renderLicenseWithMappings(
                                          e.license_name,
                                          item.licenses_ref_mapping,
                                        )}{" "}
                                        <Label isCompact>
                                          {e.license_type}
                                        </Label>
                                      </ListItem>
                                    ))}
                                  </List>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                              <DescriptionListGroup>
                                <DescriptionListTerm>CPEs</DescriptionListTerm>
                                <DescriptionListDescription>
                                  {item.cpe.length > 0 ? (
                                    <List isPlain>
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
                          </FlexItem>
                        </Flex>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
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
