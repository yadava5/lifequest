import { defineConfig, devices } from '@playwright/test';

/*
 * LifeQuest end-to-end suite.
 *
 * Default: hermetic. Playwright builds the SPA and serves it with `vite
 * preview` on a fixed port, then drives real Chromium against it. With no
 * VITE_API_URL the app runs its in-browser demo client, so the suite has no
 * network/backend dependency and is deterministic — it always runs green.
 *
 * Against the real backend: set E2E_BASE_URL to a deployment that talks to the
 * live API (e.g. the production URL). Playwright then skips the local server
 * and drives that origin instead, exercising true Postgres persistence.
 *   E2E_BASE_URL=https://lifequest-sigma-fawn.vercel.app npm run -w apps/desktop e2e
 */

const PORT = Number(process.env.E2E_PORT ?? 4317);
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const useLocalServer = !process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // Chromium only (desktop + a 375px mobile-emulation viewport), so no extra
  // browser engines need downloading and the suite stays fast and portable.
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: useLocalServer
    ? {
        command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
});
