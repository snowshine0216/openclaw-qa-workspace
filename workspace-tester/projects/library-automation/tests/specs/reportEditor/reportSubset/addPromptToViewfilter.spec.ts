/**
 * Migrated from WDIO: ReportEditor_add_prompt_to_viewfilter.spec.js
 * Phase 2d - Add prompt to subset report VF.
 * Uses reportSubsetUser from .env.report (default: re_ss)
 */
import { test, expect, reportSubsetData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers, qualificationPrompts } = reportSubsetData;

test.describe('Add prompt to subset report VF', () => {
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

  test('[BCIN-6460_01] not allow to add view filter by DnD multiple selection', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithCubeFilter.id,
      projectId: dossiers.subsetReportWithCubeFilter.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.dndByMultiSelectFromReportObjectsToViewFilter({
      objectNames: ['Category', 'Year'],
      target: 'filter data',
    });
    await reportDatasetPanel.clickObjectInReportObjectsPanel('Category');
    await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'filter data');
    await expect(reportFilterPanel.getAttributeElementFilterSubpanel()).toBeVisible({ timeout: 10000 });
  });

  test('[BCIN-6460_02] adding attribute metric to view filter on existing subset report', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCube.id,
      projectId: dossiers.subsetReportWithOlapCube.projectId,
    });
    await reportToolbar.switchToDesignMode(false);
    await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$188,719', 60000);
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.dndFromObjectPanelToContainer('Subcategory', 'view filters');
    await reportFilterPanel.selectElements(['Cameras', 'Computers']);
    await reportFilterPanel.newQual.done();
    await reportDatasetPanel.clickObjectInReportObjectsPanel('Cost');
    await reportDatasetPanel.dndFromObjectPanelToContainer('Cost', 'aggregation filters');
    await reportFilterPanel.metricFilter.openSelector('Operator');
    await reportFilterPanel.metricFilter.selectOption('Greater than');
    await reportFilterPanel.metricFilter.enterValue('500000');
    await reportFilterPanel.metricFilter.done();
    await reportFilterPanel.clickFilterApplyButton();
    await reportDatasetPanel.waitForStatusBarText('1 Rows');
    expect(await reportDatasetPanel.StatusBar.getText()).toBe('1 Rows, 2 Columns');
    expect(await reportGridView.getGridCellTextByPos(1, 2)).toBe('$1,217,778');
  });

  test('[BCIN-6460_03] DnD irrelevant qualification prompt to subset report', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
  }) => {
    const qualificationPrompt = qualificationPrompts.qualificationOnYear;
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCube.id,
      projectId: dossiers.subsetReportWithOlapCube.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.searchObjectInObjectBrowser(qualificationPrompt);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: qualificationPrompt,
      options: { isWait: false },
    });
    await expect(reportPage.getConfirmDialog()).toBeVisible({ timeout: 10000 });
    expect(await reportPage.getConfirmMessage().textContent()).toContain(
      "Failed to add. Only prompts relevant to this report's data can be added to the filter."
    );
    await reportPage.clickOKInConfirmDialog();
  });

  test('[BCIN-6460_04] DnD valid attribute qualification prompt to subset report', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
  }) => {
    const qualificationPrompt = qualificationPrompts.qualificationOnCategory;
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCube.id,
      projectId: dossiers.subsetReportWithOlapCube.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.searchObjectInObjectBrowser(qualificationPrompt);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: qualificationPrompt,
      options: { isWait: false },
    });
    await expect(reportFilterPanel.getViewFilterTab()).toBeVisible();
  });

  test('[BCIN-6460_05] DnD attribute elements prompt to subset report', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
  }) => {
    const aePromptForYear = qualificationPrompts.aePromptOnYear;
    const aePromptForCategory = qualificationPrompts.aePromptOnCategory;
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCube.id,
      projectId: dossiers.subsetReportWithOlapCube.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.searchObjectInObjectBrowser(aePromptForYear);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: aePromptForYear,
      options: { isWait: false },
    });
    await expect(reportPage.getConfirmDialog()).toBeVisible({ timeout: 10000 });
    await reportPage.clickOKInConfirmDialog();
    await reportDatasetPanel.searchObjectInObjectBrowser(aePromptForCategory);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: aePromptForCategory,
      options: { isWait: false },
    });
    await expect(reportFilterPanel.getViewFilterTab()).toBeVisible();
  });

  test('[BCIN-6460_06] DnD metric qualification prompt to subset report', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportPage,
  }) => {
    const metricQualPromptForUnitPrice = qualificationPrompts.metricQualUnitPrice;
    const metricQualPromptForCostRevenue = qualificationPrompts.metricQualCostRevenue;
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCube.id,
      projectId: dossiers.subsetReportWithOlapCube.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.searchObjectInObjectBrowser(metricQualPromptForUnitPrice);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: metricQualPromptForUnitPrice,
      options: { isWait: false },
    });
    await expect(reportPage.getConfirmDialog()).toBeVisible({ timeout: 10000 });
    await reportPage.clickOKInConfirmDialog();
    await reportDatasetPanel.searchObjectInObjectBrowser(metricQualPromptForCostRevenue);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: metricQualPromptForCostRevenue,
      options: { isWait: false },
    });
    await expect(reportFilterPanel.getViewFilterTab()).toBeVisible();
  });

  test('[BCIN-6460_07] DnD value prompt to subset report', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportFilter,
  }) => {
    const valuePromptForNumber = qualificationPrompts.valuePromptNumber;
    const valuePromptForText = qualificationPrompts.valuePromptText;
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCube.id,
      projectId: dossiers.subsetReportWithOlapCube.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportDatasetPanel.searchObjectInObjectBrowser(valuePromptForText);
    const inlineVFItemForProfit = reportFilter.findInlineFilterItem({
      expType: reportSubsetData.reportFilterType.metricQualification,
      objectName: 'Profit',
    });
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: valuePromptForText,
      target: inlineVFItemForProfit.getConstValueInput(),
      options: { isWait: false },
    });
    await expect(reportFilterPanel.getViewFilterTab()).toBeVisible();
    await reportDatasetPanel.searchObjectInObjectBrowser(valuePromptForNumber);
    await reportDatasetPanel.dndFromObjectBrowserToReportViewFilter({
      objectName: valuePromptForNumber,
      target: inlineVFItemForProfit.getConstValueInput(),
      options: { isWait: false },
    });
    await expect(reportFilterPanel.getViewFilterTab()).toBeVisible();
  });

  test('[BCIN-6460_08] Check tooltip in view filter', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.subsetReportWithOlapCubeNoViewFilter.id,
      projectId: dossiers.subsetReportWithOlapCubeNoViewFilter.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportFilterPanel.switchToViewFilterTab();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportFilterPanel.getViewFilterEmptyPlaceholder()).toBeVisible();
    expect(await reportFilterPanel.getViewFilterEmptyPlaceholder().textContent()).toContain(
      'Drag an attribute, metric, or relevant prompt from the object panel or click to create a new filter.'
    );
  });
});
