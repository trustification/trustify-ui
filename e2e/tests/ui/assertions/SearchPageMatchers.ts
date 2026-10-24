import { expect as baseExpect } from "@playwright/test";
import type { SearchPage } from "../pages/search-page/SearchPage";
import type { MatcherResult } from "./types";

export interface SearchPageMatchers {
  toHaveAutoFillHidden(): Promise<MatcherResult>;
  toHaveRelevantAutoFillResults(searchText: string): Promise<MatcherResult>;
  toHaveAutoFillCategoriesWithinLimit(limit: number): Promise<MatcherResult>;
}

type SearchPageMatcherDefinitions = {
  readonly [K in keyof SearchPageMatchers]: (
    receiver: SearchPage,
    ...args: Parameters<SearchPageMatchers[K]>
  ) => Promise<MatcherResult>;
};

export const searchPageAssertions =
  baseExpect.extend<SearchPageMatcherDefinitions>({
    toHaveAutoFillHidden: async (
      searchPage: SearchPage,
    ): Promise<MatcherResult> => {
      try {
        const menu = searchPage.getAutoFillMenu();
        await baseExpect(menu).not.toBeVisible();

        return {
          pass: true,
          message: () => "Autofill menu is not visible",
        };
      } catch (error) {
        return {
          pass: false,
          message: () =>
            error instanceof Error ? error.message : String(error),
        };
      }
    },

    toHaveRelevantAutoFillResults: async (
      searchPage: SearchPage,
      searchText: string,
    ): Promise<MatcherResult> => {
      try {
        const menu = searchPage.getAutoFillMenu();
        await baseExpect(menu).toBeVisible();

        const menuItems = searchPage.getAutoFillMenuItems();
        const count = await menuItems.count();

        if (count === 0) {
          return {
            pass: false,
            message: () => "Autofill menu has no items",
          };
        }

        // Check that at least one menu item contains the search text
        const searchTextLower = searchText.toLowerCase();
        let foundMatch = false;

        for (let i = 0; i < count; i++) {
          const item = menuItems.nth(i);
          const text = await item.textContent();
          if (text?.toLowerCase().includes(searchTextLower)) {
            foundMatch = true;
            break;
          }
        }

        if (!foundMatch) {
          return {
            pass: false,
            message: () =>
              `No autofill items contain search text "${searchText}"`,
          };
        }

        return {
          pass: true,
          message: () => `Autofill has relevant results for "${searchText}"`,
        };
      } catch (error) {
        return {
          pass: false,
          message: () =>
            error instanceof Error ? error.message : String(error),
        };
      }
    },

    toHaveAutoFillCategoriesWithinLimit: async (
      searchPage: SearchPage,
      limit: number,
    ): Promise<MatcherResult> => {
      try {
        const menuItems = searchPage.getAutoFillMenuLinks();

        const categoryCount: Record<string, number> = {
          advisories: 0,
          packages: 0,
          sboms: 0,
          vulnerabilities: 0,
        };

        const count = await menuItems.count();

        for (let i = 0; i < count; i++) {
          const link = menuItems.nth(i);
          const href = await link.getAttribute("href");

          if (href?.includes("/advisories/")) {
            categoryCount.advisories++;
          } else if (href?.includes("/packages/")) {
            categoryCount.packages++;
          } else if (href?.includes("/sboms/")) {
            categoryCount.sboms++;
          } else if (href?.includes("/vulnerabilities/")) {
            categoryCount.vulnerabilities++;
          }
        }

        // Check if any category exceeds the limit
        const violations: string[] = [];
        for (const [category, count] of Object.entries(categoryCount)) {
          if (count > limit) {
            violations.push(`${category}: ${count} > ${limit}`);
          }
        }

        if (violations.length > 0) {
          return {
            pass: false,
            message: () =>
              `Categories exceed limit of ${limit}: ${violations.join(", ")}`,
          };
        }

        return {
          pass: true,
          message: () =>
            `All categories within limit of ${limit}: ${JSON.stringify(categoryCount)}`,
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
