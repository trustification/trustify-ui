import React from "react";

import { PageSection, Content } from "@patternfly/react-core";

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
            <PackageToolbar />
            <PackageTable />
          </PackageSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
