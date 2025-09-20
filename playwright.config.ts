// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://www.google.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  outputDir: 'test-results',
  timeout: 30_000,
  expect: { timeout: 10000 },
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'America/New_York'
  },
  grepInvert: process.env.GREP_INVERT ? new RegExp(process.env.GREP_INVERT) : undefined,
  grep: process.env.GREP ? new RegExp(process.env.GREP) : undefined,

  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',               // use real Chrome locally
        headless: !!process.env.CI,
        launchOptions: { args: ['--disable-blink-features=AutomationControlled'] },
        locale: 'en-US',
        timezoneId: 'America/New_York',
      },
    },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit',  use: { ...devices['Desktop Safari'] } },
  ],

  // Example local dev web server; remove if you test a public site
  webServer: process.env.WEB_SERVER_CMD
    ? {
        command: process.env.WEB_SERVER_CMD,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
