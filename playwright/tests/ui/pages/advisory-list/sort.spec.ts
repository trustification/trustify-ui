// @ts-check

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { expectSort } from "../Helpers";
import { AdvisoryListPage } from "./AdvisoryListPage";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // TODO: enable after https://github.com/trustification/trustify/issues/1810 is fixed
  test.skip("Sort", async ({ page }) => {
    const listPage = await AdvisoryListPage.build(page);
    const table = await listPage.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="ID"]`);

    // ID Asc
    await table.clickSortBy("ID");
    const ascList = await columnNameSelector.allInnerTexts();
    expectSort(ascList, true);

    // ID Desc
    await table.clickSortBy("ID");
    const descList = await columnNameSelector.allInnerTexts();
    expectSort(descList, false);
  });
});
