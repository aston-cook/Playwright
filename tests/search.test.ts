import { test } from "@playwright/test";
import { GoogleHomePage } from "../pages/GoogleHomePage";
import { SEARCH_TERM } from "../utils/testConfig";

test.describe("Google Search Tests", () => {
  test("Google Search Page Loads", async ({ page }) => {
    const googleHome = new GoogleHomePage(page);
    await googleHome.navigate();
    await googleHome.verifySearchPageLoad();
  });

  test("Verify User Can Type in the Search Box", async ({ page }) => {
    const googleHome = new GoogleHomePage(page);
    await googleHome.navigate();
    await googleHome.typeInSearchBox(SEARCH_TERM);
  });
});