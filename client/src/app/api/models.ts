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

// Advisories

export type Severity = "none" | "low" | "medium" | "high" | "critical";

export interface Advisory {
  identifier: string;
  published: string;
  modified: string;
  title: string;
  uuid: string;
  issuer?: {
    name?: string;
    website?: string;
  };

  hashes?: string[];
  labels?: { [key in string]: string };

  average_severity?: Severity;
  vulnerabilities?: VulnerabilityWithinAdvisory[];
}

export type StatusType =
  | "fixed"
  | "not_affected"
  | "known_not_affected"
  | "affected";

export interface AdvisoryWithinVulnerability {
  identifier: string;
  published: string;
  modified: string;
  title: string;
  uuid: string;
  issuer?: {
    name?: string;
    website?: string;
  };

  severity?: Severity;
  statuses?: {
    [key in StatusType]?: {
      version: string;
      package: {
        purl: string;
      };
    }[];
  };
}

export interface AdvisoryWithinPackage {
  identifier: string;
  published: string;
  modified: string;
  title: string;
  uuid: string;
  issuer?: {
    name?: string;
    website?: string;
  };

  status: {
    status: StatusType;
    vulnerability: {
      identifier: string;
    };
  }[];
}

// Vulnerability

export interface Vulnerability {
  identifier: string;
  title?: string;
  average_severity?: Severity;
  cwe: string;
  published: string;
  modified: string;

  advisories: AdvisoryWithinVulnerability[];
}

export interface VulnerabilityWithinAdvisory {
  identifier: string;
  severity: Severity;
  non_normative: {
    title: string;
    discovered?: string;
    released?: string;
    cwe?: string;
  };
  cwe: string;
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
  purl: string[];
}

// SBOM

export interface SBOM {
  id: string;
  name: string;
  authors: string[];
  published: string;
  described_by?: {
    name: string;
    version: string;
  }[];
}

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

export interface ImporterReport {
  id: string;
  error?: string;
  report: {
    startDate: string;
    endDate: string;
    numberOfItems: string;
  };
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
  qualifiers?: { [key in string]: string };
  path?: string;
}
