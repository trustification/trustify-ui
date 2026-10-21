import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

// dateUtils relies on the dayjs plugins (customParseFormat, isSameOrBefore)
// that the app registers globally on the dayjs singleton.
import "@app/dayjs";

import {
  americanDateFormat,
  isInClosedRange,
  isValidAmericanShortDate,
  isValidInterval,
  localizeInterval,
  parseAmericanDate,
  parseInterval,
  toISODateInterval,
} from "./dateUtils";

describe("parseInterval", () => {
  it("splits an ISO interval into two dayjs instances", () => {
    const parsed = parseInterval("2024-01-05/2024-02-10");

    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.format("YYYY-MM-DD")).toBe("2024-01-05");
    expect(parsed[1]?.format("YYYY-MM-DD")).toBe("2024-02-10");
  });

  it("returns a single element array when the interval has no separator", () => {
    const parsed = parseInterval("2024-01-05");

    expect(parsed).toHaveLength(1);
    expect(parsed[1]).toBeUndefined();
  });

  it("returns a single invalid element for an empty string", () => {
    const parsed = parseInterval("");

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.isValid()).toBe(false);
  });
});

describe("isValidInterval", () => {
  it("is truthy for an ascending pair of valid dates", () => {
    expect(
      isValidInterval(parseInterval("2024-01-05/2024-02-10")),
    ).toBeTruthy();
  });

  it("is truthy for a single day range (start === end)", () => {
    expect(
      isValidInterval(parseInterval("2024-01-05/2024-01-05")),
    ).toBeTruthy();
  });

  it("is falsy for a descending pair", () => {
    expect(isValidInterval(parseInterval("2024-02-10/2024-01-05"))).toBeFalsy();
  });

  it("is falsy when the end is missing", () => {
    expect(isValidInterval(parseInterval("2024-01-05"))).toBeFalsy();
  });

  it("is falsy when a date is not parseable as YYYY-MM-DD", () => {
    expect(isValidInterval(parseInterval("01/05/2024/2024-02-10"))).toBeFalsy();
  });
});

describe("isInClosedRange", () => {
  const interval = "2024-01-05/2024-02-10";

  it("returns true for a date strictly inside the range", () => {
    expect(isInClosedRange(interval, "2024-01-20T12:34:56")).toBe(true);
  });

  it("returns true on the inclusive start boundary", () => {
    expect(isInClosedRange(interval, "2024-01-05T00:00:00")).toBe(true);
  });

  it("returns true on the inclusive end boundary, ignoring the time part", () => {
    expect(isInClosedRange(interval, "2024-02-10T23:59:59")).toBe(true);
  });

  it("returns false for a date before the start", () => {
    expect(isInClosedRange(interval, "2024-01-04T23:59:59")).toBe(false);
  });

  it("returns false for a date after the end", () => {
    expect(isInClosedRange(interval, "2024-02-11T00:00:00")).toBe(false);
  });

  it("returns false (without throwing) for an interval with no separator", () => {
    expect(() => isInClosedRange("2024-01-05", "2024-01-05")).not.toThrow();
    expect(isInClosedRange("2024-01-05", "2024-01-05")).toBe(false);
  });

  it("returns false (without throwing) for an empty interval", () => {
    expect(() => isInClosedRange("", "2024-01-05")).not.toThrow();
    expect(isInClosedRange("", "2024-01-05")).toBe(false);
  });

  it("returns false for a descending interval", () => {
    expect(isInClosedRange("2024-02-10/2024-01-05", "2024-01-20")).toBe(false);
  });
});

describe("localizeInterval", () => {
  it("returns the short and full american formats of a valid interval", () => {
    expect(localizeInterval("2024-01-05/2024-02-10")).toEqual([
      "01/05-02/10",
      "01/05/2024-02/10/2024",
    ]);
  });

  it("returns an empty array (without throwing) when there is no separator", () => {
    expect(() => localizeInterval("2024-01-05")).not.toThrow();
    expect(localizeInterval("2024-01-05")).toEqual([]);
  });

  it("returns an empty array for an empty interval", () => {
    expect(localizeInterval("")).toEqual([]);
  });

  it("returns an empty array for a descending interval", () => {
    expect(localizeInterval("2024-02-10/2024-01-05")).toEqual([]);
  });
});

describe("toISODateInterval", () => {
  it("builds an ISO interval from two dates", () => {
    expect(toISODateInterval(new Date(2024, 0, 5), new Date(2024, 1, 10))).toBe(
      "2024-01-05/2024-02-10",
    );
  });

  it("returns undefined when the end is before the start", () => {
    expect(
      toISODateInterval(new Date(2024, 1, 10), new Date(2024, 0, 5)),
    ).toBeUndefined();
  });

  it("treats a missing bound as 'now' (dayjs(undefined) === now)", () => {
    const today = dayjs().format("YYYY-MM-DD");

    expect(toISODateInterval(new Date(2024, 0, 5), undefined)).toBe(
      `2024-01-05/${today}`,
    );
    expect(toISODateInterval()).toBe(`${today}/${today}`);
  });
});

describe("american date helpers", () => {
  it("validates strict MM/DD/YYYY input", () => {
    expect(isValidAmericanShortDate("01/05/2024")).toBe(true);
    expect(isValidAmericanShortDate("2024-01-05")).toBe(false);
    expect(isValidAmericanShortDate("1/5/24")).toBe(false);
  });

  it("formats and parses round trip", () => {
    const date = new Date(2024, 0, 5);
    expect(americanDateFormat(date)).toBe("01/05/2024");
    expect(parseAmericanDate("01/05/2024").getTime()).toBe(date.getTime());
  });
});
