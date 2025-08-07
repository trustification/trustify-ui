// @ts-check

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { PackageDetailsPage } from "../PackageDetailsPage";

test.describe("Info Tab validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Info", async ({ page }) => {
    await PackageDetailsPage.build(page, "keycloak-core");
    // Verify
  });
});
