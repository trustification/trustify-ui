export const AUTH_REQUIRED = process.env.AUTH_REQUIRED ?? "true";
export const TRUSTIFY_API_URL =
  process.env.TRUSTIFY_API_URL ??
  process.env.TRUSTIFY_UI_URL ??
  "http://localhost:8080/";

/**
 * Shared auth environment variables (used by both API and UI tests)
 */
export const AUTH_URL = process.env.PLAYWRIGHT_AUTH_URL;
export const AUTH_CLIENT_ID = process.env.PLAYWRIGHT_AUTH_CLIENT_ID ?? "cli";
export const AUTH_CLIENT_SECRET =
  process.env.PLAYWRIGHT_AUTH_CLIENT_SECRET ?? "secret";
export const AUTH_SCOPE = process.env.PLAYWRIGHT_AUTH_SCOPE;

/**
 * UI only environment variables
 */
export const AUTH_USER = process.env.PLAYWRIGHT_AUTH_USER ?? "admin";
export const AUTH_PASSWORD = process.env.PLAYWRIGHT_AUTH_PASSWORD ?? "admin";
export const UI_AUTH_MODE = process.env.PLAYWRIGHT_UI_AUTH_MODE ?? "form";
export const TRUSTIFY_UI_URL =
  process.env.TRUSTIFY_UI_URL ?? "http://localhost:3000/";

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
  "GHSA-j75r-vf64-6rrh.json.bz2",
  "RHSA-2023_3809.json.bz2",
  "RHSA-CVE-2023-0481.json.bz2",
  "CVE-2023-0481.json.bz2",
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
  "GHSA-5jpm-x58v-624v.json.bz2",
  "RHSA-2024_2106.json.bz2",
  "RHSA-CVE-2024-29025.json.bz2",
  "RHSA-2024_2705.json.bz2",
  "CVE-2024-29025.json.bz2",
  "CVE-2025-48795.json.bz2",
  "CVE-2025-49574.json.bz2",
  "CVE-2025-55668.json.bz2",
  "GHSA-7v6m-28jr-rg84.json.bz2",
  "GHSA-j288-q9x7-2f5v.json.bz2",
  "GHSA-wxr5-93ph-8wr9.json.bz2",
  "CVE-2025-35036.json.bz2",
  "CVE-2025-48924.json.bz2",
  "CVE-2025-52520.json.bz2",
  "GHSA-23hv-mwm6-g8jf.json.bz2",
  "GHSA-9623-mj7j-p9v4.json.bz2",
  "GHSA-prj3-ccx8-p6x4.json.bz2",
  "CVE-2025-41242.json.bz2",
  "CVE-2025-48988.json.bz2",
  "CVE-2025-53506.json.bz2",
  "GHSA-25xr-qj8w-c4vf.json.bz2",
  "GHSA-gqp3-2cvr-x8m3.json.bz2",
  "GHSA-wf8f-6423-gfxg.json.bz2",
  "CVE-2025-48734.json.bz2",
  "CVE-2025-48989.json.bz2",
  "CVE-2025-55163.json.bz2",
  "GHSA-36wv-v2qp-v4g4.json.bz2",
  "GHSA-h3gc-qfqq-6h8f.json.bz2",
  "GHSA-wr62-c79q-cv37.json.bz2",
];
