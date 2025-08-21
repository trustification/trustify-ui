export const AUTH_REQUIRED = process.env.AUTH_REQUIRED ?? "true";
export const TRUSTIFY_API_URL =
  process.env.TRUSTIFY_API_URL ??
  process.env.TRUSTIFY_UI_URL ??
  "http://localhost:8080/";

/**
 * API only environment variables
 */
export const AUTH_URL = process.env.PLAYWRIGHT_AUTH_URL;
export const AUTH_CLIENT_ID = process.env.PLAYWRIGHT_AUTH_CLIENT_ID ?? "cli";
export const AUTH_CLIENT_SECRET =
  process.env.PLAYWRIGHT_AUTH_CLIENT_SECRET ?? "secret";

/**
 * UI only environment variables
 */
export const AUTH_USER = process.env.PLAYWRIGHT_AUTH_USER ?? "admin";
export const AUTH_PASSWORD = process.env.PLAYWRIGHT_AUTH_PASSWORD ?? "admin";

/**
 * Log definition
 */
const LOG_LEVELS = { debug: 4, info: 3, warn: 2, error: 1, none: 0 };
const CURRENT_LOG_LEVEL =
  // biome-ignore lint/suspicious/noExplicitAny: allowed
  (LOG_LEVELS as any)[process.env.LOG_LEVEL ?? "info"] || LOG_LEVELS.info;

export const logger = {
  debug: (...args: unknown[]) => {
    CURRENT_LOG_LEVEL >= LOG_LEVELS.debug && console.log("[DEBUG]", ...args);
  },
  info: (...args: unknown[]) => {
    CURRENT_LOG_LEVEL >= LOG_LEVELS.info && console.log("[INFO]", ...args);
  },
  warn: (...args: unknown[]) => {
    CURRENT_LOG_LEVEL >= LOG_LEVELS.warn && console.warn("[WARN]", ...args);
  },
  error: (...args: unknown[]) => {
    CURRENT_LOG_LEVEL >= LOG_LEVELS.error && console.error("[ERROR]", ...args);
  },
};

export const SETUP_TIMEOUT = 240_000;

export const SBOM_FILES = [
  "quarkus-bom-2.13.8.Final-redhat-00004.json.bz2",
  "ubi8_ubi-micro-8.8-7.1696517612.json.bz2",
  "ubi8-8.8-1067.json.bz2",
  "ubi8-minimal-8.8-1072.1697626218.json.bz2",
  "ubi9-9.3-782.json.bz2",
  "ubi9-minimal-9.3-1361.json.bz2",
  "example_component_quarkus.json.bz2",
  "example_product_quarkus.json.bz2",
  "openshift-ose-console-cdx.json.bz2",
  "openssl-3.0.7-18.el9_2.cdx_1.6.sbom.json.bz2",
  "openssl-3.0.7-18.el9_2.spdx.json.bz2",
  "RHEL-8.10.0.Z_curl@7.61.1-34.el8_10.2.json.bz2",
  "RHEL-8.10.0.Z.MAIN+EUS.json.bz2",
  "rhel-9.2-eus.cdx.json.bz2",
  "rhel-9.2-eus.spdx.json.bz2",
  "spdx-ancestor-of-example.json.bz2",
  "example_container_index.json.bz2",
];

export const ADVISORY_FILES = [
  "CVE-2022-45787-cve.json.bz2",
  "cve-2022-45787.json.bz2",
  "CVE-2023-0044-cve.json.bz2",
  "cve-2023-0044.json.bz2",
  "CVE-2023-0481-cve.json.bz2",
  "cve-2023-0481.json.bz2",
  "CVE-2023-0482-cve.json.bz2",
  "cve-2023-0482.json.bz2",
  "CVE-2023-1108-cve.json.bz2",
  "cve-2023-1108.json.bz2",
  "CVE-2023-1370-cve.json.bz2",
  "cve-2023-1370.json.bz2",
  "CVE-2023-1436-cve.json.bz2",
  "cve-2023-1436.json.bz2",
  "CVE-2023-1584-cve.json.bz2",
  "cve-2023-1584.json.bz2",
  "CVE-2023-1664-cve.json.bz2",
  "cve-2023-1664.json.bz2",
  "CVE-2023-20860-cve.json.bz2",
  "cve-2023-20860.json.bz2",
  "CVE-2023-20861-cve.json.bz2",
  "cve-2023-20861.json.bz2",
  "CVE-2023-20862-cve.json.bz2",
  "cve-2023-20862.json.bz2",
  "CVE-2023-21971-cve.json.bz2",
  "cve-2023-21971.json.bz2",
  "CVE-2023-2454-cve.json.bz2",
  "cve-2023-2454.json.bz2",
  "CVE-2023-2455-cve.json.bz2",
  "cve-2023-2455.json.bz2",
  "CVE-2023-24815-cve.json.bz2",
  "cve-2023-24815.json.bz2",
  "CVE-2023-24998-cve.json.bz2",
  "cve-2023-24998.json.bz2",
  "CVE-2023-26464-cve.json.bz2",
  "cve-2023-26464.json.bz2",
  "CVE-2023-2798-cve.json.bz2",
  "cve-2023-2798.json.bz2",
  "CVE-2023-28867-cve.json.bz2",
  "cve-2023-28867.json.bz2",
  "CVE-2023-2974-cve.json.bz2",
  "cve-2023-2974.json.bz2",
  "CVE-2023-2976-cve.json.bz2",
  "cve-2023-2976.json.bz2",
  "CVE-2023-3223-cve.json.bz2",
  "cve-2023-3223.json.bz2",
  "CVE-2023-33201-cve.json.bz2",
  "cve-2023-33201.json.bz2",
  "CVE-2023-34453-cve.json.bz2",
  "cve-2023-34453.json.bz2",
  "CVE-2023-34454-cve.json.bz2",
  "cve-2023-34454.json.bz2",
  "CVE-2023-34455-cve.json.bz2",
  "cve-2023-34455.json.bz2",
  // "CVE-2023-44487-cve.json.bz2", Payload too large error
  // "cve-2023-44487.json.bz2",
  "CVE-2023-4853-cve.json.bz2",
  "cve-2023-4853.json.bz2",
  "CVE-2024-26308-cve.json.bz2",
  "cve-2024-26308.json.bz2",
];
