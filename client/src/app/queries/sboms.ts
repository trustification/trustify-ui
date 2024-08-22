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
import { convertQuery, dataOf } from "@app/queries/dataOf";
import { uploadSbom } from "@app/api/rest";
import { requestParamsQuery } from "../hooks/table-controls";

export const SBOMsQueryKey = "sboms";

export const useFetchSBOMs = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const query = useQuery({
    queryKey: [SBOMsQueryKey, params],
    queryFn: () =>
      listSboms({
        client,
        query: { ...requestParamsQuery(params) },
      }),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });
  return {
    ...convertQuery(query),
    result: {
      data: query.data?.data.items || [],
      total: query.data?.data.total ?? 0,
      params: params,
    },
  };
};

export const useFetchSBOMById = (id: string) => {
  const query = useQuery({
    queryKey: [SBOMsQueryKey, id],
    queryFn: () => dataOf(getSbom({ client, path: { id } })),
    enabled: id !== undefined,
  });

  return {
    ...convertQuery(query),
    sbom: query.data,
  };
};

export const useDeleteSbomMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: SbomDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: (id: string) => dataOf(deleteSbom({ client, path: { id } })),
    mutationKey: [SBOMsQueryKey],
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useFetchSBOMSourceById = (key: string) => {
  const query = useQuery({
    queryKey: [SBOMsQueryKey, key, "source"],
    queryFn: () => dataOf(downloadSbom({ client, path: { key } })),
    enabled: key !== undefined,
  });

  return {
    ...convertQuery(query),
    source: query.data,
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
  const query = useQuery({
    queryKey: [SBOMsQueryKey, "by-package", packageId, params],
    queryFn: () =>
      dataOf(
        listRelatedSboms({
          client,
          query: { id: packageId, ...requestParamsQuery(params) },
        })
      ),
  });
  return {
    ...convertQuery(query),
    result: {
      data: query.data?.items || [],
      total: query.data?.total ?? 0,
      params,
    },
  };
};
