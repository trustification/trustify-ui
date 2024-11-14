import React from "react";

import { VulnerabilityStatus } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  getVulnerability,
  SbomAdvisory,
  SbomPackage,
  Severity,
  VulnerabilityDetails,
} from "@app/client";
import { useFetchSbomsAdvisory } from "@app/queries/sboms";

interface VulnerabilityOfSbom {
  vulnerabilityId: string;
  advisory: SbomAdvisory;
  status: VulnerabilityStatus;
  packages: SbomPackage[];
  vulnerability?: VulnerabilityDetails;
}

interface VulnerabilityOfSbomSummary {
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

  const [allVulnerabilities, setAllVulnerabilities] = React.useState<
    VulnerabilityOfSbom[]
  >([]);
  const [vulnerabilitiesById, setVulnerabilitiesById] = React.useState<
    Map<string, VulnerabilityDetails>
  >(new Map());
  const [isFetchingVulnerabilities, setIsFetchingVulnerabilities] =
    React.useState(false);

  React.useEffect(() => {
    if (advisories.length === 0) {
      return;
    }

    const vulnerabilities = (advisories ?? [])
      .flatMap((advisory) => {
        return (advisory.status ?? []).map((status) => {
          const result: VulnerabilityOfSbom = {
            vulnerabilityId: status.vulnerability_id,
            status: status.status as VulnerabilityStatus,
            packages: status.packages || [],
            advisory: { ...advisory },
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
            item.vulnerabilityId === current.vulnerabilityId &&
            item.advisory.uuid === current.advisory.uuid
        );
        if (!exists) {
          return [...prev, current];
        } else {
          return prev;
        }
      }, [] as VulnerabilityOfSbom[]);

    setAllVulnerabilities(vulnerabilities);
    setIsFetchingVulnerabilities(true);

    Promise.all(
      vulnerabilities
        .map(async (item) => {
          const response = await getVulnerability({
            client,
            path: { id: item.vulnerabilityId },
          });
          return response.data;
        })
        .map((vulnerability) => vulnerability.catch(() => null))
    ).then((vulnerabilities) => {
      const validVulnerabilities = vulnerabilities.reduce((prev, current) => {
        if (current) {
          return [...prev, current];
        } else {
          // Filter out error responses
          return prev;
        }
      }, [] as VulnerabilityDetails[]);

      const vulnerabilitiesById = new Map<string, VulnerabilityDetails>();
      validVulnerabilities.forEach((vulnerability) => {
        vulnerabilitiesById.set(vulnerability.identifier, vulnerability);
      });

      setVulnerabilitiesById(vulnerabilitiesById);
      setIsFetchingVulnerabilities(false);
    });
  }, [advisories]);

  const allVulnerabilitiesWithMappedData = React.useMemo(() => {
    return allVulnerabilities.map((item) => {
      const result: VulnerabilityOfSbom = {
        ...item,
        vulnerability: vulnerabilitiesById.get(item.vulnerabilityId),
      };
      return result;
    });
  }, [allVulnerabilities, vulnerabilitiesById]);

  // Summary

  const vulnerabilitiesSummary = React.useMemo(() => {
    return allVulnerabilitiesWithMappedData.reduce((prev, current) => {
      if (current.vulnerability?.average_severity) {
        const severity = current.vulnerability?.average_severity;
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
  }, [allVulnerabilitiesWithMappedData]);

  return {
    isFetching: isFetchingAdvisories || isFetchingVulnerabilities,
    fetchError: fetchErrorAdvisories,
    vulnerabilities: allVulnerabilitiesWithMappedData,
    summary: vulnerabilitiesSummary,
  };
};
