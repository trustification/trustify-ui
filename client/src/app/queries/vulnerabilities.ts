import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  getVulnerabilities,
  getVulnerabilityById,
  getVulnerabilitySourceById,
} from "@app/api/rest";

export const VulnerabilitiesQueryKey = "vulnerabilities";

export const useFetchVulnerabilities = (params: HubRequestParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, params],
    queryFn: () => getVulnerabilities(params),
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

export const useFetchVulnerabilityById = (id?: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, id],
    queryFn: () =>
      id === undefined ? Promise.resolve(undefined) : getVulnerabilityById(id),
    enabled: id !== undefined,
  });

  return {
    vulnerability: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useFetchVulnerabilitySourceById = (id?: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, id, "source"],
    queryFn: () =>
      id === undefined
        ? Promise.resolve(undefined)
        : getVulnerabilitySourceById(id),
    enabled: id !== undefined,
  });

  return {
    source: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
