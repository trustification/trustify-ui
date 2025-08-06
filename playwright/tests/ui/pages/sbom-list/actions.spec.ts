// @ts-check

import { expect } from "@playwright/test";

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { LabelsModal } from "../LabelsModal";
import { SbomListPage } from "./SbomListPage";

test.describe("Action validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Actions - Download SBOM", async ({ page }) => {
    const listPage = await SbomListPage.build(page);
    const table = await listPage.getTable();

    const sbomNames = await table._table
      .locator(`td[data-label="Name"]`)
      .allInnerTexts();

    const downloadPromise = page.waitForEvent("download");
    await table.clickAction("Download SBOM", 0);
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toEqual(`${sbomNames[0]}.json`);
  });

  test("Actions - Download License Report", async ({ page }) => {
    const listPage = await SbomListPage.build(page);
    const table = await listPage.getTable();

    const sbomNames = await table._table
      .locator(`td[data-label="Name"]`)
      .allInnerTexts();

    const downloadPromise = page.waitForEvent("download");
    await table.clickAction("Download License Report", 0);
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toContain(sbomNames[0]);
  });

  test("Actions - Edit Labels", async ({ page }) => {
    const listPage = await SbomListPage.build(page);
    const table = await listPage.getTable();

    const labels = ["color=red", "production"];
    await table.clickAction("Edit labels", 0);

    let labelsModal = await LabelsModal.build(page);

    // Add labels
    await labelsModal.addLabels(labels);
    await labelsModal.clickSave();

    // Verify labels were added
    await table.waitUntilDataIsLoaded();
    for (const label of labels) {
      await expect(
        table._table
          .locator(`td[data-label="Labels"]`)
          .first()
          .locator(".pf-v6-c-label", { hasText: label }),
      ).toHaveCount(1);
    }

    // Clean labels added previously
    await table.clickAction("Edit labels", 0);

    labelsModal = await LabelsModal.build(page);
    await labelsModal.removeLabels(labels);
    await labelsModal.clickSave();

    await table.waitUntilDataIsLoaded();
    for (const label of labels) {
      await expect(
        table._table
          .locator(`td[data-label="Labels"]`)
          .first()
          .locator(".pf-v6-c-label", { hasText: label }),
      ).toHaveCount(0);
    }
  });
});
