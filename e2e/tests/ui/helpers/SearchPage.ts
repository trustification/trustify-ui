import type { Page } from "@playwright/test";
import { DetailsPage } from "./DetailsPage";

export class SearchPage {
  page: Page;
  menu: string;

  constructor(page: Page, menu: string) {
    this.page = page;
    this.menu = menu;
  }

  /**
   * Searches for an item from the Search view
   * @param type Type of item to search for, corresponds with the tabs in the Search view (SBOMs, Packages, Vulnerabilities, Advisories)
   * @param data Search data to filter
   */
  async generalSearch(type: string, data: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Search" }).click();
    const detailsPage = new DetailsPage(this.page);
    await detailsPage.waitForData();
    await detailsPage.verifyDataAvailable();
    await this.page
      .getByPlaceholder(
        "Search for an SBOM, Package, Advisory, or Vulnerability",
      )
      .click();
    await this.page
      .getByPlaceholder(
        "Search for an SBOM, Package, Advisory, or Vulnerability",
      )
      .fill(data);
    await this.page
      .getByPlaceholder(
        "Search for an SBOM, Package, Advisory, or Vulnerability",
      )
      .press("Enter");
    await detailsPage.selectTab(type);
  }

  /**
   * Navigates to given menu option and filters data
   * @param menu Option from Vertical navigation menu
   * @param data Search data to filter
   */
  async dedicatedSearch(data: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: `${this.menu}` }).click();
    const detailsPage = new DetailsPage(this.page);
    await detailsPage.waitForData();
    await detailsPage.verifyDataAvailable();
    await this.page.getByPlaceholder("Search").click();
    await this.page.getByPlaceholder("Search").fill(data);
    await this.page.getByPlaceholder("Search").press("Enter");
    await detailsPage.verifyDataAvailable();
  }
}
