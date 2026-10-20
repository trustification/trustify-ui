import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const mockPackagePurl = "pkg:maven/org.apache.log4j/log4j-core@2.14.1";

const mockVulnerability = {
  vulnerability: {
    identifier: "CVE-2021-44228",
    average_severity: "critical" as const,
    average_score: 10,
    published: "2021-12-10T00:00:00Z",
  },
  vulnerabilityStatus: "affected" as const,
  relatedSboms: [] as {
    advisory: {
      status: {
        vulnerability: { identifier: string };
        fixed_versions: string[];
      }[];
    };
  }[],
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

let mockVulnerabilityList = [mockVulnerability];

vi.mock("@app/queries/packages", () => ({
  useFetchPackageById: () => ({
    pkg: { purl: mockPackagePurl, uuid: "pkg-uuid-1" },
    isFetching: false,
    fetchError: null,
  }),
}));

vi.mock("@app/hooks/domain-controls/useVulnerabilitiesOfPackage", () => ({
  useVulnerabilitiesOfPackageId: () => ({
    data: { vulnerabilities: mockVulnerabilityList },
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

import { VulnerabilitiesByPackage } from "./vulnerabilities-by-package";

describe("VulnerabilitiesByPackage remediation column", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <VulnerabilitiesByPackage packageId="pkg-uuid-1" />
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockRecommendationsMap.clear();
    mockVulnerabilityList = [mockVulnerability];
  });

  /** Verifies the "Remediations" column header renders in the package detail vulnerabilities tab. */
  it("renders the Remediation column header", () => {
    renderComponent();
    expect(screen.getByText("Remediations")).toBeInTheDocument();
  });

  /** Verifies that a vulnerability row renders the recommended version Label when a recommendation has Fixed status. */
  it("renders recommended version Label when recommendation has Fixed status", () => {
    // Given a recommendation with Fixed status for the mock CVE
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2021-44228", status: "Fixed", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then the recommended version is shown as a Label
    expect(screen.getByText("2.17.2")).toBeInTheDocument();
  });

  /** Verifies that a vulnerability row renders the recommended version Label when a recommendation has NotAffected status. */
  it("renders recommended version Label when recommendation has NotAffected status", () => {
    // Given a recommendation with NotAffected status for the mock CVE
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2021-44228", status: "NotAffected", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then the recommended version is shown as a Label
    expect(screen.getByText("2.17.2")).toBeInTheDocument();
  });

  /** Verifies that a recommendation with Affected status does not render a vendor backport label. */
  it("does not render vendor backport label when recommendation status is Affected", () => {
    // Given a recommendation with Affected status for the mock CVE
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2021-44228", status: "Affected", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then no version label or Applied badge is shown
    expect(screen.queryByText("2.17.2")).not.toBeInTheDocument();
    expect(screen.queryByText("Applied")).not.toBeInTheDocument();
  });

  /** Verifies that a recommendation with no status (null) does not render a vendor backport label. */
  it("does not render vendor backport label when recommendation status is null", () => {
    // Given a recommendation with null status for the mock CVE
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2021-44228", status: null, remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then no version label is shown
    expect(screen.queryByText("2.17.2")).not.toBeInTheDocument();
  });

  /** Verifies that a blue Applied badge renders when the recommended PURL matches the current package and status is Fixed. */
  it("renders Applied badge when recommendation matches the current package PURL with Fixed status", () => {
    // Given a recommendation whose PURL base-equals the current package and has Fixed status
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: mockPackagePurl,
        vulnerabilities: [
          { id: "CVE-2021-44228", status: "Fixed", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then the blue Applied badge is shown
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  /** Verifies that the Applied badge does not render when the recommendation matches the current PURL but status is Affected. */
  it("does not render Applied badge when recommendation matches current PURL but status is Affected", () => {
    // Given a recommendation whose PURL base-equals the current package but has Affected status
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: mockPackagePurl,
        vulnerabilities: [
          { id: "CVE-2021-44228", status: "Affected", remediations: [] },
        ],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then no Applied badge is shown
    expect(screen.queryByText("Applied")).not.toBeInTheDocument();
  });

  /** Verifies that a recommendation with empty vulnerabilities array is not shown on any CVE row. */
  it("does not render vendor backport label when recommendation has empty vulnerabilities array", () => {
    // Given a recommendation with an empty vulnerabilities array (no VEX proof)
    mockRecommendationsMap.set(mockPackagePurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [],
      },
    ]);

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then no version label is shown (empty vulnerabilities = no proof it fixes any CVE)
    expect(screen.queryByText("2.17.2")).not.toBeInTheDocument();
  });

  /** Verifies that fixed_versions from related advisories appear as version-upgrade Labels when no vendor recommendation exists. */
  it("renders fixed version Label from advisory when no vendor recommendation exists", () => {
    // Given a vulnerability row with a related advisory that has fixed_versions for the CVE
    mockVulnerabilityList = [
      {
        ...mockVulnerability,
        relatedSboms: [
          {
            advisory: {
              status: [
                {
                  vulnerability: { identifier: "CVE-2021-44228" },
                  fixed_versions: ["2.17.2"],
                },
              ],
            },
          },
        ],
      },
    ];

    // When rendering the vulnerabilities tab
    renderComponent();

    // Then the fixed version is shown (advisory-sourced upgrade, not filtered out)
    expect(screen.getByText("2.17.2")).toBeInTheDocument();
  });

  /** Verifies that a vulnerability row renders no remediation content when no recommendations exist. */
  it("renders no remediation content when no recommendations exist", () => {
    renderComponent();
    expect(screen.queryByText("Applied")).not.toBeInTheDocument();
    expect(screen.queryByText("2.17.2")).not.toBeInTheDocument();
  });
});
