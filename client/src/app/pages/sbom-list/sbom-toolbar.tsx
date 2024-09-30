import React from "react";

import { AxiosError, AxiosResponse } from "axios";

import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import { UploadFilesDrawer } from "@app/components/UploadFilesDrawer";
import { useUploadSBOM } from "@app/queries/sboms";

import { SbomSearchContext } from "./sbom-context";

interface ISbomToolbar {}

export const SbomToolbar: React.FC<ISbomToolbar> = ({}) => {
  const { tableControls } = React.useContext(SbomSearchContext);

  const {
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
  } = tableControls;

  const [showUploadComponent, setShowUploadComponent] = React.useState(false);
  const { uploads, handleUpload, handleRemoveUpload } = useUploadSBOM();

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} />
          <ToolbarItem>
            <Button
              type="button"
              id="upload"
              aria-label="Upload"
              variant="secondary"
              onClick={() => setShowUploadComponent(true)}
            >
              Upload
            </Button>
          </ToolbarItem>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="sbom-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <UploadFilesDrawer
        isExpanded={showUploadComponent}
        uploads={uploads}
        handleUpload={handleUpload}
        handleRemoveUpload={handleRemoveUpload}
        extractSuccessMessage={(
          response: AxiosResponse<{ document_id: string }>
        ) => {
          return `${response.data.document_id} uploaded`;
        }}
        extractErrorMessage={(error: AxiosError) =>
          error.response?.data ? error.message : "Error while uploading file"
        }
        onCloseClick={() => setShowUploadComponent(false)}
      />
    </>
  );
};
