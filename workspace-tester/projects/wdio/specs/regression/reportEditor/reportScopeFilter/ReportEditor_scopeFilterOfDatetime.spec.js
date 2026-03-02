import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Scope Filter - Date time', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        reportFilter,
        filterPanel,
        customInputbox,
        attributeFilter,
        reportSummary,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportScopeFilterUser;
    const reportFilterType = reportConstants.reportFilterType;
    const filterForMonth = reportConstants.reportScopeFilters.month;
    const filterForDay = reportConstants.reportScopeFilters.day;
    const filterForYear = reportConstants.reportScopeFilters.year;
    const SCOPE_FILTER_TITLE = reportConstants.reportFilterSections.SCOPE_FILTER;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC99554_01] Scope filter - Attribute Qualification - default selections for calendar', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('822 Rows, 3 Columns');
        await since('2. Day of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('6/1/2020');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than 05/01/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99554_01_01',
            'Calendar filter default values'
        );
    });

    it('[TC99554_02] Scope filter - Attribute Qualification - operator is greater than', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForMonth,
        });
        await inlineFilterItem.enterValueToDateTimePicker({ value: '03/01/2020' });
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('883 Rows, 3 Columns');
        await since('2. Day of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('4/1/2020');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than 03/01/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
    });

    it('[TC99554_03] Scope filter - Attribute Qualification - available operators', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForMonth,
        });
        await inlineFilterItem.openOperatorDropdown();
        await takeScreenshotByElement(
            inlineFilterItem.getOperatorDropdown(),
            'TC99554_03_01',
            'Operator dropdown for date time filter'
        );
    });

    it('[TC99554_04] Scope filter - Attribute Qualification - change operator to less than', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForMonth,
        });
        await inlineFilterItem.setOperator('Equals');
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('31 Rows, 3 Columns');
        await since('2. Day of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('5/1/2020');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [equals 05/01/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99554_04_02',
            'Filter summary modal with date time filter'
        );
    });

    it('[TC99554_05] Scope filter - Attribute Qualification - change month by date time picker', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForMonth,
        });
        await inlineFilterItem.selectDateTime({ year: '2020', month: '07', day: '02' });
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('761 Rows, 3 Columns');
        await since('2. Day of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('8/1/2020');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than 07/02/2020]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99554_05_01',
            'Filter summary modal with date time filter'
        );
    });

    it('[TC99554_06] Scope filter - Attribute Qualification - set dynamic date to today', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForMonth,
        });
        await inlineFilterItem.openDynamicDateTimePicker();
        await since('1. Dynamic date time picker should be #{expected}, instead it is #{actual}')
            .expect(await inlineFilterItem.getDynamicDateTimePicker().isDisplayed())
            .toBe(true);
        await inlineFilterItem.clickDoneButtonInDynamicDatePicker();
        await since('2. Dynamic date time picker value should be #{expected}, instead it is #{actual}')
            .expect(await inlineFilterItem.getDateTimeInputValue())
            .toContain('Today');
        await reportFilter.apply();
        await since('3. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('0 Rows, 0 Columns');
        await since('5. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than Today ]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
    });

    it('[TC99554_07] Scope filter - Attribute Qualification - set dynamic date to today + 100', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForMonth,
        });
        await inlineFilterItem.openDynamicDateTimePicker();
        await inlineFilterItem.setDynamicDate({ days: '100', dayOp: '+', months: '1', monthOp: '-' });
        await inlineFilterItem.clickDoneButtonInDynamicDatePicker();
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('0 Rows, 0 Columns');
        await since('2. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than Today plus 100 days minus 1 month]  AND  SF-Day ID [less than 09/01/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
    });

    it('[TC99554_08] Scope filter - Attribute Qualification - edit from filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForDay,
        });
        await inlineFilterItem.enterValueToDateTimePicker({ value: '09/02/2022' });
        await inlineFilterItem.setOperator('Equals');
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 3 Columns');
        await since('2. Day of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('9/2/2022');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than 05/01/2020]  AND  SF-Day ID [equals 09/02/2022]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
        await reportSummary.viewAll();
        await reportSummary.edit({ name: 'SF-Day ID', section: SCOPE_FILTER_TITLE });
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(filterPanel.getFilterPanelDropdown(), 'TC99554_08_01', 'Updated filter panel');
    });

    it('[TC99554_09] Scope filter - Attribute Qualification - operator is between', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCalendar,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCalendar.id,
            projectId: reportConstants.SFReportCalendar.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForDay,
        });
        await inlineFilterItem.selectDateTime({ year: '2020', month: '09', day: '04' });
        await inlineFilterItem.setOperator('Between');
        await inlineFilterItem.selectDateTime({ year: '2020', month: '09', day: '05', index: 1 });
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('2 Rows, 3 Columns');
        await since('2. Day of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('9/4/2020');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                'SCOPE FILTERS  |  SF-Month DATE [greater than 05/01/2020]  AND  SF-Day ID [between 09/04/2020 and 09/05/2020]  AND  SF-Year DATE [between 12/01/2019 and 01/01/2023]'
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99554_09_01',
            'Filter summary modal with date time filter'
        );
    });
});
