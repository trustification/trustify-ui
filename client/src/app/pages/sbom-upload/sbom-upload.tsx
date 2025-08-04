import type React from "react";
import { Link } from "react-router-dom";

import type { AxiosError, AxiosResponse } from "axios";

import {
  Breadcrumb,
  BreadcrumbItem,
  Content,
  PageSection,
} from "@patternfly/react-core";

import { UploadFiles } from "@app/components/UploadFiles";
import { useUploadSBOM } from "@app/queries/sboms";
import { Paths } from "@app/Routes";

export const SbomUpload: React.FC = () => {
  const { uploads, handleUpload, handleRemoveUpload } = useUploadSBOM();

  return (
    <>
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.sboms}>SBOMs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Upload SBOM</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Content>
          <Content component="h1">Upload SBOM</Content>
          <Content component="p">
            Upload a Software Bill of Materials (SBOM) document. We accept
            CycloneDX versions 1.3, 1.4, 1.5 and 1.6, and System Package Data
            Exchange (SPDX) versions 2.2, and 2.3.
          </Content>
        </Content>
      </PageSection>
      <PageSection>
        <UploadFiles
          uploads={uploads}
          handleUpload={handleUpload}
          handleRemoveUpload={handleRemoveUpload}
          extractSuccessMessage={(
            response: AxiosResponse<{ document_id: string }>,
          ) => {
            return `${response.data.document_id} uploaded`;
          }}
          extractErrorMessage={(error: AxiosError) =>
            error.response?.data ? error.message : "Error while uploading file"
          }
        />
      </PageSection>
    </>
  );
};
