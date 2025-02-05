import React, { ReactElement, ReactNode } from "react";

import {
  Badge,
  Card,
  CardBody,
  Popover,
  Split,
  SplitItem,
  Tab,
  TabAction,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";

import { FilterPanel } from "@app/components/FilterPanel";
import { AdvisoryTable } from "@app/pages/advisory-list/advisory-table";
import { PackageTable } from "@app/pages/package-list/package-table";
import { SbomTable } from "@app/pages/sbom-list/sbom-table";
import { VulnerabilityTable } from "@app/pages/vulnerability-list/vulnerability-table";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import { SbomSearchContext } from "@app/pages/sbom-list/sbom-context";
import { PackageSearchContext } from "@app/pages/package-list/package-context";
import { VulnerabilitySearchContext } from "@app/pages/vulnerability-list/vulnerability-context";
import { AdvisorySearchContext } from "@app/pages/advisory-list/advisory-context";

export interface SearchTabsProps {
  filterPanelProps: {
    advisoryFilterPanelProps?: any;
    packageFilterPanelProps?: any;
    sbomFilterPanelProps?: any;
    vulnerabilityFilterPanelProps?: any;
  };
  packageTable?: ReactElement;
  packageTotalCount: number;
  sbomTable?: ReactElement;
  sbomTotalCount: number;
  vulnerabilityTable?: ReactElement;
  vulnerabilityTotalCount: number;
  advisoryTable?: ReactNode;
  advisoryTotalCount: number;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  filterPanelProps,
  sbomTable,
  sbomTotalCount,
  packageTable,
  packageTotalCount,
  vulnerabilityTable,
  vulnerabilityTotalCount,
  advisoryTable,
  advisoryTotalCount,
}) => {
  const { setRefetchDisabled: setSbomRefetchDisabled } =
    React.useContext(SbomSearchContext);
  const { setRefetchDisabled: setPackageRefetchDisabled } =
    React.useContext(PackageSearchContext);
  const { setRefetchDisabled: setVulnerabilityRefetchDisabled } =
    React.useContext(VulnerabilitySearchContext);
  const { setRefetchDisabled: setAdvisoryRefetchDisabled } = React.useContext(
    AdvisorySearchContext
  );

  const tabs = {
    sboms: {
      setRefetchDisabled: setSbomRefetchDisabled
    },
  };

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const {
    sbomFilterPanelProps,
    packageFilterPanelProps,
    vulnerabilityFilterPanelProps,
    advisoryFilterPanelProps,
  } = filterPanelProps;

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);

    setSbomRefetchDisabled(false);
    setPackageRefetchDisabled(false);
    setVulnerabilityRefetchDisabled(false);
    setAdvisoryRefetchDisabled(false);

    switch (tabIndex) {
      case 0:
        setSbomRefetchDisabled(true);
        break;

      default:
        break;
    }
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
    <Split hasGutter>
      <SplitItem>
        <Card isFullHeight>
          <CardBody style={{ width: 241 }}>
            {activeTabKey === 0 ? (
              <FilterPanel
                omitFilterCategoryKeys={[""]}
                {...sbomFilterPanelProps}
              />
            ) : activeTabKey === 1 ? (
              <FilterPanel
                omitFilterCategoryKeys={[""]}
                {...packageFilterPanelProps}
              />
            ) : activeTabKey === 2 ? (
              <FilterPanel
                omitFilterCategoryKeys={[""]}
                {...vulnerabilityFilterPanelProps}
              />
            ) : activeTabKey === 3 ? (
              <FilterPanel
                omitFilterCategoryKeys={[""]}
                {...advisoryFilterPanelProps}
              />
            ) : null}
          </CardBody>
        </Card>
      </SplitItem>
      <SplitItem isFilled>
        <Tabs
          isBox
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
            {sbomTable ?? <SbomTable />}
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
            {packageTable ?? <PackageTable />}
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
            {vulnerabilityTable ?? <VulnerabilityTable />}
          </Tab>
          <Tab
            eventKey={3}
            title={
              <TabTitleText>
                Advisories{"  "}
                <Badge screenReaderText="Advisory Result Count">
                  {advisoryTotalCount}
                </Badge>
              </TabTitleText>
            }
          >
            {advisoryTable ?? <AdvisoryTable />}
          </Tab>
        </Tabs>
      </SplitItem>
    </Split>
  );
};
