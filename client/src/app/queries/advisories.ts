import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  AdvisoryDetails,
  AdvisorySummary,
  deleteAdvisory,
  downloadAdvisory,
  getAdvisory,
  listAdvisories,
  updateAdvisoryLabels,
} from "@app/client";

import { uploadAdvisory } from "@app/api/rest";
import { requestParamsQuery } from "@app/hooks/table-controls";
import { useUpload } from "@app/hooks/useUpload";

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
    queryFn: () => {
      return listAdvisories({
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
      params: params ?? params,
    },
    isFetching: isLoading,
    fetchError: error ? (error as AxiosError) : null,
    refetch,
  };
};

export const useFetchAdvisoryById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [AdvisoriesQueryKey, id],
    queryFn: () => getAdvisory({ client, path: { key: id } }),
    enabled: id !== undefined,
  });

  return {
    advisory: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteAdvisoryMutation = (
  onSuccess?: (payload: AdvisoryDetails, id: string) => void,
  onError?: (err: AxiosError, id: string) => void
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteAdvisory({ client, path: { key: id } });
      return response.data as AdvisoryDetails;
    },
    mutationKey: [AdvisoriesQueryKey],
    onSuccess,
    onError,
  });
};

export const useFetchAdvisorySourceById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [AdvisoriesQueryKey, id, "source"],
    queryFn: () => downloadAdvisory({ client, path: { key: id } }),
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
  return useUpload<AdvisoryDetails, { message: string }>({
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
  onError: (err: AxiosError, payload: AdvisorySummary) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj) => {
      return updateAdvisoryLabels({
        client,
        path: { id: obj.uuid },
        body: obj.labels ?? {},
      });
    },
    onSuccess: (_res, _payload) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
    onError: onError,
  });
};
