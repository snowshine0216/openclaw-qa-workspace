/**
 * Migrated from WDIO: ReportEditor_advancedPadding.spec.js
 * Phase 2i - reportFormatting: Advanced cell padding formatting.
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser } = reportFormattingData;

test.describe('Report editor advanced padding formatting', () => {
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

  test('[TC83061] Functional [Workstation][Report Editor] Cell padding formatting', async ({
    libraryPage,
    reportDatasetPanel,
    reportToolbar,
    reportTOC,
    reportFormatPanel,
    reportGridView,
    newFormatPanelForGrid,
  }) => {
    await libraryPage.createNewReportByUrl({});
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);
    await reportDatasetPanel.addMultipleObjectsToRows(['Region']);
    await reportDatasetPanel.clickFolderUpMultipleTimes(1);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Products']);
    await reportDatasetPanel.addMultipleObjectsToRows(['Category']);
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit', 'Profit Margin']);
    await reportToolbar.switchToDesignMode();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandSpacingSection();

    await newFormatPanelForGrid.selectCellPadding('small');
    expect(await reportFormatPanel.getPaddingValue('Top'), 'Small padding Top').toBe('2.3');
    expect(await reportFormatPanel.getPaddingValue('Right'), 'Small padding Right').toBe('4.5');
    expect(await reportFormatPanel.getPaddingValue('Bottom'), 'Small padding Bottom').toBe('2.3');
    expect(await reportFormatPanel.getPaddingValue('Left'), 'Small padding Left').toBe('4.5');

    await newFormatPanelForGrid.selectCellPadding('medium');
    expect(await reportFormatPanel.getPaddingValue('Top'), 'Medium padding Top').toBe('5.2');
    expect(await reportFormatPanel.getPaddingValue('Right'), 'Medium padding Right').toBe('10.5');
    expect(await reportFormatPanel.getPaddingValue('Bottom'), 'Medium padding Bottom').toBe('5.2');
    expect(await reportFormatPanel.getPaddingValue('Left'), 'Medium padding Left').toBe('10.5');

    await newFormatPanelForGrid.selectCellPadding('large');
    expect(await reportFormatPanel.getPaddingValue('Top'), 'Large padding Top').toBe('6');
    expect(await reportFormatPanel.getPaddingValue('Right'), 'Large padding Right').toBe('12');
    expect(await reportFormatPanel.getPaddingValue('Bottom'), 'Large padding Bottom').toBe('6');
    expect(await reportFormatPanel.getPaddingValue('Left'), 'Large padding Left').toBe('12');

    await reportTOC.switchToFormatPanel();
    await reportFormatPanel.setPaddingValue('Top', '5');
    await reportFormatPanel.setPaddingValue('Right', '7');
    await reportFormatPanel.setPaddingValue('Bottom', '2.5');
    await reportFormatPanel.setPaddingValue('Left', '19');

    const paddingRow0 = await reportGridView.getGridCellStyleByRows(0, 4, 0, 'padding');
    expect(JSON.stringify(paddingRow0), 'Manual padding row 0').toBe(JSON.stringify(Array(5).fill('6px 9px 3px 25px')));

    await reportFormatPanel.clickOnPaddingArrowButton('Left', 'down', 1);
    expect(await reportFormatPanel.getPaddingValue('Left'), 'Left after down 1').toBe('18');

    await reportFormatPanel.clickOnPaddingArrowButton('Left', 'up', 2);
    expect(await reportFormatPanel.getPaddingValue('Left'), 'Left after up 2').toBe('20');

    await reportFormatPanel.clickOnPaddingArrowButton('Left', 'up', 1);
    expect(await reportFormatPanel.getPaddingValue('Left'), 'Left max 20').toBe('20');
  });
});
