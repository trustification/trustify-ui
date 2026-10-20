import { describe, expect, it, vi } from "vitest";

import type { RecommendReportPackage } from "@app/client";
import { downloadCsv } from "./csv-export";

const { mockedSaveAs } = vi.hoisted(() => ({ mockedSaveAs: vi.fn() }));

vi.mock("file-saver", () => ({
  saveAs: mockedSaveAs,
}));

const makePackage = (
  overrides: Partial<RecommendReportPackage> = {},
): RecommendReportPackage => ({
  purl: "pkg:maven/org.example/log4j-core@2.14.0",
  recommended_purl: "pkg:maven/com.vendor/log4j-core@2.17.1",
  vulnerabilities: ["CVE-2021-44228"],
  found_in: ["sbom-id-1"],
  advisory_id: null,
  ...overrides,
});

describe("downloadCsv", () => {
  it("generates RFC 4180 CSV with correct headers and columns", async () => {
    mockedSaveAs.mockClear();

    const sbomNameById = new Map([["sbom-id-1", "my-sbom.json"]]);
    const packages = [makePackage()];

    downloadCsv(packages, sbomNameById);

    expect(mockedSaveAs).toHaveBeenCalledOnce();
    const [blob] = mockedSaveAs.mock.calls[0] as [Blob, string];
    const text = await blob.text();

    const lines = text.split("\n");
    expect(lines[0]).toBe(
      "Package,Current Version,Recommended Version,Found in SBOMs,Vulnerabilities Addressed",
    );
    expect(lines[1]).toBe(
      "log4j-core,2.14.0,2.17.1,my-sbom.json,CVE-2021-44228",
    );
  });

  it("joins multi-value fields with semicolons", async () => {
    mockedSaveAs.mockClear();

    const sbomNameById = new Map([
      ["id-1", "sbom-a"],
      ["id-2", "sbom-b"],
    ]);
    const packages = [
      makePackage({
        found_in: ["id-1", "id-2"],
        vulnerabilities: ["CVE-2021-44228", "CVE-2022-0001"],
      }),
    ];

    downloadCsv(packages, sbomNameById);

    const [blob] = mockedSaveAs.mock.calls[0] as [Blob, string];
    const text = await blob.text();
    const dataLine = text.split("\n")[1] ?? "";

    expect(dataLine).toContain("sbom-a; sbom-b");
    expect(dataLine).toContain("CVE-2021-44228; CVE-2022-0001");
  });

  it("wraps fields containing double quotes per RFC 4180", async () => {
    mockedSaveAs.mockClear();

    // Package name contains a double-quote — e.g. a display name with inch symbol
    const sbomNameById = new Map([["sbom-id-1", 'sbom "primary"']]);
    const packages = [makePackage()];

    downloadCsv(packages, sbomNameById);

    const [blob] = mockedSaveAs.mock.calls[0] as [Blob, string];
    const text = await blob.text();
    // RFC 4180: field containing " must be enclosed in " and each " doubled
    expect(text).toContain('"sbom ""primary"""');
  });

  it("resolves unknown SBOM IDs to the raw ID when not in the name map", async () => {
    mockedSaveAs.mockClear();

    const sbomNameById = new Map<string, string>();
    const packages = [makePackage({ found_in: ["unknown-id"] })];

    downloadCsv(packages, sbomNameById);

    const [blob] = mockedSaveAs.mock.calls[0] as [Blob, string];
    const text = await blob.text();
    expect(text).toContain("unknown-id");
  });
});
