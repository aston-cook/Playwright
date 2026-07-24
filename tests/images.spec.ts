import { test, expect } from '../utils/fixtures';
import { GoogleImagesPage } from '../pages/GoogleImagesPage';
import { acceptConsentIfShown, skipIfBlocked } from '../utils/google';
import { SEARCH_TERM } from '../utils/testConfig';

test.describe('Google Images', () => {
  test('@smoke images homepage loads with a visible search box', async ({ page }) => {
    const images = new GoogleImagesPage(page);
    await images.goto();
    await images.expectLoaded();
  });

  test('image search shows thumbnail results', async ({ page }) => {
    const images = new GoogleImagesPage(page);
    await images.goto();
    await images.search(SEARCH_TERM);
    await skipIfBlocked(page);
    await images.expectResults();
  });

  test('typing shows autocomplete suggestions', async ({ page }) => {
    const images = new GoogleImagesPage(page);
    await images.goto();
    await images.typeQuery(SEARCH_TERM);
    await images.expectSuggestions();
  });

  test('@mobile image results render on a mobile viewport', async ({ page }) => {
    await page.goto('https://www.google.com/search?udm=2&q=playwright&hl=en&gl=us', {
      waitUntil: 'domcontentloaded',
    });
    await acceptConsentIfShown(page);
    await skipIfBlocked(page);
    const thumbnails = page.locator('#search img, img[data-atf]');
    await expect(thumbnails.first()).toBeVisible({ timeout: 15_000 });
  });
});
