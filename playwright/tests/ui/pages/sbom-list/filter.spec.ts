// @ts-check

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { SbomListPage } from "./SbomListPage";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const listPage = await SbomListPage.build(page);

    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "quarkus");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Date filter
    await toolbar.applyDateRangeFilter(
      "Created on",
      "11/21/2023",
      "11/23/2023",
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Labels filter
    await toolbar.applyLabelsFilter("Label", ["type=spdx"]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");
  });
});
