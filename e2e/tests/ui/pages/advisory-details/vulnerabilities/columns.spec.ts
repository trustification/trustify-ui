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
      "CVE-2024-26308",
    );
    const table = await vulnerabilitiesTab.getTable();

    const ids = await table._table
      .locator(`td[data-label="ID"]`)
      .allInnerTexts();
    const idIndex = ids.indexOf("CVE-2024-26308");
    expect(idIndex).not.toBe(-1);

    // Name
    await expect(
      table._table.locator(`td[data-label="ID"]`).nth(idIndex),
    ).toContainText("CVE-2024-26308");

    // Title
    await expect(
      table._table.locator(`td[data-label="Title"]`).nth(idIndex),
    ).toContainText(
      "Apache Commons Compress: OutOfMemoryError unpacking broken Pack200 file",
    );

    // CWE
    await expect(
      table._table.locator(`td[data-label="CWE"]`).nth(idIndex),
    ).toContainText("CWE-770");
  });
});
