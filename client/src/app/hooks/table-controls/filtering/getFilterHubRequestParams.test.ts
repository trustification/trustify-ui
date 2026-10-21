import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import "@app/dayjs";
import type { HubFilter } from "@app/api/models";
import { FILTER_NULL_VALUE } from "@app/Constants";
import { type FilterCategory, FilterType } from "@app/components/FilterToolbar";

import {
  getFilterHubRequestParams,
  serializeFilterForHub,
  serializeFilterRequestParamsForHub,
  wrapAndEscape,
} from "./getFilterHubRequestParams";

/**
 * Minimal stand-in for the rows the table controls operate on. The filtering
 * code under test never inspects the item, only the filter categories.
 */
interface TestItem {
  name: string;
}

type Key = string;

const category = (
  partial: Partial<FilterCategory<TestItem, Key>> &
    Pick<FilterCategory<TestItem, Key>, "categoryKey" | "type">,
): FilterCategory<TestItem, Key> =>
  ({
    title: partial.categoryKey,
    ...partial,
  }) as FilterCategory<TestItem, Key>;

/** ISO string dayjs produces for a date-only value, in the ambient timezone. */
const isoFor = (date: string) => dayjs(date, "YYYY-MM-DD", true).toISOString();

describe("getFilterHubRequestParams - early returns", () => {
  it("returns an empty object when nothing is provided", () => {
    expect(getFilterHubRequestParams<TestItem>({})).toEqual({});
  });

  it("returns an empty object when filterValues is empty and there are no implicit filters", () => {
    expect(
      getFilterHubRequestParams<TestItem>({
        filterState: { filterValues: {}, setFilterValues: () => {} },
        filterCategories: [
          category({ categoryKey: "name", type: FilterType.search }),
        ],
      }),
    ).toEqual({});
  });

  it("returns an empty object when filter values exist but no filterCategories are given", () => {
    expect(
      getFilterHubRequestParams<TestItem>({
        filterState: {
          filterValues: { name: ["foo"] },
          setFilterValues: () => {},
        },
      }),
    ).toEqual({});
  });

  it("returns only the implicit filters when there is no filter state", () => {
    const implicit: HubFilter[] = [
      { field: "sbom_id", operator: "=", value: "abc" },
    ];
    expect(
      getFilterHubRequestParams<TestItem>({ implicitFilters: implicit }),
    ).toEqual({ filters: [{ field: "sbom_id", operator: "=", value: "abc" }] });
  });

  it("appends implicit filters after the filters derived from filter state", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: ["foo"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "name", type: FilterType.search }),
      ],
      implicitFilters: [{ field: "sbom_id", operator: "=", value: "abc" }],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "~", value: "foo" },
      { field: "sbom_id", operator: "=", value: "abc" },
    ]);
  });
});

describe("getFilterHubRequestParams - search", () => {
  it("builds a `~` filter keyed by categoryKey", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "name", type: FilterType.search }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "~", value: "log4j" },
    ]);
  });

  it("uses serverFilterField when provided", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { filterText: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "filterText",
          type: FilterType.search,
          serverFilterField: "name",
        }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "~", value: "log4j" },
    ]);
  });

  it("prefers the static `operator` over the `~` default", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "name",
          type: FilterType.search,
          operator: "=",
        }),
      ],
    });
    expect(result.filters?.[0]?.operator).toBe("=");
  });

  it("falls back to getOperator, which receives the server filter value", () => {
    const seen: unknown[] = [];
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "name",
          type: FilterType.search,
          getOperator: (filterValue) => {
            seen.push(filterValue);
            return "!=";
          },
        }),
      ],
    });
    expect(result.filters?.[0]?.operator).toBe("!=");
    expect(seen).toEqual([["log4j"]]);
  });

  it("uses getServerFilterValue to replace the UI value", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "name",
          type: FilterType.search,
          getServerFilterValue: (filterValue) => [
            `${filterValue?.[0]}-transformed`,
          ],
        }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "~", value: "log4j-transformed" },
    ]);
  });

  it("falls back to the UI value when getServerFilterValue returns undefined", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "name",
          type: FilterType.search,
          getServerFilterValue: () => undefined,
        }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "~", value: "log4j" },
    ]);
  });

  it("emits no filter for an empty value array (existing guard)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "name", type: FilterType.search }),
      ],
    });
    expect(result.filters).toEqual([]);
  });

  it("emits no filter for an empty-string value (existing guard)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { name: [""] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "name", type: FilterType.search }),
      ],
    });
    expect(result.filters).toEqual([]);
  });
});

