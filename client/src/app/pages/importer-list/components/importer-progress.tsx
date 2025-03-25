import type React from "react";

import {
  Progress,
  ProgressMeasureLocation,
  ProgressSize,
} from "@patternfly/react-core";

import type { Progress as ProgressModel } from "@app/client";

export interface ImporterProgressProps {
  value: ProgressModel;
}

export const ImporterProgress: React.FC<ImporterProgressProps> = ({
  value,
}) => {
  return (
    <Progress
      aria-label="Progress of Importer "
      value={value.current}
      min={0}
      max={value.total}
      measureLocation={ProgressMeasureLocation.inside}
      size={ProgressSize.sm}
    />
  );
};
