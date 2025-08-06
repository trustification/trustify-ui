import { expect, type Page } from "@playwright/test";

export const login = async (page: Page) => {
  const shouldLogin = process.env.TRUSTIFY_AUTH_ENABLED;

  if (shouldLogin === "true") {
    const userName = process.env.TRUSTIFY_AUTH_USER ?? "admin";
    const userPassword = process.env.TRUSTIFY_AUTH_PASSWORD ?? "admin";

    await page.goto("/upload");

    await page.fill('input[name="username"]:visible', userName);
    await page.fill('input[name="password"]:visible', userPassword);
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { name: "Upload" })).toHaveCount(1); // Ensure login was successful
  }
};
