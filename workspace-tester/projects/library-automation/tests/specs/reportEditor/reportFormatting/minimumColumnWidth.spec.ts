/**
 * Migrated from WDIO: ReportEditor_minimumColumnWidth.spec.js
 * Phase 2i - reportFormatting: Minimum column width.
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser } = reportFormattingData;

test.describe('Report Editor - Minimum Column Width', () => {
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

  test('[TC86499] E2E [Report Editor][Component Level] Minimum Column Width', async ({
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
    await reportDatasetPanel.addObjectToRows('Category');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Time');
    await reportDatasetPanel.addObjectToRows('Year');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Geography');
    await reportDatasetPanel.addObjectToRows('Country');
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
    await reportToolbar.switchToDesignMode();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
    await newFormatPanelForGrid.expandSpacingSection();
    await reportFormatPanel.openColumnSizeFitSelectionBox();
    await reportFormatPanel.selectOptionFromDropdown('Fit to Container');

    await reportFormatPanel.openMinimumColumnWidthMenu();
    await reportFormatPanel.addMinimumColumnWidthOption('Category');
    await reportFormatPanel.setMinimumColumnWidthValue('Category', '250');

    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Category header').toBe('Category');
    expect(
      await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'),
      'Category width 250px'
    ).toBe(JSON.stringify(Array(25).fill('250px')));
    expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'), 'Input 250px').toBe('250px');

    await reportFormatPanel.openMinimumColumnWidthMenu();
    await reportFormatPanel.addMinimumColumnWidthOption('Year');
    await reportFormatPanel.setMinimumColumnWidthValue('Year', '250');
    expect(await reportGridView.getGridCellTextByPos(0, 1), 'Year header').toBe('Year');
    expect(await reportFormatPanel.getMinimumColumnWithInputValue('Year'), 'Year input 250px').toBe('250px');

    await reportFormatPanel.openMinimumColumnWidthMenu();
    await reportFormatPanel.addMinimumColumnWidthOption('Profit');
    await reportFormatPanel.setMinimumColumnWidthValue('Profit', '250');
    expect(await reportGridView.getGridCellTextByPos(0, 4), 'Profit header').toBe('Profit');

    await reportFormatPanel.openMinimumColumnWidthMenu();
    await reportFormatPanel.addMinimumColumnWidthOption('Country');
    await reportFormatPanel.setMinimumColumnWidthValue('Country', '100');
    expect(await reportGridView.getGridCellTextByPos(0, 2), 'Country header').toBe('Country');

    await reportFormatPanel.openMinimumColumnWidthMenu();
    await reportFormatPanel.addMinimumColumnWidthOption('Cost');
    await reportFormatPanel.setMinimumColumnWidthValue('Cost', '75');
    expect(await reportGridView.getGridCellTextByPos(0, 3), 'Cost header').toBe('Cost');

    await reportFormatPanel.deleteMinimumColumnWidthOption('Country');
    expect(await reportGridView.getGridCellTextByPos(0, 2), 'Country still present').toBe('Country');

    await reportFormatPanel.deleteMinimumColumnWidthOption('Cost');
    expect(await reportGridView.getGridCellTextByPos(0, 3), 'Cost still present').toBe('Cost');
  });

  test('[TC86500] FUN [Report Editor][Workstation] Minimum Column Width', async ({
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
    await reportDatasetPanel.addObjectToRows('Category');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Time');
    await reportDatasetPanel.addObjectToRows('Year');
    await reportDatasetPanel.clickFolderUpIcon();
    await reportDatasetPanel.selectItemInObjectList('Geography');
    await reportDatasetPanel.addObjectToRows('Country');
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit', 'Revenue']);
    await reportToolbar.switchToDesignMode();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
    await newFormatPanelForGrid.expandSpacingSection();
    await reportFormatPanel.openColumnSizeFitSelectionBox();
    await reportFormatPanel.selectOptionFromDropdown('Fit to Container');

    await reportFormatPanel.openMinimumColumnWidthMenu();
    await reportFormatPanel.addMinimumColumnWidthOption('Category');
    await reportFormatPanel.setMinimumColumnWidthValue('Category', '250');
    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Category').toBe('Category');
    expect(
      await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'),
      'Width 250px'
    ).toBe(JSON.stringify(Array(25).fill('250px')));

    await reportFormatPanel.setMinimumColumnWidthValue('Category', '500');
    expect(
      await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'),
      'Width 500px'
    ).toBe(JSON.stringify(Array(25).fill('500px')));
    expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'), 'Input 500px').toBe('500px');

    await reportFormatPanel.setMinimumColumnWidthValue('Category', '444.4');
    expect(
      await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'),
      'Width 444px'
    ).toBe(JSON.stringify(Array(25).fill('444px')));
    expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'), 'Input 444px').toBe('444px');
  });
});
