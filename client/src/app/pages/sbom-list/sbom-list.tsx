import React from "react";

import { PageSection, Content } from "@patternfly/react-core";

import { SbomSearchProvider } from "./sbom-context";
import { SbomTable } from "./sbom-table";
import { SbomToolbar } from "./sbom-toolbar";

export const SbomList: React.FC = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">SBOMs</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <div>
          <SbomSearchProvider>
            <SbomToolbar />
            <SbomTable />
          </SbomSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
