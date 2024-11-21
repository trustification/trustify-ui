import { http, HttpResponse } from "msw";
import { sbomList } from "./data/sbom/list";
import getVulnerabilities from "@mocks/data/vulnerability/list.json";

// DATA IMPORTS

import cve202245787 from "@mocks/data/vulnerability/details/CVE-2022-45787.json";
import cve20230044 from "@mocks/data/vulnerability/details/CVE-2023-0044.json";
import cve20230481 from "@mocks/data/vulnerability/details/CVE-2023-0481.json";
import cve20230482 from "@mocks/data/vulnerability/details/CVE-2023-0482.json";
import cve20231370 from "@mocks/data/vulnerability/details/CVE-2023-1370.json";
import cve20231436 from "@mocks/data/vulnerability/details/CVE-2023-1436.json";
import cve202320861 from "@mocks/data/vulnerability/details/CVE-2023-20861.json";
import cve202324815 from "@mocks/data/vulnerability/details/CVE-2023-24815.json";
import cve202324998 from "@mocks/data/vulnerability/details/CVE-2023-24998.json";
import cve202326464 from "@mocks/data/vulnerability/details/CVE-2023-26464.json";

import sbom1 from "@mocks/data/sbom/details/urn%3Auuid%3A01932ff3-0fc4-7bf2-8201-5d5e9dc471bd.json";
import sbom2 from "@mocks/data/sbom/details/urn%3Auuid%3A01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9.json";

import { VulnerabilityHead } from "@app/client";

export const cveDetails: { [identifier: string]: Partial<VulnerabilityHead> } =
  {
    "CVE-2022-45787": cve202245787,
    "CVE-2023-0044": cve20230044,
    "CVE-2023-0481": cve20230481,
    "CVE-2023-0482": cve20230482,
    "CVE-2023-1370": cve20231370,
    "CVE-2023-1436": cve20231436,
    "CVE-2023-20861": cve202320861,
    "CVE-2023-24815": cve202324815,
    "CVE-2023-24998": cve202324998,
    "CVE-2023-26464": cve202326464,
  };

export const sbomDetails: { [identifier: string]: any } = {
  "urn%3Auuid%3A01932ff3-0fc4-7bf2-8201-5d5e9dc471bd": sbom1,
  "urn%3Auuid%3A01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9": sbom2,
};

/**
 * MSW HANDLERS
 * There should be one array of handlers for each group of endpoints
 */

// ADVISORY HANDLERS

const advisoryHandlers = [
  // list advisories
  http.get("/api/v1/advisory", () => {}),

  // upload a new advisory
  http.post("/api/v1/advisory", () => {}),

  // replace the labels of an advisory
  http.put("/api/v1/advisory/:id/label", () => {}),

  // modify existing labels of an advisory
  http.patch("/api/v1/advisory/:id/label", () => {}),

  // get an advisory
  http.get("/api/v1/advisory/:key", () => {}),

  // delete an advisory
  http.delete("/api/v1/advisory/:key", () => {}),

  // download an advisory document
  http.get("/api/v1/advisory/:key/download", () => {}),
];

// AI HANDLERS

const aiHandlers = [
  http.get("/api/v1/ai/flags", () => {}),
  http.get("/api/v1/ai/tools", () => {}),
  http.post("/api/v1/ai/tools/:name", () => {}),
  http.post("/api/v1/ai/completions", () => {}),
];

// ANALYSIS HANDLERS

const analysisHandlers = [
  http.get("/api/v1/analysis/dep", () => {}),
  http.get("/api/v1/analysis/dep/:key", () => {}),
  http.get("/api/v1/analysis/root-component", () => {}),
  http.get("/api/v1/analysis/root-component/:key", () => {}),
  http.get("/api/v1/analysis/status", () => {}),
];

// DATASET HANDLERS

const datasetHandlers = [
  // upload a new dataset
  http.post("/api/v1/dataset", () => {}),
];

// IMPORTER HANDLERS

