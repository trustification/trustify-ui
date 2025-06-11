import type React from "react";

import { Label, LabelGroup, Truncate } from "@patternfly/react-core";

import { joinKeyValueAsString } from "@app/api/model-utils";

interface LabelsAsListProps {
  defaultIsOpen?: boolean;
  value: { [key: string]: string };
  onClick?: (label: { key: string; value: string }) => void;
}

export const LabelsAsList: React.FC<LabelsAsListProps> = ({
  value,
  defaultIsOpen,
  onClick,
}) => {
  return (
    <LabelGroup defaultIsOpen={defaultIsOpen} numLabels={5}>
      {Object.entries(value)
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .map(([k, v]) => (
          <Label
            key={k}
            color="blue"
            onClick={onClick ? () => onClick({ key: k, value: v }) : undefined}
          >
            <Truncate content={joinKeyValueAsString({ key: k, value: v })} />
          </Label>
        ))}
    </LabelGroup>
  );
};
