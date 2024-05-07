import { rest } from "msw";

import * as AppRest from "@app/api/rest";
import { Vulnerability } from "@app/api/models";
import { mockAdvisoryArray } from "./advisories";
import { mockSBOMArray } from "./sboms";

export const mockVulnerabilityArray: Vulnerability[] =
  mockAdvisoryArray.flatMap(({ vulnerabilities }) => {
    return vulnerabilities.map((vuln, index) => {
      const result: Vulnerability = {
        ...vuln,
        title: `title${index}`,
        severity: "critical",
        cwe: `cwe${index}`,
        published: new Date().toString(),
        modified: new Date().toString(),

        related_advisories: mockAdvisoryArray,
        related_sboms: mockSBOMArray,
      };
      return result;
    });
  });

export const handlers = [
  rest.get(AppRest.VULNERABILITIES, (req, res, ctx) => {
    return res(
      ctx.json({
        items: mockVulnerabilityArray,
        total: mockVulnerabilityArray.length,
      })
    );
  }),
  rest.get(`${AppRest.VULNERABILITIES}/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const item = mockVulnerabilityArray.find((app) => app.identifier === id);
    if (item) {
      return res(ctx.json(item));
    } else {
      return res(ctx.status(404), ctx.json({ message: "CVE not found" }));
    }
  }),
  rest.get(`${AppRest.VULNERABILITIES}/:id/source`, (req, res, ctx) => {
    return res(
      ctx.json(
        "This is Mock data, but the real API should return the advisory JSON file"
      )
    );
  }),
];

export default handlers;
