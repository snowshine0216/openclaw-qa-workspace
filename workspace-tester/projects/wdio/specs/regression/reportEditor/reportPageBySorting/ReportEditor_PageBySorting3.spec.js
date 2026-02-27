import * as reportConstants from '../../../../constants/report.js';

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

    it('[TC85430] Regression test on page by sorting in report editor -- Consolidation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.DeveloperPBConsolidationSubcategory.id,
            projectId: reportConstants.DeveloperPBConsolidationSubcategory.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await since(
            'The current selection for page by selector "Seasons" is expected to be Winter, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Seasons'))
            .toContain('Winter');
        await reportPageBy.openSelectorContextMenu('Seasons');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Seasons');
        await since(
            'The current selection for column "Sort By" on row 1 in page by sorting dialog is expected to be Seasons, instead we have #{actual}'
        )
            .expect(await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Sort By', 'Seasons'))
            .toBeTruthy();
        await reportPageBySorting.clickBtn('Done');
        await reportPageBy.openDropdownFromSelector('Seasons');
        await since('The index of element "Winter" is expected to be 0 in page by selector, instead we have #{actual}')
            .expect(await reportPageBy.getElementFromPopupList('Winter'))
            .toBeTruthy();
        await reportPageBy.openSelectorContextMenu('Seasons');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(1, 'Order');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await since(
            'The current selection for column "Order" on row 1 in page by sorting dialog is expected to be Descending, instead we have #{actual}'
        )
            .expect(await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Order', 'Descending'))
            .toBeTruthy();
        await reportPageBySorting.clickBtn('Done');
        await reportPageBy.openDropdownFromSelector('Seasons');
        await since('The index of element "Fall" is expected to be 0 in page by selector, instead we have #{actual}')
            .expect(await reportPageBy.getElementFromPopupList('Fall'))
            .toBeTruthy();
        await reportPageBy.openSelectorContextMenu('Seasons');
        await reportGridView.clickContextMenuOption('Sort');
        await reportPageBySorting.openDropdown(1, 'Order');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await since(
            'The current selection for column "Order" on row 1 in page by sorting dialog is expected to be Descending, instead we have #{actual}'
        )
            .expect(await reportPageBySorting.getCurrentSelectionOnSortingColumnByRowAndCol(1, 'Order', 'Descending'))
            .toBeTruthy();
        await reportPageBySorting.clickBtn('Done');
        await reportPageBy.openDropdownFromSelector('Seasons');
        await since('The index of element "Fall" is expected to be 0 in page by selector, instead we have #{actual}')
            .expect(await reportPageBy.getElementFromPopupList('Fall'))
            .toBeTruthy();
    });
});
