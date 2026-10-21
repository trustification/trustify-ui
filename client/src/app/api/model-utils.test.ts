import type { Score, ScoreType } from "@app/client";

import {
  extractPriorityItemBasedOnScoresType,
  extractPriorityScoreFromScores,
  splitStringAsKeyValue,
} from "./model-utils";

const makeScore = (type: ScoreType, value: number): Score => ({
  type,
  value,
  severity: "medium",
});

describe("splitStringAsKeyValue", () => {
  it("splits a key=value pair", () => {
    expect(splitStringAsKeyValue("type=cyclonedx")).toEqual({
      key: "type",
      value: "cyclonedx",
    });
  });

  it("returns an empty value when there is no '=' separator", () => {
    expect(splitStringAsKeyValue("type")).toEqual({ key: "type", value: "" });
  });

  it("returns an empty key and value for an empty string", () => {
    expect(splitStringAsKeyValue("")).toEqual({ key: "", value: "" });
  });

  it("keeps only the first segment as value when there are extra '=' chars", () => {
    expect(splitStringAsKeyValue("a=b=c")).toEqual({ key: "a", value: "b" });
  });

  it("supports an empty key", () => {
    expect(splitStringAsKeyValue("=v")).toEqual({ key: "", value: "v" });
  });

  it("returns an empty value when the value side is empty", () => {
    expect(splitStringAsKeyValue("k=")).toEqual({ key: "k", value: "" });
  });
});

describe("extractPriorityScoreFromScores", () => {
  it("returns null for an empty list", () => {
    expect(extractPriorityScoreFromScores([])).toBeNull();
  });

  it("returns the only score when there is exactly one", () => {
    const score = makeScore("3.1", 7.5);
    expect(extractPriorityScoreFromScores([score])).toBe(score);
  });

  // Priority order used by compareByScoreTypeFn is ascending:
  // 2.0 (1) < 3.1 (2) < 3.0 (3) < 4.0 (4); the lowest wins.
  it.each([
    { types: ["4.0", "2.0"], expected: "2.0" },
    { types: ["3.0", "3.1"], expected: "3.1" },
    { types: ["4.0", "3.0"], expected: "3.0" },
    { types: ["3.1", "2.0"], expected: "2.0" },
    { types: ["4.0", "3.0", "3.1", "2.0"], expected: "2.0" },
  ] as { types: ScoreType[]; expected: ScoreType }[])(
    "picks $expected out of $types",
    ({ types, expected }) => {
      const scores = types.map((type, i) => makeScore(type, i));
      expect(extractPriorityScoreFromScores(scores)?.type).toBe(expected);
    },
  );

  it("keeps the first of two scores sharing the same type", () => {
    const first = makeScore("3.1", 1);
    const second = makeScore("3.1", 9);
    expect(extractPriorityScoreFromScores([first, second])).toBe(first);
  });

  it("does not mutate the input array", () => {
    const scores = [makeScore("4.0", 9), makeScore("2.0", 1)];
    const snapshot = [...scores];
    extractPriorityScoreFromScores(scores);
    expect(scores).toEqual(snapshot);
  });
});

describe("extractPriorityItemBasedOnScoresType", () => {
  type Item = { id: string; type: ScoreType | null };

  it("returns null for an empty list", () => {
    expect(
      extractPriorityItemBasedOnScoresType<Item>([], (item) => item.type),
    ).toBeNull();
  });

  it("returns the only item when there is exactly one", () => {
    const item: Item = { id: "a", type: "4.0" };
    expect(extractPriorityItemBasedOnScoresType([item], (i) => i.type)).toBe(
      item,
    );
  });

  it("picks the item with the lowest score-type priority", () => {
    const items: Item[] = [
      { id: "a", type: "4.0" },
      { id: "b", type: "3.0" },
      { id: "c", type: "2.0" },
    ];
    expect(extractPriorityItemBasedOnScoresType(items, (i) => i.type)?.id).toBe(
      "c",
    );
  });

  it("treats a null score type as the highest precedence (priority 0)", () => {
    const items: Item[] = [
      { id: "a", type: "2.0" },
      { id: "b", type: null },
    ];
    expect(extractPriorityItemBasedOnScoresType(items, (i) => i.type)?.id).toBe(
      "b",
    );
  });

  it("keeps the first of two items sharing the same score type", () => {
    const items: Item[] = [
      { id: "a", type: "3.1" },
      { id: "b", type: "3.1" },
    ];
    expect(extractPriorityItemBasedOnScoresType(items, (i) => i.type)?.id).toBe(
      "a",
    );
  });

  it("does not mutate the input array", () => {
    const items: Item[] = [
      { id: "a", type: "4.0" },
      { id: "b", type: "2.0" },
    ];
    const snapshot = [...items];
    extractPriorityItemBasedOnScoresType(items, (i) => i.type);
    expect(items).toEqual(snapshot);
  });
});
