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
  AdvisoryHead,
  type Labels,
  deleteAdvisory,
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

const AdvisoriesQueryKey = "advisories";

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
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useFetchAdvisories = (
  params: HubRequestParams = {},
  labels: Label[] = [],
  disableQuery = false,
) => {
  const labelQuery = labelRequestParamsQuery(labels);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [AdvisoriesQueryKey, params, labelQuery],
    queryFn: () => {
      const { q, ...rest } = requestParamsQuery(params);
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

export const advisoryByIdQueryOptions = (id: string) => ({
  queryKey: [AdvisoriesQueryKey, id],
  queryFn: () => getAdvisory({ client, path: { key: id } }),
});

export const useFetchAdvisoryById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    ...advisoryByIdQueryOptions(id),
    enabled: !!id,
  });

  return {
    advisory: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

export const useDeleteAdvisoryMutation = (
  onSuccess: (payload: AdvisoryHead) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AdvisoryHead) => {
      await deleteAdvisory({ client, path: { key: payload.uuid } });
    },
    onSuccess: async (_response, payload) => {
      onSuccess(payload);
      await queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
    onError: async (err: AxiosError) => {
      onError(err);
      await queryClient.invalidateQueries({ queryKey: [AdvisoriesQueryKey] });
    },
  });
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
