import React from "react";

import {
  ExtendedSeverity,
  extendedSeverityFromSeverity,
  VulnerabilityStatus,
} from "@app/api/models";
import { SbomAdvisory, SbomPackage, SbomStatus } from "@app/client";
import {
  useFetchSbomsAdvisory,
  useFetchSbomsAdvisoryBatch,
} from "@app/queries/sboms";

const areVulnerabilityOfSbomEqual = (
  a: VulnerabilityOfSbom,
  b: VulnerabilityOfSbom | FlatVulnerabilityOfSbom
) => {
  return (
    a.vulnerability.identifier === b.vulnerability.identifier &&
    a.vulnerabilityStatus === b.vulnerabilityStatus
  );
};

interface FlatVulnerabilityOfSbom {
  vulnerability: SbomStatus;
  vulnerabilityStatus: VulnerabilityStatus;
  advisory: SbomAdvisory;
  packages: SbomPackage[];
}

interface VulnerabilityOfSbom {
  vulnerability: SbomStatus;
  vulnerabilityStatus: VulnerabilityStatus;
  relatedPackages: {
    advisory: SbomAdvisory;
    packages: SbomPackage[];
  }[];
}

export type SeveritySummary = {
  total: number;
  severities: { [key in ExtendedSeverity]: number };
};

export interface VulnerabilityOfSbomSummary {
  vulnerabilityStatus: {
    [key in VulnerabilityStatus]: SeveritySummary;
  };
}

const DEFAULT_SEVERITY: SeveritySummary = {
  total: 0,
  severities: { unknown: 0, none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

const DEFAULT_SUMMARY: VulnerabilityOfSbomSummary = {
  vulnerabilityStatus: {
    affected: { ...DEFAULT_SEVERITY },
    fixed: { ...DEFAULT_SEVERITY },
    not_affected: { ...DEFAULT_SEVERITY },
    known_not_affected: { ...DEFAULT_SEVERITY },
  },
};

const advisoryToModels = (advisories: SbomAdvisory[]) => {
  const vulnerabilities = advisories.flatMap((advisory) => {
    return (
      (advisory.status ?? [])
        .map((sbomStatus) => {
          const result: FlatVulnerabilityOfSbom = {
            vulnerability: sbomStatus,
            vulnerabilityStatus: sbomStatus.status as VulnerabilityStatus,
            advisory: advisory,
            packages: sbomStatus.packages,
          };
          return result;
        })
        // group
        .reduce((prev, current) => {
          const existingElement = prev.find((item) => {
            return areVulnerabilityOfSbomEqual(item, current);
          });

          if (existingElement) {
            const arrayWithoutExistingItem = prev.filter(
              (item) => !areVulnerabilityOfSbomEqual(item, existingElement)
            );

            const updatedItemInArray: VulnerabilityOfSbom = {
              ...existingElement,
              relatedPackages: [
                ...existingElement.relatedPackages,
                {
                  advisory: current.advisory,
                  packages: current.packages,
                },
              ],
            };

            return [...arrayWithoutExistingItem, updatedItemInArray];
          } else {
            const newItemInArray: VulnerabilityOfSbom = {
              vulnerability: current.vulnerability,
              vulnerabilityStatus: current.vulnerabilityStatus,
              relatedPackages: [
                {
                  advisory: current.advisory,
                  packages: current.packages,
                },
              ],
            };
            return [...prev, newItemInArray];
          }
        }, [] as VulnerabilityOfSbom[])
    );
  });

  const summary = vulnerabilities.reduce((prev, current) => {
    const vulnStatus = current.vulnerabilityStatus;
    const severity = extendedSeverityFromSeverity(
      current.vulnerability.average_severity
    );

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
    return advisoryToModels(advisories || []);
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
      return advisoryToModels(item || []);
    });
  }, [advisories]);

  return {
    data: result,
    isFetching: isFetching,
    fetchError: fetchError,
  };
};
