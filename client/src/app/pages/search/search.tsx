import React from "react";

import {
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Popover,
  SearchInput,
  Tab,
  TabAction,
  TabTitleText,
  Tabs,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

import { FilterPanel } from "@app/components/FilterPanel";

import { SearchProvider } from "./search-context";

import { PackageSearchContext } from "../package-list/package-context";
import { PackageTable } from "../package-list/package-table";
import { SbomSearchContext } from "../sbom-list/sbom-context";
import { SbomTable } from "../sbom-list/sbom-table";
import { VulnerabilitySearchContext } from "../vulnerability-list/vulnerability-context";
import { VulnerabilityTable } from "../vulnerability-list/vulnerability-table";

export const SearchPage: React.FC = () => {
  return (
    <SearchProvider>
      <Search />
    </SearchProvider>
  );
};

export const Search: React.FC = () => {
  const { tableControls: sbomTableControls } =
    React.useContext(SbomSearchContext);
  const { tableControls: packageTableControls } =
    React.useContext(PackageSearchContext);
  const { tableControls: vulnerabilityTableControls } = React.useContext(
    VulnerabilitySearchContext
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

  // Search

  const [searchValue, setSearchValue] = React.useState("");

  const onChangeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const onClearSearchValue = () => {
    setSearchValue("");
  };

  const onChangeContextSearchValue = () => {
    sbomTableControls.filterState.setFilterValues({
      ...sbomTableControls.filterState.filterValues,
      "": [searchValue],
    });
    packageTableControls.filterState.setFilterValues({
      ...packageTableControls.filterState.filterValues,
      "": [searchValue],
    });
    vulnerabilityTableControls.filterState.setFilterValues({
      ...vulnerabilityTableControls.filterState.filterValues,
      "": [searchValue],
    });
  };

  // Tabs

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const sbomPopoverRef = React.createRef<HTMLElement>();

  const sbomPopover = (popoverRef: React.RefObject<any>) => (
    <Popover
      bodyContent={
        <div>Software Bill of Materials for Products and Containers.</div>
      }
      position={"right"}
      triggerRef={popoverRef}
    />
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Toolbar isStatic>
          <ToolbarContent>
            <ToolbarGroup align={{ default: "alignLeft" }}>
              <TextContent>
                <Text component="h1">Search</Text>
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
      <PageSection>
        <Grid hasGutter>
          <GridItem md={2}>
            <Card isFullHeight>
              <CardBody>
                {activeTabKey === 0 ? (
                  <FilterPanel
                    ommitFilterCategoryKeys={[""]}
                    {...sbomFilterPanelProps}
                  />
                ) : activeTabKey === 1 ? (
                  <FilterPanel
                    ommitFilterCategoryKeys={[""]}
                    {...packageFilterPanelProps}
                  />
                ) : activeTabKey === 2 ? (
                  <FilterPanel
                    ommitFilterCategoryKeys={[""]}
                    {...vulnerabilityFilterPanelProps}
                  />
                ) : null}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem md={10}>
            <Card>
              <CardBody>
                <Tabs
                  activeKey={activeTabKey}
                  onSelect={handleTabClick}
                  aria-label="Tabs"
                  role="region"
                >
                  <Tab
                    eventKey={0}
                    title={
                      <TabTitleText>
                        SBOMs{"  "}
                        <Badge screenReaderText="Search Result Count">
                          {sbomTotalCount}
                        </Badge>
                      </TabTitleText>
                    }
                    actions={
                      <>
                        <TabAction
                          aria-label={`SBOM help popover`}
                          ref={sbomPopoverRef}
                        >
                          <HelpIcon />
                        </TabAction>
                        {sbomPopover(sbomPopoverRef)}
                      </>
                    }
                  >
                    <SbomTable />
                  </Tab>
                  <Tab
                    eventKey={1}
                    title={
                      <TabTitleText>
                        Packages{"  "}
                        <Badge screenReaderText="Search Result Count">
                          {packageTotalCount}
                        </Badge>
                      </TabTitleText>
                    }
                  >
                    <PackageTable />
                  </Tab>
                  <Tab
                    eventKey={2}
                    title={
                      <TabTitleText>
                        Vulnerabilities{"  "}
                        <Badge screenReaderText="Search Result Count">
                          {vulnerabilityTotalCount}
                        </Badge>
                      </TabTitleText>
                    }
                  >
                    <VulnerabilityTable />
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
