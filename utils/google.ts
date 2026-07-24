import { Page, test } from '@playwright/test';

/** Matches the search box on both classic and current Google layouts. */
export const SEARCH_INPUT = 'textarea[name="q"], input[name="q"]';

/**
 * Matches organic result headings on Google and DuckDuckGo, so the same
 * assertion works after a fallback.
 */
export function resultHeadings(page: Page) {
  return page.locator(
    'a h3, [role="heading"][aria-level="3"], [data-testid="result-title-a"], #links .result__a'
  );
}

/**
 * Dismiss Google's consent screen when it appears (EU regions, fresh
 * profiles). A no-op when no consent UI is shown.
 */
export async function acceptConsentIfShown(page: Page): Promise<void> {
  const consentButton = page
    .getByRole('button', { name: /accept all|i agree|agree to all/i })
    .first();
  const shown = await consentButton
    .waitFor({ state: 'visible', timeout: 2_500 })
    .then(() => true)
    .catch(() => false);
  if (shown) {
    await consentButton.click();
    await page.waitForLoadState('domcontentloaded');
  }
}

/** True only when Google is actually serving its anti-bot interstitial. */
export async function isBlocked(page: Page): Promise<boolean> {
  if (/\bgoogle\.[^/]+\/sorry\b/i.test(page.url())) return true;
  const interstitial = page
    .getByText(/unusual traffic|are not a robot|sending automated queries/i)
    .first();
  return interstitial
    .waitFor({ state: 'visible', timeout: 500 })
    .then(() => true)
    .catch(() => false);
}

/**
 * When ALLOW_GOOGLE_SKIP=1 (set in CI), Google-only tests skip instead of
 * failing if the anti-bot interstitial appears.
 */
export function canSkipOnBlock(): boolean {
  return process.env.ALLOW_GOOGLE_SKIP === '1';
}

/**
 * For Google-only scenarios with no cross-engine fallback: skip (with a
 * visible reason) when Google is blocking and ALLOW_GOOGLE_SKIP=1. Without
 * the env var the test continues and fails on its real assertion.
 */
export async function skipIfBlocked(page: Page): Promise<void> {
  test.skip(
    (await isBlocked(page)) && canSkipOnBlock(),
    'Google anti-bot interstitial'
  );
}

/** Rerun the query on DuckDuckGo so the spec can keep asserting results. */
export async function fallbackToDuckDuckGo(page: Page, query: string): Promise<void> {
  await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
    waitUntil: 'domcontentloaded',
  });
}

/**
 * Run a search on Google; if the anti-bot interstitial appears, rerun the
 * same query on DuckDuckGo. Returns the engine that served the results.
 */
export async function searchWithFallback(
  page: Page,
  query: string
): Promise<'google' | 'duckduckgo'> {
  await page.goto('https://www.google.com/?hl=en&gl=us', { waitUntil: 'domcontentloaded' });
  await acceptConsentIfShown(page);

  const searchBox = page.locator(SEARCH_INPUT).first();
  await searchBox.fill(query);
  await searchBox.press('Enter');
  await page.waitForURL(/\/search\?/, { timeout: 5_000 }).catch(() => {});

  if (await isBlocked(page)) {
    await fallbackToDuckDuckGo(page, query);
    return 'duckduckgo';
  }
  return 'google';
}
