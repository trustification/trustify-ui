import { renderHook } from "@testing-library/react";
import { type Mock, vi } from "vitest";

import type {
  AdvisoryHead,
  SbomAdvisory,
  ScoredVector,
  ScoreType,
  Severity,
} from "@app/client";
import { useFetchSbomsAdvisory } from "@app/queries/sboms";

import {
  buildVexByPurl,
  useVulnerabilitiesOfSbom,
} from "./useVulnerabilitiesOfSbom";

vi.mock("@app/queries/sboms", () => ({
  useFetchSbomsAdvisory: vi.fn(),
  useFetchSbomsAdvisoryBatch: vi.fn(),
}));

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
  base: { uuid: `base-${purl}`, purl: purl.split("@")[0] ?? purl },
  qualifiers: {},
  version: {
    uuid: `ver-${purl}`,
    purl,
    version: purl.split("@")[1] ?? "0",
  },
});

const makeScoredVector = (
  type: ScoreType,
  value: number,
  severity: Severity,
): ScoredVector => ({
  type,
  value,
  severity,
  vector: `CVSS:${type}/AV:N`,
});

const makeSbomAdvisory = (opts: {
  advisory?: Partial<AdvisoryHead>;
  statuses: Array<{
    identifier: string;
    status: string;
    purls: string[];
    scores?: ScoredVector[];
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
      scores: s.scores ?? [],
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

describe("makePurl fixture", () => {
  it("derives base.purl from the segment before '@'", () => {
    expect(makePurl("pkg:maven/com.example/lib@1.0").base.purl).toBe(
      "pkg:maven/com.example/lib",
    );
  });

  it("falls back to the whole purl when there is no version", () => {
    expect(makePurl("pkg:maven/com.example/lib").base.purl).toBe(
      "pkg:maven/com.example/lib",
    );
  });
});

/**
 * These tests drive the (non-exported) `advisoryToModels` grouping logic through
 * the public `useVulnerabilitiesOfSbom` hook. They pin the "opinionated
 * advisory" precedence rules used when two advisories report the same
 * vulnerability with different CVSS scores.
 */
describe("useVulnerabilitiesOfSbom - opinionated advisory precedence", () => {
  const mockAdvisories = (advisories: SbomAdvisory[]) => {
    (useFetchSbomsAdvisory as Mock).mockReturnValue({
      advisories,
      isFetching: false,
      fetchError: null,
    });
  };

  const twoAdvisoriesForSameVuln = (
    scoresA: ScoredVector[],
    scoresB: ScoredVector[],
  ): SbomAdvisory[] => [
    makeSbomAdvisory({
      advisory: { uuid: "adv-A", identifier: "ADV-A" },
      statuses: [
        {
          identifier: "CVE-2024-0001",
          status: "affected",
          purls: ["pkg:maven/com.example/lib-a@1.0"],
          scores: scoresA,
        },
      ],
    }),
    makeSbomAdvisory({
      advisory: { uuid: "adv-B", identifier: "ADV-B" },
      statuses: [
        {
          identifier: "CVE-2024-0001",
          status: "affected",
          purls: ["pkg:maven/com.example/lib-b@1.0"],
          scores: scoresB,
        },
      ],
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a single entry per advisory when there is nothing to group", () => {
    mockAdvisories([
      makeSbomAdvisory({
        advisory: { uuid: "adv-A", identifier: "ADV-A" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "affected",
            purls: ["pkg:maven/com.example/lib-a@1.0"],
            scores: [makeScoredVector("3.1", 7.5, "high")],
          },
        ],
      }),
    ]);

    const { result } = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"));
    const vulnerabilities = result.current.data.vulnerabilities;

    expect(vulnerabilities).toHaveLength(1);
    const opinionated = vulnerabilities[0]!.opinionatedAdvisory;
    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score?.type).toBe("3.1");
    expect(opinionated.extendedSeverity).toBe("high");
  });

  // Different score types => the cross-type branch wins by score-type
  // precedence (2.0 < 3.1 < 3.0 < 4.0); the CVSS value is NOT considered.
  it("prefers the 2.0 advisory over the 3.1 advisory (current beats existing)", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.8, "critical")],
        [makeScoredVector("2.0", 2.1, "low")],
      ),
    );

    const { result } = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"));
    const vulnerabilities = result.current.data.vulnerabilities;

    expect(vulnerabilities).toHaveLength(1);
    const opinionated = vulnerabilities[0]!.opinionatedAdvisory;
    expect(opinionated.advisory?.uuid).toBe("adv-B");
    expect(opinionated.score?.type).toBe("2.0");
    expect(opinionated.score?.value).toBe(2.1);
    expect(opinionated.extendedSeverity).toBe("low");
  });

  it("prefers the 2.0 advisory over the 3.1 advisory (existing beats current)", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("2.0", 2.1, "low")],
        [makeScoredVector("3.1", 9.8, "critical")],
      ),
    );

    const { result } = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"));
    const opinionated =
      result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score?.type).toBe("2.0");
    expect(opinionated.extendedSeverity).toBe("low");
  });

  it("prefers 3.1 over 4.0", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("4.0", 9.8, "critical")],
        [makeScoredVector("3.1", 5.0, "medium")],
      ),
    );

    const opinionated = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-B");
    expect(opinionated.score?.type).toBe("3.1");
    expect(opinionated.extendedSeverity).toBe("medium");
  });

  // Same score type => the higher CVSS value wins.
  it("prefers the higher value when both advisories share a score type", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 5.0, "medium")],
        [makeScoredVector("3.1", 9.5, "critical")],
      ),
    );

    const opinionated = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-B");
    expect(opinionated.score?.value).toBe(9.5);
    expect(opinionated.extendedSeverity).toBe("critical");
  });

  it("keeps the existing advisory when it already has the higher value", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.5, "critical")],
        [makeScoredVector("3.1", 5.0, "medium")],
      ),
    );

    const opinionated = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score?.value).toBe(9.5);
    expect(opinionated.extendedSeverity).toBe("critical");
  });

  it("keeps the existing advisory and a null score when neither has scores", () => {
    mockAdvisories(twoAdvisoriesForSameVuln([], []));

    const opinionated = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score).toBeNull();
    expect(opinionated.extendedSeverity).toBe("unknown");
  });

  // A missing score type maps to priority 0, which sorts ahead of every real
  // score type, so an unscored advisory currently outranks a scored one.
  it("prefers an unscored advisory over a scored one", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln([], [makeScoredVector("4.0", 9.8, "critical")]),
    );

    const opinionated = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score).toBeNull();
    expect(opinionated.extendedSeverity).toBe("unknown");
  });

  it("picks the lowest-precedence score type within a single advisory", () => {
    mockAdvisories([
      makeSbomAdvisory({
        advisory: { uuid: "adv-A", identifier: "ADV-A" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "affected",
            purls: ["pkg:maven/com.example/lib-a@1.0"],
            scores: [
              makeScoredVector("4.0", 9.8, "critical"),
              makeScoredVector("2.0", 3.3, "low"),
            ],
          },
        ],
      }),
    ]);

    const opinionated = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.score?.type).toBe("2.0");
    expect(opinionated.extendedSeverity).toBe("low");
  });

  it("merges advisories and purls of a grouped vulnerability", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.8, "critical")],
        [makeScoredVector("2.0", 2.1, "low")],
      ),
    );

    const vulnerability = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities[0]!;

    expect([...vulnerability.advisories.keys()].sort()).toEqual([
      "ADV-A",
      "ADV-B",
    ]);
    expect(vulnerability.advisories.get("ADV-A")?.opinionatedScore?.type).toBe(
      "3.1",
    );
    expect(vulnerability.advisories.get("ADV-B")?.opinionatedScore?.type).toBe(
      "2.0",
    );
    expect(vulnerability.purls.size).toBe(2);
  });

  it("summarizes grouped vulnerabilities using the opinionated severity", () => {
    mockAdvisories(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.8, "critical")],
        [makeScoredVector("2.0", 2.1, "low")],
      ),
    );

    const summary = renderHook(() => useVulnerabilitiesOfSbom("sbom-1")).result
      .current.data.summary;

    expect(summary.vulnerabilityStatus.affected.total).toBe(1);
    expect(summary.vulnerabilityStatus.affected.severities.low).toBe(1);
    expect(summary.vulnerabilityStatus.affected.severities.critical).toBe(0);
  });

  it("does not group vulnerabilities with different statuses", () => {
    mockAdvisories([
      makeSbomAdvisory({
        advisory: { uuid: "adv-A", identifier: "ADV-A" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "affected",
            purls: ["pkg:maven/com.example/lib-a@1.0"],
            scores: [makeScoredVector("3.1", 9.8, "critical")],
          },
        ],
      }),
      makeSbomAdvisory({
        advisory: { uuid: "adv-B", identifier: "ADV-B" },
        statuses: [
          {
            identifier: "CVE-2024-0001",
            status: "fixed",
            purls: ["pkg:maven/com.example/lib-b@1.0"],
            scores: [makeScoredVector("2.0", 2.1, "low")],
          },
        ],
      }),
    ]);

    const vulnerabilities = renderHook(() => useVulnerabilitiesOfSbom("sbom-1"))
      .result.current.data.vulnerabilities;

    expect(vulnerabilities).toHaveLength(2);
  });
});
