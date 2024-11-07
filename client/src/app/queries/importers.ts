import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { client } from "@app/axios-config/apiInit";
import {
  createImporter,
  deleteImporter,
  getImporter,
  ImporterConfiguration,
  listImporterReports,
  listImporters,
  updateImporter,
} from "@app/client";

export const ImportersQueryKey = "importers";

export const useFetchImporters = (
  refetchDisabled: boolean = false,
  interval = 5000
) => {
  const { isLoading, error, refetch, data } = useQuery({
    queryKey: [ImportersQueryKey],
    queryFn: () => listImporters({ client }),
    refetchInterval: !refetchDisabled ? interval : false,
  });

  return {
    importers: data?.data || [],
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useCreateImporterMutation = (
  onSuccess: (res: void) => void,
  onError: (
    err: AxiosError,
    payload: {
      importerName: string;
      configuration: ImporterConfiguration;
    }
  ) => void
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
    onSuccess: ({ data }, _payload) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
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
  onSuccess: (payload: void) => void,
  onError: (
    err: AxiosError,
    payload: { importerName: string; configuration: ImporterConfiguration }
  ) => void
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
    onSuccess: (_res, payload) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
    },
    onError: onError,
  });
};

export const useDeleteIporterMutation = (
  onSuccess: (id: string) => void,
  onError: (err: AxiosError, id: string) => void
) => {
  const queryClient = useQueryClient();

  const { isPending, mutate, error } = useMutation({
    mutationFn: (id: string) => deleteImporter({ client, path: { name: id } }),
    onSuccess: (_res, id) => {
      onSuccess(id);
      queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
    },
    onError: (err: AxiosError, id) => {
      onError(err, id);
      queryClient.invalidateQueries({ queryKey: [ImportersQueryKey] });
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
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [ImportersQueryKey, id, "reports"],
    queryFn: () => listImporterReports({ client, path: { name: id } }),
    refetchInterval: !refetchDisabled ? 5000 : false,
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
