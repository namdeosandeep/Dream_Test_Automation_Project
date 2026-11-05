import { expect, type Page } from '@playwright/test';

function titleLocator(page: Page, title: string) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exactTitle = new RegExp(`^\\s*${escapedTitle}\\s*$`);

  return page.locator('span.title').filter({ hasText: exactTitle });
}

export async function expectTitleVisible(page: Page, title: string): Promise<void> {
  await expect(titleLocator(page, title)).toBeVisible();
}

export async function clickTitle(page: Page, title: string): Promise<void> {
  await titleLocator(page, title).click();
}

export async function clickButton(page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name, exact: true }).click();
}

export async function setCheckbox(
  page: Page,
  label: string,
  checked = true,
): Promise<void> {
  await page.getByRole('checkbox', { name: label, exact: true }).setChecked(checked);
}

export async function clickLink(page: Page, name: string): Promise<void> {
  await page.getByRole('link', { name, exact: true }).click();
}

export async function selectDropdownValue(
  page: Page,
  label: string,
  value: string,
): Promise<void> {
  await page.getByLabel(label, { exact: true }).selectOption(value);
}