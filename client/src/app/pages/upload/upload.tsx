import React from "react";

import type { AxiosError, AxiosResponse } from "axios";

import {
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  Popover,
  Tab,
  TabAction,
  TabContent,
  TabContentBody,
  TabTitleText,
  Tabs,
  Text,
  TextContent,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

import { useUploadAdvisory } from "@app/queries/advisories";
import { useUploadSBOM } from "@app/queries/sboms";

import { UploadFiles } from "./components/upload-file";

export const ImporterList: React.FC = () => {
  const {
    uploads: sbomUploads,
    handleUpload: handleSbomUpload,
    handleRemoveUpload: handleSbomRemoveUpload,
  } = useUploadSBOM();
  const {
    uploads: advisoryUploads,
    handleUpload: handleAdvisoryUpload,
    handleRemoveUpload: handleAdvisoryRemoveUpload,
  } = useUploadAdvisory();

  const sbomPopupRef = React.createRef<HTMLElement>();
  const advisoryPopupRef = React.createRef<HTMLElement>();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Upload</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <Tabs defaultActiveKey={0}>
              <Tab
                eventKey={0}
                title={<TabTitleText>SBOM</TabTitleText>}
                actions={
                  <>
                    <TabAction ref={sbomPopupRef}>
                      <HelpIcon />
                    </TabAction>
                    <Popover
                      bodyContent={
                        <div>
                          Upload a Software Bill of Materials (SBOM) document.
                          We accept CycloneDX versions 1.3, 1.4, and 1.5, and
                          System Package Data Exchange (SPDX) versions 2.2, and
                          2.3.
                        </div>
                      }
                      triggerRef={sbomPopupRef}
                    />
                  </>
                }
              >
                <TabContent id="upload-sbom-tab-content">
                  <TabContentBody hasPadding>
                    <UploadFiles
                      uploads={sbomUploads}
                      handleUpload={handleSbomUpload}
                      handleRemoveUpload={handleSbomRemoveUpload}
                      extractSuccessMessage={(
                        response: AxiosResponse<{ document_id: string }>,
                      ) => {
                        return `${response.data.document_id} uploaded`;
                      }}
                      extractErrorMessage={(error: AxiosError) =>
                        error.response?.data
                          ? error.message
                          : "Error while uploading file"
                      }
                    />
                  </TabContentBody>
                </TabContent>
              </Tab>
              <Tab
                eventKey={1}
                title={<TabTitleText>Advisory</TabTitleText>}
                actions={
                  <>
                    <TabAction ref={advisoryPopupRef}>
                      <HelpIcon />
                    </TabAction>
                    <Popover
                      bodyContent={
                        <div>Upload a CSAF, CVE, or OSV Advisory.</div>
                      }
                      triggerRef={advisoryPopupRef}
                    />
                  </>
                }
              >
                <TabContent id="upload-advisory-tab-content">
                  <TabContentBody hasPadding>
                    <UploadFiles
                      uploads={advisoryUploads}
                      handleUpload={handleAdvisoryUpload}
                      handleRemoveUpload={handleAdvisoryRemoveUpload}
                      extractSuccessMessage={(
                        response: AxiosResponse<{ document_id: string }>,
                      ) => {
                        return `${response.data.document_id} uploaded`;
                      }}
                      extractErrorMessage={(error: AxiosError) =>
                        error.response?.data
                          ? error.message
                          : "Error while uploading file"
                      }
                    />
                  </TabContentBody>
                </TabContent>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};
