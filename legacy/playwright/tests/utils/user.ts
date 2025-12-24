import { APIRequestContext, Page, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

export const API_BASE = process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:4000/api';

export type AudienceType = 'LAID_OFF' | 'RETIRED';

export interface TestCredentials {
  name: string;
  email: string;
  password: string;
  audience: AudienceType;
}

export interface CreatedUser extends TestCredentials {
  id: string;
}

export const makeCredentials = (overrides: Partial<TestCredentials> = {}): TestCredentials => {
  const id = randomUUID();
  return {
    name: overrides.name ?? `Playwright Explorer ${id.slice(0, 6)}`,
    email: overrides.email ?? `playwright-${id}@example.com`,
    password: overrides.password ?? 'Testing123!',
    audience: overrides.audience ?? 'LAID_OFF',
  };
};

export const signupViaApi = async (request: APIRequestContext, credentials: TestCredentials): Promise<CreatedUser> => {
  const response = await request.post(`${API_BASE}/auth/signup`, {
    data: {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      audience: credentials.audience,
    },
  });

  if (response.status() !== 201) {
    throw new Error(`Signup API failed (${response.status()}): ${await response.text()}`);
  }

  const body = await response.json();
  return {
    id: body.id,
    ...credentials,
  };
};

export const resetProgressViaApi = async (request: APIRequestContext, userId: string) => {
  await request.post(`${API_BASE}/users/${userId}/reset`);
};

export const loginViaUi = async (page: Page, credentials: { email: string; password: string }) => {
  await page.goto('/login');
  await page.getByTestId('signin-email').fill(credentials.email);
  await page.getByTestId('signin-password').fill(credentials.password);
  await page.getByRole('button', { name: /enter lifequest/i }).click();
  await expect(page.getByText(/You have .* Quest Coins/i)).toBeVisible({ timeout: 15000 });
};

export const signupViaUi = async (page: Page, credentials: TestCredentials) => {
  await page.goto('/login');
  await page.getByTestId('toggle-signup').click();
  await page.getByTestId('signup-name').fill(credentials.name);
  await page.getByTestId('signup-email').fill(credentials.email);
  await page.getByTestId('signup-password').fill(credentials.password);
  await page.getByTestId('signup-confirm-password').fill(credentials.password);
  const audienceSelector = page.getByRole('combobox', { name: /player focus/i });
  await audienceSelector.click();
  await page.getByRole('option', { name: credentials.audience === 'LAID_OFF' ? /career transition/i : /new chapter/i }).click();
  await page.getByRole('button', { name: /start your adventure/i }).click();
  await expect(page.getByText(/You have .* Quest Coins/i)).toBeVisible({ timeout: 15000 });
};

export const openProfileMenu = async (page: Page) => {
  await page.getByTestId('profile-menu-button').click();
};

export const logoutViaMenu = async (page: Page) => {
  await openProfileMenu(page);
  await page.getByTestId('profile-menu-logout').click();
  await expect(page.getByRole('button', { name: /enter lifequest/i })).toBeVisible({ timeout: 10000 });
};