describe("getFilterHubRequestParams - numsearch", () => {
  it("coerces the value to a number and defaults the operator to `=`", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { score: ["7"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "score", type: FilterType.numsearch }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "score", operator: "=", value: 7 },
    ]);
  });

  it("produces NaN for a non-numeric value (current behavior)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { score: ["abc"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "score", type: FilterType.numsearch }),
      ],
    });
    expect(result.filters?.[0]?.value).toBeNaN();
  });

  it("emits no filter for an empty value array (existing guard)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { score: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "score", type: FilterType.numsearch }),
      ],
    });
    expect(result.filters).toEqual([]);
  });
});

describe("getFilterHubRequestParams - select", () => {
  it("builds an `=` filter from the first value", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { status: ["affected"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "status", type: FilterType.select }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "status", operator: "=", value: "affected" },
    ]);
  });

  it("ignores every value after the first", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { status: ["affected", "fixed"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "status", type: FilterType.select }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "status", operator: "=", value: "affected" },
    ]);
  });

  it("honours operator / getOperator / serverFilterField", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { status: ["affected"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "status",
          type: FilterType.select,
          serverFilterField: "average_severity",
          getOperator: () => "!=",
        }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "average_severity", operator: "!=", value: "affected" },
    ]);
  });

  it("keeps FILTER_NULL_VALUE, which is a non-empty string", () => {
    // FILTER_NULL_VALUE is "\0" (the "Unknown" option in several providers).
    // It must survive the empty-value guard.
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { severity: [FILTER_NULL_VALUE] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "severity", type: FilterType.select }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "severity", operator: "=", value: FILTER_NULL_VALUE },
    ]);
  });

  // BEHAVIOR CHANGE: this previously emitted
  // `{ field: "status", operator: "=", value: undefined }`, which violates the
  // HubFilter type and makes serializeFilterForHub throw if called directly. The
  // `select` branch now guards on `serverFilterValue[0]` like `search` always has.
  it("emits no filter for an empty value array", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { status: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "status", type: FilterType.select }),
      ],
    });
    expect(result.filters).toEqual([]);
  });

  // BEHAVIOR CHANGE: this previously emitted
  // `{ field: "status", operator: "=", value: "" }`, which serialized to the
  // meaningless query fragment `status=`. Matches how `search` treats "".
  it("emits no filter for an empty-string value", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { status: [""] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "status", type: FilterType.select }),
      ],
    });
    expect(result.filters).toEqual([]);
  });
});

describe("getFilterHubRequestParams - multiselect", () => {
  it("builds an OR list by default", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { severity: ["high", "critical"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "severity", type: FilterType.multiselect }),
      ],
    });
    expect(result.filters).toEqual([
      {
        field: "severity",
        operator: "=",
        value: { list: ["high", "critical"], operator: "OR" },
      },
    ]);
  });

  it("honours an explicit AND logicOperator", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { label: ["a", "b"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "label",
          type: FilterType.multiselect,
          logicOperator: "AND",
        } as Partial<FilterCategory<TestItem, Key>> & {
          categoryKey: Key;
          type: FilterType;
        }),
      ],
    });
    expect(result.filters).toEqual([
      {
        field: "label",
        operator: "=",
        value: { list: ["a", "b"], operator: "AND" },
      },
    ]);
  });

  it("treats asyncMultiselect the same as multiselect", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { purl: ["pkg:npm/a"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "purl", type: FilterType.asyncMultiselect }),
      ],
    });
    expect(result.filters).toEqual([
      {
        field: "purl",
        operator: "=",
        value: { list: ["pkg:npm/a"], operator: "OR" },
      },
    ]);
  });

  it("still emits a filter with an empty list for an empty value array (current behavior)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { severity: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "severity", type: FilterType.multiselect }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "severity", operator: "=", value: { list: [], operator: "OR" } },
    ]);
  });
});

