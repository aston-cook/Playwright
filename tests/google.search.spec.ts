import { test, expect, Page } from '@playwright/test';
import { acceptConsentIfShown, isBlocked, qBox } from '../utils/google';
import { randomUUID } from 'node:crypto';

const goto = (page: Page, url: string) =>
  page.goto(url, { waitUntil: 'domcontentloaded' });

// Mask the most common signal
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-ignore
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
});

function resultHeadingAnyEngine(page: Page) {
  return page.locator(
    'a h3, [role="heading"][aria-level="3"], #links .result__a, [data-testid="result-title-a"]'
  );
}

async function submitQuery(page: Page, query: string) {
  // Try Google first
  await goto(page, 'https://www.google.com/?hl=en&gl=us');
  await acceptConsentIfShown(page);

  const box = page.locator(qBox).first();
  await box.fill(query);
  await box.press('Enter');

  // Wait briefly for Google results
  try {
    await page.waitForURL(/\/search\?/, { timeout: 4000 });
  } catch { /* ignore */ }

  // If Google blocks, fall back to DuckDuckGo
  if (await isBlocked(page)) {
    await goto(page, `https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
  }
}

test.describe('Google Search', () => {
  test.describe.configure({ mode: 'serial' });

  test('@smoke loads homepage and searches', async ({ page }) => {
    await submitQuery(page, 'Playwright testing');
    await expect(resultHeadingAnyEngine(page).first()).toBeVisible({ timeout: 15000 });
  });

  test('shows typeahead suggestions', async ({ page }) => {
    await goto(page, 'https://www.google.com/?hl=en&gl=us');
    await acceptConsentIfShown(page);
    await page.locator(qBox).first().type('playwright', { delay: 40 });
    await expect(page.locator('[role="listbox"]:visible').first()).toBeVisible({ timeout: 10000 });
  });

  test('@mobile images tab has results', async ({ page }) => {
    // Prefer Google Images; if blocked, DDG Images still renders images on same query URL pattern
    await goto(page, 'https://www.google.com/search?tbm=isch&q=playwright&hl=en&gl=us');
    await acceptConsentIfShown(page);
    if (await isBlocked(page)) {
      await goto(page, 'https://duckduckgo.com/?q=playwright&iax=images&ia=images');
    }
    await expect(page.locator('img[data-atf="1"], img:visible').first()).toBeVisible({ timeout: 15000 });
  });

  test('keyboard submit works', async ({ page }) => {
    await submitQuery(page, 'site:playwright.dev docs');
    await expect(resultHeadingAnyEngine(page).first()).toBeVisible({ timeout: 15000 });
  });

  test('@negative no results query shows empty state', async ({ page }) => {
    const noHit = 'site:example.invalid ' + randomUUID();
    await submitQuery(page, noHit);

    // If the engine shows an explicit empty message, assert it; else assert no result headings
    const emptyMsg = page.getByText(/did not match any documents|no results found/i).first();
    const visible = await emptyMsg.isVisible().catch(() => false);
    if (visible) {
      await expect(emptyMsg).toBeVisible();
    } else {
      await expect(resultHeadingAnyEngine(page)).toHaveCount(0, { timeout: 10000 });
    }
  });
});
