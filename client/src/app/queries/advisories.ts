import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams, Label } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  type AdvisoryDetails,
  type Labels,
  deleteAdvisory,
  downloadAdvisory,
  getAdvisory,
  listAdvisories,
  listAdvisoryLabels,
  updateAdvisoryLabels,
} from "@app/client";

import { uploadAdvisory } from "@app/api/rest";
import {
  labelRequestParamsQuery,
  requestParamsQuery,
} from "@app/hooks/table-controls";
import { useUpload } from "@app/hooks/useUpload";

export interface IAdvisoriesQueryParams {
  filterText?: string;
  offset?: number;
  limit?: number;
  sort_by?: string;
}

export const AdvisoriesQueryKey = "advisories";

export const useFetchAdvisoryLabels = (filterText: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [AdvisoriesQueryKey, "labels", filterText],
    queryFn: () => {
      return listAdvisoryLabels({
        client,
        query: { limit: 10, filter_text: filterText },
      });
    },
    placeholderData: keepPreviousData,
  });

  return {
    labels: (data?.data as { key: string; value: string }[] | undefined) || [],
    isFetching: isLoading,
    fetchError: error as AxiosError,
    refetch,
  };
};

export const useFetchAdvisories = (
  params: HubRequestParams = {},
  labels: Label[] = [],
  disableQuery = false,
) => {
  const { q, ...rest } = requestParamsQuery(params);
  const labelQuery = labelRequestParamsQuery(labels);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [AdvisoriesQueryKey, params, labelQuery],
    queryFn: () => {
      return listAdvisories({
        client,
        query: {
          ...rest,
          q: [q, labelQuery].filter((e) => e).join("&"),
        },
      });
    },
    enabled: !disableQuery,
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
  onSuccess: (payload: AdvisoryDetails, id: string) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteAdvisory({ client, path: { key: id } });
      return response.data as AdvisoryDetails;
    },
    onSuccess: async (response, id) => {
      onSuccess(response, id);
      await queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
    onError: async (err: AxiosError) => {
      onError(err);
      await queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AdvisoriesQueryKey],
      });
    },
  });
};

export const useUpdateAdvisoryLabelsMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError, payload: { id: string; labels: Labels }) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj) => {
      return updateAdvisoryLabels({
        client,
        path: { id: obj.id },
        body: obj.labels,
      });
    },
    onSuccess: async (_res, _payload) => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
    onError: onError,
  });
};
