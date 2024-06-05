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

export interface VulnerabilityBase {
  identifier: string;
  title: string;
  severity: Severity;
  cwe: string;
  published: string;
  modified: string;
}

export interface PackageBase {
  id: string;
  namespace: string;
  name: string;
  version: string;
  type: string;
  path?: string;
  qualifiers: { [key: string]: string };
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
  average_severity: Severity;
  published: string;
  modified: string;
  title: string;
  sha256: string;
  issuer: {
    name?: string;
    website?: string;
  };
}

// Advisories

export type Severity = "none" | "low" | "medium" | "high" | "critical";

export interface Advisory extends AdvisoryBase {
  vulnerabilities: VulnerabilityBase[];
}

// Vulnerability

export interface Vulnerability extends VulnerabilityBase {
  related_sboms: SBOMBase[];
  advisories: AdvisoryBase[];
}

// Package

export interface Package extends PackageBase {
  related_cves: { severity: Severity; identifier: string }[];
  related_sboms: SBOMBase[];
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

export interface Importer {
  name: string;
  configuration: ImporterConfiguration;
  state?: ImporterStatus;
  report?: ImporterReportDetails; // This field is added in the rest fetch process
}

export interface ImporterConfiguration {
  sbom?: ImporterConfigurationValues;
  csaf?: ImporterConfigurationValues;
}

export interface ImporterConfigurationValues {
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
