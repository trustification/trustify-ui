import React from "react";

import { VulnerabilityStatus } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  getVulnerability,
  PurlAdvisory,
  Severity,
  VulnerabilityDetails,
} from "@app/client";
import { useFetchPackageById } from "@app/queries/packages";

interface PackageVulnerability {
  vulnerabilityId: string;
  advisory: PurlAdvisory;
  status: VulnerabilityStatus;
  vulnerability?: VulnerabilityDetails;
}

interface PackageVulnerabilitySummary {
  total: number;
  severities: { [key in Severity]: number };
}

const DEFAULT_SBOM_VULNERABILITY_SUMMARY: PackageVulnerabilitySummary = {
  total: 0,
  severities: { none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

export const usePackageVulnerabilities = (packageId: string) => {
  const {
    pkg,
    isFetching: isFetchingPackage,
    fetchError: fetchErrorPackage,
  } = useFetchPackageById(packageId);

  const [allVulnerabilities, setAllVulnerabilities] = React.useState<
    PackageVulnerability[]
  >([]);
  const [vulnerabilitiesById, setVulnerabilitiesById] = React.useState<
    Map<string, VulnerabilityDetails>
  >(new Map());
  const [isFetchingVulnerabilities, setIsFetchingVulnerabilities] =
    React.useState(false);

  React.useEffect(() => {
    if (!pkg || pkg.advisories.length === 0) {
      return;
    }

    const vulnerabilities = (pkg?.advisories ?? [])
      .flatMap((advisory) => {
        return (advisory.status ?? []).map((status) => {
          const result: PackageVulnerability = {
            vulnerabilityId: status.vulnerability.identifier,
            status: status.status as VulnerabilityStatus,
            advisory: advisory,
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
      }, [] as PackageVulnerability[]);

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
  }, [pkg]);

  const allVulnerabilitiesWithMappedData = React.useMemo(() => {
    return allVulnerabilities.map((item) => {
      const result: PackageVulnerability = {
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
    }, DEFAULT_SBOM_VULNERABILITY_SUMMARY);
  }, [allVulnerabilitiesWithMappedData]);

  return {
    isFetching: isFetchingPackage || isFetchingVulnerabilities,
    fetchError: fetchErrorPackage,
    vulnerabilities: allVulnerabilitiesWithMappedData,
    summary: vulnerabilitiesSummary,
  };
};
