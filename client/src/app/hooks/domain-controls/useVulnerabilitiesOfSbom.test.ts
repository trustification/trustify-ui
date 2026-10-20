import type { AdvisoryHead, SbomAdvisory } from "@app/client";

import { buildVexByPurl } from "./useVulnerabilitiesOfSbom";

const makeAdvisory = (overrides: Partial<AdvisoryHead> = {}): AdvisoryHead => ({
  uuid: "adv-uuid-1",
  identifier: "VEX-2024-001",
  document_id: "doc-1",
  issuer: null,
  title: null,
  published: null,
  modified: null,
  withdrawn: null,
  labels: {},
  ...overrides,
});

const makePurl = (purl: string) => ({
  uuid: `uuid-${purl}`,
  purl,
  base: { uuid: `base-${purl}`, purl: purl.split("@")[0] },
  qualifiers: {},
  version: {
    uuid: `ver-${purl}`,
    purl,
    version: purl.split("@")[1] ?? "0",
  },
});

const makeSbomAdvisory = (opts: {
  advisory?: Partial<AdvisoryHead>;
  statuses: Array<{
    identifier: string;
    status: string;
    purls: string[];
  }>;
}): SbomAdvisory => {
  const advisory = makeAdvisory(opts.advisory);
  return {
    ...advisory,
    status: opts.statuses.map((s) => ({
      identifier: s.identifier,
      base_score: null,
      cwes: [],
      description: null,
      discovered: null,
      modified: null,
      normative: false,
      published: null,
      released: null,
      reserved: null,
      title: null,
      withdrawn: null,
      status: s.status,
      context: null,
      fixed_versions: [],
      scores: [],
      packages: s.purls.map((purl) => ({
        id: purl,
        name: purl.split("/").pop()?.split("@")[0] ?? purl,
        cpe: [],
        licenses: [],
        licenses_ref_mapping: [],
        purl: [makePurl(purl)],
      })),
    })),
  };
};

describe("buildVexByPurl", () => {
  it("returns empty map for no advisories", () => {
    expect(buildVexByPurl([])).toEqual(new Map());
  });

  it("ignores affected entries", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "affected",
            purls: ["pkg:maven/com.example/lib@1.0"],
          },
        ],
      }),
    ]);
    expect(result.size).toBe(0);
  });

  it("ignores under_investigation entries", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "under_investigation",
            purls: ["pkg:maven/com.example/lib@1.0"],
          },
        ],
      }),
    ]);
    expect(result.size).toBe(0);
  });

  it("indexes not_affected entries by vuln ID and PURL", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        advisory: { uuid: "adv-1", identifier: "VEX-001" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "not_affected",
            purls: ["pkg:maven/com.example/lib@1.0"],
          },
        ],
      }),
    ]);

    expect(result.size).toBe(1);
    const purlMap = result.get("CVE-2024-0001")!;
    expect(purlMap.size).toBe(1);
    const resolution = purlMap.get("pkg:maven/com.example/lib@1.0")!;
    expect(resolution.status).toBe("not_affected");
    expect(resolution.advisory.uuid).toBe("adv-1");
  });

  it("indexes fixed entries", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0002",
            status: "fixed",
            purls: ["pkg:maven/com.example/lib@2.0"],
          },
        ],
      }),
    ]);

    const resolution = result
      .get("CVE-2024-0002")!
      .get("pkg:maven/com.example/lib@2.0")!;
    expect(resolution.status).toBe("fixed");
  });

  it("indexes known_not_affected entries", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0003",
            status: "known_not_affected",
            purls: ["pkg:maven/com.example/lib@3.0"],
          },
        ],
      }),
    ]);

    const resolution = result
      .get("CVE-2024-0003")!
      .get("pkg:maven/com.example/lib@3.0")!;
    expect(resolution.status).toBe("known_not_affected");
  });

  it("groups multiple PURLs under the same CVE", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "not_affected",
            purls: [
              "pkg:maven/com.example/lib-a@1.0",
              "pkg:maven/com.example/lib-b@1.0",
            ],
          },
        ],
      }),
    ]);

    const purlMap = result.get("CVE-2024-0001")!;
    expect(purlMap.size).toBe(2);
    expect(purlMap.has("pkg:maven/com.example/lib-a@1.0")).toBe(true);
    expect(purlMap.has("pkg:maven/com.example/lib-b@1.0")).toBe(true);
  });

  it("keeps separate entries for different CVEs", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "not_affected",
            purls: ["pkg:maven/com.example/lib@1.0"],
          },
          {
            identifier: "CVE-2024-0002",
            status: "fixed",
            purls: ["pkg:maven/com.example/other@2.0"],
          },
        ],
      }),
    ]);

    expect(result.size).toBe(2);
    expect(result.has("CVE-2024-0001")).toBe(true);
    expect(result.has("CVE-2024-0002")).toBe(true);
  });

  it("skips packages with no PURLs", () => {
    const advisory = makeAdvisory();
    const sbomAdvisory: SbomAdvisory = {
      ...advisory,
      status: [
        {
          identifier: "CVE-2024-0001",
          base_score: null,
          cwes: [],
          description: null,
          discovered: null,
          modified: null,
          normative: false,
          published: null,
          released: null,
          reserved: null,
          title: null,
          withdrawn: null,
          status: "not_affected",
          fixed_versions: [],
          scores: [],
          context: null,
          packages: [
            {
              id: "orphan",
              name: "some-component",
              cpe: [],
              licenses: [],
              licenses_ref_mapping: [],
              purl: [],
            },
            {
              id: "p1",
              name: "lib",
              cpe: [],
              licenses: [],
              licenses_ref_mapping: [],
              purl: [makePurl("pkg:maven/com.example/lib@1.0")],
            },
          ],
        },
      ],
    };

    const result = buildVexByPurl([sbomAdvisory]);
    const purlMap = result.get("CVE-2024-0001")!;
    expect(purlMap.size).toBe(1);
    expect(purlMap.has("pkg:maven/com.example/lib@1.0")).toBe(true);
  });

  it("does not include affected-only CVEs in the result", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "affected",
            purls: [
              "pkg:maven/com.example/lib-a@1.0",
              "pkg:maven/com.example/lib-b@1.0",
            ],
          },
          {
            identifier: "CVE-2024-0002",
            status: "not_affected",
            purls: ["pkg:maven/com.example/lib-c@1.0"],
          },
        ],
      }),
    ]);

    expect(result.has("CVE-2024-0001")).toBe(false);
    expect(result.has("CVE-2024-0002")).toBe(true);
  });

  it("preserves advisory-to-package association across multiple advisories", () => {
    const result = buildVexByPurl([
      makeSbomAdvisory({
        advisory: { uuid: "adv-A", identifier: "VEX-A" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "not_affected",
            purls: ["pkg:maven/com.example/lib-a@1.0"],
          },
        ],
      }),
      makeSbomAdvisory({
        advisory: { uuid: "adv-B", identifier: "VEX-B" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "not_affected",
            purls: ["pkg:maven/com.example/lib-b@1.0"],
          },
        ],
      }),
    ]);

    const purlMap = result.get("CVE-2024-0001")!;
    expect(purlMap.size).toBe(2);
    expect(purlMap.get("pkg:maven/com.example/lib-a@1.0")!.advisory.uuid).toBe(
      "adv-A",
    );
    expect(purlMap.get("pkg:maven/com.example/lib-b@1.0")!.advisory.uuid).toBe(
      "adv-B",
    );
  });
});
