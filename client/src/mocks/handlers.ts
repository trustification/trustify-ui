import { http, HttpResponse } from "msw";
import { VulnerabilityHead } from "@app/client";

import logo from "../../../branding/images/masthead-logo.svg";

import getAdvisories from "./data/advisory/list.json";
import getProducts from "./data/product/list.json";
import getPurls from "./data/purl/list.json";
import getSboms from "./data/sbom/list.json";
import getVulnerabilities from "./data/vulnerability/list.json";

// DATA IMPORTS

import advisory_03bb16dc from "./data/advisory/details/03bb16dc-3cff-4a7d-8393-9a6a7124ecc2.json";
import advisory_87aa81c3 from "./data/advisory/details/87aa81c3-2aa5-438e-b5d4-d67ca4e321a9.json";
import advisory_88a4fc6c from "./data/advisory/details/88a4fc6c-60ae-4e4a-bdbe-4fb2e1d33e9c.json";
import advisory_459c504b from "./data/advisory/details/459c504b-7e09-4ea9-9cbb-baa8ce040e83.json";
import advisory_671dd85b from "./data/advisory/details/671dd85b-409f-4509-9a50-c4b2404ac10a.json";
import advisory_673acfc8 from "./data/advisory/details/673acfc8-ea7d-4c6d-aff9-20cf70caade0.json";
import advisory_32600b15 from "./data/advisory/details/32600b15-f2c1-4115-bcfb-0d0e1786f86d.json";
import advisory_d99d1421 from "./data/advisory/details/d99d1421-e2fd-49c2-b2dd-82fe848fff48.json";
import advisory_ea257645 from "./data/advisory/details/ea257645-f52f-4723-9c73-a4ed589f67ac.json";
import advisory_ee8cff4d from "./data/advisory/details/ee8cff4d-d6bc-4a27-89ac-a7ad193f5eb6.json";

import cve_202245787 from "./data/vulnerability/CVE-2022-45787/details.json";
import cve_20230044 from "./data/vulnerability/CVE-2023-0044/details.json";
import cve_20230481 from "./data/vulnerability/CVE-2023-0481/details.json";
import cve_20230482 from "./data/vulnerability/CVE-2023-0482/details.json";
import cve_20231370 from "./data/vulnerability/CVE-2023-1370/details.json";
import cve_20231436 from "./data/vulnerability/CVE-2023-1436/details.json";
import cve_202320861 from "./data/vulnerability/CVE-2023-20861/details.json";
import cve_202324815 from "./data/vulnerability/CVE-2023-24815/details.json";
import cve_202324998 from "./data/vulnerability/CVE-2023-24998/details.json";
import cve_202326464 from "./data/vulnerability/CVE-2023-26464/details.json";

import sbom_5d5e9dc471bd from "./data/sbom/01932ff3-0fc4-7bf2-8201-5d5e9dc471bd/details.json";
import sbom_c26de2fe81d9 from "./data/sbom/01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9/details.json";
// import sbom_f92bac24a6b0 from "./data/sbom/01932ff3-0f06-74e0-b673-f92bac24a6b0/details.json";
// import sbom_1fac54a371f3 from "./data/sbom/01932ff3-0f90-7e51-9c9d-1fac54a371f3/details.json";
// import sbom_c399c1e9a923 from "./data/sbom/01932ff3-0f91-7543-af38-c399c1e9a923/details.json";
// import sbom_18044dbbb574 from "./data/sbom/01932ff3-0fbc-7b82-b9c2-18044dbbb574/details.json";

import sbom_5d5e9dc471bd_advisory from "./data/sbom/01932ff3-0fc4-7bf2-8201-5d5e9dc471bd/advisory.json";
import sbom_c26de2fe81d9_advisory from "./data/sbom/01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9/advisory.json";
import sbom_f92bac24a6b0_advisory from "./data/sbom/01932ff3-0f06-74e0-b673-f92bac24a6b0/advisory.json";
import sbom_1fac54a371f3_advisory from "./data/sbom/01932ff3-0f90-7e51-9c9d-1fac54a371f3/advisory.json";
import sbom_c399c1e9a923_advisory from "./data/sbom/01932ff3-0f91-7543-af38-c399c1e9a923/advisory.json";
import sbom_18044dbbb574_advisory from "./data/sbom/01932ff3-0fbc-7b82-b9c2-18044dbbb574/advisory.json";

