import { test } from '@playwright/test';
import { expectTitleVisible } from './helpers/common';
import { login } from './helpers/login';

test('logs in with configured credentials', async ({ page }) => {
  const companyKey = 'ABCDallas';
  const username = 'ABCDallas';
  const password = 'Info@12345';

  test.skip(
    !companyKey || !username || !password,
    'Set COMPANY_KEY, TEST_USERNAME, and TEST_PASSWORD to run the login test',
  );

  await login(page, { companyKey, username, password });
  const leftPanelOptions = [
    'Dashboard',
    'CSR DashBoard',
    'Sales Dashboard',
    'Customer',
    'Marketing',
    'Service',
    'Setups',
    'Appointments',
    'Employee',
    'Inventory',
    'Dispatch',
    'Billing',
    'Batch Management',
    'Print Batch',
    'Configurations',
    'Signed Agreements',
    'Service Appointment Notification',
    'Project Management',
    'Report',
    'Report Gallery',
    'Report Scheduler',
    'Filter Templates',
    'Import',
    'Integration Logs',
    'Utility',
    'Recent',
  ];

  for (const option of leftPanelOptions) {
    await expectTitleVisible(page, option);
  }
});
