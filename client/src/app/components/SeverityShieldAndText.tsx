import type React from "react";

import { Flex, FlexItem, Icon, Tooltip } from "@patternfly/react-core";

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
  const SeverityIcon = severityProps.icon;

  return (
    <Flex
      spaceItems={{ default: "spaceItemsXs" }}
      alignItems={{ default: "alignItemsCenter" }}
      flexWrap={{ default: "nowrap" }}
      style={{ whiteSpace: "nowrap" }}
    >
      <FlexItem>
        {showLabel ? (
          <Icon>
            <SeverityIcon color={severityProps.color.value} />
          </Icon>
        ) : (
          <Tooltip content={label}>
            <Icon>
              <SeverityIcon color={severityProps.color.value} />
            </Icon>
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
