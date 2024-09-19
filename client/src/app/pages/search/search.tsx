import React from "react";
import ProductList from "@app/pages/product-list";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import {
  Tabs,
  Tab,
  TabTitleText,
  Checkbox,
  Tooltip,
} from "@patternfly/react-core";

export const Search: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isBox, setIsBox] = React.useState<boolean>(false);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const tooltip = (
    <Tooltip content="Aria-disabled tabs are like disabled tabs, but focusable. Allows for tooltip support." />
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
        <Tab eventKey={1} title={<TabTitleText>SBOMs</TabTitleText>}>
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
        <Tab
          tooltip={tooltip}
          eventKey={5}
          title={<TabTitleText>Importers</TabTitleText>}
        >
          Importers
        </Tab>
      </Tabs>
    </>
  );
};
