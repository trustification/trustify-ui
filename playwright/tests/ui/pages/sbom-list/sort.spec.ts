// @ts-check

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { expectSort } from "../Helpers";
import { SbomListPage } from "./SbomListPage";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Sort", async ({ page }) => {
    const listPage = await SbomListPage.build(page);
    const table = await listPage.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="Name"]`);

    const ascList = await columnNameSelector.allInnerTexts();
    expectSort(ascList, true);

    // Reverse sorting
    await table.clickSortBy("Name");
    const desList = await columnNameSelector.allInnerTexts();
    expectSort(desList, false);
  });
});
