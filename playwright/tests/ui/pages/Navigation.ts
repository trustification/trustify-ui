import type { Page } from "playwright-core";

/**
 * Used to navigate to different pages
 */
export class Navigation {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    return new Navigation(page);
  }

  async goToSidebar(
    menu:
      | "Dashboard"
      | "Search"
      | "SBOMs"
      | "Vulnerabilities"
      | "Packages"
      | "Advisories"
      | "Importers"
      | "Upload",
  ) {
    // By default, we do not initialize navigation at "/"" where the Dashboard is located
    // This should help us to save some time loading pages as the Dashboard fetches too much data
    await this._page.goto("/upload");
    await this._page.getByRole("link", { name: menu }).click();
  }
}
