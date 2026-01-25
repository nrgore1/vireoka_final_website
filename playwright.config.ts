import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  snapshotDir: "./tests/__snapshots__",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
