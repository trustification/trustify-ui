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

// Common

export type Severity = "none" | "low" | "medium" | "high" | "critical";

export type Labels = Record<string, string>;

export type VulnerabilityStatus =
  | "fixed"
  | "not_affected"
  | "known_not_affected"
  | "affected";

export interface Context {
  cpe: string;
}

export interface Vendor {
  id: string;
  cpe_key: string;
  name: string;
  website: string;
}

type Purl = {
  version: string;
  base_purl: {
    uuid: string;
    purl: string;
  };
  context: Context;
};

// Organizations

export interface Organization {
  id: string;
  name: string;
}

// Products

export interface Product {
  id: string;
  name: string;
  vendor?: Vendor;
  versions?: ProductVersion[];
}

export interface ProductVersion {
  id: string;
  version: string;
  sbom_id: string;
}

// Advisories

interface Advisory {
  uuid: string;
  identifier: string;
  title: string;
  published?: string;
  modified?: string;
  withdrawn?: string;
  issuer?: Vendor;
  hashes?: string[];
  labels?: Labels;
}

export interface AdvisoryIndex extends Advisory {
  average_score?: number;
  average_severity?: Severity;

  vulnerabilities?: VulnerabilityWithinAdvisory[];
}

export interface AdvisoryWithinVulnerability extends Advisory {
  score?: number;
  severity?: Severity;

  purls?: Record<VulnerabilityStatus, Purl[]>;
  sboms?: {
    id: string;
    status: VulnerabilityStatus[];
  }[];
}

export interface AdvisoryWithinPackage extends Advisory {
  status: AdvisoryWithinPackageStatus[];
}

export interface AdvisoryWithinPackageStatus {
  context: Context;
  status: VulnerabilityStatus;
  vulnerability: Vulnerability;
}

export interface AdvisoryWithinSbom extends Advisory {
  status: {
    context: Context;
    status: VulnerabilityStatus;
    vulnerability_id: string;
    packages: {
      id: string;
      name: string;
      version: string;
    }[];
  }[];
}

// Vulnerability

interface Vulnerability {
  identifier: string;
  normative: boolean;
  title?: string;
  description?: string;
  published?: string;
  modified?: string;
  withdrawn?: string;
  discovered?: string;
  released?: string;
  cwe?: string;
}

export interface VulnerabilityIndex extends Vulnerability {
  average_score?: number;
  average_severity?: Severity;

  advisories: AdvisoryWithinVulnerability[];
}

export interface VulnerabilityWithinAdvisory extends Vulnerability {
  score?: Severity;
  severity: Severity;
}

// Package

export interface Package {
  uuid: string;
  purl: string;

  advisories?: AdvisoryWithinPackage[];
}

export interface PackageWithinSBOM {
  id: string;
  name: string;
  version: string;
  purl?: {
    uuid: string;
    purl: string;
  }[];
}

// SBOM

export interface SBOM {
  id: string;
  name: string;
  authors: string[];
  published: string;
  described_by?: SbomDescription[];

  hashes?: string[];
  labels?: Labels;

  advisories?: AdvisoryWithinSbom[];
}

export type SbomDescription = {
  name: string;
  version: string;
};

// Importer

export type ImporterStatus = "waiting" | "running";

export const ALL_IMPORTER_TYPES = ["sbom", "csaf", "osv", "cve"] as const;
export type ImporterType = (typeof ALL_IMPORTER_TYPES)[number];

export interface Importer {
  name: string;
  configuration: ImporterConfiguration;
  state?: ImporterStatus;
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

export interface Report {
  startDate: string;
  endDate: string;
  numberOfItems: string;
}

export interface ImporterReport {
  id: string;
  error?: string;
  report: Report;
}

export interface ImporterReportDetails {
  startDate: string;
  endDate: string;
  numberOfItems: string;
}

// Purl

export interface DecomposedPurl {
  type: string;
  name: string;
  namespace?: string;
  version?: string;
  qualifiers?: Labels;
  path?: string;
}
