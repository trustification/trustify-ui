import React from "react";

import { VulnerabilityBase, Severity } from "@app/api/models";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";

type SeverityCount = { [key in Severity]: number };
const defaultSeverityCount: SeverityCount = {
  none: 0,
  low: 0,
  medium: 0,
  high: 0,
  critical: 0,
};

interface VulnerabilitiesGalleryCountProps {
  vulnerabilities: { severity: Severity; identifier: string }[];
}

export const VulnerabilitiesGalleryCount: React.FC<
  VulnerabilitiesGalleryCountProps
> = ({ vulnerabilities }) => {
  const severityCount = vulnerabilities.reduce((prev, acc) => {
    return { ...prev, [acc.severity]: prev[acc.severity] + 1 };
  }, defaultSeverityCount);

  return <VulnerabilityGallery severities={severityCount} />;
};
