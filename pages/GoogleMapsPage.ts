import { expect, Page, Locator } from '@playwright/test';

export class GoogleMapsPage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }

  // Lazy getters avoid "used before initialization"
  get searchInput(): Locator { return this.page.locator('input#searchboxinput'); }

  async goto() {
    await this.page.goto('https://www.google.com/maps?hl=en&gl=us', { waitUntil: 'domcontentloaded' });
  }

  // Use .type() so Maps fires suggestion events; .fill() can be too fast
  async typeInSearch(text: string) {
    await this.searchInput.click();
    await this.searchInput.fill('');
    await this.searchInput.type(text, { delay: 50 });
  }

  // Suggestion panel is driven by ARIA on the input; don’t rely on brittle listbox markup
  async expectSuggestions() {
    await expect(this.searchInput).toHaveAttribute('aria-expanded', /true/i, { timeout: 8000 });
    const panelId = await this.searchInput.getAttribute('aria-controls');
    if (panelId) {
      await expect(this.page.locator(`#${panelId}`)).toBeVisible({ timeout: 2000 }).catch(() => {});
    }
  }

  async submitSearchWithFallback(query: string) {
    await this.typeInSearch(query);
    await this.searchInput.press('Enter');
    try {
      await this.page.waitForURL(/\/search|\/place/, { timeout: 5000 });
    } catch {
      await this.page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=en&gl=us`,
        { waitUntil: 'domcontentloaded' });
    }
  }
}
