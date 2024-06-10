import { rest } from "msw";

import * as AppRest from "@app/api/rest";
import { Advisory } from "@app/api/models";

export const mockAdvisoryArray: Advisory[] = [
  {
    identifier: "advisory-1",
    average_severity: "critical",
    published: new Date().toString(),
    modified: new Date().toString(),
    title: "Title 1",
    uuid: "sha356-1",
    issuer: { name: "Issuer 1", website: "http://website.com" },
    vulnerabilities: [
      {
        identifier: "cve1",
        severity: "critical",
        non_normative: {
          title: "Title1",
          discovered: new Date().toString(),
          released: new Date().toString(),
        },
        cwe: "Cwe1",
      },
      {
        identifier: "cve2",
        severity: "low",
        non_normative: {
          title: "Title2",
          discovered: new Date().toString(),
          released: new Date().toString(),
        },
        cwe: "Cwe2",
      },
    ],
  },
];

export const handlers = [
  rest.get(AppRest.ADVISORIES, (req, res, ctx) => {
    return res(
      ctx.json({ items: mockAdvisoryArray, total: mockAdvisoryArray.length })
    );
  }),
  rest.get(`${AppRest.ADVISORIES}/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const item = mockAdvisoryArray.find((app) => app.identifier === id);
    if (item) {
      return res(ctx.json(item));
    } else {
      return res(ctx.status(404), ctx.json({ message: "Advisory not found" }));
    }
  }),
  rest.get(`${AppRest.ADVISORIES}/:id/source`, (req, res, ctx) => {
    return res(
      ctx.json(
        "This is Mock data, but the real API should return the advisory JSON file"
      )
    );
  }),
];

export default handlers;
