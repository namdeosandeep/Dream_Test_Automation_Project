import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';
import { login } from './helpers/login';

const reportCategories = ['CRM', 'SalesAuto', 'WorkOrder', 'Billing', 'General', 'Beta Testing Report'];
const credentials = {
  companyKey: process.env.COMPANY_KEY ?? '',
  username: process.env.TEST_USERNAME ?? '',
  password: process.env.TEST_PASSWORD ?? '',
};
const reportsUrl = new URL('/SSRSReports/Index', 'https://staging.pestream.com/').href;
const reportsPath = new URL(reportsUrl).pathname.replace(/\/+$/, '');
const errorMessage = /application error|server error|error occurred|error while loading|reporting services error|http\s+\d{3}|not found|unhandled exception/i;

function isReportsGalleryUrl(url: URL): boolean {
  return url.origin === new URL(reportsUrl).origin && url.pathname.replace(/\/+$/, '') === reportsPath;
}

for (const categoryName of reportCategories) {
  test(`${categoryName} reports open without an error or blank page`, async ({ page }) => {
    test.setTimeout(10 * 60 * 1000);
    page.setDefaultNavigationTimeout(30_000);
    test.skip(
      !credentials.companyKey || !credentials.username || !credentials.password,
      'Set COMPANY_KEY, TEST_USERNAME, and TEST_PASSWORD to run this test',
    );

    await login(page, credentials);
    await page.goto(reportsUrl);

    const category = page.locator('.configuration:visible').filter({
      has: page.getByRole('heading', { name: categoryName, exact: true }),
    }).first();
    const reportLinks = category.locator('a[href^="/"]');
    await expect(reportLinks.first()).toBeVisible();

    const reports = await reportLinks.evaluateAll((links) => {
      const reportsByNameAndHref = new Map<string, { href: string; name: string }>();

      for (const link of links) {
        const href = link.getAttribute('href');
        const name = link.textContent?.trim();

        if (href && name) {
          reportsByNameAndHref.set(`${name}\0${href}`, { href, name });
        }
      }

      return Array.from(reportsByNameAndHref.values());
    });
    const failures: string[] = [];
    const successes: string[] = [];

    for (const report of reports) {
      const pagesBeforeClick = new Set(page.context().pages());
      let openedPage: typeof page | undefined;
      const onNewPage = (newPage: typeof page) => {
        if (!pagesBeforeClick.has(newPage)) {
          openedPage = newPage;
        }
      };
      page.context().on('page', onNewPage);

      try {
        await category.getByRole('link', { name: report.name, exact: true }).click();
        await expect.poll(
          () => Boolean(openedPage) || !isReportsGalleryUrl(new URL(page.url())),
          { timeout: 30_000, message: `${report.name} should open a report page` },
        ).toBe(true);

        const reportPage = openedPage ?? page;
        await expect.poll(
          () => reportPage.url() !== 'about:blank',
          { timeout: 30_000, message: `${report.name} should navigate to a report URL` },
        ).toBe(true);
        expect(isReportsGalleryUrl(new URL(reportPage.url())), `${report.name} should navigate away from the reports gallery`).toBe(false);

        const reportContent = reportPage.locator(
          'h1:visible, h2:visible, h3:visible, h4:visible, input:visible, select:visible, textarea:visible, form:visible, table:visible, iframe:visible, canvas:visible, svg:visible, [role="img"]:visible',
        );
        await expect(reportContent.first(), `${report.name} should not be blank`).toBeVisible();

        const pageText = await reportPage.locator('body').innerText();
        expect(pageText, `${report.name} should not display an error`).not.toMatch(errorMessage);
        successes.push(report.name);
      } catch (error) {
        failures.push(`${report.name}: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        page.context().off('page', onNewPage);

        for (const contextPage of page.context().pages()) {
          if (!pagesBeforeClick.has(contextPage)) {
            await contextPage.close();
          }
        }

        if (!isReportsGalleryUrl(new URL(page.url()))) {
          await page.goBack({ waitUntil: 'commit' });
        }

        await expect(page.locator('.configuration:visible').first()).toBeVisible();
      }
    }

    await test.info().attach('Reports opened successfully', {
      body: Buffer.from(successes.join('\n') || 'None'),
      contentType: 'text/plain',
    });
    await test.info().attach('Reports that failed to open', {
      body: Buffer.from(failures.join('\n') || 'None'),
      contentType: 'text/plain',
    });

    expect(failures, `${categoryName} reports that failed to open cleanly`).toEqual([]);
  });
}