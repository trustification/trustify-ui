import React from "react";

import {
  Flex,
  FlexItem,
  PageSection,
  Stack,
  StackItem,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { PathParam, useRouteParams } from "@app/Routes";
import { PackageQualifiers } from "@app/components/PackageQualifiers";
import { useFetchPackageById } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

import { SbomsByPackage } from "./sboms-by-package";
import { VulnerabilitiesByPackage } from "./vulnerabilities-by-package";

export const PackageDetails: React.FC = () => {
  const packageId = useRouteParams(PathParam.PACKAGE_ID);
  const { pkg } = useFetchPackageById(packageId);

  const decomposedPurl = React.useMemo(() => {
    return pkg ? decomposePurl(pkg.purl) : undefined;
  }, [pkg]);

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
      <PageSection>
        <Tabs isBox defaultActiveKey={0} role="region">
          <Tab
            eventKey={0}
            title={<TabTitleText>Vulnerabilities</TabTitleText>}
          >
            {packageId && <VulnerabilitiesByPackage packageId={packageId} />}
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>Products using package</TabTitleText>}
          >
            {packageId && <SbomsByPackage packageId={packageId} />}
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
