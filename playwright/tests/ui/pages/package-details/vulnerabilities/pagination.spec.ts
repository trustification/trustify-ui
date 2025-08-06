// @ts-check

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

// Number of items less than 10, cannot tests pagination
test.describe.skip("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Navigation button validations", async ({ page }) => {
    const vulnerabilitiesTab = await VulnerabilitiesTab.build(
      page,
      "keycloak-core",
    );
    const pagination = await vulnerabilitiesTab.getPagination();

    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const vulnerabilitiesTab = await VulnerabilitiesTab.build(
      page,
      "keycloak-core",
    );

    const pagination = await vulnerabilitiesTab.getPagination();
    const table = await vulnerabilitiesTab.getTable();

    await pagination.validateItemsPerPage("ID", table);
  });
});
