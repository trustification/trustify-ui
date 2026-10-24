import type { Labels } from "@app/client";
import type { Severity } from "@app/client";

export type WithUiId<T> = T & { _ui_unique_id: string };

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
  total?: boolean;
}

// Common

export type VulnerabilityStatus =
  | "fixed"
  | "not_affected"
  | "known_not_affected"
  | "under_investigation"
  | "affected";

export interface DecomposedPurl {
  type: string;
  name: string;
  namespace?: string;
  version?: string;
  qualifiers?: Labels;
  path?: string;
}

export type ExtendedSeverity = Severity | "unknown";
export const extendedSeverityFromSeverity = (
  value?: Severity | null,
): ExtendedSeverity => value ?? "unknown";

//

export interface Label {
  key: string;
  value?: string;
}
