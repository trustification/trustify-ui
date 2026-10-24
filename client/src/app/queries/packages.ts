import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";

import { client } from "../axios-config/apiInit";
import { getPurl, listPackages, listPurl } from "../client";
import { requestParamsQuery } from "../hooks/table-controls";

const PackagesQueryKey = "packages";

export const useFetchPackages = (
  params: HubRequestParams = {},
  disableQuery = false,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagesQueryKey, params],
    queryFn: () =>
      listPurl({
        client: client,
        query: { ...requestParamsQuery(params) },
      }),
    enabled: !disableQuery,
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const packageByIdQueryOptions = (id: string) => ({
  queryKey: [PackagesQueryKey, id],
  queryFn: () => getPurl({ client, path: { key: id } }),
});

export const useFetchPackageById = (id: string) => {
  const { data, isLoading, error } = useQuery(packageByIdQueryOptions(id));

  return {
    pkg: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

export const useFetchPackagesBySbomId = (
  sbomId: string,
  params: HubRequestParams = {},
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagesQueryKey, "by-sbom", sbomId, params],
    queryFn: () =>
      listPackages({
        client,
        path: { id: sbomId },
        query: { ...requestParamsQuery(params) },
      }),
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};
