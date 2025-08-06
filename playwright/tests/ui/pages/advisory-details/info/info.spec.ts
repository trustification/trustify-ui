// @ts-check

import { expect } from "@playwright/test";

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { AdvisoryDetailsPage } from "../AdvisoryDetailsPage";
import { LabelsModal } from "../../LabelsModal";

test.describe("Info Tab validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Labels", async ({ page }) => {
    await AdvisoryDetailsPage.build(page, "CVE-2024-26308");

    const labels = ["color=red", "production"];

    // Open Edit Labels Modal
    await page.getByRole("button", { name: "Edit" }).click();

    let labelsModal = await LabelsModal.build(page);
    await labelsModal.addLabels(labels);
    await labelsModal.clickSave();

    for (const label of labels) {
      await expect(
        page.locator(".pf-v6-c-label-group__list-item", { hasText: label }),
      ).toHaveCount(1);
    }

    // Clean labels added previously
    await page.getByRole("button", { name: "Edit" }).click();

    labelsModal = await LabelsModal.build(page);
    await labelsModal.removeLabels(labels);
    await labelsModal.clickSave();

    for (const label of labels) {
      await expect(
        page.locator(".pf-v6-c-label-group__list-item", { hasText: label }),
      ).toHaveCount(0);
    }
  });
});
