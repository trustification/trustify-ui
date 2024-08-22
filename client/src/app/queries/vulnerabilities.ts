import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  deleteVulnerability,
  getVulnerability,
  listVulnerabilities,
  VulnerabilityDetails,
} from "@app/client";
import { client } from "@app/axios-config/apiInit";
import { requestParamsQuery } from "@app/hooks/table-controls";
import { convertQuery, dataOf } from "@app/queries/dataOf";

export const VulnerabilitiesQueryKey = "vulnerabilities";

export const useFetchVulnerabilities = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const query = useQuery({
    queryKey: [VulnerabilitiesQueryKey, params],
    queryFn: () =>
      dataOf(
        listVulnerabilities({
          client,
          query: { ...requestParamsQuery(params) },
        })
      ),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });
  return {
    ...convertQuery(query),
    result: {
      data: query.data?.items || [],
      total: query.data?.total ?? 0,
      params: params,
    },
  };
};

export const useFetchVulnerabilityById = (id: string) => {
  const query = useQuery({
    queryKey: [VulnerabilitiesQueryKey, id],
    queryFn: () => dataOf(getVulnerability({ client, path: { id } })),
  });
  return {
    ...convertQuery(query),
    vulnerability: query.data,
  };
};

export const useDeleteVulnerabilityMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: VulnerabilityDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: (id: string) =>
      dataOf(deleteVulnerability({ client, path: { id } })),
    mutationKey: [VulnerabilitiesQueryKey],
    onSuccess,
    onError,
  });
};
