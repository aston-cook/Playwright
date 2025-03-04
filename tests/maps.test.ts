import { test } from "@playwright/test";
import { GoogleMapsPage } from "../pages/GoogleMapsPage";
import { LOCATION } from "../utils/testConfig";

test("Google Maps Smoke Test", async ({ page }) => {
  const googleMaps = new GoogleMapsPage(page);
  await googleMaps.navigate();
  await googleMaps.searchLocation(LOCATION);
  await googleMaps.verifyLocation();
});