import sbom_5d5e9dc471bd_packages from "./data/sbom/01932ff3-0fc4-7bf2-8201-5d5e9dc471bd/packages.json";
import sbom_c26de2fe81d9_packages from "./data/sbom/01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9/packages.json";
import sbom_f92bac24a6b0_packages from "./data/sbom/01932ff3-0f06-74e0-b673-f92bac24a6b0/packages.json";
import sbom_1fac54a371f3_packages from "./data/sbom/01932ff3-0f90-7e51-9c9d-1fac54a371f3/packages.json";
import sbom_c399c1e9a923_packages from "./data/sbom/01932ff3-0f91-7543-af38-c399c1e9a923/packages.json";
import sbom_18044dbbb574_packages from "./data/sbom/01932ff3-0fbc-7b82-b9c2-18044dbbb574/packages.json";

import prod_2e167215 from "./data/product/2e167215-42ec-4a71-912c-73082c21cf57/details.json";
import prod_60d159e4 from "./data/product/60d159e4-48dc-4480-90e8-7e84b8bfb759/details.json";
import prod_77eb73d7 from "./data/product/77eb73d7-dc2c-4d3d-bfe1-bd3a80280059/details.json";
import prod_726e029c from "./data/product/726e029c-2fd7-4e3a-8b67-6c96010d880a/details.json";

import purl_2e05fb3a from "./data/purl/details/2e05fb3a-cda9-5e54-96b2-d8c7ea390f8d.json";
import purl_14c5c61d from "./data/purl/details/14c5c61d-c4cc-56fb-9db6-f62541076b80.json";
import purl_25ddc770 from "./data/purl/details/25ddc770-5fde-53a8-8451-41091d5fcb3b.json";
import purl_62c9cfab from "./data/purl/details/62c9cfab-997b-5126-ad5c-90bc277e048f.json";
import purl_81293bba from "./data/purl/details/81293bba-1ab5-5524-8444-0bd55d19b9b3.json";
import purl_b9a43108 from "./data/purl/details/b9a43108-525d-59ea-bc31-ff217d4c7925.json";
import purl_d6dea366 from "./data/purl/details/d6dea366-e8a6-5500-9aef-14464b717295.json";
import purl_e0b74cfd from "./data/purl/details/e0b74cfd-e0b0-512b-8814-947f868bc50e.json";
import purl_f4f6b460 from "./data/purl/details/f4f6b460-82e5-59f0-a7f6-da5f226a9b24.json";
import purl_f357b0cc from "./data/purl/details/f357b0cc-75d5-532e-b7d9-2233f6f752c8.json";

export const advisoryDetails: { [identifier: string]: any } = {
  "urn:uuid:03bb16dc-3cff-4a7d-8393-9a6a7124ecc2": advisory_03bb16dc,
  "urn:uuid:87aa81c3-2aa5-438e-b5d4-d67ca4e321a9": advisory_87aa81c3,
  "urn:uuid:88a4fc6c-60ae-4e4a-bdbe-4fb2e1d33e9c": advisory_88a4fc6c,
  "urn:uuid:459c504b-7e09-4ea9-9cbb-baa8ce040e83": advisory_459c504b,
  "urn:uuid:671dd85b-409f-4509-9a50-c4b2404ac10a": advisory_671dd85b,
  "urn:uuid:673acfc8-ea7d-4c6d-aff9-20cf70caade0": advisory_673acfc8,
  "urn:uuid:32600b15-f2c1-4115-bcfb-0d0e1786f86d": advisory_32600b15,
  "urn:uuid:d99d1421-e2fd-49c2-b2dd-82fe848fff48": advisory_d99d1421,
  "urn:uuid:ea257645-f52f-4723-9c73-a4ed589f67ac": advisory_ea257645,
  "urn:uuid:ee8cff4d-d6bc-4a27-89ac-a7ad193f5eb6": advisory_ee8cff4d,
};

