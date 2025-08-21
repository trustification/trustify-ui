import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const bddTestDir = defineBddConfig({
  features: ["tests/**/features/@*/*.feature"],
  steps: [
    "tests/**/features/**/*.step.ts",
    "tests/**/steps/**/*.ts",
    "tests/ui/fixtures.ts",
  ],
});

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const DESKTOP_CONFIG = {
  viewport: { height: 961, width: 1920 },
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  // testDir: bddTestDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.TRUSTIFY_UI_URL ?? "http://localhost:3000/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], ...DESKTOP_CONFIG },
      dependencies: ["setup-api-data"],
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], ...DESKTOP_CONFIG },
      dependencies: ["setup-api-data"],
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], ...DESKTOP_CONFIG },
      dependencies: ["setup-api-data"],
    },

    {
      name: "bdd",
      testDir: bddTestDir,
      use: {
        ...devices["Desktop Chrome"],
        ...DESKTOP_CONFIG,
      },
      dependencies: ["setup-api-data"],
    },

    {
      name: "api",
      testDir: "./tests/api/features",
      testMatch: /.*\.ts/,
      dependencies: ["setup-api-data"],
    },
    {
      name: "setup-api-data",
      testDir: "./tests/api/dependencies",
      testMatch: "*.setup.ts",
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
