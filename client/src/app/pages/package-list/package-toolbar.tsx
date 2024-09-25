import React from "react";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";

import { PackageSearchContext } from "./package-context";

interface IPackageToolbar {}

export const PackageToolbar: React.FC<IPackageToolbar> = ({}) => {
  const { tableControls } = React.useContext(PackageSearchContext);

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
        <FilterToolbar {...filterToolbarProps} />
        <ToolbarItem {...paginationToolbarItemProps}>
          <SimplePagination
            idPrefix="package-table"
            isTop
            paginationProps={paginationProps}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
