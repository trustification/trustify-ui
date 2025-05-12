import type React from "react";

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";

export const StateError: React.FC = () => {
  return (
    <EmptyState
      status="danger"
      headingLevel="h4"
      titleText="Unable to connect"
      icon={ExclamationCircleIcon}
      variant={EmptyStateVariant.sm}
    >
      <EmptyStateBody>
        There was an error retrieving data. Check your connection and try again.
      </EmptyStateBody>
    </EmptyState>
  );
};
