import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportDatasetPanel,
        reportPageBy,
        reportGridView,
        reportEditorPanel,
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

    it('[TC85390] Acceptance test on page by sorting in report editor', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWS_PB_YearCategory2.id,
            projectId: reportConstants.ReportWS_PB_YearCategory2.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.selectItemInObjectList('Schema Objects');
        await reportDatasetPanel.selectItemInObjectList('Attributes');
        await reportDatasetPanel.selectItemInObjectList('Time');
        await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Year');
        await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC0000_1', 'attribute_year');
        // replace below 2 with assertion = 2014
        await takeScreenshotByElement(reportPageBy.getSelector('Year'), 'TC0000_2', 'page_by_selector_year');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_3',
            'page_by_selector_year_2014'
        );
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Geography');
        await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Region');
        await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC0000_4', 'attribute_region');
        // replace with assertion The current selection for page by selector "Region" should be "Central"
        await takeScreenshotByElement(reportPageBy.getSelector('Region'), 'TC0000_5', 'page_by_selector_region');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Region'),
            'TC0000_6',
            'page_by_selector_region_central'
        );
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_7', 'grid');
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2014'), 'TC0000_9', 'dropdown_year_2014');
        await reportPageBy.openDropdownFromSelector('Region');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Central'),
            'TC0000_10',
            'dropdown_region_central'
        );
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_11', 'page_by_sorting_dialog');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder'),
            'TC0000_12',
            'row_1_empty'
        );
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Year'),
            'TC0000_13',
            'sort_by_year'
        );
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Sort By', 'Year'),
            'TC0000_14',
            'dropdown_sort_by_year'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Sort By', 'Region'),
            'TC0000_15',
            'dropdown_sort_by_region'
        );
        await reportPageBySorting.openDropdown(1, 'Criteria');
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default'),
            'TC0000_16',
            'dropdown_criteria_default'
        );
        await reportPageBySorting.openDropdown(1, 'Criteria');
        await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Criteria', 'ID'),
            'TC0000_17',
            'criteria_id'
        );
        await reportPageBySorting.openDropdown(1, 'Order');
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Order', 'Ascending'),
            'TC0000_18',
            'dropdown_order_ascending'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Order', 'Descending'),
            'TC0000_19',
            'dropdown_order_descending'
        );
        await reportPageBySorting.openDropdown(1, 'Total Position');
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Total Position', 'Bottom'),
            'TC0000_20',
            'dropdown_total_position_bottom'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Total Position', 'Top'),
            'TC0000_21',
            'dropdown_total_position_top'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Total Position', 'Inherit'),
            'TC0000_22',
            'dropdown_total_position_inherit'
        );
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Region');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Region'),
            'TC0000_23',
            'sort_by_region'
        );
        await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'DESC');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Criteria', 'DESC'),
            'TC0000_24',
            'criteria_desc'
        );
        await reportPageBySorting.openDropdown(1, 'Criteria');
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Criteria', 'Default'),
            'TC0000_25',
            'dropdown_criteria_default'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Criteria', 'DESC'),
            'TC0000_26',
            'dropdown_criteria_desc'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getDropDownItem(1, 'Criteria', 'ID'),
            'TC0000_27',
            'dropdown_criteria_id'
        );
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
        await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Order', 'Descending'),
            'TC0000_28',
            'order_descending'
        );
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_29', 'page_by_sorting_dialog_2_rows');
        await reportPageBySorting.selectFromDropdown(2, 'Sort By', 'Region');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_30', 'page_by_sorting_dialog_3_rows');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(2, 'Sort By', 'Region'),
            'TC0000_31',
            'sort_by_region_row_2'
        );
        await reportPageBySorting.selectFromDropdown(2, 'Criteria', 'DESC');
        await reportPageBySorting.selectFromDropdown(2, 'Order', 'Descending');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(2, 'Order', 'Descending'),
            'TC0000_32',
            'order_descending_row_2'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_33', 'page_by_sorting_dialog_closed');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_34',
            'page_by_selector_year_2016'
        );
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Region'),
            'TC0000_35',
            'page_by_selector_region_web'
        );
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_36', 'grid_cell_1_0_2016_q1');
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2016'), 'TC0000_37', 'dropdown_year_2016');
        await reportPageBy.openDropdownFromSelector('Region');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('Web'), 'TC0000_38', 'dropdown_region_web');
        await reportPageBy.openSelectorContextMenu('Region');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_39', 'page_by_sorting_dialog');
        await reportPageBySorting.selectFromDropdown(2, 'Criteria', 'ID');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(2, 'Criteria', 'ID'),
            'TC0000_40',
            'criteria_id_row_2'
        );
        await reportPageBySorting.selectFromDropdown(2, 'Order', 'Ascending');
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(2, 'Order', 'Ascending'),
            'TC0000_41',
            'order_ascending_row_2'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_42', 'page_by_sorting_dialog_closed');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_43',
            'page_by_selector_year_2016'
        );
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Region'),
            'TC0000_44',
            'page_by_selector_region_northeast'
        );
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2016'), 'TC0000_45', 'dropdown_year_2016');
        await reportPageBy.openDropdownFromSelector('Region');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Northeast'),
            'TC0000_46',
            'dropdown_region_northeast'
        );
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.removeRow(1);
        await reportPageBySorting.removeRow(1);
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_47', 'page_by_sorting_dialog_1_row');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder'),
            'TC0000_48',
            'row_1_empty'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_49', 'page_by_sorting_dialog_closed');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_50',
            'page_by_selector_year_2014'
        );
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Region'),
            'TC0000_51',
            'page_by_selector_region_central'
        );
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2014'), 'TC0000_52', 'dropdown_year_2014');
        await reportPageBy.openDropdownFromSelector('Region');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Central'),
            'TC0000_53',
            'dropdown_region_central'
        );
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_54', 'page_by_sorting_dialog');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder'),
            'TC0000_55',
            'row_1_empty'
        );
    });
});
