import axios, { type AxiosRequestConfig } from "axios";

import { FORM_DATA_FILE_KEY } from "@app/Constants";
import type { AdvisoryDetails, ExtractResult, IngestResult } from "@app/client";
import { serializeRequestParamsForHub } from "@app/hooks/table-controls/getHubRequestParams";

import type { HubPaginatedResult, HubRequestParams } from "./models";

const API = "/api";

export const ORGANIZATIONS = `${API}/v2/organization`;
export const ADVISORIES = `${API}/v2/advisory`;
export const SBOMS = `${API}/v2/sbom`;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getHubPaginatedResult = <T>(
  url: string,
  params: HubRequestParams = {},
  extraQueryParams: { key: string; value: string }[] = [],
): Promise<HubPaginatedResult<T>> => {
  const requestParams = serializeRequestParamsForHub(params);
  for (const param of extraQueryParams) {
    requestParams.append(param.key, param.value);
  }

  return axios
    .get<PaginatedResponse<T>>(url, {
      params: requestParams,
    })
    .then(({ data }) => ({
      data: data.items,
      total: data.total,
      params,
    }));
};

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
  return axios.post<ExtractResult>("/api/v2/ui/extract-sbom-purls", file, {
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
