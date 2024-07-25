import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { AdvisoryIndex, HubRequestParams } from "@app/api/models";
import {
  deleteAdvisoryById,
  getAdvisories,
  getAdvisoryById,
  getAdvisorySourceById,
  updateAdvisoryLabels,
  uploadAdvisory,
} from "@app/api/rest";
import { useUpload } from "@app/hooks/useUpload";
import React from "react";
import {NotificationsContext} from "@app/components/NotificationsContext";

export interface IAdvisoriesQueryParams {
  filterText?: string;
  offset?: number;
  limit?: number;
  sort_by?: string;
}

export const AdvisoriesQueryKey = "advisories";

export const useFetchAdvisories = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [AdvisoriesQueryKey, params],
    queryFn: () => getAdvisories(params),
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

export const useFetchAdvisoryById = (id?: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [AdvisoriesQueryKey, id],
    queryFn: () =>
      id === undefined ? Promise.resolve(undefined) : getAdvisoryById(id),
    enabled: id !== undefined,
  });

  return {
    advisory: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteAdvisoryByIdMutation = () => {
  const queryClient = useQueryClient();
  const {pushNotification} = React.useContext(NotificationsContext);

  return useMutation({
    mutationFn: (id: number | string) => deleteAdvisoryById(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({queryKey: [AdvisoriesQueryKey, id]});
    },
    onError: (err: AxiosError, _payload: number | string) => {
      pushNotification({
        title: "Error while deleting Advisory",
        variant: "danger",
      });
    }
  });
};

export const useFetchAdvisorySourceById = (id?: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [AdvisoriesQueryKey, id, "source"],
    queryFn: () =>
      id === undefined ? Promise.resolve(undefined) : getAdvisorySourceById(id),
    enabled: id !== undefined,
  });

  return {
    source: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useUploadAdvisory = () => {
  const queryClient = useQueryClient();
  return useUpload<AdvisoryIndex, { message: string }>({
    parallel: true,
    uploadFn: (formData, config) => {
      return uploadAdvisory(formData, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdvisoriesQueryKey],
      });
    },
  });
};

export const useUpdateAdvisoryLabelsMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError, payload: AdvisoryIndex) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj) => updateAdvisoryLabels(obj.uuid, obj.labels ?? {}),
    onSuccess: (_res, _payload) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
    onError: onError,
  });
};
