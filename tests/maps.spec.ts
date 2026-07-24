import { test } from '../utils/fixtures';
import { GoogleMapsPage } from '../pages/GoogleMapsPage';
import { skipIfBlocked } from '../utils/google';
import { MAPS_LOCATION } from '../utils/testConfig';

test.describe('Google Maps', () => {
  test('typing shows place suggestions', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Suggestions are unstable on WebKit in CI');
    const maps = new GoogleMapsPage(page);
    await maps.goto();
    await skipIfBlocked(page);
    await maps.typeInSearch(MAPS_LOCATION);
    await maps.expectSuggestions();
  });

  test('search navigates to a results map', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Maps (heavy WebGL/canvas) can crash WebKit in CI');
    const maps = new GoogleMapsPage(page);
    await maps.goto();
    await skipIfBlocked(page);
    await maps.submitSearchWithFallback(MAPS_LOCATION);
    await maps.expectMapLoaded();
  });
});
