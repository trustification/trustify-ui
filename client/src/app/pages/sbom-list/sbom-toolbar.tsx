import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  DropdownItem,
  Tooltip,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import type { Group } from "@app/client";
import { FilterToolbar } from "@app/components/FilterToolbar";
import { KebabDropdown } from "@app/components/KebabDropdown";
import { ReadOnlyButton } from "@app/components/ReadOnlyButton";
import { ReadOnlyContext } from "@app/components/ReadOnlyContext";
import { SimplePagination } from "@app/components/SimplePagination";
import { ToolbarBulkSelector } from "@app/components/ToolbarBulkSelector";
import { useIsRecommendationEnabled } from "@app/queries/recommendations";
import { Paths } from "@app/Routes";

import { AddToGroupModal } from "./components/add-to-group-form";
import { GroupFormModal } from "../sbom-groups/components/group-form";
import { SbomSearchContext } from "./sbom-context";

/** Maximum number of SBOMs that can be selected for a remediation report. The server enforces the actual purl limit via 413. */
const MAX_REMEDIATION_REPORT_SBOMS = 10;

interface SbomToolbarProps {
  showFilters?: boolean;
  showActions?: boolean;
}

export const SbomToolbar: React.FC<SbomToolbarProps> = ({
  showFilters,
  showActions,
}) => {
  const navigate = useNavigate();
  const { areMutationsDisabled } = React.useContext(ReadOnlyContext);
  const isRecommendationEnabled = useIsRecommendationEnabled();

  // Create Form Modal
  const [saveGroupModalState, setSaveGroupModalState] = React.useState<
    "create" | Group | null
  >(null);
  const isCreateUpdateGroupModalOpen = saveGroupModalState !== null;
  const createUpdateGroup =
    saveGroupModalState !== "create" ? saveGroupModalState : null;

  // Add to group Modal
  const [isAddToGroupModalOpen, setIsAddToGroupModalOpen] =
    React.useState(false);

  // Table controls

  const {
    tableControls,
    bulkSelection: {
      isEnabled: showBulkSelector,
      controls: bulkSelectionControls,
    },
  } = React.useContext(SbomSearchContext);

  const {
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
    },
  } = tableControls;

  const {
    selectedItems,
    propHelpers: { toolbarBulkSelectorProps },
  } = bulkSelectionControls;

  return (
    <>
      <Toolbar {...toolbarProps} aria-label="sbom-toolbar">
        <ToolbarContent>
          {showBulkSelector && (
            <ToolbarBulkSelector {...toolbarBulkSelectorProps} />
          )}
          {showFilters && <FilterToolbar {...filterToolbarProps} />}
          {showActions && (
            <>
              <ToolbarItem>
                <ReadOnlyButton
                  variant="primary"
                  onClick={() => setSaveGroupModalState("create")}
                >
                  Create group
                </ReadOnlyButton>
              </ToolbarItem>
              <ToolbarItem>
                <ReadOnlyButton
                  variant="secondary"
                  isDisabled={selectedItems.length === 0}
                  onClick={() => setIsAddToGroupModalOpen(true)}
                >
                  Add to group
                </ReadOnlyButton>
              </ToolbarItem>
              <ToolbarItem>
                <KebabDropdown
                  ariaLabel="SBOM actions"
                  dropdownItems={[
                    <DropdownItem
                      key="upload-sbom"
                      component="button"
                      isDisabled={areMutationsDisabled}
                      onClick={() => navigate(Paths.sbomUpload)}
                    >
                      Upload SBOM
                    </DropdownItem>,
                    <DropdownItem
                      key="scan-sbom"
                      component="button"
                      onClick={() => navigate(Paths.sbomScan)}
                    >
                      Generate vulnerability report
                    </DropdownItem>,
                  ]}
                />
              </ToolbarItem>
              {isRecommendationEnabled && (
                <ToolbarItem>
                  {selectedItems.length > MAX_REMEDIATION_REPORT_SBOMS ? (
                    <Tooltip
                      content={`Select at most ${MAX_REMEDIATION_REPORT_SBOMS} SBOMs to generate a remediation report.`}
                    >
                      <Button variant="secondary" isAriaDisabled>
                        Generate remediation report
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="secondary"
                      isDisabled={selectedItems.length === 0}
                      onClick={() => {
                        const ids = selectedItems.map((s) => s.id).join(",");
                        navigate(`${Paths.remediationReport}?ids=${ids}`);
                      }}
                    >
                      Generate remediation report
                    </Button>
                  )}
                </ToolbarItem>
              )}
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

      <GroupFormModal
        isOpen={isCreateUpdateGroupModalOpen}
        group={createUpdateGroup}
        onClose={() => setSaveGroupModalState(null)}
      />
      <AddToGroupModal
        sboms={selectedItems}
        isOpen={isAddToGroupModalOpen}
        onClose={() => setIsAddToGroupModalOpen(false)}
      />
    </>
  );
};
