import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    headless: true,
  },
  reporter: [["html", { open: "on-failure" }]],
});