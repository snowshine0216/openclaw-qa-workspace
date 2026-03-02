import * as reportConstants from '../../../../constants/report.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor Undo/Redo Functionality In Consumption Mode With Clear Stack', () => {
    let { libraryPage, reportGridView, reportToolbar, loginPage, reportPromptEditor, promptEditor, reportPageBy } =
        browsers.pageObj1;

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

    it('[TC97485_04] FUN | Report Editor | Undo/Redo stack should be cleared after linking and back', async () => {
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.LinkForCost,
        });

        // await libraryPage.openUrl(reportConstants.LinkForCost.project.id, reportConstants.LinkForCost.id);
        // await libraryPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await libraryPage.openReportByUrl({
            projectId: reportConstants.LinkForCost.project.id,
            documentId: reportConstants.LinkForCost.id,
        });

        // ACTION 1:Sort for Cost in ascending order
        await reportGridView.sortAscendingBySortIcon('Profit');

        // ACTION 2: Navigate through a link (will need to identify a link in the report to click)
        await reportGridView.clickGridColumnHeader('Cost');

        // ACTION 3: In target report, sort for Cost in ascending order
        await reportGridView.sortDescendingBySortIcon('Cost');

        // click undo button
        await reportToolbar.clickUndo();

        // verify the Cost is sorted in ascending order
        await since('The sort on Cost should be cleared  , instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$2,070,816');

        // click redo button
        await reportToolbar.clickRedo();

        // verify the Cost is sorted in descending order
        await since('The sort on Cost should be in descending order, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$20,101,700');

        // click back button
        await reportToolbar.clickBack();

        // verify the undo button is disabled
        await since('Undo button should be disabled after clicking back, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled())
            .toBe(true);

        // verify the redo button is disabled
        await since('Redo button should be disabled after clicking back, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled())
            .toBe(true);

        // clear sort on Cost
        await reportGridView.clearSortBySortIcon('Profit');

        // verify the undo button is enabled
        await since('Undo button should be enabled after clearing sort on Cost, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(true);

        // click undo button
        await reportToolbar.clickUndo();

        // verify the Cost is sorted in ascending order
        await since('The sort on Profit should be in ascending order, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$110,655');

        // click redo button
        await reportToolbar.clickRedo();

        // verify the sort on Cost is cleared
        await since('The sort on Profit should be cleared, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$157,963');
    });

    it('[TC97485_05] FUN | Report Editor | Undo/Redo stack should be cleared after reprompt', async () => {
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.ObjectPromptSelectAnAttributesPrompted,
        });

        await libraryPage.openReportByUrl({
            projectId: reportConstants.ObjectPromptSelectAnAttributesPrompted.project.id,
            documentId: reportConstants.ObjectPromptSelectAnAttributesPrompted.id,
            prompt: true,
        });
        // // click on reset button
        // await reportToolbar.clickReset(true);

        // // When I double click available object "Year" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        // await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Year');

        // // And I double click available object "Region" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        // await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Region');
        // // And I double click available object "Category" in "Choose from a list of attributes." section with index "1." in prompt editor in Report Editor
        // await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Category');
        await reportPromptEditor.chooseItemsInAvailableCart(1, 'Choose from a list of attributes.', [
            'Year',
            'Quarter',
            'Category',
        ]);

        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // move year to page by
        await reportGridView.moveGridHeaderToPageBy('Year');

        // Trigger reprompt
        await promptEditor.reprompt();

        // remove category
        await reportPromptEditor.doubleClickSelectedItem(1, 'Choose from a list of attributes.', 'Category');

        // select su
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Choose from a list of attributes.', 'Subcategory');
        // When I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // Verify Undo stack is cleared - Undo button should be disabled
        await since('Undo button should be disabled after reprompt, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled())
            .toBe(true);
        await since('Redo button should be disabled after reprompt, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled())
            .toBe(true);

        // move year to page by
        await reportGridView.moveGridHeaderToPageBy('Year');

        // click undo
        await reportToolbar.clickUndo();

        // DE319488

        // // verify the year is sorted in ascending order
        // await since('The year should be sorted in ascending order, instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(1, 1))
        //     .toBe('2014');

        // click redo
        await reportToolbar.clickRedo();

        // verify the year is sorted in ascending order
        await since('After click redo, report page by for year is still there, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Year'))
            .toBe('2014');
    });

    it('[TC97485_06] FUN | Report Editor | Undo/Redo stack should not be cleared after drill on subset report', async () => {
        // Open a report to work with
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.SubsetReportFromTimeProductRegionCube,
        });

        // await libraryPage.openUrl(
        //     reportConstants.SubsetReportFromTimeProductRegionCube.project.id,
        //     reportConstants.SubsetReportFromTimeProductRegionCube.id
        // );
        // await libraryPage.loadingDialog.waitForReportLoadingIsNotDisplayed();

        await libraryPage.openReportByUrl({
            projectId: reportConstants.SubsetReportFromTimeProductRegionCube.project.id,
            documentId: reportConstants.SubsetReportFromTimeProductRegionCube.id,
        });

        // remove year
        await reportGridView.removeObject('Year');

        // drill Region to Time to Year
        await reportGridView.drillToItem('Region', ['Time', 'Year']);

        // verify the undo button is enabled
        await since('Undo button should be enabled after drilling, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(true);

        // click undo
        await reportToolbar.clickUndo();

        // year should be gone
        await since('After clicking undo, year should be gone, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // click redo
        await reportToolbar.clickUndo();

        // year should be back
        await since('After clicking undo, year should be back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');

        // click redo
        await reportToolbar.clickRedo();

        // year should be gone
        await since('After clicking redo, year should be gone, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region');

        // click undo
        await reportToolbar.clickUndo();

        // year should be back
        await since('After clicking undo, year should be back, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
    });

    it('[TC97485_07] FUN | Report Editor | Undo/Redo stack should  be cleared after drill on normal report', async () => {
        // Open a report to work with
        await resetReportState({
            credentials: reportConstants.undoUser,
            report: reportConstants.SimpleReport,
        });

        // await libraryPage.openUrl(reportConstants.SimpleReport.project.id, reportConstants.SimpleReport.id);
        // await libraryPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await libraryPage.openReportByUrl({
            projectId: reportConstants.SimpleReport.project.id,
            documentId: reportConstants.SimpleReport.id,
        });

        // show totals on year
        await reportGridView.showTotalsForObject('Year');

        // drill on Category to Subcategory
        await reportGridView.drillToItem('Category', ['Subcategory']);

        // verify the undo button is enabled
        await browser.pause(reportConstants.sleepTimeForUndoRedo);
        await since('Undo button should be disabled after drilling, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(false);

        // move total to top and then hide total
        await reportGridView.moveTotalToTop();
        await reportGridView.hideTotals();

        // click undo
        await reportToolbar.clickUndo();

        // verify the total is shown
        await since('After clicking undo, total should be shown, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');

        // click undo
        await reportToolbar.clickUndo();

        // verify the total is moved down
        await since('After clicking undo, total should be moved down, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        await since('After clicking undo, total should be moved down, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(9, 2))
            .toBe('Total');

        // click redo
        await reportToolbar.clickRedo();

        // verify the total is hidden
        await since('After clicking Redo, total should be hidden, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');

        // click redo
        await reportToolbar.clickRedo();

        // verify the total is moved down
        await since('After clicking Redo, total should be moved down, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');

        // go back
        await reportToolbar.clickBack();

        // verify the undo button is disabled
        await since('Undo button should be disabled after going back, instead we have #{actual}')
            .expect(await reportToolbar.isUndoDisabled())
            .toBe(true);

        // verify the redo button is disabled
        await since('Redo button should be disabled after going back, instead we have #{actual}')
            .expect(await reportToolbar.isRedoDisabled())
            .toBe(true);
        // move total to top and hide total
        await reportGridView.moveTotalToTop();
        await reportGridView.hideTotals();

        // click undo
        await reportToolbar.clickUndo();

        // verify the total is shown
        await since('After clicking undo, total should be shown, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');

        // click undo
        await reportToolbar.clickUndo();

        // verify the total is hidden
        await since('After clicking undo, total should be hidden, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');
        await since('After clicking undo, total should be hidden, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(9, 2))
            .toBe('Total');

        // click redo
        await reportToolbar.clickRedo();

        // verify the total is shown
        await since('After clicking Redo, total should be shown, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');

        // click redo
        await reportToolbar.clickRedo();

        // verify the total is shown
        await since('After clicking Redo, total should be shown, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');
    });

    it('[TC97485_08] FUN | Report Editor | Undo/Redo stack should  be cleared after re-execute', async () => {
        await libraryPage.openReportByUrl({
            dossierId: reportConstants.LinkForCost.id,
            projectId: reportConstants.LinkForCost.project.id,
        });

        await reportGridView.sortAscendingBySortIcon('Profit');

        await reportGridView.enableDisplayAttributeForms('Region');

        const buttonDisabled = (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since(
            'After update enable attribute forms, the undo/redo button should be disabled, instead we have #{actual}'
        )
            .expect(buttonDisabled)
            .toBe(true);

        await reportGridView.updateShowAttributeFormName('Region', 'On');
        await reportToolbar.clickUndo();
        await since('After click undo, grid cell at 0, 1 should have text #{expected    } instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');

        await reportToolbar.clickRedo();
        await since('After click redo, grid cell at 0, 1 should have text #{expected} instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region DESC');

        await reportToolbar.reExecute();
        const buttonDisabled2 =
            (await reportToolbar.isUndoDisabled(true)) && (await reportToolbar.isRedoDisabled(true));
        await since('After re-execute, the undo/redo button should be disabled, instead we have #{actual}')
            .expect(buttonDisabled2)
            .toBe(true);
    });
});
