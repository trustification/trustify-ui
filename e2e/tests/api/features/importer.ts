import { expect, test } from "../fixtures";

const BASE_IMPORTER_CONFIG = {
  osv: {
    disabled: true,
    period: "1day",
    description: "GitHub Advisory Database",
    source: "https://github.com/matejnesuta/sample_advisories",
    path: "advisories",
  },
};

test.describe("Importer CRUD operations", () => {
  test("Create importer and verify it exists", async ({ axios }) => {
    const importerName = "api-test-create-importer";

    await axios
      .delete(`/api/v3/importer/${importerName}`, {
        validateStatus: () => true,
      })
      .catch(() => undefined);

    try {
      const createResponse = await axios.post(
        `/api/v3/importer/${importerName}`,
        BASE_IMPORTER_CONFIG,
      );
      expect(createResponse.status).toBe(201);

      const getResponse = await axios.get(`/api/v3/importer/${importerName}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.name).toBe(importerName);
      expect(getResponse.data.configuration.osv.source).toBe(
        BASE_IMPORTER_CONFIG.osv.source,
      );
      expect(getResponse.data.configuration.osv.disabled).toBe(true);
    } finally {
      await axios
        .delete(`/api/v3/importer/${importerName}`)
        .catch(() => undefined);
    }
  });

  test("Edit importer using PATCH request", async ({ axios }) => {
    const importerName = "api-test-patch-importer";

    await axios
      .delete(`/api/v3/importer/${importerName}`, {
        validateStatus: () => true,
      })
      .catch(() => undefined);
    await axios.post(`/api/v3/importer/${importerName}`, BASE_IMPORTER_CONFIG);

    try {
      const getResponse = await axios.get(`/api/v3/importer/${importerName}`);
      const revision = getResponse.data.revision;

      const patchResponse = await axios.patch(
        `/api/v3/importer/${importerName}`,
        { osv: { description: "Updated description via PATCH" } },
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
            "if-match": revision,
          },
        },
      );
      expect(patchResponse.status).toBe(204);

      const verifyResponse = await axios.get(
        `/api/v3/importer/${importerName}`,
      );
      expect(verifyResponse.data.configuration.osv.description).toBe(
        "Updated description via PATCH",
      );
      expect(verifyResponse.data.configuration.osv.source).toBe(
        BASE_IMPORTER_CONFIG.osv.source,
      );
    } finally {
      await axios
        .delete(`/api/v3/importer/${importerName}`)
        .catch(() => undefined);
    }
  });

  test("Edit importer using PUT request", async ({ axios }) => {
    const importerName = "api-test-put-importer";

    await axios
      .delete(`/api/v3/importer/${importerName}`, {
        validateStatus: () => true,
      })
      .catch(() => undefined);
    await axios.post(`/api/v3/importer/${importerName}`, BASE_IMPORTER_CONFIG);

    try {
      const getResponse = await axios.get(`/api/v3/importer/${importerName}`);
      const revision = getResponse.data.revision;

      const updatedConfig = {
        osv: {
          ...BASE_IMPORTER_CONFIG.osv,
          description: "Updated description via PUT",
        },
      };

      const putResponse = await axios.put(
        `/api/v3/importer/${importerName}`,
        updatedConfig,
        { headers: { "if-match": revision } },
      );
      expect(putResponse.status).toBe(204);

      const verifyResponse = await axios.get(
        `/api/v3/importer/${importerName}`,
      );
      expect(verifyResponse.data.configuration.osv.description).toBe(
        "Updated description via PUT",
      );
    } finally {
      await axios
        .delete(`/api/v3/importer/${importerName}`)
        .catch(() => undefined);
    }
  });

  test("Delete importer and verify it is no longer present", async ({
    axios,
  }) => {
    const importerName = "api-test-delete-importer";

    await axios
      .delete(`/api/v3/importer/${importerName}`, {
        validateStatus: () => true,
      })
      .catch(() => undefined);
    await axios.post(`/api/v3/importer/${importerName}`, BASE_IMPORTER_CONFIG);

    const beforeDeleteResponse = await axios.get(
      `/api/v3/importer/${importerName}`,
    );
    expect(beforeDeleteResponse.status).toBe(200);

    const deleteResponse = await axios.delete(
      `/api/v3/importer/${importerName}`,
    );
    expect(deleteResponse.status).toBe(204);

    const notFoundResponse = await axios.get(
      `/api/v3/importer/${importerName}`,
      { validateStatus: () => true },
    );
    expect(notFoundResponse.status).toBe(404);
  });
});
