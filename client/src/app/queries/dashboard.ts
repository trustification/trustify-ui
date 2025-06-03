import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { WatchedSboms } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import { getUserPreferences, setUserPreferences } from "@app/client";

const WATCHED_SBOMS_KEY = "watched-sboms";

export const DashboardQueryKey = "dashboard";

export const useFetchWatchedSboms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [DashboardQueryKey, WATCHED_SBOMS_KEY],
    queryFn: async () => {
      try {
        const response = await getUserPreferences({
          client,
          path: { key: WATCHED_SBOMS_KEY },
        });
        return response.data as WatchedSboms;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.status === 404) {
          const defaultValue: WatchedSboms = {
            sbom1Id: null,
            sbom2Id: null,
            sbom3Id: null,
            sbom4Id: null,
          };
          return defaultValue;
        }
      }
    },
  });

  return {
    sboms: data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

export const useUpdateWatchedSbomsMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError, payload: WatchedSboms) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj) => {
      return setUserPreferences({
        client,
        path: { key: WATCHED_SBOMS_KEY },
        body: obj,
      });
    },
    onSuccess: async (_res, _payload) => {
      onSuccess();
      await queryClient.invalidateQueries({
        queryKey: [DashboardQueryKey, WATCHED_SBOMS_KEY],
      });
    },
    onError: onError,
  });
};
