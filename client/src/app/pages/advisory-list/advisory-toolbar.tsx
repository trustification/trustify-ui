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

import { AdvisorySearchContext } from "./advisory-context";
import { Paths } from "@app/Routes";

interface AdvisoryToolbarProps {
  showFilters?: boolean;
}

export const AdvisoryToolbar: React.FC<AdvisoryToolbarProps> = ({
  showFilters,
}) => {
  const navigate = useNavigate();

  const [_isUploadDrawerExpanded, _setIsUploadDrawerExpandedd] =
    React.useState(false);

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
            onClick={() => navigate(Paths.advisoriesUpload)}
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
