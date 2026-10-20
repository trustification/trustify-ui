import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MemoryRouter } from "react-router-dom";

import { ReadOnlyContext } from "@app/components/ReadOnlyContext";
import { SbomSearchContext } from "./sbom-context";

import { SbomToolbar } from "./sbom-toolbar";

vi.mock("@app/queries/sbom-groups", () => ({
  useFetchSbomGroups: vi.fn().mockReturnValue({ result: { data: [] } }),
}));

vi.mock("@app/queries/recommendations", () => ({
  useIsRecommendationEnabled: () => true,
}));

const makeControls = (selectedIds: string[] = []) => ({
  tableControls: {
    propHelpers: {
      toolbarProps: {},
      filterToolbarProps: {},
      paginationToolbarItemProps: {},
      paginationProps: {},
    },
  } as never,
  bulkSelection: {
    isEnabled: false,
    controls: {
      selectedItems: selectedIds.map((id) => ({ id })),
      propHelpers: { toolbarBulkSelectorProps: {} },
    },
  } as never,
});

const renderToolbar = (selectedIds: string[] = []) =>
  render(
    <MemoryRouter>
      <ReadOnlyContext.Provider
        value={{ isLoading: false, areMutationsDisabled: false }}
      >
        <SbomSearchContext.Provider value={makeControls(selectedIds) as never}>
          <SbomToolbar showActions />
        </SbomSearchContext.Provider>
      </ReadOnlyContext.Provider>
    </MemoryRouter>,
  );

describe("SbomToolbar – Generate remediation report button", () => {
  it("is disabled when no SBOMs are selected", () => {
    // Given the toolbar with no selection
    renderToolbar([]);

    // Then the button is present but disabled
    const btn = screen.getByRole("button", {
      name: /Generate remediation report/i,
    });
    expect(btn).toBeDisabled();
  });

  it("is enabled when one or more SBOMs are selected within the limit", () => {
    // Given the toolbar with 3 SBOMs selected (below the cap)
    renderToolbar(["id-1", "id-2", "id-3"]);

    // Then the button is enabled
    const btn = screen.getByRole("button", {
      name: /Generate remediation report/i,
    });
    expect(btn).not.toBeDisabled();
  });

  it("is aria-disabled with a tooltip when selection exceeds the configured limit", () => {
    // Given the toolbar with more SBOMs selected than the max allowed
    const ids = Array.from({ length: 11 }, (_, i) => `id-${i}`);
    renderToolbar(ids);

    // Then the button is aria-disabled (rendered via Tooltip + isAriaDisabled)
    const btn = screen.getByRole("button", {
      name: /Generate remediation report/i,
    });
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });
});
