import { expect, test } from "../fixtures";

test.skip("List first 10 sboms by name - vanilla", async ({ axios }) => {
  const vanillaResponse = await axios.get(
    "/api/v2/sbom?limit=10&offset=0&sort=name:asc",
  );
  expect(vanillaResponse.data).toEqual(
    expect.objectContaining({
      total: 6,
    }),
  );
});
