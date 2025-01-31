import React from "react";

import { AxiosError, AxiosResponse } from "axios";

import {
  Card,
  CardBody,
  PageSection,
  Tab,
  TabContent,
  TabContentBody,
  Tabs,
  TabTitleText,
  Content,
} from "@patternfly/react-core";

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

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Upload</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Tabs defaultActiveKey={0}>
              <Tab eventKey={0} title={<TabTitleText>SBOM</TabTitleText>}>
                <TabContent id="upload-sbom-tab-content">
                  <TabContentBody hasPadding>
                    <UploadFiles
                      uploads={sbomUploads}
                      handleUpload={handleSbomUpload}
                      handleRemoveUpload={handleSbomRemoveUpload}
                      extractSuccessMessage={(
                        response: AxiosResponse<{ document_id: string }>
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
              <Tab eventKey={1} title={<TabTitleText>Advisory</TabTitleText>}>
                <TabContent id="upload-advisory-tab-content">
                  <TabContentBody hasPadding>
                    <UploadFiles
                      uploads={advisoryUploads}
                      handleUpload={handleAdvisoryUpload}
                      handleRemoveUpload={handleAdvisoryRemoveUpload}
                      extractSuccessMessage={(
                        response: AxiosResponse<{ document_id: string }>
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
