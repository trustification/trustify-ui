import React from "react";
import { Link } from "react-router-dom";

import type { AxiosResponse } from "axios";

import type { IngestResult } from "@app/client";

import {
  Breadcrumb,
  BreadcrumbItem,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
} from "@patternfly/react-core";
import LockIcon from "@patternfly/react-icons/dist/esm/icons/lock-icon";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { ReadOnlyContext } from "@app/components/ReadOnlyContext";
import { UploadFiles } from "@app/components/UploadFiles";
import { useUploadSBOM } from "@app/queries/sboms";
import { Paths } from "@app/Routes";
import { getAxiosErrorMessage } from "@app/utils/utils";

export const SbomUpload: React.FC = () => {
  const { areMutationsDisabled } = React.useContext(ReadOnlyContext);
  const { uploads, handleUpload, handleRemoveUpload } = useUploadSBOM();

  return (
    <>
      <DocumentMetadata title="Upload SBOM" />
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.sboms}>SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Upload SBOM</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      {areMutationsDisabled ? (
        <PageSection>
          <EmptyState
            headingLevel="h1"
            icon={LockIcon}
            titleText="Uploads unavailable"
          >
            <EmptyStateBody>
              This instance is running in read-only mode. Uploading SBOMs is not
              available.
            </EmptyStateBody>
            <EmptyStateFooter>
              <Link to={Paths.sboms}>Return to SBOMs</Link>
            </EmptyStateFooter>
          </EmptyState>
        </PageSection>
      ) : (
        <>
          <PageSection>
            <Content>
              <Content component="h1">Upload SBOM</Content>
              <Content component="p">
                Upload a Software Bill of Materials (SBOM) document. We accept
                CycloneDX versions 1.3, 1.4, 1.5, 1.6 and 1.7, and System
                Package Data Exchange (SPDX) versions 2.2, and 2.3.
              </Content>
            </Content>
          </PageSection>
          <PageSection>
            <UploadFiles
              fileUploadProps={{ "aria-label": "sbom-uploader" }}
              uploads={uploads}
              handleUpload={handleUpload}
              handleRemoveUpload={handleRemoveUpload}
              isDuplicate={(response: AxiosResponse<IngestResult>) =>
                response.data.duplicate === true
              }
              extractSuccessMessage={(
                response: AxiosResponse<IngestResult>,
              ) => {
                if (response.data.duplicate) {
                  return `${response.data.document_id ?? response.data.id} already uploaded`;
                }
                return `${response.data.document_id} uploaded`;
              }}
              extractErrorMessage={getAxiosErrorMessage}
            />
          </PageSection>
        </>
      )}
    </>
  );
};
