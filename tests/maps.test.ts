import { test } from "@playwright/test";
import { GoogleMapsPage } from "../pages/GoogleMapsPage";
import { LOCATION } from "../utils/testConfig";

test.describe("Google Maps Tests", () => {
  test("Search on Google Maps", async ({ page }) => {
    const googleMaps = new GoogleMapsPage(page);
    await googleMaps.navigate();
    await googleMaps.searchLocation(LOCATION);
    await googleMaps.verifyLocation();
  });
});