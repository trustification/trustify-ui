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
    const vulnerabilityTab = await VulnerabilitiesTab.build(
      page,
      "quarkus-bom",
    );
    const table = await vulnerabilityTab.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="Id"]`);

    const ascList = await columnNameSelector.allInnerTexts();
    expectSort(ascList, true);

    // Reverse sorting
    await table.clickSortBy("Id");
    const descList = await columnNameSelector.allInnerTexts();
    expectSort(descList, false);
  });
});
