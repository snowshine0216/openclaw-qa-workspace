/**
 * Migrated from WDIO: ReportEditor_scopeFilterOfAttributeElement.spec.js
 * Phase 2h - reportScopeFilter: Scope filter attribute element scenarios.
 */
import { test, expect, reportScopeFilterData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

const { reportScopeFilterUser, reportFilterType, reportScopeFilters, reportFilterSections } = reportScopeFilterData;
const { dossiers } = reportScopeFilterData;

test.describe('Scope Filter - Attribute element list', () => {
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

  test('[TC99552_01] Attribute Element - default selections by exclude', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    attributeFilter,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCustomer.id, project: { id: dossiers.SFReportCustomer.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'Scope filter panel should be visible').toBeVisible();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await attributeFilter.waitForElementListLoading();
    await expect(attributeFilter.getDetailedPanel(), 'Editable attribute element filter should be visible').toBeVisible();
  });

  test('[TC99552_02] Attribute Element - update editable scope filter on consumption', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    attributeFilter,
    reportGridView,
    reportDatasetPanel,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCustomer.id, project: { id: dossiers.SFReportCustomer.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    expect(await reportGridView.getGridCellText(1, 0), 'First name should be Aafedt').toBe('Aafedt');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name should be Wendy').toBe('Wendy');
    await reportFilter.open();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await attributeFilter.waitForElementListLoading();
    await attributeFilter.selectAttributeElements(['Albany', 'Albert City']);
    await expect(attributeFilter.getDetailedPanel(), 'Add new selections panel should be visible').toBeVisible();
    await attributeFilter.done();
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 1042 Rows').toBe('1042 Rows, 3 Columns');
    await reportFilter.open();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await attributeFilter.waitForElementListLoading();
    await attributeFilter.attributeSearch('Caldwell');
    await attributeFilter.selectAttributeElements(['Caldwell']);
    await attributeFilter.done();
    await reportFilter.apply();
    expect(await reportGridView.getGridCellText(1, 0), 'First name should be Aba').toBe('Aba');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name should be Blain').toBe('Blain');
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'Scope filter panel updated values should be visible').toBeVisible();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await attributeFilter.waitForElementListLoading();
    await attributeFilter.toggleViewSelected();
    await expect(attributeFilter.getDetailedPanel(), 'Excluded 5 selections panel should be visible').toBeVisible();
  });

  test('[TC99552_03] Attribute Element - check default filter summary', async ({
    libraryPage,
    reportPage,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCustomer.id, project: { id: dossiers.SFReportCustomer.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportPage.waitForReportLoading?.().catch(() => {});
    expect(
      await reportSummary.getSummaryBarText(),
      'Default AE scope filter summary panel should match'
    ).toBe(
      `SCOPE FILTERS  |  SF-Customer City (not in list Addison, Akron)  AND  SF-Customer Address Address [contains B]  AND  SF-Customer First Name [does not contain Aaby]  AND  SF-Customer Gender (in list Male, Female)  AND  SF-Customer Country ()`
    );
  });

  test('[TC99552_04] Attribute Element - update filter and verify in filter summary', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    attributeFilter,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCustomer.id, project: { id: dossiers.SFReportCustomer.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportFilter.open();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await attributeFilter.waitForElementListLoading();
    await attributeFilter.selectAttributeElements(['Alexandria', 'Arlington Heights']);
    await attributeFilter.done();
    await reportFilter.apply();
    expect(await reportSummary.getSummaryBarText(), 'AE scope filter summary should contain new cities').toContain(
      `SCOPE FILTERS  |  SF-Customer City (not in list Addison, Akron, Alexandria, Arlington Heights)`
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary details should be visible').toBeVisible();
    await reportSummary.edit({ name: reportScopeFilters.city, section: reportFilterSections.SCOPE_FILTER });
    await expect(attributeFilter.getDetailedPanel(), 'Edit AE scope filter from filter summary should be visible').toBeVisible();
    await attributeFilter.toggleViewSelected();
    await expect(filterPanel.getFilterPanelDropdown(), 'Filter main panel should be visible').toBeVisible();
    await expect(attributeFilter.getDetailedPanel(), 'Excluded 4 selections should be visible').toBeVisible();
  });

  test('[TC99552_05] Attribute Element - incremental fetch in element list', async ({
    libraryPage,
    reportFilter,
    attributeFilter,
    reportDatasetPanel,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCustomer.id, project: { id: dossiers.SFReportCustomer.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportFilter.open();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.city,
    });
    await attributeFilter.waitForElementListLoading();
    await attributeFilter.scrollListToBottom();
    await attributeFilter.selectInView();
    await attributeFilter.toggleViewSelected();
    expect(await attributeFilter.getElementListCount(), 'Element list count should be 19').toBe(19);
    await expect(attributeFilter.getDetailedPanel(), 'Element list scroll panel should be visible').toBeVisible();
    await attributeFilter.done();
    await reportFilter.apply();
    await reportDatasetPanel.waitForStatusBarText('997');
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 997 Rows').toBe('997 Rows, 3 Columns');
  });

  test('[TC99552_06] Attribute Element - ready only filter', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportOrder.id, project: { id: dossiers.SFReportOrder.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportOrder.id,
      projectId: dossiers.SFReportOrder.projectId,
    });
    expect(await reportGridView.getGridCellText(1, 4), 'Total revenue should be $24,924,504').toBe('$24,924,504');
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'Read-only scope filter panel should be visible').toBeVisible();
    await reportFilter.close();
    expect(await reportSummary.getSummaryBarText(), 'Scope filter summary should match').toBe(
      `SCOPE FILTERS  |  SF-Payment Method (in list Visa, Amex, Check)  AND  SF-Status (in list New, Active, Lost New)`
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary details should be visible').toBeVisible();
  });

  test('[TC99552_07] Attribute Element - hidden filter', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    reportSummary,
    reportDatasetPanel,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportHiddenFilter.id, project: { id: dossiers.SFReportHiddenFilter.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportHiddenFilter.id,
      projectId: dossiers.SFReportHiddenFilter.projectId,
    });
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 35 Rows').toBe('35 Rows, 2 Columns');
    const iconVisible = await filterPanel.getFilterIcon().isVisible().catch(() => false);
    expect(iconVisible, 'Scope filter panel should not display').toBe(false);
    await reportFilter.close();
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show REPORT FILTERS').toBe(
      `REPORT FILTERS  |  SF-Status (in list New, Active, Lost New, Lost Active)`
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Hidden scope filter summary should be visible').toBeVisible();
  });

  test('[TC99552_08] check scope filter tooltip', async ({
    libraryPage,
    reportFilter,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportOrder.id, project: { id: dossiers.SFReportOrder.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportOrder.id,
      projectId: dossiers.SFReportOrder.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    await reportFilter.triggerFilterSectionInfoIcon();
    expect(await reportFilter.getTooltipText(), 'Scope filter tooltip should match').toBe(
      'Scope filters have been created on this dataset and automatically added to the filter panel. These filters cannot be deleted, and contextual linking is not supported.'
    );
  });
});
