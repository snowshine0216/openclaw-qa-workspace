/**
 * Migrated from WDIO: ReportEditor_template.spec.js
 * Phase 2c - Report Template Test.
 * Tests 3749_05-06, 3749_08-11 skipped (need reportMenubar, advancedReportProperties, saveAsDialog, APIs).
 */
import { test, expect, reportCreatorData } from '../../../fixtures';

const { projects, templates } = reportCreatorData;

test.describe('Report Template Test', () => {
  test.beforeEach(async ({ dossierCreator, libraryPage }) => {
    await dossierCreator.resetLocalStorage();
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-3749_01] Create report by choosing blank template', async ({
    dossierCreator,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    const panel = dossierCreator.getCreateNewDossierPanel();
    await expect(panel).toBeVisible();
    await dossierCreator.clickCreateButton();
    await reportGridView.grid.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  });

  test('[BCIN-3749_02] Create report by choosing selected template', async ({
    dossierCreator,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.selectExecutionMode();
    await dossierCreator.searchTemplate(templates.withPageBy);
    await dossierCreator.selectTemplate(templates.withPageBy);
    await dossierCreator.clickCreateButton();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$1,304,141', 60000);
  });

  test('[BCIN-3749_03] Create report by choosing selected template with prompt', async ({
    dossierCreator,
    reportGridView,
    promptEditor,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.selectExecutionMode();
    await dossierCreator.searchTemplate(templates.withPrompt);
    await dossierCreator.selectTemplate(templates.withPrompt);
    await dossierCreator.clickCreateButton();
    expect(await promptEditor.isEditorOpen()).toBe(true);
    await promptEditor.run();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$35,023,708', 60000);
  });

  test('[BCIN-3749_04] Create report by choosing selected subset report template', async ({
    dossierCreator,
    reportGridView,
    reportDatasetPanel,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.selectExecutionMode();
    await dossierCreator.searchTemplate(templates.subset);
    await dossierCreator.selectTemplate(templates.subset);
    await dossierCreator.clickCreateButton();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$28,192', 60000);
    const statusBar = await reportDatasetPanel.getStatusBarText();
    expect(statusBar).toBe('3 Rows, 3 Columns');
  });

  test('[BCIN-3749_07] Create report by choosing blank report template', async ({
    dossierCreator,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.selectTemplate('Blank');
    await dossierCreator.clickCreateButton();
    await reportGridView.grid.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  });

  test('[BCIN-3749_08] Create report by choosing blank button', async ({
    dossierCreator,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.clickBlankDossierBtn();
    await reportGridView.grid.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  });

  test.skip('[BCIN-3749_05] Create report by choosing selected report template with customized properties', () => {
    // Needs reportMenubar, advancedReportProperties
  });

  test.skip('[BCIN-3749_06] Create report by choosing certified report template', () => {
    // Needs reportPage (getCertifiedIcon, getTemplateIcon, getReportTitle), reportMenubar
  });

  test.skip('[BCIN-3749_09] Save report as template in save as dialog', () => {
    // Needs deleteObjectsUnderFolder API, reportMenubar, reportPage.saveAsDialog
  });

  test.skip('[BCIN-3749_10] Set as template from menubar without change', () => {
    // Needs setTemplate API, reportMenubar, reportPage
  });

  test.skip('[BCIN-3749_11] Set as template from menubar with manipulation on report', () => {
    // Needs setTemplate API, reportMenubar, reportPage
  });
});
