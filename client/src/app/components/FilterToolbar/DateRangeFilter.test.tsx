import { Toolbar, ToolbarContent } from "@patternfly/react-core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The date helpers rely on the dayjs plugins the app registers globally.
import "@app/dayjs";

import { DateRangeFilter } from "./DateRangeFilter";
import { FilterType } from "./FilterToolbar";

const category = {
  categoryKey: "published",
  title: "Published",
  type: FilterType.dateRange,
} as const;

const renderFilter = (filterValue: string[] | undefined) =>
  render(
    <Toolbar clearAllFilters={vi.fn()}>
      <ToolbarContent>
        <DateRangeFilter
          category={category}
          filterValue={filterValue}
          setFilterValue={vi.fn()}
          showToolbarItem
        />
      </ToolbarContent>
    </Toolbar>,
  );

const fromInput = () => screen.getByLabelText("Interval start");
const toInput = () => screen.getByLabelText("Interval end");

describe("FilterToolbar DateRangeFilter", () => {
  it("seeds both date pickers from a valid ISO interval", () => {
    renderFilter(["2024-01-05/2024-02-10"]);

    expect(fromInput()).toHaveValue("01/05/2024");
    expect(toInput()).toHaveValue("02/10/2024");
  });

  // Exercises rangeToOption: localizeInterval(range)[1] is the full american
  // range ("01/05/2024-02/10/2024"), which is split on "-" into one label per
  // bound.
  it("renders one toolbar label per bound of a valid interval", () => {
    renderFilter(["2024-01-05/2024-02-10"]);

    expect(screen.getByText("01/05/2024")).toBeInTheDocument();
    expect(screen.getByText("02/10/2024")).toBeInTheDocument();
  });

  it("renders no toolbar labels when the interval is not a valid range", () => {
    renderFilter(["2024-02-10/2024-01-05"]);

    expect(screen.queryByText("02/10/2024")).not.toBeInTheDocument();
    expect(screen.queryByText("01/05/2024")).not.toBeInTheDocument();
  });

  it("leaves both date pickers empty when there is no filter value", () => {
    renderFilter(undefined);

    expect(fromInput()).toHaveValue("");
    expect(toInput()).toHaveValue("");
  });

  // Pins a latent crash: parseInterval returns a 1-element array for an interval
  // with no "/" separator, so `to` is undefined and `to.toDate()` throws a
  // TypeError out of the effect, taking the whole component down.
  it("throws for a malformed interval with no separator", () => {
    expect(() => renderFilter(["2024-01-05"])).toThrow(TypeError);
  });
});