const importerHandlers = [
  // list importer configurations
  http.get("/api/v1/importer", () => {}),

  // get an importer configuration
  http.get("/api/v1/importer/:name", () => {}),

  // update an existing importer configuration
  http.put("/api/v1/importer/:name", () => {}),

  // create an importer configuration
  http.post("/api/v1/importer/:name", () => {}),

  // delete an importer configuration
  http.delete("/api/v1/importer/:name", () => {}),

  // update an importer configuration
  http.patch("/api/v1/importer/:name", () => {}),

  // update an existing importer configuration
  http.put("/api/v1/importer/:name/enabled", () => {}),

  // force an importer to run as soon as possible
  http.post("/api/v1/importer/:name/force", () => {}),

  // get reports for an importer
  http.get("/api/v1/importer/:name/report", () => {}),
];

// LICENSE HANDLERS

const licenseHandlers = [
  http.get("/api/v1/license", () => {}),

  // license details
  http.get("/api/v1/license/:uuid", () => {}),

  // retrieve purls covered by a license
  http.get("/api/v1/license/:uuid/purl", () => {}),
];

// SPDX LICENSE HANDLERS

const spdxLicenseHandlers = [
  // list spdx licenses
  http.get("/api/v1/license/spdx/license", () => {}),

  // spdx license details
  http.get("/api/v1/license/spdx/license/:id", () => {}),
];

// ORGANIZATION HANDLERS

const organizationHandlers = [
  // list organizations
  http.get("/api/v1/organization", () => {}),

  // organization details
  http.get("/api/v1/organization/:id", () => {}),
];

// PRODUCT HANDLERS

const productHandlers = [
  http.get("/api/v1/product", () => {}),
  http.get("/api/v1/product/:id", () => {}),
  http.delete("/api/v1/product/:id", () => {}),
];

// PURL HANDLERS

const purlHandlers = [
  // list fully qualified purls
  http.get("/api/v1/purl", () => {}),

  // retrieve versioned pURL details of a type
  http.get("/api/v1/purl/type/:type/:namespace_and_name@:version", () => {}),

  // retrieve details of a fully qualified purl
  http.get("/api/v1/purl/:key", () => {}),
];

// BASE PURL HANDLERS

const basePurlHandlers = [
  // list base versionless pURLs
  http.get("/api/v1/purl/base", () => {}),

  // retrieve details for a base versionless pURL
  http.get("/api/v1/purl/base/:key", () => {}),
];

// PURL TYPE HANDLERS

const purlTypeHandlers = [
  // list known pURL types
  http.get("/api/v1/purl/type", () => {}),

  // retrieve details about a pURL type
  http.get("/api/v1/purl/type/:type", () => {}),

  // retrieve base pURL details of a type
  http.get("/api/v1/purl/type/:type/:namespace_and_name", () => {}),
];

// VERSIONED PURL HANDLERS

const versionedPurlHandlers = [
  // retrieve details of a versioned, non-qualified pURL
  http.get("/api/v1/purl/version/{key}", () => {}),
];

// SBOM HANDLERS

