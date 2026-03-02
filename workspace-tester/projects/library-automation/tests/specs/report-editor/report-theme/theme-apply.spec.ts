/**
 * Migrated from WDIO: ReportEditor_theme_apply.spec.js
 * Phase 2g - reportTheme: Apply theme scenarios (BCIN-6490).
 */
import { test, expect, reportThemeData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers } = reportThemeData;
const gridFormattingTheme = 't07. row and columns formatting';

test.describe('Report apply theme', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportTestUser || reportThemeData.reportThemeTestUser.username,
      password: env.reportTestPassword,
    });
    await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[BCIN-6490_01] apply theme with orange template and banding', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const orangeThemeWithBanding = 't02. orange template with banding';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(orangeThemeWithBanding);
    await reportThemePanel.applyTheme(orangeThemeWithBanding);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandTemplateSection();
    await newFormatPanelForGrid.expandLayoutSection();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_02] apply outline theme', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const outlineCompactTheme = 't03. enable outline compact';
    const outlineStandardTheme = 't03. enable outline standard';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(outlineCompactTheme);
    await reportThemePanel.applyTheme(outlineCompactTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(outlineStandardTheme);
    await reportThemePanel.applyTheme(outlineStandardTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_03] apply theme by hide row and column headers', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const hideHeadersTheme = 't04. hide row and column headers';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(hideHeadersTheme);
    await reportThemePanel.applyTheme(hideHeadersTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be hide headers theme'
    ).toBe(hideHeadersTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_04] apply theme with large spacing', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const largeSpacingTheme = 't05. large spacing';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(largeSpacingTheme);
    await reportThemePanel.applyTheme(largeSpacingTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be large spacing theme'
    ).toBe(largeSpacingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandSpacingSection();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_05] apply theme with both axes formatting', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const bothAxesFormattingTheme = 't06. both axis formatting';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(bothAxesFormattingTheme);
    await reportThemePanel.applyTheme(bothAxesFormattingTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be both axes formatting theme'
    ).toBe(bothAxesFormattingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Both Axes');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_06] apply certified theme', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(gridFormattingTheme);
    await reportThemePanel.applyTheme(gridFormattingTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be grid formatting theme'
    ).toBe(gridFormattingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await newFormatPanelForGrid.selectGridColumns('Headers');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridColumns('Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridColumns('Subtotal Headers');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridSegment('Columns');
    await newFormatPanelForGrid.selectGridColumns('Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_07] switch between themes', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const gridBorderTheme = 't08. grid border';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(gridBorderTheme);
    await reportThemePanel.applyTheme(gridBorderTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be grid border theme'
    ).toBe(gridBorderTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(gridFormattingTheme);
    await reportThemePanel.applyTheme(gridFormattingTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be grid formatting theme after switch'
    ).toBe(gridFormattingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
  });

  test('[BCIN-6490_08] re-open report with theme applied', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportWithTheme.id,
      projectId: dossiers.UIReportWithTheme.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportTOC.switchToThemePanel();
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Report with theme should show grid formatting theme'
    ).toBe(gridFormattingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Columns');
    await newFormatPanelForGrid.selectGridColumns('Headers');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6490_09] apply theme on subset report', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.AirlineSubsetReport.id,
      projectId: dossiers.AirlineSubsetReport.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(gridFormattingTheme);
    await reportThemePanel.applyTheme(gridFormattingTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be grid formatting theme on subset report'
    ).toBe(gridFormattingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
  });

  test('[BCIN-6490_10] undo redo after apply theme', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductNoPageBy.id,
      projectId: dossiers.UIReportProductNoPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(gridFormattingTheme);
    await reportThemePanel.applyTheme(gridFormattingTheme);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportToolbar.clickUndo();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await reportToolbar.clickRedo();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });
});
