/**
 * Migrated from WDIO: ReportEditor_theme_security.spec.js
 * Phase 2g - reportTheme: Privilege check (BCIN-6493).
 */
import { test, expect, reportThemeData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers } = reportThemeData;

test.describe('Report privilege check', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: reportThemeData.testUserWithoutUseFormattingEditorPrivilege.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-6493_01] apply theme with orange template and banding', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportDatasetPanel,
  }) => {
    const orangeThemeWithBanding = 't02. orange template with banding';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportTOC.switchToThemePanel();
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be displayed for user without Use Formatting Editor privilege'
    ).toBe(true);
    await reportThemePanel.searchTheme(orangeThemeWithBanding);
    await reportThemePanel.applyTheme(orangeThemeWithBanding);
    await expect(reportPage.getContainer()).toBeVisible();
  });
});
