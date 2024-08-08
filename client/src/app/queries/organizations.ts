import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import { getOrganizationById, getOrganizations } from "@app/api/rest";

export const OrganizationsQueryKey = "organizations";

export const useFetchOrganizations = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [OrganizationsQueryKey, params],
    queryFn: () => getOrganizations(params),
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

export const useFetchOrganizationById = (id: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [OrganizationsQueryKey, id],
    queryFn: () => getOrganizationById(id),
    enabled: id !== undefined,
  });

  return {
    organization: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
