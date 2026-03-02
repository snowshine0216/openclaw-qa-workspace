import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { executeOnSlowNetwork, ThrottleMode } from '../../../../api/mock/mock-network-throttle.js';

describe('Cancel report execution on consumption mode', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
        promptEditor,
        aePrompt,
        reportPage,
        reportGridView,
        reportToolbar,
        bookmark,
    } = browsers.pageObj1;
    const testUser = reportConstants.cancelReportExecutionUser;
    const libraryTitle = 'Library';

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

    it('[TC99427_01] Cancel initial execution', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await executeOnSlowNetwork(async () => {
            await libraryPage.openDossierNoWait(reportConstants.BigReportNoPrompt.name);
            await dossierPage.clickCancelExecutionButton();
        });
        await libraryPage.waitForCurtainDisappear();
        await since(
            '1. After click cancel execution button user should be landed on the library page, instead we have #{actual}'
        )
            .expect(await libraryPage.title())
            .toBe(libraryTitle);
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC99427_01', 'cancel execution on initial run');
    });

    it('[TC99427_02] Cancel initial execution on prompt report', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportWithPrompt,
        });
        await executeOnSlowNetwork(async () => {
            await libraryPage.openDossierNoWait(reportConstants.BigReportWithPrompt.name);
            await dossierPage.clickCancelExecutionButton();
        });
        await libraryPage.waitForCurtainDisappear();
        await since(
            '1. After click cancel execution button user should be landed on the library page, instead we have #{actual}'
        )
            .expect(await libraryPage.title())
            .toBe(libraryTitle);
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC99427_02',
            'cancel execution on prompt report'
        );
    });

    it('[TC99427_03] Cancel apply prompt on report', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportWithPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportWithPrompt.project.id,
            documentId: reportConstants.BigReportWithPrompt.id,
            prompt: true,
        });
        await promptEditor.runNoWait();
        await dossierPage.clickCancelExecutionButton();
        await since(
            '1. After click cancel execution button during apply prompt it should go back to prompt editor, instead prompt editor is not show'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        const year = await promptEditor.findPrompt('Year');
        const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(year);
        await since('2. Selected object list should be empty, instead we have #{actual}')
            .expect(selectedPrompts.length)
            .toBe(0);
        await promptEditor.closeEditor();
    });

    it('[TC99427_04] Cancel re-prompt', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportWithPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportWithPrompt.project.id,
            documentId: reportConstants.BigReportWithPrompt.id,
            prompt: true,
        });
        const yearPrompt = await promptEditor.findPrompt('Year');
        await aePrompt.shoppingCart.clickElmInAvailableList(yearPrompt, '2020');
        await aePrompt.shoppingCart.addSingle(yearPrompt);
        await promptEditor.run();
        await promptEditor.reprompt();
        await aePrompt.shoppingCart.addAll(yearPrompt);
        await promptEditor.runNoWait();
        await dossierPage.clickCancelExecutionButton();
        await since(
            '1. After click cancel execution button during apply prompt it should go back to prompt editor, instead prompt editor is not show'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(
            await promptEditor.findPrompt('Year')
        );
        await since('2. Selected object list should be #{expected}, instead we have #{actual}')
            .expect(selectedPrompts)
            .toEqual(['2020', '2021', '2022', '2023']);
        await promptEditor.closeEditor();
    });

    it('[TC99427_05] reset report and cancel', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportNoPrompt.project.id,
            documentId: reportConstants.BigReportNoPrompt.id,
        });
        await reportGridView.sortByOption('Cost', 'Sort All Values (Default)');
        // the first cell under column Cost
        await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$11,297');
        await dossierPage.resetDossierNoWait();
        await dossierPage.clickCancelExecutionButton();
        await since(
            '1. After click cancel execution button when reset user should be landed on the library page, instead we have #{actual}'
        )
            .expect(await libraryPage.title())
            .toBe(libraryTitle);
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC99427_05', 'cancel execution on initial run');
    });

    it('[TC99427_06] apply bookmark and cancel', async () => {
        const bookmarkName = 'TC99427_06 Base view';
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportNoPrompt.project.id,
            documentId: reportConstants.BigReportNoPrompt.id,
        });
        await reportGridView.sortByOption('Cost', 'Sort All Values (Default)');
        // the first cell under column Cost
        await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$11,297');
        await reportGridView.moveGridHeaderToPageBy('Year');
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmarkName, 'MY BOOKMARKS', { isWait: false });
        await bookmark.clickAndNoWait({ elem: bookmark.getContinueOnSaveDialog() });
        await dossierPage.clickCancelExecutionButton();
        await since(
            '1. User should be redirected to library page after cancel execution when apply bookmark, instead we have #{actual}'
        )
            .expect(await libraryPage.title())
            .toBe(libraryTitle);
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC99427_06', 'cancel execution on initial run');
    });

    it('[TC99427_07] cancel linking to target report no prompt', async () => {
        const linkName = 'Link 1 - report no prompt';
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportNoPrompt.project.id,
            documentId: reportConstants.BigReportNoPrompt.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
        await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
        // the first cell under column Revenue
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
        // open contextual link from column header Profit
        await executeOnSlowNetwork(async () => {
            await reportGridView.openContextualLinkFromCellByPos(1, 6, { linkName, isWait: false });
            await dossierPage.clickCancelExecutionButton();
        });
        await dossierPage.waitForCurtainDisappear();
        await since(
            '1. Keep manipulation on source thus the first cell of column Revenue should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 7))
            .toBe('$14,000');
    });

    it('[TC99427_08] cancel linking to target report with prompt', async () => {
        const linkName = 'Link  2 - prompt report';
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportNoPrompt.project.id,
            documentId: reportConstants.BigReportNoPrompt.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
        await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
        // the first cell under column Revenue
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
        // open contextual link from column header Profit
        await reportGridView.openContextualLinkFromCellByPos(1, 6, { linkName });
        await promptEditor.waitForEditor();
        const yearPrompt = await promptEditor.findPrompt('Year');
        await aePrompt.shoppingCart.addAll(yearPrompt);
        await promptEditor.runNoWait();
        await dossierPage.clickCancelExecutionButton();
        await promptEditor.waitForEditor();
        await since(
            '1. After click cancel execution button during apply prompt it should go back to prompt editor, instead prompt editor is not show'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(
            await promptEditor.findPrompt('Year')
        );
        await since('2. Selected object list should be #{expected}, instead we have #{actual}')
            .expect(selectedPrompts)
            .toEqual(['2020', '2021', '2022', '2023']);
        await promptEditor.closeEditor();
        await since(
            '3. Keep manipulation on source thus the first cell of column Revenue should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(1, 7))
            .toBe('$14,000');
    });

    it('[TC99427_09] cancel re-execute', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.openReportByUrl({
            projectId: reportConstants.BigReportNoPrompt.project.id,
            documentId: reportConstants.BigReportNoPrompt.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
        await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
        // the first cell under column Revenue
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
        await since('1. After sort undo button should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(true);
        await reportToolbar.clickAndNoWait({ elem: reportPage.getReExecuteButton() });
        await reportPage.clickCancelButtonInTopLoadingBar();
        await reportGridView.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('2. The first cell of column Revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 7))
            .toBe('$14,000');
        await since('3. After cancel re-execute the undo button should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled())
            .toBe(true);
    });
});
