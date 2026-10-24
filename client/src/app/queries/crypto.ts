import axios from "axios";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
import { useUpload } from "@app/hooks/useUpload";
import { requestParamsQuery } from "@app/hooks/table-controls";

import type {
  CryptoAlgorithm,
  CryptoPolicySummary,
} from "@app/pages/crypto-list/crypto-context";

const CryptoAlgorithmsQueryKey = "crypto-algorithms";
const CryptoPolicySummaryQueryKey = "crypto-policy-summary";

/** Fetches a paginated list of cryptographic algorithms, optionally filtered by asset type. */
export const useFetchCryptoAlgorithms = (
  params: HubRequestParams = {},
  disableQuery = false,
  assetType?: string,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [CryptoAlgorithmsQueryKey, params, assetType],
    queryFn: () => {
      return axios.get<{ items: CryptoAlgorithm[]; total: number | null }>(
        "/api/v3/crypto/algorithm",
        {
          params: {
            ...requestParamsQuery(params),
            ...(assetType ? { asset_type: assetType } : {}),
          },
        },
      );
    },
    enabled: !disableQuery,
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};

const CryptoBySbomQueryKey = "crypto-by-sbom";

/** Fetches cryptographic assets associated with a specific SBOM, optionally filtered by asset type. */
export const useFetchCryptoBySbom = (
  sbomId: string,
  params: HubRequestParams = {},
  assetType?: string,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [CryptoBySbomQueryKey, sbomId, params, assetType],
    queryFn: () => {
      const serialized = requestParamsQuery(params);
      const sbomFilter = `sbom_id=${sbomId}`;
      const combinedQ = serialized.q
        ? `${serialized.q}&${sbomFilter}`
        : sbomFilter;

      return axios.get<{ items: CryptoAlgorithm[]; total: number | null }>(
        "/api/v3/crypto/algorithm",
        {
          params: {
            ...serialized,
            q: combinedQ,
            ...(assetType ? { asset_type: assetType } : {}),
          },
        },
      );
    },
    enabled: !!sbomId,
  });

  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params,
    },
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};

/** Fetches the policy evaluation summary from POST /v3/crypto/policy/evaluate. */
export const useFetchCryptoPolicySummary = (disableQuery = false) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [CryptoPolicySummaryQueryKey],
    queryFn: () => {
      return axios.post<{
        summary: CryptoPolicySummary;
      }>("/api/v3/crypto/policy/evaluate", {});
    },
    enabled: !disableQuery,
  });

  return {
    result: data?.data?.summary ?? null,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    refetch,
  };
};

/** Upload hook for importing remediation mappings from a CSV or JSON file. */
export const useUploadRemediationMapping = () => {
  const queryClient = useQueryClient();
  return useUpload<{ count: number }, { message: string }>({
    parallel: false,
    uploadFn: async (formData, config) => {
      const file = formData.get("file") as File;
      const contentType = file.name.toLowerCase().endsWith(".csv")
        ? "text/csv"
        : "application/json";
      const bytes = await file.arrayBuffer();
      return axios.post("/api/v3/crypto/remediation/import", bytes, {
        onUploadProgress: config.onUploadProgress,
        cancelToken: config.cancelToken,
        headers: { "Content-Type": contentType },
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [CryptoAlgorithmsQueryKey] }),
        queryClient.invalidateQueries({ queryKey: [CryptoBySbomQueryKey] }),
      ]);
    },
  });
};
