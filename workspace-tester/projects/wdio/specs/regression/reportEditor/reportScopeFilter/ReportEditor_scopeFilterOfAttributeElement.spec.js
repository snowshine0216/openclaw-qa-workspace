import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Scope Filter - Attribute element list', () => {
    let {
        loginPage,
        libraryPage,
        reportPage,
        reportGridView,
        reportFilter,
        filterPanel,
        attributeFilter,
        reportSummary,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportScopeFilterUser;
    const reportFilterType = reportConstants.reportFilterType;
    const filterForCustomerCity = reportConstants.reportScopeFilters.city;
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

    it('[TC99552_01] Attribute Element - default selections by exclude', async () => {
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
            'TC99552_01_01',
            'Scope filter panel default values'
        );
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await attributeFilter.waitForElementListLoading();
        await takeScreenshotByElement(
            attributeFilter.getDetailedPanel(),
            'TC99552_01_02',
            'Editable attribute element filter with excluded selections'
        );
    });

    it('[TC99552_02] Attribute Element - update editable scope filter on consumption', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await since(
            '1.1 The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Aafedt');
        await since(
            '1.2 The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Wendy');
        await reportFilter.open();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await attributeFilter.waitForElementListLoading();
        await attributeFilter.selectAttributeElements(['Albany', 'Albert City']);
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC99552_02_01', 'add new selections');
        await attributeFilter.done();
        await reportFilter.apply();
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1042 Rows, 3 Columns');
        await reportFilter.open();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await attributeFilter.waitForElementListLoading();
        await attributeFilter.attributeSearch('Caldwell');
        await attributeFilter.selectAttributeElements(['Caldwell']);
        await attributeFilter.done();
        await reportFilter.apply();
        await since(
            '3.1 The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Aba');
        await since(
            '3.2 The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Blain');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99552_02_01',
            'Scope filter panel updated values'
        );
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await attributeFilter.waitForElementListLoading();
        await attributeFilter.toggleViewSelected();
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC99552_02_02', 'excluded 5 selections');
    });

    it('[TC99552_03] Attribute Element - check default filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportPage.waitForReportLoading();
        await since('1. Default AE scope filter summary panel should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                `SCOPE FILTERS  |  SF-Customer City (not in list Addison, Akron)  AND  SF-Customer Address Address [contains B]  AND  SF-Customer First Name [does not contain Aaby]  AND  SF-Customer Gender (in list Male, Female)  AND  SF-Customer Country ()`
            );
    });

    it('[TC99552_04] Attribute Element - update filter and verify in filter summary', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportFilter.open();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await attributeFilter.waitForElementListLoading();
        await attributeFilter.selectAttributeElements(['Alexandria', 'Arlington Heights']);
        await attributeFilter.done();
        await reportFilter.apply();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1044 Rows, 3 Columns');
        await since('2. Default AE scope filter summary panel should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `SCOPE FILTERS  |  SF-Customer City (not in list Addison, Akron, Alexandria, Arlington Heights)`
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99552_04_01', 'filter summary details');
        await reportSummary.edit({ name: filterForCustomerCity, section: SCOPE_FILTER_TITLE });
        await takeScreenshotByElement(
            attributeFilter.getDetailedPanel(),
            'TC99552_04_02',
            'Edit AE scope filter from filter summary'
        );
        await attributeFilter.toggleViewSelected();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99552_04_03',
            'Filter main panel auto open'
        );
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC99552_04_03', 'excluded 4 selections');
    });

    it('[TC99552_05] Attribute Element - incremental fetch in element list', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportCustomer,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportFilter.open();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await attributeFilter.waitForElementListLoading();
        await attributeFilter.scrollListToBottom();
        await attributeFilter.selectInView();
        await attributeFilter.toggleViewSelected();
        await since(
            '1. scrolldown and select in view element list count should be #{expected}, instead it is #{actual}'
        )
            .expect(await attributeFilter.getElementListCount())
            .toBe(19);
        await takeScreenshotByElement(attributeFilter.getDetailedPanel(), 'TC99552_05_01', 'ElementList Scroll');
        await attributeFilter.done();
        await reportFilter.apply();
        await reportDatasetPanel.waitForStatusBarText('997');
        await since('2. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('997 Rows, 3 Columns');
    });

    it('[TC99552_06] Attribute Element - ready only filter', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportOrder,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportOrder.id,
            projectId: reportConstants.SFReportOrder.project.id,
        });
        await since('1 The total revenue in report grid should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 4))
            .toBe('$24,924,504');
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC99552_06_01',
            'Read-only scope filter not display in filter panel'
        );
        await reportFilter.close();
        await since('2. Default scope filter summary panel should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(
                `SCOPE FILTERS  |  SF-Payment Method (in list Visa, Amex, Check)  AND  SF-Status (in list New, Active, Lost New)`
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryContainer(), 'TC99552_06_02', 'filter summary details');
    });

    it('[TC99552_07] Attribute Element - hidden filter', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportHiddenFilter,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportHiddenFilter.id,
            projectId: reportConstants.SFReportHiddenFilter.project.id,
        });
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('35 Rows, 2 Columns');
        await since('2. Scope filter panel should not display in filter panel, instead it is shown')
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(false);
        await reportFilter.close();
        await since('3. Default filter summary panel should be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe(`REPORT FILTERS  |  SF-Status (in list New, Active, Lost New, Lost Active)`);
        await reportSummary.viewAll();
        await takeScreenshotByElement(
            reportSummary.getSummaryContainer(),
            'TC99552_07_01',
            'Hidden scope filter not display in filter summary'
        );
    });

    it('[TC99552_08] check scope filter tooltip', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.SFReportOrder,
        });
        await libraryPage.openReportByUrl({
            documentId: reportConstants.SFReportOrder.id,
            projectId: reportConstants.SFReportOrder.project.id,
        });
        await reportFilter.open();
        await reportFilter.waitForViewFilterPanelLoading();
        await reportFilter.triggerFilterSectionInfoIcon();
        await since('1. Scope filter tooltip should be #{expected}, instead we have #{actual}')
            .expect(await reportFilter.getTooltipText())
            .toBe(
                'Scope filters have been created on this dataset and automatically added to the filter panel. These filters cannot be deleted, and contextual linking is not supported.'
            );
    });
});
