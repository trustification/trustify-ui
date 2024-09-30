import React from "react";

import { AxiosError } from "axios";

import { DecomposedPurl } from "@app/api/models";
import { PurlSummary } from "@app/client";
import { FilterType } from "@app/components/FilterToolbar";
import { TablePersistenceKeyPrefixes } from "@app/Constants";
import {
  getHubRequestParams,
  ITableControls,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchPackages } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

interface PackageTableData extends PurlSummary {
  decomposedPurl?: DecomposedPurl;
}

interface IPackageSearchContext {
  tableControls: ITableControls<
    PackageTableData,
    "name" | "namespace" | "version" | "type" | "qualifiers",
    never,
    "" | "type",
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
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      version: "Version",
      type: "Type",
      qualifiers: "Qualifiers",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: [],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
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
        ],
      },
    ],
    isExpansionEnabled: true,
    expandableVariant: "single",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackages(
    getHubRequestParams({
      ...tableControlState,
    })
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
    selectionState: useSelectionState({
      items: enrichedPackages,
      isEqual: (a, b) => a.uuid === b.uuid,
    }),
  });

  return (
    <PackageSearchContext.Provider
      value={{ totalItemCount, isFetching, fetchError, tableControls }}
    >
      {children}
    </PackageSearchContext.Provider>
  );
};
