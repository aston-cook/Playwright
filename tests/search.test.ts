import { test } from "@playwright/test";
import { GoogleHomePage } from "../pages/GoogleHomePage";
import { SEARCH_TERM } from "../utils/testConfig";

test.describe("Google Search Tests", () => {
  test("Text Search on Google", async ({ page }) => {
    const googleHome = new GoogleHomePage(page);
    await googleHome.navigate();
    await googleHome.verifyPage();
  });
});