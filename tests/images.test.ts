import { test } from "@playwright/test";
import { GoogleImagesPage } from "../pages/GoogleImagesPage";
import { SEARCH_TERM } from "../utils/testConfig";

test.describe("Google Images Tests", () => {
  test("Search for an Image", async ({ page }) => {
    const googleImages = new GoogleImagesPage(page);
    await googleImages.navigate();
    await googleImages.searchImage(SEARCH_TERM);
    await googleImages.verifyResults();
  });
});