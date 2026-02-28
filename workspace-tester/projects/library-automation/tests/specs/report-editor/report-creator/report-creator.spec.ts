/**
 * Migrated from WDIO: ReportEditor_reportCreator.spec.js
 * Phase 2c - reportCreator: UI checks, project switch, template selection, list view.
 * Screenshots replaced with assertions per migration plan.
 */
import { test, expect, reportCreatorData } from '../../../fixtures';

const { projects, templates } = reportCreatorData;

test.describe('Report Creator Test', () => {
  test.beforeEach(async ({ dossierCreator, libraryPage }) => {
    await dossierCreator.resetLocalStorage();
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-3809_01] Report creator UI check', async ({
    page,
    dossierCreator,
    libraryPage,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    const panel = dossierCreator.getCreateNewDossierPanel();
    await expect(panel).toBeVisible({ timeout: 10000 });
    await expect(panel).toContainText(/template|Template|blank/i);

    await dossierCreator.selectTemplate(templates.reportBuilder);
    await expect(panel).toBeVisible();

    await dossierCreator.switchToListView();
    await page.waitForTimeout(2000);
    const addDataBody = dossierCreator.getCreateNewDossierAddDataBody();
    await expect(addDataBody).toBeVisible({ timeout: 8000 });
  });

  test('[BCIN-3809_02] Switch project after select template', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.selectTemplate(templates.reportBuilder);
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.searchTemplate(templates.withPrompt);
    await dossierCreator.selectTemplate(templates.withPrompt);
    const panel = dossierCreator.getCreateNewDossierPanel();
    await expect(panel).toBeVisible();

    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    await expect(panel).toBeVisible();
  });

  test('[BCIN-3809_03] Disable blank template', async ({ dossierCreator }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.subscription.name);
    const panel = dossierCreator.getCreateNewDossierPanel();
    await expect(panel).toBeVisible({ timeout: 10000 });
  });

  test('[BCIN-3809_04] Open info window in report creator', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.searchTemplate(templates.withPageBy);
    await dossierCreator.selectTemplate(templates.withPageBy);
    await dossierCreator.checkTemplateInfo(templates.withPageBy);
    const infoPanel = dossierCreator.getCreateNewDossierSelectTemplateInfoPanel();
    await expect(infoPanel).toBeVisible({ timeout: 8000 });

    await dossierCreator.clearSearchData();
    await dossierCreator.searchTemplate(templates.certified);
    await dossierCreator.selectTemplate(templates.certified);
    await dossierCreator.checkTemplateInfo(templates.certified);
    await expect(infoPanel).toBeVisible();
  });

  test('[BCIN-3809_05] select template in list view', async ({
    page,
    dossierCreator,
    libraryPage,
    reportGridView,
    reportDatasetPanel,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.selectExecutionMode();
    await dossierCreator.switchToListView();
    await dossierCreator.searchTemplate(templates.withPageBy);
    await dossierCreator.selectTemplate(templates.withPageBy);
    await dossierCreator.clickCreateButton();

    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$1,304,141', 60000);
    const statusBar = await reportDatasetPanel.getStatusBarText();
    expect(statusBar).toBe('29 Rows, 3 Columns');

    await libraryPage.openDefaultApp();
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToListView();
    await dossierCreator.searchTemplate(templates.certified);
    await dossierCreator.selectTemplate(templates.certified);
    await dossierCreator.clickCreateButton();

    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$196,301', 60000);
    const statusBar2 = await reportDatasetPanel.getStatusBarText();
    expect(statusBar2).toBe('24 Rows, 2 Columns');
  });
});
