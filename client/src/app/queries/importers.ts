import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { DEFAULT_REFETCH_INTERVAL } from "@app/Constants";
import { client } from "@app/axios-config/apiInit";
import {
  type ImporterConfiguration,
  listImporterReports,
  listImporters,
  updateImporter,
} from "@app/client";

const ImportersQueryKey = "importers";

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
    fetchError: error as AxiosError | null,
    refetch,
  };
};
