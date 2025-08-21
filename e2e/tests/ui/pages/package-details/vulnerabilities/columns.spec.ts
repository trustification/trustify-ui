// @ts-check

import { expect } from "@playwright/test";

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Columns", async ({ page }) => {
    const vulnerabilitiesTab = await VulnerabilitiesTab.build(
      page,
      "keycloak-core",
    );
    const table = await vulnerabilitiesTab.getTable();

    const ids = await table._table
      .locator(`td[data-label="ID"]`)
      .allInnerTexts();
    const idIndex = ids.indexOf("CVE-2023-1664");
    expect(idIndex).not.toBe(-1);

    // Name
    await expect(
      table._table.locator(`td[data-label="ID"]`).nth(idIndex),
    ).toContainText("CVE-2023-1664");

    // Title
    await expect(
      table._table.locator(`td[data-label="CVSS"]`).nth(idIndex),
    ).toContainText("Medium(6.5)");
  });
});
