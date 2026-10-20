import React from "react";

import { useDebounceValue } from "usehooks-ts";

import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import {
  joinKeyValueAsString,
  splitStringAsKeyValue,
} from "@app/api/model-utils";
import { FilterType } from "@app/components/FilterToolbar";
import { useBulkSelection } from "@app/hooks/selection";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useFetchLicenses } from "@app/queries/licenses";
import { useFetchSBOMLabels, useFetchSBOMs } from "@app/queries/sboms";

import { SbomSearchContext } from "./sbom-context";

interface ISbomProvider {
  sbomGroupId?: string;
  cryptoAlgorithms?: string[];
  isBulkSelectionEnabled?: boolean;
  children: React.ReactNode;
}

export const SbomSearchProvider: React.FunctionComponent<ISbomProvider> = ({
  sbomGroupId,
  cryptoAlgorithms,
  isBulkSelectionEnabled,
  children,
}) => {
  const [inputValueLabel, setInputValueLabel] = React.useState("");
  const [debouncedInputValueLabel] = useDebounceValue(inputValueLabel, 400);
  const { labels } = useFetchSBOMLabels(debouncedInputValueLabel);

  const [inputValueLicense, setInputValueLicense] = React.useState("");
  const [debouncedInputValueLicense] = useDebounceValue(inputValueLicense, 400);
  const {
    result: { data: licenses },
  } = useFetchLicenses({
    filters: [
      {
        field: FILTER_TEXT_CATEGORY_KEY,
        operator: "~",
        value: debouncedInputValueLicense,
      },
    ],
    sort: { field: "license", direction: "asc" },
    page: { pageNumber: 1, itemsPerPage: 10 },
  });

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
        categoryKey: "name",
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
        onInputValueChange: setInputValueLabel,
      },
      {
        categoryKey: "license",
        title: "License",
        type: FilterType.asyncMultiselect,
        placeholderText: "Filter results by license",
        selectOptions: licenses.map((e) => {
          return {
            value: e.license,
            label: e.license.toUpperCase(),
          };
        }),
        onInputValueChange: setInputValueLicense,
      },
    ],
    isExpansionEnabled: false,
    isSelectionEnabled: isBulkSelectionEnabled,
  });

  const {
    result: { data: sboms, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchSBOMs(
    sbomGroupId ?? null,
    {
      ...getHubRequestParams({
        ...tableControlState,
        hubSortFieldKeys: {
          name: "name",
          published: "published",
        },
      }),
      total: true,
    },
    (tableControlState.filterState.filterValues.labels ?? []).map((label) =>
      splitStringAsKeyValue(label),
    ),
    false,
    true,
    cryptoAlgorithms,
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: sboms,
    totalItemCount,
    isLoading: isFetching,
  });

  const bulkSelectionControls = useBulkSelection({
    isEqual: (a, b) => a.id === b.id,
    filteredItems: tableControls.filteredItems,
    currentPageItems: tableControls.currentPageItems,
  });

  return (
    <SbomSearchContext.Provider
      value={{
        sbomGroupId,
        totalItemCount,
        isFetching,
        fetchError,
        tableControls,
        bulkSelection: {
          isEnabled: !!isBulkSelectionEnabled,
          controls: bulkSelectionControls,
        },
      }}
    >
      {children}
    </SbomSearchContext.Provider>
  );
};
