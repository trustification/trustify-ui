import { expect, test } from "../fixtures";
import {
  testBasicSort,
  validateDateSorting,
  validateStringSorting,
} from "../helpers/sorting-helpers";

test.skip("List first 10 sboms by name - vanilla", async ({ axios }) => {
  const vanillaResponse = await axios.get(
    "/api/v3/sbom?limit=10&offset=0&sort=name:asc",
  );
  expect(vanillaResponse.data).toEqual(
    expect.objectContaining({
      total: 6,
    }),
  );
});

test("Sort SBOMs by name ascending", async ({ axios }) => {
  const items = await testBasicSort(axios, "/api/v3/sbom", "name", "asc");
  validateStringSorting(items, "name", "ascending");
});

test("Sort SBOMs by name descending", async ({ axios }) => {
  const items = await testBasicSort(axios, "/api/v3/sbom", "name", "desc");
  validateStringSorting(items, "name", "descending");
});

test("Sort SBOMs by published date ascending", async ({ axios }) => {
  const items = await testBasicSort(axios, "/api/v3/sbom", "published", "asc");
  validateDateSorting(items, "published", "ascending");
});

test("Sort SBOMs by published date descending", async ({ axios }) => {
  const items = await testBasicSort(axios, "/api/v3/sbom", "published", "desc");
  validateDateSorting(items, "published", "descending");
});
