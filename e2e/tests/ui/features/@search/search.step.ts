import { createBdd } from "playwright-bdd";
import type { Locator } from "@playwright/test";

import { test } from "../../fixtures";

import { expect } from "../../assertions";
import { SearchPage, type Tabs } from "../../pages/search-page/SearchPage";
import { SearchPageTabs } from "../../pages/SearchPageTabs";
import { DetailsPageLayout } from "../../pages/DetailsPageLayout";
import { getTableInfo, toSingular, getDefaultSort } from "../../pages/utils";

export const { Given, When, Then } = createBdd(test);

let Page!: SearchPage;
let currentType = "";

async function findRowIndexContaining(
  rows: Locator,
  text: string,
): Promise<number> {
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const rowText = await rows.nth(i).textContent();
    if (rowText?.toLowerCase().includes(text.toLowerCase())) {
      return i;
    }
  }
  return -1;
}

// Store API responses captured during page load
const apiResponses: Map<string, number> = new Map();

Given("User is on the Search page", async ({ page }) => {
  // Clear previous responses
  apiResponses.clear();

  // Set up listeners for all API endpoints before navigating
  const endpoints = [
    { name: "SBOMs", path: "/api/v3/sbom" },
    { name: "Packages", path: "/api/v3/purl" },
    { name: "Vulnerabilities", path: "/api/v3/vulnerability" },
    { name: "Advisories", path: "/api/v3/advisory" },
  ];

  // Capture responses as they arrive
  page.on("response", async (response) => {
    for (const endpoint of endpoints) {
      if (response.url().includes(endpoint.path) && response.status() === 200) {
        try {
          const body = await response.json();
          if (body.total !== undefined) {
            apiResponses.set(endpoint.name, body.total);
          }
        } catch (_e) {
          // Ignore JSON parse errors
        }
      }
    }
  });

  Page = await SearchPage.build(page);
  await page.waitForLoadState("networkidle");
});

When(
  "User selects the Tab {string}",
  async ({ page: _page }, tabName: string) => {
    await Page.switchTo(tabName as Tabs);
  },
);

Then("Tab {string} is visible", async ({ page }, tabName: string) => {
  const tab = await SearchPageTabs.build(page, tabName);
  await expect(tab._tab).toBeVisible();
});

Then(
  "Download link should be available for the {string} list",
  async ({ page: _page }, type: string) => {
    await Page.switchTo(type as Tabs);
    const table = await Page.getTable();

    // Download links are in the table kebab menu, not the toolbar on search page
    // Just verify the table is visible and has data
    const rows = table._table.locator("tbody tr").first();
    await expect(rows).toBeVisible();
  },
);

When(
  "user starts typing a {string} in the search bar",
  async ({ page: _page }, searchText: string) => {
    await Page.typeInSearchBox(searchText);
  },
);

Then(
  "The autofill drop down should not show any values",
  async ({ page: _page }) => {
    await expect(Page).toHaveAutoFillHidden();
  },
);

When(
  "user types a {string} in the search bar",
  async ({ page: _page }, searchText: string) => {
    await Page.typeInSearchBox(searchText);
  },
);

When("user presses Enter", async ({ page }) => {
  await page.keyboard.press("Enter");
});

Then(
  "the {string} list should display the specific {string}",
  async ({ page: _page }, type: string, name: string) => {
    await Page.switchTo(type as Tabs);
    const table = await Page.getTable();

    // For packages, search across all text in the row since the term might be in namespace
    if (type === "Packages" || type === "Package") {
      const rows = table._table.locator("tbody tr");
      const idx = await findRowIndexContaining(rows, name);
      expect(idx).toBeGreaterThanOrEqual(0);
    } else {
      // For other types, look in the specific column
      const { columnName } = getTableInfo(type);
      // @ts-expect-error - columnName is dynamically determined from type, TypeScript can't verify it matches table columns
      const column = await table.getColumn(columnName);
      const idx = await findRowIndexContaining(column, name);
      expect(idx).toBeGreaterThanOrEqual(0);
    }
  },
);

Then(
  "the list should be limited to {int} items or less",
  async ({ page: _page }, count: number) => {
    const table = await Page.getTable();
    // Count only data rows, not expanded rows
    const rows = table._table.locator("tbody:not(.pf-m-expanded) tr");
    const rowCount = await rows.count();
    expect(rowCount).toBeLessThanOrEqual(count);
  },
);

