/**
 * Migrated from WDIO: ReportEditor_threshold.spec.js
 * Phase 2f - reportThreshold: TC85267 threshold assertions.
 */
import { test, expect, reportThresholdData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers } = reportThresholdData;

test.describe('Report Editor Thresholds in Workstation', () => {
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

  test('[TC85267_1] Report editor thresholds TC85267 Case 1 in workstation', async ({
    libraryPage,
    reportToolbar,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportThreshold1.id,
      projectId: dossiers.ReportThreshold1.projectId,
    });
    await reportToolbar.switchToDesignMode();
    const imgSrc = await reportGridView.getGridCellImgSrcByPos(5, 1);
    expect(imgSrc, 'Grid cell (5,1) should have image globe-showing-americas').toContain(
      'globe-showing-americas-on-white-keyboard-picture-id163942994'
    );
  });

  test.skip('[TC85267_2] Report editor thresholds TC85267 Case 2', async ({
    libraryPage,
    reportToolbar,
    reportGridView,
    reportTOC,
    reportEditorPanel,
    reportDatasetPanel,
    thresholdEditor,
    advancedFilter,
    reportPageBy,
    baseContainer,
  }) => {
    // Long flow: design mode assertions, hide/show thresholds, clear, image-based threshold,
    // remove/add Category, grid ops, adv/sim threshold switch, Subcategory threshold.
    // Skipped until full POM validation - requires ThresholdEditor, AdvancedFilter refinements.
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportThreshold2.id,
      projectId: dossiers.ReportThreshold2.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await expect(await reportGridView.getGridCellTextByPos(1, 1)).toBe('$343,320');
    await expect(await reportGridView.getGridCellStyleByPos(1, 1, 'background-color')).toBe(
      'rgba(0,128,0,1)'
    );
    await reportTOC.switchToEditorPanel();
    await reportGridView.hideAllThresholds('Revenue');
    await reportGridView.showAllThresholds('Revenue');
    await reportEditorPanel.clearThresholdForMetricInMetricsDropZone('Revenue');
    await reportEditorPanel.openThresholdInDropZoneForMetric('Revenue');
    await thresholdEditor.switchSimpleThresholdsTypeI18N('Image-based');
    await thresholdEditor.openSimpleThresholdImageBandDropDownMenu();
    await thresholdEditor.selectSimpleThresholdImageBand('Rounded Push Pin');
    await thresholdEditor.selectSimpleThresholdBasedOnObject('Revenue');
    await thresholdEditor.selectSimpleThresholdBasedOnOption('Lowest');
    await thresholdEditor.saveAndCloseSimThresholdEditor();
    const src1 = await reportGridView.getGridCellImgSrcByPos(1, 1);
    expect(src1).toContain('/images/quickThresholdImgs/roundedpp_yellow.png');
    await reportEditorPanel.removeObjectInDropzone('rows', 'attribute', 'Category');
    await reportDatasetPanel.addObjectToRows('Category');
    await baseContainer.clickContainerByScript('Visualization 1');
    await reportGridView.openGridColumnHeaderContextMenu('Trend');
    await reportGridView.clickContextMenuOption('Remove');
    await reportDatasetPanel.openObjectContextMenu('Trend');
    await reportDatasetPanel.clickObjectContextMenuItem('Add to Columns');
    await reportEditorPanel.openObjectContextMenuByIndex('Metrics', 2);
    await reportDatasetPanel.clickObjectContextMenuItem('Edit Thresholds...');
    await reportEditorPanel.switchAdvToSimThresholdWithClear();
    await thresholdEditor.switchSimToAdvThresholdWithApply();
    await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
    await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);
    await reportDatasetPanel.addObjectToRows('Subcategory');
    const subcatEl = reportEditorPanel.getObjectInDropzone('Rows', 'attribute', 'Subcategory');
    await expect(subcatEl).toBeVisible();
    await reportPageBy.moveGridHeaderToPageBy('Category');
    await reportEditorPanel.openThresholdInDropZoneForAttribute('Subcategory');
    await thresholdEditor.openNewThresholdCondition();
    await advancedFilter.selectObjectFromBasedOnDropdown('Category');
    await advancedFilter.doElementSelectionForAttributeFilter(['Movies']);
    await advancedFilter.clickOnNewQualificationEditorOkButton();
    await thresholdEditor.selectSecondaryOptionInMenuForThresholdConditions('Formatting', 1);
    await thresholdEditor.setFillColor('Violet');
    await thresholdEditor.clickOnCheckMarkOnFormatPreviewPanel();
    await thresholdEditor.saveAndCloseAdvancedThresholdEditor();
    const viz = reportGridView.getVisualizationViewPort('Visualization 1');
    await expect(viz).toBeVisible();
  });
});
