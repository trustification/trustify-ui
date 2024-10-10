import React from "react";

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { PackageSearchProvider } from "./package-context";
import { PackageTable } from "./package-table";
import { PackageToolbar } from "./package-toolbar";
import { AIAssistant } from "../../components/ai-assistant";

export const PackageList: React.FC = () => {
  return (
    <>
      <AIAssistant viewing={`a list of packages`} />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Packages</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <PackageSearchProvider>
            <PackageToolbar />
            <PackageTable />
          </PackageSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
