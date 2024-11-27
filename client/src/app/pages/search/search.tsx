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

  const [searchValue, setSearchValue] = React.useState(
    sbomTableControls.filterState.filterValues[FILTER_TEXT_CATEGORY_KEY]?.[0] ||
      ""
  );

  const onChangeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const onClearSearchValue = () => {
    setSearchValue("");
  };

  const onChangeContextSearchValue = () => {
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
                  <SearchInput
                    placeholder="Search for an SBOM, Package, or Vulnerability"
                    value={searchValue}
                    onChange={(_event, value) => onChangeSearchValue(value)}
                    onClear={onClearSearchValue}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key && event.key !== "Enter") return;
                      onChangeContextSearchValue();
                    }}
                  />
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
