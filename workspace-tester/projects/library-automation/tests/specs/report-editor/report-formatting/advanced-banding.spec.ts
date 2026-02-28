/**
 * Migrated from WDIO: ReportEditor_advancedBanding.spec.js
 * Phase 2i - reportFormatting: Advanced banding formatting.
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser } = reportFormattingData;

test.describe('Report editor advanced banding formatting', () => {
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

  test('[TC83064] Functional [Workstation][Report Editor] Advanced banding formatting', async ({
    libraryPage,
    reportDatasetPanel,
    reportToolbar,
    reportTOC,
    newFormatPanelForGrid,
    reportFormatPanel,
    reportGridView,
  }) => {
    await libraryPage.createNewReportByUrl({});
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);
    await reportDatasetPanel.addMultipleObjectsToRows(['Subcategory', 'Category']);
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Cost Growth', 'Profit', 'Profit Margin']);
    await reportToolbar.switchToDesignMode();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await reportFormatPanel.enableBanding();

    const row1 = await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color');
    expect(JSON.stringify(row1), 'Row 1 banding white').toBe(JSON.stringify(Array(5).fill('rgba(255,255,255,1)')));
    const row2 = await reportGridView.getGridCellStyleByRows(0, 4, 2, 'background-color');
    expect(JSON.stringify(row2), 'Row 2 banding gray').toBe(JSON.stringify(Array(5).fill('rgba(246,246,246,1)')));

    await reportFormatPanel.selectBandingByRows();
    await reportFormatPanel.applyColorByNumberOfRows();
    await reportFormatPanel.setApplyColorEvery('3');

    await reportFormatPanel.changeFirstBandingColor('#FFDEC6');
    await reportFormatPanel.changeSecondBandingColor('#DEDEDE');

    const r1 = await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color');
    expect(JSON.stringify(r1), 'Peach row 1').toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));

    await reportFormatPanel.openApplyColorBySelectionBox();
    await reportFormatPanel.applyColorByRowHeader();
    await reportFormatPanel.openBandingHeaderSelectionBox();
    await reportFormatPanel.selectOptionFromDropdown('Category');

    await reportFormatPanel.selectBandingBy('Column');
    await reportFormatPanel.selectBandingHeader('Metrics');
    await reportFormatPanel.openApplyColorBySelectionBox();
    await reportFormatPanel.applyColorByNumberOfColumns();
    await reportFormatPanel.setApplyColorEvery('1');

    await reportFormatPanel.openBandingColorPicker('First');
    await newFormatPanelForGrid.clickBuiltInColor('#FFAE8B');
    await reportFormatPanel.openBandingColorPicker('Second');
    await newFormatPanelForGrid.clickBuiltInColor('#ABABAB');

    const col2 = await reportGridView.getGridCellStyleByCols(0, 24, 2, 'background-color');
    expect(col2, 'Coral column 2').toBe(JSON.stringify(Array(25).fill('rgba(255,174,139,1)')));
    const col3 = await reportGridView.getGridCellStyleByCols(0, 24, 3, 'background-color');
    expect(col3, 'Silver column 3').toBe(JSON.stringify(Array(25).fill('rgba(171,171,171,1)')));
  });
});