describe("getFilterHubRequestParams - dateRange", () => {
  it("emits a `>` and a `<` filter for a full interval", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { published: ["2024-01-01/2024-02-01"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "published", type: FilterType.dateRange }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "published", operator: ">", value: isoFor("2024-01-01") },
      { field: "published", operator: "<", value: isoFor("2024-02-01") },
    ]);
  });

  it("emits only the `>` filter when the interval has no end", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { published: ["2024-01-01"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "published", type: FilterType.dateRange }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "published", operator: ">", value: isoFor("2024-01-01") },
    ]);
  });

  it("uses serverFilterField for both bounds", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { dateRange: ["2024-01-01/2024-02-01"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "dateRange",
          type: FilterType.dateRange,
          serverFilterField: "published",
        }),
      ],
    });
    expect(result.filters?.map((f) => f.field)).toEqual([
      "published",
      "published",
    ]);
  });

  it("emits no filter for an empty value array", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { published: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "published", type: FilterType.dateRange }),
      ],
    });
    expect(result.filters).toEqual([]);
  });

  // BEHAVIOR CHANGE: this previously threw `RangeError: Invalid time value`.
  // parseInterval("") returns a single *invalid* dayjs, which is still truthy,
  // so the `if (start)` guard passed and `start.toISOString()` blew up. The
  // `dateRange` branch now guards on `serverFilterValue[0]`.
  it("emits no filter for an empty-string interval", () => {
    const run = () =>
      getFilterHubRequestParams<TestItem>({
        filterState: {
          filterValues: { published: [""] },
          setFilterValues: () => {},
        },
        filterCategories: [
          category({ categoryKey: "published", type: FilterType.dateRange }),
        ],
      });
    expect(run).not.toThrow();
    expect(run().filters).toEqual([]);
  });
});

describe("getFilterHubRequestParams - toggle", () => {
  it("builds an `=` filter from the first value", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { publishedOnly: ["true"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "publishedOnly", type: FilterType.toggle }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "publishedOnly", operator: "=", value: "true" },
    ]);
  });

  it("passes the SERVER filter value (not the UI value) to getOperator", () => {
    // Mirrors the shape used by vulnerability-provider's "Published only"
    // toggle: getServerFilterValue replaces the UI value entirely, so
    // getOperator never sees the "true"/"false" the user toggled.
    const seen: unknown[] = [];
    const toggleCategory = category({
      categoryKey: "publishedOnly",
      type: FilterType.toggle,
      serverFilterField: "published",
      getServerFilterValue: () => ["NULL"],
      getOperator: (filterValue) => {
        seen.push(filterValue);
        return filterValue?.[0] === "true" ? "=" : "!=";
      },
    });

    expect(
      getFilterHubRequestParams<TestItem>({
        filterState: {
          filterValues: { publishedOnly: ["true"] },
          setFilterValues: () => {},
        },
        filterCategories: [toggleCategory],
      }).filters,
    ).toEqual([{ field: "published", operator: "!=", value: "NULL" }]);
    expect(seen).toEqual([["NULL"]]);
  });

  // BEHAVIOR CHANGE: this previously emitted
  // `{ field: "publishedOnly", operator: "=", value: undefined }`.
  // The `toggle` branch now guards on `serverFilterValue[0]`.
  it("emits no filter for an empty value array", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { publishedOnly: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "publishedOnly", type: FilterType.toggle }),
      ],
    });
    expect(result.filters).toEqual([]);
  });
});

describe("getFilterHubRequestParams - other categories", () => {
  it("emits no filter for autocompleteLabel", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { labels: ["a=b"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "labels",
          type: FilterType.autocompleteLabel,
        }),
      ],
    });
    expect(result.filters).toEqual([]);
  });

  it("stops processing remaining categories when a value is null (current `break` behavior)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { empty: null, name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "empty", type: FilterType.search }),
        category({ categoryKey: "name", type: FilterType.search }),
      ],
    });
    expect(result.filters).toEqual([]);
  });

  it("stops processing remaining categories when a category definition is missing", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { unknown: ["x"], name: ["log4j"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "name", type: FilterType.search }),
      ],
    });
    expect(result.filters).toEqual([]);
  });
});

