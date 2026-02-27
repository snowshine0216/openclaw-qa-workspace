/**
 * Seed test for Playwright Planner.
 * Bootstraps fixtures, auth, and environment. Required input for Planner when exploring the app.
 * Uses the same fixtures as reportUndoRedo specs.
 */
import { test, expect } from './fixtures';

test.describe('Seed — environment bootstrap', () => {
  test('seed', async ({ page, libraryPage }) => {
    // authenticatedPage fixture (used via page): performs login when reportTestUrl + reportTestUser are set
    // libraryPage.openDefaultApp(): navigates to app (no-op if reportTestUrl not set)
    await libraryPage.openDefaultApp();
    expect(page.url()).toBeTruthy();
  });
});
