// @ts-check

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { PackagesTab } from "./PackagesTab";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const packageTab = await PackagesTab.build(page, "quarkus-bom");

    const toolbar = await packageTab.getToolbar();
    const table = await packageTab.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "commons-compress");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");

    // Labels filter
    await toolbar.applyMultiSelectFilter("License", [
      "Apache-2.0",
      "NOASSERTION",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");
  });
});
