import {
  expect,
  type Download,
  type Locator,
  type Page,
} from "@playwright/test";

/**
 * Resolves asset path by normalizing leading slash and ensuring proper path joining
 * @param filePath The directory path (may or may not start with /)
 * @param fileName The file name to append
 * @returns The normalized path
 */
export const resolveAssetPath = (
  filePath: string,
  fileName: string,
): string => {
  // Normalize leading slash coming from feature examples and ensure single slash join
  const normalizedPath = filePath.startsWith("/")
    ? filePath.slice(1)
    : filePath;
  const needsSlash = normalizedPath.endsWith("/") ? "" : "/";
  return `${normalizedPath}${needsSlash}${fileName}`;
};

/**
 * Verifies a download was successful
 * @param download The Playwright Download object
 * @returns The suggested filename
 */
export const verifyDownload = async (download: Download): Promise<string> => {
  try {
    return download.suggestedFilename();
  } catch (error) {
    throw new Error(`Download verification failed: ${error}`, { cause: error });
  }
};

/**
 * Handles click action that triggers a download and verifies it
 * @param page The Playwright Page object
 * @param clickAction The async function that performs the click
 * @returns The downloaded filename
 */
export const clickAndVerifyDownload = async (
  page: Page,
  clickAction: () => Promise<void>,
): Promise<string> => {
  // Set up download listener and perform click simultaneously
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    clickAction(),
  ]);
  // Verify the download
  return await verifyDownload(download);
};

/**
 * Handles click action that triggers a download and returns the Download object
 * @param page The Playwright Page object
 * @param clickAction The async function that performs the click
 * @returns The Download object
 */
export const clickAndDownload = async (
  page: Page,
  clickAction: () => Promise<void>,
): Promise<Download> => {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    clickAction(),
  ]);
  return download;
};

/**
 * Verifies comma-delimited expected values against child elements
 * Useful for comparing lists like qualifiers, tags, labels, severity values, etc.
 * @param elements The locator for child elements to verify
 * @param expectedCsv Comma-delimited string of expected values
 */
export const verifyChildElementsText = async (
  elements: Locator,
  expectedCsv: string,
) => {
  // Parse comma-delimited expected values
  const expectedValues = expectedCsv
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  // Collect actual values text
  const actualValues: string[] = [];
  const elementCount = await elements.count();
  for (let i = 0; i < elementCount; i++) {
    const text = await elements.nth(i).textContent();
    if (text?.trim()) {
      actualValues.push(text.trim());
    }
  }

  // Check which expected values are missing
  const missing: string[] = [];
  for (const expectedVal of expectedValues) {
    const found = actualValues.some((actual) => actual.includes(expectedVal));
    if (!found) {
      missing.push(expectedVal);
    }
  }

  // Verify all expected values are present
  expect
    .soft(
      missing.length === 0,
      missing.length > 0
        ? `Missing expected values: ${missing.join(", ")}. Actual values: [${actualValues.join(", ")}]`
        : "Values did not match expected pattern",
    )
    .toBeTruthy();
};
