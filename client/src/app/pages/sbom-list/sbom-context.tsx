import React from "react";

import type { AxiosError } from "axios";

import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import type { SbomSummary } from "@app/client";
import { FilterType } from "@app/components/FilterToolbar";
import {
  type ITableControls,
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchSBOMs } from "@app/queries/sboms";

interface ISbomSearchContext {
  tableControls: ITableControls<
    SbomSummary,
    | "name"
    | "version"
    | "packages"
    | "published"
    | "labels"
    | "vulnerabilities",
    "name" | "published",
    "" | "published" | "labels",
    string
  >;

  totalItemCount: number;
  isFetching: boolean;
  fetchError: AxiosError;
}

const contextDefaultValue = {} as ISbomSearchContext;

export const SbomSearchContext =
  React.createContext<ISbomSearchContext>(contextDefaultValue);

interface ISbomProvider {
  children: React.ReactNode;
}

export const SbomSearchProvider: React.FunctionComponent<ISbomProvider> = ({
  children,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const onDebouncedInputValue = React.useCallback((val: string) => {
    setInputValue(val);
  }, []);

  // TODO replace this for fetching labels
  // Labels endpoint does not exist yet
  const {
    result: { data: sbomOptions },
  } = useFetchSBOMs({
    filters: [{ field: "", operator: "~", value: inputValue }],
    page: { pageNumber: 1, itemsPerPage: 10 },
    sort: { field: "ingested", direction: "desc" },
  });

  const tableControlState = useTableControlState({
    tableName: "sbom",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms,
    persistTo: "urlParams",
    columnNames: {
      name: "Name",
      version: "Version",
      labels: "Labels",
      published: "Created on",
      packages: "Dependencies",
      vulnerabilities: "Vulnerabilities",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name", "published"],
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "labels",
        title: "Label",
        type: FilterType.typeahead,
        onDebouncedInputValue,
        selectOptions: sbomOptions.map((e) => ({ label: e.name, value: e.id })),
      },
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "published",
        title: "Created on",
        type: FilterType.dateRange,
      },
    ],
    isExpansionEnabled: false,
  });

  const {
    result: { data: advisories, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchSBOMs(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
        published: "published",
      },
    }),
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: advisories,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: advisories,
      isEqual: (a, b) => a.id === b.id,
    }),
  });

  return (
    <SbomSearchContext.Provider
      value={{ totalItemCount, isFetching, fetchError, tableControls }}
    >
      {children}
    </SbomSearchContext.Provider>
  );
};
