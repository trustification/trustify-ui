import React from "react";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";

import { SbomSearchContext } from "./sbom-context";

interface SbomToolbarProps {
  showFilters?: boolean;
}

export const SbomToolbar: React.FC<SbomToolbarProps> = ({ showFilters }) => {
  const { tableControls } = React.useContext(SbomSearchContext);

  const {
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
  } = tableControls;

  return (
    <Toolbar {...toolbarProps}>
      <ToolbarContent>
        {showFilters && <FilterToolbar {...filterToolbarProps} />}
        <ToolbarItem {...paginationToolbarItemProps}>
          <SimplePagination
            idPrefix="sbom-table"
            isTop
            paginationProps={paginationProps}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
