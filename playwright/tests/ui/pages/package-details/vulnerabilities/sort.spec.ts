// @ts-check

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";
import { expectSort } from "../../Helpers";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Sort", async ({ page }) => {
    const vulnerabilitiesTab = await VulnerabilitiesTab.build(
      page,
      "keycloak-core",
    );
    const table = await vulnerabilitiesTab.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="ID"]`);

    const ascList = await columnNameSelector.allInnerTexts();
    expectSort(ascList, true);

    // Reverse sorting
    await table.clickSortBy("ID");
    const descList = await columnNameSelector.allInnerTexts();
    expectSort(descList, false);
  });
});
