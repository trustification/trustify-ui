import type { Page } from "@playwright/test";
import { Navigation } from "../Navigation";
import { Toolbar } from "../Toolbar";
import { Table } from "../Table";
import { Pagination } from "../Pagination";

export class PackageListPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");

    return new PackageListPage(page);
  }

  static fromCurrentPage(page: Page) {
    return new PackageListPage(page);
  }

  async getToolbar() {
    return await Toolbar.build(this._page, "package-toolbar", {
      "Filter text": "string",
      Type: "multiSelect",
      Architecture: "multiSelect",
      License: "typeahead",
    });
  }

  async getTable() {
    return await Table.build(
      this._page,
      "Package table",
      [
        "Name",
        "Namespace",
        "Version",
        "Type",
        "Licenses",
        "Path",
        "Qualifiers",
        "Vulnerabilities",
      ],
      [],
    );
  }

  async getPagination(top: boolean = true) {
    return await Pagination.build(
      this._page,
      `package-table-pagination-${top ? "top" : "bottom"}`,
    );
  }
}
