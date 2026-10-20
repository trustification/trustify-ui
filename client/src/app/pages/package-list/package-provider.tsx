import React from "react";

import { useDebounceValue } from "usehooks-ts";

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
import { useFetchLicenses } from "@app/queries/licenses";
import { useFetchPackages } from "@app/queries/packages";
import { decomposePurl } from "@app/utils/utils";

import { type PackageTableData, PackageSearchContext } from "./package-context";

interface IPackageProvider {
  children: React.ReactNode;
}

export const PackageSearchProvider: React.FunctionComponent<
  IPackageProvider
> = ({ children }) => {
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
    tableName: "packages",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.packages,
    persistTo: "urlParams",
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      version: "Version",
      type: "Type",
      licenses: "Licenses",
      remediation: "Remediations",
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
        categoryKey: "name",
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
    isExpansionEnabled: true,
    expandableVariant: "compound",
  });

  const {
    result: { data: packages, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchPackages({
    ...getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        name: "name",
        namespace: "namespace",
        version: "version",
      },
    }),
    total: true,
  });

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
