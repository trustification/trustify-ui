import { expect, type Locator, type Page } from "@playwright/test";

export class Pagination {
  private readonly _page: Page;
  _pagination: Locator;

  private constructor(page: Page, pagination: Locator) {
    this._page = page;
    this._pagination = pagination;
  }

  static async build(page: Page, paginationId: string) {
    const pagination = page.locator(`#${paginationId}`);
    await expect(pagination).toBeVisible();
    return new Pagination(page, pagination);
  }

  getFirstPageButton() {
    return this._pagination.locator("button[data-action='first']");
  }

  getPreviousPageButton() {
    return this._pagination.locator("button[data-action='previous']");
  }

  getNextPageButton() {
    return this._pagination.locator("button[data-action='next']");
  }

  getLastPageButton() {
    return this._pagination.locator("button[data-action='last']");
  }

  /**
   * Selects Number of rows per page on the table
   * @param perPage Number of rows
   */
  async selectItemsPerPage(perPage: 10 | 20 | 50 | 100) {
    await this._pagination
      .locator(`//button[@aria-haspopup='listbox']`)
      .click();
    await this._page
      .getByRole("menuitem", { name: `${perPage} per page` })
      .click();

    await expect(this._pagination.locator("input")).toHaveValue("1", {
      timeout: 15000,
    });
  }

  getPageInput() {
    return this._pagination.getByRole("spinbutton", { name: "Current page" });
  }
}
