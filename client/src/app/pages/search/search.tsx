import React from "react";

import {
  PageSection,
  PageSectionVariants,
  SearchInput,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";

import { FILTER_TEXT_CATEGORY_KEY } from "@app/Constants";

import { SearchMenu } from "@app/pages/search/components/SearchMenu";
import { SearchProvider } from "./search-context";

import { AdvisorySearchContext } from "../advisory-list/advisory-context";
import { PackageSearchContext } from "../package-list/package-context";
import { SbomSearchContext } from "../sbom-list/sbom-context";
import { VulnerabilitySearchContext } from "../vulnerability-list/vulnerability-context";
import { SearchTabs } from "./components/SearchTabs";

type SearchPageProps = {
  searchBodyOverride?: React.ReactNode;
};

export const SearchPage: React.FC<SearchPageProps> = ({
  searchBodyOverride,
}) => {
  return (
    <SearchProvider>
      <Search searchBodyOverride={searchBodyOverride} />
    </SearchProvider>
  );
};

export const Search: React.FC<SearchPageProps> = ({ searchBodyOverride }) => {
  const { tableControls: sbomTableControls } =
    React.useContext(SbomSearchContext);
  const { tableControls: packageTableControls } =
    React.useContext(PackageSearchContext);
  const { tableControls: vulnerabilityTableControls } = React.useContext(
    VulnerabilitySearchContext
  );
  const { tableControls: advisoryTableControls } = React.useContext(
    AdvisorySearchContext
  );

  const {
    totalItemCount: sbomTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: sbomFilterPanelProps },
    },
  } = React.useContext(SbomSearchContext);

  const {
    totalItemCount: packageTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: packageFilterPanelProps },
    },
  } = React.useContext(PackageSearchContext);

  const {
    totalItemCount: vulnerabilityTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: vulnerabilityFilterPanelProps },
    },
  } = React.useContext(VulnerabilitySearchContext);

  const {
    totalItemCount: advisoryTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: advisoryFilterPanelProps },
    },
  } = React.useContext(AdvisorySearchContext);

  const filterPanelProps = {
    advisoryFilterPanelProps,
    packageFilterPanelProps,
    sbomFilterPanelProps,
    vulnerabilityFilterPanelProps,
  };

  // Search

  const onChangeContextSearchValue = (searchValue: string | undefined) => {
    if (searchValue == undefined) return;
    sbomTableControls.filterState.setFilterValues({
      ...sbomTableControls.filterState.filterValues,
      [FILTER_TEXT_CATEGORY_KEY]: [searchValue],
    });
    packageTableControls.filterState.setFilterValues({
      ...packageTableControls.filterState.filterValues,
      [FILTER_TEXT_CATEGORY_KEY]: [searchValue],
    });
    vulnerabilityTableControls.filterState.setFilterValues({
      ...vulnerabilityTableControls.filterState.filterValues,
      [FILTER_TEXT_CATEGORY_KEY]: [searchValue],
    });
    advisoryTableControls.filterState.setFilterValues({
      ...advisoryTableControls.filterState.filterValues,
      [FILTER_TEXT_CATEGORY_KEY]: [searchValue],
    });
  };

  const searchTabs = (
    <SearchTabs
      filterPanelProps={filterPanelProps}
      packageTotalCount={packageTotalCount}
      sbomTotalCount={sbomTotalCount}
      vulnerabilityTotalCount={vulnerabilityTotalCount}
      advisoryTotalCount={advisoryTotalCount}
    />
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Toolbar isStatic>
          <ToolbarContent>
            <ToolbarGroup align={{ default: "alignLeft" }}>
              <TextContent>
                <Text component="h1">Search Results</Text>
              </TextContent>
            </ToolbarGroup>
            <ToolbarGroup
              variant="icon-button-group"
              align={{ default: "alignRight" }}
            >
              <ToolbarGroup visibility={{ default: "hidden", lg: "visible" }}>
                <ToolbarItem widths={{ default: "500px" }}>
                  <SearchMenu onChangeSearch={onChangeContextSearchValue} />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection>{searchBodyOverride || searchTabs}</PageSection>
    </>
  );
};
