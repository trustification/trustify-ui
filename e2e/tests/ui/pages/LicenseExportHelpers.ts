import type { Page } from "@playwright/test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { DetailsPage } from "../helpers/DetailsPage";
import { clickAndDownload } from "./Helpers";

export const downloadLicenseReport = async (page: Page): Promise<string> => {
  const detailsPage = new DetailsPage(page);
  await detailsPage.openActionsMenu();

  const download = await clickAndDownload(
    page,
    async () =>
      await detailsPage.page
        .getByRole("menuitem", { name: "Download License Report" })
        .click(),
  );

  const sanitizedFilename = download
    .suggestedFilename()
    .replace(/[/\\.]/g, "_");
  const savePath = path.join(
    os.tmpdir(),
    `license-report-${Date.now()}-${sanitizedFilename}`,
  );
  await download.saveAs(savePath);
  return savePath;
};

export const extractLicenseReport = async (
  downloadedFilePath: string,
): Promise<string> => {
  const execFileAsync = promisify(execFile);
  const extractionPath = path.join(
    path.dirname(downloadedFilePath),
    "extracted",
  );
  if (!fs.existsSync(extractionPath)) {
    fs.mkdirSync(extractionPath);
  }

  await execFileAsync("tar", [
    "-xzf",
    downloadedFilePath,
    "-C",
    extractionPath,
  ]);
  return extractionPath;
};

export const findCsvWithHeader = (
  extractionPath: string,
  headerIdentifier: string,
  fileDescription: string,
): string => {
  const files = fs.readdirSync(extractionPath);
  const csvFiles = files.filter((file) => file.endsWith(".csv"));
  let foundFile: string | undefined;

  for (const file of csvFiles) {
    const filePath = path.join(extractionPath, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const firstLine = content.split("\n")[0];
    if (firstLine.includes(headerIdentifier)) {
      foundFile = filePath;
      break;
    }
  }

  if (!foundFile) {
    throw new Error(
      `${fileDescription} not found among extracted files: ` +
        csvFiles.join(", "),
    );
  }

  return foundFile;
};
