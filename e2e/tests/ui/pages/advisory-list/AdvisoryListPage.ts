import type { Page } from "@playwright/test";
import { Navigation } from "../Navigation";
import { Toolbar } from "../Toolbar";
import { Table } from "../Table";
import { Pagination } from "../Pagination";

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

  async getToolbar() {
    return await Toolbar.build(this._page, "advisory-toolbar");
  }

  async getTable() {
    return await Table.build(this._page, "advisory-table");
  }

  async getPagination(top: boolean = true) {
    return await Pagination.build(
      this._page,
      `advisory-table-pagination-${top ? "top" : "bottom"}`,
    );
  }
}
