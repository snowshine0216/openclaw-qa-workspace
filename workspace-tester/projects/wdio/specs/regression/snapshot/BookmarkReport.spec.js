import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { resetCityDataByAPI, resetProductsDataByAPI } from '../../../api/whUpdate/index.js';

describe('Test Bookmark on Report', () => {
    let {
        loginPage,
        libraryPage,
        share,
        promptEditor,
        promptObject,
        aePrompt,
        dossierPage,
        notification,
        shareDossier,
        infoWindow,
        bookmark,
        reportGridView,
    } = browsers.pageObj1;

    const reportBMSender = snapshotInfo.reportBMSender;
    const reportBMRecipient = snapshotInfo.reportBMRecipient;
    const reportBMRecNotInLibrary = snapshotInfo.reportBMNotInLibrary;
    const promptReportForCity = snapshotInfo.promptReportForCity;
    const singleReport = snapshotInfo.singleReport;
    const reportForManipulation = snapshotInfo.sampleReport;
    const bookmark1 = 'Bookmark 1';
    const bookmark2 = 'Bookmark 2';
    const cityPromptTitle = 'Test-City';

    beforeAll(async () => {
        await resetCityDataByAPI();
        await resetProductsDataByAPI();
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetReportState({ credentials: reportBMSender, report: promptReportForCity });
        await resetBookmarksWithPrompt({
            credentials: reportBMSender,
            dossier: promptReportForCity,
            type: 'report',
        });
        await loginPage.login(reportBMSender);
        await libraryPage.executeScript('window.localStorage.clear();');
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC99185_01] CRUD bookmark on report', async () => {
        const bookmark1 = 'bm1-hangzhou';
        const bookmark2 = 'bm2-shanghai-beijing';
        await libraryPage.openDossier(promptReportForCity.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await promptObject.selectPromptByIndex({ index: '1', promptName: cityPromptTitle });
        let prompt = await promptObject.getPromptByName(cityPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(prompt, '2:Shanghai');
        await aePrompt.shoppingCart.addSingle(prompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(prompt, '3:Beijing');
        await aePrompt.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.applyBookmark(bookmark1);
        await since(
            '1. After apply bookmark1, Current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark1);
        await since('2. After apply bookmark1, current rows in grid should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getRowCounts())
            .toBe(3);
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmark2);
        await since('3. After apply bookmark2, current rows in grid should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getRowCounts())
            .toBe(2);
        await since(
            '4. After apply bookmark2, Current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark2);
    });

    it('[TC99185_02] Share bookmark on report without prompt not in recipient library', async () => {
        await resetReportState({ credentials: reportBMSender, report: singleReport });
        await resetBookmarks({
            credentials: reportBMSender,
            dossier: singleReport,
            type: 'report',
        });
        await createBookmarks({
            bookmarkList: [bookmark1, bookmark2],
            credentials: reportBMSender,
            dossier: singleReport,
            type: 'report',
        });
        await libraryPage.openDossier(singleReport.name);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['All']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(reportBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([reportBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await dossierPage.goToLibrary();
        await libraryPage.switchUser(reportBMRecNotInLibrary);
        await libraryPage.removeDossierFromLibrary(reportBMRecNotInLibrary, singleReport, false);
        await libraryPage.openDefaultApp();
        await notification.openPanel();
        await since(
            '1. Current Action button for shared RWD bookmark in notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Add to Library');
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await since('2. Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark1);
        await takeScreenshotByElement(
            dossierPage.getNavigationBar(),
            'TC99185_02_01',
            'Report toolbar run shared bookmark'
        );
        await dossierPage.addToLibrary();
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await since('3. Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark1);
        await takeScreenshotByElement(
            dossierPage.getNavigationBar(),
            'TC99185_02_02',
            'Report toolbar run shared bookmark in library'
        );
        await bookmark.openPanel();
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC99185_02_03', 'bookmark panel', { tolerance: 0.3 });
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99185_03] Share bookmark on report without prompt in recipient library', async () => {
        await resetReportState({ credentials: reportBMSender, report: reportForManipulation });
        await resetBookmarks({
            credentials: reportBMSender,
            dossier: reportForManipulation,
            type: 'report',
        });
        await libraryPage.openDossier(reportForManipulation.name);
        await reportGridView.sortAscending('Category');
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await reportGridView.showTotalsForObject('Subcategory');
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(reportForManipulation.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['All']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(reportBMRecipient.username);
        await shareDossier.selectRecipients([reportBMRecipient.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(reportBMRecipient);
        await notification.openPanel();
        await since(
            '1. Current Action button for shared RWD bookmark in notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await since('2. Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark1);
        await takeScreenshotByElement(
            dossierPage.getNavigationBar(),
            'TC99185_03_01',
            'Report toolbar run shared bookmark in library'
        );
        await since(
            '3. Current bookmark notification on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNotificationMsg())
            .toBe('View your shared bookmarks here. Changes from the owner will be applied to the shared bookmark.');
        await bookmark.dismissNotification();
        // await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99185_03_02', 'apply bookmark1');
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmark2, 'SHARED WITH ME');

        await since('4. Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark2);
        await since('5. After apply bookmark2, cell 7, 1 in grid should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(7, 1))
            .toBe('Total');
        await bookmark.openPanel();
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getPanel(),
            'TC99185_03_04',
            'bookmark panel when apply shared bookmark',
            { tolerance: 0.3 }
        );
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99185_04] Share bookmark on report with prompt not in recipient library', async () => {
        await libraryPage.openDossier(promptReportForCity.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await promptObject.selectPromptByIndex({ index: '1', promptName: cityPromptTitle });
        let prompt = await promptObject.getPromptByName(cityPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(prompt, '2:Shanghai');
        await aePrompt.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await dossierPage.goToLibrary();
        // share bookmark1 and bookmark2 accordingly
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark1]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(reportBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([reportBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark2]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(reportBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([reportBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(reportBMRecNotInLibrary);
        await libraryPage.removeDossierFromLibrary(reportBMRecNotInLibrary, promptReportForCity, false);
        await libraryPage.openDefaultApp();
        await notification.openPanel();
        await notification.openMsgByIndex(1);
        await dossierPage.waitForDossierLoading();
        await since(
            '1. When run shared bookmark1, current rows in grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(3);
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await since(
            '2. When run shared bookmark2, current rows in grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(1);
        // await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99185_04_02', 'RWD with shared bookmark2');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99185_05] Add to library from notification panel for report', async () => {
        await createBookmarks({
            bookmarkList: [bookmark1],
            credentials: reportBMSender,
            dossier: promptReportForCity,
            type: 'report',
        });
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark1]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(reportBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([reportBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(reportBMRecNotInLibrary);
        await libraryPage.removeDossierFromLibrary(reportBMRecNotInLibrary, promptReportForCity, false);
        await libraryPage.openDefaultApp();
        await notification.openPanel();
        await notification.applySharedDossier(0);
        await notification.hideNotificationTimeStamp();
        await takeScreenshotByElement(
            notification.getMsgByIndex(0),
            'TC99185_05_01',
            'Shared bookmark notification item after add to library'
        );
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await since('1. Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark1);
        await since('2. After add to library, current rows in grid should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getRowCounts())
            .toBe(3);
        await since('3. After add to library, cell 1, 1 in grid should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Hangzhou');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99185_06] Share bookmark on report with prompt in recipient library', async () => {
        await createBookmarks({
            bookmarkList: [bookmark1],
            credentials: reportBMSender,
            dossier: promptReportForCity,
            type: 'report',
        });
        await resetReportState({ credentials: reportBMRecipient, report: promptReportForCity });
        await resetBookmarksWithPrompt({
            credentials: reportBMRecipient,
            dossier: promptReportForCity,
            type: 'report',
        });
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark1]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(reportBMRecipient.username);
        await shareDossier.selectRecipients([reportBMRecipient.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(reportBMRecipient);
        await libraryPage.openDossier(promptReportForCity.name);
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await promptObject.selectPromptByIndex({ index: '1', promptName: cityPromptTitle });
        let prompt = await promptObject.getPromptByName(cityPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(prompt, '3:Beijing');
        await aePrompt.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await since(
            '1. Current Action button for shared RWD bookmark in notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        await notification.applySharedDossier(0);
        await notification.hideNotificationTimeStamp();
        await takeScreenshotByElement(
            notification.getMsgByIndex(0),
            'TC99185_06_01',
            'Shared bookmark notification item after accept'
        );
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await since(
            '1. after open notification msg, current rows in grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(3);
        await since(
            '2. after open notification msg, cell 1, 1 in grid should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Hangzhou');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });
});
