import type React from "react";

import { Content, PageSection } from "@patternfly/react-core";

import { PackageSearchProvider } from "./package-context";
import { PackageTable } from "./package-table";
import { PackageToolbar } from "./package-toolbar";

export const PackageList: React.FC = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Packages</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <div>
          <PackageSearchProvider>
            <PackageToolbar showFilters />
            <PackageTable />
          </PackageSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
