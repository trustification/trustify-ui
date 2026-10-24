import axios, { type AxiosRequestConfig } from "axios";

import { FORM_DATA_FILE_KEY } from "@app/Constants";
import type { AdvisoryDetails, ExtractResult, IngestResult } from "@app/client";

const API = "/api";

const ADVISORIES = `${API}/v3/advisory`;
const SBOMS = `${API}/v3/sbom`;

const getContentTypeFromFile = (file: File) => {
  let contentType = "application/json";
  if (file.name.endsWith(".bz2")) {
    contentType = "application/json+bzip2";
  }
  return contentType;
};

export const uploadAdvisory = (
  formData: FormData,
  config?: AxiosRequestConfig,
) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return axios.post<AdvisoryDetails>(`${ADVISORIES}`, file, {
    ...config,
    headers: { "Content-Type": getContentTypeFromFile(file) },
  });
};

export const uploadSbom = (formData: FormData, config?: AxiosRequestConfig) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return axios.post<IngestResult>(`${SBOMS}`, file, {
    ...config,
    headers: { "Content-Type": getContentTypeFromFile(file) },
  });
};

export const uploadSbomForAnalysis = (
  formData: FormData,
  config?: AxiosRequestConfig,
) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return axios.post<ExtractResult>("/api/v3/ui/extract-sbom-purls", file, {
    ...config,
    headers: { "Content-Type": getContentTypeFromFile(file) },
  });
};

// Using our own definition of the endpoint rather than the `hey-api` auto generated
// We could replace this one once https://github.com/hey-api/openapi-ts/issues/1803 is fixed
export const downloadSbomLicense = (sbomId: string) => {
  return axios.get<Blob>(`${SBOMS}/${sbomId}/license-export`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};
