import React from "react";

import {
  Flex,
  FlexItem,
  PageSection,
  Stack,
  StackItem,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { PathParam, useRouteParams } from "@app/Routes";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { useFetchPackageById } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

import { SbomsByPackage } from "./sboms-by-package";
import { VulnerabilitiesByPackage } from "./vulnerabilities-by-package";

export const PackageDetails: React.FC = () => {
  const packageId = useRouteParams(PathParam.PACKAGE_ID);
  const { pkg, isFetching, fetchError } = useFetchPackageById(packageId);

  const decomposedPurl = React.useMemo(() => {
    return pkg ? decomposePurl(pkg.purl) : undefined;
  }, [pkg]);

  // Tabs
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const vulnerabilitiesTabRef = React.createRef<HTMLElement>();
  const sbomsTabRef = React.createRef<HTMLElement>();

  return (
    <>
      <PageSection variant="light">
        <Stack>
          <StackItem>
            <TextContent>
              <Text component="h1">
                {decomposedPurl?.name ?? packageId ?? ""}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Flex>
              <FlexItem spacer={{ default: "spacerSm" }}>
                <p>version: {decomposedPurl?.version}</p>{" "}
              </FlexItem>
              <FlexItem>
                {decomposedPurl?.qualifiers && (
                  <PackageQualifiers value={decomposedPurl?.qualifiers} />
                )}
              </FlexItem>
            </Flex>
          </StackItem>
        </Stack>
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
            title={<TabTitleText>Vulnerabilities</TabTitleText>}
            tabContentId="refTabVulnerabilitiesSection"
            tabContentRef={vulnerabilitiesTabRef}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>SBOMs using package</TabTitleText>}
            tabContentId="refTabSbomsSection"
            tabContentRef={sbomsTabRef}
          />
        </Tabs>
      </PageSection>
      <PageSection>
        <TabContent
          eventKey={0}
          id="refTabVulnerabilitiesSection"
          ref={vulnerabilitiesTabRef}
          aria-label="Vulnerabilities of the Package"
        >
          {packageId && <VulnerabilitiesByPackage packageId={packageId} />}
        </TabContent>
        <TabContent
          eventKey={1}
          id="refTabSbomsSection"
          ref={sbomsTabRef}
          aria-label="SBOMs using the Package"
          hidden
        >
          <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
            {pkg?.purl && <SbomsByPackage purl={pkg.purl} />}
          </LoadingWrapper>
        </TabContent>
      </PageSection>
    </>
  );
};
