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

/** Read the persisted lifetime-earned coins (drives tier; must be monotonic). */
const readLifetime = (page: Page) =>
  page.evaluate(() => {
    try {
      const u = JSON.parse(localStorage.getItem('lifequest-auth-v1') || '{}')?.state?.user;
      return u?.lifetimeCoins ?? u?.coins ?? null;
    } catch {
      return null;
    }
  });

/** Read the persisted quest statuses, so status transitions are assertable on
 *  both layouts without depending on the desktop-only sidebar. */
const readQuestStatuses = (page: Page): Promise<string[]> =>
  page.evaluate(() => {
    try {
      const u = JSON.parse(localStorage.getItem('lifequest-auth-v1') || '{}')?.state?.user;
      return (u?.quests ?? []).map((q: { status: string }) => q.status);
    } catch {
      return [];
    }
  });

/**
 * STRICT 0-purple guarantee, verified on computed colors (not source). Walks
 * every element's resolved color/background/border/fill/stroke/shadow, converts
 * to HSL, and counts anything in the purple→magenta hue band (255–330°) with
 * meaningful saturation. The dawn identity is coral/gold/teal/sky only, so this
 * must always be exactly 0.
 */
const purpleCount = (page: Page): Promise<number> =>
  page.evaluate(() => {
    const toHsl = (rgb: string) => {
      const m = rgb.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(',').map((s) => parseFloat(s.trim()));
      let [r, g, b] = p;
      const a = p[3] === undefined ? 1 : p[3];
      if (a === 0) return null;
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      let h = 0;
      const l = (max + min) / 2;
      const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
      if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
      }
      return { h, s, l };
    };
    const props = ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'outlineColor', 'textDecorationColor', 'fill', 'stroke', 'boxShadow'];
    let count = 0;
    document.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el as Element);
      props.forEach((pr) => {
        const v = (cs as unknown as Record<string, string>)[pr];
        if (!v || v === 'none') return;
        (v.match(/rgba?\([^)]+\)/g) || []).forEach((rgb) => {
          const hsl = toHsl(rgb);
          if (!hsl) return;
          if (hsl.h >= 255 && hsl.h <= 330 && hsl.s > 0.12 && hsl.l > 0.05 && hsl.l < 0.98) count += 1;
        });
      });
    });
    return count;
  });

/** Read the tier-ladder's live rank (the §03 landing invariant demo). The
 *  ladder is the only place that renders the "rank · <tier>" read-out, so a
 *  document-wide scan is unambiguous and independent of scroll/layout. */
const readLadderRank = (page: Page): Promise<string> =>
  page.evaluate(() => {
    const m = (document.body.textContent || '').match(/rank\s*·\s*(Explorer|Adventurer|Trailblazer|Luminary)/i);
    return m ? m[1] : '';
  });

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

/* ────────────────────────────────────────────────────────────────────────── *
 *  Extended control coverage — every interactive control across every screen,
 *  each driven in a real browser and asserted on its effect. Runs on desktop
 *  + mobile so both layouts are exercised.
 * ────────────────────────────────────────────────────────────────────────── */

