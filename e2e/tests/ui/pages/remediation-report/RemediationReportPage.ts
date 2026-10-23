import type { Page } from "@playwright/test";

import { expect } from "../../assertions";

import { SbomListPage } from "../sbom-list/SbomListPage";
import { Table } from "../Table";

export class RemediationReportPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page, sbomNames: string[]) {
    const sbomListPage = await SbomListPage.build(page);
    await sbomListPage.selectSbomsByName(sbomNames);
    await sbomListPage.clickRemediationReport();
    return new RemediationReportPage(page);
  }

  static async fromCurrentPage(page: Page) {
    return new RemediationReportPage(page);
  }

  async getImpactSummary() {
    const card = this._page.locator('div[class*="rr-report__impact-grid"]');
    await expect(card).toBeVisible();

    const sbomsWithText = await card
      .locator(
        'div[class*="rr-report__stat"]:has-text("SBOMs with remediations")',
      )
      .locator('div[class*="rr-report__stat-value"]')
      .innerText();
    const [sbomsWith, total] = sbomsWithText
      .split("/")
      .map((s) => parseInt(s.trim(), 10));

    const addressablePackagesText = await card
      .locator('div[class*="rr-report__stat"]:has-text("Addressable packages")')
      .locator('div[class*="rr-report__stat-value"]')
      .innerText();
    const addressablePackages = parseInt(addressablePackagesText.trim(), 10);

    const progressBar = this._page.locator(
      'div[aria-label="Percent of selected SBOMs with remediations"]',
    );
    const coverageText = await progressBar.getAttribute("aria-valuenow");
    const coverage = coverageText ? parseInt(coverageText, 10) : 0;

    return { sbomsWith, total, addressablePackages, coverage };
  }

  async hasVendorRemediationsAlert(): Promise<boolean> {
    const alert = this._page.locator(
      'div.pf-v6-c-alert:has-text("remediations available")',
    );
    return await alert.isVisible();
  }

  async getPackagesTable() {
    return await Table.build(
      this._page,
      "Packages with remediations",
      [
        "Package",
        "Version",
        "Recommended version",
        "Vulnerabilities addressed",
        "Found in",
      ],
      [],
    );
  }

  async hasEmptyState(): Promise<boolean> {
    const emptyText = this._page.locator(
      'p[class*="rr-report__empty"]:has-text("None of the selected SBOMs have remediations available")',
    );
    return await emptyText.isVisible();
  }
}
