import { expect as baseExpect } from "@playwright/test";
import type { SearchPageTabs } from "../pages/SearchPageTabs";
import type { MatcherResult } from "./types";

export interface SearchPageTabsMatchers {
  toHaveTabCountAtLeast(minCount: number): Promise<MatcherResult>;
}

type SearchPageTabsMatcherDefinitions = {
  readonly [K in keyof SearchPageTabsMatchers]: (
    receiver: SearchPageTabs,
    ...args: Parameters<SearchPageTabsMatchers[K]>
  ) => Promise<MatcherResult>;
};

export const searchPageTabsAssertions =
  baseExpect.extend<SearchPageTabsMatcherDefinitions>({
    toHaveTabCountAtLeast: async (
      searchPageTabs: SearchPageTabs,
      minCount: number,
    ): Promise<MatcherResult> => {
      try {
        const badge = searchPageTabs.getBadge();

        // Wait until the badge has some text
        await baseExpect(badge).toHaveText(/[\d]/);

        const countText = await badge.textContent();

        // Remove anything that isn't a digit
        const match = countText?.match(/\d+/);
        if (!match) {
          return {
            pass: false,
            message: () =>
              `Could not parse badge count from tab: got "${countText}"`,
          };
        }

        const count = parseInt(match[0], 10);

        if (count < minCount) {
          return {
            pass: false,
            message: () =>
              `Expected tab to have at least ${minCount} results, but got ${count}`,
          };
        }

        return {
          pass: true,
          message: () => `Tab has ${count} results (>= ${minCount})`,
        };
      } catch (error) {
        return {
          pass: false,
          message: () =>
            error instanceof Error ? error.message : String(error),
        };
      }
    },
  });
