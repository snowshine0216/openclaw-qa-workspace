/**
 * Migrated from WDIO: ReportEditor_formatPanelChanges.spec.js
 * Phase 2i - reportFormatting: Format panel changes (template, text, borders).
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser } = reportFormattingData;

test.describe('Format panel changes', () => {
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

  test('[TC86198] Functional [Report Editor] Formatting]', async ({
    libraryPage,
    reportDatasetPanel,
    reportToolbar,
    reportGridView,
    reportTOC,
    reportFormatPanel,
    newFormatPanelForGrid,
  }) => {
    await libraryPage.createNewReportByUrl({});
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
    await reportDatasetPanel.addObjectToRows('Year');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Products');
    await reportDatasetPanel.addMultipleObjectsToRows(['Category', 'Subcategory']);
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
    await reportDatasetPanel.addObjectToColumns('Profit Margin');
    await reportToolbar.switchToDesignMode();

    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0) Year').toBe('Year');
    expect(
      await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'),
      'Default header bg'
    ).toBe('rgba(235,235,235,1)');
    expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid (0,3) Cost').toBe('Cost');
    expect(
      await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'),
      'Default cost header bg'
    ).toBe('rgba(235,235,235,1)');

    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandTemplateSection();
    await newFormatPanelForGrid.selectGridTemplateStyle('classic');
    await newFormatPanelForGrid.selectGridTemplateColor('Blue');

    expect(
      await reportGridView.getGridCellStyleByPos(0, 0, 'background-color'),
      'Blue template (0,0)'
    ).toBe('rgba(28,141,212,1)');
    expect(
      await reportGridView.getGridCellStyleByPos(0, 3, 'background-color'),
      'Blue template (0,3)'
    ).toBe('rgba(28,141,212,1)');

    await newFormatPanelForGrid.switchToTextFormatTab();
    await reportFormatPanel.selectGridSegment('Columns', 'Values');
    await newFormatPanelForGrid.selectTextFont(reportFormattingData.updateFont);
    await reportFormatPanel.clickTextFormatButton('bold');
    await newFormatPanelForGrid.setTextFontSize('12');
    await newFormatPanelForGrid.selectFontAlign('right');

    expect(
      await reportGridView.getGridCellStyleByPos(0, 3, 'font-weight'),
      'Font weight bold'
    ).toBe('700');
  });

  test.skip('[TC86199] E2E create report, apply formatting, save and reopen', async () => {
    // Long test - requires full format panel POM implementation
  });
});
