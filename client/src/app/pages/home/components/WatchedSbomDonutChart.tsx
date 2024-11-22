import React from "react";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { SbomVulnerabilitiesDonutChart } from "@app/components/SbomVulnerabilitiesDonutChart";
import { useVulnerabilitiesOfSbom } from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";

interface WatchedSbomDonutChartProps {
  sbomId: string;
}

export const WatchedSbomDonutChart: React.FC<WatchedSbomDonutChartProps> = ({
  sbomId,
}) => {
  const { data, isFetching, fetchError } = useVulnerabilitiesOfSbom(sbomId);

  return (
    <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
      <SbomVulnerabilitiesDonutChart
        vulnerabilitiesSummary={data.summary.vulnerabilityStatus.affected}
      />
    </LoadingWrapper>
  );
};
