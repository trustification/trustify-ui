// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

test.describe("DonutChart validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Vulnerabilities", async ({ page }) => {
    await VulnerabilitiesTab.build(page, "quarkus-bom");

    await expect(page.locator("#legend-labels-0")).toContainText("Critical: 0");
    await expect(page.locator("#legend-labels-1")).toContainText("High: 1");
    await expect(page.locator("#legend-labels-2")).toContainText("Medium: 9");
    await expect(page.locator("#legend-labels-3")).toContainText("Low: 0");
    await expect(page.locator("#legend-labels-4")).toContainText("None: 1");
    await expect(page.locator("#legend-labels-5")).toContainText("Unknown: 0");
  });
});
