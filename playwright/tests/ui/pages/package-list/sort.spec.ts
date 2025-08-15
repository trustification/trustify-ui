// @ts-check

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { expectSort } from "../Helpers";
import { PackageListPage } from "./PackageListPage";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Sort", async ({ page }) => {
    const listPage = await PackageListPage.build(page);
    const table = await listPage.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="ID"]`);

    // ID Asc
    const ascList = await columnNameSelector.allInnerTexts();
    expectSort(ascList, true);

    // ID Desc
    await table.clickSortBy("Name");
    const descList = await columnNameSelector.allInnerTexts();
    expectSort(descList, false);
  });
});
