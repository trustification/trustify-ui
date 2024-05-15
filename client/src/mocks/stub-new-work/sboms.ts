import { rest } from "msw";

import * as AppRest from "@app/api/rest";
import { Package, SBOM } from "@app/api/models";
import { mockAdvisoryArray } from "./advisories";
import { mockVulnerabilityArray } from "./vulnerabilities";

export const mockSBOMArray: SBOM[] = [
  {
    id: "sbom1",
    type: "CycloneDX",
    name: "SBOM 1",
    version: "v1",
    authors: ["supplier 1"],
    published: new Date().toString(),
    related_cves: {
      none: 1,
      low: 1,
      medium: 4,
      critical: 2,
      high: 3,
    },
    related_packages: {
      count: 123,
    },
  },
];

export const mockPackageArray: Package[] = [
  {
    id: "package-1",
    name: "Package 1",
    namespace: "Namespace 1",
    type: "Type 1",
    version: "Version 1",
    path: "Path 1",
    qualifiers: {
      key1: "value1",
      key2: "value2",
    },
    related_cves: mockAdvisoryArray.flatMap((e) => e.vulnerabilities),
    related_sboms: mockSBOMArray,
  },
];

export const handlers = [
  rest.get(AppRest.SBOMS, (req, res, ctx) => {
    return res(ctx.json({ items: mockSBOMArray, total: mockSBOMArray.length }));
  }),
  rest.get(`${AppRest.SBOMS}/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const item = mockSBOMArray.find((app) => app.id === id);
    if (item) {
      return res(ctx.json(item));
    } else {
      return res(ctx.status(404), ctx.json({ message: "SBOM not found" }));
    }
  }),
  rest.get(`${AppRest.SBOMS}/:id/source`, (req, res, ctx) => {
    return res(
      ctx.json(
        "This is Mock data, but the real API should return the advisory JSON file"
      )
    );
  }),
  rest.get(`${AppRest.SBOMS}/:id/packages`, (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.json(mockPackageArray));
  }),
  rest.get(`${AppRest.SBOMS}/:id/cves`, (req, res, ctx) => {
    return res(ctx.json(mockVulnerabilityArray));
  }),
];

export default handlers;
