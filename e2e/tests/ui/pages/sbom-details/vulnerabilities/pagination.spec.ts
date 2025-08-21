// @ts-check

import { test } from "../../../fixtures";
import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Navigation button validations", async ({ page }) => {
    const vulnerabilityTab = await VulnerabilitiesTab.build(
      page,
      "quarkus-bom",
    );
    const pagination = await vulnerabilityTab.getPagination();

    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const packageTab = await VulnerabilitiesTab.build(page, "quarkus-bom");

    const pagination = await packageTab.getPagination();
    const table = await packageTab.getTable();

    await pagination.validateItemsPerPage("Id", table);
  });
});
