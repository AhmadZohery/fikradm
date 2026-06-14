import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for admin publish-guard E2E tests.
 * Run:
 *   bun add -d @playwright/test
 *   bunx playwright install --with-deps chromium
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... BLOG_POST_ID=... bunx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:5173",
    locale: "ar-EG",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});