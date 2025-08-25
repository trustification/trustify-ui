import { expect } from "@playwright/test";

export const sortArray = (arr: string[], asc: boolean) => {
  let sorted = [...arr].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
  if (!asc) {
    sorted = sorted.reverse();
  }
  const isSorted = arr.every((val, i) => val === sorted[i]);
  return {
    isSorted,
    sorted,
  };
};

export const expectSort = (arr: string[], asc: boolean) => {
  const { isSorted, sorted } = sortArray(arr, asc);
  expect(
    isSorted,
    `Received: ${arr.join(", ")} \nExpected: ${sorted.join(", ")}`,
  ).toBe(true);
};
