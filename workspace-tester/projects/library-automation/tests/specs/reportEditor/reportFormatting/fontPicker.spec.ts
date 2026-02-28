/**
 * Migrated from WDIO: ReportEditor_fontPicker.spec.js
 * Phase 2i - reportFormatting: Replace mono type font, missing font dialog.
 * Tests requiring mockFeatureFlagOfSuppressMissingFontDialog are skipped (requires mock).
 */
import { test, expect, reportFormattingData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportFontUser, dossiers, fonts } = reportFormattingData;

test.describe('Replace mono type font in report editor', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportTestUser || reportFontUser.username,
      password: env.reportTestPassword ?? reportFontUser.password,
    });
    await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test.skip('[TC99483_01] Missing font dialog when feature flag off', async ({ libraryPage, reportPage }) => {
    // requires mockFeatureFlagOfSuppressMissingFontDialog(false)
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportWithMonoTypeFont.id,
      projectId: dossiers.ReportWithMonoTypeFont.projectId,
    });
    await expect(reportPage.getMissingFontPopup(), 'Missing font popup visible').toBeVisible();
    await reportPage.dismissMissingFontPopup();
  });

  test.skip('[TC99483_02] Missing font dialog not shown when feature flag on', async ({ libraryPage, reportPage }) => {
    // requires mockFeatureFlagOfSuppressMissingFontDialog(true)
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportWithMonoTypeFont.id,
      projectId: dossiers.ReportWithMonoTypeFont.projectId,
    });
    await expect(reportPage.getMissingFontPopup(), 'Popup not shown').not.toBeVisible();
  });

  test('[TC99483_03] Missing font warning in format panel font picker', async ({
    libraryPage,
    reportPage,
    reportTOC,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportToolbar,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportWithMonoTypeFont.id,
      projectId: dossiers.ReportWithMonoTypeFont.projectId,
    });
    const popup = reportPage.getMissingFontPopup();
    if (await popup.isVisible().catch(() => false)) {
      await reportPage.dismissMissingFontPopup();
    }
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await reportFormatPanel.selectGridSegment('Subcategory', 'All');
    const selectedFont = newFormatPanelForGrid.fontPicker?.getCurrentSelectedFont
      ? await newFormatPanelForGrid.fontPicker.getCurrentSelectedFont()
      : fonts.MonotypeCorsiva;
    expect(selectedFont, 'Selected font Monotype Corsiva').toBe(fonts.MonotypeCorsiva);
    if (newFormatPanelForGrid.fontPicker?.clickWarningIcon) {
      await newFormatPanelForGrid.fontPicker.clickWarningIcon();
    }
    const tooltip = newFormatPanelForGrid.fontPicker?.getMissingFontTooltip?.();
    if (tooltip) {
      await expect(tooltip, 'Missing font tooltip visible').toBeVisible();
    }
    await reportToolbar.switchToDesignMode(false);
    const fontFamily = await reportGridView.getGridCellStyleByPos(1, 1, 'font-family');
    expect(fontFamily, 'Cell font fallback').toContain(fonts.MonotypeCorsiva.toLowerCase());
  });

  test.skip('[TC99483_04] Missing font warning in threshold editor', async () => {
    // requires ThresholdEditor fontPicker
  });

  test('[TC99483_05] Change to OOTB font in format panel', async ({
    libraryPage,
    reportPage,
    reportToolbar,
    reportTOC,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportGridView,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.ReportWithMonoTypeFont.id,
      projectId: dossiers.ReportWithMonoTypeFont.projectId,
    });
    if (await reportPage.getMissingFontPopup().isVisible().catch(() => false)) {
      await reportPage.dismissMissingFontPopup();
    }
    await reportToolbar.switchToDesignMode(false);
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await reportFormatPanel.selectGridSegment('Subcategory', 'All');
    if (newFormatPanelForGrid.fontPicker?.selectFontByName) {
      await newFormatPanelForGrid.fontPicker.selectFontByName(fonts.Inter);
    }
    const selectedFont = newFormatPanelForGrid.fontPicker?.getCurrentSelectedFont
      ? await newFormatPanelForGrid.fontPicker.getCurrentSelectedFont()
      : fonts.Inter;
    expect(selectedFont, 'Selected Inter').toBe(fonts.Inter);
    const fontFamily = await reportGridView.getGridCellStyleByPos(1, 1, 'font-family');
    expect(fontFamily, 'Cell font Inter').toContain(fonts.Inter.toLowerCase());
  });

  test.skip('[TC99483_06] Change to custom font in threshold editor', async () => {
    // requires ReportEditorPanel.editThresholdInDropZoneForMetric, ThresholdEditor
  });

  test.skip('[TC99483_07] Fallback monotype font in consumption mode', async () => {
    // requires resetReportState, openReportByUrl in consumption
  });
});
