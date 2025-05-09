import React from "react";

import {
  Button,
  Content,
  Flex,
  FlexItem,
  Label,
  PageSection,
  Split,
  SplitItem,
  Tab,
  TabContent,
  TabTitleText,
  Tabs,
} from "@patternfly/react-core";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { PathParam, useRouteParams } from "@app/Routes";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useDownload } from "@app/hooks/domain-controls/useDownload";
import { useFetchAdvisoryById } from "@app/queries/advisories";

import { Overview } from "./overview";
import { VulnerabilitiesByAdvisory } from "./vulnerabilities-by-advisory";

export const AdvisoryDetails: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveTabKey(tabIndex);
  };

  const infoTabRef = React.createRef<HTMLElement>();
  const vulnerabilitiesTabRef = React.createRef<HTMLElement>();

  //

  const advisoryId = useRouteParams(PathParam.ADVISORY_ID);
  const { advisory, isFetching, fetchError } = useFetchAdvisoryById(advisoryId);

  const { downloadAdvisory } = useDownload();

  return (
    <>
      <PageSection>
        <Split>
          <SplitItem isFilled>
            <Flex>
              <FlexItem spacer={{ default: "spacerSm" }}>
                <Content>
                  <Content component="h1">
                    {advisory?.document_id ?? advisoryId ?? ""}
                  </Content>
                  <Content component="p">Advisory detail information</Content>
                </Content>
              </FlexItem>
              <FlexItem>
                {advisory?.labels.type && (
                  <Label color="blue">{advisory?.labels.type}</Label>
                )}
              </FlexItem>
            </Flex>
          </SplitItem>
          <SplitItem>
            {!isFetching && (
              <Button
                variant="secondary"
                icon={<DownloadIcon />}
                onClick={() => {
                  if (advisoryId) {
                    downloadAdvisory(
                      advisoryId,
                      advisory?.identifier
                        ? `${advisory?.identifier}.json`
                        : `${advisoryId}.json`,
                    );
                  }
                }}
              >
                Download
              </Button>
            )}
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection type="tabs">
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
            title={<TabTitleText>Vulnerabilities</TabTitleText>}
            tabContentId="refVulnerabilitiesSection"
            tabContentRef={vulnerabilitiesTabRef}
          />
        </Tabs>
      </PageSection>
      <PageSection>
        <TabContent
          eventKey={0}
          id="refTabInfoSection"
          ref={infoTabRef}
          aria-label="Information of the Advisory"
        >
          <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
            {advisory && <Overview advisory={advisory} />}
          </LoadingWrapper>
        </TabContent>
        <TabContent
          eventKey={1}
          id="refVulnerabilitiesSection"
          ref={vulnerabilitiesTabRef}
          aria-label="Vulnerabilities within the SBOM"
          hidden
        >
          <VulnerabilitiesByAdvisory
            isFetching={isFetching}
            fetchError={fetchError}
            vulnerabilities={advisory?.vulnerabilities || []}
          />
        </TabContent>
      </PageSection>
    </>
  );
};
