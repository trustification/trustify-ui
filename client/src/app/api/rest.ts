import axios, { AxiosRequestConfig } from "axios";

import { FORM_DATA_FILE_KEY } from "@app/Constants";
import { serializeRequestParamsForHub } from "@app/hooks/table-controls/getHubRequestParams";
import {
  Advisory,
  HubPaginatedResult,
  HubRequestParams,
  Importer,
  ImporterConfiguration,
  ImporterReport,
  Package,
  PackageWithinSBOM,
  Product,
  SBOM,
  Vulnerability,
} from "./models";

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

// Organizations

export const getOrganizations = (params: HubRequestParams = {}) =>
  getHubPaginatedResult<Product>(ORGANIZATIONS, params);

export const getOrganizationById = (id: number | string) =>
  axios
    .get<Product>(`${ORGANIZATIONS}/${id}`)
    .then((response) => response.data);

// Products

export const getProducts = (params: HubRequestParams = {}) =>
  getHubPaginatedResult<Product>(PRODUCTS, params);

export const getProductById = (id: number | string) =>
  axios.get<Product>(`${PRODUCTS}/${id}`).then((response) => response.data);

// Advisory

export const getAdvisories = (params: HubRequestParams = {}) =>
  getHubPaginatedResult<Advisory>(ADVISORIES, params);

export const getAdvisoryById = (id: number | string) =>
  axios.get<Advisory>(`${ADVISORIES}/${id}`).then((response) => response.data);

export const getAdvisorySourceById = (id: number | string) =>
  axios
    .get<string>(`${ADVISORIES}/${id}/download`)
    .then((response) => response.data);

export const downloadAdvisoryById = (id: number | string) =>
  axios.get<string>(`${ADVISORIES}/${id}/download`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });

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

export const updateAdvisoryLabels = (
  id: number | string,
  labels: { [key: string]: string }
) =>
  axios
    .put<void>(`${ADVISORIES}/${id}/label`, labels)
    .then((response) => response.data);

// Vulnerability

export const getVulnerabilities = (params: HubRequestParams = {}) =>
  getHubPaginatedResult<Vulnerability>(VULNERABILITIES, params);

export const getVulnerabilityById = (id: number | string) =>
  axios
    .get<Vulnerability>(`${VULNERABILITIES}/${id}`)
    .then((response) => response.data);

export const getVulnerabilitySourceById = (id: number | string) =>
  axios
    .get<string>(`${VULNERABILITIES}/${id}/source`)
    .then((response) => response.data);

export const downloadVulnerabilityById = (id: number | string) =>
  axios.get<string>(`${VULNERABILITIES}/${id}/source`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });

export const getVulnerabilitiesBySbomId = (id: string | number) =>
  axios
    .get<Vulnerability[]>(`${SBOMS}/${id}/vulnerabilities`)
    .then((response) => response.data);

// Package

export const getPackages = (params: HubRequestParams = {}) =>
  getHubPaginatedResult<Package>(PACKAGES, params);

export const getPackageById = (id: number | string) =>
  axios.get<Package>(`${PACKAGES}/${id}`).then((response) => response.data);

export const getPackagesBySbomId = (
  id: number | string,
  params: HubRequestParams = {}
) =>
  getHubPaginatedResult<PackageWithinSBOM>(`${SBOMS}/${id}/packages`, params);

// SBOM

export const getSBOMs = (params: HubRequestParams = {}) =>
  getHubPaginatedResult<SBOM>(SBOMS, params);

export const getSBOMById = (id: number | string) =>
  axios.get<SBOM>(`${SBOMS}/${id}`).then((response) => response.data);

export const getSBOMSourceById = (id: number | string) =>
  axios
    .get<string>(`${SBOMS}/${id}/download`)
    .then((response) => response.data);

export const downloadSBOMById = (id: number | string) =>
  axios.get<string>(`${SBOMS}/${id}/download`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });

export const uploadSbom = (formData: FormData, config?: AxiosRequestConfig) => {
  const file = formData.get(FORM_DATA_FILE_KEY) as File;
  return file.text().then((text) => {
    const json = JSON.parse(text);
    return axios.post<SBOM>(`${SBOMS}`, json, config);
  });
};

export const updateSbomLabels = (
  id: number | string,
  labels: { [key: string]: string }
) =>
  axios
    .put<void>(`${SBOMS}/${id}/label`, labels)
    .then((response) => response.data);

export const getSBOMsByPackageId = (
  packageId: string,
  params: HubRequestParams = {}
) =>
  getHubPaginatedResult<SBOM>(`${SBOMS}/by-package`, params, [
    { key: "id", value: packageId },
  ]);

// Importer

export const getImporters = () =>
  axios.get<Importer[]>(IMPORTERS).then((response) => response.data);

export const getImporterById = (id: number | string) =>
  axios.get<Importer>(`${IMPORTERS}/${id}`).then((response) => response.data);

export const createImporter = (
  id: number | string,
  body: ImporterConfiguration
) => axios.post<Importer>(`${IMPORTERS}/${id}`, body);

export const updateImporter = (
  id: number | string,
  body: ImporterConfiguration
) =>
  axios
    .put<Importer>(`${IMPORTERS}/${id}`, body)
    .then((response) => response.data);

export const runImporter = (id: number | string) =>
  axios
    .post<Importer>(`${IMPORTERS}/${id}/force`)
    .then((response) => response.data);

export const deleteImporter = (id: number | string) =>
  axios
    .delete<Importer>(`${IMPORTERS}/${id}`)
    .then((response) => response.data);

export const getImporterReports = (id: string) =>
  getHubPaginatedResult<ImporterReport>(`${IMPORTERS}/${id}/report`, {});

export const getLastImporterReport = (id: string) => {
  const params: HubRequestParams = {
    page: { pageNumber: 1, itemsPerPage: 1 },
    sort: { field: "report.endDate", direction: "desc" },
  };

  return getHubPaginatedResult<ImporterReport>(
    `${IMPORTERS}/${id}/report`,
    params
  ).then((e) => (e.total > 0 ? e.data[0] : undefined));
};
