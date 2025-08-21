// @ts-check

import { expect } from "@playwright/test";

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { PackageListPage } from "./PackageListPage";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Columns", async ({ page }) => {
    const listPage = await PackageListPage.build(page);

    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "keycloak-core");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Namespace
    await expect(
      table._table.locator(`td[data-label="Namespace"]`),
    ).toContainText("org.keycloak");

    // Version
    await expect(
      table._table.locator(`td[data-label="Version"]`),
    ).toContainText("18.0.6.redhat-00001");

    // Type
    await expect(table._table.locator(`td[data-label="Type"]`)).toContainText(
      "maven",
    );

    // Qualifiers
    await expect(
      table._table.locator(`td[data-label="Qualifiers"]`),
    ).toContainText("type=jar");
    await expect(
      table._table.locator(`td[data-label="Qualifiers"]`),
    ).toContainText("repository_url=https://maven.repository.redhat.com/ga/");

    // Vulnerabilities
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='total']"),
    ).toContainText("1");
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='medium']"),
    ).toContainText("1");
  });
});
