// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { AdvisoryListPage } from "./AdvisoryListPage";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const listPage = await AdvisoryListPage.build(page);

    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "CVE-2024-26308");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Date filter
    await toolbar.applyDateRangeFilter("Revision", "08/01/2024", "08/03/2024");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Labels filter
    await toolbar.applyLabelsFilter("Label", ["type=cve"]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");
  });
});
