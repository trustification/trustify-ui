import { type Locator, type Page, expect } from "@playwright/test";

export class Table<
  const TColumns extends readonly string[],
  const TActions extends readonly string[],
> {
  private readonly _page: Page;
  readonly _table: Locator;
  readonly _columns: TColumns;
  private readonly _actions: TActions;

  private constructor(
    page: Page,
    table: Locator,
    columns: TColumns,
    actions: TActions,
  ) {
    this._page = page;
    this._table = table;
    this._columns = columns;
    this._actions = actions;
  }

  /**
   * @param page
   * @param tableAriaLabel the unique aria-label that corresponds to the DOM element that contains the Table. E.g. <table aria-label="identifier"></table>
   * @returns a new instance of a Toolbar
   */
  static async build<
    const TColumns extends readonly string[],
    const TActions extends readonly string[],
  >(page: Page, tableAriaLabel: string, columns: TColumns, actions: TActions) {
    const table = page.locator(`table[aria-label="${tableAriaLabel}"]`);
    await expect(table).toBeVisible();

    const result = new Table(page, table, columns, actions);
    await result.waitUntilDataIsLoaded();
    return result;
  }

  /**
   * @param waitMs - Optional. Milliseconds to wait before checking table data.
   */
  public async waitUntilDataIsLoaded(waitMs = 500) {
    await this._page.waitForTimeout(waitMs);

    const rows = this._table.locator(
      'xpath=//tbody[not(@aria-label="Table loading")]',
    );
    await expect(rows.first()).toBeVisible();

    await expect.poll(() => rows.count()).toBeGreaterThanOrEqual(1);
  }

  async clickSortBy(columnName: TColumns[number]) {
    await this._table
      .getByRole("button", { name: columnName, exact: true })
      .click();
    await this.waitUntilDataIsLoaded();
  }

  async clickAction(actionName: TActions[number], rowIndex: number) {
    await this._table
      .locator(`button[aria-label="Kebab toggle"]`)
      .nth(rowIndex)
      .click();

    await this._page.getByRole("menuitem", { name: actionName }).click();
  }

  async expandCell(columnName: TColumns[number], rowIndex: number) {
    const column = await this.getColumn(columnName);
    await column.nth(rowIndex).getByRole("button").click();

    const expandedCell = column.nth(rowIndex + 1);
    await expect(expandedCell).toBeVisible();
    return expandedCell;
  }

  async expandRow(rowIndex: number) {
    const rows = await this.getRows();
    const row = rows.nth(rowIndex);

    const toggleButton = row.getByRole("button", { name: "Details" });
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // PatternFly expandable tables have separate tbody elements per row
    // The expanded content is in a tr.pf-v6-c-table__expandable-row within the same tbody
    const expandedRow = row.locator(
      "tr.pf-v6-c-table__expandable-row.pf-m-expanded",
    );
    await expect(expandedRow).toBeVisible();
    return expandedRow;
  }

  async getRows() {
    const rows = this._table.locator("tbody");
    await expect(rows.first()).toBeVisible();
    return rows;
  }

  async getColumn(columnName: TColumns[number]) {
    const column = this._table.locator(`td[data-label="${columnName}"]`);
    await expect(column.first()).toBeVisible();
    return column;
  }

  async getColumnHeader(columnName: TColumns[number]) {
    const columnHeader = this._table.getByRole("columnheader", {
      name: columnName,
      exact: true,
    });
    await expect(columnHeader).toBeVisible();
    return columnHeader;
  }

  /**
   * Gets the tooltip button for a column header
   * @param columnName The name of the column
   * @param tooltipMessage The tooltip text (used as the accessible name of the button)
   * @returns The tooltip button locator
   */
  getColumnTooltipButton(
    columnName: TColumns[number],
    tooltipMessage: string,
  ): Locator {
    const columnHeader = this._table.getByRole("columnheader", {
      name: new RegExp(columnName),
    });
    return columnHeader.getByRole("button", {
      name: tooltipMessage,
    });
  }

  /**
   * Gets table rows that match specific cell value(s)
   * @param cellValues An object mapping column names to expected values
   * @param exact When true, uses exact text matching instead of substring matching (default: false)
   * @returns A locator for all matching rows
   * @example
   * // Get rows where Name column contains "curl"
   * const rows = table.getRowsByCellValue({ "Name": "curl" });
   *
   * // Get rows matching multiple criteria
   * const rows = table.getRowsByCellValue({ "Name": "curl", "Version": "7.29.0" });
   *
   * // Get rows with exact version match to avoid matching "8.1.2-1" when looking for "8.1.2"
   * const rows = table.getRowsByCellValue({ "Version": "8.1.2" }, true);
   */
  async getRowsByCellValue(
    cellValues: Partial<Record<TColumns[number], string>>,
    exact: boolean = false,
  ): Promise<Locator> {
    // Start with all table rows
    let rowLocator = this._table.locator("tbody tr");

    // Filter rows based on each column-value pair
    for (const columnName of Object.keys(cellValues) as Array<
      TColumns[number]
    >) {
      const value = cellValues[columnName];
      if (exact) {
        rowLocator = rowLocator.filter({
          has: this._page.locator(`td[data-label="${columnName}"]`, {
            hasText: new RegExp(`^${value}$`),
          }),
        });
      } else {
        rowLocator = rowLocator.filter({
          has: this._page.locator(`td[data-label="${columnName}"]`, {
            hasText: value,
          }),
        });
      }
    }

    await expect(rowLocator.first()).toBeVisible();
    return rowLocator;
  }
}
