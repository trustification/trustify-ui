import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import { listLicenses } from "@app/client";
import { requestParamsQuery } from "@app/hooks/table-controls";

const LicensesQueryKey = "licenses";

export const useFetchLicenses = (
  params: HubRequestParams = {},
  disableQuery = false,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [LicensesQueryKey, params],
    queryFn: () => {
      return listLicenses({
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
