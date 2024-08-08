import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  getVulnerabilities,
  getVulnerabilityById,
  getVulnerabilitySourceById,
} from "@app/api/rest";
import { deleteVulnerability, VulnerabilityDetails } from "@app/client";
import { client } from "@app/axios-config/apiInit";

export const VulnerabilitiesQueryKey = "vulnerabilities";

export const useFetchVulnerabilities = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, params],
    queryFn: () => getVulnerabilities(params),
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

export const useFetchVulnerabilityById = (id: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, id],
    queryFn: () => getVulnerabilityById(id),
    enabled: id !== undefined,
  });

  return {
    vulnerability: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteVulnerabilityMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: VulnerabilityDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: async (id: string) =>
      (await deleteVulnerability({ client, path: { id } })).data,
    mutationKey: [VulnerabilitiesQueryKey],
    onSuccess,
    onError,
  });
};

export const useFetchVulnerabilitySourceById = (id: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, id, "source"],
    queryFn: () => getVulnerabilitySourceById(id),
    enabled: id !== undefined,
  });

  return {
    source: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
