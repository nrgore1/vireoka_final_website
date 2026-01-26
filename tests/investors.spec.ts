import { test, expect } from '@playwright/test';

test.describe('Investor public flows', () => {
  test('Landing page renders actions', async ({ page }) => {
    await page.goto('/investors');

    await expect(
      page.getByRole('heading', { name: /Investor access/i })
    ).toBeVisible();

    await expect(page.getByRole('button', { name: /Apply/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Check status/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Investor portal/i })).toBeVisible();
  });

  test('Apply page submits and shows thank-you + reference id (mocked)', async ({ page }) => {
    await page.route('**/rest/v1/investor_applications*', async (route, req) => {
      if (req.method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ reference_code: 'INV-TEST1234' }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/investors/apply');

    await page.getByTestId('apply-name').fill('Test Investor');
    await page.getByTestId('apply-email').fill('investor@example.com');
    await page.getByTestId('apply-organization').fill('Example Capital');
    await page.getByTestId('apply-role').fill('Partner');
    await page.getByTestId('apply-focus').fill('AI governance');

    await page.getByRole('button', { name: /submit/i }).click();

    await expect(
      page.getByText(/Thank you for your interest/i)
    ).toBeVisible();

    await expect(
      page.getByText(/invitation to review and accept/i)
    ).toBeVisible();

    await expect(
      page.getByText(/INV-TEST1234/i)
    ).toBeVisible();
  });

  test('Status page redirects anonymous to login (no 404)', async ({ page }) => {
    await page.goto('/investors/status');
    await expect(page).toHaveURL(/\/login\?redirect=\/investors\/status/);
  });
});
