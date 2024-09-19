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
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

export const Search: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isBox, setIsBox] = React.useState<boolean>(false);
  const ref = React.createRef<HTMLElement>();

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
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
      </PageSection>
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        isBox={isBox}
        aria-label="Tabs"
        role="region"
      >
        <Tab
          eventKey={0}
          title={<TabTitleText>Products</TabTitleText>}
          aria-label="Products"
        >
          Products
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
          SBOMs
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Vulnerabilities</TabTitleText>}>
          Vulnerabilities
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Packages</TabTitleText>}>
          Packages
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Advisories</TabTitleText>}>
          Advisories
        </Tab>
        <Tab eventKey={5} title={<TabTitleText>Importers</TabTitleText>}>
          Importers
        </Tab>
      </Tabs>
    </>
  );
};
