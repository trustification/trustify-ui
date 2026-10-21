import { renderHook } from "@testing-library/react";
import { type Mock, vi } from "vitest";

import type {
  AdvisoryHead,
  AnalysisPurlStatus,
  AnalysisResponseV3,
  ScoredVector,
  ScoreType,
  Severity,
  VulnerabilityHead,
} from "@app/client";
import { useFetchVulnerabilitiesByPackageIds } from "@app/queries/vulnerabilities";

import { useVulnerabilitiesOfSbomByPurls } from "./useVulnerabilitiesOfSbom";

vi.mock("@app/queries/vulnerabilities", () => ({
  useFetchVulnerabilitiesByPackageIds: vi.fn(),
}));

const makeAdvisory = (overrides: Partial<AdvisoryHead> = {}): AdvisoryHead => ({
  uuid: "adv-uuid-1",
  identifier: "ADV-001",
  document_id: "doc-1",
  issuer: null,
  title: null,
  published: null,
  modified: null,
  withdrawn: null,
  labels: {},
  ...overrides,
});

const makeVulnerability = (
  overrides: Partial<VulnerabilityHead> = {},
): VulnerabilityHead => ({
  identifier: "CVE-2024-0001",
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
  ...overrides,
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

const makePurlStatus = (opts: {
  advisory: AdvisoryHead;
  status?: string;
  vulnerabilityId?: string;
  scores?: ScoredVector[];
}): AnalysisPurlStatus => ({
  advisory: opts.advisory,
  context: null,
  fixed_versions: [],
  scores: opts.scores ?? [],
  status: opts.status ?? "affected",
  vulnerability: makeVulnerability({
    identifier: opts.vulnerabilityId ?? "CVE-2024-0001",
  }),
  remediations: [],
});

const makeAnalysisResponse = (
  purlStatuses: AnalysisPurlStatus[],
  purl = "pkg:maven/com.example/lib@1.0",
): AnalysisResponseV3 => ({
  [purl]: {
    warnings: [],
    details: [
      {
        ...makeVulnerability({
          identifier: purlStatuses[0]?.vulnerability.identifier,
        }),
        purl_statuses: purlStatuses,
      },
    ],
  },
});

const mockAnalysis = (
  analysisResponse: AnalysisResponseV3,
  overrides: { isFetching?: boolean; fetchError?: unknown } = {},
) => {
  (useFetchVulnerabilitiesByPackageIds as Mock).mockReturnValue({
    analysisResponse,
    isFetching: overrides.isFetching ?? false,
    fetchError: overrides.fetchError ?? null,
  });
};

const renderVulnerabilities = () =>
  renderHook(() =>
    useVulnerabilitiesOfSbomByPurls(["pkg:maven/com.example/lib@1.0"]),
  ).result.current.data;

/**
 * Two advisories reporting the same vulnerability + status for the same purl,
 * which forces the grouping branch that computes the opinionated advisory.
 */
const twoAdvisoriesForSameVuln = (
  scoresA: ScoredVector[],
  scoresB: ScoredVector[],
) =>
  makeAnalysisResponse([
    makePurlStatus({
      advisory: makeAdvisory({ uuid: "adv-A", identifier: "ADV-A" }),
      scores: scoresA,
    }),
    makePurlStatus({
      advisory: makeAdvisory({ uuid: "adv-B", identifier: "ADV-B" }),
      scores: scoresB,
    }),
  ]);

describe("useVulnerabilitiesOfSbomByPurls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the default empty result while fetching", () => {
    mockAnalysis({}, { isFetching: true });
    const data = renderVulnerabilities();

    expect(data.vulnerabilities).toEqual([]);
    expect(data.summary.vulnerabilityStatus.affected.total).toBe(0);
  });

  it("returns the default empty result on fetch error", () => {
    mockAnalysis({}, { fetchError: new Error("boom") });
    const data = renderVulnerabilities();

    expect(data.vulnerabilities).toEqual([]);
  });

  it("returns the default empty result for an empty analysis response", () => {
    mockAnalysis({});
    const data = renderVulnerabilities();

    expect(data.vulnerabilities).toEqual([]);
  });

  it("maps a single advisory into one vulnerability entry", () => {
    mockAnalysis(
      makeAnalysisResponse([
        makePurlStatus({
          advisory: makeAdvisory({ uuid: "adv-A", identifier: "ADV-A" }),
          scores: [makeScoredVector("3.1", 7.5, "high")],
        }),
      ]),
    );

    const data = renderVulnerabilities();

    expect(data.vulnerabilities).toHaveLength(1);
    const vulnerability = data.vulnerabilities[0]!;
    expect(vulnerability.vulnerability.identifier).toBe("CVE-2024-0001");
    expect(vulnerability.status).toBe("affected");
    expect(vulnerability.purls).toEqual(
      new Set(["pkg:maven/com.example/lib@1.0"]),
    );
    expect(vulnerability.opinionatedAdvisory.advisory?.uuid).toBe("adv-A");
    expect(vulnerability.opinionatedAdvisory.score?.type).toBe("3.1");
    expect(vulnerability.opinionatedAdvisory.extendedSeverity).toBe("high");
  });

  it("uses a null opinionated score when the advisory has no scores", () => {
    mockAnalysis(
      makeAnalysisResponse([
        makePurlStatus({
          advisory: makeAdvisory({ uuid: "adv-A", identifier: "ADV-A" }),
          scores: [],
        }),
      ]),
    );

    const vulnerability = renderVulnerabilities().vulnerabilities[0]!;

    expect(vulnerability.opinionatedAdvisory.score).toBeNull();
    expect(vulnerability.opinionatedAdvisory.extendedSeverity).toBe("unknown");
    expect(vulnerability.advisories.get("ADV-A")?.opinionatedScore).toBeNull();
  });

  it("picks the lowest-precedence score type within a single advisory", () => {
    mockAnalysis(
      makeAnalysisResponse([
        makePurlStatus({
          advisory: makeAdvisory({ uuid: "adv-A", identifier: "ADV-A" }),
          scores: [
            makeScoredVector("4.0", 9.8, "critical"),
            makeScoredVector("2.0", 3.3, "low"),
          ],
        }),
      ]),
    );

    const vulnerability = renderVulnerabilities().vulnerabilities[0]!;

    expect(vulnerability.opinionatedAdvisory.score?.type).toBe("2.0");
    expect(vulnerability.opinionatedAdvisory.extendedSeverity).toBe("low");
  });

  // Different score types => precedence is by score type (2.0 < 3.1 < 3.0 <
  // 4.0), the CVSS value is NOT considered.
  it("prefers the 2.0 advisory over the 3.1 advisory (current beats existing)", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.8, "critical")],
        [makeScoredVector("2.0", 2.1, "low")],
      ),
    );

    const data = renderVulnerabilities();

    expect(data.vulnerabilities).toHaveLength(1);
    const opinionated = data.vulnerabilities[0]!.opinionatedAdvisory;
    expect(opinionated.advisory?.uuid).toBe("adv-B");
    expect(opinionated.score?.type).toBe("2.0");
    expect(opinionated.score?.value).toBe(2.1);
    expect(opinionated.extendedSeverity).toBe("low");
  });

  it("prefers the 2.0 advisory over the 3.1 advisory (existing beats current)", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("2.0", 2.1, "low")],
        [makeScoredVector("3.1", 9.8, "critical")],
      ),
    );

    const opinionated =
      renderVulnerabilities().vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score?.type).toBe("2.0");
    expect(opinionated.extendedSeverity).toBe("low");
  });

  it("prefers 3.1 over 4.0", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("4.0", 9.8, "critical")],
        [makeScoredVector("3.1", 5.0, "medium")],
      ),
    );

    const opinionated =
      renderVulnerabilities().vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-B");
    expect(opinionated.score?.type).toBe("3.1");
    expect(opinionated.extendedSeverity).toBe("medium");
  });

  // A missing score type maps to priority 0, which sorts ahead of every real
  // score type, so an unscored advisory currently outranks a scored one.
  it("prefers an unscored advisory over a scored one", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln([], [makeScoredVector("4.0", 9.8, "critical")]),
    );

    const opinionated =
      renderVulnerabilities().vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score).toBeNull();
    expect(opinionated.extendedSeverity).toBe("unknown");
  });

  // Same score type => the higher CVSS value wins.
  it("prefers the higher value when both advisories share a score type", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 5.0, "medium")],
        [makeScoredVector("3.1", 9.5, "critical")],
      ),
    );

    const opinionated =
      renderVulnerabilities().vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-B");
    expect(opinionated.score?.value).toBe(9.5);
    expect(opinionated.extendedSeverity).toBe("critical");
  });

  it("keeps the existing advisory when it already has the higher value", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.5, "critical")],
        [makeScoredVector("3.1", 5.0, "medium")],
      ),
    );

    const opinionated =
      renderVulnerabilities().vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score?.value).toBe(9.5);
    expect(opinionated.extendedSeverity).toBe("critical");
  });

  it("keeps the existing advisory and a null score when neither has scores", () => {
    mockAnalysis(twoAdvisoriesForSameVuln([], []));

    const opinionated =
      renderVulnerabilities().vulnerabilities[0]!.opinionatedAdvisory;

    expect(opinionated.advisory?.uuid).toBe("adv-A");
    expect(opinionated.score).toBeNull();
    expect(opinionated.extendedSeverity).toBe("unknown");
  });

  it("merges both advisories into the grouped entry with their own scores", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.8, "critical")],
        [makeScoredVector("2.0", 2.1, "low")],
      ),
    );

    const vulnerability = renderVulnerabilities().vulnerabilities[0]!;

    expect([...vulnerability.advisories.keys()].sort()).toEqual([
      "ADV-A",
      "ADV-B",
    ]);
    expect(vulnerability.advisories.get("ADV-A")?.opinionatedScore?.type).toBe(
      "3.1",
    );
    expect(
      vulnerability.advisories.get("ADV-A")?.opinionatedExtendedSeverity,
    ).toBe("critical");
    expect(vulnerability.advisories.get("ADV-B")?.opinionatedScore?.type).toBe(
      "2.0",
    );
    expect(
      vulnerability.advisories.get("ADV-B")?.opinionatedExtendedSeverity,
    ).toBe("low");
  });

  it("collects the purls of a vulnerability reported for several packages", () => {
    const statusA = makePurlStatus({
      advisory: makeAdvisory({ uuid: "adv-A", identifier: "ADV-A" }),
      scores: [makeScoredVector("3.1", 7.5, "high")],
    });
    mockAnalysis({
      ...makeAnalysisResponse([statusA], "pkg:maven/com.example/lib-a@1.0"),
      ...makeAnalysisResponse([statusA], "pkg:maven/com.example/lib-b@1.0"),
    });

    const vulnerability = renderVulnerabilities().vulnerabilities[0]!;

    expect(vulnerability.purls).toEqual(
      new Set([
        "pkg:maven/com.example/lib-a@1.0",
        "pkg:maven/com.example/lib-b@1.0",
      ]),
    );
  });

  it("does not group entries with different statuses", () => {
    mockAnalysis(
      makeAnalysisResponse([
        makePurlStatus({
          advisory: makeAdvisory({ uuid: "adv-A", identifier: "ADV-A" }),
          status: "affected",
          scores: [makeScoredVector("3.1", 9.8, "critical")],
        }),
        makePurlStatus({
          advisory: makeAdvisory({ uuid: "adv-B", identifier: "ADV-B" }),
          status: "fixed",
          scores: [makeScoredVector("2.0", 2.1, "low")],
        }),
      ]),
    );

    expect(renderVulnerabilities().vulnerabilities).toHaveLength(2);
  });

  it("summarizes grouped vulnerabilities using the opinionated severity", () => {
    mockAnalysis(
      twoAdvisoriesForSameVuln(
        [makeScoredVector("3.1", 9.8, "critical")],
        [makeScoredVector("2.0", 2.1, "low")],
      ),
    );

    const summary = renderVulnerabilities().summary;

    expect(summary.vulnerabilityStatus.affected.total).toBe(1);
    expect(summary.vulnerabilityStatus.affected.severities.low).toBe(1);
    expect(summary.vulnerabilityStatus.affected.severities.critical).toBe(0);
  });
});