test.describe('LifeQuest — landing controls', () => {
  test('nav System Card + footer links point at the booklet', async ({ page }) => {
    await gotoLanding(page);
    // Header System Card chip is desktop-only (sm:inline-flex); the footer link
    // is always present. Both must target the static booklet route.
    const footerLink = page.getByRole('link', { name: /System Card · Vol\. 01/i });
    await expect(footerLink).toHaveAttribute('href', '/system-card/');
    await expect(page.getByRole('link', { name: /Read the System Card/i })).toHaveAttribute('href', '/system-card/');
  });

  test('“Create an account” opens the auth card and the sign-up toggle works', async ({ page }) => {
    await gotoLanding(page);
    await page.getByRole('button', { name: /Create an account/i }).first().click();
    await expect(page.getByText('Sign in to continue')).toBeVisible();
    // Flip to the sign-up form — its Focus-audience select is a real control.
    await page.getByRole('button', { name: /Need an account\? Sign up/i }).click();
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await page.locator('select').selectOption('RETIRED');
    await expect(page.locator('select')).toHaveValue('RETIRED');
    // …and back, proving the mode toggle is bidirectional.
    await page.getByRole('button', { name: /Already have an account\? Sign in/i }).click();
    await expect(page.getByText('Sign in to continue')).toBeVisible();
  });

  test('§03 tier ladder: completing climbs the rank, redeeming never demotes', async ({ page }) => {
    await gotoLanding(page);
    const complete = page.getByRole('button', { name: /Complete a quest/i });
    const redeem = page.getByRole('button', { name: /Redeem a reward/i });
    await complete.scrollIntoViewIfNeeded();
    // Starts at Adventurer (lifetime 1450).
    await expect.poll(() => readLadderRank(page)).toBe('Adventurer');
    // Three completes push lifetime past 1800 → the rank climbs to Trailblazer.
    await complete.click();
    await complete.click();
    await complete.click();
    await expect.poll(() => readLadderRank(page)).toBe('Trailblazer');
    // The crown-jewel invariant: spending coins must NOT set the rank back.
    await expect(redeem).toBeEnabled();
    await redeem.click();
    await expect.poll(() => readLadderRank(page)).toBe('Trailblazer');
    await expect(page.getByText(/spending can.t demote you/i)).toBeVisible();
  });

  test('§05 adopters section + honest standing note render in full', async ({ page }) => {
    await gotoLanding(page);
    for (const name of [
      'Workforce nonprofits & job clubs',
      'University career centers',
      'Public libraries',
      'Workforce & unemployment offices',
    ]) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }
    await expect(page.getByText(/Where it honestly stands/i)).toBeVisible();
  });

  test('summit-signature flag is an operable control (plant the flag)', async ({ page }) => {
    await gotoLanding(page);
    const flag = page.getByRole('button', { name: /Plant the flag/i });
    await flag.scrollIntoViewIfNeeded();
    await expect(flag).toBeVisible();
    await flag.click(); // re-plants — must not throw or navigate
    await expect(page.getByRole('heading', { name: /Play the prototype/i })).toBeVisible();
  });
});

test.describe('LifeQuest — Mission Control controls', () => {
  test('log a ritual, log today’s win, and start a quest each take effect', async ({ page }) => {
    await enterDemo(page);

    // Daily ritual: logging it flips the row to its completed (disabled) state.
    const ritual = page.getByRole('button', { name: /Mindful break/i });
    await expect(ritual).toBeEnabled();
    await ritual.click();
    await expect(ritual).toBeDisabled();

    // Hero primary — completes the active mission and pays out coins.
    const coinsBefore = (await readCoins(page)) ?? 0;
    await page.getByRole('button', { name: /Log today’s win/i }).click();
    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBeGreaterThan(coinsBefore);

    // Hero secondary — starts the next pending quest (one PENDING → IN_PROGRESS).
    const start = page.getByRole('button', { name: /Start a quest/i });
    if (await start.isEnabled()) {
      const pendingBefore = (await readQuestStatuses(page)).filter((s) => s === 'PENDING').length;
      await start.click();
      await expect
        .poll(async () => (await readQuestStatuses(page)).filter((s) => s === 'PENDING').length)
        .toBeLessThan(pendingBefore);
    }
  });
});

test.describe('LifeQuest — Quest Log controls', () => {
  test('tab filter switches views; Accept then Complete drive status + coins', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/quests');
    await expect(page.getByRole('heading', { name: 'Track your missions' })).toBeVisible();

    // History tab shows the cleared mission and hides the active ones.
    await page.getByRole('button', { name: /^History$/i }).click();
    await expect(page.getByText('Take a real break')).toBeVisible();
    await page.getByRole('button', { name: /^Active$/i }).click();

    // Accept moves a PENDING quest to IN_PROGRESS.
    const accept = page.getByRole('button', { name: /^Accept$/ }).first();
    if (await accept.count()) {
      const inProgBefore = (await readQuestStatuses(page)).filter((s) => s === 'IN_PROGRESS').length;
      await accept.click();
      await expect
        .poll(async () => (await readQuestStatuses(page)).filter((s) => s === 'IN_PROGRESS').length)
        .toBeGreaterThan(inProgBefore);
    }

    // Complete pays out — coins rise.
    const coinsBefore = (await readCoins(page)) ?? 0;
    await page.getByRole('button', { name: /^\s*Complete\s*$/ }).first().click();
    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBeGreaterThan(coinsBefore);
  });
});

