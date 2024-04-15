import axios, { AxiosRequestConfig } from "axios";

import { FORM_DATA_FILE_KEY } from "@app/Constants";
import { serializeRequestParamsForHub } from "@app/hooks/table-controls/getHubRequestParams";
import {
  Advisory,
  CVE,
  HubPaginatedResult,
  HubRequestParams,
  Package,
  SBOM,
} from "./models";

const HUB = "/hub";

export const ADVISORIES = HUB + "/advisories";
export const ADVISORIES_SEARCH = HUB + "/api/v1/search/advisory";
export const CVES = HUB + "/cves";
export const SBOMS = HUB + "/sboms";
export const PACKAGES = HUB + "/packages";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export const getHubPaginatedResult = <T>(
  url: string,
  params: HubRequestParams = {}
): Promise<HubPaginatedResult<T>> =>
  axios
    .get<PaginatedResponse<T>>(url, {
      params: serializeRequestParamsForHub(params),
    })
    .then(({ data }) => ({
      data: data.items,
      total: data.total,
      params,
    }));

//

export const getAdvisories = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<Advisory>(ADVISORIES_SEARCH, params);
};

export const getAdvisoryById = (id: number | string) => {
  return axios
    .get<Advisory>(`${ADVISORIES}/${id}`)
    .then((response) => response.data);
};

export const getAdvisorySourceById = (id: number | string) => {
  return axios
    .get<string>(`${ADVISORIES}/${id}/source`)
    .then((response) => response.data);
};

export const downloadAdvisoryById = (id: number | string) => {
  return axios.get<string>(`${ADVISORIES}/${id}/source`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};

export const uploadAdvisory = (
  formData: FormData,
  config?: AxiosRequestConfig
) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return file.text().then((text) => {
    const json = JSON.parse(text);
    return axios.post<Advisory>(`${ADVISORIES}`, json, config);
  });
};

//

export const getCVEs = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<CVE>(CVES, params);
};

export const getCVEById = (id: number | string) => {
  return axios.get<CVE>(`${CVES}/${id}`).then((response) => response.data);
};

export const getCVESourceById = (id: number | string) => {
  return axios
    .get<string>(`${CVES}/${id}/source`)
    .then((response) => response.data);
};

export const downloadCVEById = (id: number | string) => {
  return axios.get<string>(`${CVES}/${id}/source`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};

//

export const getPackages = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<Package>(PACKAGES, params);
};

export const getPackageById = (id: number | string) => {
  return axios
    .get<Package>(`${PACKAGES}/${id}`)
    .then((response) => response.data);
};

//

export const getSBOMs = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<SBOM>(SBOMS, params);
};

export const getSBOMById = (id: number | string) => {
  return axios.get<SBOM>(`${SBOMS}/${id}`).then((response) => response.data);
};

export const getSBOMSourceById = (id: number | string) => {
  return axios
    .get<string>(`${SBOMS}/${id}/source`)
    .then((response) => response.data);
};

export const downloadSBOMById = (id: number | string) => {
  return axios.get<string>(`${SBOMS}/${id}/source`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};

export const getPackagesBySbomId = (id: string | number) => {
  return axios
    .get<Package[]>(`${SBOMS}/${id}/packages`)
    .then((response) => response.data);
};

export const getCVEsBySbomId = (id: string | number) => {
  return axios
    .get<CVE[]>(`${SBOMS}/${id}/cves`)
    .then((response) => response.data);
};