describe("getFilterHubRequestParams - merging filters on the same field", () => {
  it("merges two scalar filters on the same field into an AND list", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { nameA: ["foo"], nameB: ["bar"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "nameA",
          type: FilterType.search,
          serverFilterField: "name",
        }),
        category({
          categoryKey: "nameB",
          type: FilterType.search,
          serverFilterField: "name",
        }),
      ],
    });
    expect(result.filters).toEqual([
      {
        field: "name",
        operator: "~",
        value: { list: ["foo", "bar"], operator: "AND" },
      },
    ]);
  });

  it("merges a third filter into the existing AND list", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { a: ["1"], b: ["2"], c: ["3"] },
        setFilterValues: () => {},
      },
      filterCategories: ["a", "b", "c"].map((key) =>
        category({
          categoryKey: key,
          type: FilterType.search,
          serverFilterField: "name",
        }),
      ),
    });
    expect(result.filters).toEqual([
      {
        field: "name",
        operator: "~",
        value: { list: ["1", "2", "3"], operator: "AND" },
      },
    ]);
  });

  it("does not merge filters that use different operators", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { a: ["1"], b: ["2"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "a",
          type: FilterType.search,
          serverFilterField: "name",
          operator: "~",
        }),
        category({
          categoryKey: "b",
          type: FilterType.search,
          serverFilterField: "name",
          operator: "=",
        }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "~", value: "1" },
      { field: "name", operator: "=", value: "2" },
    ]);
  });

  it("does not merge when the new filter is itself a list (multiselect)", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { a: ["1"], b: ["2", "3"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "a",
          type: FilterType.select,
          serverFilterField: "name",
        }),
        category({
          categoryKey: "b",
          type: FilterType.multiselect,
          serverFilterField: "name",
        }),
      ],
    });
    expect(result.filters).toEqual([
      { field: "name", operator: "=", value: "1" },
      {
        field: "name",
        operator: "=",
        value: { list: ["2", "3"], operator: "OR" },
      },
    ]);
  });

  it("does not merge a scalar into an existing OR list", () => {
    const result = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { a: ["1", "2"], b: ["3"] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "a",
          type: FilterType.multiselect,
          serverFilterField: "name",
        }),
        category({
          categoryKey: "b",
          type: FilterType.select,
          serverFilterField: "name",
        }),
      ],
    });
    expect(result.filters).toEqual([
      {
        field: "name",
        operator: "=",
        value: { list: ["1", "2"], operator: "OR" },
      },
      { field: "name", operator: "=", value: "3" },
    ]);
  });
});

describe("wrapAndEscape", () => {
  it("passes a plain string through untouched", () => {
    expect(wrapAndEscape("log4j")).toBe("log4j");
  });

  it("stringifies numbers", () => {
    expect(wrapAndEscape(7)).toBe("7");
  });

  it.each([
    ["a=b", "a\\=b"],
    ["a~b", "a\\~b"],
    ["a<b", "a\\<b"],
    ["a>b", "a\\>b"],
  ])("escapes the operator character in %s", (input, expected) => {
    expect(wrapAndEscape(input)).toBe(expected);
  });

  it("only escapes the FIRST occurrence of each operator character (current behavior)", () => {
    expect(wrapAndEscape("a=b=c")).toBe("a\\=b=c");
  });
});

describe("serializeFilterForHub", () => {
  it("serializes a string value", () => {
    expect(
      serializeFilterForHub({ field: "name", operator: "~", value: "log4j" }),
    ).toBe("name~log4j");
  });

  it("wraps a number value in quotes", () => {
    expect(
      serializeFilterForHub({ field: "score", operator: "=", value: 7 }),
    ).toBe('score="7"');
  });

  it("joins an OR list with `|`", () => {
    expect(
      serializeFilterForHub({
        field: "severity",
        operator: "=",
        value: { list: ["high", "critical"], operator: "OR" },
      }),
    ).toBe("severity=high|critical");
  });

  it("joins an AND list with `,`", () => {
    expect(
      serializeFilterForHub({
        field: "name",
        operator: "~",
        value: { list: ["foo", "bar"], operator: "AND" },
      }),
    ).toBe("name~foo,bar");
  });

  it("joins a list with no operator with `,`", () => {
    expect(
      serializeFilterForHub({
        field: "name",
        operator: "~",
        value: { list: ["foo", "bar"] },
      }),
    ).toBe("name~foo,bar");
  });

  it("emits only the value when the field is empty", () => {
    expect(
      serializeFilterForHub({ field: "", operator: "~", value: "log4j" }),
    ).toBe("log4j");
  });

  it("escapes operator characters inside list entries", () => {
    expect(
      serializeFilterForHub({
        field: "label",
        operator: "=",
        value: { list: ["a=1", "b=2"], operator: "OR" },
      }),
    ).toBe("label=a\\=1|b\\=2");
  });

  it("throws a TypeError for a filter whose value is undefined", () => {
    const malformed = {
      field: "status",
      operator: "=",
      value: undefined,
    } as unknown as HubFilter;
    expect(() => serializeFilterForHub(malformed)).toThrow(TypeError);
  });
});

