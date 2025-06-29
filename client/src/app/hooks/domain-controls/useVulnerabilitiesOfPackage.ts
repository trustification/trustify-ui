import React from "react";

import {
  type ExtendedSeverity,
  type VulnerabilityStatus,
  extendedSeverityFromSeverity,
} from "@app/api/models";
import type { PurlAdvisory, VulnerabilityHead } from "@app/client";
import { useFetchPackageById } from "@app/queries/packages";

const areVulnerabilityOfPackageEqual = (
  a: VulnerabilityOfPackage,
  b: VulnerabilityOfPackage | FlatVulnerabilityOfPackage,
) => {
  return (
    a.vulnerability.identifier === b.vulnerability.identifier &&
    a.vulnerabilityStatus === b.vulnerabilityStatus
  );
};

interface FlatVulnerabilityOfPackage {
  vulnerability: VulnerabilityHead & {
    average_severity: ExtendedSeverity;
    average_score: number;
  };
  vulnerabilityStatus: VulnerabilityStatus;
  advisory: PurlAdvisory;
}

interface VulnerabilityOfPackage {
  vulnerability: VulnerabilityHead & {
    average_severity: ExtendedSeverity;
    average_score: number;
  };
  vulnerabilityStatus: VulnerabilityStatus;
  relatedSboms: {
    advisory: PurlAdvisory;
  }[];
}

type SeveritySummary = {
  total: number;
  severities: { [key in ExtendedSeverity]: number };
};

interface VulnerabilityOfPackageSummary {
  vulnerabilityStatus: {
    [key in VulnerabilityStatus]: SeveritySummary;
  };
}

const DEFAULT_SEVERITY: SeveritySummary = {
  total: 0,
  severities: { unknown: 0, none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

const DEFAULT_SUMMARY: VulnerabilityOfPackageSummary = {
  vulnerabilityStatus: {
    affected: { ...DEFAULT_SEVERITY },
    fixed: { ...DEFAULT_SEVERITY },
    not_affected: { ...DEFAULT_SEVERITY },
    known_not_affected: { ...DEFAULT_SEVERITY },
  },
};

const advisoryToModels = (advisories: PurlAdvisory[]) => {
  const vulnerabilities = advisories
    .flatMap((advisory) => {
      return (advisory.status ?? []).map((pkgStatus) => {
        const extendedSeverity = extendedSeverityFromSeverity(
          pkgStatus.average_severity,
        );

        const result: FlatVulnerabilityOfPackage = {
          vulnerability: {
            ...pkgStatus.vulnerability,
            average_severity: extendedSeverity,
            average_score: pkgStatus.average_score,
          },
          vulnerabilityStatus: pkgStatus.status as VulnerabilityStatus,
          advisory: advisory,
        };
        return result;
      });
    })
    // group
    .reduce((prev, current) => {
      const existingElement = prev.find((item) => {
        return areVulnerabilityOfPackageEqual(item, current);
      });

      let result: VulnerabilityOfPackage[];

      if (existingElement) {
        const arrayWithoutExistingItem = prev.filter(
          (item) => !areVulnerabilityOfPackageEqual(item, existingElement),
        );

        const updatedItemInArray: VulnerabilityOfPackage = {
          ...existingElement,
          relatedSboms: [
            ...existingElement.relatedSboms,
            {
              advisory: current.advisory,
            },
          ],
        };

        result = [...arrayWithoutExistingItem, updatedItemInArray];
      } else {
        const newItemInArray: VulnerabilityOfPackage = {
          vulnerability: current.vulnerability,
          vulnerabilityStatus: current.vulnerabilityStatus,
          relatedSboms: [
            {
              advisory: current.advisory,
            },
          ],
        };
        result = [...prev.slice(), newItemInArray];
      }

      return result;
    }, [] as VulnerabilityOfPackage[]);

  const summary = vulnerabilities.reduce(
    (prev, current) => {
      const vulnStatus = current.vulnerabilityStatus;
      const severity = current.vulnerability.average_severity;

      const prevVulnStatusValue = prev.vulnerabilityStatus[vulnStatus];

      // biome-ignore lint/performance/noAccumulatingSpread: allowed
      const result: VulnerabilityOfPackageSummary = Object.assign(prev, {
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
      });
      return result;
    },
    { ...DEFAULT_SUMMARY } as VulnerabilityOfPackageSummary,
  );

  return {
    vulnerabilities,
    summary,
  };
};

export const useVulnerabilitiesOfPackage = (packageId: string) => {
  const {
    pkg,
    isFetching: isFetchingPackage,
    fetchError: fetchErrorPackage,
  } = useFetchPackageById(packageId);

  const result = React.useMemo(() => {
    return advisoryToModels(pkg?.advisories || []);
  }, [pkg]);

  return {
    data: result,
    isFetching: isFetchingPackage,
    fetchError: fetchErrorPackage,
  };
};
