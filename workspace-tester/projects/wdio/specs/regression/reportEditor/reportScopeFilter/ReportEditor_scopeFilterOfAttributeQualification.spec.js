import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Scope Filter - Attribute element qualification', () => {
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
    const filterForCustomerAddress = reportConstants.reportScopeFilters.address;
    const filterForCustomer = reportConstants.reportScopeFilters.customer;
    const filterForCustomerRegion = reportConstants.reportScopeFilters.customerRegion;
    const filterForCountry = reportConstants.reportScopeFilters.country;
    const filterForCallCenter = reportConstants.reportScopeFilters.callCenter;
    const filterForCategory = reportConstants.reportScopeFilters.category;
    const filterForSubcategory = reportConstants.reportScopeFilters.subcategory;
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

    it('[TC99553_01] Scope filter - Attribute Qualification - default selections contains and not contains', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99553_01_01',
            'AQ filter contains not contains default values'
        );
        await reportFilter.close();
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99553_01_02', 'filter summary details');
    });

    it('[TC99553_02] Attribute Qualification - update AQ desc contains', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const customerAddressFilter = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerAddress,
        });
        await customerAddressFilter.enterValue({ value: 'abc' });
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await since(
            '2 The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Hancock');
        await since(
            '3 The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Garry');
    });

    it('[TC99553_03] Attribute Qualification - update AQ not contains and check filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await since(
            '1. The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Aafedt');
        await since(
            '2. The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Wendy');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        const customerAQFilter = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomer,
        });
        await customerAQFilter.enterValue({ value: 'Wendy' });
        await reportFilter.apply();
        await since(
            '3. The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Aba');
        await since(
            '4. The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Blain');
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99553_03_01',
            'updated filter summary details'
        );
    });

    it('[TC99553_04] Attribute Qualification - id form not in', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerRegion,
        });
        await since(
            '1. The default id form list for not in expression should be #{expected}, instead we have #{actual}'
        )
            .expect(await customInputbox.getCurrentInputText())
            .toBe('100, 200');
        await customInputbox.clearByKeyboard();
        await customInputbox.inputListOfValue('4, 5, 6, 7');
        await customInputbox.tab();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerRegion,
        });
        await inlineFilterItem.waitForAttributeListValueUpdate('4, 5, 6, 7');
        await customInputbox.validateAndWait();
        await customInputbox.done();
        await reportFilter.apply();
        await since(
            '2. The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Abbott');
        await since(
            '3. The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Delores');
        await since('4. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('465 Rows, 3 Columns');
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99553_04_01',
            'updated filter summary details'
        );
    });

    it('[TC99553_05] Attribute Qualification - update from filter summary', async () => {
        const aqExpression = '2, 3, 4, 5, 6, 7';
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportSummary.viewAll();
        await reportSummary.edit({ name: 'SF-Customer Region ID', section: SCOPE_FILTER_TITLE });
        await reportFilter.waitForViewFilterPanelLoading();
        await since(
            '1. The default id form list for not in expression should be #{expected}, instead we have #{actual}'
        )
            .expect(await customInputbox.getCurrentInputText())
            .toBe('100, 200');
        await attributeFilter.sleep(4000); // wait for Required Validation toast appear
        await takeScreenshotByElement(
            attributeFilter.getDetailedPanel(),
            'TC99553_05_01',
            'Edit AQ scope filter from filter summary'
        );
        await customInputbox.clearByKeyboard();
        await customInputbox.inputListOfValue(aqExpression);
        await customInputbox.tab();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerRegion,
        });
        await inlineFilterItem.waitForAttributeListValueUpdate(aqExpression);
        await customInputbox.validateAndWait();
        await customInputbox.done();
        await reportFilter.apply();
        await since(
            '2. The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Adams');
        await since(
            '3. The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Selby');
        await since('4. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('165 Rows, 3 Columns');
    });

    it('[TC99553_06] Attribute Qualification - operator is equal', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportGeographyByCountry,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportGeographyByCountry.id,
            projectId: reportConstants.SFReportGeographyByCountry.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('9 Rows, 3 Columns');
        await since('2. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('$26,410,860');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99553_06_01',
            'AQ id equals default values'
        );
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCountry,
        });
        await inlineFilterItem.enterValue({ value: '7' });
        await reportFilter.apply();
        await since('3. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await since('4. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(2, 0))
            .toBe('Web');
        await since('5. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('$3,319,225');
    });

    it('[TC99553_07] Attribute Qualification - update filter for equals by id and check filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportGeographyByCountry,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportGeographyByCountry.id,
            projectId: reportConstants.SFReportGeographyByCountry.project.id,
        });
        await since('1. Default filter summary panel should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`SCOPE FILTERS  |  SF-Country ID [equals 1]`);
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99553_07_01', 'filter summary details');
        await reportSummary.edit({ name: 'SF-Country ID', section: SCOPE_FILTER_TITLE });
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCountry,
        });
        await inlineFilterItem.enterValue({ value: '7' });
        await reportFilter.apply();
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await since('3. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(2, 0))
            .toBe('Web');
        await since('4. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 2))
            .toBe('$3,319,225');
        await since('5. filter summary panel should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`SCOPE FILTERS  |  SF-Country ID [equals 7]`);
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99553_07_02', 'filter summary details');
    });

    it('[TC99553_08] Attribute Qualification - operator is between for DESC form', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportGeography,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportGeography.id,
            projectId: reportConstants.SFReportGeography.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('22 Rows, 3 Columns');
        await since('2. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(22, 3))
            .toBe('$10,331,485');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Call Center DESC [between a and n]  AND  SF-Country ID [equals 1]');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99553_08_01',
            'AQ desc between default values'
        );
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCallCenter,
        });
        await inlineFilterItem.enterValue({ value: 'b' });
        await inlineFilterItem.enterValue({ value: 'c', index: 1 });
        await reportFilter.apply();
        await since('4. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('4 Rows, 3 Columns');
        await since('5. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(4, 3))
            .toBe('$1,263,442');
        await since('6. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Call Center DESC [between b and c]  AND  SF-Country ID [equals 1]');
    });

    it('[TC99553_09] Attribute Qualification - update filter for between by desc and check filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportGeography,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportGeography.id,
            projectId: reportConstants.SFReportGeography.project.id,
        });
        await since('1. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Call Center DESC [between a and n]  AND  SF-Country ID [equals 1]');
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99553_09_01', 'filter summary details');
        await reportSummary.edit({ name: 'SF-Call Center DESC', section: SCOPE_FILTER_TITLE });
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCallCenter,
        });
        await inlineFilterItem.enterValue({ value: 'b' });
        await inlineFilterItem.enterValue({ value: 'c', index: 1 });
        await reportFilter.apply();
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('4 Rows, 3 Columns');
        await since('3. The total cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(4, 3))
            .toBe('$1,263,442');
        await since('4. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Call Center DESC [between b and c]  AND  SF-Country ID [equals 1]');
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99553_09_02',
            'updated filter summary details'
        );
    });

    it('[TC99553_10] Attribute Qualification - operator is contains', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportProduct,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportProduct.id,
            projectId: reportConstants.SFReportProduct.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('6 Rows, 3 Columns');
        await since('2. Category should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Books');
        await since('3. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Category DESC [contains B]  AND  SF-Subcategory ID [greater than 1]');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99553_10_01',
            'AQ desc contains default values'
        );
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCategory,
        });
        await inlineFilterItem.enterValue({ value: 'M' });
        await reportFilter.apply();
        await since('4. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('12 Rows, 3 Columns');
        await since('5. Category should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Movies');
        await since('6. Category should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(7, 0))
            .toBe('Music');
        await since('7. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Category DESC [contains M]  AND  SF-Subcategory ID [greater than 1]');
    });

    it('[TC99553_11] Attribute Qualification - update filter for contains by desc and check filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportProduct,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportProduct.id,
            projectId: reportConstants.SFReportProduct.project.id,
        });
        await since('1. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Category DESC [contains B]  AND  SF-Subcategory ID [greater than 1]');
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99553_11_01', 'filter summary details');
        await reportSummary.edit({ name: 'SF-Category DESC', section: SCOPE_FILTER_TITLE });
        await reportFilter.waitForViewFilterPanelLoading();
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCategory,
        });
        await inlineFilterItem.enterValue({ value: 'E' });
        await reportFilter.apply();
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('6 Rows, 3 Columns');
        await since('3. Category should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Electronics');
        await since('4. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Category DESC [contains E]  AND  SF-Subcategory ID [greater than 1]');
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99553_11_02',
            'updated filter summary details'
        );
    });

    it('[TC99553_12] Attribute Qualification - operator is greater than', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportProduct,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportProduct.id,
            projectId: reportConstants.SFReportProduct.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('6 Rows, 3 Columns');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99553_12_01',
            'AQ id greater than default values'
        );
        const inlineFilterItem = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForSubcategory,
        });
        await inlineFilterItem.enterValue({ value: '13' });
        await reportFilter.apply();
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await since('3. Subcategory of row#1 should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Books - Miscellaneous');
        await since('4. Filter summary should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('SCOPE FILTERS  |  SF-Category DESC [contains B]  AND  SF-Subcategory ID [greater than 13]');
    });
});