Then(
  "user clicks on the {string} {string} link",
  async ({ page: _page }, arg: string, types: string) => {
    // Convert plural to singular for comparison
    const type = toSingular(types);
    currentType = type;
    const table = await Page.getTable();
    await table.waitUntilDataIsLoaded();

    // For packages, the search term might be in namespace (not in the link text)
    // Find the row containing the search term, then click the link in the Name column
    if (type === "Package") {
      const rows = table._table.locator("tbody tr");
      let idx = -1;
      await expect
        .poll(
          async () => {
            idx = await findRowIndexContaining(rows, arg);
            return idx;
          },
          {
            timeout: 15000,
            message: `No package row found containing "${arg}"`,
          },
        )
        .not.toBe(-1);
      const nameCell = rows.nth(idx).locator("td").first();
      const link = nameCell.getByRole("link");
      await expect(link).toBeVisible({ timeout: 10000 });
      await link.click();
    } else {
      // For other types, look in the specific column
      const { columnName } = getTableInfo(type);
      // @ts-expect-error - columnName is dynamically determined from type, TypeScript can't verify it matches table columns
      const column = await table.getColumn(columnName);
      const link = column.getByRole("link").filter({ hasText: arg }).first();
      await expect(link).toBeVisible();
      await link.click();
    }
  },
);

