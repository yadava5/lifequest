import { test, expect } from '@playwright/test';
import {
  makeCredentials,
  signupViaApi,
  loginViaUi,
  logoutViaMenu,
  resetProgressViaApi,
} from './utils/user';

test.describe('Quest and reward progression', () => {
  test('player can complete a quest and redeem a reward', async ({ page, request }) => {
    const credentials = makeCredentials({ audience: 'LAID_OFF' });
    const created = await signupViaApi(request, credentials);

    await loginViaUi(page, credentials);

    // Capture initial coins on home screen
    const coinsTextBefore = await page.getByText(/You have .* Quest Coins/i).textContent();

    // Complete the first available quest
    await page.getByRole('button', { name: 'Quest Log' }).click();
    const completeButton = page.getByRole('button', { name: /complete/i }).first();
    await expect(completeButton).toBeVisible();
    await completeButton.click();
    await expect(page.getByText(/Claimed/i).first()).toBeVisible({ timeout: 10000 });

    // Redeem the first affordable reward
    await page.getByRole('button', { name: 'Rewards' }).click();
    const redeemButton = page.getByRole('button', { name: /redeem/i }).first();
    await expect(redeemButton).toBeVisible();
    await redeemButton.click();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByText(/Reward redeemed!/i)).toBeVisible({ timeout: 10000 });

    // Navigate back home and ensure coins text updates (text should exist, even if value changed)
    await page.getByRole('button', { name: 'Home' }).click();
    const coinsTextAfter = await page.getByText(/You have .* Quest Coins/i).textContent();
    expect(coinsTextAfter).not.toBeNull();
    expect(coinsTextAfter).not.toEqual(coinsTextBefore);

    await logoutViaMenu(page);
    await resetProgressViaApi(request, created.id);
  });
});
