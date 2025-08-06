import type { Page } from "@playwright/test";
import { DetailsPageLayout } from "../DetailsPageLayout";
import { Navigation } from "../Navigation";
import { PackageListPage } from "../package-list/PackageListPage";

export class PackageDetailsPage {
  _layout: DetailsPageLayout;

  private constructor(_page: Page, layout: DetailsPageLayout) {
    this._layout = layout;
  }

  static async build(page: Page, packageName: string) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");

    const listPage = await PackageListPage.build(page);
    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    await toolbar.applyTextFilter("Filter text", packageName);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", packageName);

    await page.getByRole("link", { name: packageName, exact: true }).click();

    const layout = await DetailsPageLayout.build(page);
    await layout.verifyPageHeader(packageName);

    return new PackageDetailsPage(page, layout);
  }
}
