import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportPageBy,
        reportGridView,
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

    it('[TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Metrics in Page By, Encoding and Truncation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.DeveloperPBMetrics.id,
            projectId: reportConstants.DeveloperPBMetrics.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await since(
            'The current selection for page by selector "Metrics" is expected to be Profit Margin, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toContain('Profit Margin');
        await reportPageBy.changePageByElement('Year', '2015');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_1', 'grid');
        await reportPageBy.openDropdownFromSelector('Year');
        await since('The index of element "2014" is expected to be 0, instead we have #{actual}')
            .expect(await reportPageBy.getElementFromPopupList('2014'))
            .toBe(0);
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_2', 'sorting_dialog');
        await since('Row 1 is expected to be empty, instead we have #{actual}')
            .expect(await reportPageBySorting.getSortingColumnByRowAndCol(1, 'Placeholder'))
            .toContain('Select an object');
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await since('Option "Year" is expected to be available, instead we have #{actual}')
            .expect(await reportPageBySorting.getDropDownItem(1, 'Sort By', 'Year'))
            .toBeTruthy();
        await since('Option "Metrics" is not expected to be available, instead we have #{actual}')
            .expect(await reportPageBySorting.getDropDownItem(1, 'Sort By', 'Metrics'))
            .toBeFalsy();
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
        await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await since(
            'The current selection for column "Order" on row 1 is expected to be Descending, instead we have #{actual}'
        )
            .expect(await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Order', 'Descending'))
            .toBeTruthy();
        await reportPageBySorting.clickBtn('Done');
        await since(
            'The current selection for page by selector "Metrics" is expected to be Profit Margin, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toContain('Profit Margin');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_4', 'grid');
        await reportPageBy.openDropdownFromSelector('Year');
        await since('The index of element "2016" is expected to be 0, instead we have #{actual}')
            .expect(await reportPageBy.getElementFromPopupList('2016'))
            .toBe(0);
        await reportPageBy.openSelectorContextMenu('Year');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_5', 'sorting_dialog');
        await reportPageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_6', 'sorting_dialog_closed');
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.renameObjectInReportTab('Year', 'Year&');
        await since(
            'The current selection for page by selector "Year&" is expected to be 2015, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Year&'))
            .toContain('2015');
        await reportPageBy.openSelectorContextMenu('Year&');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_7', 'sorting_dialog');
        await since(
            'The current selection for column "Sort By" on row 1 is expected to be Year&, instead we have #{actual}'
        )
            .expect(await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Year&'))
            .toBeTruthy();
        await reportPageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_8', 'sorting_dialog_closed');
        await reportDatasetPanel.renameObjectInReportTab('Year&', 'Year with very long name');
        await since(
            'The current selection for page by selector "Year with very long name" is expected to be 2015, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Year with very long name'))
            .toContain('2015');
        await reportPageBy.openSelectorContextMenu('Year with very long name');
        await reportGridView.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_9', 'sorting_dialog');
        await since(
            'The current selection for column "Sort By" on row 1 is expected to be Year with very long name, instead we have #{actual}'
        )
            .expect(await  await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(
                    1,
                    'Sort By',
                    'Year with very long name'
                )
            )
            .toBeTruthy();
        await since('The max width of sort by object text on row 1 is expected to be 91px, instead we have #{actual}')
            .expect(await reportPageBySorting.getSortByObjectText(1).getCSSProperty('max-width'))
            .toBe('91px');
        await reportPageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_10', 'sorting_dialog_closed');
    });
});
