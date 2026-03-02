import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportDatasetPanel,
        reportEditorPanel,
        reportPageBy,
        reportPageBySorting,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Attribute Forms', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWS_PB_YearCategory2.id,
            projectId: reportConstants.ReportWS_PB_YearCategory2.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_1', 'grid');
        await reportDatasetPanel.selectItemInObjectList('Schema Objects');
        await reportDatasetPanel.selectItemInObjectList('Attributes');
        await reportDatasetPanel.selectItemInObjectList('Geography');
        await reportDatasetPanel.addObjectToreportPageBy('Employee');
        await takeScreenshotByElement(reportEditorPanel.pageByDropzone, 'TC0000_2', 'attribute_employee');
        await reportPageBy.getSelector('Employee');
        await reportPageBy.getSelectorPulldownTextBox('Employee');
        await reportPageBy.openSelectorContextMenu('Employee');
        await reportPageBySorting.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_3', 'sorting_dialog');
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Employee');
        await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Employee');
        await reportPageBySorting.openDropdown(1, 'Criteria');
        await reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default');
        await reportPageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_4', 'sorting_dialog_closed');
        await reportEditorPanel.openObjectContextMenu('reportPageBy', 'attribute', 'Employee');
        await reportDatasetPanel.clickObjectContextMenuItem('Display Attribute Forms');
        await reportDatasetPanel.clickDefaultFormCheckBox();
        await reportDatasetPanel.clickReportObjectsForms(['First Name']);
        await reportDatasetPanel.clickButton('Done');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Employee'),
            'TC0000_5',
            'page_by_selector_employee'
        );
        await reportPageBy.openSelectorContextMenu('Employee');
        await reportPageBySorting.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_6', 'sorting_dialog');
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Employee');
        await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Employee');
        await reportPageBySorting.openDropdown(1, 'Criteria');
        await reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default');
        await reportPageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_7', 'sorting_dialog_closed');
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.removeObjectFromReport('Employee');
        await takeScreenshotByElement(reportEditorPanel.pageByDropzone, 'TC0000_8', 'attribute_employee_removed');
        // await reportDatasetPanel.switchToAllTab();
        await reportDatasetPanel.addObjectToreportPageBy('Distribution Center');
        await takeScreenshotByElement(reportEditorPanel.pageByDropzone, 'TC0000_9', 'attribute_distribution_center');
        await reportPageBy.getSelector('Distribution Center');
        await reportPageBy.openSelectorContextMenu('Distribution Center');
        await reportPageBySorting.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_10', 'sorting_dialog');
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Distribution Center');
        await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Distribution Center');
        await reportPageBySorting.openDropdown(1, 'Criteria');
        await reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default');
        await reportPageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_11', 'sorting_dialog_closed');
    });
});
