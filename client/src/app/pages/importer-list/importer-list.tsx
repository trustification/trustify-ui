import type React from "react";

import { Content, PageSection } from "@patternfly/react-core";

import { ImporterListTable } from "./importer-list-table";

export const ImporterList: React.FC = () => {
  return (
    <>
      <PageSection>
        <Content>
          <h1>Data sources</h1>
        </Content>
      </PageSection>
      <PageSection>
        <ImporterListTable />
      </PageSection>
    </>
  );
};
