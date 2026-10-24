import { expect, type Locator, type Page } from "@playwright/test";

export class FilterCard {
  private readonly _page: Page;
  readonly _filterCard: Locator;

  private constructor(page: Page, card: Locator) {
    this._page = page;
    this._filterCard = card;
  }

  private get _card() {
    return this._filterCard;
  }

  /**
   * @param page
   * @param cardAriaLabel the unique aria-label that corresponds to the Filter panel. E.g. <div aria-label="Filter panel"></div>
   * @returns a new instance of a FilterCard
   */
  static async build(page: Page, cardAriaLabel: string) {
    const card = page.locator(`[aria-label="${cardAriaLabel}"]`);
    await expect(card).toBeVisible();
    return new FilterCard(page, card);
  }

  static async buildFromLocator(page: Page, cardLocator: Locator) {
    await expect(cardLocator).toBeVisible();
    return new FilterCard(page, cardLocator);
  }

  /**
   * Clears all filters inside the filter card
   */
  async clearAllFilters() {
    await this._card.getByRole("button", { name: "Clear all filters" }).click();
  }

  /**
   * Applies a date range filter (Created on, Revision, etc.)
   */
  async applyDateRangeFilter(fromDate: string, toDate: string) {
    await this._card
      .locator("input[aria-label='Interval start']")
      .fill(fromDate);
    const toInput = this._card.locator("input[aria-label='Interval end']");
    if (await toInput.isEnabled()) {
      await toInput.fill(toDate);
    }
    // Verify values
    await expect(
      this._card.locator("input[aria-label='Interval start']"),
    ).toHaveValue(fromDate);
    if (await toInput.isEnabled()) {
      await expect(toInput).toHaveValue(toDate);
    }
  }

  /**
   * Applies a checkbox-based filter (Type, Architecture, CVSS)
   */
  async applyCheckboxFilter(sectionName: string, options: string[]) {
    const section = this._card.locator("h4", { hasText: sectionName });
    await expect(section).toBeVisible();
    for (const option of options) {
      // Find the checkbox by its label text
      const checkboxLabel = this._card.getByRole("checkbox", { name: option });
      await expect(checkboxLabel).toBeVisible();

      // Check if not already checked
      const isChecked = await checkboxLabel.isChecked();
      if (!isChecked) {
        await checkboxLabel.click();
        await expect(checkboxLabel).toBeChecked();
      }
    }
  }

  /**
   * Applies a label filter (autocomplete input)
   */
  async applyLabelFilter(labels: string[]) {
    const input = this._card.getByRole("combobox", {
      name: "select-autocomplete-listbox",
    });
    for (const label of labels) {
      await input.fill(label);
      const option = this._page.getByRole("option", { name: label });
      await expect(option).toBeVisible();
      await option.click();
    }
  }
}
