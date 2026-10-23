import type { Page } from "@playwright/test";
import { DetailsPageLayout } from "../DetailsPageLayout";
import { Navigation } from "../Navigation";
import { PackageListPage } from "../package-list/PackageListPage";

export class PackageDetailsPage {
  _layout: DetailsPageLayout;

  private constructor(_page: Page, layout: DetailsPageLayout) {
    this._layout = layout;
  }

  /**
   * Build the page object by navigating from the sidebar to the package list,
   * filtering, and clicking on the package link.
   * Use this for unit tests or when starting from scratch.
   */
  static async build(
    page: Page,
    packageDetail: { Name: string; Version?: string },
  ) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");

    const listPage = await PackageListPage.build(page);
    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    await toolbar.applyFilter({ "Filter text": packageDetail.Name });

    // Get rows matching the package name, using exact match if version is provided
    const matchingRows = await table.getRowsByCellValue(
      packageDetail,
      !!packageDetail.Version,
    );
    await matchingRows
      .getByRole("link", { name: packageDetail.Name, exact: true })
      .click();
    const layout = await DetailsPageLayout.build(page);
    await layout.verifyPageHeader(packageDetail.Name);

    return new PackageDetailsPage(page, layout);
  }

  /**
   * Build the page object from the current page state WITHOUT navigating.
   * Use this in E2E flows when the application has already navigated to this page
   * (e.g., after clicking a package link from another page).
   *
   * @param page - The Playwright page object
   * @param packageName - Optional package name to verify the page header
   */
  static async fromCurrentPage(page: Page, packageName?: string) {
    const layout = await DetailsPageLayout.build(page);

    if (packageName) {
      await layout.verifyPageHeader(packageName);
    }

    return new PackageDetailsPage(page, layout);
  }
}