test.describe('LifeQuest — Reward Vault invariant', () => {
  test('redeeming spends coins but never lowers lifetime earned (no demote)', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/rewards');
    await expect(page.getByRole('heading', { name: 'Spend your hard-won coins' })).toBeVisible();

    const coinsBefore = (await readCoins(page)) ?? 0;
    const lifetimeBefore = (await readLifetime(page)) ?? 0;

    const unlock = page.getByRole('button', { name: /Unlock reward/i }).first();
    await expect(unlock).toBeVisible();
    await unlock.click();

    // Spendable balance drops…
    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBeLessThan(coinsBefore);
    // …but lifetime earned (which the tier reads) is untouched — the invariant.
    expect(await readLifetime(page)).toBe(lifetimeBefore);
    // The unlock is confirmed and the trophy shelf fills.
    await expect(page.getByText(/Unlocked/i).first()).toBeVisible();
    await expect(page.locator('aside').getByText('Nothing claimed yet')).toHaveCount(0);
  });
});

test.describe('LifeQuest — Guild controls', () => {
  test('“Share your latest win” broadcasts a confirmation', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/community');
    await expect(page.getByRole('heading', { name: 'Rally your crew' })).toBeVisible();
    await page.getByRole('button', { name: /Share your latest win/i }).click();
    // A live-region confirmation appears (grounded in the seeded cleared quest).
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/Shared .* with the guild|Broadcast sent/i)).toBeVisible();
  });
});

test.describe('LifeQuest — Settings controls', () => {
  test('display-name save, audience select, reset, and export all work', async ({ page }, testInfo) => {
    await enterDemo(page);
    const project = testInfo.project.name;
    const nav = navFor(page, project);
    const homeLink = () => nav.getByRole('link', { name: project === 'mobile' ? 'Home' : 'Mission Control', exact: true });
    const settingsLink = () => nav.getByRole('link', { name: 'Settings', exact: true });

    // Earn coins first so Reset has a non-seed balance to actually restore.
    await page.getByRole('button', { name: /Log today’s win/i }).click();
    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBeGreaterThan(320);

    // NOTE: navigate client-side (nav links, not page.goto) — a full reload
    // re-seeds the in-browser demo by design, which would revert the identity
    // change before we could observe it.
    await settingsLink().click();
    await expect(page.getByRole('heading', { name: 'Account preferences' })).toBeVisible();

    // Display name + audience select persist…
    const nameInput = page.locator('input').first();
    await nameInput.fill('Aria Voyager');
    await page.locator('select').selectOption('RETIRED');
    await expect(page.locator('select')).toHaveValue('RETIRED');
    await page.getByRole('button', { name: /Save changes/i }).click();

    // …and the new name shows up back on Mission Control (visible effect).
    await homeLink().click();
    await expect(page.getByRole('heading', { name: /Welcome back, Aria/i })).toBeVisible();

    // Reset progress restores the seeded coin balance (400 → 320).
    await settingsLink().click();
    await page.getByRole('button', { name: /Reset progress/i }).click();
    await expect.poll(() => readCoins(page), { timeout: 10_000 }).toBe(320);

    // Data export offers a real JSON download (captured by Playwright, not
    // persisted to the user's machine).
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Download export/i }).click(),
    ]);
    expect(download.suggestedFilename()).toBe('lifequest-export.json');
  });
});

test.describe('LifeQuest — strict 0-purple audit (computed colors)', () => {
  test('landing carries zero purple in both dawn themes', async ({ page }) => {
    await gotoLanding(page);
    expect(await purpleCount(page)).toBe(0);
    // Flip the theme and re-audit the resolved palette.
    await page.getByRole('button', { name: 'Toggle theme' }).first().click();
    await expect.poll(() => purpleCount(page)).toBe(0);
  });

  test('every in-app screen carries zero purple', async ({ page }) => {
    await enterDemo(page);
    // Per-route settle anchor (Settings renders a CardTitle, not an <h1>).
    const routes: Array<[string, string | RegExp]> = [
      ['/', /Welcome back/i],
      ['/quests', 'Track your missions'],
      ['/rewards', 'Spend your hard-won coins'],
      ['/community', 'Rally your crew'],
      ['/settings', 'Account preferences'],
    ];
    for (const [path, anchor] of routes) {
      await page.goto(path);
      await expect(page.getByText(anchor).first()).toBeVisible();
      expect(await purpleCount(page), `purple found on ${path}`).toBe(0);
    }
  });
});
