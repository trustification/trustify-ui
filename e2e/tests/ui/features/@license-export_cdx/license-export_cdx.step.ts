import { createBdd } from "playwright-bdd";
import * as fs from "node:fs";

import { test } from "../../fixtures";

import { expect } from "../../assertions";

import { SbomListPage } from "../../pages/sbom-list/SbomListPage";
import { SbomDetailsPage } from "../../pages/sbom-details/SbomDetailsPage";
import { DetailsPage } from "../../helpers/DetailsPage";
import { SearchPage } from "../../helpers/SearchPage";
import { clickAndVerifyDownload } from "../../pages/Helpers";
import {
  downloadLicenseReport,
  extractLicenseReport,
  findCsvWithHeader,
} from "../../pages/LicenseExportHelpers";

export const { Given, When, Then } = createBdd(test);

let downloadedFilename: string;
let downloadedFilePath: string;
let extractionPath: string;
let packageLicenseFilePath: string;
let licenseReferenceFilePath: string;

Given(
  "User Searches for CycloneDX SBOM {string} using Search Text box",
  async ({ page }, sbomName: string) => {
    const listPage = await SbomListPage.build(page);
    const toolbar = await listPage.getToolbar();
    await toolbar.applyFilter({ "Filter text": sbomName });
  },
);

Given(
  "User Searches for CycloneDX SBOM {string} using Search Text box and Navigates to Search results page",
  async ({ page }, sbomName: string) => {
    const searchPage = new SearchPage(page, "Search");
    await searchPage.generalSearch("SBOMs", sbomName);
  },
);

When(
  "User Selects CycloneDX SBOM {string} from the Search Results",
  async ({ page }, sbomName: string) => {
    const listPage = await SbomListPage.fromCurrentPage(page);
    const table = await listPage.getTable();
    await table.waitUntilDataIsLoaded();

    await expect(table).toHaveColumnWithValue("Name", sbomName);
  },
);

When(
  "User Clicks on SBOM name hyperlink from the Search Results",
  async ({ page }) => {
    const listPage = await SbomListPage.fromCurrentPage(page);
    const table = await listPage.getTable();
    const rows = await table.getRows();
    await rows.first().getByRole("link").click();
  },
);

Then("Application Navigates to SBOM Explorer page", async ({ page }) => {
  await expect(page).toHaveURL(/\/sboms\/[^/]+/);
});

When('User Clicks "Action" button', async ({ page }) => {
  const detailsPage = new DetailsPage(page);
  await detailsPage.openActionsMenu();
});

Then('"Download License Report" Option should be visible', async ({ page }) => {
  const detailsPage = new DetailsPage(page);
  await expect(detailsPage).toHaveVisibleAction("Download License Report");
});

When('Selects "Download License Report" option', async ({ page }) => {
  const detailsPage = new DetailsPage(page);
  downloadedFilename = await clickAndVerifyDownload(
    page,
    async () =>
      await detailsPage.page
        .getByRole("menuitem", { name: "Download License Report" })
        .click(),
  );
});

Then(
  "Licenses associated with the SBOM should be downloaded in TAR.GZ format using the SBOM name",
  async ({ page }) => {
    const sbomName = await page.getByRole("heading").first().innerText();
    expect(downloadedFilename).toContain(sbomName);
    expect(downloadedFilename.endsWith(".tar.gz")).toBeTruthy();
  },
);

Given(
  "User is on SBOM Explorer page for the CycloneDX SBOM {string}",
  async ({ page }, sbomName: string) => {
    await SbomDetailsPage.build(page, sbomName);
  },
);

When('User Clicks on "Download License Report" button', async ({ page }) => {
  const detailsPage = new DetailsPage(page);
  await detailsPage.openActionsMenu();

  downloadedFilename = await clickAndVerifyDownload(
    page,
    async () =>
      await detailsPage.page
        .getByRole("menuitem", { name: "Download License Report" })
        .click(),
  );
});

Given(
  "User has Downloaded the License information for CycloneDX SBOM {string}",
  async ({ page }, sbomName: string) => {
    await SbomDetailsPage.build(page, sbomName);
    downloadedFilePath = await downloadLicenseReport(page);
  },
);

When("User extracts the Downloaded license TAR.GZ file", async () => {
  extractionPath = await extractLicenseReport(downloadedFilePath);
});

Then(
  "Extracted files should contain two CSVs, one for Package license information and another one for License reference",
  async () => {
    const files = fs.readdirSync(extractionPath);
    const csvFiles = files.filter((file) => file.endsWith(".csv"));
    expect(csvFiles.length).toBe(2);
  },
);

Given(
  "User extracted the CycloneDX SBOM {string} license compressed file",
  async ({ page }, sbomName: string) => {
    await SbomDetailsPage.build(page, sbomName);
    downloadedFilePath = await downloadLicenseReport(page);
    extractionPath = await extractLicenseReport(downloadedFilePath);
  },
);

When("User Opens the package license information file", async () => {
  packageLicenseFilePath = findCsvWithHeader(
    extractionPath,
    "SBOM name",
    "Package license information file",
  );
});

Then(
  "The file should have the following headers - SBOM name, SBOM id, package name, package group, package version, package purl, package cpe and license",
  async () => {
    const content = fs.readFileSync(packageLicenseFilePath, "utf-8");
    const headers = content.split("\n")[0].trim();
    const expectedHeaders =
      '"SBOM name"\t"SBOM id"\t"package name"\t"package group"\t"package version"\t"package purl"\t"package cpe"\t"license"\t"license type"';
    expect(headers).toBe(expectedHeaders);
  },
);

When("User Opens the license reference file", async () => {
  licenseReferenceFilePath = findCsvWithHeader(
    extractionPath,
    "licenseId",
    "License reference file",
  );
});

Then(
  "The file should have the following headers - licenseId, name, extracted text and comment",
  async () => {
    const content = fs.readFileSync(licenseReferenceFilePath, "utf-8");
    const headers = content.split("\n")[0].trim();
    const expectedHeaders = '"licenseId"\t"name"\t"extracted text"\t"comment"';
    expect(headers).toBe(expectedHeaders);
  },
);

Given(
  "User is on license reference {string} file",
  async ({ page }, sbomName: string) => {
    await SbomDetailsPage.build(page, sbomName);
    downloadedFilePath = await downloadLicenseReport(page);
    extractionPath = await extractLicenseReport(downloadedFilePath);
    licenseReferenceFilePath = findCsvWithHeader(
      extractionPath,
      "licenseId",
      "License reference file",
    );
  },
);

Then("The License reference CSV should be empty", async () => {
  const content = fs.readFileSync(licenseReferenceFilePath, "utf-8");
  const lines = content.trim().split("\n");
  // Only header should be present
  expect(lines.length).toBe(1);
});
