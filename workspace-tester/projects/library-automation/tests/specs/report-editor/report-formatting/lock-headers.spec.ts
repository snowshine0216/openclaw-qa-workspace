/**
 * Migrated from WDIO: ReportEditor_lockHeaders.spec.js
 * Phase 2i - reportFormatting: Lock columns and rows headers.
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser, dossiers } = reportFormattingData;

test.describe('Report Editor Lock Headers in Workstation', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportTestUser || reportUser.username,
      password: env.reportTestPassword ?? reportUser.password,
    });
    await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC85742] Lock columns and rows headers', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFormatPanel,
    reportGridView,
    newFormatPanelForGrid,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.lock_headers_TC85742.id,
      projectId: dossiers.lock_headers_TC85742.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();

    await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Lock headers');
    await reportGridView.scrollGridToBottom('Visualization 1');
    expect(
      await reportGridView.getGridCellByPos(1, 1).isVisible(),
      'Grid cell (1,1) visible after scroll to bottom'
    ).toBe(true);

    await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Lock headers');
    await reportGridView.scrollGridHorizontally('Visualization 1', 4000);
    await reportGridView.scrollGridToBottom('Visualization 1');
    expect(
      await reportGridView.getGridCellByPos(35, 0).isVisible(),
      'Grid cell (35,0) visible after scroll right'
    ).toBe(true);
  });
});
