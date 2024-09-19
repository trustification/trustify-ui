import React from "react";
import ProductList from "@app/pages/product-list";
import {
  PageSection,
  PageSectionVariants,
  Popover,
  Tab,
  TabAction,
  TabTitleText,
  Tabs,
  Text,
  TextContent,
  SearchInput,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import SbomList from "@app/pages/sbom-list";
import VulnerabilityList from "@app/pages/vulnerability-list";
import PackageList from "@app/pages/package-list";
import AdvisoryList from "@app/pages/advisory-list";
import ImporterList from "@app/pages/importer-list";

export const Search: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const ref = React.createRef<HTMLElement>();
  const [searchValue, setSearchValue] = React.useState("");
  const [resultsCount, setResultsCount] = React.useState(0);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const onChangeSearch = (value: string) => {
    setSearchValue(value);
    setResultsCount(3);
  };

  const onClearSearch = () => {
    setSearchValue("");
    setResultsCount(0);
  };

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
        <TextContent>
          <Text component="h1">Search</Text>
        </TextContent>
        <SearchInput
          placeholder="Search for an SBOM, advisory, or CVE"
          value={searchValue}
          onChange={(_event, value) => onChangeSearch(value)}
          onClear={onClearSearch}
          resultsCount={resultsCount}
        />
      </PageSection>
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        aria-label="Tabs"
        role="region"
      >
        <Tab
          eventKey={0}
          title={<TabTitleText>Products</TabTitleText>}
          aria-label="Products"
        >
          <ProductList />
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>SBOMs</TabTitleText>}
          actions={
            <>
              <TabAction aria-label={`SBOM help popover`} ref={ref}>
                <HelpIcon />
              </TabAction>
              {sbomPopover(ref)}
            </>
          }
        >
          <SbomList />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Vulnerabilities</TabTitleText>}>
          <VulnerabilityList />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Packages</TabTitleText>}>
          <PackageList />
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Advisories</TabTitleText>}>
          <AdvisoryList />
        </Tab>
        <Tab eventKey={5} title={<TabTitleText>Importers</TabTitleText>}>
          <ImporterList />
        </Tab>
      </Tabs>
    </>
  );
};
