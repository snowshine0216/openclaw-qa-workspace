import setWindowSize from '../../../config/setWindowSize.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import * as bookmarkHelp from '../../../constants/customApp/bookmarkHelper.js';
import { openViewInBrowserLink, getCurrentUTCTimestamp } from '../../../api/mailpit/mailpitAPI.js';

describe('Custom App - Bookmark', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, share, shareDossier, bookmark, notification, toc, grid } =
        browsers.pageObj1;
    let customAppId, customAppRSDId, customAppIdOff;
    let dossierAsHomeBmNoPrompt = customApp.getCustomAppBody({
        version: 'v2',
        name: 'autotest_dossierhome_bm',
        dossierMode: 1,
        url: 'app/' + bookmarkHelp.dossierBmLinksNoPrompt.project.id + '/' + bookmarkHelp.dossierBmLinksNoPrompt.id,
    });

    beforeAll(async () => {
        customAppId = await createCustomApp({
            credentials: bookmarkHelp.bmUserNotInLibrary.credentials,
            customAppInfo: dossierAsHomeBmNoPrompt,
        });
        await setWindowSize(browserWindow);
        await loginPage.login(bookmarkHelp.bmUserNotInLibrary.credentials);
    });

    beforeEach(async () => {
        await libraryPage.switchUser(bookmarkHelp.bmUserNotInLibrary.credentials);
        await bookmarkHelp.removeDossierAndOpenCustomApp(
            bookmarkHelp.bmUserNotInLibrary.credentials,
            [bookmarkHelp.dossierBmLinksNoPrompt, bookmarkHelp.dossierNoPromptLink1],
            customAppId
        );
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: bookmarkHelp.bmUserNotInLibrary.credentials,
            customAppIdList: [customAppId, customAppRSDId, customAppIdOff],
        });
    });

    // create bm, link out then back --double check verify
    it('[TC88585_01] Check sender create bm target dossier and then back to create bm on source dossier', async () => {
        let bmList = ['bm on home dossier', 'bm on linked dossier'];
        let gridInfo = {
            title: 'current tab',
            hearName: 'Category',
            elementName: 'Books',
        };

        // switch to panel 1 and create bm:
        await toc.openPageFromTocMenu({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });

        // link out and then check
        await grid.linkToDossier({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
        });
        await dossierPage.waitForDossierLoading();
        // create bm and update view
        await bookmarkHelp.createBMandClose([bmList[1]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);

        // click home icon will pop out confirm diagloue
        await dossierPage.clickHomeIcon();
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        // isBookmarkPresent
        await since('Current bookmark showing in bookmmark panel should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkPresent())
            .toBe(false);
        await bookmark.addNewBookmark([bmList[0]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);
        await bookmark.closePanel();
        await dossierPage.clickHomeIcon();
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);
        await bookmark.openPanel();
        await since(
            'After create bm and then switch page,current bookmark in bookmark list is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkPresent(bmList[0]))
            .toBe(true);
    });

    //  sender switch bookmark
    it('[TC88585_02] Check sender switch bookmark after linked to current dossier', async () => {
        let bmList = ['bm on default page', 'bm on page1', 'bm on page2'];
        let gridInfo = {
            title: 'this tab, pass',
            headerName: 'Category',
            elementName: 'Books',
        };
        await bookmarkHelp.removeDossierAndOpenCustomApp(
            bookmarkHelp.bmUserNotInLibrary.credentials,
            [bookmarkHelp.dossierBmLinksNoPrompt, bookmarkHelp.dossierNoPromptLink1],
            customAppId
        );
        // create bm on different pages
        await bookmarkHelp.createBMandClose([bmList[0]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);
        // link to this dossier and create bm
        await toc.openPageFromTocMenu({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter1,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch1_p2,
        });
        await grid.linkToDossier({
            title: gridInfo.title,
            headerName: gridInfo.headerName,
            elementName: gridInfo.elementName,
        });
        await bookmarkHelp.createBMandClose([bmList[1]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);

        // switch bm
        await bookmark.openPanel();
        await bookmark.applyBookmark(bmList[0]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter1,
                bookmarkHelp.dossierBmLinksNoPrompt.ch1_p1,
            ]);
    });

    // create bm, linkout then back --double check verify
    it('[TC88585_03] Check sender create bm in source and target dossier and then back', async () => {
        let bmList = ['bm on home dossier', 'bm on linked dossier'];
        let gridInfo = {
            title: 'current tab',
            hearName: 'Category',
            elementName: 'Books',
        };
        let linkedGridInfo = {
            title: 'pass new',
            hearName: 'Category',
            elementName: 'Books',
        };
        // switch to panel 1 and create bm:
        await toc.openPageFromTocMenu({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await grid.selectElement({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
        });

        await grid.selectGridContextMenu({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
            firstOption: 'Keep Only',
        });
        await bookmarkHelp.createBMandClose([bmList[0]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);

        // linkout and then check
        await grid.linkToDossier({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
        });
        await dossierPage.waitForDossierLoading();
        // create bm and update view
        await bookmarkHelp.createBMandClose([bmList[1]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);
        await grid.selectElement({
            title: linkedGridInfo.title,
            headerName: linkedGridInfo.hearName,
            elementName: linkedGridInfo.elementName,
        });
        await grid.selectGridContextMenu({
            title: linkedGridInfo.title,
            headerName: linkedGridInfo.hearName,
            elementName: linkedGridInfo.elementName,
            firstOption: 'Keep Only',
        });

        // click home icon will pop out confirm diagloue
        await dossierPage.clickHomeIcon();
        await since('Bookmark save change dialogue showing up should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);
        await bookmark.ignoreSaveReminder();
        await dossierPage.waitForDossierLoading();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter1,
                bookmarkHelp.dossierBmLinksNoPrompt.ch1_p1,
            ]);
    });

    it('[TC88585_04] Check sender share bm from bm panel and receiver opens email link', async () => {
        const currentTimeStamp = Date.now();
        const currentUTCTime = getCurrentUTCTimestamp();
        let sharedBM = 'Bookmark 1' + currentTimeStamp;
        await bookmarkHelp.recipientRemoveNotificationsAndDossierThenSwitchUser(
            bookmarkHelp.bmUserNotInLibrary,
            bookmarkHelp.bmUser2NotInLibrary,
            [bookmarkHelp.dossierBmLinksNoPrompt],
            customAppId
        );

        //share dossier from BM panel
        await toc.openPageFromTocMenu({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark(sharedBM);
        await bookmark.shareBookmark(sharedBM);
        //check default selection should be hovered one other than current applied BM
        await since('current selected shared BM should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe(sharedBM);
        await bookmarkHelp.shareBookmarkAddRecipients(
            [bookmarkHelp.bmUser2NotInLibrary.credentials.username],
            'test share bookmark from bookmark window'
        );

        // recipient open share link from email link
        await libraryPage.switchUser(bookmarkHelp.bmUser2NotInLibrary.credentials);
        // let libraryShown = await libraryPage.isNotificationIconPresent();
        await openViewInBrowserLink(bookmarkHelp.bmUser2NotInLibrary.credentials.username, currentUTCTime);
        await libraryPage.waitForLibraryLoading();
        //check it will load Bookmark and no add to library button displayed
        let loginShown = await loginPage.isLoginPageDisplayed();
        // let currentUrl = await browser.getUrl();
        if (loginShown) {
            await loginPage.login(bookmarkHelp.bmUser2NotInLibrary.credentials);
            await dossierPage.waitForDossierLoading();
            loginShown = await loginPage.isLoginPageDisplayed();
            // currentUrl = await browser.getUrl();
        }
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(sharedBM);
        await since('Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        await since('Shared bookmark in bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkPresent(sharedBM, 'SHARED WITH ME'))
            .toBe(true);
        await bookmark.closePanel();
    });

    it('[TC88585_05] Check sender share bookmark from share window and receiver open copied link', async () => {
        let sharedBM = 'Bookmark 1';
        await bookmarkHelp.recipientRemoveNotificationsAndDossierThenSwitchUser(
            bookmarkHelp.bmUserNotInLibrary,
            bookmarkHelp.bmUser2NotInLibrary,
            [bookmarkHelp.dossierBmLinksNoPrompt],
            customAppId
        );

        // share dossier from share window
        await bookmarkHelp.createBMandClose([sharedBM]);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        const url = await shareDossier.getLink();
        await shareDossier.closeDialog();
        await share.closeSharePanel();
        // recipient opens copied share link
        await libraryPage.switchUser(bookmarkHelp.bmUser2NotInLibrary.credentials);
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();

        //check it will load Bookmark and no add to library button displayed
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(sharedBM);
        await since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await bookmark.openPanel();
        // await takeScreenshotByElement(await bookmark.getPanel(), 'TC88585_05', 'bookmark panel after open share link');
        await since('Shared bookmark in bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkPresent(sharedBM, 'SHARED WITH ME'))
            .toBe(true);
        await bookmark.closePanel();
        await dossierPage.closeTab(1);
    });

    it('[TC88585_06] Check sender create bm on home dossier and recipient open from notification panel and switch bookmarks', async () => {
        let bmList = ['Bookmark 1', 'Bookmark 2'];
        await bookmarkHelp.recipientRemoveNotificationsAndDossierThenSwitchUser(
            bookmarkHelp.bmUserNotInLibrary,
            bookmarkHelp.bmUser2NotInLibrary,
            [bookmarkHelp.dossierBmLinksNoPrompt],
            customAppId
        );

        // sender share bm from share window
        await bookmarkHelp.createBMandClose([bmList[0]]);
        await toc.openMenu();
        await toc.goToPage({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await bookmarkHelp.createBMandClose([bmList[1]]);
        await bookmarkHelp.shareBookmarkFromShareWindows([bmList[0]], false);
        await bookmarkHelp.shareBookmarkAddRecipients([bookmarkHelp.bmUser2NotInLibrary.credentials.username]);

        await libraryPage.switchUser(bookmarkHelp.bmUser2NotInLibrary.credentials);
        await dossierPage.waitForDossierLoading();
        // check notification message with accept shown up
        await notification.openPanel();
        // ---------------------
        // await takeScreenshotByElement(notification.getPanel(), 'TC88585_06', 'show accept button for shared bm notification', {tolerance: 0.21});
        await since(
            'Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        // await takeScreenshotByElement(notification.getPanel(), 'TC88585_06', 'Accept button is gone in notification after accept bm', {tolerance: 0.21});

        //add to library in notification panel
        await notification.applySharedDossier(0);
        //click the link to check load view
        await notification.openMsgByIndex(0);
        await since(
            'After apply bm from notification, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);
        await since('add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        //check error msg on BM notification
        await since(
            'Error msg for shared bookmarks with all have beed added should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isNotificationErrorPresent())
            .toBe(false);
        await bookmark.openPanel();
        await since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await bookmark.closePanel();

        // switch page
        await toc.openMenu();
        await toc.goToPage({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p2,
        });

        //save as my bookmark and check default name is the shared BM name
        await bookmark.openPanel();
        await bookmark.addNewBookmark('Bookmark 3');
        await since(
            'After create bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 3');

        //swtich bookmark between my bookmark and shared bookmark
        await bookmark.applyBookmark(bmList[1], 'SHARED WITH ME');
        await since(
            'After swtich BM, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
                bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
            ]);
    });

    // link out then share
    it('[TC88585_08] Check sender link out and then share and receiver apply bm from bm list', async () => {
        let bmList = ['Bookmark 1', 'Bookmark 2'];
        let gridInfo = { title: 'current tab', headerName: 'Category', elementName: 'Books' };
        await bookmarkHelp.recipientRemoveNotificationsAndDossierThenSwitchUser(
            bookmarkHelp.bmUserNotInLibrary,
            bookmarkHelp.bmUser2NotInLibrary,
            [bookmarkHelp.dossierBmLinksNoPrompt, bookmarkHelp.dossierNoPromptLink1],
            customAppId
        );

        // link out
        await toc.openMenu();
        await toc.goToPage({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await grid.linkToDossier(gridInfo);
        await dossierPage.waitForDossierLoading();
        await bookmarkHelp.createBookmarkAndShareFromBMPanel(
            bmList[1],
            [bookmarkHelp.bmUser2NotInLibrary.credentials.username],
            'test share bm on linked dossier'
        );

        // switch user
        await libraryPage.switchUser(bookmarkHelp.bmUser2NotInLibrary.credentials);
        await dossierPage.waitForDossierLoading();
        // check notification message with accept shown up
        await notification.openPanelAndWaitListMsg();
        // await takeScreenshotByElement(notification.getPanel(), 'TC88585_08', 'notification panel after user shares bm from linked dossier', {tolerance: 0.21});
        await since(
            'Current Action button for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Accept');
        await since(
            'Current shared messsage for shared bookmark in push notification panel should be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getSharedMessageText(0))
            .toBe('test share bm on linked dossier');

        //add to library in notification panel
        await notification.applySharedDossier(0);
        await notification.closePanel();
        //open bookmark panel to make sure it's not in source dossier
        await bookmark.openPanel();
        await since('Shared BM of share bookmark status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedStatusIconPresent(bmList[1]))
            .toBe(false);
        await bookmark.closePanel();

        // go to target dossier and check
        await toc.openMenu();
        await toc.goToPage({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await grid.linkToDossier(gridInfo);
        // check new badge on bookmark icon
        await since('New book mark icon showing up should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isNewBookmarkIconPresent())
            .toBe(true);

        // click on the bookmark to apply it
        await bookmark.openPanel();
        // check 'new' icon for bookmark
        await since('Shared BM of share bookmark status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureIcon(bmList[1]).getText())
            .toBe('NEW');
        await since('Shared BM of share bookmark status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedStatusIconPresent(bmList[1]))
            .toBe(true);
        await bookmark.applyBookmark(bmList[1], 'SHARED WITH ME');
        await dossierPage.waitForDossierLoading();
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);
        //---
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierNoPromptLink1.name,
                bookmarkHelp.dossierNoPromptLink1.chapter2,
                bookmarkHelp.dossierNoPromptLink1.ch2_p1,
            ]);
    });

    // dossier in user's library
    it('[TC88585_09] Check recipient accept bookmark and create new bookmark', async () => {
        let bmList = ['Bookmark 1', 'Bookmark 2'];
        await resetBookmarks({
            credentials: bookmarkHelp.bmUserInLibrary.credentials,
            dossier: bookmarkHelp.dossierBmLinksNoPrompt,
        });

        await resetBookmarks({
            credentials: bookmarkHelp.bmUser2InLibrary.credentials,
            dossier: bookmarkHelp.dossierBmLinksNoPrompt,
        });

        await bookmarkHelp.recipientRemoveNotificationsThenSwitchUser(
            bookmarkHelp.bmUserInLibrary,
            bookmarkHelp.bmUser2InLibrary,
            customAppId
        );

        // sender share bm from share window
        await bookmarkHelp.createBookmarkAndShareFromBMPanel(
            bmList[0],
            [bookmarkHelp.bmUser2InLibrary.credentials.username],
            'test dossier home with sharing bookmarks'
        );

        await libraryPage.switchUser(bookmarkHelp.bmUser2InLibrary.credentials);
        await dossierPage.waitForDossierLoading();
        // check notification message with accept shown up
        await notification.openPanelAndWaitListMsg();

        //add to library in notification panel
        await notification.applySharedDossier(0);
        //  await takeScreenshotByElement(notification.getPanel(), 'TC88585_09', 'accept button for shared bm notification is gone after click it', {tolerance: 0.21});
        await notification.closePanel();

        await bookmark.openPanel();
        await since('Shared BM of share bookmark status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedStatusIconPresent(bmList[0]))
            .toBe(true);
        await bookmark.closePanel();

        await toc.openMenu();
        await toc.goToPage({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bmList[1]);
        await since(
            'After create bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
                bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
            ]);

        //swtich bookmark between my bookmark and shared bookmark
        await bookmark.applyBookmark(bmList[0], 'SHARED WITH ME');
        await since(
            'After swtich BM, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter1,
                bookmarkHelp.dossierBmLinksNoPrompt.ch1_p1,
            ]);
        await bookmark.openPanel();
        await bookmark.applyBookmark(bmList[1]);
        await since(
            'After swtich BM, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
                bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
            ]);
    });

    it('[TC88585_10] Check bookmark off display', async () => {
        let dossierAsHomeBmOff = customApp.getCustomAppBody({
            version: 'v2',
            name: 'autotest_dossierhome_bm',
            dossierMode: 1,
            url: 'app/' + bookmarkHelp.dossier.project.id + '/' + bookmarkHelp.dossier.id,
            iconsHomeDocument: [
                'table_of_contents',
                'reset',
                'filters',
                'comments',
                'share',
                'notifications',
                'options',
            ],
        });
        customAppIdOff = await createCustomApp({
            credentials: bookmarkHelp.bmUserNotInLibrary.credentials,
            customAppInfo: dossierAsHomeBmOff,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOff, dossier: true });
        // verify bookmark icon is not there
        await since('Bookmark showing up is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);
    });

    it('[TC88585_11] Verify share bookmark when rsd  as Home', async () => {
        let sharedBM = 'Bookmark 1';
        let link1 = 'Link to dossier';
        let link2 = 'Link to rsd';

        let rsdAsHome = customApp.getCustomAppBody({
            version: 'v2',
            name: 'autotest_dossierhome_bm',
            dossierMode: 1,
            url: 'app/' + bookmarkHelp.rsdSource.project.id + '/' + bookmarkHelp.rsdSource.id,
        });
        customAppRSDId = await createCustomApp({
            credentials: bookmarkHelp.bmUserNotInLibrary.credentials,
            customAppInfo: rsdAsHome,
        });

        await bookmarkHelp.recipientRemoveNotificationsAndDossierThenSwitchUser(
            bookmarkHelp.bmUserNotInLibrary,
            bookmarkHelp.bmUser2NotInLibrary,
            [bookmarkHelp.rsdSource, bookmarkHelp.dossierNoPromptLink1],
            customAppRSDId
        );

        // check bm is not there
        await since(
            'After opening rsd as home, bookmark icon showing up should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);
        // open link and then share share bm
        await dossierPage.clickTextfieldByTitle(link1);
        await dossierPage.waitForDossierLoading();
        await since(
            'After opening target dossier, bookmark icon showing up should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(true);
        await bookmarkHelp.createBookmarkAndShareFromBMPanel(
            sharedBM,
            [bookmarkHelp.bmUser2NotInLibrary.credentials.username],
            'test rsd home'
        );

        // back to RSD
        await dossierPage.clickHomeIcon();
        await since(
            'After go back to rsd by clicking home icon, bookmark icon showing up should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);
        await dossierPage.clickTextfieldByTitle(link2);
        await dossierPage.waitForDossierLoading();
        await since(
            'After opening target document, bookmark icon in rsd showing up should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);

        // switch user
        await libraryPage.switchUser(bookmarkHelp.bmUser2NotInLibrary.credentials);
        await notification.openPanelAndWaitListMsg();
        // await takeScreenshotByElement(notification.getPanel(), 'TC88585_11', 'show accept button for shared bm notification', {tolerance: 0.21});
        await notification.applySharedDossier(0);
        await notification.closePanel();
        await since(
            'After accept bm in notification panel, bookmark icon in rsd showing up should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);
        await dossierPage.clickTextfieldByTitle(link1);
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        await bookmark.applyBookmark(sharedBM, 'SHARED WITH ME');
        await since(
            'After apply BM, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe(sharedBM);
        await dossierPage.previousPage();
        await since(
            'After go back to rsd by clicking back button, bookmark icon showing up should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.isBookmarkEnabled())
            .toBe(false);
    });

    // //failed to get shortcut for api , comment it out
    // it('[TC88585_12] Verify share bookmark when prompt dosier  as Home', async () => {
    //     let bmList = ['bm on source', 'bm on target']
    //     let gridInfo = { 'title': 'Visualization 1', 'headerName': 'Category', 'elementName': 'BMG' }
    //     customAppId = await bookmarkHelp.removeDossierAndCreateCustomAppAndOpenIt(
    //         bookmarkHelp.bmUserNotInLibrary.credentials,
    //         dossierPromptdAsHome,
    //         [bookmarkHelp.promptDossierSource, bookmarkHelp.dossierNoPromptLink1],
    //         true);
    //     await bookmarkHelp.recipientRemoveNotificationsAndDossierThenSwitchUser(bookmarkHelp.bmUserNotInLibrary, bookmarkHelp.bmUser2NotInLibrary, [bookmarkHelp.promptDossierSource, bookmarkHelp.dossierNoPromptLink1], customAppId, true);

    //     // create bm and share
    //     await bookmarkHelp.createBookmarkAndShareFromBMPanel(bmList[0],[bookmarkHelp.bmUser2NotInLibrary.credentials.username],'test prompt home');
    //     // await bookmark.openPanel();
    //     // await bookmark.addNewBookmark(bmList[0]);
    //     // await bookmark.shareBookmark(bmList[0]);
    //     // await bookmarkHelp.shareBookmarkAddRecipients([bookmarkHelp.bmUser2NotInLibrary.credentials.username],'test prompt home');

    //     //re-prompt
    //     await promptEditor.reprompt();
    //     await promptEditor.cancelEditor();
    //     since('After swtich cancel prompt, current BM label on navigation bar should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.labelInTitle()).toBe(sharedBM);

    //     // linkout
    //     await grid.linkToDossier(gridInfo);
    //     await bookmarkHelp.createBookmarkAndShareFromBMPanel(bmList[0],[bookmarkHelp.bmUser2NotInLibrary.credentials.username],'test target dossier');

    //      // back to prompt dossier
    //     await dossierPage.clickHomeIcon();
    //     await promptEditor.run();
    //     await dossierPage.waitForDossierLoading();

    //     // apply bm
    //     await bookmark.openPanel();
    //     await bookmark.applyBookmark(bm_list[0]);
    //     since('After apply bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.labelInTitle()).toBe(bm_list[0]);

    //     // switch user to check share bm notification
    //     await libraryPage.switchUser(bookmarkHelp.bmUser2NotInLibrary.credentials);
    //     await promptEditor.run();
    //     await dossierPage.waitForDossierLoading();
    //     // check notification
    //     await notification.openPanelAndWaitListMsg();
    //     // ---------------------
    //     // await takeScreenshotByElement(notification.getPanel(), 'TC88585_12', 'show accept button for shared bm notification', {tolerance: 0.21});

    //     // click on source notification link
    //     await notification.openMsgByIndex(1);
    //     // check BM is applied
    //     since('After click on notification, current BM label on navigation bar should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.labelInTitle()).toBe(bmList[0]);
    //     since('Page title should be #{expected}, instead we have #{actual}')
    //         .expect(await dossierPage.pageTitle()).toEqual(
    //             [ bookmarkHelp.dossierBmLinksNoPrompt.name, bookmarkHelp.dossierBmLinksNoPrompt.chapter1, bookmarkHelp.dossierBmLinksNoPrompt.ch1_p1]
    //             );

    //     //accept target bm in notification panel
    //     await notification.applySharedDossier(0);
    //     await notification.closePanel();
    //     await bookmark.openPanel();
    //     since('New book mark icon showing up should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.isNewBookmarkIconPresent()).toBe(false);
    //     since('New icon for shared bookmark is supposed to be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.getCapsureIcon(bmList[0])).toBe('');
    //     // check no target bm in source dossier
    //     since('Shared BM of bookmark on target dossier status should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.isSharedStatusIconPresent(bmList[1])).toBe(false);

    //     // link to target bm
    //     await grid.linkToDossier(gridInfo);
    //     await bookmark.openPanel();
    //     // check bm in target dossier
    //     since('Shared BM of bookmark on target dossier status should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.isSharedStatusIconPresent(bmList[1])).toBe(false);
    //     await bookmark.applyBookmark(bmList[1], 'SHARED WITH ME');
    //     // check BM is applied
    //     since('After click on notification, current BM label on navigation bar should be #{expected}, instead we have #{actual}')
    //         .expect(await bookmark.labelInTitle()).toBe(bmList[1]);
    //     since('Page title should be #{expected}, instead we have #{actual}')
    //         .expect(await dossierPage.pageTitle()).toEqual(
    //             [ bookmarkHelp.dossierNoPromptLink1.name, bookmarkHelp.dossierNoPromptLink1.chapter1, bookmarkHelp.dossierNoPromptLink1.ch1_p1]
    //             );
    //     // back to target dossier
    //     await dossierPage.previousPage();
    //     // check - to do

    // });

    it('[TC88585_13] Verify share bookmark when link to other tab ', async () => {
        let bmList = ['bm on home dossier', 'bm on linked dossier'];
        let gridInfo = {
            title: 'new tab',
            hearName: 'Category',
            elementName: 'Books',
        };
        let linkedGridInfo = {
            title: 'pass new',
            hearName: 'Category',
            elementName: 'Books',
        };

        // switch to panel 1 and create bm:
        await toc.openPageFromTocMenu({
            chapterName: bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
            pageName: bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
        });
        await grid.selectElement({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
        });
        await grid.selectGridContextMenu({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
            firstOption: 'Keep Only',
        });
        await bookmarkHelp.createBMandClose([bmList[0]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[0]);

        // linkout and then check
        await grid.linkToDossier({
            title: gridInfo.title,
            headerName: gridInfo.hearName,
            elementName: gridInfo.elementName,
        });
        await libraryPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // create bm and update view
        await bookmarkHelp.createBMandClose([bmList[1]]);
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe(bmList[1]);
        await grid.selectElement({
            title: linkedGridInfo.title,
            headerName: linkedGridInfo.hearName,
            elementName: linkedGridInfo.elementName,
        });
        await grid.selectGridContextMenu({
            title: linkedGridInfo.title,
            headerName: linkedGridInfo.hearName,
            elementName: linkedGridInfo.elementName,
            firstOption: 'Keep Only',
        });

        // click home icon will pop out confirm diagloue
        await dossierPage.clickHomeIcon();
        await since('Bookmark save change dialogue showing up should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSaveChangesDialogPresent())
            .toBe(true);
        await bookmark.ignoreSaveReminder();
        await dossierPage.waitForDossierLoading();
        await bookmark.openPanel();
        await bookmark.applyBookmark(bmList[0]);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([
                bookmarkHelp.dossierBmLinksNoPrompt.name,
                bookmarkHelp.dossierBmLinksNoPrompt.chapter2,
                bookmarkHelp.dossierBmLinksNoPrompt.ch2_p1,
            ]);
        await libraryPage.closeTab(1);
    });
});