export const cveDetails: { [identifier: string]: Partial<VulnerabilityHead> } =
  {
    "CVE-2022-45787": cve_202245787,
    "CVE-2023-0044": cve_20230044,
    "CVE-2023-0481": cve_20230481,
    "CVE-2023-0482": cve_20230482,
    "CVE-2023-1370": cve_20231370,
    "CVE-2023-1436": cve_20231436,
    "CVE-2023-20861": cve_202320861,
    "CVE-2023-24815": cve_202324815,
    "CVE-2023-24998": cve_202324998,
    "CVE-2023-26464": cve_202326464,
  };

export const sbomDetails: { [identifier: string]: any } = {
  "urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd": sbom_5d5e9dc471bd,
  "urn:uuid:01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9": sbom_c26de2fe81d9,
};

export const sbomPackages: { [identifier: string]: any } = {
  "urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd": sbom_5d5e9dc471bd_packages,
  "urn:uuid:01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9": sbom_c26de2fe81d9_packages,
  "urn:uuid:01932ff3-0f06-74e0-b673-f92bac24a6b0": sbom_f92bac24a6b0_packages,
  "urn:uuid:01932ff3-0f90-7e51-9c9d-1fac54a371f3": sbom_1fac54a371f3_packages,
  "urn:uuid:01932ff3-0f91-7543-af38-c399c1e9a923": sbom_c399c1e9a923_packages,
  "urn:uuid:01932ff3-0fbc-7b82-b9c2-18044dbbb574": sbom_18044dbbb574_packages,
};

export const sbomAdvisory: { [identifier: string]: any } = {
  "urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd": sbom_5d5e9dc471bd_advisory,
  "urn:uuid:01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9": sbom_c26de2fe81d9_advisory,
  "urn:uuid:01932ff3-0f06-74e0-b673-f92bac24a6b0": sbom_f92bac24a6b0_advisory,
  "urn:uuid:01932ff3-0f90-7e51-9c9d-1fac54a371f3": sbom_1fac54a371f3_advisory,
  "urn:uuid:01932ff3-0f91-7543-af38-c399c1e9a923": sbom_c399c1e9a923_advisory,
  "urn:uuid:01932ff3-0fbc-7b82-b9c2-18044dbbb574": sbom_18044dbbb574_advisory,
};

export const productDetails: { [identifier: string]: any } = {
  "urn:uuid:2e167215-42ec-4a71-912c-73082c21cf57": prod_2e167215,
  "urn:uuid:60d159e4-48dc-4480-90e8-7e84b8bfb759": prod_60d159e4,
  "urn:uuid:77eb73d7-dc2c-4d3d-bfe1-bd3a80280059": prod_77eb73d7,
  "urn:uuid:726e029c-2fd7-4e3a-8b67-6c96010d880a": prod_726e029c,
};

export const purlDetails: { [identifier: string]: any } = {
  "2e05fb3a-cda9-5e54-96b2-d8c7ea390f8d": purl_2e05fb3a,
  "14c5c61d-c4cc-56fb-9db6-f62541076b80": purl_14c5c61d,
  "25ddc770-5fde-53a8-8451-41091d5fcb3b": purl_25ddc770,
  "62c9cfab-997b-5126-ad5c-90bc277e048f": purl_62c9cfab,
  "81293bba-1ab5-5524-8444-0bd55d19b9b3": purl_81293bba,
  "b9a43108-525d-59ea-bc31-ff217d4c7925": purl_b9a43108,
  "d6dea366-e8a6-5500-9aef-14464b717295": purl_d6dea366,
  "e0b74cfd-e0b0-512b-8814-947f868bc50e": purl_e0b74cfd,
  "f4f6b460-82e5-59f0-a7f6-da5f226a9b24": purl_f4f6b460,
  "f357b0cc-75d5-532e-b7d9-2233f6f752c8": purl_f357b0cc,
};

/**
 * MSW HANDLERS
 * There should be one array of handlers for each group of endpoints
 */

// ADVISORY HANDLERS

const advisoryHandlers = [
  // list advisories
  http.get("/api/v2/advisory", () => {
    return HttpResponse.json(getAdvisories);
  }),

  // upload a new advisory
  http.post("/api/v2/advisory", () => {}),

  // replace the labels of an advisory
  http.put("/api/v2/advisory/:id/label", () => {}),

  // modify existing labels of an advisory
  http.patch("/api/v2/advisory/:id/label", () => {}),

  // get an advisory
  http.get("/api/v2/advisory/:key", ({ params }) => {
    const { key } = params;
    if (!key) {
      return new HttpResponse("Advisory for SBOM not found", { status: 404 });
    } else {
      const data = sbomAdvisory[key as string];
      if (!data) {
        return new HttpResponse("Advisory for SBOM not found", { status: 404 });
      }

      return HttpResponse.json(data);
    }
  }),

  // delete an advisory
  http.delete("/api/v2/advisory/:key", () => {}),

  // download an advisory document
  http.get("/api/v2/advisory/:key/download", () => {}),
];

