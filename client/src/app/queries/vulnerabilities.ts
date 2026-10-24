import { useQueries, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  AnalysisResponseV3,
  analyzeV3,
  getVulnerability,
  type GetVulnerabilityData,
  listVulnerabilities,
} from "@app/client";
import { requestParamsQuery } from "@app/hooks/table-controls";

const VulnerabilitiesQueryKey = "vulnerabilities";

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
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useFetchVulnerabilitiesByPackageIds = (
  ids: string[],
  includeResolved = false,
) => {
  const chunkedIds = ids.reduce<string[][]>((chunks, item, index) => {
    if (index % 100 === 0) {
      chunks.push([item]);
    } else {
      chunks[chunks.length - 1]!.push(item);
    }
    return chunks;
  }, []);

  const userQueries = useQueries({
    queries: chunkedIds.map((chunkIds) => ({
      queryKey: [VulnerabilitiesQueryKey, chunkIds, { includeResolved }],
      queryFn: async () => {
        const response = await analyzeV3({
          client,
          body: {
            purls: chunkIds,
            include_resolved: includeResolved || undefined,
          },
        });
        return response.data ?? null;
      },
      retry: false,
    })),
  });

  const isFetching = userQueries.some(({ isFetching }) => isFetching);
  const fetchError = userQueries.find(({ error }) => !!error);

  const analysisResponse: AnalysisResponseV3 = {};

  if (!isFetching) {
    for (const data of userQueries.map((item) => item?.data ?? {})) {
      for (const [id, analysisDetails] of Object.entries(data)) {
        analysisResponse[id] = analysisDetails;
      }
    }
  }

  return {
    analysisResponse,
    isFetching,
    fetchError: (fetchError?.error ?? undefined) as AxiosError | undefined,
  };
};

const DEFAULT_QUERY: GetVulnerabilityData["query"] = {};

export const vulnerabilityByIdQueryOptions = (
  id: string,
  query: GetVulnerabilityData["query"] = DEFAULT_QUERY,
) => ({
  queryKey: [VulnerabilitiesQueryKey, id, query],
  queryFn: () => getVulnerability({ client, path: { id }, query }),
});

export const useFetchVulnerabilityById = (
  id: string,
  query: GetVulnerabilityData["query"] = DEFAULT_QUERY,
) => {
  const { data, isLoading, error } = useQuery(
    vulnerabilityByIdQueryOptions(id, query),
  );
  return {
    vulnerability: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};
