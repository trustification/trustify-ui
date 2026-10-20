import React from "react";
import { Label } from "@patternfly/react-core";

const policyLabelMap: Record<
  string,
  { color: "green" | "orange" | "red"; label: string }
> = {
  compliant: { color: "green", label: "Compliant" },
  warning: { color: "orange", label: "Warning" },
  non_compliant: { color: "red", label: "Non-compliant" },
};

interface PolicyLabelProps {
  policyStatus: string;
}

export const PolicyLabel: React.FC<PolicyLabelProps> = ({ policyStatus }) => {
  const entry = policyLabelMap[policyStatus];
  return (
    <Label color={entry?.color ?? "grey"}>{entry?.label ?? "Unknown"}</Label>
  );
};
