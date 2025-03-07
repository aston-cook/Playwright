import { Page, expect } from "@playwright/test";

export class GoogleImagesPage {
  constructor(private page: Page) { }

  async navigate() {
    await this.page.goto("https://images.google.com");
  }

  async searchImage(query: string) {
    await this.page.fill("textarea[name='q']", query);
    await this.page.keyboard.press("Enter");
  }

  async verifyResults() {
    await expect(this.page).toHaveURL(/.*sclient=img.*/);
  }
}