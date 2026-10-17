import { expect as baseExpect } from "@playwright/test";
import type { DetailsPage } from "../helpers/DetailsPage";
import type { MatcherResult } from "./types";

export interface DetailsPageMatchers {
  toHaveVisibleAction(actionName: string): Promise<MatcherResult>;
}

type DetailsPageMatcherDefinitions = {
  readonly [K in keyof DetailsPageMatchers]: (
    receiver: DetailsPage,
    ...args: Parameters<DetailsPageMatchers[K]>
  ) => Promise<MatcherResult>;
};

export const detailsPageAssertions =
  baseExpect.extend<DetailsPageMatcherDefinitions>({
    toHaveVisibleAction: async (
      detailsPage: DetailsPage,
      actionName: string,
    ): Promise<MatcherResult> => {
      try {
        await baseExpect(
          detailsPage.page.getByRole("menuitem", { name: actionName }),
        ).toBeVisible();
        return {
          pass: true,
          message: () =>
            `Action "${actionName}" is visible in the actions menu`,
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
