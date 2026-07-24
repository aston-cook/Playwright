import { randomUUID } from 'node:crypto';
import { test, expect } from '../utils/fixtures';
import { GoogleHomePage } from '../pages/GoogleHomePage';
import {
  fallbackToDuckDuckGo,
  isBlocked,
  resultHeadings,
  searchWithFallback,
} from '../utils/google';
import { SEARCH_TERM } from '../utils/testConfig';

test.describe('Google Search', () => {
  test('@smoke homepage loads with a visible search box', async ({ page }) => {
    const home = new GoogleHomePage(page);
    await home.goto();
    await home.expectLoaded();
  });

  test('@smoke search returns results', async ({ page }) => {
    await searchWithFallback(page, SEARCH_TERM);
    await expect(resultHeadings(page).first()).toBeVisible({ timeout: 15_000 });
  });

  test('typing shows autocomplete suggestions', async ({ page }) => {
    const home = new GoogleHomePage(page);
    await home.goto();
    await home.typeQuery('playwright');
    await home.expectSuggestions();
  });

  test('keyboard-driven search submits and shows results', async ({ page }) => {
    const query = 'site:playwright.dev docs';
    const home = new GoogleHomePage(page);
    await home.goto();
    await home.typeQuery(query);
    await page.keyboard.press('Enter');

    await page.waitForURL(/\/search\?/, { timeout: 5_000 }).catch(() => {});
    if (await isBlocked(page)) {
      await fallbackToDuckDuckGo(page, query);
    }
    await expect(resultHeadings(page).first()).toBeVisible({ timeout: 15_000 });
  });

  test('@negative query with no matches shows an empty state', async ({ page }) => {
    const query = `site:example.invalid ${randomUUID()}`;
    await searchWithFallback(page, query);

    // Wait for the explicit empty-state message (both engines show one)
    // before asserting zero headings — a bare "zero headings" check would
    // pass trivially on a page that hasn't rendered yet.
    const emptyMessage = page
      .getByText(/did not match any documents|no results found/i)
      .first();
    await expect(emptyMessage).toBeVisible({ timeout: 15_000 });
    await expect(resultHeadings(page)).toHaveCount(0);
  });
});
