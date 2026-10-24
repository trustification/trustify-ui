import type { Page } from "@playwright/test";
import { Navigation } from "../Navigation";
import { Pagination } from "../Pagination";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

export class AdvisoryListPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Advisories");

    return new AdvisoryListPage(page);
  }

  static fromCurrentPage(page: Page) {
    return new AdvisoryListPage(page);
  }

  async getToolbar() {
    return await Toolbar.build(this._page, "advisory-toolbar", {
      "Filter text": "string",
      Revision: "dateRange",
      Label: "typeahead",
    });
  }

  async getTable() {
    return await Table.build(
      this._page,
      "advisory-table",
      ["ID", "Title", "Type", "Labels", "Revision", "Vulnerabilities"],
      ["Edit labels", "Download", "Delete"],
    );
  }

  async getPagination(top: boolean = true) {
    return await Pagination.build(
      this._page,
      `advisory-table-pagination-${top ? "top" : "bottom"}`,
    );
  }
}
