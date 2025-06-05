import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { DEFAULT_REFETCH_INTERVAL } from "@app/Constants";
import { client } from "@app/axios-config/apiInit";
import {
  type ImporterConfiguration,
  createImporter,
  deleteImporter,
  getImporter,
  listImporterReports,
  listImporters,
  updateImporter,
} from "@app/client";

export const ImportersQueryKey = "importers";

export const useFetchImporters = (refetchDisabled = false) => {
  const { isLoading, error, refetch, data } = useQuery({
    queryKey: [ImportersQueryKey],
    queryFn: () => listImporters({ client }),
    refetchInterval: !refetchDisabled ? DEFAULT_REFETCH_INTERVAL : false,
  });

  return {
    importers: data?.data || [],
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useCreateImporterMutation = (
  onSuccess: () => void,
  onError: (
    err: AxiosError,
    payload: {
      importerName: string;
      configuration: ImporterConfiguration;
    },
  ) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      importerName: string;
      configuration: ImporterConfiguration;
    }) => {
      return createImporter({
        client,
        path: { name: payload.importerName },
        body: payload.configuration,
      });
    },
    onSuccess: async (_, _payload) => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
    },
    onError,
  });
};

export const useFetchImporterById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [ImportersQueryKey, id],
    queryFn: () => getImporter({ client, path: { name: id } }),
    enabled: id !== undefined,
  });

  return {
    credentials: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useUpdateImporterMutation = (
  onSuccess: () => void,
  onError: (
    err: AxiosError,
    payload: { importerName: string; configuration: ImporterConfiguration },
  ) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      importerName: string;
      configuration: ImporterConfiguration;
    }) => {
      return updateImporter({
        client,
        path: { name: payload.importerName },
        body: payload.configuration,
      });
    },
    onSuccess: async (_res, _payload) => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
    },
    onError: onError,
  });
};

export const useDeleteIporterMutation = (
  onSuccess: (id: string) => void,
  onError: (err: AxiosError, id: string) => void,
) => {
  const queryClient = useQueryClient();

  const { isPending, mutate, error } = useMutation({
    mutationFn: (id: string) => deleteImporter({ client, path: { name: id } }),
    onSuccess: async (_res, id) => {
      onSuccess(id);
      await queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
    },
    onError: async (err: AxiosError, id) => {
      onError(err, id);
      await queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
    },
  });

  return {
    mutate,
    isPending,
    error,
  };
};

export const useFetchImporterReports = (
  id: string,
  refetchDisabled = false,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [ImportersQueryKey, id, "reports"],
    queryFn: () => listImporterReports({ client, path: { name: id } }),
    refetchInterval: !refetchDisabled ? DEFAULT_REFETCH_INTERVAL : false,
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
