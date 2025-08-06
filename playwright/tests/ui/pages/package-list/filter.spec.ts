// @ts-check

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { PackageListPage } from "./PackageListPage";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const listPage = await PackageListPage.build(page);

    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "keycloak-core");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Type filter
    await toolbar.applyMultiSelectFilter("Type", ["Maven", "RPM"]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Architecture
    await toolbar.applyMultiSelectFilter("Architecture", ["S390", "No Arch"]);
    await table.waitUntilDataIsLoaded();
    await table.verifyTableHasNoData();
  });
});
