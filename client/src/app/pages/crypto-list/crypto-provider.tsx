import React from "react";

import {
  FILTER_TEXT_CATEGORY_KEY,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import { FilterType } from "@app/components/FilterToolbar";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useFetchCryptoAlgorithms } from "@app/queries/crypto";

import { CryptoSearchContext } from "./crypto-context";

interface ICryptoProvider {
  children: React.ReactNode;
  assetType: string;
}

/** Maps a backend policy_status value to a display label for the filter dropdown. */
const policyStatusOptions = [
  { value: "compliant", label: "Compliant" },
  { value: "warning", label: "Warning" },
  { value: "non_compliant", label: "Non-compliant" },
];

/** Context provider that manages table state and data fetching for the cryptography algorithm list. */
export const CryptoSearchProvider: React.FunctionComponent<ICryptoProvider> = ({
  children,
  assetType,
}) => {
  const isAlgorithms = assetType === "algorithm";

  const tableControlState = useTableControlState({
    tableName: "crypto",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.cryptography,
    persistTo: "urlParams",
    columnNames: {
      name: isAlgorithms ? "Algorithm name" : "Name",
      primitive: "Primitive",
      occurrences: "Occurrences",
      policy: "Policy",
      recommendation: "Recommendation",
      usage: "Usage",
      packages: "Packages",
      sboms: "SBOMs",
      type: "Type",
    },
    isPaginationEnabled: true,
    isSortEnabled: true,
    sortableColumns: ["name"],
    initialSort: {
      columnKey: "name",
      direction: "asc",
    },
    isFilterEnabled: true,
    filterCategories: isAlgorithms
      ? [
          {
            categoryKey: FILTER_TEXT_CATEGORY_KEY,
            title: "Filter",
            placeholderText: "Search by algorithm name",
            type: FilterType.search,
          },
          {
            categoryKey: "policy_status",
            title: "Policy",
            placeholderText: "Policy status",
            type: FilterType.select,
            selectOptions: policyStatusOptions.map((opt) => ({
              value: opt.value,
              label: opt.label,
            })),
          },
        ]
      : [
          {
            categoryKey: FILTER_TEXT_CATEGORY_KEY,
            title: "Filter",
            placeholderText: "Search",
            type: FilterType.search,
          },
        ],
    isExpansionEnabled: false,
  });

  const {
    result: { data: algorithms, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchCryptoAlgorithms(
    {
      ...getHubRequestParams({
        ...tableControlState,
        hubSortFieldKeys: {
          name: "name",
        },
      }),
      total: true,
    },
    false,
    assetType,
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "node_id",
    currentPageItems: algorithms,
    totalItemCount,
    isLoading: isFetching,
    forceNumRenderedColumns: isAlgorithms ? 8 : 5,
  });

  return (
    <CryptoSearchContext.Provider
      value={{ totalItemCount, isFetching, fetchError, tableControls }}
    >
      {children}
    </CryptoSearchContext.Provider>
  );
};
