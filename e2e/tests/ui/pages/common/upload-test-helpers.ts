// @ts-check

import type { Page } from "@playwright/test";

import path from "node:path";
import type { FileUploadItemStatus } from "../../assertions/FileUploadMatchers";
import { expect } from "../../assertions";
import { test } from "../../fixtures";
import type { FileUpload } from "../FileUpload";

/**
 * Configuration for filter test helpers
 */
export interface UploadTestConfig {
  fileUploader: FileUpload;
}

/**
 * A file to upload and the status the uploader is expected to report for it.
 *
 * Note: documents that are already ingested in the instance under test - e.g.
 * every file under `tests/common/dataset`, which `global.setup` uploads before
 * the UI tests run - are reported by the server as duplicates, so the uploader
 * renders them with the `warning` status instead of `success`.
 */
interface UploadTestFile {
  path: string;
  status: FileUploadItemStatus;
  /** Defaults to the duplicate message for files expected to be duplicates */
  message?: string;
}

/** Tail of the message both upload pages render for a duplicate document */
const DUPLICATE_MESSAGE = "already uploaded";

const expectedMessage = (file: UploadTestFile) =>
  file.message ?? (file.status === "warning" ? DUPLICATE_MESSAGE : undefined);

export const testUploadFilesParallel = (
  testName: string,
  {
    files,
    getConfig,
  }: {
    files: UploadTestFile[];
    getConfig: ({ page }: { page: Page }) => Promise<UploadTestConfig>;
  },
) =>
  test(`Upload parallel - ${testName}`, async ({ page }) => {
    const config = await getConfig({ page });
    const fileUploader = config.fileUploader;

    await fileUploader.uploadFiles(files.map((e) => e.path));

    // Summary status
    await expect(fileUploader).toHaveSummaryUploadStatus({
      totalFiles: files.length,
      successfulFiles: files.filter((e) => e.status === "success").length,
      duplicateFiles: files.filter((e) => e.status === "warning").length,
    });

    // File status
    for (const file of files) {
      const fileName = path.basename(file.path);
      await expect(fileUploader).toHaveItemUploadStatus({
        fileName,
        status: file.status,
        message: expectedMessage(file),
      });
    }
  });

export const testUploadFilesSequentially = (
  testName: string,
  {
    files,
    getConfig,
  }: {
    files: UploadTestFile[];
    getConfig: ({ page }: { page: Page }) => Promise<UploadTestConfig>;
  },
) =>
  test(`Upload sequentially- ${testName}`, async ({ page }) => {
    const config = await getConfig({ page });
    const fileUploader = config.fileUploader;

    let successfulFilesCount = 0;
    let duplicateFilesCount = 0;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file.status === "success") {
        successfulFilesCount++;
      } else if (file.status === "warning") {
        duplicateFilesCount++;
      }

      // Upload file
      await fileUploader.uploadFiles([file.path]);

      // Summary status
      if (successfulFilesCount + duplicateFilesCount > 0) {
        await expect(fileUploader).toHaveSummaryUploadStatus({
          totalFiles: index + 1,
          successfulFiles: successfulFilesCount,
          duplicateFiles: duplicateFilesCount,
        });
      }

      // File status
      const fileName = path.basename(file.path);
      await expect(fileUploader).toHaveItemUploadStatus({
        fileName,
        status: file.status,
        message: expectedMessage(file),
      });
    }
  });

export const testRemoveFiles = ({
  files,
  getConfig,
}: {
  files: UploadTestFile[];
  getConfig: ({ page }: { page: Page }) => Promise<UploadTestConfig>;
}) =>
  test("Remove files sequentially", async ({ page }) => {
    const config = await getConfig({ page });
    const fileUploader = config.fileUploader;

    await fileUploader.uploadFiles(files.map((e) => e.path));

    // Summary status
    let successfulFilesCount = files.filter(
      (e) => e.status === "success",
    ).length;
    let duplicateFilesCount = files.filter(
      (e) => e.status === "warning",
    ).length;
    await expect(fileUploader).toHaveSummaryUploadStatus({
      totalFiles: files.length,
      successfulFiles: successfulFilesCount,
      duplicateFiles: duplicateFilesCount,
    });

    // Remove files
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const fileName = path.basename(file.path);
      const statusItem = await fileUploader.getUploadStatusItem(fileName);

      await statusItem
        .getByRole("button", { name: "Remove from list" })
        .click();

      const totalFiles = files.length - index - 1;
      if (file.status === "success") {
        successfulFilesCount--;
      } else if (file.status === "warning") {
        duplicateFilesCount--;
      }

      await expect(fileUploader).toHaveSummaryUploadStatus({
        totalFiles,
        successfulFiles: successfulFilesCount,
        duplicateFiles: duplicateFilesCount,
      });
    }
  });

export const testUploadApiErrorMessage = (
  testName: string,
  {
    filePath,
    apiRoutePattern,
    errorResponseBody,
    expectedErrorMessage,
    httpStatus = 400,
    getConfig,
  }: {
    filePath: string;
    apiRoutePattern: string;
    errorResponseBody: {
      error: string;
      message?: string;
      details?: string;
      validation?: {
        validator: string;
        findings: {
          severity: string;
          message: string;
          path?: string;
          rule?: string;
        }[];
        outcome: string;
      }[];
    };
    expectedErrorMessage: string;
    httpStatus?: number;
    getConfig: ({ page }: { page: Page }) => Promise<UploadTestConfig>;
  },
) =>
  test(`Upload API error message - ${testName}`, async ({ page }) => {
    const config = await getConfig({ page });
    const fileUploader = config.fileUploader;

    await page.route(apiRoutePattern, async (route) => {
      await route.fulfill({
        status: httpStatus,
        contentType: "application/json",
        body: JSON.stringify(errorResponseBody),
      });
    });

    try {
      await fileUploader.uploadFiles([filePath]);

      const fileName = path.basename(filePath);
      await expect(fileUploader).toHaveItemUploadStatus({
        fileName,
        status: "danger",
        message: expectedErrorMessage,
      });
    } finally {
      await page.unroute(apiRoutePattern);
    }
  });

export const testInvalidFileExtensions = ({
  filesPaths,
  getConfig,
}: {
  filesPaths: string[];
  getConfig: ({ page }: { page: Page }) => Promise<UploadTestConfig>;
}) =>
  test("Error handling", async ({ page }) => {
    const config = await getConfig({ page });
    const fileUploader = config.fileUploader;

    await fileUploader.uploadFiles(filesPaths);

    const invalidFilesModal = page.getByRole("dialog", {
      name: "unsupported file upload attempted",
    });
    await expect(invalidFilesModal).toBeVisible();

    for (const filePath of filesPaths) {
      const fileName = path.basename(filePath);
      await expect(invalidFilesModal).toContainText(fileName);
    }
  });
