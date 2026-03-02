/**
 * Migrated from WDIO: ReportEditor_scopeFilterOfAttributeQualification.spec.js
 * Phase 2h - reportScopeFilter: Scope filter attribute qualification scenarios.
 */
import { test, expect, reportScopeFilterData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

const { reportScopeFilterUser, reportFilterType, reportScopeFilters, reportFilterSections } = reportScopeFilterData;
const { dossiers } = reportScopeFilterData;

test.describe('Scope Filter - Attribute element qualification', () => {
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

  test('[TC99553_01] Scope filter - Attribute Qualification - default selections contains and not contains', async ({
    libraryPage,
    reportFilter,
    filterPanel,
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
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'Filter panel dropdown should be visible').toBeVisible();
    await reportFilter.close();
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary container should be visible').toBeVisible();
  });

  test('[TC99553_02] Attribute Qualification - update AQ desc contains', async ({
    libraryPage,
    reportFilter,
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
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const customerAddressFilter = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.address,
    });
    await customerAddressFilter.enterValue({ value: 'abc' });
    await reportFilter.apply();
    expect(
      await reportDatasetPanel.StatusBar.getText(),
      'Total row count should be 3 Rows, 3 Columns'
    ).toBe('3 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 0), 'First name of row#1 should be Hancock').toBe('Hancock');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name of row#1 should be Garry').toBe('Garry');
  });

  test('[TC99553_03] Attribute Qualification - update AQ not contains and check filter summary', async ({
    libraryPage,
    reportFilter,
    reportGridView,
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
    expect(await reportGridView.getGridCellText(1, 0), 'First name of row#1 should be Aafedt').toBe('Aafedt');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name of row#1 should be Wendy').toBe('Wendy');
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const customerAQFilter = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.customer,
    });
    await customerAQFilter.enterValue({ value: 'Wendy' });
    await reportFilter.apply();
    expect(await reportGridView.getGridCellText(1, 0), 'First name of row#1 should be Aba').toBe('Aba');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name of row#1 should be Blain').toBe('Blain');
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Updated filter summary should be visible').toBeVisible();
  });

  test('[TC99553_04] Attribute Qualification - id form not in', async ({
    libraryPage,
    reportFilter,
    customInputbox,
    reportGridView,
    reportDatasetPanel,
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
    await reportFilter.waitForViewFilterPanelLoading();
    await reportFilter.openFilterByHeader({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.customerRegion,
    });
    expect(
      await customInputbox.getCurrentInputText(),
      'Default id form list for not in should be 100, 200'
    ).toBe('100, 200');
    await customInputbox.clearByKeyboard();
    await customInputbox.inputListOfValue('4, 5, 6, 7');
    await customInputbox.tab();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.customerRegion,
    });
    await inlineFilterItem.waitForAttributeListValueUpdate('4, 5, 6, 7');
    await customInputbox.validateAndWait();
    await customInputbox.done();
    await reportFilter.apply();
    expect(await reportGridView.getGridCellText(1, 0), 'First name should be Abbott').toBe('Abbott');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name should be Delores').toBe('Delores');
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 465 Rows').toBe('465 Rows, 3 Columns');
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary should be visible').toBeVisible();
  });

  test('[TC99553_05] Attribute Qualification - update from filter summary', async ({
    libraryPage,
    reportFilter,
    reportSummary,
    customInputbox,
    attributeFilter,
    reportGridView,
    reportDatasetPanel,
  }) => {
    const aqExpression = '2, 3, 4, 5, 6, 7';
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCustomer.id, project: { id: dossiers.SFReportCustomer.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCustomer.id,
      projectId: dossiers.SFReportCustomer.projectId,
    });
    await reportSummary.viewAll();
    await reportSummary.edit({ name: 'SF-Customer Region ID', section: reportFilterSections.SCOPE_FILTER });
    await reportFilter.waitForViewFilterPanelLoading();
    expect(await customInputbox.getCurrentInputText(), 'Default id form list should be 100, 200').toBe('100, 200');
    await attributeFilter.sleep(4000);
    await expect(attributeFilter.getDetailedPanel(), 'Edit AQ scope filter panel should be visible').toBeVisible();
    await customInputbox.clearByKeyboard();
    await customInputbox.inputListOfValue(aqExpression);
    await customInputbox.tab();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.customerRegion,
    });
    await inlineFilterItem.waitForAttributeListValueUpdate(aqExpression);
    await customInputbox.validateAndWait();
    await customInputbox.done();
    await reportFilter.apply();
    expect(await reportGridView.getGridCellText(1, 0), 'First name should be Adams').toBe('Adams');
    expect(await reportGridView.getGridCellText(1, 1), 'Last name should be Selby').toBe('Selby');
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 165 Rows').toBe('165 Rows, 3 Columns');
  });

  test('[TC99553_06] Attribute Qualification - operator is equal', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    reportGridView,
    reportDatasetPanel,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportGeographyByCountry.id, project: { id: dossiers.SFReportGeographyByCountry.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportGeographyByCountry.id,
      projectId: dossiers.SFReportGeographyByCountry.projectId,
    });
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 9 Rows').toBe('9 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Total cost should be $26,410,860').toBe('$26,410,860');
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'AQ id equals default values panel should be visible').toBeVisible();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.country,
    });
    await inlineFilterItem.enterValue({ value: '7' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 3 Rows').toBe('3 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(2, 0), 'Total cost row should be Web').toBe('Web');
    expect(await reportGridView.getGridCellText(1, 2), 'Total cost should be $3,319,225').toBe('$3,319,225');
  });

  test('[TC99553_07] Attribute Qualification - update filter for equals by id and check filter summary', async ({
    libraryPage,
    reportFilter,
    reportGridView,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportGeographyByCountry.id, project: { id: dossiers.SFReportGeographyByCountry.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportGeographyByCountry.id,
      projectId: dossiers.SFReportGeographyByCountry.projectId,
    });
    expect(
      await reportSummary.getSummaryBarText(),
      'Default filter summary should show SF-Country ID [equals 1]'
    ).toBe(`SCOPE FILTERS  |  SF-Country ID [equals 1]`);
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary should be visible').toBeVisible();
    await reportSummary.edit({ name: 'SF-Country ID', section: reportFilterSections.SCOPE_FILTER });
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.country,
    });
    await inlineFilterItem.enterValue({ value: '7' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 3 Rows').toBe('3 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(2, 0), 'Row should be Web').toBe('Web');
    expect(await reportGridView.getGridCellText(1, 2), 'Total cost should be $3,319,225').toBe('$3,319,225');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show equals 7').toBe(
      `SCOPE FILTERS  |  SF-Country ID [equals 7]`
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary details should be visible').toBeVisible();
  });

  test('[TC99553_08] Attribute Qualification - operator is between for DESC form', async ({
    libraryPage,
    reportFilter,
    reportGridView,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportGeography.id, project: { id: dossiers.SFReportGeography.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportGeography.id,
      projectId: dossiers.SFReportGeography.projectId,
    });
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 22 Rows').toBe('22 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(22, 3), 'Total cost should be $10,331,485').toBe('$10,331,485');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show between a and n').toBe(
      'SCOPE FILTERS  |  SF-Call Center DESC [between a and n]  AND  SF-Country ID [equals 1]'
    );
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.callCenter,
    });
    await inlineFilterItem.enterValue({ value: 'b' });
    await inlineFilterItem.enterValue({ value: 'c', index: 1 });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 4 Rows').toBe('4 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(4, 3), 'Total cost should be $1,263,442').toBe('$1,263,442');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show between b and c').toBe(
      'SCOPE FILTERS  |  SF-Call Center DESC [between b and c]  AND  SF-Country ID [equals 1]'
    );
  });

  test('[TC99553_09] Attribute Qualification - update filter for between by desc and check filter summary', async ({
    libraryPage,
    reportFilter,
    reportGridView,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportGeography.id, project: { id: dossiers.SFReportGeography.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportGeography.id,
      projectId: dossiers.SFReportGeography.projectId,
    });
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show between a and n').toBe(
      'SCOPE FILTERS  |  SF-Call Center DESC [between a and n]  AND  SF-Country ID [equals 1]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary should be visible').toBeVisible();
    await reportSummary.edit({ name: 'SF-Call Center DESC', section: reportFilterSections.SCOPE_FILTER });
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.callCenter,
    });
    await inlineFilterItem.enterValue({ value: 'b' });
    await inlineFilterItem.enterValue({ value: 'c', index: 1 });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 4 Rows').toBe('4 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(4, 3), 'Total cost should be $1,263,442').toBe('$1,263,442');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show between b and c').toBe(
      'SCOPE FILTERS  |  SF-Call Center DESC [between b and c]  AND  SF-Country ID [equals 1]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Updated filter summary should be visible').toBeVisible();
  });

  test('[TC99553_10] Attribute Qualification - operator is contains', async ({
    libraryPage,
    reportFilter,
    reportGridView,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportProduct.id, project: { id: dossiers.SFReportProduct.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportProduct.id,
      projectId: dossiers.SFReportProduct.projectId,
    });
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 6 Rows').toBe('6 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 0), 'Category should be Books').toBe('Books');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show contains B').toBe(
      'SCOPE FILTERS  |  SF-Category DESC [contains B]  AND  SF-Subcategory ID [greater than 1]'
    );
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.category,
    });
    await inlineFilterItem.enterValue({ value: 'M' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 12 Rows').toBe('12 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 0), 'Category should be Movies').toBe('Movies');
    expect(await reportGridView.getGridCellText(7, 0), 'Category should be Music').toBe('Music');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show contains M').toBe(
      'SCOPE FILTERS  |  SF-Category DESC [contains M]  AND  SF-Subcategory ID [greater than 1]'
    );
  });

  test('[TC99553_11] Attribute Qualification - update filter for contains by desc and check filter summary', async ({
    libraryPage,
    reportFilter,
    reportGridView,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportProduct.id, project: { id: dossiers.SFReportProduct.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportProduct.id,
      projectId: dossiers.SFReportProduct.projectId,
    });
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show contains B').toBe(
      'SCOPE FILTERS  |  SF-Category DESC [contains B]  AND  SF-Subcategory ID [greater than 1]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary should be visible').toBeVisible();
    await reportSummary.edit({ name: 'SF-Category DESC', section: reportFilterSections.SCOPE_FILTER });
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.category,
    });
    await inlineFilterItem.enterValue({ value: 'E' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 6 Rows').toBe('6 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 0), 'Category should be Electronics').toBe('Electronics');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show contains E').toBe(
      'SCOPE FILTERS  |  SF-Category DESC [contains E]  AND  SF-Subcategory ID [greater than 1]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Updated filter summary should be visible').toBeVisible();
  });

  test('[TC99553_12] Attribute Qualification - operator is greater than', async ({
    libraryPage,
    reportFilter,
    reportGridView,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportProduct.id, project: { id: dossiers.SFReportProduct.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportProduct.id,
      projectId: dossiers.SFReportProduct.projectId,
    });
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 6 Rows').toBe('6 Rows, 3 Columns');
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.subcategory,
    });
    await inlineFilterItem.enterValue({ value: '13' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 3 Rows').toBe('3 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 1), 'Subcategory should be Books - Miscellaneous').toBe('Books - Miscellaneous');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show greater than 13').toBe(
      'SCOPE FILTERS  |  SF-Category DESC [contains B]  AND  SF-Subcategory ID [greater than 13]'
    );
  });
});
