import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 🔒 LIMIT E2E TESTS TO DELETE EVENT ONLY
  testDir: './e2e',
  testMatch: ['**/*deleteEvent*.spec.ts'],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'node index.js',
    url: 'http://localhost:5050',
    reuseExistingServer: !process.env.CI,
  },
});
