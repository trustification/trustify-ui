import type { AxiosError } from "axios";
import type { AdvisorySummary, SbomSummary } from "./client";
import ENV from "./env";

export const FILTER_TEXT_CATEGORY_KEY = "";

export const RENDER_DATE_FORMAT = "MMM DD, YYYY";
export const RENDER_DATETIME_FORMAT = "MMM DD, YYYY | HH:mm:ss";
export const FILTER_DATE_FORMAT = "YYYY-MM-DD";

export const DEFAULT_REFETCH_INTERVAL = 5000;

export const TablePersistenceKeyPrefixes = {
  products: "pd",
  advisories: "ad",
  vulnerabilities: "vn",
  sboms: "sb",
  sboms_by_package: "sbk",
  packages: "pk",
};

// URL param prefixes: should be short, must be unique for each table that uses one
export enum TableURLParamKeyPrefix {
  repositories = "r",
  tags = "t",
}

export const isAuthRequired = ENV.AUTH_REQUIRED !== "false";
export const isAuthServerEmbedded = ENV.OIDC_SERVER_IS_EMBEDDED === "true";
export const uploadLimit = "500m";

/**
 * The name of the client generated id field inserted in a object marked with mixin type
 * `WithUiId`.
 */
export const UI_UNIQUE_ID = "_ui_unique_id";

export const FORM_DATA_FILE_KEY = "file";

export const ANSICOLOR = {
  reset: "\x1b[0m",
  underline: "\x1b[4;1m",
  endLine: "\n",
  defaultForegroundColorAtStartup: "\x1b[39m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  lightBlue: "\x1b[94m",
  red: "\x1b[31m",
};

export const sbomDeleteDialogProps = (sbom?: SbomSummary | null) => ({
  title: "Permanently delete SBOM?",
  message: `This action permanently deletes the ${sbom?.name} SBOM.`,
});

export const advisoryDeleteDialogProps = (
  advisory?: AdvisorySummary | null,
) => ({
  title: "Permanently delete Advisory?",
  message: `This action permanently deletes the ${advisory?.document_id} Advisory.`,
});

export const sbomDeletedSuccessMessage = (sbom: SbomSummary) =>
  `The SBOM ${sbom.name} was deleted`;

export const sbomDeletedErrorMessage = (_error: AxiosError) =>
  "Error occurred while deleting the SBOM";

export const advisoryDeletedSuccessMessage = (sbom: AdvisorySummary) =>
  `The Advisory ${sbom.document_id} was deleted`;

export const advisoryDeletedErrorMessage = (_error: AxiosError) =>
  "Error occurred while deleting the Advisory";
