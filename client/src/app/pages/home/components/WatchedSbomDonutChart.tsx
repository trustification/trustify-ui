import React from "react";

import { SbomVulnerabilitiesDonutChart } from "@app/components/SbomVulnerabilitiesDonutChart";
import { useSbomVulnerabilities } from "@app/hooks/domain-controls/useSbomVulnerabilities";

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
  } = useSbomVulnerabilities(sbomId);

  return (
    <SbomVulnerabilitiesDonutChart
      vulnerabilitiesSummary={vulnerabilitiesSummary}
    />
  );
};
