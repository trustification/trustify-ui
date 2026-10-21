import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Toolbar, ToolbarContent } from "@patternfly/react-core";

import {
  type FilterSelectOptionProps,
  FilterType,
  type IMultiselectFilterCategory,
} from "./FilterToolbar";

import { MultiselectFilterControl } from "./MultiselectFilterControl";

/**
 * Options spread over two explicit groups plus one option with no `groupLabel`
 * (which falls back to the category title, "Severity").
 */
const groupedOptions: FilterSelectOptionProps[] = [
  { value: "a", label: "Alpha", groupLabel: "Group One" },
  { value: "b", label: "Beta", groupLabel: "Group One" },
  { value: "c", label: "Gamma", groupLabel: "Group Two" },
  { value: "d", label: "Delta" },
];

const makeCategory = (
  selectOptions: FilterSelectOptionProps[],
): IMultiselectFilterCategory<{ id: string }, string> => ({
  categoryKey: "severity",
  title: "Severity",
  type: FilterType.multiselect,
  selectOptions,
});

const renderControl = (
  filterValue: string[] | null,
  selectOptions: FilterSelectOptionProps[] = groupedOptions,
) => {
  const setFilterValue = vi.fn();
  const utils = render(
    <Toolbar id="test-toolbar" clearAllFilters={() => {}}>
      <ToolbarContent>
        <MultiselectFilterControl
          category={makeCategory(selectOptions)}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          showToolbarItem
        />
      </ToolbarContent>
    </Toolbar>,
  );
  return { ...utils, setFilterValue };
};

const clearLabelGroup = (groupName: string) => {
  const button = screen.getByRole("button", {
    name: new RegExp(`Close label group ${groupName}$`),
  });
  fireEvent.click(button);
};

describe("MultiselectFilterControl – label group rendering", () => {
  it("uses the first option group as the primary toolbar filter group", () => {
    // Given selections across every group
    const { container } = renderControl(["a", "b", "c", "d"]);

    // Then the primary ToolbarFilter is keyed on the first option group
    expect(
      container.querySelector('[id="filter-control-severity-Group One"]'),
    ).not.toBeNull();

    // And every group (first + others) is rendered as its own label group
    for (const groupName of ["Group One", "Group Two", "Severity"]) {
      expect(
        screen.getByRole("button", {
          name: new RegExp(`Close label group ${groupName}$`),
        }),
      ).toBeInTheDocument();
    }

    // And each chip lands in its own group
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
    expect(screen.getByText("Delta")).toBeInTheDocument();
  });

  it("falls back to the category title when no option declares a group", () => {
    // Given options that carry no groupLabel at all
    const { container } = renderControl(
      ["a"],
      [{ value: "a", label: "Alpha" }],
    );

    // Then the only group is the category title
    expect(
      container.querySelector('[id="filter-control-severity-Severity"]'),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: /Close label group Severity$/ }),
    ).toBeInTheDocument();
  });
});

describe("MultiselectFilterControl – clearing a label group", () => {
  it("removes only the selections belonging to the first group", () => {
    // Given all four options selected
    const { setFilterValue } = renderControl(["a", "b", "c", "d"]);

    // When the "Group One" label group is cleared
    clearLabelGroup("Group One");

    // Then only Group One's values are dropped
    expect(setFilterValue).toHaveBeenCalledWith(["c", "d"]);
  });

  it("removes only the selections belonging to a non-first group", () => {
    // Given all four options selected
    const { setFilterValue } = renderControl(["a", "b", "c", "d"]);

    // When the "Group Two" label group is cleared
    clearLabelGroup("Group Two");

    // Then only Group Two's value is dropped
    expect(setFilterValue).toHaveBeenCalledWith(["a", "b", "d"]);
  });

  it("removes only the ungrouped selections when the default group is cleared", () => {
    // Given all four options selected
    const { setFilterValue } = renderControl(["a", "b", "c", "d"]);

    // When the default group (the category title) is cleared
    clearLabelGroup("Severity");

    // Then only the option without a groupLabel is dropped
    expect(setFilterValue).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("also drops selected values that match no known option", () => {
    // Given a selection containing a value that is not in selectOptions
    const { setFilterValue } = renderControl(["a", "unknown", "c"]);

    // When any label group is cleared
    clearLabelGroup("Group One");

    // Then the unknown value is dropped too (it has no option to group it by)
    expect(setFilterValue).toHaveBeenCalledWith(["c"]);
  });
});
