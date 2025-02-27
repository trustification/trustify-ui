import React from "react";

import { Flex, FlexItem, Tooltip } from "@patternfly/react-core";
import ShieldIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";

import { severityList } from "@app/api/model-utils";
import { ExtendedSeverity } from "@app/api/models";

interface SeverityShieldAndTextProps {
  value: ExtendedSeverity;
  hideLabel?: boolean;
}

export const SeverityShieldAndText: React.FC<SeverityShieldAndTextProps> = ({
  value,
  hideLabel,
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
        {hideLabel ? (
          <Tooltip content={label}>
            <ShieldIcon color={severityProps.color.value} />
          </Tooltip>
        ) : (
          <ShieldIcon color={severityProps.color.value} />
        )}
      </FlexItem>
      {!hideLabel && <FlexItem>{label}</FlexItem>}
    </Flex>
  );
};
