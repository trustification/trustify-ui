// @ts-check

import { expect } from "@playwright/test";

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { AdvisoryListPage } from "./AdvisoryListPage";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Columns", async ({ page }) => {
    const listPage = await AdvisoryListPage.build(page);

    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "CVE-2024-26308");
    await table.waitUntilDataIsLoaded();

    // ID
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Title
    await expect(table._table.locator(`td[data-label="Title"]`)).toContainText(
      "Apache Commons Compress: OutOfMemoryError unpacking broken Pack200 file",
    );

    // Type
    await expect(table._table.locator(`td[data-label="Type"]`)).toContainText(
      "cve",
    );

    // Labels
    await expect(table._table.locator(`td[data-label="Labels"]`)).toContainText(
      "type=cve",
    );
  });
});
