import { test, expect } from '@playwright/test';
import { GoogleMapsPage } from '../pages/GoogleMapsPage';

test.describe('Google Maps Tests', () => {
  test('Verify Search Suggestions Appear For Maps', async ({ page, browserName }) => {
    // Suggestions often don’t render in WebKit reliably in CI
    test.skip(browserName === 'webkit', 'Suggestions are unstable on WebKit');
    const maps = new GoogleMapsPage(page);
    await maps.goto();
    await maps.typeInSearch('New York');
    await maps.expectSuggestions();
  });

  test('Search navigates to results', async ({ page, browserName }) => {
    // Avoid WebKit crashiness on Maps (heavy WebGL/2D canvas)
    test.skip(browserName === 'webkit', 'Maps page can crash WebKit in CI');
    const maps = new GoogleMapsPage(page);
    await maps.goto();
    await maps.submitSearchWithFallback('New York');
    // Disambiguate from the minimap’s disabled zoom-in; the main control has a stable id.
    await expect(page.locator('#widget-zoom-in')).toBeVisible({ timeout: 15000 });
  });
});
