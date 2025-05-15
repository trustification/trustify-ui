import type React from "react";

import { Content, PageSection } from "@patternfly/react-core";

import { AdvisorySearchProvider } from "./advisory-context";
import { AdvisoryTable } from "./advisory-table";
import { AdvisoryToolbar } from "./advisory-toolbar";

export const AdvisoryList: React.FC = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Advisories</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <div>
          <AdvisorySearchProvider>
            <AdvisoryToolbar showFilters />
            <AdvisoryTable />
          </AdvisorySearchProvider>
        </div>
      </PageSection>
    </>
  );
};
