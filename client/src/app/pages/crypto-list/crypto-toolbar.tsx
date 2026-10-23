import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { Paths } from "@app/Routes";
import { FilterToolbar } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";

import { CryptoSearchContext } from "./crypto-context";

interface CryptoToolbarProps {
  showFilters?: boolean;
}

/** Toolbar with filters and pagination for the cryptography algorithm list. */
export const CryptoToolbar: React.FC<CryptoToolbarProps> = ({
  showFilters,
}) => {
  const { tableControls } = React.useContext(CryptoSearchContext);
  const navigate = useNavigate();

  const {
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
  } = tableControls;

  return (
    <Toolbar {...toolbarProps} aria-label="crypto-toolbar">
      <ToolbarContent>
        {showFilters && <FilterToolbar {...filterToolbarProps} />}
        <ToolbarItem>
          <Button
            variant="secondary"
            onClick={() => navigate(Paths.cryptographyRemediationUpload)}
          >
            Import Remediation Mappings
          </Button>
        </ToolbarItem>
        <ToolbarItem {...paginationToolbarItemProps}>
          <SimplePagination
            idPrefix="crypto-table"
            isTop
            paginationProps={paginationProps}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
