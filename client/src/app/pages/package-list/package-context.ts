import React from "react";

import type { AxiosError } from "axios";

import type { DecomposedPurl } from "@app/api/models";
import type { PurlSummary } from "@app/client";
import type { ITableControls } from "@app/hooks/table-controls";

export interface PackageTableData extends PurlSummary {
  decomposedPurl?: DecomposedPurl;
}

interface IPackageSearchContext {
  tableControls: ITableControls<
    PackageTableData,
    | "name"
    | "namespace"
    | "version"
    | "type"
    | "licenses"
    | "path"
    | "qualifiers"
    | "vulnerabilities"
    | "remediation",
    "name" | "namespace" | "version",
    "name" | "type" | "arch" | "license",
    string
  >;

  totalItemCount: number;
  isFetching: boolean;
  fetchError: AxiosError | null;
}

const contextDefaultValue = {} as IPackageSearchContext;

export const PackageSearchContext =
  React.createContext<IPackageSearchContext>(contextDefaultValue);
