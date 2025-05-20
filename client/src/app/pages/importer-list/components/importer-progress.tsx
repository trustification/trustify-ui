import type React from "react";

import dayjs from "dayjs";

import { Progress, ProgressSize } from "@patternfly/react-core";

import type { Progress as ProgressModel } from "@app/client";

export interface ImporterProgressProps {
  value: ProgressModel;
  timeRemaining?: number;
}

export const ImporterProgress: React.FC<ImporterProgressProps> = ({
  value,
  timeRemaining,
}) => {
  return (
    <Progress
      aria-label="Progress of Importer"
      title={`Time remaining: ${timeRemaining ? dayjs.duration(timeRemaining).humanize() : "..."}`}
      value={value.current}
      min={0}
      max={value.total}
      size={ProgressSize.sm}
    />
  );
};
