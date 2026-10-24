import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { client } from "../axios-config/apiInit";
import { recommend, recommendReport } from "../client";
import type { RecommendEntry } from "../client";

export { type RecommendEntry };

const RecommendationsQueryKey = "recommendations";

/** Batch-fetch vendor recommendations for the given PURLs via POST /api/v2/purl/recommend. */
export const useFetchRecommendations = (purls: string[]) => {
  const sortedPurls = useMemo(() => [...purls].sort(), [purls]);

  const { data, isLoading, error } = useQuery({
    queryKey: [RecommendationsQueryKey, sortedPurls],
    queryFn: () =>
      recommend({
        client,
        body: { purls: sortedPurls },
      }),
    enabled: sortedPurls.length > 0,
  });

  const recommendationsMap = useMemo(() => {
    const map = new Map<string, RecommendEntry[]>();
    const recs = data?.data?.recommendations;
    if (recs) {
      for (const [purl, entries] of Object.entries(recs)) {
        map.set(purl, entries);
      }
    }
    return map;
  }, [data]);

  return {
    recommendationsMap,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
  };
};

/** Probe whether the recommendation feature is configured on the server.
 * Returns false only when the endpoint responds with 422 and the structured
 * error code is CapabilityDisabled. */
export const useIsRecommendationEnabled = (): boolean => {
  const { error, isPending } = useQuery({
    queryKey: ["recommendation-feature-probe"],
    queryFn: () => recommend({ client, body: { purls: [] } }),
    retry: false,
    staleTime: Infinity,
  });
  if (isPending) return false;
  const axiosErr = error as AxiosError | null;
  if (axiosErr?.response?.status !== 422) return true;
  return (
    (axiosErr.response.data as { error?: string } | null)?.error !==
    "CapabilityDisabled"
  );
};

const RemediationReportQueryKey = "remediation-report";

/** Fetch an aggregated vendor remediation report for the given SBOM IDs via POST /api/v3/purl/recommend/report. */
export const useFetchRemediationReport = (sbomIds: string[]) => {
  const sortedIds = useMemo(() => [...sbomIds].sort(), [sbomIds]);

  const { data, isLoading, error } = useQuery({
    queryKey: [RemediationReportQueryKey, sortedIds],
    queryFn: () =>
      recommendReport({
        client,
        body: { sbom_ids: sortedIds },
      }),
    enabled: sortedIds.length > 0,
    retry: false,
  });

  const isLimitExceeded =
    (error as AxiosError | null)?.response?.status === 413;

  return {
    report: data?.data ?? null,
    isFetching: isLoading,
    fetchError: error as AxiosError | null,
    isLimitExceeded,
  };
};
