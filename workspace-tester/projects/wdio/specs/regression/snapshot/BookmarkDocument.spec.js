import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import { getDocAsHome } from '../../../constants/customApp/info.js';
import { resetCityDataByAPI, resetProductsDataByAPI } from '../../../api/whUpdate/index.js';

describe('Test Bookmark on document', () => {
    let {
        loginPage,
        libraryPage,
        share,
        toc,
        promptEditor,
        promptObject,
        aePrompt,
        dossierPage,
        rsdPage,
        notification,
        shareDossier,
        infoWindow,
        bookmark,
    } = browsers.pageObj1;

    const rwdBMSender = snapshotInfo.rwdBMSender;
    const rwdBMRecipient = snapshotInfo.rwdBMRecipient;
    const rwdBMRecNotInLibrary = snapshotInfo.rwdBMNotInLibrary;
    const promptDocumentForCity = snapshotInfo.promptDocumentForCity;
    const rwdNoDatasetInTutorial = snapshotInfo.rwdNoDatasetInTutorial;
    const rwdForManipulation = snapshotInfo.rwdForManipulation;
    const bookmark1 = 'Bookmark 1';
    const bookmark2 = 'Bookmark 2';
    const cityPromptTitle = 'Test-City';

    let appIdDocAsHome = '';
    const customAppObjRwdAsHome = getDocAsHome({
        name: 'bookmark',
        projectId: rwdNoDatasetInTutorial.project.id,
        docId: rwdNoDatasetInTutorial.id,
    });

    beforeAll(async () => {
        await resetCityDataByAPI();
        await resetProductsDataByAPI();
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({ credentials: rwdBMSender, dossier: promptDocumentForCity });
        await resetBookmarksWithPrompt({
            credentials: rwdBMSender,
            dossier: promptDocumentForCity,
        });
        await loginPage.login(rwdBMSender);
        await libraryPage.executeScript('window.localStorage.clear();');
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: rwdBMSender,
            customAppIdList: [appIdDocAsHome],
        });
    });

    it('[TC99184_01] CRUD bookmark on rwd', async () => {
        const bookmark1 = 'bm1-hangzhou';
        const bookmark2 = 'bm2-shanghai-beijing';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1' });
        const selector = rsdPage.findSelectorByKey('W7E11CE6C3735434E9CA134033313DB4F');
        await selector.dropdown.openDropdownAndMultiSelect(['2:Shanghai', '3:Beijing']);
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 2' });
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1' });
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await promptObject.selectPromptByIndex({ index: '1', promptName: cityPromptTitle });
        let prompt = await promptObject.getPromptByName(cityPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(prompt, '2:Shanghai');
        await aePrompt.shoppingCart.addSingle(prompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(prompt, '3:Beijing');
        await aePrompt.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        await selector.dropdown.openDropdownAndMultiSelect(['(All)']);
        const grid = rsdPage.findGridById('K44');
        await grid.selectGridContextMenuOptionByOffset({
            cell: 'Test-City',
            x: 5,
            optionText: 'Sort Descending',
            checkClickable: false,
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.applyBookmark(bookmark1);
        await since('1. CKP of bookmark1 should be #{expected}, instead it is #{actual}.')
            .expect(await dossierPage.getTxtTitle_Chapter())
            .toBe('Layout 2');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1' });
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_01_01', 'Bookmark 1 with selector');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 2' });
        await since('2. Current layout should be #{expected}, instead it is #{actual}.')
            .expect(await dossierPage.getTxtTitle_Chapter())
            .toBe('Layout 2');
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmark2);
        await since('3. CKP of bookmark1 should be #{expected}, instead it is #{actual}.')
            .expect(await dossierPage.getTxtTitle_Chapter())
            .toBe('Layout 1');
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_01_02', 'Bookmark 2 with prompt');
    });

    it('[TC99184_02] Share bookmark on rwd without prompt not in recipient library', async () => {
        await resetDossierState({ credentials: rwdBMSender, dossier: rwdNoDatasetInTutorial });
        await resetBookmarks({
            credentials: rwdBMSender,
            dossier: rwdNoDatasetInTutorial,
        });
        await createBookmarks({
            bookmarkList: [bookmark1, bookmark2],
            credentials: rwdBMSender,
            dossier: rwdNoDatasetInTutorial,
        });
        await libraryPage.openDossier(rwdNoDatasetInTutorial.name);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['All']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(rwdBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([rwdBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await dossierPage.goToLibrary();
        await libraryPage.switchUser(rwdBMRecNotInLibrary);
        await libraryPage.removeDossierFromLibrary(rwdBMRecNotInLibrary, rwdNoDatasetInTutorial);
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
            'TC99184_02_01',
            'RWD toolbar run shared bookmark'
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
            'TC99184_02_02',
            'RWD toolbar run shared bookmark in library'
        );
        await bookmark.openPanel();
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC99184_02_03', 'bookmark panel', { tolerance: 0.3 });
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99184_03] Share bookmark on rwd without prompt in recipient library', async () => {
        await resetDossierState({ credentials: rwdBMSender, dossier: rwdForManipulation });
        await resetBookmarks({
            credentials: rwdBMSender,
            dossier: rwdForManipulation,
        });
        await libraryPage.openDossier(rwdForManipulation.name);
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1 - UC' });
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await rsdPage.groupBy.changeGroupBy('(All)');
        const ucSelector = rsdPage.findSelectorByKey('W35003033C6BC49B68104160D321C9E11');
        await ucSelector.dropdown.openDropdownAndMultiSelect(['business']);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(rwdForManipulation.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['All']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(rwdBMRecipient.username);
        await shareDossier.selectRecipients([rwdBMRecipient.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(rwdBMRecipient);
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
            'TC99184_03_01',
            'RWD toolbar run shared bookmark in library'
        );
        await since(
            '3. Current bookmark notification on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.getNotificationMsg())
            .toBe('View your shared bookmarks here. Changes from the owner will be applied to the shared bookmark.');
        await bookmark.dismissNotification();
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_03_02', 'apply bookmark1');
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmark2, 'SHARED WITH ME');

        await since('4. Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bookmark2);
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_03_03', 'apply bookmark2');
        await bookmark.openPanel();
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(
            bookmark.getPanel(),
            'TC99184_03_04',
            'bookmark panel when apply shared bookmark',
            {
                tolerance: 0.3,
            }
        );
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99184_04] Share bookmark on rwd with prompt not in recipient library', async () => {
        await libraryPage.openDossier(promptDocumentForCity.name);
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1' });
        const selector = rsdPage.findSelectorByKey('W7E11CE6C3735434E9CA134033313DB4F');
        await selector.dropdown.openDropdownAndMultiSelect(['2:Shanghai', '3:Beijing']);
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
        await selector.dropdown.openDropdownAndMultiSelect(['(All)']);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await dossierPage.goToLibrary();
        // share bookmark1 and bookmark2 accordingly
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark1]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(rwdBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([rwdBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark2]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(rwdBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([rwdBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(rwdBMRecNotInLibrary);
        await libraryPage.removeDossierFromLibrary(rwdBMRecNotInLibrary, promptDocumentForCity);
        await libraryPage.openDefaultApp();
        await notification.openPanel();
        await notification.openMsgByIndex(1);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_04_01', 'RWD with shared bookmark1');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_04_02', 'RWD with shared bookmark2');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99184_05] Add to library from notification panel', async () => {
        await createBookmarks({
            bookmarkList: [bookmark1],
            credentials: rwdBMSender,
            dossier: promptDocumentForCity,
        });
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark1]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(rwdBMRecNotInLibrary.username);
        await shareDossier.selectRecipients([rwdBMRecNotInLibrary.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(rwdBMRecNotInLibrary);
        await libraryPage.removeDossierFromLibrary(rwdBMRecNotInLibrary, promptDocumentForCity);
        await libraryPage.openDefaultApp();
        await notification.openPanel();
        await notification.applySharedDossier(0);
        await takeScreenshotByElement(
            notification.getMsgByIndex(0),
            'TC99184_05_01',
            'Shared bookmark notification item after add to library'
        );
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_05_02', 'RWD with shared bookmark');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99184_06] Share bookmark on rwd with prompt in recipient library', async () => {
        await createBookmarks({
            bookmarkList: [bookmark1],
            credentials: rwdBMSender,
            dossier: promptDocumentForCity,
        });
        await resetDossierState({ credentials: rwdBMRecipient, dossier: promptDocumentForCity });
        await resetBookmarksWithPrompt({
            credentials: rwdBMRecipient,
            dossier: promptDocumentForCity,
        });
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.shareDossier();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bookmark1]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.searchRecipient(rwdBMRecipient.username);
        await shareDossier.selectRecipients([rwdBMRecipient.username]);
        await shareDossier.dismissRecipientSearchList();
        await shareDossier.shareDossier();
        await libraryPage.switchUser(rwdBMRecipient);
        await libraryPage.openDossier(promptDocumentForCity.name);
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
            'TC99184_06_01',
            'Shared bookmark notification item after accept'
        );
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99184_06_02', 'RWD with shared bookmark');
        await dossierPage.goToLibrary();
        await notification.openPanel();
        await notification.clearAllMsgs();
    });

    it('[TC99184_07] No bookmark when rwd as home', async () => {
        appIdDocAsHome = await createCustomApp({
            credentials: rwdBMSender,
            customAppInfo: customAppObjRwdAsHome,
        });
        await libraryPage.openCustomAppById({ id: appIdDocAsHome });
        await dossierPage.waitForDossierLoading();
        await since('1. Bookmark icon should not display, instead it is shown now.')
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(dossierPage.getNavigationBar(), 'TC99184_07_01', 'RWD as home with no bookmark');
    });
});
