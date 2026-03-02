import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import resetReportState from '../../../../api/reports/resetReportState.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { executeOnSlowNetwork, ThrottleMode } from '../../../../api/mock/mock-network-throttle.js';

describe('Cancel report execution on authoring mode', () => {
    let { loginPage, libraryPage, dossierPage, promptEditor, aePrompt, reportPage, reportGridView, reportToolbar } =
        browsers.pageObj1;
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

    it('[TC99428_01] cancel when resume data', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.BigReportNoPrompt.id,
            projectId: reportConstants.BigReportNoPrompt.project.id,
        });
        await since(`1. The report should be in pause mode, instead we have #{actual}`)
            .expect(await reportPage.isInPauseMode())
            .toBe(true);
        await executeOnSlowNetwork(async () => {
            await reportToolbar.actionOnToolbar('resume', { isWait: false });
            await reportPage.clickCancelButtonInTopLoadingBar({ isWait: true });
        });
        await since(`2. The report should still be in pause mode after cancel resume data, instead we have #{actual}`)
            .expect(await reportPage.isInPauseMode())
            .toBe(true);
    });

    // disable it due to instability
    xit('[TC99428_02] cancel when resume data on prompt report before prompt', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportWithPrompt,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.BigReportWithPrompt.id,
            projectId: reportConstants.BigReportWithPrompt.project.id,
        });
        await since(`1. The report should be in pause mode, instead we have #{actual}`)
            .expect(await reportPage.isInPauseMode())
            .toBe(true);
        await executeOnSlowNetwork(async () => {
            await reportToolbar.actionOnToolbar('resume', { isWait: false });
            await reportPage.clickCancelButtonInTopLoadingBar();
        }, ThrottleMode.Regular2G);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportPage.waitForElementVisible(reportPage.getGridViewSectionInPauseMode());
        await since(`2. The report should still be in pause mode after cancel resume data, instead we have #{actual}`)
            .expect(await reportPage.isInPauseMode())
            .toBe(true);
    });

    it('[TC99428_03] cancel when resume data on prompt report after apply prompt', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportWithPrompt,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.BigReportWithPrompt.id,
            projectId: reportConstants.BigReportWithPrompt.project.id,
        });
        await reportToolbar.switchToDesignMode(true);
        await since('1. Prompt editor should be open, instead prompt editor is not show')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await executeOnSlowNetwork(async () => {
            await promptEditor.runNoWait();
            await dossierPage.clickCancelExecutionButton();
        });
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await since(
            '2. Prompt editor should be open after cancel execution during apply prompt, instead prompt editor is not show'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
    });

    it('[TC99428_04] cancel when re-prompt in authoring', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportWithPrompt,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.BigReportWithPrompt.id,
            projectId: reportConstants.BigReportWithPrompt.project.id,
        });
        await reportToolbar.switchToDesignMode(true);
        await since('1. Prompt editor should be open, instead prompt editor is not shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        const yearPrompt = await promptEditor.findPrompt('Year');
        await aePrompt.shoppingCart.clickElmInAvailableList(yearPrompt, '2020');
        await aePrompt.shoppingCart.addSingle(yearPrompt);
        await promptEditor.run();
        await reportToolbar.rePrompt();
        await aePrompt.shoppingCart.addAll(yearPrompt);
        await executeOnSlowNetwork(async () => {
            await promptEditor.runNoWait();
            await dossierPage.clickCancelExecutionButton();
        });
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        const selectedPrompts = await aePrompt.shoppingCart.getSelectedObjectListText(
            await promptEditor.findPrompt('Year')
        );
        await since(
            '2. Prompt editor should be open after cancel execution during apply prompt, instead prompt editor is not show'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await since('3. Selected object list should be #{expected}, instead we have #{actual}')
            .expect(selectedPrompts)
            .toEqual(['2020', '2021', '2022', '2023']);
        await promptEditor.run();
        // the first cell under column Cost should be $22
        await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$22');
        await since('4. The first cell of column Cost should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 5))
            .toBe('$22');
    });

    it('[TC99428_05] cancel re-execute in authoring', async () => {
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.BigReportNoPrompt.id,
            projectId: reportConstants.BigReportNoPrompt.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // the first cell under column Revenue should be $24, item = Great Gatsby
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
        await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
        // the first cell under column Revenue
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
        await since('1. After sort undo button should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled(true))
            .toBe(true);
        await executeOnSlowNetwork(async () => {
            await reportToolbar.actionOnToolbar('re-execute', { isWait: false });
            await reportPage.clickCancelButtonInTopLoadingBar();
        });
        await reportGridView.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('2. The first cell of column Revenue should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellText(1, 7))
            .toBe('$14,000');
        await since('3. After cancel re-execute the undo button should be enabled, instead we have #{actual}')
            .expect(await reportToolbar.isUndoEnabled(true))
            .toBe(true);
    });

    it('[TC99428_06] cancel during linking in authoring', async () => {
        const linkName = 'Link 1 - report no prompt';
        await resetReportState({
            credentials: testUser,
            report: reportConstants.BigReportNoPrompt,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.BigReportNoPrompt.id,
            projectId: reportConstants.BigReportNoPrompt.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // the first cell under column Revenue should be $24, item = Great Gatsby
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$24');
        await reportGridView.sortByOption('Revenue', 'Sort All Values (Default)');
        // the first cell under column Revenue
        await reportGridView.waitForGridCellToBeExpectedValue(1, 7, '$14,000');
        await reportGridView.openContextualLinkFromCellByPos(1, 6, { linkName, isWait: false });
        await executeOnSlowNetwork(async () => {
            await reportPage.clickDoNotSaveButtonInConfirmSaveDialog();
            await dossierPage.clickCancelExecutionButton();
        }, ThrottleMode.Regular2G);
        await libraryPage.waitForCurtainDisappear();
        await since(
            '1. After click cancel execution button user should be landed on the library page, instead we have #{actual}'
        )
            .expect(await libraryPage.title())
            .toBe(libraryTitle);
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC99428_06', 'library home toolbar');
    });
});
