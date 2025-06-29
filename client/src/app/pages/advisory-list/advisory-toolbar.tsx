import React from "react";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";

import { AdvisorySearchContext } from "./advisory-context";

interface AdvisoryToolbarProps {
  showFilters?: boolean;
}

export const AdvisoryToolbar: React.FC<AdvisoryToolbarProps> = ({
  showFilters,
}) => {
  const { tableControls } = React.useContext(AdvisorySearchContext);

  const {
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
  } = tableControls;

  return (
    <Toolbar {...toolbarProps} aria-label="advisory-toolbar">
      <ToolbarContent>
        {showFilters && <FilterToolbar {...filterToolbarProps} />}
        <ToolbarItem {...paginationToolbarItemProps}>
          <SimplePagination
            idPrefix="advisory-table"
            isTop
            paginationProps={paginationProps}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
