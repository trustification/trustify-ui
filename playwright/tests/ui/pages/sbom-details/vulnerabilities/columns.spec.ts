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
    const vulnerabilityTab = await VulnerabilitiesTab.build(
      page,
      "quarkus-bom",
    );

    const table = await vulnerabilityTab.getTable();

    const ids = await table._table
      .locator(`td[data-label="Id"]`)
      .allInnerTexts();
    const idIndex = ids.indexOf("CVE-2023-4853");
    expect(idIndex).not.toBe(-1);

    // Name
    await expect(
      table._table.locator(`td[data-label="Id"]`).nth(idIndex),
    ).toContainText("CVE-2023-4853");

    // Description
    await expect(
      table._table.locator(`td[data-label="Description"]`).nth(idIndex),
    ).toContainText("quarkus: HTTP security policy bypass");

    // Vulnerabilities
    await expect(
      table._table.locator(`td[data-label="CVSS"]`).nth(idIndex),
    ).toContainText("High(8.1)");

    // Affected dependencies
    await expect(
      table._table
        .locator(`td[data-label="Affected dependencies"]`)
        .nth(idIndex),
    ).toContainText("3");

    await table._table
      .locator(`td[data-label="Affected dependencies"]`)
      .nth(idIndex)
      .click();

    await expect(
      table._table
        .locator(`td[data-label="Affected dependencies"]`)
        .nth(idIndex + 1),
    ).toContainText("quarkus-undertow");
    await expect(
      table._table
        .locator(`td[data-label="Affected dependencies"]`)
        .nth(idIndex + 1),
    ).toContainText("quarkus-keycloak-authorization");
    await expect(
      table._table
        .locator(`td[data-label="Affected dependencies"]`)
        .nth(idIndex + 1),
    ).toContainText("quarkus-vertx-http");
  });
});