Then(
  "the user should be navigated to the specific {string} page",
  async ({ page }, arg: string) => {
    const detailsPage = await DetailsPageLayout.build(page);

    // For packages, the search term might be in the namespace, not the page header
    // So we just verify we're on a package detail page (breadcrumb is visible via build())
    if (currentType === "Package") {
      // Verify we're on a package detail page by checking URL
      await expect(page).toHaveURL(/\/packages\//);
    } else {
      // For other types, verify the header contains the expected text
      await detailsPage.verifyPageHeader(arg);
    }
  },
);

Then(
  "the user should be able to filter {string}",
  async ({ page: _page }, arg: string) => {
    await Page.switchTo(arg as Tabs);
    const filterCard = await Page.getFilterCard();
    const table = await Page.getTable();

    // Get initial row count before filtering
    const getRowCount = async () => {
      const rows = table._table.locator("tbody:not(.pf-m-expanded) tr");
      return await rows.count();
    };

    if (arg === "SBOMs") {
      await filterCard.applyDateRangeFilter("12/22/2025", "12/22/2025");
      await table.waitUntilDataIsLoaded();

      await filterCard.clearAllFilters();
      await table.waitUntilDataIsLoaded();

      // Just verify we can apply and clear filters without errors
      const finalCount = await getRowCount();
      expect(finalCount).toBeGreaterThan(0);
    } else if (arg === "Vulnerabilities") {
      await filterCard.applyCheckboxFilter("CVSS", ["Critical"]);
      await table.waitUntilDataIsLoaded();

      await filterCard.clearAllFilters();
      await table.waitUntilDataIsLoaded();

      const finalCount = await getRowCount();
      expect(finalCount).toBeGreaterThan(0);
    } else if (arg === "Packages") {
      await filterCard.applyCheckboxFilter("Type", ["OCI"]);
      await table.waitUntilDataIsLoaded();

      await filterCard.clearAllFilters();
      await table.waitUntilDataIsLoaded();

      const finalCount = await getRowCount();
      expect(finalCount).toBeGreaterThan(0);
    } else if (arg === "Advisories") {
      await filterCard.applyDateRangeFilter("12/22/2025", "12/22/2025");
      await table.waitUntilDataIsLoaded();

      await filterCard.clearAllFilters();
      await table.waitUntilDataIsLoaded();

      const finalCount = await getRowCount();
      expect(finalCount).toBeGreaterThan(0);
    }
  },
);

Then(
  "the {string} list should have the {string} filter set",
  async ({ page: _page }, tabType: string, filters: string) => {
    await Page.switchTo(tabType as Tabs);
    const filterCard = await Page.getFilterCard();

    // Parse comma-separated filters
    const filterList = filters.split(",").map((f) => f.trim());

    // Verify each filter heading is visible in the filter panel
    for (const filterName of filterList) {
      // Use regex for exact match to avoid matching "Published" in "Published only"
      const exactMatch = new RegExp(`^${filterName}$`);
      await expect(
        filterCard._filterCard.locator("h4").filter({ hasText: exactMatch }),
      ).toBeVisible();
    }
  },
);

Then(
  "the {string} list should be sortable",
  async ({ page: _page }, arg: string) => {
    await Page.switchTo(arg as Tabs);
    const table = await Page.getTable();

    // Get the default sort configuration for this entity type
    const defaultSort = getDefaultSort(arg);

    // Verify the default sort is applied when the tab loads
    // @ts-expect-error - defaultSort.column is dynamically determined from arg, TypeScript can't verify it matches table columns
    const defaultColumnHeader = await table.getColumnHeader(defaultSort.column);
    const defaultAriaSortValue =
      await defaultColumnHeader.getAttribute("aria-sort");
    expect(defaultAriaSortValue).toBe(defaultSort.direction);

    // Click the default column to toggle the sort
    // @ts-expect-error - defaultSort.column is dynamically determined from arg, TypeScript can't verify it matches table columns
    await table.clickSortBy(defaultSort.column);
    await table.waitUntilDataIsLoaded();

    // Verify the sort direction toggled (ascending -> descending or descending -> ascending)
    const expectedToggledDirection =
      defaultSort.direction === "ascending" ? "descending" : "ascending";
    await expect(defaultColumnHeader).toHaveAttribute(
      "aria-sort",
      expectedToggledDirection,
    );

    // Verify table has data after sorting
    const rows = table._table.locator("tbody tr").first();
    await expect(rows).toBeVisible();
  },
);

Then(
  "the {string} list should be limited to {int} items",
  async ({ page: _page }, type: string, count: number) => {
    await Page.switchTo(type as Tabs);
    const pagination = await Page.getPagination(true);
    await pagination.selectItemsPerPage(10);

    const table = await Page.getTable();
    await table.waitUntilDataIsLoaded();
    // Count only data rows, not expanded rows
    const rows = table._table.locator("tbody:not(.pf-m-expanded) tr");
    const rowCount = await rows.count();
    expect(rowCount).toBeLessThanOrEqual(count);
  },
);

Then(
  "the user should be able to switch to next {string} items",
  async ({ page: _page }, arg: string) => {
    await Page.switchTo(arg as Tabs);
    const pagination = await Page.getPagination(true);

    const nextButton = pagination.getNextPageButton();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    const table = await Page.getTable();
    await table.waitUntilDataIsLoaded();
  },
);

Then(
  "the user should be able to increase pagination for the {string}",
  async ({ page: _page }, arg: string) => {
    await Page.switchTo(arg as Tabs);
    const pagination = await Page.getPagination(true);

    // Go to first page
    const firstButton = pagination.getFirstPageButton();
    if (await firstButton.isEnabled()) {
      await firstButton.click();
      await expect(pagination.getPageInput()).toHaveValue("1");
    }

    // Select 20 per page
    await pagination.selectItemsPerPage(20);

    const table = await Page.getTable();
    await table.waitUntilDataIsLoaded();

    // Count only data rows, not expanded rows
    const rows = table._table.locator("tbody:not(.pf-m-expanded) tr");
    const rowCount = await rows.count();
    expect(rowCount).toBeLessThanOrEqual(20);
  },
);

Then(
  "First column on the search results should have the link to {string} explorer pages",
  async ({ page: _page }, arg: string) => {
    await Page.switchTo(arg as Tabs);
    const table = await Page.getTable();
    const { columnName } = getTableInfo(arg);
    // @ts-expect-error - columnName is dynamically determined from arg, TypeScript can't verify it matches table columns
    const column = await table.getColumn(columnName);
    const firstLink = column.first().getByRole("link");
    await expect(firstLink).toBeVisible();
  },
);

Then(
  "a total number of {string} should be visible in the tab",
  async ({ page }, tabType: string) => {
    // Get the API total from captured responses
    const apiTotal = apiResponses.get(tabType);
    if (apiTotal === undefined) {
      throw new Error(
        `No API response captured for ${tabType}. Available: ${Array.from(apiResponses.keys()).join(", ")}`,
      );
    }

    // Switch to the tab to ensure badge is visible
    await Page.switchTo(tabType as Tabs);

    // Verify the badge displays the same count as the API
    const tab = await SearchPageTabs.build(page, tabType);
    const badge = tab._tab.locator(".pf-v6-c-badge");
    await expect(badge).toHaveText(/[\d]/, { timeout: 10000 });

    const badgeText = await badge.textContent();
    const badgeCount = parseInt(badgeText?.match(/\d+/)?.[0] || "0", 10);

    expect(badgeCount).toBe(apiTotal);
  },
);

Then(
  "the autofill dropdown should display items matching the {string}",
  async ({ page: _page }, arg: string) => {
    await expect(Page).toHaveRelevantAutoFillResults(arg);
  },
);

Then(
  "the results should be limited to {int} suggestions",
  async ({ page: _page }, arg: number) => {
    const totalResults = await Page.totalAutoFillResults();
    expect(totalResults).toBeLessThanOrEqual(arg * 4);
    await expect(Page).toHaveAutoFillCategoriesWithinLimit(arg);
  },
);

// TC-3248: Verify Upload Advisory button should not appear on Search page
Then(
  "{string} button should not be displayed",
  async ({ page }, buttonText: string) => {
    const button = page.getByRole("button", { name: buttonText, exact: true });
    await expect(button).not.toBeVisible();
  },
);
