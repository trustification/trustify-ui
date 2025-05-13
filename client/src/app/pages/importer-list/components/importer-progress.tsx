import type React from "react";

import dayjs from "dayjs";

import {
  Progress,
  ProgressSize
} from "@patternfly/react-core";

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
      title={
        timeRemaining
          ? `Time remaining: ${dayjs.duration(timeRemaining).humanize()}`
          : undefined
      }
      value={value.current}
      min={0}
      max={value.total}
      size={ProgressSize.sm}
    />
  );
};
