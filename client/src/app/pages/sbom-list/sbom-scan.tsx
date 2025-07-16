import React from "react";
import { Link } from "react-router-dom";

import type { AxiosError } from "axios";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
} from "@patternfly/react-core";
import { InProgressIcon } from "@patternfly/react-icons";

import type { ExtractResult } from "@app/client";
import { StateError } from "@app/components/StateError";
import { UploadFiles } from "@app/components/UploadFile";
import { useVulnerabilitiesOfPackages } from "@app/hooks/domain-controls/useVulnerabilitiesOfPackage";
import { useUploadAndAnalyzeSBOM } from "@app/queries/sboms-analysis";

export const SbomScan: React.FC = () => {
  const [extractedData, setExtractedData] =
    React.useState<ExtractResult | null>(null);

  const purls = React.useMemo(() => {
    return Object.entries(extractedData?.packages ?? {}).flatMap(
      ([_packageName, { purls }]) => {
        return purls;
      },
    );
  }, [extractedData]);

  const { uploads, handleUpload, handleRemoveUpload } = useUploadAndAnalyzeSBOM(
    (extractedData, _file) => setExtractedData(extractedData),
  );

  const { data, isFetching, fetchError } = useVulnerabilitiesOfPackages(purls);

  
  return (
    <>
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/sboms">SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Scan SBOM</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Content>
          <Content component="h1">Scan SBOM</Content>
          <Content component="p">
            This is a temporary scan to help you assess an SBOM. Your file will
            not be uploaded or stored.
          </Content>
        </Content>
      </PageSection>
      <PageSection>
        {isFetching ? (
          <EmptyState
            titleText="Scanning SBOM"
            headingLevel="h4"
            icon={InProgressIcon}
          >
            <EmptyStateBody>
              Analyzing your SBOM for security vulnerabilities, license issues
              and dependency details.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link">Cancel</Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : fetchError ? (
          <StateError />
        ) : !extractedData ? (
          <UploadFiles
            uploads={uploads}
            handleUpload={handleUpload}
            handleRemoveUpload={handleRemoveUpload}
            extractSuccessMessage={() => {
              return "Ready for analysis";
            }}
            // biome-ignore lint/suspicious/noExplicitAny: allowed
            extractErrorMessage={(error: AxiosError<any>) => {
              return error.response?.data?.message
                ? error.response?.data?.message
                : (error.message ?? "Error while uploading file");
            }}
            dropzoneProps={{
              multiple: false,
            }}
          />
        ) : (
          "report"
        )}
      </PageSection>
    </>
  );
};

export { SbomScan as default };