// AI HANDLERS

const aiHandlers = [
  http.get("/api/v2/ai/flags", () => {}),
  http.get("/api/v2/ai/tools", () => {}),
  http.post("/api/v2/ai/tools/:name", () => {}),
  http.post("/api/v2/ai/completions", () => {}),
];

// ANALYSIS HANDLERS

const analysisHandlers = [
  http.get("/api/v2/analysis/dep", () => {}),
  http.get("/api/v2/analysis/dep/:key", () => {}),
  http.get("/api/v2/analysis/root-component", () => {}),
  http.get("/api/v2/analysis/root-component/:key", () => {}),
  http.get("/api/v2/analysis/status", () => {}),
];

// ASSET HANDLERS

const assetHandlers = [
  http.get("/branding/images/placeholder.svg", () => {}),
  http.get("/branding/images/masthead-logo.svg", () => {
    return new HttpResponse(logo);
  }),
];

// DATASET HANDLERS

const datasetHandlers = [
  // upload a new dataset
  http.post("/api/v2/dataset", () => {}),
];

// IMPORTER HANDLERS

const importerHandlers = [
  // list importer configurations
  http.get("/api/v2/importer", () => {}),

  // get an importer configuration
  http.get("/api/v2/importer/:name", () => {}),

  // update an existing importer configuration
  http.put("/api/v2/importer/:name", () => {}),

  // create an importer configuration
  http.post("/api/v2/importer/:name", () => {}),

  // delete an importer configuration
  http.delete("/api/v2/importer/:name", () => {}),

  // update an importer configuration
  http.patch("/api/v2/importer/:name", () => {}),

  // update an existing importer configuration
  http.put("/api/v2/importer/:name/enabled", () => {}),

  // force an importer to run as soon as possible
  http.post("/api/v2/importer/:name/force", () => {}),

  // get reports for an importer
  http.get("/api/v2/importer/:name/report", () => {}),
];

// LICENSE HANDLERS

const licenseHandlers = [
  http.get("/api/v2/license", () => {}),

  // license details
  http.get("/api/v2/license/:uuid", () => {}),

  // retrieve purls covered by a license
  http.get("/api/v2/license/:uuid/purl", () => {}),
];

// SPDX LICENSE HANDLERS

const spdxLicenseHandlers = [
  // list spdx licenses
  http.get("/api/v2/license/spdx/license", () => {}),

  // spdx license details
  http.get("/api/v2/license/spdx/license/:id", () => {}),
];

// ORGANIZATION HANDLERS

const organizationHandlers = [
  // list organizations
  http.get("/api/v2/organization", () => {}),

  // organization details
  http.get("/api/v2/organization/:id", () => {}),
];

// PRODUCT HANDLERS

const productHandlers = [
  http.get("/api/v2/product", () => {
    return HttpResponse.json(getProducts);
  }),
  http.get("/api/v2/product/:id", ({ params }) => {
    const { id } = params;

    if (!id) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = productDetails[id as string];
    if (!data) {
      return new HttpResponse("Product not found", { status: 404 });
    }
    return HttpResponse.json(data);
  }),
  http.delete("/api/v2/product/:id", () => {}),
];

// PURL HANDLERS

const purlHandlers = [
  // list fully qualified purls
  http.get("/api/v2/purl", () => {
    return HttpResponse.json(getPurls);
  }),

  // retrieve versioned pURL details of a type
  http.get("/api/v2/purl/type/:type/:namespace_and_name@:version", () => {}),

  // retrieve details of a fully qualified purl
  http.get("/api/v2/purl/:key", ({ params }) => {
    const { key } = params;

    if (!key) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = purlDetails[key as string];
    if (!data) {
      return new HttpResponse("Purl not found", { status: 404 });
    }
    return HttpResponse.json(data);
  }),
];

