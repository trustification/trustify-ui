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
export const isAnalyticsEnabled = ENV.ANALYTICS_ENABLED !== "false";
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
