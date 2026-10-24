import { useMemo } from "react";

import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import type {
  CreateResponse,
  Group,
  GroupRequest,
  ListSbomGroupsData,
} from "@app/client";
import {
  createSbomGroup,
  deleteSbomGroup,
  listSbomGroups,
  readSbomGroup,
  updateSbomGroup,
} from "@app/client";
import { requestParamsQuery } from "@app/hooks/table-controls/getHubRequestParams";
import { SBOMsQueryKey } from "./sboms";

const SBOMGroupsQueryKey = "sbom-groups";

export const SBOMGroupByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [SBOMGroupsQueryKey, id],
    queryFn: () => readSbomGroup({ client, path: { id } }),
    enabled: !!id,
  });
};

export const useFetchSBOMGroupById = (id: string) => {
  const { data, isLoading, error } = useQuery(SBOMGroupByIdQueryOptions(id));
  return {
    sbomGroup: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

export const useSuspenseSBOMGroupById = (id: string) => {
  const { data, isLoading, error, refetch } = useSuspenseQuery({
    ...SBOMGroupByIdQueryOptions(id),
  });
  return {
    sbomGroup: data.data,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useFetchSBOMGroups = (
  parentId: string | null,
  params: HubRequestParams = {},
  extraQueryParams: Pick<
    NonNullable<ListSbomGroupsData["query"]>,
    "parents" | "totals"
  > = {},
  enabled = true,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [SBOMGroupsQueryKey, parentId, { params, extraQueryParams }],
    queryFn: () => {
      const { q, ...rest } = requestParamsQuery(params);
      const parentQuery = parentId ? `parent=${parentId}` : "";
      return listSbomGroups({
        client,
        query: {
          ...rest,
          ...extraQueryParams,
          q: [q, parentQuery].filter((e) => e).join("&"),
        },
      });
    },
    enabled,
  });

  const references = useMemo(() => {
    return [
      ...(data?.data?.items || []),
      ...(data?.data?.referenced || []),
    ].reduce((prev, current) => {
      prev.set(current.id, current);
      return prev;
    }, new Map<string, Group>());
  }, [data?.data]);

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
    },
    references,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};

export const useCreateSBOMGroupMutation = (
  onSuccess: (response: CreateResponse | null, payload: GroupRequest) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: GroupRequest) => {
      const response = await createSbomGroup({ client, body });
      return response.data;
    },
    onSuccess: async (response, payload) => {
      await queryClient.invalidateQueries({ queryKey: [SBOMGroupsQueryKey] });
      onSuccess(response ?? null, payload);
    },
    onError: onError,
  });
};

export const useUpdateSBOMGroupMutation = (
  onSuccess: (payload: { id: string; body: GroupRequest }) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; body: GroupRequest }) => {
      const response = await updateSbomGroup({
        client,
        path: { id: payload.id },
        body: payload.body,
      });
      return response.data;
    },
    onSuccess: async (_response, payload) => {
      await queryClient.invalidateQueries({ queryKey: [SBOMGroupsQueryKey] });
      onSuccess(payload);
    },
    onError: onError,
  });
};

export const useDeleteSbomGroupMutation = (
  onSuccess: (payload: Group) => void,
  onError: (err: AxiosError) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Group) => {
      const { id, name } = payload;
      // NOTE: At the time of this writing this body data
      // is not actually used by the backend.
      // According to the OpenAPI spec it is required,
      // so it's included here for that reason.
      const body: GroupRequest = {
        name,
      };

      await deleteSbomGroup({ client, body, path: { id } });
    },
    onSuccess: async (_res, payload) => {
      onSuccess(payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [SBOMGroupsQueryKey] }),
        // Invalidate SBOMs that belong to this group
        queryClient.invalidateQueries({
          queryKey: [SBOMsQueryKey, payload.id],
        }),
      ]);
    },
    onError: async (err: AxiosError, payload) => {
      onError(err);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [SBOMGroupsQueryKey] }),
        // Invalidate SBOMs that belong to this group
        queryClient.invalidateQueries({
          queryKey: [SBOMsQueryKey, payload.id],
        }),
      ]);
    },
  });
};
