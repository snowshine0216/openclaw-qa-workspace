/**
 * Migrated from WDIO: ReportEditor_scopeFilterOfDatetime.spec.js
 * Phase 2h - reportScopeFilter: Scope filter datetime scenarios.
 */
import { test, expect, reportScopeFilterData } from '../../../fixtures';
import { resetReportState } from '../../../api/resetReportState';
import { getReportEnv } from '../../../config/env';

const { reportScopeFilterUser, reportFilterType, reportScopeFilters, reportFilterSections } = reportScopeFilterData;
const { dossiers } = reportScopeFilterData;

test.describe('Scope Filter - Date time', () => {
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

  test('[TC99554_01] Scope filter - Attribute Qualification - default selections for calendar', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    reportDatasetPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 822 Rows').toBe('822 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Day of row#1 should be 6/1/2020').toBe('6/1/2020');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should match').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than 05/01/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'Calendar filter default values should be visible').toBeVisible();
  });

  test('[TC99554_02] Scope filter - Attribute Qualification - operator is greater than', async ({
    libraryPage,
    reportFilter,
    reportDatasetPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.month,
    });
    await inlineFilterItem.enterValueToDateTimePicker({ value: '03/01/2020' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 883 Rows').toBe('883 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Day of row#1 should be 4/1/2020').toBe('4/1/2020');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show greater than 03/01/2020').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than 03/01/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
  });

  test('[TC99554_03] Scope filter - Attribute Qualification - available operators', async ({
    libraryPage,
    reportFilter,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.month,
    });
    await inlineFilterItem.openOperatorDropdown();
    await expect(inlineFilterItem.getOperatorDropdown(), 'Operator dropdown for date time filter should be visible').toBeVisible();
  });

  test('[TC99554_04] Scope filter - Attribute Qualification - change operator to less than', async ({
    libraryPage,
    reportFilter,
    reportDatasetPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.month,
    });
    await inlineFilterItem.setOperator('Equals');
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 31 Rows').toBe('31 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Day of row#1 should be 5/1/2020').toBe('5/1/2020');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show equals 05/01/2020').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [equals 05/01/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary modal should be visible').toBeVisible();
  });

  test('[TC99554_05] Scope filter - Attribute Qualification - change month by date time picker', async ({
    libraryPage,
    reportFilter,
    reportDatasetPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.month,
    });
    await inlineFilterItem.selectDateTime({ year: '2020', month: '07', day: '02' });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 761 Rows').toBe('761 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Day of row#1 should be 8/1/2020').toBe('8/1/2020');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show greater than 07/02/2020').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than 07/02/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary modal should be visible').toBeVisible();
  });

  test('[TC99554_06] Scope filter - Attribute Qualification - set dynamic date to today', async ({
    libraryPage,
    reportFilter,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.month,
    });
    await inlineFilterItem.openDynamicDateTimePicker();
    await expect(
      inlineFilterItem.getDynamicDateTimePicker(),
      'Dynamic date time picker should be visible'
    ).toBeVisible();
    await inlineFilterItem.clickDoneButtonInDynamicDatePicker();
    expect(await inlineFilterItem.getDateTimeInputValue(), 'Dynamic date time picker value should contain Today').toContain('Today');
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 0 Rows').toBe('0 Rows, 0 Columns');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show Today').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than Today ]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
  });

  test('[TC99554_07] Scope filter - Attribute Qualification - set dynamic date to today + 100', async ({
    libraryPage,
    reportFilter,
    reportDatasetPanel,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.month,
    });
    await inlineFilterItem.openDynamicDateTimePicker();
    await inlineFilterItem.setDynamicDate({ days: '100', dayOp: '+', months: '1', monthOp: '-' });
    await inlineFilterItem.clickDoneButtonInDynamicDatePicker();
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 0 Rows').toBe('0 Rows, 0 Columns');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show Today plus 100 days').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than Today plus 100 days minus 1 month]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
  });

  test('[TC99554_08] Scope filter - Attribute Qualification - edit from filter summary', async ({
    libraryPage,
    reportFilter,
    filterPanel,
    reportDatasetPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.day,
    });
    await inlineFilterItem.enterValueToDateTimePicker({ value: '09/02/2022' });
    await inlineFilterItem.setOperator('Equals');
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 1 Rows').toBe('1 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Day of row#1 should be 9/2/2022').toBe('9/2/2022');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show equals 09/02/2022').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than 05/01/2020]  AND  SF-Day ID [equals 09/02/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
    await reportSummary.viewAll();
    await reportSummary.edit({ name: 'SF-Day ID', section: reportFilterSections.SCOPE_FILTER });
    await reportFilter.waitForViewFilterPanelLoading();
    await expect(filterPanel.getFilterPanelDropdown(), 'Updated filter panel should be visible').toBeVisible();
  });

  test('[TC99554_09] Scope filter - Attribute Qualification - operator is between', async ({
    libraryPage,
    reportFilter,
    reportDatasetPanel,
    reportGridView,
    reportSummary,
  }) => {
    await resetReportState({
      credentials: reportScopeFilterUser,
      report: { id: dossiers.SFReportCalendar.id, project: { id: dossiers.SFReportCalendar.projectId } },
    });
    await libraryPage.openReportByUrl({
      documentId: dossiers.SFReportCalendar.id,
      projectId: dossiers.SFReportCalendar.projectId,
    });
    await reportFilter.open();
    await reportFilter.waitForViewFilterPanelLoading();
    const inlineFilterItem = reportFilter.findInlineFilterItem({
      expType: reportFilterType.attrQualification,
      objectName: reportScopeFilters.day,
    });
    await inlineFilterItem.selectDateTime({ year: '2020', month: '09', day: '04' });
    await inlineFilterItem.setOperator('Between');
    await inlineFilterItem.selectDateTime({ year: '2020', month: '09', day: '05', index: 1 });
    await reportFilter.apply();
    expect(await reportDatasetPanel.StatusBar.getText(), 'Total row count should be 2 Rows').toBe('2 Rows, 3 Columns');
    expect(await reportGridView.getGridCellText(1, 2), 'Day of row#1 should be 9/4/2020').toBe('9/4/2020');
    expect(await reportSummary.getSummaryBarText(), 'Filter summary should show between').toBe(
      'SCOPE FILTERS  |  SF-Month DATE [greater than 05/01/2020]  AND  SF-Day ID [between 09/04/2020 and 09/05/2020]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
    );
    await reportSummary.viewAll();
    await expect(reportSummary.getSummaryContainer(), 'Filter summary modal should be visible').toBeVisible();
  });
});
