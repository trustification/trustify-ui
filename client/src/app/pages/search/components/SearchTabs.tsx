import React, { type ReactElement, type ReactNode } from "react";

import {
  Badge,
  Card,
  CardBody,
  Icon,
  Popover,
  Split,
  SplitItem,
  Tab,
  TabAction,
  TabTitleText,
  Tabs,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import SpinnerIcon from "@patternfly/react-icons/dist/esm/icons/spinner-icon";

import type {
  AdvisorySummary,
  SbomSummary,
  VulnerabilitySummary,
} from "@app/client";
import {
  FilterPanel,
  type IFilterPanelProps,
} from "@app/components/FilterPanel";
import { AdvisoryTable } from "@app/pages/advisory-list/advisory-table";
import type { PackageTableData } from "@app/pages/package-list/package-context";
import { PackageTable } from "@app/pages/package-list/package-table";
import { SbomTable } from "@app/pages/sbom-list/sbom-table";
import { VulnerabilityTable } from "@app/pages/vulnerability-list/vulnerability-table";

export interface SearchTabsProps {
  filterPanelProps: {
    advisoryFilterPanelProps: IFilterPanelProps<
      AdvisorySummary,
      "" | "modified" | "average_severity"
    >;
    packageFilterPanelProps: IFilterPanelProps<
      PackageTableData,
      "" | "type" | "arch"
    >;
    sbomFilterPanelProps: IFilterPanelProps<SbomSummary, "" | "published">;
    vulnerabilityFilterPanelProps: IFilterPanelProps<
      VulnerabilitySummary,
      "" | "average_severity" | "published"
    >;
  };

  packageTable?: ReactElement;
  packageTotalCount: number;
  isFetchingPackages: boolean;

  sbomTable?: ReactElement;
  sbomTotalCount: number;
  isFetchingSboms: boolean;

  vulnerabilityTable?: ReactElement;
  vulnerabilityTotalCount: number;
  isFetchingVulnerabilities: boolean;

  advisoryTable?: ReactNode;
  advisoryTotalCount: number;
  isFetchingAdvisories: boolean;
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
  isFetchingPackages,
  isFetchingSboms,
  isFetchingVulnerabilities,
  isFetchingAdvisories,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const {
    sbomFilterPanelProps,
    packageFilterPanelProps,
    vulnerabilityFilterPanelProps,
    advisoryFilterPanelProps,
  } = filterPanelProps;

  const handleTabClick = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveTabKey(tabIndex);
  };

  const sbomPopoverRef = React.createRef<HTMLElement>();

  const sbomPopover = (popoverRef: React.RefObject<unknown>) => (
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
                  {isFetchingSboms ? (
                    <Icon size="sm">
                      <SpinnerIcon />
                    </Icon>
                  ) : (
                    sbomTotalCount
                  )}
                </Badge>
              </TabTitleText>
            }
            actions={
              <>
                <TabAction aria-label="SBOM help popover" ref={sbomPopoverRef}>
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
                  {isFetchingPackages ? (
                    <Icon size="sm">
                      <SpinnerIcon />
                    </Icon>
                  ) : (
                    packageTotalCount
                  )}
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
                  {isFetchingVulnerabilities ? (
                    <Icon size="sm">
                      <SpinnerIcon />
                    </Icon>
                  ) : (
                    vulnerabilityTotalCount
                  )}
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
                  {isFetchingAdvisories ? (
                    <Icon size="sm">
                      <SpinnerIcon />
                    </Icon>
                  ) : (
                    advisoryTotalCount
                  )}
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
