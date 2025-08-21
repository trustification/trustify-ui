import { expect, type Locator, type Page } from "@playwright/test";

export class Toolbar {
  private readonly _page: Page;
  _toolbar: Locator;

  private constructor(page: Page, toolbar: Locator) {
    this._page = page;
    this._toolbar = toolbar;
  }

  /**
   * @param page
   * @param toolbarAriaLabel the unique aria-label that corresponds to the DOM element that contains the Toolbar. E.g. <div aria-label="identifier"></div>
   * @returns a new instance of a Toolbar
   */
  static async build(page: Page, toolbarAriaLabel: string) {
    const toolbar = page.locator(`[aria-label="${toolbarAriaLabel}"]`);
    await expect(toolbar).toBeVisible();
    return new Toolbar(page, toolbar);
  }

  /**
   * Selects the main filter to be applied
   * @param filterName the name of the filter as rendered in the UI
   */
  async selectFilter(filterName: string) {
    await this._toolbar
      .locator(".pf-m-toggle-group button.pf-v6-c-menu-toggle")
      .click();
    await this._page.getByRole("menuitem", { name: filterName }).click();
  }

  private async assertFilterHasLabels(
    filterName: string,
    filterValue: string | string[],
  ) {
    await expect(
      this._toolbar.locator(".pf-m-label-group", { hasText: filterName }),
    ).toBeVisible();

    const labels = Array.isArray(filterValue) ? filterValue : [filterValue];
    for (const label of labels) {
      await expect(
        this._toolbar.locator(".pf-m-label-group", { hasText: label }),
      ).toBeVisible();
    }
  }

  async applyTextFilter(filterName: string, filterValue: string) {
    await this.selectFilter(filterName);

    await this._toolbar.getByRole("textbox").fill(filterValue);
    await this._page.keyboard.press("Enter");

    await this.assertFilterHasLabels(filterName, filterValue);
  }

  async applyDateRangeFilter(
    filterName: string,
    fromDate: string,
    toDate: string,
  ) {
    await this.selectFilter(filterName);

    await this._toolbar
      .locator("input[aria-label='Interval start']")
      .fill(fromDate);
    await this._toolbar
      .locator("input[aria-label='Interval end']")
      .fill(toDate);

    await this.assertFilterHasLabels(filterName, [fromDate, toDate]);
  }

  async applyMultiSelectFilter(filterName: string, selections: string[]) {
    await this.selectFilter(filterName);

    for (const option of selections) {
      const inputText = this._toolbar.locator(
        "input[aria-label='Type to filter']",
      );
      await inputText.clear();
      await inputText.fill(option);

      const dropdownOption = this._page.getByRole("menuitem", { name: option });
      await expect(dropdownOption).toBeVisible();
      await dropdownOption.click();
    }

    await this.assertFilterHasLabels(filterName, selections);
  }

  async applyLabelsFilter(filterName: string, labels: string[]) {
    await this.selectFilter(filterName);

    for (const label of labels) {
      await this._toolbar
        .locator("input[aria-label='select-autocomplete-listbox']")
        .fill(label);

      const dropdownOption = this._page.getByRole("option", { name: label });
      await expect(dropdownOption).toBeVisible();
      await dropdownOption.click();
    }

    await this.assertFilterHasLabels(filterName, labels);
  }
}
