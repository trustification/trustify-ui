import type React from "react";

import type { AxiosError, AxiosResponse } from "axios";

import { Content } from "@patternfly/react-core";

import {
  type IPageDrawerContentProps,
  PageDrawerContent,
} from "@app/components/PageDrawerContext";
import { UploadFiles } from "@app/pages/upload/components/upload-file";
import { useUploadAdvisory } from "@app/queries/advisories";

export interface IUploadDrawerProps
  extends Pick<IPageDrawerContentProps, "onCloseClick"> {
  isExpanded: boolean;
}

export const UploadDrawer: React.FC<IUploadDrawerProps> = ({
  isExpanded,
  onCloseClick,
}) => {
  const { uploads, handleUpload, handleRemoveUpload } = useUploadAdvisory();

  return (
    <PageDrawerContent
      isExpanded={isExpanded}
      onCloseClick={onCloseClick}
      focusKey="upload-advisory"
      pageKey="advisory-list"
      header={
        <Content>
          <h2>Upload Advisories</h2>
        </Content>
      }
    >
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
    </PageDrawerContent>
  );
};
