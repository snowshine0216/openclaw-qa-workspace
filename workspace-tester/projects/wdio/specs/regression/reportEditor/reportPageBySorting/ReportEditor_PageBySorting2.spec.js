import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let { loginPage, libraryPage, reportToolbar, reportPageBy, reportGridView, reportPageBySorting } =
        browsers.pageObj1;

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

    it('[TC85430] Regression test on page by sorting in report editor -- Custom Group', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.DeveloperPBYearAscCustomCategoriesParentTop.id,
            projectId: reportConstants.DeveloperPBYearAscCustomCategoriesParentTop.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_1',
            'page_by_selector_year'
        );
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2014'), 'TC0000_2', 'element_2014');
        await reportPageBy.openDropdownFromSelector('Custom Categories');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Category Sales'),
            'TC0000_3',
            'element_category_sales'
        );
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('Total'), 'TC0000_4', 'element_total');
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Sort By'),
            'TC0000_5',
            'sort_by_year'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Sort By'),
            'TC0000_6',
            'sort_by_custom_categories'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(3, 'Placeholder'),
            'TC0000_7',
            'row_3_empty'
        );
        await reportPageBySorting.openDropdown(1, 'Order');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Order'),
            'TC0000_8',
            'order_descending'
        );
        await reportPageBySorting.openDropdown(1, 'Total Position');
        await reportPageBySorting.selectFromDropdown(1, 'Total Position', 'Bottom');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Total Position'),
            'TC0000_9',
            'total_position_bottom'
        );
        await reportPageBySorting.openDropdown(2, 'Total Position');
        await reportPageBySorting.selectFromDropdown(2, 'Total Position', 'Bottom');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Total Position'),
            'TC0000_10',
            'total_position_bottom_2'
        );
        await reportPageBySorting.openDropdown(2, 'Parent Position');
        await reportPageBySorting.selectFromDropdown(2, 'Parent Position', 'Default');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Parent Position'),
            'TC0000_11',
            'parent_position_default'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Sort By'),
            'TC0000_12',
            'sort_by_year_2'
        );
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2014'), 'TC0000_13', 'element_2014_2');
        await reportPageBy.openDropdownFromSelector('Custom Categories');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Category Sales'),
            'TC0000_14',
            'element_category_sales_2'
        );
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('Total'), 'TC0000_15', 'element_total_2');
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(1, 'Total Position');
        await reportPageBySorting.selectFromDropdown(1, 'Total Position', 'Top');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Total Position'),
            'TC0000_16',
            'total_position_top'
        );
        await reportPageBySorting.openDropdown(2, 'Total Position');
        await reportPageBySorting.selectFromDropdown(2, 'Total Position', 'Top');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Total Position'),
            'TC0000_17',
            'total_position_top_2'
        );
        await reportPageBySorting.openDropdown(2, 'Parent Position');
        await reportPageBySorting.selectFromDropdown(2, 'Parent Position', 'Bottom');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Parent Position'),
            'TC0000_18',
            'parent_position_bottom_2'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Sort By'),
            'TC0000_19',
            'sort_by_year_3'
        );
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(reportPageBy.getElementFromPopupList('2014'), 'TC0000_20', 'element_2014_3');
        await reportPageBy.openDropdownFromSelector('Custom Categories');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Category Sales'),
            'TC0000_21',
            'element_category_sales_3'
        );
        await reportPageBy.openSelectorContextMenu('Custom Categories');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(2, 'Criteria');
        await reportPageBySorting.selectFromDropdown(2, 'Criteria', 'Sort on Attribute ID');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Criteria'),
            'TC0000_22',
            'criteria_sort_on_attribute_id'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Sort By'),
            'TC0000_23',
            'sort_by_year_4'
        );
        await reportPageBy.openDropdownFromSelector('Custom Categories');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Category Sales'),
            'TC0000_24',
            'element_category_sales_4'
        );
        await reportPageBy.openSelectorContextMenu('Custom Categories');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(2, 'Order');
        await reportPageBySorting.selectFromDropdown(2, 'Order', 'Descending');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Order'),
            'TC0000_25',
            'order_descending_2'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Sort By'),
            'TC0000_26',
            'sort_by_year_5'
        );
        await reportPageBy.openDropdownFromSelector('Custom Categories');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Category Sales'),
            'TC0000_27',
            'element_category_sales_5'
        );
        await reportPageBy.openSelectorContextMenu('Custom Categories');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(2, 'Criteria');
        await reportPageBySorting.selectFromDropdown(2, 'Criteria', 'Inherit Attribute Sort');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Criteria'),
            'TC0000_28',
            'criteria_inherit_attribute_sort'
        );
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Sort By'),
            'TC0000_29',
            'sort_by_year_6'
        );
        await reportPageBy.openDropdownFromSelector('Custom Categories');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Category Sales'),
            'TC0000_30',
            'element_category_sales_6'
        );
    });
});
