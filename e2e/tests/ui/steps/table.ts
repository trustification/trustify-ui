import { createBdd } from "playwright-bdd";

export const { Given, When, Then } = createBdd();

When("User clear all filters", async ({ page }) => {
  await page.getByText("Clear all filters").click();
});

// Add reusable table actions like pagination
