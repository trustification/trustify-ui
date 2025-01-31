import { ProgressProps } from "@patternfly/react-core";
import {
  t_global_icon_color_severity_critical_default as criticalColor,
  t_global_icon_color_severity_important_default as importantColor,
  t_global_icon_color_severity_moderate_default as moderateColor,
  t_global_icon_color_severity_minor_default as lowColor,
  t_global_icon_color_severity_none_default as noneColor,
} from "@patternfly/react-tokens";

import { Severity } from "@app/client";

type ListType = {
  [key in Severity]: {
    name: string;
    color: { name: string; value: string; var: string };
    progressProps: Pick<ProgressProps, "variant">;
  };
};

export const severityList: ListType = {
  none: {
    name: "None",
    color: noneColor,
    progressProps: { variant: undefined },
  },
  low: {
    name: "Low",
    color: lowColor,
    progressProps: { variant: undefined },
  },
  medium: {
    name: "Medium",
    color: moderateColor,
    progressProps: { variant: "warning" },
  },
  high: {
    name: "High",
    color: importantColor,
    progressProps: { variant: "danger" },
  },
  critical: {
    name: "Critical",
    color: criticalColor,
    progressProps: { variant: "danger" },
  },
};

export const getSeverityPriority = (val: Severity) => {
  switch (val) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    case "critical":
      return 4;
    default:
      return 0;
  }
};

export function compareBySeverityFn<T>(
  severityExtractor: (elem: T) => Severity
) {
  return (a: T, b: T) => {
    return (
      getSeverityPriority(severityExtractor(a)) -
      getSeverityPriority(severityExtractor(b))
    );
  };
}
