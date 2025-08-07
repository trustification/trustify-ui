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
import { useUploadAdvisory } from "@app/queries/advisories";
import { Paths } from "@app/Routes";

export const AdvisoryUpload: React.FC = () => {
  const { uploads, handleUpload, handleRemoveUpload } = useUploadAdvisory();

  return (
    <>
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.advisories}>Advisories</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Upload Advisory</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Content>
          <Content component="h1">Upload Advisory</Content>
          <Content component="p">Upload a CSAF, CVE, or OSV Advisory.</Content>
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
