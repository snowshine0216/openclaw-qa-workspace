/**
 * Migrated from WDIO: ReportEditor_replace_cube.spec.js
 * Phase 2d - Replace subset report cube.
 * Uses reportSubsetUser from .env.report (default: re_ss)
 */
import { test, expect, reportSubsetData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers, cubes } = reportSubsetData;
const airlineDataCube = cubes.airlineData;
const productOlapCube = cubes.productOlap;

test.describe('Replace subset report cube', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage, dossierCreator }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportSubsetUser || reportSubsetData.reportSubsetTestUser.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard/i, { timeout: 15000 }).catch(() => {});
    await dossierCreator.resetLocalStorage();
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-6422_01] UI entry only show in subset report', async ({
    libraryPage,
    reportDatasetPanel,
    reportPage,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    const threeDots = reportDatasetPanel.getThreeDotsToOpenCubeMenu();
    await expect(threeDots).toBeVisible({ timeout: 10000 });

    await reportDatasetPanel.openSelectCubeDialog();
    const dialog = reportPage.selectCubeDialog.getDatasetSelectContainer();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await expect(threeDots).not.toBeVisible();
  });

  test('[BCIN-6422_02] Replace by MTDI cube in subset report', async ({
    libraryPage,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(airlineDataCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(airlineDataCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.selectNewObjects([
      { name: 'Airline Name', opt: 'Year' },
      { name: 'Year', opt: 'Remove from report' },
      { name: 'Number of Flights', opt: 'Flights Cancelled' },
      { name: 'On-Time', opt: 'Number of Flights' },
    ]);
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportPage.waitForReportLoading(true);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
  });

  test('[BCIN-6422_03] Replace by subset cube when creating report', async ({
    libraryPage,
    reportPage,
    reportDatasetPanel,
    reportGridView,
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(reportSubsetData.projects.tutorial.name);
    await dossierCreator.selectExecutionMode();
    await dossierCreator.searchTemplate(reportSubsetData.templateWithSubsetReport);
    await dossierCreator.selectTemplate(reportSubsetData.templateWithSubsetReport);
    await dossierCreator.clickCreateButton();
    await reportPage.waitForReportLoading(true);
    await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$28,192', 60000);
    const threeDots = reportDatasetPanel.getThreeDotsToOpenCubeMenu();
    await expect(threeDots).toBeVisible({ timeout: 10000 });
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(airlineDataCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(airlineDataCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.selectNewObjects([{ name: 'Average Rate', opt: 'Flights Cancelled' }]);
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportPage.waitForReportLoading(true);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '3952', 60000);
    expect(await reportGridView.getGridCellTextByPos(2, 1)).toBe('6842');
    expect(await reportGridView.getGridCellTextByPos(3, 1)).toBe('982');
    await reportDatasetPanel.clickBottomBarToLoseFocus();
  });

  test('[BCIN-6422_04] Replace by olap cube', async ({
    libraryPage,
    reportToolbar,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '22381', 60000);
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.navigateInObjectBrowserFlatView(['Public Objects']);
    await reportPage.selectCubeDialog.searchObject('06. Dataset');
    await reportPage.selectCubeDialog.navigateInObjectBrowserFlatView(['06. Dataset']);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.selectNewObjects([
      { name: 'Airline Name', opt: 'Category' },
      { name: 'Year', opt: 'Subcategory' },
      { name: 'Number of Flights', opt: 'Profit' },
    ]);
    await reportPage.replaceObjectDialog.toggleClearSettingsCheckbox();
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportPage.waitForReportLoading(true);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$110,012', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('24 Rows, 1 Columns');
  });

  test('[BCIN-6422_05] Replace cube when having cube filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithCubeFilter.id,
      projectId: dossiers.subsetReportWithCubeFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportTOC.switchToEditorPanel();
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(productOlapCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportGridView.waitForGridCellToBeExpectedValue(2, 1, '8,197,887', 60000);
    await reportTOC.switchToEditorPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
  });

  test('[BCIN-6422_06] Replace cube when having derived metric and keep definition', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithCubeFilter.id,
      projectId: dossiers.subsetReportWithCubeFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606', 60000);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(productOlapCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportGridView.waitForGridCellToBeExpectedValue(2, 1, '8,197,887', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
  });

  test('[BCIN-6422_07] Replace cube when having derived metric and remove', async ({
    libraryPage,
    reportToolbar,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithCubeFilter.id,
      projectId: dossiers.subsetReportWithCubeFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606', 60000);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(productOlapCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.selectNewObjects([{ name: 'Total', opt: 'Remove from report' }]);
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '$2,070,816', 60000);
    expect(await reportGridView.getGridCellTextByPos(4, 1)).toBe('$3,713,323');
    expect(await reportGridView.getGridCellTextByPos(4, 2)).toBe('$180,044');
    await reportDatasetPanel.clickBottomBarToLoseFocus();
  });

  test('[BCIN-6422_08] Replace cube when having view filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithCubeFilter.id,
      projectId: dossiers.subsetReportWithCubeFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '48,782,606', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportTOC.switchToEditorPanel();
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(productOlapCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.selectNewObjects([
      { name: 'Cost', opt: 'Remove from report' },
      { name: 'Profit', opt: 'Remove from report' },
      { name: 'Total', opt: 'Revenue' },
    ]);
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '$24,391,303', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('1 Rows, 1 Columns');
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
  });

  test('[BCIN-6422_09] Replace cube by removing all', async ({
    libraryPage,
    reportToolbar,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '22381', 60000);
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(productOlapCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportPage.waitForReportLoading(true);
    await reportDatasetPanel.waitForStatusBarText('0 Rows');
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('0 Rows, 0 Columns');
  });

  test('[BCIN-6422_10] undo redo after replace cube', async ({
    libraryPage,
    reportToolbar,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '22381', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('29 Rows, 2 Columns');
    await reportDatasetPanel.openSelectCubeDialog();
    await reportPage.selectCubeDialog.searchObject(productOlapCube);
    await reportPage.selectCubeDialog.selectObjectInFlatView(productOlapCube);
    await reportPage.selectCubeDialog.clickDoneButton();
    await reportPage.replaceObjectDialog.waitForLoading();
    await reportPage.replaceObjectDialog.selectNewObjects([
      { name: 'Airline Name', opt: 'Category' },
      { name: 'Year', opt: 'Subcategory' },
      { name: 'Number of Flights', opt: 'Profit' },
    ]);
    await reportPage.replaceObjectDialog.clickOkButton();
    await reportPage.waitForReportLoading(true);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '$110,012', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('24 Rows, 1 Columns');
    await reportToolbar.clickUndo(true);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('29 Rows, 2 Columns');
    await reportToolbar.clickRedo(true);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('24 Rows, 1 Columns');
  });
});
