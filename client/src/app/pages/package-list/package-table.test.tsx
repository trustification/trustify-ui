import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const mockPurl = "pkg:maven/org.apache.log4j/log4j-core@2.14.1";
const mockPackages = [{ purl: mockPurl, uuid: "pkg-uuid-1" }];

const mockRecommendationsMap = new Map<
  string,
  { package: string; vulnerabilities: { id: string; remediations: [] }[] }[]
>();

vi.mock("@app/queries/packages", () => ({
  useFetchPackages: () => ({
    result: { data: mockPackages, total: 1, params: {} },
    isFetching: false,
    fetchError: null,
    refetch: vi.fn(),
  }),
}));

vi.mock("@app/queries/licenses", () => ({
  useFetchLicenses: () => ({ result: { data: [] } }),
}));

vi.mock("@app/queries/recommendations", () => ({
  useFetchRecommendations: () => ({
    recommendationsMap: mockRecommendationsMap,
    isFetching: false,
    fetchError: null,
  }),
}));

vi.mock("@app/components/WithPackage", () => ({
  WithPackage: ({ children }: { children: (pkg: null) => React.ReactNode }) =>
    children(null),
}));

vi.mock("./components/PackageVulnerabilities", () => ({
  PackageVulnerabilities: () => null,
}));

vi.mock("./components/PackageLicences", () => ({
  PackageLicenses: () => null,
}));

import { PackageSearchProvider } from "./package-provider";
import { PackageTable } from "./package-table";

describe("PackageTable remediation column", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <PackageSearchProvider>
          <PackageTable />
        </PackageSearchProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockRecommendationsMap.clear();
  });

  /** Verifies the "Remediations" column header is rendered in the global packages table. */
  it("renders the Remediations column header", () => {
    renderComponent();
    expect(screen.getByText("Remediations")).toBeInTheDocument();
  });

  /** Verifies that a package row with CVE-scoped recommendations shows the CVE count. */
  it("renders remediation count when CVE-scoped recommendations exist", () => {
    // Given two CVE-scoped recommendations for the package
    mockRecommendationsMap.set(mockPurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [
          { id: "CVE-2021-44228", remediations: [] },
          { id: "CVE-2021-45046", remediations: [] },
        ],
      },
    ]);

    // When rendering the packages table
    renderComponent();

    // Then the count of CVEs with remediations is shown
    expect(screen.getByText("2 Remediations")).toBeInTheDocument();
  });

  /** Verifies that a package row with no recommendations renders "0 Remediations". */
  it("renders 0 Remediations when no recommendations exist", () => {
    renderComponent();
    expect(screen.getByText("0 Remediations")).toBeInTheDocument();
  });

  /** Verifies that a recommendation with no CVE scope (empty vulnerabilities) does not inflate the count. */
  it("does not count CVE-agnostic recommendations toward remediation count", () => {
    // Given a recommendation with no CVE scope
    mockRecommendationsMap.set(mockPurl, [
      {
        package: "pkg:maven/org.apache.log4j/log4j-core@2.17.2",
        vulnerabilities: [],
      },
    ]);

    // When rendering the packages table
    renderComponent();

    // Then count remains 0 (no CVE IDs to count)
    expect(screen.getByText("0 Remediations")).toBeInTheDocument();
  });
});