const sbomHandlers = [
  // get ALL SBOMs
  http.get("/api/v1/sbom", () => {
    return HttpResponse.json(sbomList);
  }),

  // upload a new SBOM
  http.post("/api/v1/sbom", () => {}),

  // find all SBOMs containing the provided package
  // NOTE: The package can be provided either via a PURL or
  // using the ID of a package as returned by other APIs, but not both.
  http.get("/api/v1/sbom/by-package", () => {
    return HttpResponse.json(sbomList);
  }),

  // count all SBOMs containing the provided packages
  http.get("/api/v1/sbom/count-by-package", () => {
    return HttpResponse.json(sbomList);
  }),

  // get an SBOM by its ID
  http.get("/api/v1/sbom/:id", ({ params }) => {
    const { id } = params;

    if (!id) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = sbomDetails[id as string];
    if (!data) {
      return new HttpResponse("SBOM not found", { status: 404 });
    }
    return HttpResponse.json(data);
  }),

  http.delete("/api/v1/sbom/:id", () => {}),

  http.get("/api/v1/sbom/:id/advisory", () => {}),

  // replace labels of an SBOM
  http.put("/api/v1/sbom/:id/label", () => {}),

  // modify existing labels of an SBOM
  http.patch("/api/v1/sbom/:id/label", () => {}),

  // search for packages of an SBOM
  http.get("/api/v1/sbom/:id/packages", () => {}),

  // search for related packages in an SBOM
  http.get("/api/v1/sbom/:id/related", () => {}),

  http.get("/api/v1/sbom/:key/download", () => {}),

  //

  // http.get("/api/v1/sbom/urn%3Auuid%3A:id", () => {
  //
  //   return HttpResponse.json(sbomList);
  // }),
  // http.get(
  //   "/api/v1/sbom/urn%3Auuid%3A0193013f-1b8a-7152-8857-8b8f4238b8ba",
  //   () => {
  //     return HttpResponse.json(sbom2);
  //   }
  // ),
  // http.get(
  //   "/api/v1/sbom/urn%3Auuid%3A0193013f-0f00-77e1-afe4-b7d7f8585b7a",
  //   () => {
  //     return HttpResponse.json(sbom1);
  //   }
  // ),
  // http.get(
  //   "/api/v1/sbom/urn%3Auuid%3A0193013f-1b8a-7152-8857-8b8f4238b8ba",
  //   () => {
  //     return HttpResponse.json(sbom2);
  //   }
  // ),
];

// USER PREFERENCES HANDLERS

const userPreferencesHandlers = [
  http.get("/api/v1/userPreference/:key", () => {}),
  http.put("/api/v1/userPreference/:key", () => {}),
  http.delete("/api/v1/userPreference/:key", () => {}),
];

// VULNERABILITY HANDLERS

const vulnerabilityHandlers = [
  http.get("/api/v1/vulnerability", ({ request }) => {
    // construct a URL instance out of the request intercepted
    const url = new URL(request.url);

    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/vulnerability?id=1", "vulnerabilityId" will equal "1".
    // const vulnerabilityId = url.searchParams.get("id");
    const limit = url.searchParams.get("limit");

    return HttpResponse.json(getVulnerabilities);
  }),

  http.get("/api/v1/vulnerability/:id", ({ params }) => {
    const { id } = params;

    if (!id) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = cveDetails[id as string];
    if (!data) {
      return new HttpResponse("CVE not found", { status: 404 });
    }
    return HttpResponse.json(data);
  }),

  http.delete("/api/v1/vulnerability/:id", ({ params }) => {
    const { id } = params;

    if (!id) {
      return new HttpResponse(null, { status: 404 });
    }
  }),
];

// WEAKNESS HANDLERS

const weaknessHandlers = [
  // list weaknesses
  http.get("/api/v1/weakness", () => {}),

  http.get("/api/v1/weakness/:id", () => {}),
];

// named imports
export {
  advisoryHandlers,
  aiHandlers,
  analysisHandlers,
  basePurlHandlers,
  datasetHandlers,
  importerHandlers,
  licenseHandlers,
  organizationHandlers,
  productHandlers,
  purlHandlers,
  purlTypeHandlers,
  sbomHandlers,
  spdxLicenseHandlers,
  userPreferencesHandlers,
  versionedPurlHandlers,
  vulnerabilityHandlers,
  weaknessHandlers,
};

// combined handlers
export const handlers = [
  ...advisoryHandlers,
  ...aiHandlers,
  ...analysisHandlers,
  ...basePurlHandlers,
  ...datasetHandlers,
  ...importerHandlers,
  ...licenseHandlers,
  ...organizationHandlers,
  ...productHandlers,
  ...purlHandlers,
  ...purlTypeHandlers,
  ...sbomHandlers,
  ...spdxLicenseHandlers,
  ...userPreferencesHandlers,
  ...versionedPurlHandlers,
  ...vulnerabilityHandlers,
  ...weaknessHandlers,
];
