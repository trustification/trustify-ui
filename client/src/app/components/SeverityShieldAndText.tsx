import type React from "react";

import { Flex, FlexItem, Tooltip } from "@patternfly/react-core";
import ShieldIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";

import { severityList } from "@app/api/model-utils";
import type { ExtendedSeverity } from "@app/api/models";

interface SeverityShieldAndTextProps {
  value: ExtendedSeverity;
  score: number | null;
  showScore?: boolean;
  showLabel?: boolean;
}

export const SeverityShieldAndText: React.FC<SeverityShieldAndTextProps> = ({
  value,
  score,
  showScore,
  showLabel,
}) => {
  const severityProps = severityList[value];
  const label = severityProps.name;

  return (
    <Flex
      spaceItems={{ default: "spaceItemsXs" }}
      alignItems={{ default: "alignItemsCenter" }}
      flexWrap={{ default: "nowrap" }}
      style={{ whiteSpace: "nowrap" }}
    >
      <FlexItem>
        {showLabel ? (
          <ShieldIcon color={severityProps.color.value} />
        ) : (
          <Tooltip content={label}>
            <ShieldIcon color={severityProps.color.value} />
          </Tooltip>
        )}
      </FlexItem>
      {showLabel && <FlexItem>{label}</FlexItem>}
      {showScore && score !== null && (
        <FlexItem>({Math.round(score * 10) / 10})</FlexItem>
      )}
    </Flex>
  );
};
