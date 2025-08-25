// @ts-check

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import { SbomListPage } from "./SbomListPage";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Navigation button validations", async ({ page }) => {
    const listPage = await SbomListPage.build(page);
    const pagination = await listPage.getPagination();

    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const listPage = await SbomListPage.build(page);

    const pagination = await listPage.getPagination();
    const table = await listPage.getTable();

    await pagination.validateItemsPerPage("Name", table);
  });
});
