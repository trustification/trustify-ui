import { expect as baseExpect } from "@playwright/test";
import type { FileUpload } from "../pages/FileUpload";
import type { MatcherResult } from "./types";

/**
 * Upload status of a single file, expressed as the PatternFly progress variant
 * rendered by `UploadFiles`:
 * - `success`: the document was ingested
 * - `warning`: the server reported the document as a duplicate
 * - `danger`: the upload failed
 */
export type FileUploadItemStatus = "success" | "warning" | "danger";

export interface FileUploadMatchers {
  toHaveSummaryUploadStatus(expectedStatus: {
    successfulFiles: number;
    totalFiles: number;
    duplicateFiles?: number;
  }): Promise<MatcherResult>;
  toHaveItemUploadStatus(expectedStatus: {
    fileName: string;
    status: FileUploadItemStatus;
    message?: string;
  }): Promise<MatcherResult>;
}

/**
 * Helper text modifier class rendered next to each upload status.
 *
 * PatternFly only emits a modifier for non-default variants, so a successful
 * upload is identified by the absence of the warning/error modifiers.
 */
const HELPER_TEXT_MODIFIER: Record<FileUploadItemStatus, string | null> = {
  success: null,
  warning: "pf-m-warning",
  danger: "pf-m-error",
};

type FileUploadMatcherDefinitions = {
  readonly [K in keyof FileUploadMatchers]: (
    receiver: FileUpload,
    ...args: Parameters<FileUploadMatchers[K]>
  ) => Promise<MatcherResult>;
};

export const fileUploadAssertions =
  baseExpect.extend<FileUploadMatcherDefinitions>({
    toHaveSummaryUploadStatus: async (
      fileUpload: FileUpload,
      expectedStatus: {
        successfulFiles: number;
        totalFiles: number;
        duplicateFiles?: number;
      },
    ): Promise<MatcherResult> => {
      try {
        const duplicateFiles = expectedStatus.duplicateFiles ?? 0;
        // Mirrors the summary text built by the UploadFiles component
        const expectedText =
          duplicateFiles > 0
            ? `${expectedStatus.successfulFiles} uploaded, ${duplicateFiles} already existed`
            : `${expectedStatus.successfulFiles} of ${expectedStatus.totalFiles} files uploaded`;

        await baseExpect(
          fileUpload._uploader.locator(
            ".pf-v6-c-multiple-file-upload__status .pf-v6-c-expandable-section__toggle",
          ),
        ).toContainText(expectedText);

        return {
          pass: true,
          message: () => "Uploader has expected summary status",
        };
      } catch (error) {
        return {
          pass: false,
          message: () =>
            error instanceof Error ? error.message : String(error),
        };
      }
    },
    toHaveItemUploadStatus: async (
      fileUpload: FileUpload,
      expectedStatus: {
        fileName: string;
        status: FileUploadItemStatus;
        message?: string;
      },
    ): Promise<MatcherResult> => {
      try {
        const statusItem = await fileUpload.getUploadStatusItem(
          expectedStatus.fileName,
        );
        await baseExpect(
          statusItem.locator(`.pf-v6-c-progress.pf-m-${expectedStatus.status}`),
        ).toBeVisible();

        const helperTextModifier = HELPER_TEXT_MODIFIER[expectedStatus.status];
        const helperTextItem = statusItem.locator(
          helperTextModifier
            ? `.pf-v6-c-helper-text__item.${helperTextModifier}`
            : ".pf-v6-c-helper-text__item:not(.pf-m-warning):not(.pf-m-error)",
        );
        await baseExpect(helperTextItem).toBeVisible();

        if (expectedStatus.message) {
          // A file being uploaded briefly renders a warning helper text while
          // the server processes it, so the text is what tells both apart
          await baseExpect(helperTextItem).toContainText(
            expectedStatus.message,
          );
        } else {
          await baseExpect(
            statusItem.locator(".pf-v6-c-progress__status", {
              hasText: "100%",
            }),
          ).toBeVisible();
        }

        return {
          pass: true,
          message: () => "Uploader has item with expected status",
        };
      } catch (error) {
        return {
          pass: false,
          message: () =>
            error instanceof Error ? error.message : String(error),
        };
      }
    },
  });
