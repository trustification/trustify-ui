import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Toolbar, ToolbarContent } from "@patternfly/react-core";

import {
  type FilterSelectOptionProps,
  FilterType,
  type ISelectFilterCategory,
} from "./FilterToolbar";

import { SelectFilterControl } from "./SelectFilterControl";

const defaultOptions: FilterSelectOptionProps[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "bare" },
];

const makeCategory = (
  selectOptions: FilterSelectOptionProps[],
): ISelectFilterCategory<{ id: string }, string> => ({
  categoryKey: "severity",
  title: "Severity",
  type: FilterType.select,
  selectOptions,
});

const renderControl = (
  filterValue: string[] | null,
  selectOptions: FilterSelectOptionProps[] = defaultOptions,
) => {
  const setFilterValue = vi.fn();
  const utils = render(
    <Toolbar id="test-toolbar" clearAllFilters={() => {}}>
      <ToolbarContent>
        <SelectFilterControl
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

const toggle = () => screen.getByRole("button", { name: "Select" });

describe("SelectFilterControl – toggle display text", () => {
  it("shows 'Any' when nothing is selected", () => {
    // Given no filter value
    renderControl(null);

    // Then the toggle shows the placeholder text
    expect(toggle()).toHaveTextContent("Any");
  });

  it("shows 'Any' when the filter value is an empty array", () => {
    // Given an empty selection
    renderControl([]);

    // Then the toggle still shows the placeholder text
    expect(toggle()).toHaveTextContent("Any");
  });

  it("shows the matching option's label for a single selection", () => {
    // Given a selected value that matches an option with a label
    renderControl(["critical"]);

    // Then the toggle shows that option's label, not its raw value
    expect(toggle()).toHaveTextContent("Critical");
  });

  it("falls back to the raw value when no option matches", () => {
    // Given a selected value that is not among the options
    renderControl(["not-an-option"]);

    // Then the toggle shows the raw selected key
    expect(toggle()).toHaveTextContent("not-an-option");
  });

  it("falls back to the raw value when the matching option has no label", () => {
    // Given a selected value whose option declares no label
    renderControl(["bare"]);

    // Then the toggle shows the raw selected key
    expect(toggle()).toHaveTextContent("bare");
  });

  it("shows only the first selection when several values are set", () => {
    // Given more than one selected value
    renderControl(["high", "critical"]);

    // Then the toggle shows the first one's label
    expect(toggle()).toHaveTextContent("High");
    expect(toggle()).not.toHaveTextContent("Critical");
  });
});
