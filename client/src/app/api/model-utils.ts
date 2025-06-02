import type { ProgressProps } from "@patternfly/react-core";
import {
  t_global_icon_color_severity_critical_default as criticalColor,
  t_global_icon_color_severity_important_default as importantColor,
  t_global_icon_color_severity_minor_default as lowColor,
  t_global_icon_color_severity_moderate_default as moderateColor,
  t_global_icon_color_severity_none_default as noneColor,
  t_global_icon_color_severity_undefined_default as unknownColor,
} from "@patternfly/react-tokens";

import type { ExtendedSeverity, SingleLabel } from "./models";

type ListType = {
  [key in ExtendedSeverity]: {
    name: string;
    color: { name: string; value: string; var: string };
    progressProps: Pick<ProgressProps, "variant">;
  };
};

export const severityList: ListType = {
  unknown: {
    name: "Unknown",
    color: unknownColor,
    progressProps: { variant: undefined },
  },
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

export const getSeverityPriority = (val: ExtendedSeverity) => {
  switch (val) {
    case "unknown":
      return 1;
    case "none":
      return 2;
    case "low":
      return 3;
    case "medium":
      return 4;
    case "high":
      return 5;
    case "critical":
      return 6;
    default:
      return 0;
  }
};

export function compareBySeverityFn<T>(
  severityExtractor: (elem: T) => ExtendedSeverity,
) {
  return (a: T, b: T) => {
    return (
      getSeverityPriority(severityExtractor(a)) -
      getSeverityPriority(severityExtractor(b))
    );
  };
}

export const joinKeyValueAsString = ({ key, value }: SingleLabel): string => {
  return `${value ? `${key}=${value}` : `${key}`}`;
};

export const splitStringAsKeyValue = (v: string): SingleLabel => {
  const [key, value] = v.split("=");
  return { key, value };
};
