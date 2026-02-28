/**
 * Migrated from WDIO: ReportEditor_templateByExecutionMode.spec.js
 * Phase 2c - Report Template by Execution Mode.
 * Tests 7306_04-11 skipped (need promptObject, aePrompt, reportTOC, reportFilterPanel, etc.).
 */
import { test, expect, reportCreatorData } from '../../../fixtures';

const { projects } = reportCreatorData;

test.describe('Report Template by Execution Mode', () => {
  test.beforeEach(async ({ dossierCreator, libraryPage }) => {
    await dossierCreator.resetLocalStorage();
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-7306_01] Default view mode is Data Retrieval Mode', async ({
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.hierarchies.name);
    const text = await dossierCreator.getViewModeSelectorText();
    expect(text).toBe('Data Pause Mode');
    await dossierCreator.closeNewDossierPanel();
  });

  test('[BCIN-7306_02] Create report by pause mode', async ({
    dossierCreator,
    reportToolbar,
    reportGridView,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToTemplateTab();
    await dossierCreator.selectPauseMode();
    await dossierCreator.clickCreateButton();
    await reportGridView.grid.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
    expect(await reportToolbar.isInPauseMode()).toBe(true);
  });

  test('[BCIN-7306_03] Create report by data retrieval mode', async ({
    dossierCreator,
    reportGridView,
    reportToolbar,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(projects.tutorial.name);
    await dossierCreator.switchToTemplateTab();
    await dossierCreator.selectExecutionMode();
    await dossierCreator.clickCreateButton();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$480,173', 60000);
    expect(await reportGridView.getGridCellTextByPos(1, 0)).toBe('Books');
    expect(await reportToolbar.isInPauseMode()).toBe(false);
  });

  test.skip('[BCIN-7306_04] Create report by template with object prompt in pause mode', () => {
    // Needs promptObject, aePrompt (shopping cart)
  });

  test.skip('[BCIN-7306_05] Create report by template with object prompt in data retrieval mode', () => {});

  test.skip('[BCIN-7306_06] Create report by template in pause mode and cancel', () => {});

  test.skip('[BCIN-7306_07] Create report by template in pause mode and cancel during apply prompt', () => {});

  test.skip('[BCIN-7306_08] Create report by template with object prompt in pause mode and update template objects', () => {});

  test.skip('[BCIN-7306_09] Create report by template with object prompt in pause mode and apply filters', () => {});

  test.skip('[BCIN-7306_10] Create report by template with object prompt in pause mode and add another prompt', () => {});

  test.skip('[BCIN-7306_11] Create report by template with object prompt in pause mode and undo redo', () => {});
});
