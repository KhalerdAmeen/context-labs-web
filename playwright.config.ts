import { defineConfig } from "@playwright/test";

// End-to-end checks against `next dev` with the live library (drafts visible) and no Loops keys:
// /api/download then logs the signed link instead of emailing it, so the whole pop-up flow runs locally.
// Run: npm run test:e2e
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // next dev compiles each route on first request; give cold starts room
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: { baseURL: "http://localhost:3300", viewport: { width: 1440, height: 900 } },
  webServer: {
    command: "next dev -p 3300",
    url: "http://localhost:3300",
    reuseExistingServer: true,
    timeout: 120_000,
    env: { NEXT_PUBLIC_WAITLIST: "false" },
  },
});
