import { expect, test } from '@playwright/test';
import { login } from './helpers/login';

test('Adding Opportunity with Existing Account', async ({ page }) => {
	const credentials = {
		companyKey: 'ABCDallas',
		username: 'ABCDallas',
		password: 'Info@12345',
	};

	await login(page, credentials);
	await page.goto('/Sales/Lead');
	await expect(page).toHaveTitle('Opportunities');
	await page.getByRole('button', { name: /Add Opportunity/ }).click();

	await expect(page.getByRole('heading', { name: 'Add Opportunity', exact: true })).toBeVisible();

	const accountInput = page.getByPlaceholder('select existing acccount');
	const opportunityNameInput = page.getByPlaceholder('Enter Opportunity Name');
	const opportunityValueInput = page.getByRole('textbox', { name: 'Opportunity Value ($)' });
	const descriptionInput = page.getByPlaceholder('Enter Description');
	const branchChoice = page.locator('#AddLead.modal.in #s2id_BranchSysName a.select2-choice');
	const departmentChoice = page.locator('#AddLead.modal.in #s2id_AddLeadDepartmentSysname a.select2-choice');
	const sourceDropdown = page.locator('#AddLead.modal.in .form-group:has(#ddlLeadSource) button.selectpicker');
	const sourceOption = page.locator('#AddLead.modal.in .form-group:has(#ddlLeadSource) .bootstrap-select .dropdown-menu a.opt').filter({ hasText: /^AFTER HOURS CALL$/ });
	const sourceSelect = page.locator('#AddLead.modal.in #ddlLeadSource');
	const residentialType = page.locator('#AddLead.modal.in input[name="FlowType"][value="Residential"]');
	const opportunityName = `Playwright Test ${Date.now()}`;

	await accountInput.fill('Test LLC');
	await opportunityNameInput.fill(opportunityName);
	await opportunityValueInput.fill('2500');
	await descriptionInput.fill('This is a test opportunity');
	await expect(branchChoice).toHaveText('DFW');
	await branchChoice.click();
	await page.getByRole('option', { name: 'DALLAS', exact: true }).click();
	await departmentChoice.click();
	await page.getByRole('option', { name: '1. Sales', exact: true }).click();
	await sourceDropdown.click();
	await sourceOption.click();
	await residentialType.check();

	await expect(accountInput).toHaveValue('Test LLC');
	await expect(opportunityNameInput).toHaveValue(opportunityName);
	await expect(opportunityValueInput).toHaveValue('2,500.00');
	await expect(descriptionInput).toHaveValue('This is a test opportunity');
	await expect(branchChoice).toHaveText('DALLAS');
	await expect(departmentChoice).toHaveText('1. Sales');
	await expect(page.locator('#AddLead.modal.in select[name="DepartmentSysName"]')).toHaveValue('ABCDallasDepartment1');
	await expect(sourceSelect).toHaveValues(['2581']);
	await expect(residentialType).toBeChecked();
});
