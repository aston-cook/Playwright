import { test as base } from '@playwright/test';

/**
 * Shared page fixture: hides the `navigator.webdriver` flag before any page
 * script runs, which lowers the chance of Google serving its anti-bot
 * interstitial during smoke runs.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    await use(page);
  },
});

export { expect } from '@playwright/test';
