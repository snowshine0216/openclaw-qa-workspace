import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportPageBy,
        reportGridView,
        reportEditorPanel,
        reportDatasetPanel,
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

    it('[TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Quick Sorting', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWS_PB_YearCategory1.id,
            projectId: reportConstants.ReportWS_PB_YearCategory1.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_1',
            'page_by_selector_year_2014'
        );
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder'),
            'TC0000_2',
            'page_by_sorting_dialog'
        );
        await reportPageBySorting.clickBtn('Cancel');
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
        await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_3',
            'page_by_selector_year_2016'
        );
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_4', 'grid_cell_1_2');
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('2016'),
            'TC0000_5',
            'dropdown_list_year_2016'
        );
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Placeholder'),
            'TC0000_6',
            'page_by_sorting_dialog_2'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Year'),
            'TC0000_7',
            'current_selection_sort_by_year'
        );
        await reportPageBySorting.clickBtn('Cancel');
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
        await reportDatasetPanel.clickObjectContextMenuItem('Sort Ascending');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_8',
            'page_by_selector_year_2014'
        );
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Category'),
            'TC0000_9',
            'page_by_selector_category_books'
        );
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_10', 'grid_cell_1_2_books');
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('2014'),
            'TC0000_11',
            'dropdown_list_year_2014'
        );
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Placeholder'),
            'TC0000_12',
            'page_by_sorting_dialog_3'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Year'),
            'TC0000_13',
            'current_selection_sort_by_year_2'
        );
        await reportPageBySorting.clickBtn('Cancel');
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Year');
        await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Year'),
            'TC0000_14',
            'page_by_selector_year_2016_2'
        );
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Category');
        await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
        await takeScreenshotByElement(
            reportPageBy.getSelectorPulldownTextBox('Category'),
            'TC0000_15',
            'page_by_selector_category_music'
        );
        await reportPageBy.openDropdownFromSelector('Category');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Music'),
            'TC0000_16',
            'dropdown_list_category_music'
        );
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('Books'),
            'TC0000_17',
            'dropdown_list_category_books'
        );
        await reportPageBy.openDropdownFromSelector('Year');
        await takeScreenshotByElement(
            reportPageBy.getElementFromPopupList('2014'),
            'TC0000_18',
            'dropdown_list_year_2014_2'
        );
        await reportPageBy.openSelectorContextMenu('Category');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(
            reportPageBySorting.getSortingColumnByRowAndCol(2, 'Placeholder'),
            'TC0000_19',
            'page_by_sorting_dialog_4'
        );
        await takeScreenshotByElement(
            reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Category'),
            'TC0000_20',
            'current_selection_sort_by_category'
        );
        await reportPageBySorting.clickBtn('Cancel');
    });
});
