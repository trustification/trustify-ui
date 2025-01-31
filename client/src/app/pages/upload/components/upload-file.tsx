import * as React from "react";

import { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
import { FileRejection } from "react-dropzone";

import {
  DropEvent,
  HelperText,
  HelperTextItem,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
  MultipleFileUpload,
  MultipleFileUploadMain,
  MultipleFileUploadStatus,
  MultipleFileUploadStatusItem,
  Spinner,
} from "@patternfly/react-core";

import FileIcon from "@patternfly/react-icons/dist/esm/icons/file-code-icon";
import UploadIcon from "@patternfly/react-icons/dist/esm/icons/upload-icon";

interface Upload {
  progress: number;
  status: "queued" | "inProgress" | "complete";
  response?: AxiosResponse;
  error?: AxiosError;
  wasCancelled: boolean;
  cancelFn?: CancelTokenSource;
}

export interface IUploadFilesProps {
  uploads: Map<File, Upload>;
  handleUpload: (files: File[]) => void;
  handleRemoveUpload: (file: File) => void;
  extractSuccessMessage: (response: AxiosResponse) => string;
  extractErrorMessage: (error: AxiosError) => string;
}

export const UploadFiles: React.FC<IUploadFilesProps> = ({
  uploads,
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
    <>
      <MultipleFileUpload
        onFileDrop={handleFileDrop}
        dropzoneProps={{
          accept: {
            "application/xml": [".json", ".bz2", ".gz"],
          },
          onDropRejected: handleDropRejected,
          useFsAccessApi: false, // Required to make playwright work
        }}
      >
        <MultipleFileUploadMain
          titleIcon={<UploadIcon />}
          titleText="Drag and drop files here"
          titleTextSeparator="or"
          infoText="Accepted file types: .json, .bz2, .gz"
        />
        {showStatus && (
          <MultipleFileUploadStatus
            statusToggleText={`${successFileCount} of ${uploads.size} files uploaded`}
            statusToggleIcon={statusIcon}
          >
            {Array.from(uploads.entries()).map(([file, upload], index) => (
              <MultipleFileUploadStatusItem
                className={
                  upload.progress < 100 || !upload.response
                    ? "multiple-file-upload-status-item-force-blue"
                    : undefined
                }
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
                  ) : upload.progress === 100 && !upload.response ? (
                    <HelperText isLiveRegion>
                      <HelperTextItem variant="warning">
                        <Spinner isInline />
                        File uploaded. Waiting for the server to process it.
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
          aria-label="unsupported file upload attempted"
          onClose={() => setRejectedFiles([])}
          variant="small"
        >
          <ModalHeader title="Unsupported files" titleIconVariant="warning" />
          <ModalBody>
            <List>
              {rejectedFiles.map((e, index) => (
                <ListItem key={index}>{e.file.name}</ListItem>
              ))}
            </List>
          </ModalBody>
        </Modal>
      </MultipleFileUpload>
    </>
  );
};
