import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { HubRequestParams, SBOM } from "@app/api/models";
import { useUpload } from "@app/hooks/useUpload";
import {
  deleteSbom,
  downloadSbom,
  getSbom,
  listRelatedSboms,
  listSboms,
  SbomDetails,
  SbomSummary,
  updateSbomLabels,
} from "@app/client";
import { client } from "@app/axios-config/apiInit";
import { dataOf } from "@app/queries/dataOf";
import { uploadSbom } from "@app/api/rest";

export const SBOMsQueryKey = "sboms";

export const useFetchSBOMs = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, params],
    queryFn: () => listSboms({ client }),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });
  return {
    result: {
      data: data?.data.items || [],
      total: data?.data.total ?? 0,
      params: params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchSBOMById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, id],
    queryFn: async () => dataOf(getSbom({ client, path: { id } })),
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
      dataOf(deleteSbom({ client, path: { id } })),
    mutationKey: [SBOMsQueryKey],
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useFetchSBOMSourceById = (key: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, key, "source"],
    queryFn: () => dataOf(downloadSbom({ client, path: { key } })),
    enabled: key !== undefined,
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
  onError: (err: AxiosError, payload: SbomSummary) => void
) => {
  return useMutation({
    mutationFn: (obj) =>
      dataOf(
        updateSbomLabels({ client, path: { id: obj.id }, body: obj.labels })
      ),
    mutationKey: [SBOMsQueryKey],
    onSuccess,
    onError: onError,
  });
};

export const useFetchSbomsByPackageId = (
  packageId: string,
  params: HubRequestParams = {}
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, "by-package", packageId, params],
    queryFn: () =>
      dataOf(
        listRelatedSboms({ client, path: { id: packageId }, body: params })
      ),
  });
  return {
    result: {
      data: data?.items || [],
      total: data?.total ?? 0,
      params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
