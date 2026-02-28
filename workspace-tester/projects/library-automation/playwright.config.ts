import { defineConfig, devices } from '@playwright/test';
import './tests/config/env';
import { getReportEnv } from './tests/config/env';

const reportEnv = getReportEnv();
export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: reportEnv.reportTestUrl || undefined,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'reportUndoRedo',
      testMatch: /report-editor\/report-undo-redo\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportShortcutMetrics',
      testMatch: /report-editor\/report-shortcut-metrics\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportPageBySorting',
      testMatch: /report-editor\/report-page-by-sorting\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportPageBy',
      testMatch: /report-editor\/report-page-by\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportCreator',
      testMatch: /report-editor\/report-creator\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportSubset',
      testMatch: /report-editor\/report-subset\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportThreshold',
      testMatch: /report-editor\/report-threshold\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportTheme',
      testMatch: /report-editor\/report-theme\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportScopeFilter',
      testMatch: /report-editor\/report-scope-filter\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportFormatting',
      testMatch: /report-editor\/report-formatting\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'reportCancel',
      testMatch: /report-editor\/report-cancel\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 360000,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
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
