import { Page, expect } from "@playwright/test";

export class GoogleHomePage {
  constructor(private page: Page) { }

  async navigate() {
    await this.page.goto("https://www.google.com");
  }

  async verifySearchPageLoad() {
    await expect(this.page.locator("textarea[name='q']")).toBeVisible();
  }

  async typeInSearchBox(searchTerm: string) {
    await this.page.fill('textarea[name="q"]', searchTerm);
  }
}