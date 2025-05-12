import React from "react";

import {
  Content,
  PageSection,
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
    VulnerabilitySearchContext,
  );
  const { tableControls: advisoryTableControls } = React.useContext(
    AdvisorySearchContext,
  );

  const {
    isFetching: isFetchingSboms,
    totalItemCount: sbomTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: sbomFilterPanelProps },
    },
  } = React.useContext(SbomSearchContext);

  const {
    isFetching: isFetchingPackages,
    totalItemCount: packageTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: packageFilterPanelProps },
    },
  } = React.useContext(PackageSearchContext);

  const {
    isFetching: isFetchingVulnerabilities,
    totalItemCount: vulnerabilityTotalCount,
    tableControls: {
      propHelpers: { filterPanelProps: vulnerabilityFilterPanelProps },
    },
  } = React.useContext(VulnerabilitySearchContext);

  const {
    isFetching: isFetchingAdvisories,
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
    if (searchValue === undefined) return;
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
      isFetchingPackages={isFetchingPackages}
      isFetchingSboms={isFetchingSboms}
      isFetchingVulnerabilities={isFetchingVulnerabilities}
      isFetchingAdvisories={isFetchingAdvisories}
    />
  );

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Toolbar isStatic>
          <ToolbarContent>
            <ToolbarGroup align={{ default: "alignStart" }}>
              <Content>
                <Content component="h1">Search Results</Content>
              </Content>
            </ToolbarGroup>
            <ToolbarGroup
              variant="action-group-plain"
              align={{ default: "alignEnd" }}
            >
              <ToolbarGroup visibility={{ default: "visible" }}>
                <ToolbarItem>
                  <SearchMenu onChangeSearch={onChangeContextSearchValue} />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        {searchBodyOverride || searchTabs}
      </PageSection>
    </>
  );
};
