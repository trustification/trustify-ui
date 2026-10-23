import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
} from "@patternfly/react-core";
import { LockIcon } from "@patternfly/react-icons";
import type { AxiosError } from "axios";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { ReadOnlyContext } from "@app/components/ReadOnlyContext";
import { UploadFiles } from "@app/components/UploadFiles";
import { Paths } from "@app/Routes";
import { useUploadRemediationMapping } from "@app/queries/crypto";
import { getAxiosErrorMessage } from "@app/utils/utils";

const REMEDIATION_DROPZONE_ACCEPT = {
  "text/csv": [".csv"],
  "application/json": [".json"],
};

/** Full-page upload interface for importing PQC remediation mappings. */
export const CryptoRemediationUpload: React.FC = () => {
  const { areMutationsDisabled } = React.useContext(ReadOnlyContext);
  const { uploads, handleUpload, handleRemoveUpload } =
    useUploadRemediationMapping();

  return (
    <>
      <DocumentMetadata title="Import Remediation Mappings" />
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.cryptography}>Cryptography</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Import Remediation Mappings</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      {areMutationsDisabled ? (
        <PageSection>
          <EmptyState headingLevel="h1" icon={LockIcon} titleText="Unavailable">
            <EmptyStateBody>
              This instance is running in read-only mode. Importing remediation
              mappings is not available.
            </EmptyStateBody>
            <EmptyStateFooter>
              <Link to={Paths.cryptography}>Return to Cryptography</Link>
            </EmptyStateFooter>
          </EmptyState>
        </PageSection>
      ) : (
        <>
          <PageSection>
            <Content>
              <Content component="h1">Import Remediation Mappings</Content>
              <Content component="p">
                Upload a CSV or JSON file that maps non-compliant algorithms to
                their NIST-recommended PQC replacements.
              </Content>
            </Content>
          </PageSection>
          <PageSection>
            <UploadFiles
              fileUploadProps={{
                "aria-label": "remediation-mapping-uploader",
              }}
              uploads={uploads}
              handleUpload={handleUpload}
              handleRemoveUpload={handleRemoveUpload}
              extractSuccessMessage={(response) =>
                `${(response.data as { count: number }).count} mapping(s) imported`
              }
              extractErrorMessage={(err: AxiosError) =>
                getAxiosErrorMessage(err)
              }
              dropzoneAccept={REMEDIATION_DROPZONE_ACCEPT}
              infoText="Accepted file types: .csv, .json"
            />
          </PageSection>
        </>
      )}
    </>
  );
};
