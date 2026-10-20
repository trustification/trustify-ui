import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams, Label } from "@app/api/models";
import { uploadSbom } from "@app/api/rest";
import { client } from "@app/axios-config/apiInit";
import {
  type Group,
  type IngestResult,
  type Labels,
  type SbomHead,
  patchSbomGroupAssignments,
  deleteSbom,
  downloadSbom,
  getSbom,
  getSbomAdvisories,
  listAllLicenseIds,
  listModels,
  listRelatedSboms,
  listSbomLabels,
  listSboms,
  updateSbomLabels,
} from "@app/client";
import { useUpload } from "@app/hooks/useUpload";

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
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useFetchSBOMs = (
  groupId: string | null,
  params: HubRequestParams = {},
  labels: Label[] = [],
  disableQuery = false,
  advisories = false,
  cryptoAlgorithms?: string[],
) => {
  const labelQuery = labelRequestParamsQuery(labels);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      SBOMsQueryKey,
      groupId,
      params,
      labelQuery,
      advisories,
      cryptoAlgorithms,
    ],
    queryFn: () => {
      const { q, ...rest } = requestParamsQuery(params);
      return listSboms({
        client,
        query: {
          ...rest,
          group: groupId ? [groupId] : [],
          q: [q, labelQuery].filter((e) => e).join("&"),
          advisories,
          ...(cryptoAlgorithms?.length ? { crypto: cryptoAlgorithms } : {}),
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
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const sbomByIdQueryOptions = (id: string | undefined) => ({
  queryKey: [SBOMsQueryKey, id] as const,
  queryFn: () => getSbom({ client, path: { id: id! } }),
  enabled: !!id,
});

export const useFetchSBOMById = (
  id?: string,
  refetchInterval?: number | false,
  retry?: boolean | number,
) => {
  const { data, isLoading, error } = useQuery({
    ...sbomByIdQueryOptions(id),
    enabled: !!id,
    refetchInterval,
    retry,
  });

  return {
    sbom: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

export const useDeleteSbomMutation = (
  onSuccess: (sbom: SbomHead) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sbom: SbomHead) => {
      await deleteSbom({ client, path: { id: sbom.id } });
    },
    onSuccess: async (_, sbom) => {
      onSuccess(sbom);
      await queryClient.invalidateQueries({ queryKey: [SBOMsQueryKey] });

      queryClient.removeQueries({ queryKey: [SBOMsQueryKey, sbom.id] });
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
    fetchError: error as AxiosError | null,
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
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useFetchSbomsAdvisory = (
  sbomId: string,
  includeResolved = false,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [SBOMsQueryKey, sbomId, "advisory", { includeResolved }],
    queryFn: () => {
      return getSbomAdvisories({
        client,
        path: { id: sbomId },
        query: { include_resolved: includeResolved || undefined },
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
        queryKey: [
          SBOMsQueryKey,
          sbomId,
          "advisory",
          { includeResolved: false },
        ],
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

export const useFetchModelsBySbomId = (
  sbomId: string,
  params: HubRequestParams = {},
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMsQueryKey, sbomId, "models", params],
    queryFn: () => {
      return listModels({
        client,
        path: { id: sbomId },
        query: { ...requestParamsQuery(params) },
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
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useAddSBOMsToGroupsMutation = (
  onSuccess: (payload: { group: Group; sboms: SbomHead[] }) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { group: Group; sboms: SbomHead[] }) => {
      const { sboms, group } = payload;
      const response = await patchSbomGroupAssignments({
        client,
        body: {
          sbom_ids: sboms.map((e) => e.id),
          add: [group.id],
        },
      });
      return response.data;
    },
    onSuccess: async (_response, payload) => {
      await queryClient.invalidateQueries({
        queryKey: [SBOMsQueryKey, payload.group.id],
      });
      onSuccess(payload);
    },
    onError: onError,
  });
};

export const useRemoveSBOMFromGroupMutation = (
  onSuccess: (payload: { groupId: string; sbom: SbomHead }) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { groupId: string; sbom: SbomHead }) => {
      const { sbom, groupId } = payload;
      const response = await patchSbomGroupAssignments({
        client,
        body: {
          sbom_ids: [sbom.id],
          remove: [groupId],
        },
      });
      return response.data;
    },
    onSuccess: async (_response, payload) => {
      await queryClient.invalidateQueries({
        queryKey: [SBOMsQueryKey, payload.groupId],
      });
      onSuccess(payload);
    },
    onError: onError,
  });
};
