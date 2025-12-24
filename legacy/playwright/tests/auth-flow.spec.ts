import { test, expect } from '@playwright/test';
import {
  makeCredentials,
  signupViaUi,
  signupViaApi,
  loginViaUi,
  logoutViaMenu,
  resetProgressViaApi,
} from './utils/user';

test.describe('Authentication flows', () => {
  test('new player can sign up from the desktop app', async ({ page, request }) => {
    const credentials = makeCredentials({ audience: 'RETIRED' });

    await signupViaUi(page, credentials);

    await expect(page.getByText(/Next Up/i)).toBeVisible({ timeout: 15000 });

    const sessionJson = await page.evaluate(() => window.localStorage.getItem('lifequest.session'));
    if (sessionJson) {
      const session = JSON.parse(sessionJson);
      if (session?.userId) {
        await resetProgressViaApi(request, session.userId);
      }
    }

    await logoutViaMenu(page);
  });

  test('existing player can log in successfully', async ({ page, request }) => {
    const credentials = makeCredentials();
    const created = await signupViaApi(request, credentials);

    await loginViaUi(page, credentials);

    await expect(page.getByText(/Next Up/i)).toBeVisible({ timeout: 15000 });

    await resetProgressViaApi(request, created.id);
    await logoutViaMenu(page);
  });
});
