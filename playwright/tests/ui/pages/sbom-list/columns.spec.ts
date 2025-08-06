// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { SbomListPage } from "./SbomListPage";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Vulnerabilities", async ({ page }) => {
    const listPage = await SbomListPage.build(page);

    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "quarkus-bom");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Total Vulnerabilities
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='total']", { hasText: "11" }),
    ).toHaveCount(1);

    // Severities
    const expectedVulnerabilities = [
      {
        severity: "high",
        count: 1,
      },
      {
        severity: "medium",
        count: 9,
      },
      {
        severity: "none",
        count: 1,
      },
    ];

    for (const expectedVulnerability of expectedVulnerabilities) {
      await expect(
        table._table
          .locator(`td[data-label="Vulnerabilities"]`)
          .locator(`div[aria-label="${expectedVulnerability.severity}"]`, {
            hasText: expectedVulnerability.count.toString(),
          }),
      ).toHaveCount(1);
    }
  });
});
