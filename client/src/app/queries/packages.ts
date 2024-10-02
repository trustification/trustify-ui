import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";

import { client } from "../axios-config/apiInit";
import { getPurl, listPackages, listPurl } from "../client";
import { requestParamsQuery } from "../hooks/table-controls";

export const PackagesQueryKey = "packages";

export const useFetchPackages = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagesQueryKey, params],
    queryFn: () => {
      return listPurl({
        client: client,
        query: { ...requestParamsQuery(params) },
      });
    },
    refetchInterval: !refetchDisabled ? 5000 : false,
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError,
    refetch,
  };
};

export const useFetchPackageById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [PackagesQueryKey, id],
    queryFn: () => getPurl({ client, path: { key: id } }),
  });

  return {
    pkg: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useFetchPackagesBySbomId = (
  sbomId: string,
  params: HubRequestParams = {}
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagesQueryKey, "by-sbom", sbomId, params],
    queryFn: () => {
      return listPackages({
        client,
        path: { id: sbomId },
        query: { ...requestParamsQuery(params) },
      });
    },
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
