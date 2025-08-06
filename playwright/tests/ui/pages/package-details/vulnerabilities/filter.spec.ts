// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

// Table does not have filters
test.describe.skip("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    await VulnerabilitiesTab.build(page, "keycloak-core");
  });
});
