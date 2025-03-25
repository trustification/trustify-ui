import { saveAs } from "file-saver";

import { downloadSbomLicense } from "@app/api/rest";
import { client } from "@app/axios-config/apiInit";
import { downloadAdvisory, downloadSbom } from "@app/client";
import { getFilenameFromContentDisposition } from "@app/utils/utils";

export const useDownload = () => {
  const onDownloadAdvisory = (id: string, filename?: string) => {
    downloadAdvisory({
      client,
      path: { key: id },
      responseType: "arraybuffer",
      headers: { Accept: "text/plain", responseType: "blob" },
    }).then((response) => {
      saveAs(new Blob([response.data as BlobPart]), filename || `${id}.json`);
    });
  };

  const onDownloadSBOM = (id: string, filename?: string) => {
    downloadSbom({
      client,
      path: { key: id },
      responseType: "arraybuffer",
      headers: { Accept: "text/plain", responseType: "blob" },
    }).then((response) => {
      saveAs(new Blob([response.data as BlobPart]), filename || `${id}.json`);
    });
  };

  const onDownloadSBOMLicenses = (id: string) => {
    downloadSbomLicense(id).then((response) => {
      let filename: string | null = null;

      const header = response.headers?.["content-disposition"]?.toString();
      if (header) {
        filename = getFilenameFromContentDisposition(header);
      }

      saveAs(new Blob([response.data as BlobPart]), filename || `${id}.tar.gz`);
    });
  };

  return {
    downloadAdvisory: onDownloadAdvisory,
    downloadSBOM: onDownloadSBOM,
    downloadSBOMLicenses: onDownloadSBOMLicenses,
  };
};
