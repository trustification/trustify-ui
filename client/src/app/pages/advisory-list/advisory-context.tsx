import React from "react";

import { AxiosError } from "axios";

import { AdvisorySummary } from "@app/client";
import { FilterType } from "@app/components/FilterToolbar";
import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import {
  getHubRequestParams,
  ITableControls,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchAdvisories } from "@app/queries/advisories";

interface IAdvisorySearchContext {
  tableControls: ITableControls<
    AdvisorySummary,
    "identifier" | "title" | "severity" | "modified" | "vulnerabilities",
    "identifier" | "severity" | "modified",
    "" | "average_severity" | "modified",
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
  const tableControlState = useTableControlState({
    tableName: "advisory",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.advisories,
    persistTo: "urlParams",
    columnNames: {
      identifier: "ID",
      title: "Title",
      severity: "Aggregated Severity",
      modified: "Revision",
      vulnerabilities: "Vulnerabilities",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["identifier", "severity", "modified"],
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
    })
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
