export type WithUiId<T> = T & { _ui_unique_id: string };

/** Mark an object as "New" therefore does not have an `id` field. */
export type New<T extends { id: number }> = Omit<T, "id">;

export interface HubFilter {
  field: string;
  operator?: "=" | "!=" | "~" | ">" | ">=" | "<" | "<=";
  value:
    | string
    | number
    | {
        list: (string | number)[];
        operator?: "AND" | "OR";
      };
}

export interface HubRequestParams {
  filters?: HubFilter[];
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
  page?: {
    pageNumber: number; // 1-indexed
    itemsPerPage: number;
  };
}

export interface HubPaginatedResult<T> {
  data: T[];
  total: number;
  params: HubRequestParams;
}

// Base

export interface PackageBase {
  uuid: string;
  purl: string;
}

export interface SBOMBase {
  id: string;
  type: "CycloneDX" | "SPDX";
  name: string;
  version: string;
  authors: string[];
  published: string;
}

export interface AdvisoryBase {
  identifier: string;
  published: string;
  modified: string;
  title: string;
  uuid: string;
  issuer?: {
    name?: string;
    website?: string;
  };
}

// Advisories

export type Severity = "none" | "low" | "medium" | "high" | "critical";

export interface Advisory extends AdvisoryBase {
  average_severity?: Severity;
  vulnerabilities: AdvisoryVulnerability[];
}

export interface AdvisoryVulnerability {
  identifier: string;
  severity: Severity;
  non_normative: {
    title: string;
    discovered?: string;
    released?: string;
  };
  cwe: string;
}

// Vulnerability

export interface Vulnerability {
  identifier: string;
  title: string;
  average_severity?: Severity;
  cwe: string;
  published: string;
  modified: string;

  related_sboms: SBOMBase[];
  advisories: AdvisoryBase[];
}

export interface VulnerabilityAdvisory extends AdvisoryBase {
  severity?: Severity;
}

// Package

export interface Package extends PackageBase {
  // This field is added by the UI
  package?: {
    name: string;
    type: string;
    namespace?: string;
    version?: string;
    path?: string;
    qualifiers?: { [key: string]: string };
  };
}

// SBOM

export interface SBOM extends SBOMBase {
  related_packages: {
    count: number;
  };
  related_cves: { [key in Severity]: number };
}

// Importer

export type ImporterStatus = "waiting" | "running";

export const ALL_IMPORTER_TYPES = ["sbom", "csaf", "osv", "cve"] as const;
export type ImporterType = (typeof ALL_IMPORTER_TYPES)[number];

export interface Importer {
  name: string;
  configuration: ImporterConfiguration;
  state?: ImporterStatus;
  report?: ImporterReportDetails; // This field is added in the rest fetch process
}

export type ImporterConfiguration = {
  [key in ImporterType]?: ImporterConfigurationValues;
};

export interface ImporterConfigurationValues {
  description: string;
  period: string;
  source: string;
  disabled: boolean;
  v3Signatures: boolean;
  onlyPatterns?: string[];
  keys?: string[];
}

export interface ImporterReport {
  id: string;
  report: {
    startDate: string;
    endDate: string;
    numerOfItems: string;
  };
}

export interface ImporterReportDetails {
  startDate: string;
  endDate: string;
  numerOfItems: string;
}
