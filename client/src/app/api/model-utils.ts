import { ProgressProps } from "@patternfly/react-core";
import {
  global_palette_purple_400 as criticalColor,
  global_danger_color_100 as importantColor,
  global_info_color_100 as lowColor,
  global_warning_color_100 as moderateColor,
  global_palette_black_400 as noneColor,
  global_palette_black_300 as unknownColor,
} from "@patternfly/react-tokens";

import { ExtendedSeverity } from "./models";

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
  severityExtractor: (elem: T) => ExtendedSeverity
) {
  return (a: T, b: T) => {
    return (
      getSeverityPriority(severityExtractor(a)) -
      getSeverityPriority(severityExtractor(b))
    );
  };
}
