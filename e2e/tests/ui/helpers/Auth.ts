import { expect, type Page } from "@playwright/test";
import {
  AUTH_PASSWORD,
  AUTH_REQUIRED,
  AUTH_USER,
} from "../../common/constants";

export const login = async (page: Page) => {
  if (AUTH_REQUIRED === "true") {
    const userName = AUTH_USER;
    const userPassword = AUTH_PASSWORD;

    await page.goto("/upload");

    await page.fill('input[name="username"]:visible', userName);
    await page.fill('input[name="password"]:visible', userPassword);
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { name: "Upload" })).toHaveCount(1); // Ensure login was successful
  }
};
