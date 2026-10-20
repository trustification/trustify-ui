import path from "node:path";

import { test } from "../../fixtures";
import { login } from "../../helpers/Auth";
import {
  testInvalidFileExtensions,
  testRemoveFiles,
  testUploadApiErrorMessage,
  testUploadFilesParallel,
  testUploadFilesSequentially,
} from "../common/upload-test-helpers";
import { SBOMUploadPage } from "./SBOMUploadPage";

// The dataset SBOMs below are ingested by `global.setup` before the UI tests
// run, so re-uploading them from the UI is reported by the server as a
// duplicate and rendered with the `warning` status.
const TEST_FILES = {
  QUARKUS_BOM: path.join(
    __dirname,
    "../../../common/dataset/sbom/quarkus-bom-2.13.8.Final-redhat-00004.json.bz2",
  ),
  UBI9_MINIMAL: path.join(
    __dirname,
    "../../../common/dataset/sbom/ubi9-minimal-9.3-1361.json.bz2",
  ),
  INVALID_JSON: path.join(
    __dirname,
    "../../../common/assets/invalid-file.json",
  ),
  INVALID_TXT: path.join(__dirname, "../../../common/assets/invalid-file.txt"),
};

test.describe("File Upload", { tag: ["@upload"] }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  testUploadFilesSequentially("SBOM file (.bz2)", {
    files: [
      {
        path: TEST_FILES.QUARKUS_BOM,
        status: "warning",
      },
    ],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testUploadFilesSequentially("Invalid file", {
    files: [
      {
        path: TEST_FILES.INVALID_JSON,
        status: "danger",
      },
    ],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testUploadFilesSequentially("additional files after initial completes", {
    files: [
      {
        path: TEST_FILES.QUARKUS_BOM,
        status: "warning",
      },
      {
        path: TEST_FILES.UBI9_MINIMAL,
        status: "warning",
      },
    ],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testUploadFilesParallel("multiple files simultaneously", {
    files: [
      {
        path: TEST_FILES.QUARKUS_BOM,
        status: "warning",
      },
      {
        path: TEST_FILES.UBI9_MINIMAL,
        status: "warning",
      },
    ],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testUploadFilesParallel("mix of success and failed uploads", {
    files: [
      {
        path: TEST_FILES.QUARKUS_BOM,
        status: "warning",
      },
      {
        path: TEST_FILES.UBI9_MINIMAL,
        status: "warning",
      },
      {
        path: TEST_FILES.INVALID_JSON,
        status: "danger",
      },
    ],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testRemoveFiles({
    files: [
      {
        path: TEST_FILES.QUARKUS_BOM,
        status: "warning",
      },
      {
        path: TEST_FILES.UBI9_MINIMAL,
        status: "warning",
      },
      {
        path: TEST_FILES.INVALID_JSON,
        status: "danger",
      },
    ],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testInvalidFileExtensions({
    filesPaths: [TEST_FILES.INVALID_TXT],
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testUploadApiErrorMessage("displays API error message for SBOM", {
    filePath: TEST_FILES.INVALID_JSON,
    apiRoutePattern: "**/api/v3/sbom",
    errorResponseBody: {
      error: "InvalidFormat",
      message: "expected CycloneDX or SPDX document",
    },
    expectedErrorMessage: "InvalidFormat: expected CycloneDX or SPDX document",
    getConfig: async ({ page }) => {
      const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
      const fileUploader = await uploadPage.getFileUploader();
      return { fileUploader };
    },
  });

  testUploadApiErrorMessage(
    "displays validation finding messages for ValidationRejected SBOM",
    {
      filePath: TEST_FILES.INVALID_JSON,
      apiRoutePattern: "**/api/v3/sbom",
      httpStatus: 422,
      errorResponseBody: {
        error: "ValidationRejected",
        message: "document rejected by validation",
        validation: [
          {
            validator: "scheck",
            findings: [
              { severity: "fatal", message: "missing field 'SPDXID'" },
            ],
            outcome: "failed",
          },
        ],
      },
      expectedErrorMessage:
        "ValidationRejected: document rejected by validation\nmissing field 'SPDXID'",
      getConfig: async ({ page }) => {
        const uploadPage = await SBOMUploadPage.buildFromBrowserPath(page);
        const fileUploader = await uploadPage.getFileUploader();
        return { fileUploader };
      },
    },
  );
});
