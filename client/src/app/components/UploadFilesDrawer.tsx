import {
  DropEvent,
  HelperText,
  HelperTextItem,
  List,
  ListItem,
  Modal,
  MultipleFileUpload,
  MultipleFileUploadMain,
  MultipleFileUploadStatus,
  MultipleFileUploadStatusItem,
  TextContent,
  Title,
} from "@patternfly/react-core";
import * as React from "react";
import { FileRejection } from "react-dropzone";

import FileIcon from "@patternfly/react-icons/dist/esm/icons/file-code-icon";
import UploadIcon from "@patternfly/react-icons/dist/esm/icons/upload-icon";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import {
  IPageDrawerContentProps,
  PageDrawerContent,
} from "@app/components/PageDrawerContext";
import { AxiosError, AxiosResponse, CancelTokenSource } from "axios";

interface Upload {
  progress: number;
  status: "queued" | "inProgress" | "complete";
  response?: AxiosResponse;
  error?: AxiosError;
  wasCancelled: boolean;
  cancelFn?: CancelTokenSource;
}

export interface IUploadFilesDrawerProps
  extends Pick<IPageDrawerContentProps, "onCloseClick"> {
  isExpanded: boolean;
  uploads: Map<File, Upload>;
  handleUpload: (files: File[]) => void;
  handleRemoveUpload: (file: File) => void;
  extractSuccessMessage: (response: AxiosResponse) => string;
  extractErrorMessage: (error: AxiosError) => string;
}

export const UploadFilesDrawer: React.FC<IUploadFilesDrawerProps> = ({
  isExpanded,
  uploads,
  onCloseClick,
  handleUpload,
  handleRemoveUpload,
  extractSuccessMessage,
  extractErrorMessage,
}) => {
  const [showStatus, setShowStatus] = React.useState(false);
  const [statusIcon, setStatusIcon] = React.useState<
    "danger" | "success" | "inProgress"
  >("inProgress");
  const [rejectedFiles, setRejectedFiles] = React.useState<FileRejection[]>([]);

  // only show the status component once a file has been uploaded, but keep the status list component itself even if all files are removed
  if (!showStatus && uploads.size > 0) {
    setShowStatus(true);
  }

  // determine the icon that should be shown for the overall status list
  React.useEffect(() => {
    const currentUploads = Array.from(uploads.values());
    if (currentUploads.some((e) => e.status === "inProgress")) {
      setStatusIcon("inProgress");
    } else if (currentUploads.every((e) => e.status === "complete")) {
      setStatusIcon("success");
    } else {
      setStatusIcon("danger");
    }
  }, [uploads]);

  const removeFiles = (filesToRemove: File[]) => {
    filesToRemove.forEach((e) => {
      handleRemoveUpload(e);
    });
  };

  // callback that will be called by the react dropzone with the newly dropped file objects
  const handleFileDrop = (_event: DropEvent, droppedFiles: File[]) => {
    handleUpload(droppedFiles);
  };

  // dropzone prop that communicates to the user that files they've attempted to upload are not an appropriate type
  const handleDropRejected = (fileRejections: FileRejection[]) => {
    setRejectedFiles(fileRejections);
  };

  const successFileCount = Array.from(uploads.values()).filter(
    (upload) => upload.response
  ).length;

  return (
    <PageDrawerContent
      isExpanded={isExpanded}
      onCloseClick={onCloseClick}
      // focusKey={isExpanded}
      pageKey="upload-files"
      drawerPanelContentProps={{ defaultSize: "600px" }}
      header={
        <TextContent>
          <Title headingLevel="h2" size="lg" className={spacing.mtXs}>
            Upload files
          </Title>
        </TextContent>
      }
    >
      <MultipleFileUpload
        onFileDrop={handleFileDrop}
        dropzoneProps={{
          accept: {
            "application/xml": [".json"],
          },
          onDropRejected: handleDropRejected,
        }}
        isHorizontal
      >
        <MultipleFileUploadMain
          titleIcon={<UploadIcon />}
          titleText="Drag and drop files here"
          titleTextSeparator="or"
          infoText="Accepted file types: JSON"
        />
        {showStatus && (
          <MultipleFileUploadStatus
            statusToggleText={`${successFileCount} of ${uploads.size} files uploaded`}
            statusToggleIcon={statusIcon}
          >
            {Array.from(uploads.entries()).map(([file, upload], index) => (
              <MultipleFileUploadStatusItem
                fileIcon={<FileIcon />}
                file={file}
                key={`${file.name}-${index}`}
                onClearClick={() => removeFiles([file])}
                progressValue={upload.progress}
                progressVariant={
                  upload.error
                    ? "danger"
                    : upload.response
                      ? "success"
                      : undefined
                }
                progressHelperText={
                  upload.error ? (
                    <HelperText isLiveRegion>
                      <HelperTextItem variant="error">
                        {extractErrorMessage(upload.error)}
                      </HelperTextItem>
                    </HelperText>
                  ) : upload.response ? (
                    <HelperText isLiveRegion>
                      <HelperTextItem variant="default">
                        {extractSuccessMessage(upload.response)}
                      </HelperTextItem>
                    </HelperText>
                  ) : undefined
                }
              />
            ))}
          </MultipleFileUploadStatus>
        )}

        <Modal
          isOpen={rejectedFiles.length > 0}
          title="Unsupported files"
          titleIconVariant="warning"
          showClose
          aria-label="unsupported file upload attempted"
          onClose={() => setRejectedFiles([])}
          variant="small"
        >
          <List>
            {rejectedFiles.map((e, index) => (
              <ListItem key={index}>{e.file.name}</ListItem>
            ))}
          </List>
        </Modal>
      </MultipleFileUpload>
    </PageDrawerContent>
  );
};
