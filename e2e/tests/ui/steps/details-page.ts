import { createBdd } from "playwright-bdd";
import { DetailsPage } from "../helpers/DetailsPage";

export const { Given, When, Then } = createBdd();

Then("The page title is {string}", async ({ page }, title) => {
  const pageWithTabs = new DetailsPage(page);
  await pageWithTabs.verifyPageHeader(title);
});

Then("Tab {string} is selected", async ({ page }, tabName) => {
  const pageWithTabs = new DetailsPage(page);
  await pageWithTabs.verifyTabIsSelected(tabName);
});

Then("Tab {string} is visible", async ({ page }, tabName) => {
  const pageWithTabs = new DetailsPage(page);
  await pageWithTabs.verifyTabIsVisible(tabName);
});

Then("Tab {string} is not visible", async ({ page }, tabName) => {
  const pageWithTabs = new DetailsPage(page);
  await pageWithTabs.verifyTabIsNotVisible(tabName);
});

When("User selects the Tab {string}", async ({ page }, tabName) => {
  const detailsPage = new DetailsPage(page);
  await detailsPage.selectTab(tabName);
});
