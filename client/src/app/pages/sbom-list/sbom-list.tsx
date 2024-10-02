import React from "react";

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { SbomSearchProvider } from "./sbom-context";
import { SbomTable } from "./sbom-table";
import { SbomToolbar } from "./sbom-toolbar";
import { AIAssistant } from "../../components/ai-assistant";

export const SbomList: React.FC = () => {
  return (
    <>
      <AIAssistant viewing={`a list of SBOMs`} />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">SBOMs</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <SbomSearchProvider>
            <SbomToolbar />
            <SbomTable />
          </SbomSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
