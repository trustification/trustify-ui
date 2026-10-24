import { expect, test } from "../fixtures";
import {
  deleteSboms,
  getFullSbomPaths,
  uploadFiles,
} from "../helpers/general-helpers";
import { logger } from "../../common/constants";

// SBOMs to upload
const sbomDir = "tests/common/assets/sbom";

const sbomSingle = ["cnv-4.17-product-older.json.bz2"];

const sbomsMultiple = [
  "cnv-4.17-index-older.json.bz2",
  "cnv-4.17-binary-1-older.json.bz2",
  "cnv-4.17-binary-2-older.json.bz2",
  "cnv-4.17-product-latest.json.bz2",
  "cnv-4.17-index-latest.json.bz2",
  "cnv-4.17-binary-1-latest.json.bz2",
  "cnv-4.17-binary-2-latest.json.bz2",
];

test.describe("SBOM / Delete", () => {
  test.describe.configure({ mode: "serial" });

  const sbomIdsDelete: string[] = [];

  test.afterAll(async ({ axios }) => {
    await deleteSboms(axios, sbomIdsDelete);
  });

  test("Single existing SBOM", async ({ axios }) => {
    const fullSbomPaths = getFullSbomPaths(sbomDir, sbomSingle);
    const sbomIdSingle = await uploadFiles(axios, "sbom", fullSbomPaths);
    sbomIdsDelete.push(...sbomIdSingle);

    // Delete the SBOM
    const response = await axios.delete(
      `/api/v3/sbom/${encodeURIComponent(sbomIdSingle[0])}`,
    );
    if (response.status !== 204) {
      logger.error(
        `Delete single existing SBOM failed with status ${response.status}:`,
        response.data,
      );
    }
    expect(response.status).toBe(204);

    // Verify that the SBOM is deleted
    const getResponse = await axios.get(
      `/api/v3/sbom/${encodeURIComponent(sbomIdSingle[0])}`,
      { validateStatus: null },
    );
    expect(getResponse.status).toBe(404);
  });

  test("Multiple existing SBOMs", async ({ axios }) => {
    const fullSbomPaths = getFullSbomPaths(sbomDir, sbomsMultiple);
    const sbomIdsMultiple = await uploadFiles(axios, "sbom", fullSbomPaths);
    sbomIdsDelete.push(...sbomIdsMultiple);

    const response = await axios.delete("/api/v3/sbom", {
      data: sbomIdsMultiple,
    });
    if (response.status !== 204) {
      logger.error(
        `Delete multiple existing SBOMs failed with status ${response.status}:`,
        response.data,
      );
    }
    expect(response.status).toBe(204);

    // Verify that all SBOMs are deleted
    for (const id of sbomIdsMultiple) {
      const getResponse = await axios.get(
        `/api/v3/sbom/${encodeURIComponent(id)}`,
        { validateStatus: null },
      );
      expect(getResponse.status).toBe(404);
    }
  });

  test("Single non-existent SBOM", async ({ axios }) => {
    const nonExistentId = Array.from(
      { length: 45 },
      () =>
        "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)],
    ).join("");

    const response = await axios.delete(
      `/api/v3/sbom/${encodeURIComponent(nonExistentId)}`,
      { validateStatus: null },
    );
    if (response.status !== 204) {
      logger.error(
        `Delete single non-existent SBOM failed with status ${response.status}:`,
        response.data,
      );
    }
    expect(response.status).toBe(204);
  });

  test("Multiple non-existent SBOMs", async ({ axios }) => {
    const nonExistentIds = Array.from({ length: 7 }, () =>
      Array.from(
        { length: 45 },
        () =>
          "abcdefghijklmnopqrstuvwxyz0123456789"[
            Math.floor(Math.random() * 36)
          ],
      ).join(""),
    );

    const response = await axios.delete("/api/v3/sbom", {
      data: nonExistentIds,
      validateStatus: null,
    });
    if (response.status !== 204) {
      logger.error(
        `Delete multiple non-existent SBOMs failed with status ${response.status}:`,
        response.data,
      );
    }
    expect(response.status).toBe(204);
  });
});
