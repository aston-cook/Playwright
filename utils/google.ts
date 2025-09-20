import { Page } from '@playwright/test';

export async function acceptConsentIfShown(page: Page) { /* keep your current version */ }

export const qBox = 'textarea[name="q"], input[name="q"]';
export const resultHeading = (page: Page) =>
  page.locator('a h3, [role="heading"][aria-level="3"]');

/** Return true only when Google actually shows the anti-bot interstitial */
export async function isBlocked(page: Page): Promise<boolean> {
  const url = page.url();
  if (/\bgoogle\.[^/]+\/sorry\b/i.test(url)) return true;        // /sorry/ page
  const interstitial = page.getByText(
    /unusual traffic|are not a robot|sending automated queries/i
  );
  return await interstitial.isVisible({ timeout: 500 }).catch(() => false);
}
