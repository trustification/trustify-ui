import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams, SBOM } from "@app/api/models";
import {
  getSBOMs,
  getSBOMsByPackageId,
  getSBOMSourceById,
  updateSbomLabels,
  uploadSbom,
} from "@app/api/rest";
import { useUpload } from "@app/hooks/useUpload";
import { deleteSbom, getSbom, SbomDetails } from "@app/client";
import { client } from "@app/axios-config/apiInit";

export const SBOMsQueryKey = "sboms";

export const useFetchSBOMs = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, params],
    queryFn: () => getSBOMs(params),
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

export const useFetchSBOMById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, id],
    queryFn: async () => (await getSbom({ client, path: { id } })).data,
    enabled: id !== undefined,
  });

  return {
    sbom: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteSbomMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: SbomDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: async (id: string) =>
      (await deleteSbom({ client, path: { id } })).data,
    mutationKey: [SBOMsQueryKey],
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useFetchSBOMSourceById = (id: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, id, "source"],
    queryFn: () => getSBOMSourceById(id),
    enabled: id !== undefined,
  });

  return {
    source: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useUploadSBOM = () => {
  const queryClient = useQueryClient();
  return useUpload<SBOM, { message: string }>({
    parallel: true,
    uploadFn: (formData, config) => {
      return uploadSbom(formData, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SBOMsQueryKey],
      });
    },
  });
};

export const useUpdateSbomLabelsMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError, payload: SBOM) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj) => updateSbomLabels(obj.id, obj.labels ?? {}),
    onSuccess: (_res, _payload) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });
    },
    onError: onError,
  });
};

export const useFetchSbomsByPackageId = (
  packageId: string,
  params: HubRequestParams = {}
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, "by-package", packageId, params],
    queryFn: () => getSBOMsByPackageId(packageId, params),
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
