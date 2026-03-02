import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import createBookmarks from '../../../api/createBookmarks.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinMultiplePanelXfunc', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        browserInstance: browsers.browser1,
        width: 599,
        height: 640,
    };

    let customAppIdPinTocFilterLeft,
        customAppIdPinTocFilterLeftNotAllowClose,
        customAppIdPinTocFilterLeftOnlyTocNotAllowdClose,
        customAppIdPinTocFilterLeftOnlyFilterNotAllowClose,
        customAppIdPinFilterComment,
        customAppIdPinFilterCommentNotAllowClose,
        customAppIdPinFilterCommenOnlyFilterNotAllowdClose,
        customAppIdPinFilterCommentOnlyCommentNotAllowClose;

    let { libraryPage, dossierPage, toc, loginPage, filterPanel, commentsPage, bookmark } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });
        await createBookmarks({
            bookmarkList: ['Bookmark 1'],
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdPinTocFilterLeft,
                customAppIdPinTocFilterLeftNotAllowClose,
                customAppIdPinTocFilterLeftOnlyTocNotAllowdClose,
                customAppIdPinTocFilterLeftOnlyFilterNotAllowClose,
                customAppIdPinFilterComment,
                customAppIdPinFilterCommentNotAllowClose,
                customAppIdPinFilterCommenOnlyFilterNotAllowdClose,
                customAppIdPinFilterCommentOnlyCommentNotAllowClose,
            ],
        });
        await resetBookmarks({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });
    });

    it('[TC90866_05] check Toc and Filter Panel left pinned', async () => {
        // create app
        customAppIdPinTocFilterLeft = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocLeftFilterPinnedBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocFilterLeft });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when toc and filter panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when toc and filter panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);
        // click on toc icon and then close it
        await toc.openMenu();
        // toc panel shows up and filter panel gone
        await since(
            'after click on toc icon, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after click on toc icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);

        // refresh page - filter panel not show up
        await dossierPage.reload();
        // after reload toc menu is still there
        await since('after reload page, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after reload, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);
        // click on toc icon ,filter panel is gone
        await toc.closeMenu({ icon: 'toc' });
        await since(
            'after click on toc icon, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(false);
    });

    it('[TC90866_06] check Toc and Filter Panel left pinned and both not allow close', async () => {
        // create app
        customAppIdPinTocFilterLeftNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocLeftFilterAllNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocFilterLeftNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when toc and filter panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when toc and filter panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);
        // click on toc icon and then resize it
        await toc.openMenu();
        // toc panel shows up and filter panel gone
        await since(
            'after click on toc icon, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after click on toc icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        // check toc menu is gone
        await since(
            'after resize to mobile view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        // toc menu is still there
        await since(
            'after resize to normal view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(false);
    });

    it('[TC90866_07] check Toc and Filter Panel left pinned and only toc not allow close', async () => {
        // create app
        customAppIdPinTocFilterLeftOnlyTocNotAllowdClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocLeftFilterOnlyTocNotAllowCloseBody,
        });
        // create bm by api
        await libraryPage.openCustomAppById({ id: customAppIdPinTocFilterLeftOnlyTocNotAllowdClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when toc and filter panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when toc and filter panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        // check filter panel is gone
        await since(
            'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        // toc menu shows up becuase it's not allow close
        await since(
            'after resize to normal view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(false);
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);

        // click on toc icon and it won't dismiss the toc menu
        await toc.openMenu();
        // toc panel shows up and filter panel gone
        await since(
            'after click on toc icon, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);
        await since(
            'after click on toc icon, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        // switch page
        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page2 });
        // toc panel is still pinned
        await since('after switch page, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);
        await since('after switch page, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await dossierPage.resetDossier();
        await since('after reset, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);
        await since('after reset, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        // apply bm
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 1');
        // await bookmark.ignoreSaveReminder();
        await since(
            'After apply bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        // toc panel is still pinned
        await since('after apply bookmark, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);
        await since(
            'after apply bookmark, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC90866_08] check Toc and Filter Panel left pinned and only filter not allow close', async () => {
        // create app
        customAppIdPinTocFilterLeftOnlyFilterNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocLeftFilterOnlyFilterNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocFilterLeftOnlyFilterNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when toc and filter panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when toc and filter panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        // check filter panel is gone
        await since(
            'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        // filter panel shows up
        await since(
            'after resize to normal view, filter menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        await since(
            'after resize to normal view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(false);

        // click on toc icon
        await toc.openMenu();
        // toc panel shows up and filter panel gone
        await since(
            'after click on toc icon, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('after click on toc icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);

        await since(
            'after click on toc icon, filter menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(false);
    });

    it('[TC90866_09] check pin Comment panel and Filter panel', async () => {
        // create app
        customAppIdPinFilterComment = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterCommentBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterComment });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when filter panel and comment panel are pinned, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when filter panel and comment panel are pinned, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);

        // click on comment icon
        await commentsPage.openCommentsPanel();
        await since(
            'after expand comment panel, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await since('after expand comment panel, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(false);

        // close comment icon, all panels are gone
        await commentsPage.closeCommentsPanel();
        await since(
            'after close comment panel, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await since(
            'after close comment panel, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC90866_10] check Filter and Comment Panel pinned and both not allow close', async () => {
        // create app
        customAppIdPinFilterCommentNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterCommentAllNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterCommentNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when filter and comment panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when filter and comment panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);
        await since(
            'awhen filter and comment panel, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        // click on coment and then resize it
        await commentsPage.openCommentsPanel();
        // comment panel shows up and filter panel gone
        await since(
            'after click on comment icon, comment menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since('after click on comment icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        // check comment panel is gone
        await since(
            'after resize to mobile view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await since(
            'after resize to normal view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
    });
    it('[TC90866_11] check Filter and Comment Panel pinned and only comment not allow close', async () => {
        // create app
        customAppIdPinFilterCommentOnlyCommentNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterCommentOnlyCommentNotAllowCloseBody,
        });
        // create bm by api
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterCommentOnlyCommentNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when filter and comment panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when filter and comment panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);
        await since(
            'when filter and comment panel are pinned at same time,, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        // check filter panel is gone
        await since(
            'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        await since(
            'after resize to normal view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        // switch page
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page2,
        });
        // filter panel is still pinned
        await since(
            'after switch page, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await since('after switch page, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await dossierPage.resetDossier();
        await since('after reset, comment panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await since('after reset, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        // apply bm
        // expand comment panel
        await commentsPage.openCommentsPanel();
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 1');
        // await bookmark.ignoreSaveReminder();
        await since(
            'After apply bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        // comment panel is still pinned
        await since(
            'after apply bookmark, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await since(
            'after apply bookmark, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC90866_12] check Comment and Filter Panel pinned and only filter not allow close', async () => {
        // create app
        customAppIdPinFilterCommenOnlyFilterNotAllowdClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterCommentOnlyFilterNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterCommenOnlyFilterNotAllowdClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when comment and filter panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // pin button icon is not displayed
        await since(
            'when toc and filter panel are pinned at same time, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);
        await since(
            'when toc and filter panel are pinned at same time, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        // check filter panel is gone
        await since(
            'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        // filter panel shows up
        await since(
            'after resize to normal view, filter menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await since(
            'after resize to normal view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(false);

        // click on toc icon
        await commentsPage.openCommentsPanel();
        // comment panel shows up and filter panel gone
        await since(
            'after click on comment icon, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since('after click on comment icon, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getDockIcon().isDisplayed())
            .toBe(false);

        await since(
            'after click on comment icon, filter menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(false);
    });
});
