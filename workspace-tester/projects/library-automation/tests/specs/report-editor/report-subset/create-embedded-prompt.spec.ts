/**
 * Migrated from WDIO: ReportEditor_create_embedded_prompt.spec.js
 * Phase 2d - Create embedded prompt to subset report VF.
 * Uses reportSubsetUser from .env.report (default: re_ss)
 */
import { test, expect, reportSubsetData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers } = reportSubsetData;

test.describe('Create embedded prompt to subset report VF', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportSubsetUser || reportSubsetData.reportSubsetTestUser.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-6468_01] create attribute element in list prompt on view filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCubeNoViewFilter.id,
      projectId: dossiers.subsetReportWithOlapCubeNoViewFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('15 Rows, 2 Columns');
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Region');
    await expect(reportFilterPanel.newQual.getCreateEmbeddedPromptButton()).toBeVisible();
    await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
    await reportPage.embedPromptEditor.waitForLoading();
    await reportPage.embedPromptEditor.clickDoneButton();
    await reportFilterPanel.saveAndCloseQualificationEditor();
  });

  test('[BCIN-6468_02] create attribute element not in list prompt on view filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCubeNoViewFilter.id,
      projectId: dossiers.subsetReportWithOlapCubeNoViewFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Region');
    await reportFilterPanel.attributeFilter.toggleElementListMode();
    await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
    await reportPage.embedPromptEditor.waitForLoading();
    await reportPage.embedPromptEditor.clickDoneButton();
    await reportFilterPanel.saveAndCloseQualificationEditor();
  });

  test('[BCIN-6468_03] run report with attribute element in list prompt on view filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
    promptEditor,
    aePrompt,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCubeNoViewFilter.id,
      projectId: dossiers.subsetReportWithOlapCubeNoViewFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Call Center');
    await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
    await reportPage.embedPromptEditor.waitForLoading();
    await reportPage.embedPromptEditor.clickDoneButton();
    await reportFilterPanel.saveAndCloseQualificationEditor();
    await reportFilterPanel.clickFilterApplyButton();
    await promptEditor.waitForRepromptLoading();
    const callCenterPrompt = promptEditor.findPrompt('Call Center');
    await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'San Diego');
    await aePrompt.shoppingCart.addSingle(callCenterPrompt);
    await promptEditor.run();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$449,553', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('1 Rows, 2 Columns');
  });

  test('[BCIN-6468_04] run report with attribute element not in list prompt on view filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
    promptEditor,
    aePrompt,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCubeNoViewFilter.id,
      projectId: dossiers.subsetReportWithOlapCubeNoViewFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Call Center');
    await reportFilterPanel.attributeFilter.toggleElementListMode();
    await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
    await reportPage.embedPromptEditor.waitForLoading();
    await reportPage.embedPromptEditor.clickDoneButton();
    await reportFilterPanel.saveAndCloseQualificationEditor();
    await reportFilterPanel.clickFilterApplyButton();
    await promptEditor.waitForRepromptLoading();
    const callCenterPrompt = promptEditor.findPrompt('Call Center');
    await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'Atlanta');
    await aePrompt.shoppingCart.addSingle(callCenterPrompt);
    await promptEditor.run();
    await reportGridView.waitForGridCellToBeExpectedValue(11, 4, '$178,713', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('14 Rows, 2 Columns');
  });

  test('[BCIN-6468_05] create value prompt in metric filter', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
    promptEditor,
    valuePrompt,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCubeNoViewFilter.id,
      projectId: dossiers.subsetReportWithOlapCubeNoViewFilter.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$637,545', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Cost');
    await reportFilterPanel.metricFilter.openSelector('Operator');
    await reportFilterPanel.metricFilter.selectOption('Greater than');
    await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
    await reportPage.embedPromptEditor.waitForLoading();
    await reportPage.embedPromptEditor.clickDoneButton();
    await reportFilterPanel.saveAndCloseQualificationEditor();
    await reportFilterPanel.clickFilterApplyButton();
    await promptEditor.waitForRepromptLoading();
    const valuePromptForCost = promptEditor.findPrompt('Number');
    await valuePrompt.textbox.clearAndInputText(valuePromptForCost, '2000000');
    await promptEditor.run();
    await reportGridView.waitForGridCellToBeExpectedValue(6, 4, '$583,538', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('6 Rows, 2 Columns');
  });

  test('[BCIN-6468_06] no prompt icon for MDTI cube report', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Airline Name');
    await expect(reportFilterPanel.newQual.getCreateEmbeddedPromptButton()).not.toBeVisible();
    await reportFilterPanel.clickCancelQualificationEditor();
    await reportFilterPanel.openNewViewFilterPanel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.selectBasedOnObject('Number of Flights');
    await expect(reportFilterPanel.newQual.getCreateEmbeddedPromptButton()).not.toBeVisible();
  });

  test('[BCIN-6468_07] create embedded attribute prompt in normal report', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
    reportGridView,
    promptEditor,
    aePrompt,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.TemplateProductReport.id,
      projectId: dossiers.TemplateProductReport.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$5,293,624', 60000);
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('29 Rows, 2 Columns');
    await reportTOC.switchToFilterPanel();
    await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();
    await reportFilterPanel.newQual.waitForObjectSearchDropdown();
    await reportFilterPanel.newQual.searchBasedOn('Year');
    await reportFilterPanel.newQual.selectBasedOnObject('Year');
    await expect(reportFilterPanel.newQual.getCreateEmbeddedPromptButton()).toBeVisible();
    await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
    await reportPage.embedPromptEditor.waitForLoading();
    await reportPage.embedPromptEditor.clickDoneButton();
    await reportFilterPanel.saveAndCloseQualificationEditor();
    await reportFilterPanel.clickFilterApplyButton();
    await promptEditor.waitForRepromptLoading();
    const yearPrompt = promptEditor.findPrompt('Year');
    await aePrompt.shoppingCart.clickElmInAvailableList(yearPrompt, '2020');
    await aePrompt.shoppingCart.addSingle(yearPrompt);
    await promptEditor.run();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$1,304,141', 60000);
    expect(await reportGridView.getGridCellTextByPos(1, 3)).toBe('$1,304,141');
  });

  test('[BCIN-6468_08] run subset report with prompt in view filter on consumption mode', async ({
    libraryPage,
    reportPage,
    reportGridView,
    promptEditor,
    aePrompt,
    valuePrompt,
  }) => {
    await libraryPage.openReportByUrl({
      dossierId: dossiers.subsetReportWithPromptInViewFilter.id,
      projectId: dossiers.subsetReportWithPromptInViewFilter.projectId,
      prompt: true,
    });
    const callCenterPrompt = promptEditor.findPrompt('Category');
    await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'Books');
    await aePrompt.shoppingCart.addSingle(callCenterPrompt);
    await aePrompt.shoppingCart.clickElmInAvailableList(callCenterPrompt, 'Electronics');
    await aePrompt.shoppingCart.addSingle(callCenterPrompt);
    const valuePromptForRevenue = promptEditor.findPrompt('Number');
    await valuePrompt.textbox.clearAndInputText(valuePromptForRevenue, '3000000');
    await promptEditor.run();
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$24,391,303', 60000);
    expect(await reportGridView.getGridCellTextByPos(2, 3)).toBe('$24,391,303');
  });
});
