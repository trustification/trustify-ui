import React from "react";

import type { AxiosError } from "axios";

import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import {
  joinKeyValueAsString,
  splitStringAsKeyValue,
} from "@app/api/model-utils";
import type { SbomSummary } from "@app/client";
import { FilterType } from "@app/components/FilterToolbar";
import {
  type ITableControls,
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useFetchSBOMLabels, useFetchSBOMs } from "@app/queries/sboms";

interface ISbomSearchContext {
  tableControls: ITableControls<
    SbomSummary,
    | "name"
    | "version"
    | "packages"
    | "published"
    | "supplier"
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
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 400);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);

  const { labels } = useFetchSBOMLabels(debouncedInputValue);

  const tableControlState = useTableControlState({
    tableName: "sbom",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms,
    persistTo: "urlParams",
    columnNames: {
      name: "Name",
      version: "Version",
      supplier: "Supplier",
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
      {
        categoryKey: "labels",
        title: "Label",
        type: FilterType.autocompleteLabel,
        placeholderText: "Filter results by label",
        selectOptions: labels.map((e) => {
          const keyValue = joinKeyValueAsString({ key: e.key, value: e.value });
          return {
            value: keyValue,
            label: keyValue,
          };
        }),
        onInputValueChange: setInputValue,
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
    (tableControlState.filterState.filterValues.labels ?? []).map((label) =>
      splitStringAsKeyValue(label),
    ),
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: advisories,
    totalItemCount,
    isLoading: isFetching,
  });

  return (
    <SbomSearchContext.Provider
      value={{ totalItemCount, isFetching, fetchError, tableControls }}
    >
      {children}
    </SbomSearchContext.Provider>
  );
};
