import React from "react";

import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import UploadIcon from "@patternfly/react-icons/dist/esm/icons/upload-icon";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";

import { UploadDrawer } from "./components/UploadDrawer";
import { SbomSearchContext } from "./sbom-context";

interface SbomToolbarProps {
  showFilters?: boolean;
}

export const SbomToolbar: React.FC<SbomToolbarProps> = ({ showFilters }) => {
  const [isUploadDrawerExpanded, setIsUploadDrawerExpanded] =
    React.useState(false);

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
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          {showFilters && <FilterToolbar {...filterToolbarProps} />}
          <ToolbarItem>
            <Button
              variant="control"
              icon={<UploadIcon />}
              onClick={() => setIsUploadDrawerExpanded(true)}
            >
              Upload
            </Button>
          </ToolbarItem>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="sbom-table"
              isTop
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <UploadDrawer
        isExpanded={isUploadDrawerExpanded}
        onCloseClick={() => setIsUploadDrawerExpanded(false)}
      />
    </>
  );
};
