/**
 * Migrated from WDIO: ReportEditor_outlineMode.spec.js
 * Phase 2i - reportFormatting: Report outline mode (compact/standard).
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser, dossiers } = reportFormattingData;

test.describe('Report Outline Mode', () => {
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

  test('[TC88431_1] FUN | Report Editor | Grid View | Outline Mode', async ({
    libraryPage,
    reportDatasetPanel,
    reportToolbar,
    reportGridView,
    reportTOC,
    newFormatPanelForGrid,
    reportFormatPanel,
  }) => {
    await libraryPage.createNewReportByUrl({});
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
    await reportDatasetPanel.addObjectToRows('Year');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Geography');
    await reportDatasetPanel.addObjectToRows('Region');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Products');
    await reportDatasetPanel.addObjectToRows('Category');
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
    await reportToolbar.switchToDesignMode();

    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0) should be Year').toBe('Year');
    expect(await reportGridView.getGridCellTextByPos(0, 1), 'Grid (0,1) should be Region').toBe('Region');
    expect(await reportGridView.getGridCellTextByPos(0, 2), 'Grid (0,2) should be Category').toBe('Category');
    expect(await reportGridView.getGridCellTextByPos(0, 3), 'Grid (0,3) should be Cost').toBe('Cost');
    expect(await reportGridView.getGridCellTextByPos(0, 4), 'Grid (0,4) should be Profit').toBe('Profit');
    expect(await reportGridView.getGridCellTextByPos(5, 1), 'Grid (5,1) should be Mid-Atlantic').toBe('Mid-Atlantic');
    expect(await reportGridView.getGridCellTextByPos(6, 2), 'Grid (6,2) should be Electronics').toBe('Electronics');
    expect(await reportGridView.getGridCellTextByPos(7, 3), 'Grid (7,3) should be $125,621').toBe('$125,621');
    expect(await reportGridView.getGridCellTextByPos(8, 4), 'Grid (8,4) should be $5,700').toBe('$5,700');

    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await reportFormatPanel.enableOutlineMode();

    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Outline: (0,0) Year').toBe('Year');
    expect(await reportGridView.getGridCellByPos(0, 1).isVisible(), 'Outline: (0,1) not present').toBe(false);
    expect(await reportGridView.getGridCellByPos(0, 2).isVisible(), 'Outline: (0,2) not present').toBe(false);
    expect(await reportGridView.getGridCellTextByPos(0, 3), 'Outline: (0,3) Cost').toBe('Cost');
    expect(await reportGridView.getGridCellTextByPos(0, 4), 'Outline: (0,4) Profit').toBe('Profit');
    expect(await reportGridView.getGridCellTextByPos(1, 2), 'Outline: (1,2) Total').toBe('Total');
    expect(await reportGridView.getGridCellTextByPos(1, 3), 'Outline: (1,3) total cost').toBe('$29,730,085');
    expect(await reportGridView.getGridCellTextByPos(2, 0), 'Outline: (2,0) 2014').toBe('2014');
    expect(await reportGridView.getGridCellTextByPos(2, 3), 'Outline: (2,3) 2014 cost').toBe('$7,343,097');

    await reportGridView.clickOutlineIconFromCH('Year');
    expect(await reportGridView.getGridCellTextByPos(0, 0), 'After expand: (0,0) Year').toBe('Year');
    expect(await reportGridView.getGridCellTextByPos(3, 1), 'After expand: (3,1) Central').toBe('Central');
    expect(await reportGridView.getGridCellTextByPos(4, 2), 'After expand: (4,2) Books').toBe('Books');

    await reportGridView.collapseOutlineFromCell('2014');
    expect(await reportGridView.getGridCellTextByPos(0, 0), 'After collapse 2014: Year').toBe('Year');
    expect(await reportGridView.getGridCellTextByPos(2, 0), 'After collapse 2014: 2014').toBe('2014');
    expect(await reportGridView.getGridCellTextByPos(43, 0), 'After collapse 2014: 2015').toBe('2015');

    await reportFormatPanel.enableStandardOutlineMode();
    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Standard outline: Year').toBe('Year');
    expect(await reportGridView.getGridCellByPos(0, 1).isVisible(), 'Standard: (0,1) visible').toBe(true);
    expect(await reportGridView.getGridCellByPos(0, 2).isVisible(), 'Standard: (0,2) visible').toBe(true);

    await reportGridView.clickOutlineIconFromCH('Year');
    expect(await reportGridView.getGridCellTextByPos(0, 1), 'Standard expand: Region').toBe('Region');
    expect(await reportGridView.getGridCellTextByPos(3, 1), 'Standard expand: Central').toBe('Central');
  });

  test('[TC88431_2] DE241713: Outline mode persists during column resize', async ({
    libraryPage,
    reportToolbar,
    reportGridView,
    reportTOC,
    newFormatPanelForGrid,
    reportFormatPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportPageByContextMenu.id,
      projectId: dossiers.ReportPageByContextMenu.projectId,
    });
    await reportToolbar.switchToDesignMode();

    expect(await reportGridView.getGridCellTextByPos(1, 0), 'Design: (1,0) 2014').toBe('2014');
    expect(await reportGridView.getGridCellTextByPos(1, 1), 'Design: (1,1) Central').toBe('Central');
    expect(await reportGridView.getGridCellTextByPos(1, 2), 'Design: (1,2) Books').toBe('Books');
    expect(await reportGridView.getGridCellTextByPos(1, 3), 'Design: (1,3) $77,012').toBe('$77,012');

    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await reportFormatPanel.enableOutlineMode();

    expect(await reportGridView.getGridCellTextByPos(1, 2), 'Outline: (1,2) Total').toBe('Total');
    expect(await reportGridView.getGridCellTextByPos(1, 3), 'Outline: (1,3) total').toBe('$29,730,085');

    await reportGridView.clickOutlineIconFromCH('Year');
    expect(await reportGridView.getGridCellTextByPos(2, 0), 'Expand: (2,0) 2014').toBe('2014');
    expect(await reportGridView.getGridCellTextByPos(3, 1), 'Expand: (3,1) Central').toBe('Central');
    expect(await reportGridView.getGridCellTextByPos(4, 2), 'Expand: (4,2) Books').toBe('Books');
    expect(await reportGridView.getGridCellTextByPos(4, 3), 'Expand: (4,3) $77,012').toBe('$77,012');

    const hasExpandIcon = await reportGridView.getGridCellExpandIconByPos('2', '0');
    expect(hasExpandIcon, 'Row 2 col 0 should have expand icon').toBe(true);
  });
});
