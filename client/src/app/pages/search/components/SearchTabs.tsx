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
  };

  const sbomPopoverRef = React.createRef<HTMLElement>();
  const packagePopoverRef = React.createRef<HTMLElement>();
  const vulnerabilityPopoverRef = React.createRef<HTMLElement>();
  const advisoryPopoverRef = React.createRef<HTMLElement>();

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
          mountOnEnter
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
                <Popover
                  bodyContent={
                    <div>
                      A list of ingested Software Bill of Materials (SBOM)
                      documents for products and containers.
                    </div>
                  }
                  position={"right"}
                  triggerRef={sbomPopoverRef}
                />
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
            actions={
              <>
                <TabAction
                  aria-label={`Package help popover`}
                  ref={packagePopoverRef}
                >
                  <HelpIcon />
                </TabAction>
                <Popover
                  bodyContent={
                    <div>
                      A list of package types and versions with any known
                      vulnerabilities.
                    </div>
                  }
                  position={"right"}
                  triggerRef={packagePopoverRef}
                />
              </>
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
            actions={
              <>
                <TabAction
                  aria-label={`Vulnerability help popover`}
                  ref={vulnerabilityPopoverRef}
                >
                  <HelpIcon />
                </TabAction>
                <Popover
                  bodyContent={
                    <div>
                      A list of publicly known Common Vulnerabilities and
                      Exposures (CVE).
                    </div>
                  }
                  position={"right"}
                  triggerRef={vulnerabilityPopoverRef}
                />
              </>
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
            actions={
              <>
                <TabAction
                  aria-label={`Advisory help popover`}
                  ref={advisoryPopoverRef}
                >
                  <HelpIcon />
                </TabAction>
                <Popover
                  bodyContent={
                    <div>
                      A list of available advisories from software vendors.
                    </div>
                  }
                  position={"right"}
                  triggerRef={advisoryPopoverRef}
                />
              </>
            }
          >
            {advisoryTable ?? <AdvisoryTable />}
          </Tab>
        </Tabs>
      </SplitItem>
    </Split>
  );
};
