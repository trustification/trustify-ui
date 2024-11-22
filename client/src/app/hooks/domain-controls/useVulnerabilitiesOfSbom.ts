import React from "react";

import { VulnerabilityStatus } from "@app/api/models";
import { SbomAdvisory, SbomPackage, SbomStatus, Severity } from "@app/client";
import {
  useFetchSbomsAdvisory,
  useFetchSbomsAdvisoryBatch,
} from "@app/queries/sboms";

interface VulnerabilityOfSbom {
  vulnerability: SbomStatus;
  advisory: SbomAdvisory;
  vulnerabilityStatus: VulnerabilityStatus;
  packages: SbomPackage[];
}

export type SeveritySummary = {
  total: number;
  severities: { [key in Severity]: number };
};

export interface VulnerabilityOfSbomSummary {
  vulnerabilityStatus: {
    [key in VulnerabilityStatus]: SeveritySummary;
  };
}

const DEFAULT_SEVERITY: SeveritySummary = {
  total: 0,
  severities: { none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

const DEFAULT_SUMMARY: VulnerabilityOfSbomSummary = {
  vulnerabilityStatus: {
    affected: { ...DEFAULT_SEVERITY },
    fixed: { ...DEFAULT_SEVERITY },
    not_affected: { ...DEFAULT_SEVERITY },
    known_not_affected: { ...DEFAULT_SEVERITY },
  },
};

const advisoryStatusToModels = (advisories: SbomAdvisory[]) => {
  const vulnerabilities = advisories.flatMap((advisory) => {
    return (advisory.status ?? []).map((sbomStatus) => {
      const result: VulnerabilityOfSbom = {
        vulnerability: sbomStatus,
        advisory: advisory,
        vulnerabilityStatus: sbomStatus.status as VulnerabilityStatus,
        packages: sbomStatus.packages || [],
      };
      return result;
    });
  });

  const summary = vulnerabilities.reduce((prev, current) => {
    const vulnStatus = current.vulnerabilityStatus;
    const severity = current.vulnerability.average_severity;

    const prevVulnStatusValue = prev.vulnerabilityStatus[vulnStatus];

    const result: VulnerabilityOfSbomSummary = {
      ...prev,
      vulnerabilityStatus: {
        ...prev.vulnerabilityStatus,
        [vulnStatus]: {
          total: prevVulnStatusValue.total + 1,
          severities: {
            ...prevVulnStatusValue.severities,
            [severity]: prevVulnStatusValue.severities[severity] + 1,
          },
        },
      },
    };
    return result;
  }, DEFAULT_SUMMARY);

  return {
    vulnerabilities,
    summary,
  };
};

export const useVulnerabilitiesOfSbom = (sbomId: string) => {
  const {
    advisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  } = useFetchSbomsAdvisory(sbomId);

  const result = React.useMemo(() => {
    return advisoryStatusToModels(advisories || []);
  }, [advisories]);

  return {
    data: result,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  };
};

export const useVulnerabilitiesOfSboms = (sbomIds: string[]) => {
  const { advisories, isFetching, fetchError } =
    useFetchSbomsAdvisoryBatch(sbomIds);

  const result = React.useMemo(() => {
    return (advisories ?? []).map((item) => {
      return advisoryStatusToModels(item || []);
    });
  }, [advisories]);

  return {
    data: result,
    isFetching: isFetching,
    fetchError: fetchError,
  };
};
