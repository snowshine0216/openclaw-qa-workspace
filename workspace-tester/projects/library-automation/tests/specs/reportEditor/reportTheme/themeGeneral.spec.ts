/**
 * Migrated from WDIO: ReportEditor_theme_general.spec.js
 * Phase 2g - reportTheme: General theme panel scenarios (BCIN-6488).
 */
import { test, expect, reportThemeData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { dossiers, tutorialProject } = reportThemeData;
const autoStyleAccounting = 'Accounting';
const autoStyleBase = 'Base';
const certifiedTheme = 't01. blue template';

test.describe('Report theme general', () => {
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

  test('[BCIN-6488_01] show hide report theme panel', async ({
    libraryPage,
    reportTOC,
    reportThemePanel,
    reportMenubar,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportTOC.switchToThemePanel();
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be displayed'
    ).toBe(true);
    await reportMenubar.clickMenuItem('View');
    await expect(reportMenubar.getActiveMenuDropdown()).toBeVisible();
    await reportMenubar.clickMenuItem('View');
    await reportMenubar.clickSubMenuItem('View', 'Themes Panel');
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be hidden'
    ).toBe(false);
    await reportMenubar.clickMenuItem('View');
    await expect(reportMenubar.getActiveMenuDropdown()).toBeVisible();
    await reportMenubar.clickMenuItem('View');
    await reportMenubar.clickSubMenuItem('View', 'Themes Panel');
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be displayed again'
    ).toBe(true);
  });

  test('[BCIN-6488_02] apply auto style with banding', async ({
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
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(autoStyleAccounting);
    await reportThemePanel.applyTheme(autoStyleAccounting);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.expandLayoutSection();
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6488_03] apply auto style with formatting on row and columns', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const autoStyleAgent = 'Agent';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(autoStyleAgent);
    await reportThemePanel.applyTheme(autoStyleAgent);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await newFormatPanelForGrid.selectGridColumns('Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridSegment('Columns');
    await newFormatPanelForGrid.selectGridColumns('Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridSegment('All Metrics');
    await newFormatPanelForGrid.selectGridColumns('Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6488_04] apply auto style formatting on border', async ({
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
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(autoStyleBase);
    await reportThemePanel.applyTheme(autoStyleBase);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridSegment('Columns');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridSegment('All Metrics');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6488_05] apply auto style with formatting on subtotal', async ({
    libraryPage,
    reportToolbar,
    reportPage,
    reportTOC,
    reportThemePanel,
    reportFormatPanel,
    newFormatPanelForGrid,
    reportDatasetPanel,
  }) => {
    const autoStyleColorful = 'Colorful';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(autoStyleColorful);
    await reportThemePanel.applyTheme(autoStyleColorful);
    await expect(reportPage.getContainer()).toBeVisible();
    await reportTOC.switchToFormatPanel();
    await newFormatPanelForGrid.switchToTextFormatTab();
    await newFormatPanelForGrid.selectGridSegment('Rows');
    await newFormatPanelForGrid.selectGridColumns('Subtotal Headers');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridSegment('Columns');
    await newFormatPanelForGrid.selectGridColumns('Subtotal Headers');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
    await newFormatPanelForGrid.selectGridColumns('Subtotal Values');
    await expect(reportFormatPanel.FormatPanel).toBeVisible();
  });

  test('[BCIN-6488_06] filter certified theme', async ({
    libraryPage,
    reportTOC,
    reportThemePanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportTOC.switchToThemePanel();
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be Light Grid'
    ).toBe('Light Grid');
    expect(
      await reportThemePanel.isCurrentThemeCertified(),
      'Current theme should not be certified initially'
    ).toBe(false);
    await reportThemePanel.toggleCertifiedThemes();
    await expect(reportThemePanel.getThemePanel()).toBeVisible();
    await reportThemePanel.searchTheme(certifiedTheme);
    await reportThemePanel.applyTheme(certifiedTheme);
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Current theme should be certified theme'
    ).toBe(certifiedTheme);
    expect(
      await reportThemePanel.isCurrentThemeCertified(),
      'Current theme should be certified'
    ).toBe(true);
  });

  test('[BCIN-6488_07] check theme cover image', async ({
    libraryPage,
    reportTOC,
    reportThemePanel,
  }) => {
    const autoStyleBusinessGreen = 'Business Green';
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(autoStyleAccounting);
    const url1 = await reportThemePanel.getCoverImageUrlByName(autoStyleAccounting);
    expect(url1, 'Accounting cover image URL should contain accounting').toContain(
      'dossierreact/dist/assets/images/accounting'
    );
    await reportThemePanel.searchTheme(autoStyleBusinessGreen);
    const url2 = await reportThemePanel.getCoverImageUrlByName(autoStyleBusinessGreen);
    expect(url2, 'Business Green cover image URL should contain business_green').toContain(
      'dossierreact/dist/assets/images/business_green'
    );
    await reportThemePanel.searchTheme(certifiedTheme);
    const url3 = await reportThemePanel.getCoverImageUrlByName(certifiedTheme);
    expect(url3, 'Certified theme cover image URL').toContain('Coverpages');
  });

  test('[BCIN-6488_08] check theme tooltip when hovering on info icon', async ({
    libraryPage,
    reportTOC,
    reportThemePanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme(autoStyleAccounting);
    await reportThemePanel.hoverOnThemeInfoIcon(autoStyleAccounting);
    const tooltip1 = await reportThemePanel.getTooltipContent();
    expect(tooltip1, 'Accounting theme tooltip should contain date').toMatch(/\d{2}\/\d{2}\/\d{4}/);
    await reportThemePanel.searchTheme(autoStyleBase);
    await reportThemePanel.hoverOnThemeInfoIcon(autoStyleBase);
    const tooltip2 = await reportThemePanel.getTooltipContent();
    expect(tooltip2, 'Base theme tooltip should contain date').toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('[BCIN-6488_09] resize editor panel to re-order theme cards', async ({
    libraryPage,
    reportPage,
    reportTOC,
    reportThemePanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportTOC.switchToThemePanel();
    await reportThemePanel.searchTheme('bl');
    const cardSize = await reportThemePanel.getCurrentThemeCardSize();
    await reportPage.resizeEditorPanel(cardSize.x);
    await expect(reportThemePanel.getThemePanel()).toBeVisible();
  });

  test('[BCIN-6488_10] choose select theme from top menu when theme panel is not show', async ({
    libraryPage,
    reportTOC,
    reportThemePanel,
    reportMenubar,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.UIReportProductWithPageBy.id,
      projectId: dossiers.UIReportProductWithPageBy.projectId,
    });
    await reportTOC.switchToThemePanel();
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be displayed'
    ).toBe(true);
    await reportMenubar.clickSubMenuItem('View', 'Themes Panel');
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be hidden'
    ).toBe(false);
    await reportMenubar.clickSubMenuItem('Format', 'Select Theme');
    expect(
      await reportThemePanel.isThemePanelDisplayed(),
      'Theme panel should be displayed after Select Theme from menu'
    ).toBe(true);
  });

  test('[BCIN-6488_11] check current theme for newly created report from blank template', async ({
    libraryPage,
    reportPage,
    reportTOC,
    reportThemePanel,
    dossierCreator,
  }) => {
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(tutorialProject.name);
    await dossierCreator.selectTemplate('Blank');
    await dossierCreator.clickCreateButton();
    await reportPage.waitForReportLoading(true);
    await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
    await reportTOC.switchToThemePanel();
    await expect(reportPage.getContainer()).toBeVisible();
    expect(
      await reportThemePanel.getCurrentTheme(),
      'Blank template should have Light Grid theme'
    ).toBe('Light Grid');
  });

  test('[BCIN-6488_12] check current theme when creating report by template', async ({
    reportPage,
    reportTOC,
    reportThemePanel,
    dossierCreator,
  }) => {
    const template = 'report template subset';
    await dossierCreator.createNewReport();
    await dossierCreator.switchProjectByName(tutorialProject.name);
    await dossierCreator.searchTemplate(template);
    await dossierCreator.selectTemplate(template);
    await dossierCreator.clickCreateButton();
    await reportPage.waitForReportLoading(true);
    await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
    await reportTOC.switchToThemePanel();
    await expect(reportPage.getContainer()).toBeVisible();
    expect(
      await reportThemePanel.getCurrentThemeContainer().isVisible(),
      'Template report should have current theme displayed'
    ).toBe(true);
  });
});
