import type * as React from "react";

import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
  MultipleFileUpload,
  MultipleFileUploadMain,
} from "@patternfly/react-core";

import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import InProgressIcon from "@patternfly/react-icons/dist/esm/icons/in-progress-icon";
import UploadIcon from "@patternfly/react-icons/dist/esm/icons/upload-icon";

import type { ExtractResult } from "@app/client";
import { useMultiFileUpload } from "@app/hooks/useMultiFileUpload";
import type { Upload } from "@app/hooks/useUpload";

export interface IUploadFileForAnalysisProps {
  uploads: Map<
    File,
    Upload<
      ExtractResult,
      {
        message: string;
      }
    >
  >;
  handleUpload: (files: File[]) => void;
  handleRemoveUpload: (file: File) => void;
  handleCancelUpload: (file: File) => void;
}

export const UploadFileForAnalysis: React.FC<IUploadFileForAnalysisProps> = ({
  uploads,
  handleUpload,
  handleRemoveUpload,
  handleCancelUpload,
}) => {
  const {
    rejectedFiles,
    setRejectedFiles,
    handleFileDrop,
    handleDropRejected,
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
        multiple: false,
        disabled: uploads.size > 0,
      }}
    >
      {uploads.size === 0 ? (
        <MultipleFileUploadMain
          titleIcon={<UploadIcon />}
          titleText="Drag and drop files here"
          titleTextSeparator="or"
          infoText="Accepted file types: .json, .bz2"
        />
      ) : (
        Array.from(uploads.entries()).map(([file, upload], index) => {
          if (upload.error) {
            if (upload.wasCancelled) {
              return (
                <EmptyState
                  key={`${file.name}-${index}-cancelled`}
                  status="danger"
                  headingLevel="h4"
                  titleText="Upload cancelled"
                  icon={ExclamationCircleIcon}
                  variant={EmptyStateVariant.sm}
                >
                  <EmptyStateBody>
                    The file could not be analyzed. The operation was cancelled.
                  </EmptyStateBody>
                  <EmptyStateFooter>
                    <EmptyStateActions>
                      <Button
                        variant="primary"
                        onClick={() => removeFiles([file])}
                      >
                        Try another file
                      </Button>
                    </EmptyStateActions>
                  </EmptyStateFooter>
                </EmptyState>
              );
            }

            return (
              <EmptyState
                key={`${file.name}-${index}-error`}
                status="danger"
                headingLevel="h4"
                titleText="Upload failed"
                icon={ExclamationCircleIcon}
                variant={EmptyStateVariant.sm}
              >
                <EmptyStateBody>
                  The file could not be analyzed. The file might be corrupted or
                  an unsupported format.
                </EmptyStateBody>
                <EmptyStateFooter>
                  <EmptyStateActions>
                    <Button
                      variant="primary"
                      onClick={() => removeFiles([file])}
                    >
                      Try another file
                    </Button>
                  </EmptyStateActions>
                </EmptyStateFooter>
              </EmptyState>
            );
          }

          return (
            <EmptyState
              key={`${file.name}-${index}-progress`}
              headingLevel="h4"
              titleText={`Uploading SBOM ${upload.progress}%`}
              icon={InProgressIcon}
              variant={EmptyStateVariant.sm}
            >
              <EmptyStateBody>
                Securely uploading your SBOM for analysis. The file will not be
                saved.
              </EmptyStateBody>
              <EmptyStateFooter>
                <EmptyStateActions>
                  <Button
                    variant="link"
                    onClick={() => handleCancelUpload(file)}
                  >
                    Cancel upload
                  </Button>
                </EmptyStateActions>
              </EmptyStateFooter>
            </EmptyState>
          );
        })
      )}

      <Modal
        isOpen={rejectedFiles.length > 0}
        aria-label="rejected files"
        onClose={() => setRejectedFiles([])}
        variant="small"
      >
        <ModalHeader title="Rejected files" titleIconVariant="warning" />
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
