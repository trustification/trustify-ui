import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";

import { SbomSearchContext } from "./sbom-context";

interface SbomToolbarProps {
  showFilters?: boolean;
}

export const SbomToolbar: React.FC<SbomToolbarProps> = ({ showFilters }) => {
  const navigate = useNavigate();

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
    <Toolbar {...toolbarProps} aria-label="sbom-toolbar">
      <ToolbarContent>
        {showFilters && (
          <>
            <FilterToolbar {...filterToolbarProps} />
            <ToolbarItem>
              
              <Button variant="secondary" onClick={() => navigate("/sbom-scan")}>Scan SBOM</Button>
            </ToolbarItem>
          </>
        )}
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
