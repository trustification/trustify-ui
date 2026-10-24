import type { AxiosError } from "axios";
import type { AdvisoryHead, AdvisorySummary, SbomHead } from "./client";
import ENV from "./env";

export const FILTER_TEXT_CATEGORY_KEY = "";
export const FILTER_NULL_VALUE = "\0";

export const MAX_ITEMS_PER_PAGE = 1000;

export const RENDER_DATE_FORMAT = "MMM DD, YYYY";
export const RENDER_DATETIME_FORMAT = "MMM DD, YYYY | HH:mm:ss";

export const DEFAULT_REFETCH_INTERVAL = 5000;

export const PRODUCT_LABEL_KEY = "Product";

// The following regex ensures:
// - No backslashes anywhere in the string
// - The string does not start with whitespace or '='
// - The string does not start with a backslash
// - The string contains an optional '=' with optional whitespace around it
// - Both key and value parts do not contain backslashes or are empty
// - The key does not start with whitespace or '='
// This is used to validate new label options in the form.
export const LABEL_VALIDATION_REGEX =
  /^(?!.*\\)(?!\s*\\)(?!\s*=)[^=\\\s][^=\\]*\s*=?\s*[^=\\]+$/;

export const TablePersistenceKeyPrefixes = {
  products: "pd",
  advisories: "ad",
  vulnerabilities: "vn",
  sboms: "sb",
  sbomGroups: "sbg",
  sboms_by_package: "sbk",
  packages: "pk",
  licenses: "li",
  cryptography: "cr",
  models: "mo",
};

export const isAuthRequired = ENV.AUTH_REQUIRED !== "false";
export const isAuthServerEmbedded = ENV.OIDC_SERVER_IS_EMBEDDED === "true";

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

export const sbomDeleteDialogProps = (sbom?: SbomHead | null) => ({
  title: "Permanently delete SBOM?",
  message: `This action permanently deletes the ${sbom?.name} SBOM.`,
});

export const advisoryDeleteDialogProps = (
  advisory?: AdvisorySummary | null,
) => ({
  title: "Permanently delete Advisory?",
  message: `This action permanently deletes the ${advisory?.document_id} Advisory.`,
});

export const sbomDeletedSuccessMessage = (sbom: SbomHead) =>
  `The SBOM ${sbom.name} was deleted`;

export const sbomDeletedErrorMessage = (_error: AxiosError) =>
  "Error occurred while deleting the SBOM";

export const advisoryDeletedSuccessMessage = (sbom: AdvisoryHead) =>
  `The Advisory ${sbom.document_id} was deleted`;

export const advisoryDeletedErrorMessage = (_error: AxiosError) =>
  "Error occurred while deleting the Advisory";
