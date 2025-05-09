import type React from "react";

import { Content, PageSection } from "@patternfly/react-core";

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
            <SbomToolbar showFilters />
            <SbomTable />
          </SbomSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
