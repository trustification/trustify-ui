import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import type { PurlSummary } from "@app/client";

const makePurlSummary = (purl: string, uuid: string): PurlSummary =>
  ({ purl, uuid }) as unknown as PurlSummary;

const makePurlEntry = (purl: string, uuid: string) => ({
  isOrphan: false as const,
  purlSummary: makePurlSummary(purl, uuid),
});

const mockVulnerability = {
  vulnerability: { identifier: "CVE-2024-12345" },
  vulnerabilityStatus: "affected" as const,
  advisories: new Map(),
  purls: new Map([
    [
      "purl-key-1",
      makePurlEntry("pkg:maven/org.apache.log4j/log4j-core@2.14.1", "uuid-1"),
    ],
  ]),
  opinionatedAdvisory: {
    advisory: null,
    score: null,
    extendedSeverity: "none" as const,
  },
};

const mockRecommendationsMap = new Map<
  string,
  {
    package: string;
    vulnerabilities: {
      id: string;
      status?: string | null;
      remediations: [];
    }[];
  }[]
>();

vi.mock("@app/hooks/domain-controls/useVulnerabilitiesOfSbom", () => ({
  useVulnerabilitiesOfSbom: () => ({
    data: {
      vulnerabilities: [mockVulnerability],
      summary: {
        vulnerabilityStatus: {
          affected: { total: 1, severities: {} },
          not_affected: { total: 0, severities: {} },
          fixed: { total: 0, severities: {} },
          under_investigation: { total: 0, severities: {} },
        },
      },
    },
    advisories: [],
    isFetching: false,
    fetchError: null,
  }),
  buildVexByPurl: () => new Map(),
}));

vi.mock("@app/queries/sboms", () => ({
  useFetchSBOMById: () => ({
    sbom: { name: "test-sbom", described_by: [] },
    isFetching: false,
    fetchError: null,
  }),
}));

vi.mock("@app/queries/recommendations", () => ({
  useFetchRecommendations: () => ({
    recommendationsMap: mockRecommendationsMap,
    isFetching: false,
    fetchError: null,
  }),
}));

vi.mock("@app/queries/trustifyInfo", () => ({
  useIsExploitIntelligenceEnabled: () => false,
}));

vi.mock("@app/hooks/domain-controls/useExploitIntelligenceOfSbom", () => ({
  useExploitIntelligenceOfSbom: () => ({
    stateMap: {},
    trackJob: vi.fn(),
  }),
}));

vi.mock("@app/queries/exploit-intelligence", () => ({
  useSubmitExploitAnalysisMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@app/components/SbomVulnerabilitiesDonutChart", () => ({
  SbomVulnerabilitiesDonutChart: () => null,
}));

vi.mock("@app/components/WithPackage", () => ({
  WithPackage: ({
    children,
  }: {
    children: (pkg: null, isFetching: boolean) => React.ReactNode;
  }) => <>{children(null, false)}</>,
}));

vi.mock("@app/components/LoadingWrapper", () => ({
  LoadingWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { VulnerabilitiesBySbom } from "./vulnerabilities-by-sbom";

describe("VulnerabilitiesBySbom remediation column", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <VulnerabilitiesBySbom sbomId="test-sbom-id" />
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockRecommendationsMap.clear();
  });

  /** Verifies the "Remediations" column header renders in the vulnerabilities table. */
  it("renders the Remediations column header", () => {
    renderComponent();
    expect(screen.getAllByText(/Remediations/).length).toBeGreaterThan(0);
  });

  /** Verifies that a CVE row counts packages with recommendations that have Fixed status for the CVE. */
  it("renders count of packages with Fixed recommendations for a CVE row", () => {
    // Given a recommendation with Fixed status for the affected CVE
    const affectedPurl = "pkg:maven/org.apache.log4j/log4j-core@2.14.1";
    mockRecommendationsMap.set(affectedPurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2024-12345", status: "Fixed", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities table
    renderComponent();

    // Then the count shows 1 package with a remediation (singular)
    expect(screen.getByText("1 Remediation")).toBeInTheDocument();
  });

  /** Verifies that a recommendation with Affected status is not counted in the remediation count. */
  it("does not count recommendations with Affected status", () => {
    // Given a recommendation with Affected status for the CVE
    const affectedPurl = "pkg:maven/org.apache.log4j/log4j-core@2.14.1";
    mockRecommendationsMap.set(affectedPurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2024-12345", status: "Affected", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities table
    renderComponent();

    // Then the count shows 0 (Affected status does not count as remediation)
    expect(screen.getByText("0 Remediations")).toBeInTheDocument();
  });

  /** Verifies that a recommendation with empty vulnerabilities array is not counted. */
  it("does not count recommendations with empty vulnerabilities array", () => {
    // Given a recommendation with an empty vulnerabilities array
    const affectedPurl = "pkg:maven/org.apache.log4j/log4j-core@2.14.1";
    mockRecommendationsMap.set(affectedPurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [],
      },
    ]);

    // When rendering the vulnerabilities table
    renderComponent();

    // Then the count shows 0 (no VEX proof for this CVE)
    expect(screen.getByText("0 Remediations")).toBeInTheDocument();
  });

  /** Verifies that a CVE row with no recommendations renders "0 Remediations". */
  it("renders 0 Remediations when no packages have recommendations", () => {
    renderComponent();
    expect(screen.getByText("0 Remediations")).toBeInTheDocument();
  });
});
