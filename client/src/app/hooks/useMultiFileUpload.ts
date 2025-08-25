import React from "react";

import type { DropEvent } from "@patternfly/react-core";
import type { FileRejection } from "react-dropzone";

import type { Upload } from "./useUpload";

interface IMultiFileUploadArgs<T, E> {
  uploads: Map<File, Upload<T, E>>;
  handleUpload: (files: File[]) => void;
  handleRemoveUpload: (file: File) => void;
}

export const useMultiFileUpload = <T, E>({
  uploads,
  handleUpload,
  handleRemoveUpload,
}: IMultiFileUploadArgs<T, E>) => {
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState<
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
      setStatus("inProgress");
    } else if (currentUploads.every((e) => e.status === "complete")) {
      setStatus("success");
    } else {
      setStatus("danger");
    }
  }, [uploads]);

  const removeFiles = (filesToRemove: File[]) => {
    for (const e of filesToRemove) {
      handleRemoveUpload(e);
    }
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
    (upload) => upload.response,
  ).length;

  return {
    showStatus,
    status,
    rejectedFiles,
    setRejectedFiles,
    handleFileDrop,
    handleDropRejected,
    successFileCount,
    removeFiles,
  };
};
