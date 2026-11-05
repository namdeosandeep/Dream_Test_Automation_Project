import type { Page } from '@playwright/test';

export interface LoginCredentials {
  companyKey: string;
  username: string;
  password: string;
}

export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
  await page.goto('https://staging.pestream.com/Account/Login');
  await page.getByRole('textbox', { name: 'Company Key' }).fill(credentials.companyKey);
  await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
}