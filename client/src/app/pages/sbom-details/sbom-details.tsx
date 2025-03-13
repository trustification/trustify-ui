import React from "react";

import {
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  Popover,
  Split,
  SplitItem,
  Tab,
  TabAction,
  TabContent,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

import { PathParam, useRouteParams } from "@app/Routes";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useDownload } from "@app/hooks/domain-controls/useDownload";
import { useFetchSBOMById } from "@app/queries/sboms";

import { Overview } from "./overview";
import { PackagesBySbom } from "./packages-by-sbom";
import { VulnerabilitiesBySbom } from "./vulnerabilities-by-sbom";

export const SbomDetails: React.FC = () => {
  const sbomId = useRouteParams(PathParam.SBOM_ID);
  const { sbom, isFetching, fetchError } = useFetchSBOMById(sbomId);

  const { downloadSBOM, downloadSBOMLicenses } = useDownload();

  const [isActionsDropdownOpen, setIsActionsDropdownOpen] =
    React.useState(false);

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Tab refs
  const infoTabRef = React.createRef<HTMLElement>();
  const packagesTabRef = React.createRef<HTMLElement>();
  const vulnerabilitiesTabRef = React.createRef<HTMLElement>();

  // Tab popover refs
  const vulnerabilitiesTabPopoverRef = React.createRef<HTMLElement>();

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const handleActionsDropdownToggle = () => {
    setIsActionsDropdownOpen(!isActionsDropdownOpen);
  };

  return (
    <>
      <PageSection variant="light">
        <Split>
          <SplitItem isFilled>
            <Flex>
              <FlexItem spacer={{ default: "spacerSm" }}>
                <TextContent>
                  <Text component="h1">{sbom?.name ?? sbomId ?? ""}</Text>
                </TextContent>
              </FlexItem>
              <FlexItem>
                {sbom?.labels.type && (
                  <Label color="blue">{sbom?.labels.type}</Label>
                )}
              </FlexItem>
            </Flex>
          </SplitItem>
          <SplitItem>
            <Dropdown
              isOpen={isActionsDropdownOpen}
              onSelect={() => setIsActionsDropdownOpen(false)}
              onOpenChange={(isOpen) => setIsActionsDropdownOpen(isOpen)}
              popperProps={{ position: "right" }}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={handleActionsDropdownToggle}
                  isExpanded={isActionsDropdownOpen}
                >
                  Actions
                </MenuToggle>
              )}
              ouiaId="BasicDropdown"
              shouldFocusToggleOnSelect
            >
              <DropdownList>
                <DropdownItem
                  key="sbom"
                  onClick={() => {
                    if (sbomId) {
                      downloadSBOM(
                        sbomId,
                        sbom?.name ? `${sbom?.name}.json` : `${sbomId}.json`
                      );
                    }
                  }}
                >
                  Download SBOM
                </DropdownItem>
                <DropdownItem
                  key="license"
                  onClick={() => {
                    if (sbomId) {
                      downloadSBOMLicenses(sbomId);
                    }
                  }}
                >
                  Download License Report
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection type="nav">
        <Tabs
          mountOnEnter
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Tabs that contain the SBOM information"
          role="region"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Info</TabTitleText>}
            tabContentId="refTabInfoSection"
            tabContentRef={infoTabRef}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Packages</TabTitleText>}
            tabContentId="refTabPackagesSection"
            tabContentRef={packagesTabRef}
          />
          <Tab
            eventKey={2}
            title={<TabTitleText>Vulnerabilities</TabTitleText>}
            tabContentId="refVulnerabilitiesSection"
            tabContentRef={vulnerabilitiesTabRef}
            actions={
              <>
                <TabAction ref={vulnerabilitiesTabPopoverRef}>
                  <HelpIcon />
                </TabAction>
                <Popover
                  triggerRef={vulnerabilitiesTabPopoverRef}
                  bodyContent={
                    <div>
                      Any found vulnerabilities related to this SBOM. Fixed
                      vulnerabilities are not listed.
                    </div>
                  }
                />
              </>
            }
          />
        </Tabs>
      </PageSection>
      <PageSection>
        <TabContent
          eventKey={0}
          id="refTabInfoSection"
          ref={infoTabRef}
          aria-label="Information of the SBOM"
        >
          <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
            {sbom && <Overview sbom={sbom} />}
          </LoadingWrapper>
        </TabContent>
        <TabContent
          eventKey={1}
          id="refTabPackagesSection"
          ref={packagesTabRef}
          aria-label="Packages within the SBOM"
          hidden
        >
          {sbomId && <PackagesBySbom sbomId={sbomId} />}
        </TabContent>
        <TabContent
          eventKey={2}
          id="refVulnerabilitiesSection"
          ref={vulnerabilitiesTabRef}
          aria-label="Vulnerabilities within the SBOM"
          hidden
        >
          {sbomId && <VulnerabilitiesBySbom sbomId={sbomId} />}
        </TabContent>
      </PageSection>
    </>
  );
};
