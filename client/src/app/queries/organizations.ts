import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";

import { client } from "../axios-config/apiInit";
import { getOrganization, listOrganizations } from "../client";
import { requestParamsQuery } from "../hooks/table-controls";

export const OrganizationsQueryKey = "organizations";

export const useFetchOrganizations = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [OrganizationsQueryKey, params],
    queryFn: () => {
      return listOrganizations({
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
    fetchError: error,
    refetch,
  };
};

export const useFetchOrganizationById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [OrganizationsQueryKey, id],
    queryFn: () => getOrganization({ client, path: { id } }),
  });
  return {
    organization: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
