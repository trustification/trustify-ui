import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The date helpers rely on the dayjs plugins the app registers globally.
import "@app/dayjs";

import { FilterType } from "../FilterToolbar";
import { DateRangeFilter } from "./DateRangeFilter";

const category = {
  categoryKey: "published",
  title: "Published",
  type: FilterType.dateRange,
} as const;

const renderFilter = (filterValue: string[] | undefined) =>
  render(
    <DateRangeFilter
      category={category}
      filterValue={filterValue}
      setFilterValue={vi.fn()}
    />,
  );

const fromInput = () => screen.getByLabelText("Interval start");
const toInput = () => screen.getByLabelText("Interval end");

describe("FilterPanel DateRangeFilter", () => {
  it("seeds both date pickers from a valid ISO interval", () => {
    renderFilter(["2024-01-05/2024-02-10"]);

    expect(fromInput()).toHaveValue("01/05/2024");
    expect(toInput()).toHaveValue("02/10/2024");
  });

  it("leaves both date pickers empty when there is no filter value", () => {
    renderFilter(undefined);

    expect(fromInput()).toHaveValue("");
    expect(toInput()).toHaveValue("");
  });

  it("leaves both date pickers empty for an empty filter value list", () => {
    renderFilter([]);

    expect(fromInput()).toHaveValue("");
    expect(toInput()).toHaveValue("");
  });

  // BEHAVIOR CHANGE: parseInterval returns a 1-element array for an interval
  // with no "/" separator, so `to` was undefined and `to.toDate()` threw a
  // TypeError out of the effect, taking the whole component down. It is now a
  // no-op for the missing bound.
  it("renders gracefully for a malformed interval with no separator", () => {
    expect(() => renderFilter(["2024-01-05"])).not.toThrow();

    expect(fromInput()).toHaveValue("01/05/2024");
    expect(toInput()).toHaveValue("");
  });
});
