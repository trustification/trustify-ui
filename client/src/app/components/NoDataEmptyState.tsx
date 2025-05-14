import type React from "react";

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from "@patternfly/react-core";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";

export interface NoDataEmptyStateProps {
  title: string;
  description?: string;
}

export const NoDataEmptyState: React.FC<NoDataEmptyStateProps> = ({
  title,
  description,
}) => {
  return (
    <EmptyState
      titleText={title}
      headingLevel="h4"
      icon={CubesIcon}
      variant={EmptyStateVariant.sm}
    >
      {description && <EmptyStateBody>{description}</EmptyStateBody>}
    </EmptyState>
  );
};
