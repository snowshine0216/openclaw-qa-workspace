import * as reportConstants from '../../../../constants/report.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Undo/Redo Functionality In Consumption Mode', () => {
    let { libraryPage, reportPageBy, reportGridView, reportToolbar, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.undoUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97485_01] FUN | Report Editor | Undo/Redo for page by manipulation in Report Consumption', async () => {
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.threshold,
        });

        // await libraryPage.openUrl(reportConstants.threshold.project.id, reportConstants.threshold.id);
        // await libraryPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await libraryPage.openReportByUrl({
            projectId: reportConstants.threshold.project.id,
            documentId: reportConstants.threshold.id,
        });

        // Check initial state - Undo/Redo should be disabled
        await since('Undo button should be disabled initially, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled())
            .toBe(true);
        await since('Redo button should be disabled initially, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled())
            .toBe(true);

        // ACTION 1: RMC on category header and move it to page by
        await reportGridView.moveGridHeaderToPageBy('Category');
        // Verify Undo is now enabled and Redo is disabled
        await since('Undo button should be enabled after adding an attribute, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(true);
        await since('Redo button should be disabled after adding an attribute, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled())
            .toBe(true);

        // ACTION 2: sort Subcategory in ascending order
        await reportGridView.sortAscending('Subcategory');

        // ACTION 3: change pagey from Books to Movies
        await reportPageBy.changePageByElement('Category', 'Music');
        // Now undo all 3 actions and verify

        // UNDO ACTION 3: change pagey from Music to Books
        await reportToolbar.clickUndo();
        await since('UNDO 1st: The pagey should be changed from Music to Books, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');
        // verify the Subcategory is sorted in ascending order
        await since('UNDO 1st: The Subcategory should be sorted in ascending order, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Books - Miscellaneous');
        // verify redo is enabled
        await since('UNDO 1st: Redo button should be enabled after undo once, instead we have #{actual}')
            .expect(await reportToolbar.isRedoEnabled())
            .toBe(true);

        // UNDO ACTION 2: sort Subcategory in ascending order
        await reportToolbar.clickUndo();
        // Verify the column is not sorted
        await since('UNDO 2nd: The Subcategory should not be sorted in ascending order, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Business');

        // UNDO ACTION 1: move column header to page by
        await reportToolbar.clickUndo();
        // Verify the category is moved to rows
        await since('UNDO 3rd: Category should be moved to rows, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        // verify undo  is disabled
        await since('UNDO 3rd: Undo button should be disabled after undo once, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled())
            .toBe(true);
        // Now redo all 3 actions
        await reportToolbar.clickRedo();
        await since('REDO 1st: The Category should be moved to page, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Books');
        // verify undo is enabled
        await since('REDO 1st: Undo button should be enabled after redo once, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(true);
        // redo action 2
        await reportToolbar.clickRedo();
        await since('REDO 2nd: The Subcategory should be sorted in ascending order, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Books - Miscellaneous');
        // redo action 3
        await reportToolbar.clickRedo();
        await since('REDO 3rd: The page by should be changed from Books to Music, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Music');
        // verify redo is disabled
        await since('REDO 3rd: Redo button should be disabled after redo all actions, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled())
            .toBe(true);
    });

    it('[TC97485_02] FUN | Report Editor | Undo/Redo for remove manipulation in Report Consumption', async () => {
        // Open a report with linking
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.threshold,
        });

        // await libraryPage.openUrl(reportConstants.threshold.project.id, reportConstants.threshold.id);
        // await libraryPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await libraryPage.openReportByUrl({
            projectId: reportConstants.threshold.project.id,
            documentId: reportConstants.threshold.id,
        });

        // ACTION 1: Hide All Thresholds for Category
        await reportGridView.hideAllThresholds('Category');

        // Action 2: Move Category to Columns
        await reportGridView.moveColumnHeaderToColumns('Category');

        // Action 3: remove Sucategory
        await reportGridView.removeObject('Subcategory');

        // Action 4: show Totals for Category
        await reportGridView.showTotalsForObject('Category');

        // Now undo all 4 actions
        // UNDO Action 4: show Totals for Category
        await reportToolbar.clickUndo();
        await since('UNDO 4th: Totals for Category should be removed, instead we have #{actual}')
            .expect(await reportGridView.isGridCellDisplayed(0, 9))
            .toBe(false);

        // UNDO Action 3: remove subcategory
        await reportToolbar.clickUndo();
        await since('UNDO 3rd: Subcategory should be back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Subcategory');

        // UNDO Action 2: Move Category to Columns
        await reportToolbar.clickUndo();
        await since('UNDO 2nd: Category should be back to columns, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        // UNDO Action 1: Hide All Thresholds for Category
        await reportToolbar.clickUndo();
        await since('UNDO 1st: threshold should be back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'color'))
            .toBe('rgba(0,0,255,1)');

        // Now redo all 4 actions
        // REDO ACTION 1: hide threshold for Category
        await reportToolbar.clickRedo();
        await since('REDO 1st: Threshold for Category should be hidden, instead we have #{actual}')
            .expect(await reportGridView.getGridCellStyleByPos(1, 0, 'color'))
            .toBe('rgba(0,0,0,1)');

        // REDO Action 2:  Move Category to Columns
        await reportToolbar.clickRedo();
        await since('REDO 2nd: Category should be moved to columns, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Books');

        // REDO Action 3: remove Sucategory
        await reportToolbar.clickRedo();
        await since('REDO 3rd: Subcategory should be removed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('');

        // REDO Action 4: show Totals for Category
        await reportToolbar.clickRedo();
        await since('REDO 4th: Totals for Category should be shown, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 9))
            .toBe('Total');
    });

    it('[TC97485_03] FUN | Report Editor | Undo/Redo for other manipulations in Report Consumption', async () => {
        // should cover add attributes, resize column, number format
        const COLUMN_RESIZE_OFFSET = 25;
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.SubsetReportFromTimeProductRegionCube,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.SubsetReportFromTimeProductRegionCube.project.id,
            documentId: reportConstants.SubsetReportFromTimeProductRegionCube.id,
        });

        // ACTION 1: add attributes After Category
        await reportGridView.addAttributesBefore('Category', ['Month', 'Subcategory']);

        // ACTION 2: change number format of Cost to Fixed
        await reportGridView.changeNumberFormat('Cost', 'Fixed');

        // ACTION 3: resize column of Region to 25 larger
        await browser.pause(reportConstants.sleepTimeForUndoRedo); // add wait time for the column to be resized
        // const columnWidthInt = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        await reportGridView.resizeColumnByMovingBorder(1, COLUMN_RESIZE_OFFSET, 'right');
        const columnWidthResizeInt = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));

        // ACTION 4: update display attribute forms of Category to Form name only
        await reportGridView.updateShowAttributeFormName('Category', 'Form name only');

        // Now undo all 4 actions
        // UNDO ACTION 4: update display attribute forms of Category to Form name only
        await reportToolbar.clickUndo();
        await since(
            'UNDO 4th: Display attribute forms of Category should be updated to Form name only, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Category');

        // UNDO ACTION 3: resize column of Cost to 25 larger
        await reportToolbar.clickUndo();
        const columnWidthIntUndo = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        await since('UNDO 3rd: Column of Cost should be resized to #{expected}, instead we have #{actual}')
            .expect(columnWidthIntUndo)
            .toBe(columnWidthResizeInt - COLUMN_RESIZE_OFFSET);

        // UNDO ACTION 2: change number format of Cost to Fixed
        await reportToolbar.clickUndo();
        await since('UNDO 2nd: Number format of Cost should be changed to Fixed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$1,015');

        // UNDO ACTION 1: add attributes After Category
        await reportToolbar.clickUndo();
        await since('UNDO 1st: Attributes should be added after Category, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // REDO ACTION 1: add attributes After Category ---- 0,3 Subcategory
        await reportToolbar.clickRedo();
        await since('REDO 1st: Month should be added, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Month');
        await since('REDO 1st: Subcategory should be added, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Subcategory');

        // REDO ACTION 2: change number format of Cost to Fixed
        await reportToolbar.clickRedo();
        await since('REDO 2nd: Number format of Cost should be changed to Fixed, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('1,014.68');

        // REDO ACTION 3: resize column of Cost to 25 larger
        await reportToolbar.clickRedo();
        const columnWidthResizeIntUndo = parseInt(await reportGridView.getGridCellStyleByPos(0, 1, 'width'));
        await since('REDO 3rd: Column of Cost should be resized to #{expected}, instead we have #{actual}')
            .expect(columnWidthResizeIntUndo)
            .toBe(columnWidthResizeInt);

        // REDO ACTION 4: update display attribute forms of Category to Form name only
        await reportToolbar.clickRedo();
        await since(
            'REDO 4th: Display attribute forms of Category should be updated to Form name only, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('ID');
    });
});
