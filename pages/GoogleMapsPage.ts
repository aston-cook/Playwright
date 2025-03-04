import { Page, expect } from "@playwright/test";

export class GoogleMapsPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://maps.google.com");
  }

  async searchLocation(location: string) {
    await this.page.fill("input#searchboxinput", location);
    await this.page.keyboard.press("Enter");
  }

  async verifyLocation() {
    await expect(this.page.locator("canvas").first()).toBeVisible();
  }
}