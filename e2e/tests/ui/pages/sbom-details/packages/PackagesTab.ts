import type { Page } from "@playwright/test";
import { SbomDetailsPage } from "../SbomDetailsPage";
import { Toolbar } from "../../Toolbar";
import { Table } from "../../Table";
import { Pagination } from "../../Pagination";

export class PackagesTab {
  private readonly _page: Page;
  _detailsPage: SbomDetailsPage;

  private constructor(page: Page, layout: SbomDetailsPage) {
    this._page = page;
    this._detailsPage = layout;
  }

  static async build(page: Page, sbomName: string) {
    const detailsPage = await SbomDetailsPage.build(page, sbomName);
    await detailsPage._layout.selectTab("Packages");

    return new PackagesTab(page, detailsPage);
  }

  async getToolbar() {
    return await Toolbar.build(this._page, "Package toolbar");
  }

  async getTable() {
    return await Table.build(this._page, "Package table");
  }

  async getPagination(top: boolean = true) {
    return await Pagination.build(
      this._page,
      `package-table-pagination-${top ? "top" : "bottom"}`,
    );
  }
}
