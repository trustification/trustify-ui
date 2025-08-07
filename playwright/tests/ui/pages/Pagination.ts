import { expect, type Locator, type Page } from "@playwright/test";
import type { Table } from "./Table";

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

  /**
   * Selects Number of rows per page on the table
   * @param perPage Number of rows
   */
  async selectItemsPerPage(perPage: number) {
    await this._pagination
      .locator(`//button[@aria-haspopup='listbox']`)
      .click();
    await this._page
      .getByRole("menuitem", { name: `${perPage} per page` })
      .click();

    await expect(this._pagination.locator("input")).toHaveValue("1");
  }

  async validatePagination() {
    // Verify next buttons are enabled as there are more than 11 rows present
    const nextPageButton = this._pagination.locator(
      "button[data-action='next']",
    );
    await expect(nextPageButton).toBeVisible();
    await expect(nextPageButton).not.toBeDisabled();

    // Verify that previous buttons are disabled being on the first page
    const prevPageButton = this._pagination.locator(
      "button[data-action='previous']",
    );
    await expect(prevPageButton).toBeVisible();
    await expect(prevPageButton).toBeDisabled();

    // Verify that navigation button to last page is enabled
    const lastPageButton = this._pagination.locator(
      "button[data-action='last']",
    );
    await expect(lastPageButton).toBeVisible();
    await expect(lastPageButton).not.toBeDisabled();

    // Verify that navigation button to first page is disabled being on the first page
    const fistPageButton = this._pagination.locator(
      "button[data-action='first']",
    );
    await expect(fistPageButton).toBeVisible();
    await expect(fistPageButton).toBeDisabled();

    // Navigate to next page
    await nextPageButton.click();

    // Verify that previous buttons are enabled after moving to next page
    await expect(prevPageButton).toBeVisible();
    await expect(prevPageButton).not.toBeDisabled();

    // Verify that navigation button to first page is enabled after moving to next page
    await expect(fistPageButton).toBeVisible();
    await expect(fistPageButton).not.toBeDisabled();

    // Moving back to the first page
    await fistPageButton.click();
  }

  async validateItemsPerPage(columnName: string, table: Table) {
    // Verify that only 10 items are displayed
    await this.selectItemsPerPage(10);
    await table.validateNumberOfRows({ equal: 10 }, columnName);

    // Verify that items less than or equal to 20 and greater than 10 are displayed
    await this.selectItemsPerPage(20);
    await table.validateNumberOfRows(
      { greaterThan: 10, lessThan: 21 },
      columnName,
    );
  }
}
