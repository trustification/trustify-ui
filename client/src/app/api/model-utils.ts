import { ProgressProps } from "@patternfly/react-core";
import {
  global_palette_purple_400 as criticalColor,
  global_danger_color_100 as importantColor,
  global_info_color_100 as lowColor,
  global_warning_color_100 as moderateColor,
  global_palette_black_400 as noneColor,
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

const getSeverityPriority = (val: Severity) => {
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
