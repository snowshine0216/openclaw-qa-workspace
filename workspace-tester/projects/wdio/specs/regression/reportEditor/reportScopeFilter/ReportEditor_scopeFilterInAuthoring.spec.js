import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Scope Filter - authoring', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportEditorPanel,
        reportTOC,
        reportFilterPanel,
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
    const filterForCustomerCity = reportConstants.reportScopeFilters.city;
    const filterForCustomerAddress = reportConstants.reportScopeFilters.address;
    const filterForCustomerGender = reportConstants.reportScopeFilters.gender;
    const filterForCustomer = reportConstants.reportScopeFilters.customer;
    const filterForCustomerRegion = reportConstants.reportScopeFilters.customerRegion;
    const filterForCountry = reportConstants.reportScopeFilters.customerCountry;
    const filterForCallCenter = reportConstants.reportScopeFilters.callCenter;
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

    it('[TC99643_01] Scope filter - switch to design mode', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await takeScreenshotByElement(
            reportEditorPanel.rowsDropzone,
            'TC99643_01_01',
            'attributes dropzone in pause mode'
        );
        await reportToolbar.switchToDesignMode();
        await takeScreenshotByElement(
            reportEditorPanel.rowsDropzone,
            'TC99643_01_02',
            'attributes dropzone in design mode'
        );
    });

    it('[TC99643_02] Scope filter - show scope filter after execute report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_02_01',
            'Empty scope filter in authoring mode'
        );
        await reportToolbar.switchToDesignMode();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_02_02',
            'show scope filters after execute report'
        );
        await reportToolbar.switchToPauseMode();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'TC99643_02_03', 'Remove scope filters');
    });

    it('[TC99643_03] Scope filter - AE - default selection', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await reportFilterPanel.waitForElementVisible(reportFilterPanel.AttributeFormsPanel);
        await takeScreenshotByElement(
            reportFilterPanel.getAttributeElementFilterSubpanel(),
            'TC99643_03_01',
            'Editable AE with selections'
        );
        await reportFilterPanel.toggleViewSelected();
        await takeScreenshotByElement(
            reportFilterPanel.getAttributeElementFilterSubpanel(),
            'TC99643_03_02',
            'View selected elements'
        );
    });

    it('[TC99643_04] Scope filter - AE - update filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await reportFilterPanel.selectElements(['Addison', 'Akron', 'Albany', 'Allentown', 'Arden']);
        await reportFilterPanel.saveAndCloseQualificationEditor();
        await reportFilterPanel.clickFilterApplyButton();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.waitForStatusBarText('1042');
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
        await since('3. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1042 Rows, 3 Columns');
    });

    it('[TC99643_05] Scope filter - AE - warning when no selection', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerCity,
        });
        await reportFilterPanel.selectElements(['Addison', 'Akron']);
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_05',
            'warning to select at least one element'
        );
    });

    it('[TC99643_06] Scope filter - AQ - update filter by operator is contains', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        const customerAddressFilter = reportFilter.findInlineFilterItem({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerAddress,
        });
        await customerAddressFilter.enterValue({ value: 'aa' });
        await reportFilterPanel.clickFilterApplyButton();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.waitForStatusBarText('2 Rows');
        await since(
            '1. The first name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Broughal');
        await since(
            '2. The last name of row#1 of attribute SF-Customer should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 1))
            .toBe('Abner');
        await since('3. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('2 Rows, 3 Columns');
    });

    it('[TC99643_07] Scope filter - AE - ready only', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportFilter.openFilterByHeader({
            expType: reportFilterType.attrQualification,
            objectName: filterForCustomerGender,
        });
        await reportFilterPanel.waitForElementVisible(reportFilterPanel.AttributeFormsPanel);
        await takeScreenshotByElement(
            reportFilterPanel.getAttributeElementFilterSubpanel(),
            'TC99643_07_01',
            'Ready-only AE with selections'
        );
        await reportFilterPanel.toggleViewSelected();
        await takeScreenshotByElement(
            reportFilterPanel.getAttributeElementFilterSubpanel(),
            'TC99643_07_02',
            'View selected elements'
        );
    });

    it('[TC99643_08] Scope filter - remove from dropzone', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportCustomer.id,
            projectId: reportConstants.SFReportCustomer.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportGridView.reportGrid.dismissTooltip();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_08_01',
            'default filter panel selections'
        );
        await reportTOC.switchToEditorPanel();
        await reportEditorPanel.removeAttributeInRowsDropZone(filterForCustomerCity);
        await reportTOC.switchToFilterPanel();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_08_02',
            'scope filters keeps the same'
        );
    });

    it('[TC99643_09] Scope filter - remove from dataset', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.SFReportGeography.id,
            projectId: reportConstants.SFReportGeography.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportToolbar.switchToDesignMode();
        await reportGridView.reportGrid.dismissTooltip();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_09_01',
            'default filter panel selections'
        );
        await reportDatasetPanel.removeItemInReportTab(filterForCallCenter);
        await reportTOC.switchToFilterPanel();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'TC99643_09_02',
            'remove the associated scope filter'
        );
    });
});
