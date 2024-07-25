import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  deleteVulnerabilityById,
  getVulnerabilities,
  getVulnerabilityById,
  getVulnerabilitySourceById,
} from "@app/api/rest";
import React from "react";
import {NotificationsContext} from "@app/components/NotificationsContext";

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

export const useDeleteVulnerabilityByIdMutation = () => {
  const queryClient = useQueryClient();
  const {pushNotification} = React.useContext(NotificationsContext);

  return useMutation({
    mutationFn: (id: number | string) => deleteVulnerabilityById(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({queryKey: [VulnerabilitiesQueryKey, id]});
    },
    onError: (err: AxiosError, _payload: number | string) => {
      pushNotification({
        title: "Error while deleting Vulnerability",
        variant: "danger",
      });
    }
  });
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
