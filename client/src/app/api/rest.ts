import axios, { AxiosRequestConfig } from "axios";

import { FORM_DATA_FILE_KEY } from "@app/Constants";
import { AdvisoryDetails, SbomDetails } from "@app/client";
import { serializeRequestParamsForHub } from "@app/hooks/table-controls/getHubRequestParams";

import { HubPaginatedResult, HubRequestParams } from "./models";

const API = "/api";

export const ORGANIZATIONS = API + "/v1/organization";
export const PRODUCTS = API + "/v1/product";
export const ADVISORIES = API + "/v1/advisory";
export const VULNERABILITIES = API + "/v1/vulnerability";
export const SBOMS = API + "/v1/sbom";
export const PACKAGES = API + "/v1/purl";
export const IMPORTERS = API + "/v1/importer";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getHubPaginatedResult = <T>(
  url: string,
  params: HubRequestParams = {},
  extraQueryParams: { key: string; value: string }[] = []
): Promise<HubPaginatedResult<T>> => {
  const requestParams = serializeRequestParamsForHub(params);
  extraQueryParams.forEach((param) =>
    requestParams.append(param.key, param.value)
  );

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
  } else if (file.name.endsWith(".gz")) {
    contentType = "application/json+bzip2";
  }
  return contentType;
};

export const uploadAdvisory = (
  formData: FormData,
  config?: AxiosRequestConfig
) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return axios.post<AdvisoryDetails>(`${ADVISORIES}`, file, {
    ...config,
    headers: { "Content-Type": getContentTypeFromFile(file) },
  });
};

export const uploadSbom = (formData: FormData, config?: AxiosRequestConfig) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return axios.post<SbomDetails>(`${SBOMS}`, file, {
    ...config,
    headers: { "Content-Type": getContentTypeFromFile(file) },
  });
};
