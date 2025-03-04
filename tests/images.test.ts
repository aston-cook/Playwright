import { test } from "@playwright/test";
import { GoogleImagesPage } from "../pages/GoogleImagesPage";
import { SEARCH_TERM } from "../utils/testConfig";

test("Google Images Smoke Test", async ({ page }) => {
  const googleImages = new GoogleImagesPage(page);
  await googleImages.navigate();
  await googleImages.searchImage(SEARCH_TERM);
  await googleImages.verifyResults();
});