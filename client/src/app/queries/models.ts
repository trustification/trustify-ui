import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import { listAllModels } from "@app/client";
import { requestParamsQuery } from "@app/hooks/table-controls";

const ModelsQueryKey = "models";

export const useFetchAllModels = (
  params: HubRequestParams = {},
  disableQuery = false,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [ModelsQueryKey, params],
    queryFn: () => {
      return listAllModels({
        client,
        query: { ...requestParamsQuery(params), counts: true },
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