describe("serializeFilterRequestParamsForHub", () => {
  it("does nothing when there are no filters", () => {
    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub({}, params);
    expect(params.toString()).toBe("");
  });

  it("appends an empty q for an empty filter array", () => {
    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub({ filters: [] }, params);
    expect(params.get("q")).toBe("");
  });

  it("sorts filters by field and joins them with `&`", () => {
    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(
      {
        filters: [
          { field: "name", operator: "~", value: "log4j" },
          { field: "average_severity", operator: "=", value: "high" },
        ],
      },
      params,
    );
    expect(params.get("q")).toBe("average_severity=high&name~log4j");
  });

  it("drops filters whose value is an empty list", () => {
    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(
      {
        filters: [
          { field: "severity", operator: "=", value: { list: [] } },
          { field: "name", operator: "~", value: "log4j" },
        ],
      },
      params,
    );
    expect(params.get("q")).toBe("name~log4j");
  });

  it("drops filters whose value is undefined", () => {
    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(
      {
        filters: [
          {
            field: "status",
            operator: "=",
            value: undefined,
          } as unknown as HubFilter,
          { field: "name", operator: "~", value: "log4j" },
        ],
      },
      params,
    );
    expect(params.get("q")).toBe("name~log4j");
  });

  it("keeps an empty-string value", () => {
    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(
      { filters: [{ field: "name", operator: "~", value: "" }] },
      params,
    );
    expect(params.get("q")).toBe("name~");
  });
});

describe("end-to-end: getFilterHubRequestParams -> serializeFilterRequestParamsForHub", () => {
  it("serializes a realistic mix of filter types", () => {
    const deserialized = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: {
          filterText: ["log4j"],
          average_severity: ["high", "critical"],
          published: ["2024-01-01/2024-02-01"],
        },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "filterText",
          type: FilterType.search,
          serverFilterField: "name",
        }),
        category({
          categoryKey: "average_severity",
          type: FilterType.multiselect,
        }),
        category({ categoryKey: "published", type: FilterType.dateRange }),
      ],
    });

    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(deserialized, params);
    expect(params.get("q")).toBe(
      [
        "average_severity=high|critical",
        "name~log4j",
        `published>${isoFor("2024-01-01")},published<${isoFor("2024-02-01")}`
          .split(",")
          .join("&"),
      ].join("&"),
    );
  });

  it("produces no query fragment for a select filter with no value", () => {
    const deserialized = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { status: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({ categoryKey: "status", type: FilterType.select }),
      ],
    });

    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(deserialized, params);
    expect(params.get("q")).toBe("");
  });

  // BEHAVIOR CHANGE: two empty `select` filters sharing a serverFilterField
  // used to be merged by pushOrMergeFilter into
  // `{ list: [undefined, undefined], operator: "AND" }`, which passed the
  // `list.length > 0` guard in serializeFilterRequestParamsForHub and shipped
  // the literal query fragment `status=undefined,undefined` to the API.
  it("emits no `undefined` literals when two empty select filters share a field", () => {
    const deserialized = getFilterHubRequestParams<TestItem>({
      filterState: {
        filterValues: { a: [], b: [] },
        setFilterValues: () => {},
      },
      filterCategories: [
        category({
          categoryKey: "a",
          type: FilterType.select,
          serverFilterField: "status",
        }),
        category({
          categoryKey: "b",
          type: FilterType.select,
          serverFilterField: "status",
        }),
      ],
    });

    const params = new URLSearchParams();
    serializeFilterRequestParamsForHub(deserialized, params);
    expect(params.get("q")).toBe("");
  });
});
