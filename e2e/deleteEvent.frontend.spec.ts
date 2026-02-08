import './playwright-coverage.js';
import { test, expect } from '@playwright/test';

test.describe('Frontend Tests - Delete Event', () => {

  test.beforeEach(async ({ page }) => {
    // Seed ONE event so Delete Event can be tested independently
    await fetch('http://localhost:5050/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Playwright Test Event',
        description: 'Seeded for Delete Event testing',
        date: '2026-02-08',
        time: '10:00',
        location: 'Test Location',
      }),
    });

    // Load frontend
    await page.goto('http://localhost:5050');

    // Ensure event card exists before testing
    await page.waitForSelector('.event-card', { timeout: 10000 });
  });

  test('Delete Event – confirmation modal appears', async ({ page }) => {
    await page.locator('text=Delete').first().click();

    const modal = page.locator('#delete-modal-overlay');

    // Modal should become visible
    await expect(modal).toBeVisible();
  });

  test('Delete Event – cancel deletion keeps event', async ({ page }) => {
    const eventCountBefore = await page.locator('.event-card').count();

    await page.locator('text=Delete').first().click();

    const modal = page.locator('#delete-modal-overlay');
    await expect(modal).toBeVisible();

    await page.locator('#cancel-delete-btn').click();

    // Modal should close
    await expect(modal).toHaveClass(/hidden/);

    const eventCountAfter = await page.locator('.event-card').count();
    expect(eventCountAfter).toBe(eventCountBefore);
  });

  test('Delete Event – successful deletion removes event', async ({ page }) => {
    // Prevent alert() from freezing Playwright
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    const eventCountBefore = await page.locator('.event-card').count();

    await page.locator('text=Delete').first().click();

    const modal = page.locator('#delete-modal-overlay');
    await expect(modal).toBeVisible();

    await page.locator('#confirm-delete-btn').click();

    // Allow time for backend + UI refresh
    await page.waitForTimeout(1500);

    const eventCountAfter = await page.locator('.event-card').count();
    expect(eventCountAfter).toBeLessThan(eventCountBefore);
  });

});
