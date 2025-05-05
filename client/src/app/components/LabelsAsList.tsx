import type React from "react";

import { Label, LabelGroup, Truncate } from "@patternfly/react-core";

interface LabelsAsListProps {
  defaultIsOpen?: boolean;
  value: { [key: string]: string };
}

export const LabelsAsList: React.FC<LabelsAsListProps> = ({
  value,
  defaultIsOpen,
}) => {
  return (
    <LabelGroup defaultIsOpen={defaultIsOpen} numLabels={2}>
      {Object.entries(value)
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .map(([k, v]) => (
          <Label key={k} color="blue">
            <Truncate content={`${k}=${v}`} />
          </Label>
        ))}
    </LabelGroup>
  );
};
