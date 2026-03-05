/**
 * Migrated from WDIO: ReportEditor_threshold_TC86548.spec.js
 * Phase 2f - reportThreshold: TC86548 show/hide thresholds.
 */
import { test, expect, reportThresholdData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

test.describe('Report Editor Thresholds TC86548', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage, dossierCreator }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportTestUser || reportThresholdData.reportUser.username,
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

  test('[TC86548] Report editor thresholds show/hide thresholds', async ({
    libraryPage,
    reportDatasetPanel,
    reportToolbar,
    reportGridView,
    thresholdEditor,
    advancedFilter,
    reportEditorPanel,
  }) => {
    await libraryPage.createNewReportByUrl({});
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);
    await reportDatasetPanel.addMultipleObjectsToRows(['Country', 'Region']);
    await reportDatasetPanel.clickFolderUpMultipleTimes(3);
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
    await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
    await reportToolbar.switchToDesignMode();

    await reportEditorPanel.openThresholdInDropZoneForMetric('Cost');
    await thresholdEditor.clickOnEnableAllowUsersCheckBox('simple');
    await thresholdEditor.saveAndCloseSimThresholdEditor();

    const bg1 = await reportGridView.getGridCellStyleByPos(1, 1, 'background-color');
    expect(bg1, 'Grid cell (1,1) background-color').toBe('rgba(255,255,255,1)');

    await reportEditorPanel.openThresholdInDropZoneForAttribute('Country');
    await thresholdEditor.openNewThresholdCondition();
    await thresholdEditor.selectOptionAttributeFromDropdown('Region');
    await thresholdEditor.checkAttributeName('Web');
    await advancedFilter.clickOnNewQualificationEditorOkButton();
    await thresholdEditor.selectOptionSample();
    await thresholdEditor.setFillColor('Light Green');
    await thresholdEditor.setOpacityPercentage('50');
    await thresholdEditor.clickFormatPreviewPanelOkButton();
    await thresholdEditor.saveAndCloseAdvancedThresholdEditor();

    const bg80 = await reportGridView.getGridCellStyleByPos(8, 0, 'background-color');
    expect(bg80).toBe('rgba(204,255,204,0.5)');

    await reportEditorPanel.clearThresholdsForAttributeInRowsDropzone('Country');
    const bg80After = await reportGridView.getGridCellStyleByPos(8, 0, 'background-color');
    expect(bg80After).toBe('rgba(255,255,255,1)');

    await reportEditorPanel.clearThresholdForMetricInMetricsDropZone('Cost');
    expect(await reportGridView.getGridCellStyleByPos(2, 2, 'background-color')).toBe('rgba(255,255,255,1)');
    expect(await reportGridView.getGridCellStyleByPos(3, 2, 'background-color')).toBe('rgba(255,255,255,1)');
    expect(await reportGridView.getGridCellStyleByPos(4, 2, 'background-color')).toBe('rgba(255,255,255,1)');
  });
});
