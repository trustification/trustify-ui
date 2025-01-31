import React from "react";

import { PageSection, Content } from "@patternfly/react-core";

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
            <AdvisoryToolbar />
            <AdvisoryTable />
          </AdvisorySearchProvider>
        </div>
      </PageSection>
    </>
  );
};
