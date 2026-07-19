import { test, expect, type Page } from '@playwright/test';

/*
 * Full user-journey coverage for LifeQuest. Runs on two projects (desktop +
 * mobile) so both the sidebar and the folded bottom-tab layout are exercised.
 *
 * Default (hermetic) mode drives a locally-served build running the in-browser
 * demo client — no backend, deterministic. Point E2E_BASE_URL at a real
 * deployment to exercise the live API instead (see playwright.config.ts).
 */

const LIVE = !!process.env.E2E_BASE_URL;

/** Read the persisted spendable-coin balance straight from the store. */
const readCoins = (page: Page) =>
  page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('lifequest-auth-v1') || '{}')?.state?.user?.coins ?? null;
    } catch {
      return null;
    }
  });

/** True when a real session is persisted (the returning-visitor state). */
const hasSession = (page: Page) =>
  page.evaluate(() => {
    try {
      return !!JSON.parse(localStorage.getItem('lifequest-auth-v1') || '{}')?.state?.session;
    } catch {
      return false;
    }
  });

/** Land on the public front door, logged out. */
async function gotoLanding(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Enter the live demo/i }).first()).toBeVisible();
}

/** One-click into the app and wait for Mission Control to render. */
async function enterDemo(page: Page) {
  await gotoLanding(page);
  await page.getByRole('button', { name: /Enter the live demo/i }).first().click();
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible({ timeout: 20_000 });
}

/** Nav destinations, with the label each layout actually renders. */
const DESTINATIONS = [
  { desktop: 'Mission Control', mobile: 'Home', path: '/', heading: /Welcome back/i },
  { desktop: 'Quest Log', mobile: 'Quests', path: '/quests', heading: 'Track your missions' },
  { desktop: 'Reward Vault', mobile: 'Rewards', path: '/rewards', heading: 'Spend your hard-won coins' },
  { desktop: 'Guild', mobile: 'Guild', path: '/community', heading: 'Rally your crew' },
  { desktop: 'Settings', mobile: 'Settings', path: '/settings', heading: 'Account preferences' },
] as const;

const navFor = (page: Page, project: string) =>
  page.locator(project === 'mobile' ? 'nav[aria-label="Primary mobile"]' : 'nav[aria-label="Primary"]');

test.describe('LifeQuest — logged out', () => {
  test('landing renders with working entry buttons', async ({ page }) => {
    await gotoLanding(page);

    await expect(page.getByRole('heading', { name: /Missions aren/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Enter the live demo/i }).first()).toBeEnabled();
    await expect(page.getByRole('button', { name: /Create an account/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^Sign in$/i })).toBeVisible();

    // "Sign in" opens the auth card, and "back" returns to the landing —
    // proving the onSignIn handler and the AuthGate entry toggle both fire.
    await page.getByRole('button', { name: /^Sign in$/i }).click();
    await expect(page.getByText('Sign in to continue')).toBeVisible();
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.getByRole('button', { name: /Enter the live demo/i }).first()).toBeVisible();
  });

  test('hero mission card pays out on complete', async ({ page }) => {
    await gotoLanding(page);
    const complete = page.getByRole('button', { name: /Complete mission/i });
    await expect(complete).toBeVisible();
    await complete.click();
    // Coins tick from 1,000 to 1,060 and the button flips to its logged state.
    await expect(page.getByText('1,060')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /Logged/i })).toBeVisible();
  });

  test('theme toggle persists across reload', async ({ page }) => {
    await gotoLanding(page);
    const before = await page.evaluate(() => document.documentElement.className);
    await page.getByRole('button', { name: 'Toggle theme' }).first().click();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.className))
      .not.toBe(before);
    const toggled = await page.evaluate(() => document.documentElement.className);
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.className))
      .toBe(toggled);
  });
});

test.describe('LifeQuest — in the app', () => {
  test('enter demo, then every screen loads via its nav link', async ({ page }, testInfo) => {
    await enterDemo(page);
    const project = testInfo.project.name;
    const nav = navFor(page, project);

    for (const dest of DESTINATIONS) {
      const label = project === 'mobile' ? dest.mobile : dest.desktop;
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(dest.path === '/' ? '/$' : dest.path));
      await expect(page.getByRole('heading', { name: dest.heading })).toBeVisible();
    }
  });

  test('complete a mission and the session survives a reload', async ({ page }) => {
    await enterDemo(page);

    // Go to the Quest Log and clear a mission.
    await page.goto('/quests');
    await expect(page.getByRole('heading', { name: 'Track your missions' })).toBeVisible();
    const coinsBefore = (await readCoins(page)) ?? 0;
    await page.getByRole('button', { name: /^\s*Complete\s*$/ }).first().click();
    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBeGreaterThan(coinsBefore);
    const coinsAfter = (await readCoins(page)) ?? 0;

    // Reload: the returning-visitor path. The session must persist (this is the
    // exact regression the stale-session fix guards) — no bounce to the landing.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Track your missions' })).toBeVisible({ timeout: 20_000 });
    expect(await hasSession(page)).toBe(true);

    // Against the real backend, the coin balance is a durable write and must
    // survive the reload too. (The local demo client re-seeds by design.)
    if (LIVE) {
      expect(await readCoins(page)).toBe(coinsAfter);
    }
  });

  test('redeem a reward spends coins', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/rewards');
    await expect(page.getByRole('heading', { name: 'Spend your hard-won coins' })).toBeVisible();

    const unlock = page.getByRole('button', { name: /Unlock reward/i });
    await expect(unlock.first()).toBeVisible();
    const coinsBefore = (await readCoins(page)) ?? 0;
    await unlock.first().click();

    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBeLessThan(coinsBefore);
    // The claimed reward lands on the trophy shelf.
    await expect(page.locator('aside').getByText('Nothing claimed yet')).toHaveCount(0);
  });
});

test.describe('LifeQuest — returning visitor', () => {
  test('an expired persisted session falls back to the landing', async ({ page }) => {
    // Get into the app so a real persisted session/user snapshot exists.
    await enterDemo(page);
    expect(await hasSession(page)).toBe(true);

    // Backdate the session's expiry to simulate a lapsed TTL between visits —
    // the exact state that used to strand a returning visitor in a dead app
    // shell with no landing and every write rejected.
    await page.evaluate(() => {
      const raw = JSON.parse(localStorage.getItem('lifequest-auth-v1') || '{}');
      if (raw?.state?.session) {
        raw.state.session.expiresAt = new Date(Date.now() - 60_000).toISOString();
        localStorage.setItem('lifequest-auth-v1', JSON.stringify(raw));
      }
    });

    await page.reload();

    // The public landing must show, and the dead session must be purged.
    await expect(page.getByRole('button', { name: /Enter the live demo/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Missions aren/i })).toBeVisible();
    await expect.poll(() => hasSession(page)).toBe(false);
  });
});

test.describe('LifeQuest — mobile layout', () => {
  test('bottom tab bar is present with all destinations', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout check');
    await enterDemo(page);
    const nav = page.locator('nav[aria-label="Primary mobile"]');
    await expect(nav).toBeVisible();
    for (const label of ['Home', 'Quests', 'Rewards', 'Guild', 'Settings']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });
});
