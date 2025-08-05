import type * as React from "react";

import type { AxiosError, AxiosResponse } from "axios";

import {
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

import { useMultiFileUpload } from "@app/hooks/useMultiFileUpload";
import type { Upload } from "@app/hooks/useUpload";
import FileIcon from "@patternfly/react-icons/dist/esm/icons/file-code-icon";
import UploadIcon from "@patternfly/react-icons/dist/esm/icons/upload-icon";

export interface IUploadFilesProps {
  uploads: Map<File, Upload<unknown, unknown>>;
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
  const {
    showStatus,
    status,
    rejectedFiles,
    setRejectedFiles,
    handleFileDrop,
    handleDropRejected,
    successFileCount,
    removeFiles,
  } = useMultiFileUpload({ uploads, handleUpload, handleRemoveUpload });

  return (
    <MultipleFileUpload
      onFileDrop={handleFileDrop}
      dropzoneProps={{
        accept: {
          "application/xml": [".json", ".bz2"],
        },
        onDropRejected: handleDropRejected,
        useFsAccessApi: false, // Required to make playwright work
      }}
    >
      <MultipleFileUploadMain
        titleIcon={<UploadIcon />}
        titleText="Drag and drop files here"
        titleTextSeparator="or"
        infoText="Accepted file types: .json, .bz2"
      />
      {showStatus && (
        <MultipleFileUploadStatus
          statusToggleText={`${successFileCount} of ${uploads.size} files uploaded`}
          statusToggleIcon={status}
        >
          {Array.from(uploads.entries()).map(([file, upload], index) => (
            <MultipleFileUploadStatusItem
              // customFileHandler is Required until https://github.com/patternfly/patternfly-react/issues/11276 is fixed
              customFileHandler={() => {}}
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
            {rejectedFiles.map((e) => (
              <ListItem key={e.file.name}>{e.file.name}</ListItem>
            ))}
          </List>
        </ModalBody>
      </Modal>
    </MultipleFileUpload>
  );
};
