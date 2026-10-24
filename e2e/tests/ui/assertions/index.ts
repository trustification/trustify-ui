import { mergeExpects } from "@playwright/test";

import type { Table } from "../pages/Table";
import { tableAssertions, type TableMatchers } from "./TableMatchers";

import type { Pagination } from "../pages/Pagination";
import {
  paginationAssertions,
  type PaginationMatchers,
} from "./PaginationMatchers";

import type { Toolbar } from "../pages/Toolbar";
import type { TFilterValue } from "../pages/utils";
import { toolbarAssertions, type ToolbarMatchers } from "./ToolbarMatchers";

import type { DeletionConfirmDialog } from "../pages/ConfirmDialog";
import { dialogAssertions, type DialogMatchers } from "./DialogMatchers";

import type { FileUpload } from "../pages/FileUpload";
import {
  fileUploadAssertions,
  type FileUploadMatchers,
} from "./FileUploadMatchers";

import type { SearchPage } from "../pages/search-page/SearchPage";
import {
  searchPageAssertions,
  type SearchPageMatchers,
} from "./SearchPageMatchers";

import type { SearchPageTabs } from "../pages/SearchPageTabs";
import {
  searchPageTabsAssertions,
  type SearchPageTabsMatchers,
} from "./SearchPageTabsMatchers";

const merged = mergeExpects(
  tableAssertions,
  paginationAssertions,
  toolbarAssertions,
  dialogAssertions,
  fileUploadAssertions,
  searchPageAssertions,
  searchPageTabsAssertions,
  // Add more custom assertions here
);

// Create overloaded expect that preserves types for all custom matchers

/**
 * Overload from TableMatchers.ts
 */
function typedExpect<
  const TColumns extends readonly string[],
  const TActions extends readonly string[],
>(
  value: Table<TColumns, TActions>,
): Omit<
  ReturnType<typeof merged<Table<TColumns, TActions>>>,
  keyof TableMatchers<TColumns, TActions>
> &
  TableMatchers<TColumns, TActions>;

/**
 * Overload from PaginationMatchers.ts
 */
function typedExpect(
  value: Pagination,
): Omit<ReturnType<typeof merged<Pagination>>, keyof PaginationMatchers> &
  PaginationMatchers;

/**
 * Overload from ToolbarMatchers.ts
 */
function typedExpect<
  TFilter extends Record<string, TFilterValue>,
  TFilterName extends Extract<keyof TFilter, string>,
  TKebabActions extends readonly string[],
>(
  value: Toolbar<TFilter, TFilterName, TKebabActions>,
): Omit<
  ReturnType<typeof merged<Toolbar<TFilter, TFilterName, TKebabActions>>>,
  keyof ToolbarMatchers<TFilter, TFilterName, TKebabActions>
> &
  ToolbarMatchers<TFilter, TFilterName, TKebabActions>;

/**
 * Overload from DialogMatchers.ts
 */
function typedExpect(
  value: DeletionConfirmDialog,
): Omit<
  ReturnType<typeof merged<DeletionConfirmDialog>>,
  keyof DialogMatchers
> &
  DialogMatchers;

/**
 * Overload from FileUploadMatchers.ts
 */
function typedExpect(
  value: FileUpload,
): Omit<ReturnType<typeof merged<FileUpload>>, keyof FileUploadMatchers> &
  FileUploadMatchers;

/**
 * Overload from SearchPageMatchers.ts
 */
function typedExpect(
  value: SearchPage,
): Omit<ReturnType<typeof merged<SearchPage>>, keyof SearchPageMatchers> &
  SearchPageMatchers;

/**
 * Overload from SearchPageTabsMatchers.ts
 */
function typedExpect(
  value: SearchPageTabs,
): Omit<
  ReturnType<typeof merged<SearchPageTabs>>,
  keyof SearchPageTabsMatchers
> &
  SearchPageTabsMatchers;

// Default overload
function typedExpect<T>(value: T): ReturnType<typeof merged<T>>;
function typedExpect<T>(value: T): unknown {
  return merged(value);
}

export const expect = Object.assign(typedExpect, merged);
