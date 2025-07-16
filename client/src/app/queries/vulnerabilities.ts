import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  analyze,
  deleteVulnerability,
  getVulnerability,
  listVulnerabilities,
  type AnalysisResponse,
  type VulnerabilityDetails,
} from "@app/client";
import { requestParamsQuery } from "@app/hooks/table-controls";

export const VulnerabilitiesQueryKey = "vulnerabilities";

export const useFetchVulnerabilities = (
  params: HubRequestParams = {},
  disableQuery = false,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [VulnerabilitiesQueryKey, params],
    queryFn: () => {
      return listVulnerabilities({
        client,
        query: { ...requestParamsQuery(params) },
      });
    },
    enabled: !disableQuery,
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

export const useFetchVulnerabilitiesByPackageIds = (ids: string[]) => {
  const idChunks = ids.reduce<string[][]>((chunks, item, index) => {
    if (index % 100 === 0) {
      chunks.push([item]);
    } else {
      chunks[chunks.length - 1].push(item);
    }
    return chunks;
  }, []);

  const userQueries = useQueries({
    queries: idChunks.map((ids) => {
      return {
        queryKey: [VulnerabilitiesQueryKey, ids],
        queryFn: () => {
          return analyze({
            client,
            body: { purls: ids },
          });
        },
      };
    }),
  });

  const isFetching = userQueries.some(({ isLoading }) => isLoading);
  const fetchError = userQueries.find(({ error }) => !!(error as AxiosError | null));

  const packages: AnalysisResponse = {};

  if (!isFetching) {
    for (const data of userQueries.map(({ data }) => data?.data ?? {})) {
      for (const [id, analysisDetails] of Object.entries(data)) {
        packages[id] = analysisDetails;
      }
    }
  }

  return {
    packages,
    isFetching,
    fetchError,
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
  onError?: (err: AxiosError, id: string) => void,
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
