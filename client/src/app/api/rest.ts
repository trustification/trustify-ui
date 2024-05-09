import axios, { AxiosRequestConfig } from "axios";

import { FORM_DATA_FILE_KEY } from "@app/Constants";
import { serializeRequestParamsForHub } from "@app/hooks/table-controls/getHubRequestParams";
import {
  Advisory,
  Vulnerability,
  HubPaginatedResult,
  HubRequestParams,
  Importer,
  ImporterConfiguration,
  Package,
  SBOM,
} from "./models";

const API = "/api";

export const ADVISORIES = API + "/v1/advisory";
export const VULNERABILITIES = API + "/v1/vulnerability";
export const SBOMS = API + "/v1/sbom";
export const PACKAGES = API + "/v1/package";
export const IMPORTERS = API + "/v1/importer";

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
  return getHubPaginatedResult<Advisory>(ADVISORIES, params);
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

export const getVulnerabilities = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<Vulnerability>(VULNERABILITIES, params);
};

export const getVulnerabilityById = (id: number | string) => {
  return axios
    .get<Vulnerability>(`${VULNERABILITIES}/${id}`)
    .then((response) => response.data);
};

export const getVulnerabilitySourceById = (id: number | string) => {
  return axios
    .get<string>(`${VULNERABILITIES}/${id}/source`)
    .then((response) => response.data);
};

export const downloadVulnerabilityById = (id: number | string) => {
  return axios.get<string>(`${VULNERABILITIES}/${id}/source`, {
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

export const getVulnerabilitiesBySbomId = (id: string | number) => {
  return axios
    .get<Vulnerability[]>(`${SBOMS}/${id}/vulnerabilities`)
    .then((response) => response.data);
};

//

export const getImporters = () => {
  return axios.get<Importer[]>(IMPORTERS).then((response) => response.data);
};

export const getImporterById = (id: number | string) => {
  return axios
    .get<Importer>(`${IMPORTERS}/${id}`)
    .then((response) => response.data);
};

export const createImporter = (
  id: number | string,
  body: ImporterConfiguration
) => {
  return axios.post<Importer>(`${IMPORTERS}/${id}`, body);
};

export const updateImporter = (
  id: number | string,
  body: ImporterConfiguration
) => {
  return axios
    .put<Importer>(`${IMPORTERS}/${id}`, body)
    .then((response) => response.data);
};

export const deleteImporter = (id: number | string) => {
  return axios
    .delete<Importer>(`${IMPORTERS}/${id}`)
    .then((response) => response.data);
};
