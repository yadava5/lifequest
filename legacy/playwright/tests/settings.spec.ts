import { test, expect } from '@playwright/test';
import {
  makeCredentials,
  signupViaApi,
  loginViaUi,
  openProfileMenu,
  logoutViaMenu,
  resetProgressViaApi,
} from './utils/user';

const UPDATED_NAME = 'Playwright Pioneer';

test('player can update profile details and reset progress', async ({ page, request }) => {
  const credentials = makeCredentials({ audience: 'LAID_OFF' });
  const created = await signupViaApi(request, credentials);

  await loginViaUi(page, credentials);

  await openProfileMenu(page);
  await page.getByTestId('profile-menu-settings').click();
  await expect(page.getByRole('heading', { name: /account settings/i })).toBeVisible({ timeout: 10000 });

  await page.getByLabel('Display name').fill(UPDATED_NAME);
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Player focus').click();
  await page.getByRole('option', { name: /new chapter/i }).click();

  await page.getByRole('button', { name: /save changes/i }).click();
  await expect(page.getByText(/Profile updated successfully/i)).toBeVisible({ timeout: 10000 });

  await page.getByRole('button', { name: /reset progress/i }).click();
  await expect(page.getByText(/Quest progress has been reset/i)).toBeVisible({ timeout: 10000 });

  await logoutViaMenu(page);

  // reset progress for cleanliness (already triggered via UI, but ensure backend clean state)
  await resetProgressViaApi(request, created.id);
});