// BASE PURL HANDLERS

const basePurlHandlers = [
  // list base versionless pURLs
  http.get("/api/v2/purl/base", () => {}),

  // retrieve details for a base versionless pURL
  http.get("/api/v2/purl/base/:key", () => {}),
];

// PURL TYPE HANDLERS

const purlTypeHandlers = [
  // list known pURL types
  http.get("/api/v2/purl/type", () => {}),

  // retrieve details about a pURL type
  http.get("/api/v2/purl/type/:type", () => {}),

  // retrieve base pURL details of a type
  http.get("/api/v2/purl/type/:type/:namespace_and_name", () => {}),
];

// VERSIONED PURL HANDLERS

const versionedPurlHandlers = [
  // retrieve details of a versioned, non-qualified pURL
  http.get("/api/v2/purl/version/{key}", () => {}),
];

// SBOM HANDLERS

const sbomHandlers = [
  // get ALL SBOMs
  http.get("/api/v2/sbom", () => {
    return HttpResponse.json(getSboms);
  }),

  // upload a new SBOM
  http.post("/api/v2/sbom", () => {}),

  // find all SBOMs containing the provided package
  // NOTE: The package can be provided either via a PURL or
  // using the ID of a package as returned by other APIs, but not both.
  http.get("/api/v2/sbom/by-package", () => {
    return HttpResponse.json(getSboms);
  }),

  // count all SBOMs containing the provided packages
  http.get("/api/v2/sbom/count-by-package", () => {
    return HttpResponse.json(getSboms);
  }),

  // get an SBOM by its ID
  http.get("/api/v2/sbom/:id", ({ params }) => {
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

  http.delete("/api/v2/sbom/:id", () => {}),

  http.get("/api/v2/sbom/:id/advisory", ({ params }) => {
    const { id } = params;
    if (!id) {
      return new HttpResponse("Advisory for SBOM not found", { status: 404 });
    } else {
      const data = sbomAdvisory[id as string];
      if (!data) {
        return new HttpResponse("Advisory for SBOM not found", { status: 404 });
      }

      return HttpResponse.json(data);
    }
  }),

  // replace labels of an SBOM
  http.put("/api/v2/sbom/:id/label", () => {}),

  // modify existing labels of an SBOM
  http.patch("/api/v2/sbom/:id/label", () => {}),

  // search for packages of an SBOM
  http.get("/api/v2/sbom/:id/packages", ({ params }) => {
    const { id } = params;
    if (!id) {
      return new HttpResponse("Packages for SBOM not found", { status: 404 });
    } else {
      const data = sbomPackages[id as string];
      if (!data) {
        return new HttpResponse("Packages for SBOM not found", { status: 404 });
      }

      return HttpResponse.json(data);
    }
  }),

  // search for related packages in an SBOM
  http.get("/api/v2/sbom/:id/related", () => {}),

  http.get("/api/v2/sbom/:key/download", () => {}),
];

// USER PREFERENCES HANDLERS

const userPreferencesHandlers = [
  http.get("/api/v2/userPreference/:key", () => {}),
  http.put("/api/v2/userPreference/:key", () => {}),
  http.delete("/api/v2/userPreference/:key", () => {}),
];

// VULNERABILITY HANDLERS

const vulnerabilityHandlers = [
  http.get("/api/v2/vulnerability", ({ request }) => {
    // construct a URL instance out of the request intercepted
    const url = new URL(request.url);

    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/vulnerability?id=1", "vulnerabilityId" will equal "1".
    // const vulnerabilityId = url.searchParams.get("id");
    const limit = url.searchParams.get("limit");

    return HttpResponse.json(getVulnerabilities);
  }),

  http.get("/api/v2/vulnerability/:id", ({ params }) => {
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

  http.delete("/api/v2/vulnerability/:id", ({ params }) => {
    const { id } = params;

    if (!id) {
      return new HttpResponse(null, { status: 404 });
    }
  }),
];

// WEAKNESS HANDLERS

const weaknessHandlers = [
  // list weaknesses
  http.get("/api/v2/weakness", () => {}),

  http.get("/api/v2/weakness/:id", () => {}),
];

// named imports
export {
  advisoryHandlers,
  aiHandlers,
  analysisHandlers,
  assetHandlers,
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
  // ...assetHandlers,
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
