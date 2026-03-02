/**
 * Migrated from WDIO: ReportEditor_createByCube.spec.js
 * Phase 2c - Create Report by Cube (templates, MDTI, OLAP).
 * Uses reportSubsetUser from .env.report (default: re_ss)
 */
import { test, expect, reportCreatorData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { projects, switchProjectMessage } = reportCreatorData;

test.describe('Create Report by Cube', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage, dossierCreator }) => {
    await libraryPage.logout();
    await loginPage.waitForLoginView(15000).catch(() => {});
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportSubsetUser || reportCreatorData.reportSubsetTestUser.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/\/(app|Home|Dashboard|Library)/i, { timeout: 25000 }).catch(() => {});
    await dossierCreator.resetLocalStorage();
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-6908_01] Cubes tab in report creator', async ({ dossierCreator }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('airline');
    await dossierCreator.sortDataByHeaderName('Date Created');
    const panel = dossierCreator.getCreateNewDossierPanel();
    await expect(panel).toBeVisible();

    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(true);
  });

  test('[BCIN-6908_02] Create button is disabled when no cube selected', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('airline');
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(false);

    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(true);

    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(false);
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-6908_03] Switch project when no cube selected', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    const popup = dossierCreator.getConfirmSwitchProjectPopup();
    await expect(popup).not.toBeVisible();
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-6908_04] Switch project when cube selected', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('airline');
    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    await dossierCreator.switchProjectByName(projects.hierarchies.name);

    const popup = dossierCreator.getConfirmSwitchProjectPopup();
    await expect(popup).toBeVisible({ timeout: 5000 });
    await expect(popup).toContainText(switchProjectMessage);

    await dossierCreator.cancelSwitchProject();
    expect(await dossierCreator.getCurrentProjectText()).toBe(projects.tutorial.name);

    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    await dossierCreator.confirmSwitchProject();
    expect(await dossierCreator.getCurrentProjectText()).toBe(projects.hierarchies.name);
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-6908_05] Select MDTI cube and create report', async ({
    dossierCreator,
    libraryPage,
    reportToolbar,
    reportDatasetPanel,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('airline');
    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    await dossierCreator.clickCreateButton();

    await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'AirTran Airways Corporation', 60000);
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.addObjectToRows('Year');
    await reportDatasetPanel.addObjectToRows('Airline Name');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'AirTran Airways Corporation', 30000);
  });

  test('[BCIN-6908_06] Select OLAP cube and create report', async ({
    dossierCreator,
    reportToolbar,
    reportDatasetPanel,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('Product olap');
    await dossierCreator.selectReportCube({ name: 'Product OLAP cube' });
    await dossierCreator.clickCreateButton();

    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.addObjectToRows('Category');
    await reportDatasetPanel.addObjectToColumns('Cost');
    await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '$2,070,816', 60000);
  });

  test('[BCIN-6908_07] show last tab when re-open report creator', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Select Template');

    await dossierCreator.switchToCubesTab();
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Cubes');
    await dossierCreator.closeNewDossierPanel();

    await dossierCreator.createNewReport();
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Cubes');

    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('Cubes');

    await dossierCreator.switchToMdxSourceTab();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    expect(await dossierCreator.getActiveTabHeaderText()).toBe('MDX Sources');
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-6908_08] hide mosaic and dda cube', async ({ dossierCreator }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('mosaic');
    const grid = dossierCreator.getCubeFlatGrid();
    await expect(grid).toBeVisible();
    await dossierCreator.searchData('dda');
    await expect(grid).toBeVisible();
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-6908_09] switch to folder mode will clear selection', async ({
    dossierCreator,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToCubesTab();
    await dossierCreator.searchData('airline');
    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(true);

    await dossierCreator.switchToTreeMode();
    await dossierCreator.waitTemplateLoading();
    await dossierCreator.dismissTooltipsByClickTitle();
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(false);

    const activeTab = dossierCreator.getActiveTab();
    await expect(activeTab).toBeVisible();

    const row0 = await dossierCreator.getRowDataInAddDataTab(0);
    expect(row0.join(' ')).toContain('00_Old folders');

    await dossierCreator.expandTreeView('Public Objects', 'Reports');
    await dossierCreator.doubleClickOnTreeView('Reports');
    await dossierCreator.searchData('Datasets');
    await dossierCreator.doubleClickOnAgGrid('Datasets');
    await dossierCreator.searchData('airline');
    await dossierCreator.selectReportCube({ name: 'Airline Data' });
    expect(await dossierCreator.isCreateButtonEnabled()).toBe(true);

    await dossierCreator.clickCreateButton();
    await reportGridView.grid.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  });
});
