import React from "react";

import type { AxiosError } from "axios";

import type { ITableControls } from "@app/hooks/table-controls";

/** Context interface for the cryptography algorithm search page. */
export interface ICryptoSearchContext {
  tableControls: ITableControls<
    CryptoAlgorithm,
    | "name"
    | "primitive"
    | "occurrences"
    | "policy"
    | "recommendation"
    | "usage"
    | "packages"
    | "sboms"
    | "type",
    "name",
    "" | "policy_status",
    string
  >;

  totalItemCount: number;
  isFetching: boolean;
  fetchError: AxiosError | null;
}

/** Shape of a single cryptographic algorithm returned by the backend API. */
export interface CryptoAlgorithm {
  node_id: string;
  name: string;
  asset_type: string;
  oid: string | null;
  properties: Record<string, unknown>;
  policy_status: string;
  packages_count: number;
  sboms_count: number;
}

/** Shape of the policy evaluation summary returned by POST /v3/crypto/policy/evaluate. */
export interface CryptoPolicySummary {
  total: number;
  compliant: number;
  warning: number;
  non_compliant: number;
}

const contextDefaultValue = {} as ICryptoSearchContext;

export const CryptoSearchContext =
  React.createContext<ICryptoSearchContext>(contextDefaultValue);
