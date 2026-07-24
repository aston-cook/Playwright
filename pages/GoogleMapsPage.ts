import { Page, Locator, expect } from '@playwright/test';
import { acceptConsentIfShown } from '../utils/google';

export class GoogleMapsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly zoomInControl: Locator;

  constructor(page: Page) {
    this.page = page;
    // Maps' input ids churn and the combobox's accessible name changes once
    // text is typed, so anchor on the search landmark instead.
    this.searchInput = page.getByRole('search').getByRole('combobox').first();
    this.zoomInControl = page
      .locator('#widget-zoom-in')
      .or(page.getByRole('button', { name: /zoom in/i }))
      .first();
  }

  async goto() {
    await this.page.goto('https://www.google.com/maps?hl=en&gl=us', {
      waitUntil: 'domcontentloaded',
    });
    await acceptConsentIfShown(this.page);
  }

  /** Type character by character so Maps fires its suggestion events. */
  async typeInSearch(text: string) {
    await this.searchInput.click();
    await this.searchInput.fill('');
    await this.searchInput.pressSequentially(text, { delay: 50 });
  }

  /** The suggestion panel is announced through ARIA state on the input. */
  async expectSuggestions() {
    await expect(this.searchInput).toHaveAttribute('aria-expanded', /true/i, {
      timeout: 8_000,
    });
  }

  /**
   * Submit through the UI; if Maps doesn't navigate (slow tiles, dropped
   * keystrokes), fall back to the deterministic search URL.
   */
  async submitSearchWithFallback(query: string) {
    await this.typeInSearch(query);
    await this.searchInput.press('Enter');
    try {
      await this.page.waitForURL(/\/search|\/place/, { timeout: 5_000 });
    } catch {
      await this.page.goto(
        `https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=en&gl=us`,
        { waitUntil: 'domcontentloaded' }
      );
    }
  }

  async expectMapLoaded() {
    await expect(this.zoomInControl).toBeVisible({ timeout: 15_000 });
  }
}
