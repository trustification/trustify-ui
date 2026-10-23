import type { Locator, Page } from "@playwright/test";

import { expect } from "../../../assertions";

import { Pagination } from "../../Pagination";
import { Table } from "../../Table";
import { Toolbar } from "../../Toolbar";
import { SbomDetailsPage } from "../SbomDetailsPage";

export class VulnerabilitiesTab {
  private readonly _page: Page;
  private readonly _detailsPage: SbomDetailsPage;

  private constructor(page: Page, layout: SbomDetailsPage) {
    this._page = page;
    this._detailsPage = layout;
  }

  /**
   * Build the tab by navigating to the SBOM details page and selecting the tab.
   */
  static async build(page: Page, sbomName: string) {
    const detailsPage = await SbomDetailsPage.build(page, sbomName);
    await detailsPage._layout.selectTab("Vulnerabilities");

    return new VulnerabilitiesTab(page, detailsPage);
  }

  /**
   * Build the tab from the current page state WITHOUT navigating.
   * @param page - The Playwright page object
   * @param sbomName - Optional SBOM name to verify the page header
   */
  static async fromCurrentPage(page: Page, sbomName?: string) {
    const detailsPage = await SbomDetailsPage.fromCurrentPage(page, sbomName);
    return new VulnerabilitiesTab(page, detailsPage);
  }

  async getToolbar() {
    return await Toolbar.build(this._page, "Vulnerability toolbar");
  }

  async getTable() {
    return await Table.build(
      this._page,
      "Vulnerability table",
      [
        "Id",
        "Description",
        "CVSS",
        "Affected dependencies",
        "Remediations",
        "Published",
        "Updated",
      ],
      [],
    );
  }

  async clickSourcesButton(vulnerabilityID: string) {
    const pagination = await this.getPagination();
    await pagination.selectItemsPerPage(20);
    const table = await this.getTable();
    const rows = await table.getRowsByCellValue({ Id: vulnerabilityID });
    const sourcesButton = rows.getByRole("button", { name: /Sources/i });
    await sourcesButton.click();
  }

  /**
   * Returns the tbody that contains the row for the given vulnerability.
   */
  private async getVulnerabilityRow(vulnerabilityId: string): Promise<Locator> {
    const table = await this.getTable();
    const row = table._table.locator("tbody").filter({
      has: this._page.getByRole("link", {
        name: vulnerabilityId,
        exact: true,
      }),
    });
    await expect(row.first()).toBeVisible();
    return row.first();
  }

  /**
   * Expands the compound "Affected dependencies" cell of the given vulnerability
   * row (idempotent) and returns the nested affected-dependencies sub-table,
   * where the per-dependency "Remediations" chips are rendered.
   */
  async expandAffectedDependencies(vulnerabilityId: string): Promise<Locator> {
    const row = await this.getVulnerabilityRow(vulnerabilityId);
    const subTable = row.locator("table").first();

    if (!(await subTable.isVisible())) {
      await row
        .locator('td[data-label="Affected dependencies"]')
        .getByRole("button")
        .click();
    }

    await expect(subTable).toBeVisible();
    return subTable;
  }

  /**
   * Expands the affected-dependencies sub-table for the given vulnerability and
   * returns the dependency row for the given package, where its remediation
   * chips can be asserted.
   */
  async getAffectedDependencyRow(
    vulnerabilityId: string,
    packageName: string,
  ): Promise<Locator> {
    const subTable = await this.expandAffectedDependencies(vulnerabilityId);
    const dependencyRow = subTable.locator("tbody tr").filter({
      has: this._page.getByRole("link", {
        name: packageName,
        exact: true,
      }),
    });
    await expect(dependencyRow.first()).toBeVisible();
    return dependencyRow.first();
  }

  /**
   * Returns the remediation chip labels rendered in the "Remediations" cell of the
   * given package's affected-dependency row. Use to assert the exact set of
   * recommended versions (count + values).
   */
  async getAffectedDependencyRemediations(
    vulnerabilityId: string,
    packageName: string,
  ): Promise<Locator> {
    const dependencyRow = await this.getAffectedDependencyRow(
      vulnerabilityId,
      packageName,
    );
    return dependencyRow.locator("td").last().locator(".pf-v6-c-label");
  }

  async getPagination(top: boolean = true) {
    return await Pagination.build(
      this._page,
      `vulnerability-table-pagination-${top ? "top" : "bottom"}`,
    );
  }
}
