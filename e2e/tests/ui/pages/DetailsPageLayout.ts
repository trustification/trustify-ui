import { expect, type Page } from "@playwright/test";

export class DetailsPageLayout {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toBeVisible();
    return new DetailsPageLayout(page);
  }

  async selectTab(tabName: string) {
    const tab = this._page.locator("button[role='tab']", { hasText: tabName });
    await expect(tab).toBeVisible();
    await tab.click();
  }

  async clickOnPageAction(actionName: string) {
    await this._page.getByRole("button", { name: "Actions" }).click();
    await this._page.getByRole("menuitem", { name: actionName }).click();
  }

  async verifyPageHeader(header: string) {
    await expect(this._page.getByRole("heading")).toContainText(header);
  }

  async verifyTabIsSelected(tabName: string) {
    await expect(
      this._page.getByRole("tab", { name: tabName }),
    ).toHaveAttribute("aria-selected", "true");
  }

  async verifyTabIsVisible(tabName: string) {
    await expect(this._page.getByRole("tab", { name: tabName })).toBeVisible();
  }

  async verifyTabIsNotVisible(tabName: string) {
    await expect(this._page.getByRole("tab", { name: tabName })).toHaveCount(0);
  }
}
