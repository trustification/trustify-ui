import { saveAs } from "file-saver";

import type { RecommendReportPackage } from "@app/client";
import { extractName, extractVersion } from "./purl-utils";

const escapeField = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/** Download the remediation report packages as an RFC 4180 CSV file. */
export const downloadCsv = (
  packages: RecommendReportPackage[],
  sbomNameById: Map<string, string>,
): void => {
  const headers = [
    "Package",
    "Current Version",
    "Recommended Version",
    "Found in SBOMs",
    "Vulnerabilities Addressed",
  ];

  const rows = packages.map((pkg) => {
    const name = extractName(pkg.purl);
    const version = extractVersion(pkg.purl);
    const recommendedVersion = extractVersion(pkg.recommended_purl);
    const foundIn = (pkg.found_in ?? [])
      .map((id) => sbomNameById.get(id) ?? id)
      .join("; ");
    const vulns = (pkg.vulnerabilities ?? []).join("; ");

    return [
      escapeField(name),
      escapeField(version),
      escapeField(recommendedVersion),
      escapeField(foundIn),
      escapeField(vulns),
    ];
  });

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "remediation-report.csv");
};
