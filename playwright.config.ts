import { defineConfig } from '@playwright/test';
import { testConfig } from './tests/support/test-config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: testConfig.baseUrl,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    browserName: 'chromium'
  }
});
