import type React from "react";

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";

export const StateNoResults: React.FC = () => {
  return (
    <EmptyState
      titleText="No results found"
      headingLevel="h4"
      icon={SearchIcon}
      variant={EmptyStateVariant.sm}
    >
      <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all
        filters to show results.
      </EmptyStateBody>
    </EmptyState>
  );
};
