import type React from "react";
import { useSearchParams } from "react-router-dom";

import { Content, PageSection } from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";

import { SbomSearchProvider } from "./sbom-provider";
import { SbomTable } from "./sbom-table";
import { SbomToolbar } from "./sbom-toolbar";

export const SbomList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const cryptoAlgorithms = searchParams.getAll("crypto");

  return (
    <>
      <DocumentMetadata title="SBOMs" />
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">SBOMs</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <div>
          <SbomSearchProvider
            isBulkSelectionEnabled
            cryptoAlgorithms={cryptoAlgorithms}
          >
            <SbomToolbar showFilters showActions />
            <SbomTable />
          </SbomSearchProvider>
        </div>
      </PageSection>
    </>
  );
};
