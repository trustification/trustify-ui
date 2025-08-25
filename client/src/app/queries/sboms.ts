import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams, Label } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  type IngestResult,
  type Labels,
  type SbomSummary,
  deleteSbom,
  downloadSbom,
  getSbom,
  getSbomAdvisories,
  listAllLicenseIds,
  listRelatedSboms,
  listSbomLabels,
  listSboms,
  updateSbomLabels,
} from "@app/client";
import { useUpload } from "@app/hooks/useUpload";

import { uploadSbom } from "@app/api/rest";
import {
  labelRequestParamsQuery,
  requestParamsQuery,
} from "../hooks/table-controls";

export const SBOMsQueryKey = "sboms";

export const useFetchSBOMLabels = (filterText: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, "labels", filterText],
    queryFn: () => {
      return listSbomLabels({
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

export const useFetchSBOMs = (
  params: HubRequestParams = {},
  labels: Label[] = [],
  disableQuery = false,
) => {
  const { q, ...rest } = requestParamsQuery(params);
  const labelQuery = labelRequestParamsQuery(labels);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, params, labelQuery],
    queryFn: () =>
      listSboms({
        client,
        query: {
          ...rest,
          q: [q, labelQuery].filter((e) => e).join("&"),
        },
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
        : getSbom({ client, path: { id: id } });
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
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteSbom({ client, path: { id } });
      return response.data as SbomSummary;
    },
    onSuccess: async (response, id) => {
      onSuccess(response, id);
      await queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });
    },
    onError: async (err: AxiosError) => {
      onError(err);
      await queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });
    },
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [SBOMsQueryKey],
      });
    },
  });
};

export const useUpdateSbomLabelsMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError, payload: { id: string; labels: Labels }) => void,
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
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });
    },
    onError: onError,
  });
};

export const useFetchSbomsByPackageId = (
  purl: string,
  params: HubRequestParams = {},
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, "by-package", purl, params],
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

export const useFetchSbomsLicenseIds = (sbomId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, sbomId, "license-ids"],
    queryFn: () => {
      return listAllLicenseIds({
        client,
        path: { id: sbomId },
      });
    },
  });

  return {
    licenseIds: data?.data || [],
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};
