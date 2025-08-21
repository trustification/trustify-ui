import { createBdd } from "playwright-bdd";
import { expect } from "playwright/test";
import { ToolbarTable } from "../../helpers/ToolbarTable";
import { SearchPage } from "../../helpers/SearchPage";
import { test } from "../../fixtures";

export const { Given, When, Then } = createBdd(test);

const VULN_TABLE_NAME = "vulnerability table";

Given(
  "User visits Advisory details Page of {string} with type {string}",
  async ({ page }, advisoryName, advisoryType) => {
    const searchPage = new SearchPage(page, "Advisories");
    await searchPage.dedicatedSearch(advisoryName);
    const advisory = `xpath=//tr[contains(.,'${advisoryName}') and contains(.,'${advisoryType}')]/td/a`;
    await page.locator(advisory).click();
  },
);

Then(
  "User navigates to the Vulnerabilities tab on the Advisory Overview page",
  async ({ page }) => {
    await page.getByRole("tab", { name: "Vulnerabilities" }).click();
  },
);

Then("Pagination of Vulnerabilities list works", async ({ page }) => {
  const toolbarTable = new ToolbarTable(page, VULN_TABLE_NAME);
  const vulnTableTopPagination = `xpath=//div[@id="vulnerability-table-pagination-top"]`;
  await toolbarTable.verifyPagination(vulnTableTopPagination);
});

Then(
  "A list of all active vulnerabilites tied to the advisory should display",
  async ({ page }) => {
    const totalItemsLocator = page
      .locator(
        "#vulnerability-table-pagination-top .pf-v6-c-pagination__page-menu",
      )
      .first();

    await expect(totalItemsLocator).toBeVisible();

    const totalText = await totalItemsLocator.textContent();
    const match = totalText?.match(/of\s+(\d+)/);
    expect(match, "unable to parse pagination total").not.toBeNull();

    // biome-ignore lint/style/noNonNullAssertion: allowed
    const total = Number(match![1]);
    expect(total).toBeGreaterThan(0);
  },
);

Then(
  "The {string} information should be visible for each vulnerability",
  async ({ page }, headers: string) => {
    const headersArr = headers
      .split(`,`)
      .map((column: String) => column.trim());
    for (const label of headersArr) {
      const header = page.getByRole("columnheader", { name: label });
      if (await header.count()) {
        await expect(header).toBeVisible();
      } else {
        await expect(page.getByRole("button", { name: label })).toBeVisible();
      }
    }
  },
);

Then(
  "The vulnerabilities should be sorted by ID by default",
  async ({ page }) => {
    const toolbarTable = new ToolbarTable(page, VULN_TABLE_NAME);
    await toolbarTable.verifyTableIsSortedBy("ID");
  },
);

Then(
  "User visits Vulnerability details Page of {string} by clicking it",
  async ({ page }, vulnerabilityID) => {
    const link = page.getByRole("link", { name: vulnerabilityID });

    await Promise.all([
      page.waitForURL(new RegExp(`/vulnerabilities/${vulnerabilityID}$`)),
      link.click(),
    ]);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: new RegExp(`^${vulnerabilityID}\\s*$`),
      }),
    ).toBeVisible();
  },
);
