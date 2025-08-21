import type { Page } from "@playwright/test";
import { AdvisoryDetailsPage } from "../AdvisoryDetailsPage";
import { Toolbar } from "../../Toolbar";
import { Table } from "../../Table";
import { Pagination } from "../../Pagination";

export class VulnerabilitiesTab {
  private readonly _page: Page;
  _detailsPage: AdvisoryDetailsPage;

  private constructor(page: Page, layout: AdvisoryDetailsPage) {
    this._page = page;
    this._detailsPage = layout;
  }

  static async build(page: Page, packageName: string) {
    const detailsPage = await AdvisoryDetailsPage.build(page, packageName);
    await detailsPage._layout.selectTab("Vulnerabilities");

    return new VulnerabilitiesTab(page, detailsPage);
  }

  async getToolbar() {
    return await Toolbar.build(this._page, "vulnerability toolbar");
  }

  async getTable() {
    return await Table.build(this._page, "vulnerability table");
  }

  async getPagination(top: boolean = true) {
    return await Pagination.build(
      this._page,
      `vulnerability-table-pagination-${top ? "top" : "bottom"}`,
    );
  }
}
