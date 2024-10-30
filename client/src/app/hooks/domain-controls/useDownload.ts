import { saveAs } from "file-saver";

import { client } from "@app/axios-config/apiInit";
import { downloadAdvisory, downloadSbom } from "@app/client";

export const useDownload = () => {
  const onDownloadAdvisory = (id: string, filename?: string) => {
    downloadAdvisory({
      client,
      path: { key: id },
      responseType: "arraybuffer",
      headers: { Accept: "text/plain", responseType: "blob" },
    }).then((response) => {
      saveAs(new Blob([response.data as any]), filename || `${id}.json`);
    });
  };

  const onDownloadSBOM = (id: string, filename?: string) => {
    downloadSbom({
      client,
      path: { key: id },
      responseType: "arraybuffer",
      headers: { Accept: "text/plain", responseType: "blob" },
    }).then((response) => {
      saveAs(new Blob([response.data as any]), filename || `${id}.json`);
    });
  };

  return { downloadAdvisory: onDownloadAdvisory, downloadSBOM: onDownloadSBOM };
};
