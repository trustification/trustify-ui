import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  deleteSbom,
  downloadSbom,
  getSbom,
  getSbomAdvisories,
  IngestResult,
  listRelatedSboms,
  listSboms,
  SbomSummary,
  updateSbomLabels,
} from "@app/client";
import { useUpload } from "@app/hooks/useUpload";

import { uploadSbom } from "@app/api/rest";
import { requestParamsQuery } from "../hooks/table-controls";

export const SBOMsQueryKey = "sboms";

export const useFetchSBOMs = (
  params: HubRequestParams = {},
  disableQuery: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, params],
    queryFn: () =>
      listSboms({
        client,
        query: { ...requestParamsQuery(params) },
      }),
    enabled: !disableQuery,
  });
  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params ?? params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError,
    refetch,
  };
};

export const useFetchSBOMById = (id?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, id],
    queryFn: () => {
      return id === undefined
        ? Promise.resolve(undefined)
        : getSbom({ client, path: { id: id! } });
    },
    enabled: id !== undefined,
  });

  return {
    sbom: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteSbomMutation = (
  onSuccess: (payload: SbomSummary, id: string) => void,
  onError?: (err: AxiosError, id: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteSbom({ client, path: { id } });
      return response.data as SbomSummary;
    },
    onSuccess: (response, id) => {
      onSuccess(response, id);
      queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });
    },
    onError: onError,
  });
};

export const useFetchSBOMSourceById = (key: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, key, "source"],
    queryFn: () => downloadSbom({ client, path: { key } }),
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
  return useUpload<IngestResult, { message: string }>({
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj) => {
      return updateSbomLabels({
        client,
        path: { id: obj.id },
        body: obj.labels,
      });
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });
    },
    onError: onError,
  });
};

export const useFetchSbomsByPackageId = (
  purl: string,
  params: HubRequestParams = {}
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["SBOMsQueryKeysss", "by-package", purl, params],
    queryFn: () => {
      return listRelatedSboms({
        client,
        query: { purl, ...requestParamsQuery(params) },
      });
    },
  });
  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params ?? params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchSbomsAdvisory = (sbomId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, sbomId, "advisory"],
    queryFn: () => {
      return getSbomAdvisories({
        client,
        path: { id: sbomId },
      });
    },
  });

  return {
    advisories: data?.data || [],
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

export const useFetchSbomsAdvisoryBatch = (sbomIds: string[]) => {
  const userQueries = useQueries({
    queries: sbomIds.map((sbomId) => {
      return {
        queryKey: [SBOMsQueryKey, sbomId, "advisory"],
        queryFn: () => {
          return getSbomAdvisories({
            client,
            path: { id: sbomId },
          });
        },
      };
    }),
  });

  return {
    advisories: userQueries.map(({ data }) => data?.data || []),
    isFetching: userQueries.some(({ isLoading }) => isLoading),
    fetchError: userQueries.map(({ error }) => error as AxiosError | null),
  };
};
