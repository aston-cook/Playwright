import { Page, Locator, expect } from '@playwright/test';
import { acceptConsentIfShown, SEARCH_INPUT } from '../utils/google';

export class GoogleImagesPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly suggestionList: Locator;
  readonly resultThumbnails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator(SEARCH_INPUT).first();
    this.suggestionList = page
      .locator('[role="listbox"]:visible, [data-attrid="AutocompletePrediction"]')
      .first();
    this.resultThumbnails = page.locator('#search img, #islrg img');
  }

  async goto() {
    await this.page.goto('https://images.google.com/?hl=en&gl=us', {
      waitUntil: 'domcontentloaded',
    });
    await acceptConsentIfShown(this.page);
  }

  async expectLoaded() {
    await expect(this.searchBox).toBeVisible();
  }

  async search(query: string) {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
    await this.page.waitForURL(/\/search\?/, { timeout: 5_000 }).catch(() => {});
  }

  /** Type character by character so autocomplete suggestions fire. */
  async typeQuery(query: string) {
    await this.searchBox.click();
    await this.searchBox.pressSequentially(query, { delay: 40 });
  }

  async expectSuggestions() {
    await expect(this.suggestionList).toBeVisible({ timeout: 10_000 });
  }

  async expectResults() {
    await expect(this.page).toHaveURL(/\/search\?/, { timeout: 10_000 });
    await expect(this.resultThumbnails.first()).toBeVisible({ timeout: 15_000 });
  }
}
