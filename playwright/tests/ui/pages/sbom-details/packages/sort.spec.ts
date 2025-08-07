// @ts-check

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { PackagesTab } from "./PackagesTab";
import { expectSort } from "../../Helpers";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Sort", async ({ page }) => {
    const packageTab = await PackagesTab.build(page, "quarkus-bom");
    const table = await packageTab.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="Name"]`);

    const ascList = await columnNameSelector.allInnerTexts();
    expectSort(ascList, true);

    // Reverse sorting
    await table.clickSortBy("Name");
    const descList = await columnNameSelector.allInnerTexts();
    expectSort(descList, false);
  });
});
