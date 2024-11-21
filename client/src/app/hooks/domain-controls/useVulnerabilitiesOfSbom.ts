import React from "react";

import { VulnerabilityStatus } from "@app/api/models";
import {
  SbomAdvisory,
  SbomPackage,
  Severity,
  VulnerabilityHead,
} from "@app/client";
import {
  useFetchSbomsAdvisory,
  useFetchSbomsAdvisory2,
} from "@app/queries/sboms";

interface VulnerabilityOfSbom {
  advisory: SbomAdvisory;
  vulnerabilityId: string;
  vulnerability: VulnerabilityHead;
  severity?: Severity | null;
  status: VulnerabilityStatus;
  packages: SbomPackage[];
}

export interface VulnerabilityOfSbomSummary {
  total: number;
  severities: { [key in Severity]: number };
}

const DEFAULT_SUMMARY: VulnerabilityOfSbomSummary = {
  total: 0,
  severities: { none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

export const useVulnerabilitiesOfSbom = (sbomId: string) => {
  const {
    advisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  } = useFetchSbomsAdvisory(sbomId);

  const allVulnerabilities = React.useMemo(() => {
    const vulnerabilities = (advisories ?? [])
      .flatMap((advisory) => {
        return (advisory.status ?? []).map((status) => {
          const result: VulnerabilityOfSbom = {
            advisory: advisory,
            vulnerabilityId: status.vulnerability.identifier,
            vulnerability: status.vulnerability,
            severity: status.severity,
            status: status.status as VulnerabilityStatus,
            packages: status.packages || [],
          };
          return result;
        });
      })
      // Take only "affected"
      .filter((item) => item.status === "affected")
      // Remove duplicates if exists
      .reduce((prev, current) => {
        const exists = prev.find(
          (item) =>
            item.vulnerability.identifier ===
              current.vulnerability.identifier &&
            item.advisory.uuid === current.advisory.uuid
        );
        if (!exists) {
          return [...prev, current];
        } else {
          return prev;
        }
      }, [] as VulnerabilityOfSbom[]);

    return vulnerabilities;
  }, [advisories]);

  // Summary

  const vulnerabilitiesSummary = React.useMemo(() => {
    return allVulnerabilities.reduce((prev, current) => {
      if (current.severity) {
        const severity = current.severity;
        return {
          ...prev,
          total: prev.total + 1,
          severities: {
            ...prev.severities,
            [severity]: prev.severities[severity] + 1,
          },
        };
      } else {
        return prev;
      }
    }, DEFAULT_SUMMARY);
  }, [allVulnerabilities]);

  return {
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
    vulnerabilities: allVulnerabilities,
    summary: vulnerabilitiesSummary,
  };
};

export const useVulnerabilitiesOfSboms = (sbomIds: string[]) => {
  const { advisories, isFetching, fetchError } =
    useFetchSbomsAdvisory2(sbomIds);

  const allVulnerabilities = React.useMemo(() => {
    const vulnerabilities = (advisories ?? []).map((advisories) => {
      return (
        advisories
          .flatMap((advisory) => {
            return (advisory.status ?? []).map((status) => {
              const result: VulnerabilityOfSbom = {
                advisory: advisory,
                vulnerabilityId: status.vulnerability.identifier,
                vulnerability: status.vulnerability,
                severity: status.severity,
                status: status.status as VulnerabilityStatus,
                packages: status.packages || [],
              };
              return result;
            });
          })
          // Take only "affected"
          .filter((item) => item.status === "affected")
          // Remove duplicates if exists
          .reduce((prev, current) => {
            const exists = prev.find(
              (item) =>
                item.vulnerability.identifier ===
                  current.vulnerability.identifier &&
                item.advisory.uuid === current.advisory.uuid
            );
            if (!exists) {
              return [...prev, current];
            } else {
              return prev;
            }
          }, [] as VulnerabilityOfSbom[])
      );
    });
    return vulnerabilities;
  }, [advisories]);

  // Summary

  const vulnerabilitiesSummary = React.useMemo(() => {
    return allVulnerabilities.map((allVulnerabilities) => {
      return allVulnerabilities.reduce((prev, current) => {
        if (current.severity) {
          const severity = current.severity;
          return {
            ...prev,
            total: prev.total + 1,
            severities: {
              ...prev.severities,
              [severity]: prev.severities[severity] + 1,
            },
          };
        } else {
          return prev;
        }
      }, DEFAULT_SUMMARY);
    });
  }, [allVulnerabilities]);

  return {
    isFetching: isFetching,
    fetchError: fetchError,
    vulnerabilities: allVulnerabilities,
    summary: vulnerabilitiesSummary,
  };
};
