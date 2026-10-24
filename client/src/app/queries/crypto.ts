import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { HubRequestParams } from "@app/api/models";
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
