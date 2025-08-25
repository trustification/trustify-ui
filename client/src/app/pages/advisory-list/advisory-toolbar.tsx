import React from "react";

import { useNavigate } from "react-router-dom";

import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import { Paths } from "@app/Routes";

import { AdvisorySearchContext } from "./advisory-context";

interface AdvisoryToolbarProps {
  showFilters?: boolean;
}

export const AdvisoryToolbar: React.FC<AdvisoryToolbarProps> = ({
  showFilters,
}) => {
  const navigate = useNavigate();

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
        <ToolbarItem>
          <Button
            variant="primary"
            onClick={() => navigate(Paths.advisoryUpload)}
          >
            Upload Advisory
          </Button>
        </ToolbarItem>
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
