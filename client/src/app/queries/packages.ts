import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  getPackageById,
  getPackages,
  getPackagesBySbomId,
} from "@app/api/rest";

export const PackagesQueryKey = "packages";

export const useFetchPackages = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagesQueryKey, params],
    queryFn: () => getPackages(params),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });

  return {
    result: {
      data: data?.data || [],
      total: data?.total ?? 0,
      params: data?.params ?? params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchPackageById = (id: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [PackagesQueryKey, id],
    queryFn: () => getPackageById(id),
  });

  return {
    pkg: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useFetchPackagesBySbomId = (
  sbomId: string | number,
  params: HubRequestParams = {}
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagesQueryKey, "by-sbom", sbomId, params],
    queryFn: () => getPackagesBySbomId(sbomId, params),
  });

  return {
    result: {
      data: data?.data || [],
      total: data?.total ?? 0,
      params: data?.params ?? params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError,
    refetch,
  };
};
