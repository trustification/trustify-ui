// @ts-check

import { expect } from "@playwright/test";

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { SbomDetailsPage } from "./SbomDetailsPage";

test.describe("Action validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Actions - Download SBOM", async ({ page }) => {
    const detailsPage = await SbomDetailsPage.build(page, "quarkus-bom");

    const downloadPromise = page.waitForEvent("download");
    await detailsPage._layout.clickOnPageAction("Download SBOM");
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toEqual("quarkus-bom.json");
  });

  test("Actions - Download License Report", async ({ page }) => {
    const detailsPage = await SbomDetailsPage.build(page, "quarkus-bom");

    const downloadPromise = page.waitForEvent("download");
    await detailsPage._layout.clickOnPageAction("Download License Report");
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toContain("quarkus-bom");
  });
});
