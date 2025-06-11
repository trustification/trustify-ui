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
import { AdvisoryToolbar } from "@app/pages/advisory-list/advisory-toolbar";
import type { PackageTableData } from "@app/pages/package-list/package-context";
import { PackageTable } from "@app/pages/package-list/package-table";
import { PackageToolbar } from "@app/pages/package-list/package-toolbar";
import { SbomTable } from "@app/pages/sbom-list/sbom-table";
import { SbomToolbar } from "@app/pages/sbom-list/sbom-toolbar";
import { VulnerabilityTable } from "@app/pages/vulnerability-list/vulnerability-table";
import { VulnerabilityToolbar } from "@app/pages/vulnerability-list/vulnerability-toolbar";

export interface SearchTabsProps {
  filterPanelProps: {
    advisoryFilterPanelProps: IFilterPanelProps<
      AdvisorySummary,
      "" | "modified" | "average_severity" | "labels"
    >;
    packageFilterPanelProps: IFilterPanelProps<
      PackageTableData,
      "" | "type" | "arch"
    >;
    sbomFilterPanelProps: IFilterPanelProps<
      SbomSummary,
      "" | "published" | "labels"
    >;
    vulnerabilityFilterPanelProps: IFilterPanelProps<
      VulnerabilitySummary,
      "" | "base_severity" | "published"
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
                <Popover
                  bodyContent={
                    <div>
                      A list of ingested Software Bill of Materials (SBOM)
                      documents.
                    </div>
                  }
                  position={"right"}
                  triggerRef={sbomPopoverRef}
                />
              </>
            }
          >
            <SbomToolbar />
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
            actions={
              <>
                <TabAction
                  aria-label="Package help popover"
                  ref={packagePopoverRef}
                >
                  <HelpIcon />
                </TabAction>
                <Popover
                  bodyContent={
                    <div>
                      A list of packages along with the count of
                      vulnerabilities.
                    </div>
                  }
                  position={"right"}
                  triggerRef={packagePopoverRef}
                />
              </>
            }
          >
            <PackageToolbar />
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
            actions={
              <>
                <TabAction
                  aria-label="Vulnerability help popover"
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
            <VulnerabilityToolbar />
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
            actions={
              <>
                <TabAction
                  aria-label="Advisory help popover"
                  ref={advisoryPopoverRef}
                >
                  <HelpIcon />
                </TabAction>
                <Popover
                  bodyContent={<div>A list of available advisories.</div>}
                  position={"right"}
                  triggerRef={advisoryPopoverRef}
                />
              </>
            }
          >
            <AdvisoryToolbar />
            {advisoryTable ?? <AdvisoryTable />}
          </Tab>
        </Tabs>
      </SplitItem>
    </Split>
  );
};
