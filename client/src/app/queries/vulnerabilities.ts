import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams, VulnerabilityStatus } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  deleteVulnerability,
  getVulnerability,
  listVulnerabilities,
  VulnerabilityDetails,
} from "@app/client";
import { requestParamsQuery } from "@app/hooks/table-controls";
import { useFetchSbomsAdvisory } from "./sboms";

export const VulnerabilitiesQueryKey = "vulnerabilities";

export const useFetchVulnerabilities = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, params],
    queryFn: () => {
      return listVulnerabilities({
        client,
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

export const useFetchVulnerabilityById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, id],
    queryFn: () => getVulnerability({ client, path: { id } }),
  });
  return {
    vulnerability: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteVulnerabilityMutation = (
  onSuccess?: (payload: VulnerabilityDetails, id: string) => void,
  onError?: (err: AxiosError, id: string) => void
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = deleteVulnerability({ client, path: { id } });
      return (await response).data as VulnerabilityDetails;
    },
    mutationKey: [VulnerabilitiesQueryKey],
    onSuccess,
    onError,
  });
};

export const useFetchVulnerabilitiesFromSbom = (sbomId: string) => {
  const {
    advisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  } = useFetchSbomsAdvisory(sbomId);

  const usersMessages = useQueries({
    queries: (advisories ?? [])
      .flatMap((advisory) => {
        return (advisory.status ?? []).map((status) => {
          const result = {
            vulnerabilityId: status.vulnerability_id,
            status: status.status as VulnerabilityStatus,
          };
          return result;
        });
      })
      .map((item) => {
        return {
          queryKey: ["messages", "id"],
          queryFn: () => {
            return getVulnerability({
              client,
              path: { id: item.vulnerabilityId },
            });
          },
        };
      }),
  });
};
