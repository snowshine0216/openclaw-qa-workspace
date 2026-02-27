import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('MDX Report Filter', () => {
    let {
        loginPage,
        libraryPage,
        promptEditor,
        reportPage,
        reportTOC,
        reportToolbar,
        reportFilterPanel,
        reportFilter,
        reportGridView,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportMDXTestUser;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-6512_01] Drag unmapped mdx object into report filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Assets', 'Expenditures']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Average Rate',
            options: { isWait: false },
        });
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Less than');
        await reportFilterPanel.metricFilter.enterValue('0');
        await reportFilterPanel.metricFilter.done();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'BCIN-6512_01_01',
            'Report filter with unmapped MDX objects added'
        );
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, 'Expenditures');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 2 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6512_01_02',
            'Report grid view after applying filters with unmapped MDX objects'
        );
    });

    it('[BCIN-6512_02] Drag mapped mdx object into report filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinanceEmpty.id,
            projectId: reportConstants.mdxReportByCubeFinanceEmpty.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Date', 'Date.Fiscal Year']);
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Fiscal Year',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['FY 2002', 'FY 2003']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Metrics', 'Financial Reporting']);
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Cost',
            options: { isWait: false },
        });
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Greater than');
        await reportFilterPanel.metricFilter.enterValue('0');
        await reportFilterPanel.metricFilter.done();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'BCIN-6512_02_01',
            'Report filter with mapped MDX objects added'
        );
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, 'Revenue');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('1 Rows, 0 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6512_02_02',
            'Applying filters with mapped MDX objects'
        );
    });

    it('[BCIN-6512_03] No based on field when create or edit filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getFilterSubpanel(),
            'BCIN-6512_03_01',
            'Without based on field'
        );
        await reportFilterPanel.newQual.cancel();
        await reportFilterPanel.removeAllFilter({ isApply: false });
        await reportFilterPanel.openNewReportFiltersPanel();
        await takeScreenshotByElement(
            reportFilterPanel.getFilterSubpanel(),
            'BCIN-6512_03_02',
            'Only can drag objects'
        );
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            target: reportFilterPanel.newQual.getSearchbox(),
            options: { isWait: false },
        });
        await takeScreenshotByElement(
            reportFilterPanel.getFilterSubpanel(),
            'BCIN-6512_03_03',
            'Drag object to based on field'
        );
    });

    it('[BCIN-6512_04] limited operator for qualification filter on string', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            options: { isWait: false },
        });
        await reportFilterPanel.attributeFilter.clickQualifyOn();
        await reportFilterPanel.attributeFilter.selectAttributeFormOption('DESC');
        await reportFilterPanel.sleep(2000);
        await reportFilterPanel.attributeFilter.openOperatorDropdown();
        await takeScreenshotByElement(
            reportFilterPanel.attributeFilter.getAntDropdown(),
            'BCIN-6512_04_01',
            'Limited operator for qualification on string'
        );
    });

    it('[BCIN-6512_05] Qualification on attribute element in list', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Budget Variance', 'Actual', 'Budget']);
        await reportFilterPanel.newQual.done();
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Actual');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('20 Rows, 2 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6512_05_01',
            'Qualification on attribute element applied'
        );
    });

    it('[BCIN-6512_06] Qualification on attribute element not in list', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            options: { isWait: false },
        });
        await reportFilterPanel.attributeFilter.toggleElementListMode();
        await reportFilterPanel.selectElements(['Budget Variance %', 'Actual']);
        await reportFilterPanel.newQual.done();
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Budget');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('20 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_06_01', 'Qualified AE not in list');
    });

    it('[BCIN-6512_07] Qualification on attribute desc form', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.attributeFilter.toggleElementListMode();
        await reportFilterPanel.attributeFilter.clickQualifyOn();
        await reportFilterPanel.attributeFilter.selectAttributeFormOption('DESC');
        await reportFilterPanel.attributeFilter.openOperatorDropdown();
        await reportFilterPanel.attributeFilter.selectAttributeFormOperator('Equals');
        await reportFilterPanel.attributeFilter.enterValue('Expenditures');
        await reportFilterPanel.newQual.done();
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Budget Variance %');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('16 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_07_01', 'Qualified on attribute form');
    });

    it('[BCIN-6512_08] Qualification on metric with group by', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Cost',
            options: { isWait: false },
        });
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            target: reportFilterPanel.metricFilter.getGroupBySelector(),
            options: { isWait: false },
        });
        await reportFilterPanel.metricFilter.openSelector('Operator');
        await reportFilterPanel.metricFilter.selectOption('Greater than');
        await reportFilterPanel.metricFilter.enterValue('0');
        await reportFilterPanel.metricFilter.done();
        await reportFilterPanel.sleep(3000);
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'BCIN-6512_08_01',
            'Metric filter with group by added'
        );
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Budget Variance %');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('16 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_08_02', 'Metric filter with group by');
    });

    it('[BCIN-6512_09] Group by same attribute when create new filter', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportSAPWithFilter.id,
            projectId: reportConstants.mdxReportSAPWithFilter.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_09_01', 'Default report filters');
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Call Center',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Atlanta', 'San Diego']);
        await reportFilterPanel.newQual.done();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_09_02', 'Add attribute filter');
        await reportFilterPanel.sleep(3000);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'USA');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('2 Rows, 1 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_09_03', 'Attribute filter applied');
    });

    it('[BCIN-6512_10] Add other attribute to report filter ', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportSAPWithFilter.id,
            projectId: reportConstants.mdxReportSAPWithFilter.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Distribution Center',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Seattle', 'Miami']);
        await reportFilterPanel.newQual.done();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'BCIN-6512_10_01',
            'Add another attribute to filter'
        );
        await reportFilterPanel.sleep(3000);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, 'Seattle');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_10_02', 'filter applied');
    });

    it('[BCIN-6512_11] Add same attributes to report filter AND -> OR ', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Revenue']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Assets']);
        await reportFilterPanel.newQual.done();
        await takeScreenshotByElement(
            reportFilterPanel.getContainer(),
            'BCIN-6512_11_01',
            'Same attributes by AND operator'
        );
        await reportFilterPanel.sleep(3000);
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.waitForStatusBarText('0 Rows');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('0 Rows, 0 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_11_01', 'AND operator applied');
        await reportFilter.openGroupOperator();
        await reportFilter.selectGroupOperator('OR');
        await reportFilterPanel.clickFilterApplyButton();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, 'Revenue');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_11_02', 'OR operator applied');
        await reportFilter.NOTGroupFilter();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_11_03', 'NOT grouped filter');
        await reportFilterPanel.clickFilterApplyButton();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, 'Expenditures');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_11_04', 'Not group filter applied');
    });

    it('[BCIN-6512_12] group filters', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Revenue', 'Assets']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Revenue', 'Assets', 'Flow']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Account Type',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Revenue']);
        await reportFilterPanel.newQual.done();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_12_01', 'Before grouping filters');
        await reportFilter.groupFilter();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_12_02', 'After grouping filters');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, 'Revenue');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('16 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_12_03', 'Grouped filter applied');
    });

    it('[BCIN-6512_13] ungroup filters', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Actual', 'Budget', 'Forecast', 'Budget Variance']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Budget Variance']);
        await reportFilterPanel.newQual.done();
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: 'Scenario',
            options: { isWait: false },
        });
        await reportFilterPanel.selectElements(['Budget', 'Forecast', 'Actual']);
        await reportFilterPanel.newQual.done();
        await reportFilter.openGroupOperator();
        await reportFilter.selectGroupOperator('OR');
        await reportPage.sleep(2000);
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_13_01', 'Before ungrouping filters');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(21, 0, 'Forecast');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('30 Rows, 2 Columns');
        await reportFilter.ungroupFilter();
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_13_02', 'After ungrouping filters');
        await reportFilterPanel.clickFilterApplyButton();
        await reportDatasetPanel.waitForStatusBarText('0 Rows, 0 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_13_03', 'Report authoring container');
    });

    it('[BCIN-6512_14] delete filters', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportSAPWithFilter.id,
            projectId: reportConstants.mdxReportSAPWithFilter.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        const inlineFilterForCountry = reportFilter.findInlineFilterItem({
            expType: reportConstants.reportFilterType.attrQualification,
            objectName: 'Country',
        });
        await inlineFilterForCountry.openContextMenu();
        await reportFilter.selectContextMenuOption('Delete');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_14_01', 'After deleting filters');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'USA');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6512_14_02', 'After applying filters');
    });

    it('[BCIN-6512_15] adding prompt to report filter', async () => {
        const aePromptForYear = 'Select Year';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.searchObject(aePromptForYear);
        await reportDatasetPanel.objectBrowser.clickFilterByCategory({ name: 'Prompt' });
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: aePromptForYear,
            options: { isWait: false },
        });
        await reportDatasetPanel.dndFromObjectBrowserToReportFilters({
            objectName: aePromptForYear,
            options: { isWait: false },
        });
        await reportPage.clickReportTitle();
        await reportPage.sleep(3000);
        await takeScreenshotByElement(reportFilterPanel.getContainer(), 'BCIN-6512_15_01', 'group prompts');
        await reportToolbar.switchToDesignMode(true);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'BCIN-6512_15_02', 'prompt editor');
    });
});
