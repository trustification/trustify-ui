import React from "react";

import type { AxiosError } from "axios";

import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import type { DecomposedPurl } from "@app/api/models";
import type { PurlSummary } from "@app/client";
import { FilterType } from "@app/components/FilterToolbar";
import {
  type ITableControls,
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useFetchPackages } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

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
    | "path"
    | "qualifiers"
    | "vulnerabilities",
    "name" | "namespace" | "version",
    "" | "type" | "arch",
    string
  >;

  totalItemCount: number;
  isFetching: boolean;
  fetchError: AxiosError;
}

const contextDefaultValue = {} as IPackageSearchContext;

export const PackageSearchContext =
  React.createContext<IPackageSearchContext>(contextDefaultValue);

interface IPackageProvider {
  children: React.ReactNode;
}

export const PackageSearchProvider: React.FunctionComponent<
  IPackageProvider
> = ({ children }) => {
  const tableControlState = useTableControlState({
    tableName: "packages",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.packages,
    persistTo: "urlParams",
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      version: "Version",
      type: "Type",
      path: "Path",
      qualifiers: "Qualifiers",
      vulnerabilities: "Vulnerabilities",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name", "namespace", "version"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "type",
        title: "Type",
        placeholderText: "Type",
        type: FilterType.multiselect,
        selectOptions: [
          { value: "maven", label: "Maven" },
          { value: "rpm", label: "RPM" },
          { value: "npm", label: "NPM" },
          { value: "oci", label: "OCI" },
        ],
      },
      {
        categoryKey: "arch",
        title: "Architecture",
        placeholderText: "Architecture",
        type: FilterType.multiselect,
        selectOptions: [
          { value: "x86_64", label: "AMD 64bit" },
          { value: "aarch64", label: "ARM 64bit" },
          { value: "ppc64le", label: "PowerPC" },
          { value: "s390x", label: "S390" },
          { value: "noarch", label: "No Arch" },
        ],
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackages(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
        namespace: "namespace",
        version: "version",
      },
    }),
  );

  const enrichedPackages = React.useMemo(() => {
    return packages.map((item) => {
      const result: PackageTableData = {
        ...item,
        decomposedPurl: decomposePurl(item.purl),
      };
      return result;
    });
  }, [packages]);

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "uuid",
    currentPageItems: enrichedPackages,
    totalItemCount,
    isLoading: isFetching,
  });

  return (
    <PackageSearchContext.Provider
      value={{ totalItemCount, isFetching, fetchError, tableControls }}
    >
      {children}
    </PackageSearchContext.Provider>
  );
};
