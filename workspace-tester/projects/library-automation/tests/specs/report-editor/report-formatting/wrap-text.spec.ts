/**
 * Migrated from WDIO: ReportEditor_wrapText.spec.js
 * Phase 2i - reportFormatting: Wrap text and metrics prompt formatting.
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportUser, dossiers } = reportFormattingData;

test.describe('Wrap Text And Metrics Prompt Formatting', () => {
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

  test('[TC86195] Wrap Text in report editor in format panel -> Text & Form', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    newFormatPanelForGrid,
    reportDatasetPanel,
    reportGridView,
    reportFormatPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.TC86195_wrap_text.id,
      projectId: dossiers.TC86195_wrap_text.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandSpacingSection();
    await reportFormatPanel.clickColumnSizeFitOption('Fit to Container');
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await newFormatPanelForGrid.selectGridColumns('Headers');
    await newFormatPanelForGrid.enableWrapText();

    const longCategory =
      'CategoryCategoryCategoryCategoryCategory CategoryCategoryCategoryCategoryCategory';
    await reportDatasetPanel.renameObjectInReportTab('Category', longCategory);

    expect(await reportGridView.getGridCellTextByPos(0, 0), 'Grid (0,0) long category').toBe(longCategory);
    expect(
      await reportGridView.getGridCellStyleByPos(0, 0, 'white-space'),
      'white-space normal'
    ).toBe('normal');

    await newFormatPanelForGrid.disableWrapText();
    expect(
      await reportGridView.getGridCellStyleByPos(0, 0, 'white-space'),
      'white-space nowrap'
    ).toBe('nowrap');

    await newFormatPanelForGrid.enableWrapText();
    const longSub =
      'SubcategorySubcategorySubcategorySubcategory SubcategorySubcategorySubcategorySubcategory';
    await reportDatasetPanel.renameObjectInReportTab('Subcategory', longSub);
    expect(await reportGridView.getGridCellTextByPos(0, 1), 'Grid (0,1) long subcategory').toBe(longSub);

    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.selectGridSegment('All Metrics');
    await newFormatPanelForGrid.selectGridColumns('Headers');
    await newFormatPanelForGrid.enableWrapText();
    expect(
      await reportGridView.getGridCellStyleByPos(0, 3, 'white-space'),
      'Metric header white-space normal'
    ).toBe('normal');

    await newFormatPanelForGrid.disableWrapText();
    expect(
      await reportGridView.getGridCellStyleByPos(0, 3, 'white-space'),
      'Metric header white-space nowrap'
    ).toBe('nowrap');
  });

  test('[TC86195_1] Apply format for Metric prompts', async ({
    libraryPage,
    reportTOC,
    newFormatPanelForGrid,
    reportFormatPanel,
    reportToolbar,
    reportPromptEditor,
    reportGridView,
    baseContainer,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.reportWithMetricPrompt.id,
      projectId: dossiers.reportWithMetricPrompt.projectId,
    });
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await reportFormatPanel.selectGridSegment('Select Metrics to display on columns', 'Values');
    await newFormatPanelForGrid.selectTextFont(reportFormattingData.updateFont);
    expect(
      await reportFormatPanel.getFontSelectorValue(),
      'Font selector value'
    ).toBe(reportFormattingData.updateFont);
    await reportFormatPanel.clickTextFormatButton('bold');
    expect(await reportFormatPanel.isTextFormatButtonSelected('bold'), 'Bold selected').toBe(true);
    await newFormatPanelForGrid.setTextFontSize('12');
    expect(await reportFormatPanel.getFontTextSizeInputValue(), 'Font size 12pt').toBe('12pt');
    await newFormatPanelForGrid.selectFontAlign('right');
    expect(await reportFormatPanel.isFontAlignButtonSelected('right'), 'Align right').toBe(true);

    await reportFormatPanel.selectGridSegment('Select Metrics to display on columns', 'Headers');
    await newFormatPanelForGrid.clickFontColorBtn();
    await newFormatPanelForGrid.clickBuiltInColor('#FBDAD9');
    await baseContainer.dismissColorPicker();

    await reportToolbar.switchToDesignMode(true);
    await reportPromptEditor.clickApplyButtonInReportPromptEditor();

    expect(
      await reportGridView.getGridCellStyleByPos(0, 2, 'color'),
      'Cell color'
    ).toBe('rgba(251,218,217,1)');
    expect(
      await reportGridView.getGridCellStyleByPos(1, 2, 'text-align'),
      'Cell text-align'
    ).toBe('right');
    expect(
      await reportGridView.getGridCellStyleByPos(1, 2, 'font-family'),
      'Cell font-family'
    ).toBe(reportFormattingData.updateFontFamily);
    expect(
      await reportGridView.getGridCellStyleByPos(1, 2, 'font-size'),
      'Cell font-size'
    ).toBe('16px');
    expect(
      await reportGridView.getGridCellStyleByPos(1, 2, 'font-weight'),
      'Cell font-weight'
    ).toBe('700');
  });
});
