import { client } from "@app/axios-config/apiInit";
import { downloadAdvisory, downloadSbom } from "@app/client";
import { saveAs } from "file-saver";

export const useDownload = () => {
  const onDownloadAdvisory = (id: string, filename?: string) => {
    downloadAdvisory({ client, path: { key: id } }).then((response) => {
      saveAs(response.data as Blob, filename || `${id}.json`);
    });
  };

  const onDownloadSBOM = (id: string, filename?: string) => {
    downloadSbom({ client, path: { key: id } }).then((response) => {
      saveAs(response.data as Blob, filename || `${id}.json`);
    });
  };

  return { downloadAdvisory: onDownloadAdvisory, downloadSBOM: onDownloadSBOM };
};
