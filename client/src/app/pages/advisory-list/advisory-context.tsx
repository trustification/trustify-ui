import React from "react";

import type { AxiosError } from "axios";

import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import { joinKeyValueAsString } from "@app/api/model-utils";
import type { AdvisorySummary } from "@app/client";
import { FilterType } from "@app/components/FilterToolbar";
import {
  type ITableControls,
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import {
  useFetchAdvisories,
  useFetchAdvisoryLabels,
} from "@app/queries/advisories";

interface IAdvisorySearchContext {
  tableControls: ITableControls<
    AdvisorySummary,
    | "identifier"
    | "title"
    | "severity"
    | "type"
    | "labels"
    | "modified"
    | "vulnerabilities",
    "identifier" | "severity" | "modified",
    "" | "average_severity" | "modified" | "labels",
    string
  >;

  totalItemCount: number;
  isFetching: boolean;
  fetchError: AxiosError | null;
}

const contextDefaultValue = {} as IAdvisorySearchContext;

export const AdvisorySearchContext =
  React.createContext<IAdvisorySearchContext>(contextDefaultValue);

interface IAdvisoryProvider {
  children: React.ReactNode;
}

export const AdvisorySearchProvider: React.FunctionComponent<
  IAdvisoryProvider
> = ({ children }) => {
  const [inputValue, setInputValue] = React.useState("");
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 400);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);

  const { labels } = useFetchAdvisoryLabels(debouncedInputValue);

  const tableControlState = useTableControlState({
    tableName: "advisory",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.advisories,
    persistTo: "urlParams",
    columnNames: {
      identifier: "ID",
      title: "Title",
      severity: "Aggregated Severity",
      type: "Type",
      labels: "Labels",
      modified: "Revision",
      vulnerabilities: "Vulnerabilities",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["identifier", "severity", "modified"],
    initialSort: {
      columnKey: "modified",
      direction: "desc",
    },
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: FILTER_TEXT_CATEGORY_KEY,
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
      {
        categoryKey: "average_severity",
        title: "Severity",
        placeholderText: "Severity",
        type: FilterType.multiselect,
        selectOptions: [
          { value: "null", label: "Unknown" },
          { value: "none", label: "None" },
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: "critical", label: "Critical" },
        ],
      },
      {
        categoryKey: "modified",
        title: "Revision",
        type: FilterType.dateRange,
      },
      {
        categoryKey: "labels",
        title: "Label",
        type: FilterType.autocompleteserverside,
        placeholderText: "Labels",
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
  } = useFetchAdvisories(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        identifier: "identifier",
        severity: "average_score",
        modified: "modified",
      },
    }),
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "identifier",
    currentPageItems: advisories,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: advisories,
      isEqual: (a, b) => a.identifier === b.identifier,
    }),
  });

  return (
    <AdvisorySearchContext.Provider
      value={{ totalItemCount, isFetching, fetchError, tableControls }}
    >
      {children}
    </AdvisorySearchContext.Provider>
  );
};
