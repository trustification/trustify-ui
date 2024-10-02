import React from "react";

import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { Severity } from "@app/client";

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
