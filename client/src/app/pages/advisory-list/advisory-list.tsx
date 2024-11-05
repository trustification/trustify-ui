import React from "react";

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { AdvisorySearchProvider } from "./advisory-context";
import { AdvisoryTable } from "./advisory-table";
import { AdvisoryToolbar } from "./advisory-toolbar";

export const AdvisoryList: React.FC = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Advisories</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <AdvisorySearchProvider>
            <AdvisoryToolbar />
            <AdvisoryTable />
          </AdvisorySearchProvider>
        </div>
      </PageSection>
    </>
  );
};
