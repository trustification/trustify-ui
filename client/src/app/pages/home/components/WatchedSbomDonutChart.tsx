import React from "react";

import { SbomVulnerabilitiesDonutChart } from "@app/components/SbomVulnerabilitiesDonutChart";
import { useVulnerabilitiesOfSbom } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";

interface WatchedSbomDonutChartProps {
  sbomId: string;
}

export const WatchedSbomDonutChart: React.FC<WatchedSbomDonutChartProps> = ({
  sbomId,
}) => {
  const {
    vulnerabilities: vulnerabilities,
    summary: vulnerabilitiesSummary,
    isFetching: isFetchingVulnerabilities,
    fetchError: fetchErrorVulnerabilities,
  } = useVulnerabilitiesOfSbom(sbomId);

  return (
    <SbomVulnerabilitiesDonutChart
      vulnerabilitiesSummary={vulnerabilitiesSummary}
    />
  );
};
