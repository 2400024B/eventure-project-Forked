import './playwright-coverage.js';
import { test, expect } from '@playwright/test';

test.describe('Frontend Tests - Delete Event', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5050');
    await page.waitForSelector('.event-card', { timeout: 10000 });
  });

  test('Delete Event – confirmation modal appears', async ({ page }) => {
    await page.locator('text=Delete').first().click();
    await expect(page.locator('#delete-modal-overlay')).toBeVisible();
  });

  test('Delete Event – cancel deletion keeps event', async ({ page }) => {
    const eventCountBefore = await page.locator('.event-card').count();

    await page.locator('text=Delete').first().click();
    await page.locator('#cancel-delete-btn').click();

    const eventCountAfter = await page.locator('.event-card').count();
    expect(eventCountAfter).toBe(eventCountBefore);
  });

  test('Delete Event – successful deletion removes event', async ({ page }) => {
    const eventCountBefore = await page.locator('.event-card').count();

    await page.locator('text=Delete').first().click();
    await page.locator('#confirm-delete-btn').click();
    await page.waitForTimeout(1000);

    const eventCountAfter = await page.locator('.event-card').count();
    expect(eventCountAfter).toBeLessThan(eventCountBefore);
  });

});
