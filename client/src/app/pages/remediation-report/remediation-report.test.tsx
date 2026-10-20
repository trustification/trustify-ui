import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  type MockedFunction,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { RouterProvider, createMemoryRouter } from "react-router-dom";

import { RemediationReport } from "./remediation-report";
import { downloadCsv } from "./csv-export";
import { useFetchRemediationReport } from "@app/queries/recommendations";
import type { RecommendReportResponse } from "@app/client";

vi.mock("./csv-export");
vi.mock("@app/queries/recommendations", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@app/queries/recommendations")>();
  return { ...actual, useFetchRemediationReport: vi.fn() };
});

const mockedUseFetchRemediationReport =
  useFetchRemediationReport as MockedFunction<typeof useFetchRemediationReport>;
const mockedDownloadCsv = downloadCsv as MockedFunction<typeof downloadCsv>;

const REPORT_URL = "/sboms/remediation-report?ids=sbom-id-1";
const MODAL_HEADING = "Leave remediation report?";

const sampleReport: RecommendReportResponse = {
  impact_summary: {
    sboms_with_recommendations: 1,
    addressable_packages: 2,
  },
  sboms: [
    {
      id: "sbom-id-1",
      name: "my-sbom.json",
      addressable_packages: 2,
      vulnerability_count: 1,
    },
  ],
  packages: [
    {
      purl: "pkg:maven/org.example/log4j-core@2.14.0",
      recommended_purl: "pkg:maven/com.vendor/log4j-core@2.17.1",
      vulnerabilities: ["CVE-2021-44228"],
      found_in: ["sbom-id-1"],
      advisory_id: null,
    },
    {
      purl: "pkg:maven/org.example/commons-text@1.9",
      recommended_purl: "pkg:maven/com.vendor/commons-text@1.10",
      vulnerabilities: ["CVE-2022-42889"],
      found_in: ["sbom-id-1"],
      advisory_id: null,
    },
  ],
};

const makeHookResult = (
  overrides: Partial<ReturnType<typeof useFetchRemediationReport>> = {},
): ReturnType<typeof useFetchRemediationReport> => ({
  report: sampleReport,
  isFetching: false,
  fetchError: null,
  isLimitExceeded: false,
  ...overrides,
});

/**
 * Renders RemediationReport inside a data router at the report URL with a
 * sibling /sboms route so navigation away can be tested.
 */
const renderReport = (url = REPORT_URL) => {
  window.history.pushState({}, "", url);
  const router = createMemoryRouter(
    [
      { path: "/sboms/remediation-report", element: <RemediationReport /> },
      { path: "/sboms", element: <div>SBOMs list page</div> },
    ],
    { initialEntries: [url] },
  );
  return { router, ...render(<RouterProvider router={router} />) };
};

