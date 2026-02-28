/**
 * Migrated from WDIO: ReportEditor_scopeFilterInAuthoring.spec.js
 * Phase 2h - reportScopeFilter: Scope filter in authoring mode.
 */
import { test, expect, reportScopeFilterData } from '../../../fixtures';
import { getReportEnv } from '../../../config/env';

const { reportScopeFilterUser, reportFilterType, reportScopeFilters } = reportScopeFilterData;
const { dossiers } = reportScopeFilterData;

test.describe('Scope Filter - authoring', () => {
  test.beforeEach(async ({ page, libraryPage, loginPage }) => {
    await libraryPage.logout();
    await page.goto('/');
    const env = getReportEnv();
    await loginPage.login({
      username: env.reportScopeFilterUser || reportScopeFilterUser.username,
      password: env.reportTestPassword ?? reportScopeFilterUser.password,
    });
    await page.waitForURL(/Library|Home|Dashboard|app/i, { timeout: 15000 }).catch(() => {});
    await libraryPage.openDefaultApp();
  });

  test.afterEach(async ({ libraryPage }) => {
    await libraryPage.openDefaultApp();
    await libraryPage.handleError();
  });

  test('[TC99643_01] Scope filter - switch to design mode', async ({
    libraryPage,
    reportToolbar,
    reportEditorPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await expect(reportEditorPanel.rowsDropzone, 'Attributes dropzone in pause mode should be visible').toBeVisible();
    await reportToolbar.switchToDesignMode();
    await expect(reportEditorPanel.rowsDropzone, 'Attributes dropzone in design mode should be visible').toBeVisible();
  });

  test('[TC99643_02] Scope filter - show scope filter after execute report', async ({
    libraryPage,
    reportToolbar,
    reportTOC,
    reportFilterPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await expect(reportFilterPanel.getContainer(), 'Empty scope filter in authoring should be visible').toBeVisible();
    await reportToolbar.switchToDesignMode();
    await expect(reportFilterPanel.getContainer(), 'Scope filters after execute should be visible').toBeVisible();
    await reportToolbar.switchToPauseMode();
    await expect(reportFilterPanel.getContainer(), 'Remove scope filters container should be visible').toBeVisible();
  });

  test('[TC99643_03] Scope filter - AE - default selection', async ({
    libraryPage,
    reportFilter,
    reportFilterPanel,
    reportToolbar,
    reportTOC,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await reportFilterPanel.waitForElementVisible(reportFilterPanel.AttributeFormsPanel);
    await expect(
      reportFilterPanel.getAttributeElementFilterSubpanel(),
      'Editable AE with selections should be visible'
    ).toBeVisible();
    await reportFilterPanel.toggleViewSelected();
    await expect(
      reportFilterPanel.getAttributeElementFilterSubpanel(),
      'View selected elements should be visible'
    ).toBeVisible();
  });

  test('[TC99643_04] Scope filter - AE - update filter', async ({
    libraryPage,
    reportFilter,
    reportFilterPanel,
    reportToolbar,
    reportTOC,
    reportGridView,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await reportFilterPanel.selectElements(['Addison', 'Akron', 'Albany', 'Allentown', 'Arden']);
    await reportFilterPanel.saveAndCloseQualificationEditor();
    await reportFilterPanel.clickFilterApplyButton();
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.waitForStatusBarText('1042');
    expect(await reportGridView.getGridCellText(1, 0), 'First name should be Aafedt').toBe('Aafedt');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name should be Wendy').toBe('Wendy');
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 1042 Rows').toBe('1042 Rows, 3 Columns');
  });

  test('[TC99643_05] Scope filter - AE - warning when no selection', async ({
    libraryPage,
    reportFilter,
    reportFilterPanel,
    reportToolbar,
    reportTOC,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await reportFilterPanel.selectElements(['Addison', 'Akron']);
    await expect(reportFilterPanel.getContainer(), 'Warning to select at least one element should be visible').toBeVisible();
  });

  test('[TC99643_06] Scope filter - AQ - update filter by operator is contains', async ({
    libraryPage,
    reportFilter,
    reportFilterPanel,
    reportToolbar,
    reportTOC,
    reportGridView,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    const customerAddressFilter = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.address,
    });
    await customerAddressFilter.enterValue({ value: 'aa' });
    await reportFilterPanel.clickFilterApplyButton();
    await reportTOC.switchToFilterPanel();
    await reportDatasetPanel.waitForStatusBarText('2 Rows');
    expect(await reportGridView.getGridCellText(1, 0), 'First name should be Broughal').toBe('Broughal');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name should be Abner').toBe('Abner');
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 2 Rows').toBe('2 Rows, 3 Columns');
  });

  test('[TC99643_07] Scope filter - AE - ready only', async ({
    libraryPage,
    reportFilter,
    reportFilterPanel,
    reportToolbar,
    reportTOC,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.gender,
    });
    await reportFilterPanel.waitForElementVisible(reportFilterPanel.AttributeFormsPanel);
    await expect(
      reportFilterPanel.getAttributeElementFilterSubpanel(),
      'Ready-only AE with selections should be visible'
    ).toBeVisible();
    await reportFilterPanel.toggleViewSelected();
    await expect(
      reportFilterPanel.getAttributeElementFilterSubpanel(),
      'View selected elements should be visible'
    ).toBeVisible();
  });

  test('[TC99643_08] Scope filter - remove from dropzone', async ({
    libraryPage,
    reportTOC,
    reportEditorPanel,
    reportFilterPanel,
    reportToolbar,
    reportDatasetPanel,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportFilterPanel.getContainer(), 'Default filter panel selections should be visible').toBeVisible();
    await reportTOC.switchToEditorPanel();
    await reportEditorPanel.removeAttributeInRowsDropZone(reportScopeFilters.city);
    await reportTOC.switchToFilterPanel();
    await expect(reportFilterPanel.getContainer(), 'Scope filters keeps the same should be visible').toBeVisible();
  });

  test('[TC99643_09] Scope filter - remove from dataset', async ({
    libraryPage,
    reportTOC,
    reportFilterPanel,
    reportDatasetPanel,
    reportToolbar,
  }) => {
    await libraryPage.editReportByUrl({
      dossierId: dossiers.SFReportGeography.id,
      projectId: dossiers.SFReportGeography.projectId,
    });
    await reportTOC.switchToFilterPanel();
    await reportToolbar.switchToDesignMode();
    await reportDatasetPanel.clickBottomBarToLoseFocus();
    await expect(reportFilterPanel.getContainer(), 'Default filter panel selections should be visible').toBeVisible();
    await reportDatasetPanel.removeItemInReportTab(reportScopeFilters.callCenter);
    await reportTOC.switchToFilterPanel();
    await expect(reportFilterPanel.getContainer(), 'Remove associated scope filter panel should be visible').toBeVisible();
  });
});
