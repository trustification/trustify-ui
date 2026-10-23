import { expect as baseExpect } from "@playwright/test";
import type { Toolbar } from "../pages/Toolbar";
import {
  type FilterValueType,
  isDateRangeFilter,
  isMultiSelectFilter,
  isStringFilter,
  isTypeaheadFilter,
  type TFilterValue,
} from "../pages/utils";
import type { MatcherResult } from "./types";

export interface ToolbarMatchers<
  TFilter extends Record<string, TFilterValue>,
  _TFilterName extends Extract<keyof TFilter, string>,
  _TKebabActions extends readonly string[],
> {
  toHaveLabels(
    filters: Partial<FilterValueType<TFilter>>,
  ): Promise<MatcherResult>;
  toHaveNoLabels(): Promise<MatcherResult>;
  toHaveBulkSelectedCount(count: string): Promise<MatcherResult>;
}

type ToolbarMatcherDefinitions = {
  readonly [K in keyof ToolbarMatchers<
    Record<string, TFilterValue>,
    string,
    string[]
  >]: <
    TFilter extends Record<string, TFilterValue>,
    TFilterName extends Extract<keyof TFilter, string>,
    TKebabActions extends readonly string[],
  >(
    receiver: Toolbar<TFilter, TFilterName, TKebabActions>,
    ...args: Parameters<ToolbarMatchers<TFilter, TFilterName, TKebabActions>[K]>
  ) => Promise<MatcherResult>;
};

export const toolbarAssertions = baseExpect.extend<ToolbarMatcherDefinitions>({
  toHaveLabels: async <
    TFilter extends Record<string, TFilterValue>,
    TFilterName extends Extract<keyof TFilter, string>,
    TKebabActions extends readonly string[],
  >(
    toolbar: Toolbar<TFilter, TFilterName, TKebabActions>,
    filters: Partial<FilterValueType<TFilter>>,
  ): Promise<MatcherResult> => {
    try {
      for (const filterName of Object.keys(filters) as Array<TFilterName>) {
        const filterValue = filters[filterName];
        if (!filterValue) continue;

        const filterType = toolbar._filters[filterName];

        const labels: string[] = [];
        if (isStringFilter(filterType, filterValue)) {
          labels.push(filterValue);
        }
        if (isDateRangeFilter(filterType, filterValue)) {
          labels.push(filterValue.from);
          labels.push(filterValue.to);
        }
        if (isMultiSelectFilter(filterType, filterValue)) {
          labels.push(...filterValue);
        }
        if (isTypeaheadFilter(filterType, filterValue)) {
          labels.push(...filterValue);
        }

        const group = toolbar._toolbar.locator(".pf-m-label-group", {
          hasText: filterName,
        });
        await baseExpect(group).toBeVisible();

        for (const label of labels) {
          await baseExpect(
            group.locator(".pf-v6-c-label-group__list", { hasText: label }),
          ).toBeVisible();
        }
      }

      return {
        pass: true,
        message: () => "Toolbar has labels",
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveNoLabels: async <
    TFilter extends Record<string, TFilterValue>,
    TFilterName extends Extract<keyof TFilter, string>,
    TKebabActions extends readonly string[],
  >(
    toolbar: Toolbar<TFilter, TFilterName, TKebabActions>,
  ): Promise<MatcherResult> => {
    try {
      // Verify the clear all button does not exist
      const clearButton = toolbar._toolbar.getByRole("button", {
        name: "Clear all filters",
      });
      await baseExpect(clearButton).not.toBeVisible();

      // Verify no filter categories are there
      await baseExpect(
        toolbar._toolbar.locator(".pf-m-label-group"),
      ).toHaveCount(0);

      return {
        pass: true,
        message: () => "Toolbar has no labels",
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveBulkSelectedCount: async <
    TFilter extends Record<string, TFilterValue>,
    TFilterName extends Extract<keyof TFilter, string>,
    TKebabActions extends readonly string[],
  >(
    toolbar: Toolbar<TFilter, TFilterName, TKebabActions>,
    count: string,
  ): Promise<MatcherResult> => {
    try {
      const bulkCheckbox = toolbar._toolbar
        .page()
        .locator("#bulk-selected-items-checkbox");
      await baseExpect(bulkCheckbox).toContainText(count);

      return {
        pass: true,
        message: () => `Bulk selected count is ${count}`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
});