describe("RemediationReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFetchRemediationReport.mockReturnValue(makeHookResult());
  });

  it("renders impact summary with correct counts from the API response", () => {
    // Given a loaded report with 1 addressable SBOM and 2 addressable packages
    renderReport();

    // Then the impact summary shows the SBOM and package counts.
    // After the redesign the fraction is split across two child elements
    // (.rr-report__stat-value + .rr-report__stat-suffix), so we match the
    // container's full text content with whitespace stripped.
    expect(
      screen.getByText(
        (_, element) =>
          element?.className === "rr-report__stat-value" &&
          (element.textContent ?? "").replace(/\s/g, "") === "1/1",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 of 1 SBOMs/i)).toBeInTheDocument();
    expect(screen.getByText(/2 related packages/i)).toBeInTheDocument();
  });

  it("renders SBOMs table with correct row values", () => {
    // Given a loaded report
    renderReport();

    // Then the SBOM name appears in the rendered output
    const allCells = screen.getAllByRole("cell");
    const sbomNameCells = allCells.filter(
      (c) => c.textContent === "my-sbom.json",
    );
    expect(sbomNameCells.length).toBeGreaterThan(0);
  });

  it("renders all packages in the packages table", () => {
    // Given a report with two package entries
    renderReport();

    // Then both packages appear in the table
    expect(screen.getByText("log4j-core")).toBeInTheDocument();
    expect(screen.getByText("commons-text")).toBeInTheDocument();
  });

  it("renders filter toolbar for the packages table", () => {
    // Given a loaded report with both SBOM and CVE filter categories configured
    renderReport();

    // Then at least one filter toggle button is rendered by FilterToolbar
    const filterButtons = screen.getAllByRole("button");
    expect(filterButtons.length).toBeGreaterThan(0);
    // And both package rows are visible before filtering
    expect(screen.getByText("log4j-core")).toBeInTheDocument();
    expect(screen.getByText("commons-text")).toBeInTheDocument();
  });

  /** Verifies that packages where purl equals recommended_purl render with an "Applied" badge instead of being hidden. */
  it("renders Applied badge for packages where recommended_purl equals purl", () => {
    // Given a report where one package has the same purl and recommended_purl
    mockedUseFetchRemediationReport.mockReturnValue(
      makeHookResult({
        report: {
          ...sampleReport,
          packages: [
            ...sampleReport.packages,
            {
              purl: "pkg:maven/org.example/unchanged@1.0.0",
              recommended_purl: "pkg:maven/org.example/unchanged@1.0.0",
              vulnerabilities: ["CVE-2099-0001"],
              found_in: ["sbom-id-1"],
              advisory_id: null,
            },
          ],
        },
      }),
    );
    renderReport();

    // Then the applied package appears in the table with an "Applied" badge
    expect(screen.getByText("unchanged")).toBeInTheDocument();
    expect(screen.getByText("Applied")).toBeInTheDocument();
    // And the packages with real upgrades still appear
    expect(screen.getByText("log4j-core")).toBeInTheDocument();
  });

  /** Verifies that packages with a different recommended version render the version Label (not Applied). */
  it("renders version Label for packages with a different recommended version", () => {
    // Given the default report where packages have different purl and recommended_purl
    renderReport();

    // Then the recommended versions are shown as Labels (not Applied)
    expect(screen.getByText("2.17.1")).toBeInTheDocument();
    expect(screen.getByText("1.10")).toBeInTheDocument();
    expect(screen.queryByText("Applied")).not.toBeInTheDocument();
  });

  /** Verifies that all packages from the API response appear in the table (no hidden rows). */
  it("renders all packages including applied ones in the table", () => {
    // Given a report with 3 packages: 2 upgrades + 1 applied
    mockedUseFetchRemediationReport.mockReturnValue(
      makeHookResult({
        report: {
          ...sampleReport,
          packages: [
            ...sampleReport.packages,
            {
              purl: "pkg:maven/org.example/applied-pkg@3.0.0",
              recommended_purl: "pkg:maven/org.example/applied-pkg@3.0.0",
              vulnerabilities: ["CVE-2099-0002"],
              found_in: ["sbom-id-1"],
              advisory_id: null,
            },
          ],
        },
      }),
    );
    renderReport();

    // Then all 3 packages are visible in the table
    expect(screen.getByText("log4j-core")).toBeInTheDocument();
    expect(screen.getByText("commons-text")).toBeInTheDocument();
    expect(screen.getByText("applied-pkg")).toBeInTheDocument();
  });

  it("shows a limit-exceeded error when the server returns 413", () => {
    // Given the server rejected the request because too many purls were sent
    mockedUseFetchRemediationReport.mockReturnValue(
      makeHookResult({
        report: null,
        isLimitExceeded: true,
        fetchError: { message: "413", response: { status: 413 } } as never,
      }),
    );
    renderReport();

    // Then a clear error message is shown
    expect(screen.getByText(/Package limit exceeded/i)).toBeInTheDocument();
    expect(screen.getByText(/Select fewer SBOMs/i)).toBeInTheDocument();
  });

  it("shows a warning when no SBOMs are selected", () => {
    // Given the page is opened with no SBOM IDs in the URL
    renderReport("/sboms/remediation-report");

    // Then a guidance alert is shown
    expect(screen.getByText(/No SBOMs selected/i)).toBeInTheDocument();
  });

  it("shows the leave-warning modal when navigating away with an unsaved report", async () => {
    // Given a loaded, not-yet-downloaded report
    renderReport();

    // When the user clicks an in-app link that leaves the page
    fireEvent.click(screen.getByRole("link", { name: "SBOMs" }));

    // Then the confirmation modal appears
    await waitFor(() => {
      expect(screen.getByText(MODAL_HEADING)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/not saved and will be unavailable/i),
    ).toBeInTheDocument();
  });

  it("does not block navigation when the report is still loading", async () => {
    // Given the report has not loaded yet
    mockedUseFetchRemediationReport.mockReturnValue(
      makeHookResult({ report: null, isFetching: true }),
    );
    renderReport();

    // When the user navigates away
    fireEvent.click(screen.getByRole("link", { name: "SBOMs" }));

    // Then navigation proceeds without a modal
    await waitFor(() => {
      expect(screen.getByText("SBOMs list page")).toBeInTheDocument();
    });
    expect(screen.queryByText(MODAL_HEADING)).not.toBeInTheDocument();
  });

  it("does not block navigation after the CSV has been downloaded", async () => {
    // Given the user has already downloaded the report
    renderReport();
    fireEvent.click(screen.getByRole("button", { name: /Download CSV/i }));
    expect(mockedDownloadCsv).toHaveBeenCalledOnce();

    // When the user navigates away
    fireEvent.click(screen.getByRole("link", { name: "SBOMs" }));

    // Then navigation proceeds without a modal
    await waitFor(() => {
      expect(screen.getByText("SBOMs list page")).toBeInTheDocument();
    });
    expect(screen.queryByText(MODAL_HEADING)).not.toBeInTheDocument();
  });
});
