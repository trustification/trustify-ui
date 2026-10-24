import { expect, type Locator, type Page } from "@playwright/test";

export class SearchPageTabs {
  _tab: Locator;

  private constructor(tab: Locator) {
    this._tab = tab;
  }

  /**
   * Builds a SearchPageTabs instance representing a single tab
   * @param page The Playwright page
   * @param tabType The text of the tab (e.g., "SBOMs", "Packages")
   * @returns A SearchPageTabs instance for the specified tab
   */
  static async build(page: Page, tabType: string) {
    const tab = page.locator("button[role='tab']", { hasText: tabType });
    await expect(tab).toBeVisible();

    const result = new SearchPageTabs(tab);
    return result;
  }

  async click() {
    await expect(this._tab).toBeVisible();
    await this._tab.click();
  }

  getBadge() {
    return this._tab.locator(".pf-v6-c-badge");
  }
}
