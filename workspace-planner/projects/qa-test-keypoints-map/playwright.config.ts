import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectRoot, 'tests/e2e/workspace');

export default defineConfig({
  testDir: path.resolve(projectRoot, 'tests/e2e/specs'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5174',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: `FQPO_RUNS_ROOT=${workspaceRoot}/runs QA_KEYPOINTS_READ_ONLY_FEATURE_IDS=BCIN-6709 WORKSPACE_ROOT=${workspaceRoot} PORT=4174 npm run start:server`,
      url: 'http://127.0.0.1:4174/api/health',
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
    {
      command: 'VITE_DEFAULT_FEATURE=BCIN-E2E npm run start:client',
      url: 'http://127.0.0.1:5174',
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
