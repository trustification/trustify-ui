import { createBdd } from "playwright-bdd";
import { login } from "../helpers/Auth";

export const { Given, When, Then } = createBdd();

Given("User is authenticated", async ({ page }) => {
  await login(page);
});
