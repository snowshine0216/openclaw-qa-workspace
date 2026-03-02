import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import createBookmarks from '../../../api/createBookmarks.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinMultiplePanelXfuncAI', () => {
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

    let customAppIdPinFilterAIAssistant,
        customAppIdPinFilterAIAssistantNotAllowClose,
        customAppIdPinFilterAIAssistantOnlyFilterNotAllowdClose,
        customAppIdPinFilterAIAssistantOnlyAINotAllowClose,
        customAppIdPinCommentAIAssistant,
        customAppIdPinCommentAIAssistantNotAllowClose,
        customAppIdPinCommenAIAssistantOnlyCommentNotAllowdClose,
        customAppIdPinFilterCommentOnlyAINotAllowClose;

    let { libraryPage, dossierPage, toc, loginPage, filterPanel, commentsPage, bookmark, aiAssistant } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        customAppIdPinCommentAIAssistant = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentAIAssistantBody,
        });
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
                customAppIdPinFilterAIAssistant,
                customAppIdPinFilterAIAssistantNotAllowClose,
                customAppIdPinFilterAIAssistantOnlyFilterNotAllowdClose,
                customAppIdPinFilterAIAssistantOnlyAINotAllowClose,
                customAppIdPinCommentAIAssistant,
                customAppIdPinCommentAIAssistantNotAllowClose,
                customAppIdPinCommenAIAssistantOnlyCommentNotAllowdClose,
                customAppIdPinFilterCommentOnlyAINotAllowClose,
            ],
        });
        await resetBookmarks({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });
    });

    it('[TC91592_01] check pin Filter and AIAssistant', async () => {
        // create app
        customAppIdPinFilterAIAssistant = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterAIAssistantBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when filter panel and AIAssistant are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await since(
            'when filter panel and AIAssistant are pinned at same time, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await aiAssistant.open();
        await since(
            'after click on  AIAssistant icon, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await since(
            'after click on AIAssistant icon, pin icon is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getUnPinBtn().isDisplayed())
            .toBe(false);

        // refresh page - filter panel not show up
        await dossierPage.reload();
        await since('after reload page, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        await since('after reload,  AIAssistant shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        // click on aiAssistant icon ,filter panel is gone
        await aiAssistant.close();
        await since(
            'after close AIAssistant, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await since(
            'after close AIAssistant, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC91592_02] check AIAssistant and Filter Panel pinned and both not allow close', async () => {
        // create app
        customAppIdPinFilterAIAssistantNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterAIAssistantAllNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterAIAssistantNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when AIAssistant and Filter Panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await since(
            'when filter panel and AIAssistant are pinned at same time, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);

        await aiAssistant.open();
        await since(
            'after click on aiAssistant icon, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await setWindowSize(mobileWindow);
        // check aiAssistant menu is gone
        await since(
            'after resize to mobile view, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        await since(
            'after resize to normal view, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC91592_03] check AIAssistant and Filter Panel left pinned and only filter not allow close', async () => {
        // create app
        customAppIdPinFilterAIAssistantOnlyFilterNotAllowdClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterAIAssistantOnlyFilterNotAllowCloseBody,
        });
        // create bm by api
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterAIAssistantOnlyFilterNotAllowdClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when AIAssistant and Filter Panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await since(
            'when filter panel and AIAssistant are pinned at same time, AIAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
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
            'after resize to normal view, ai Assistant menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await aiAssistant.open();
        await since(
            'after click on aiAssistant icon, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await since(
            'after click on aiAssistant icon, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        // switch page
        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page2 });
        await since('after switch page, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since('after switch page, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await dossierPage.resetDossier();
        await since('after reset, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since('after reset, filter panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        // apply bm
        await bookmark.openPanel();
        await bookmark.applyBookmark('Bookmark 1');
        await since(
            'After apply bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        await since(
            'after apply bookmark, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since(
            'after apply bookmark, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC91592_04] check aiAssistant and Filter Panel left pinned and only aiAssistant not allow close', async () => {
        // create app
        customAppIdPinFilterAIAssistantOnlyAINotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterAIAssistantOnlyAIAssistantNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterAIAssistantOnlyAINotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when toc and filter panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        await setWindowSize(mobileWindow);
        await since(
            'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        // filter panel shows up
        await since(
            'after resize to normal view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await since(
            'after resize to normal view, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC91592_05] check pin Comment panel and aiAssistant panel', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinCommentAIAssistant });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when aiAssistantl and comment panel are pinned, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
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
            'after close comment panel, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
    });

    it('[TC91592_06] check aiAssistant and Comment Panel pinned and both not allow close', async () => {
        // create app
        customAppIdPinCommentAIAssistantNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentAIAssistantAllNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinCommentAIAssistantNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when aiAssistant and comment panel are pinned at same time, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        // click on coment and then resize it
        await commentsPage.openCommentsPanel();
        // comment panel shows up and filter panel gone
        await since(
            'after click on comment icon, comment menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await setWindowSize(mobileWindow);
        // check comment panel is gone
        await since(
            'after resize to mobile view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        await since(
            'after resize to normal view, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
    });
    it('[TC91592_07] check aiAssistant and Comment Panel pinned and only AIAssistant not allow close', async () => {
        // create app
        customAppIdPinFilterCommentOnlyAINotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentAIAssistantOnlyAIAssistantNotAllowCloseBody,
        });
        // create bm by api
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterCommentOnlyAINotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when aiAssistant and comment panel are pinned at same time, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since(
            'when aiAssistant and comment panel are pinned at same time,, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        await since(
            'after resize to mobile view, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        await since(
            'after resize to normal view, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await since(
            'after resize to normal view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        // switch page
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page2,
        });
        await since(
            'after switch page, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since('after switch page, comment shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await dossierPage.resetDossier();
        await since('after reset, omment panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await since('after reset, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);

        await commentsPage.openCommentsPanel();

        // apply bm
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
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
    });

    it('[TC91592_08] check Comment and aiAssistant Panel pinned and only comment not allow close', async () => {
        // create app
        customAppIdPinCommenAIAssistantOnlyCommentNotAllowdClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentAIAssistantOnlyCommentNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinCommenAIAssistantOnlyCommentNotAllowdClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when comment and aiAssistant panel are pinned at same time, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since(
            'when comment and aiAssistant panel are pinned at same time, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        await setWindowSize(mobileWindow);
        await since(
            'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await setWindowSize(browserWindow);
        await since(
            'after resize to normal view, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(true);
        await since(
            'after resize to normal view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC91592_09] check Comment and aiAssistant Panel pinned and user has no privilege to aiAssistant', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinCommentAIAssistant });
        await libraryPage.openDossier(consts.analysisDocument.name);
        await dossierPage.waitForDossierLoading();
        // check filter panel is docked
        await since(
            'when comment and aiAssistant panel are pinned at same time and no privilege to ai, aiAssistant panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aiAssistant.getAssistantContainer().isDisplayed())
            .toBe(false);
        await since(
            'when comment and aiAssistant panel are pinned at same time, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        // await setWindowSize(mobileWindow);
        // await since(
        //     'after resize to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await aiAssistant.getAssistantContainer().isDisplayed())
        //     .toBe(false);
        // await setWindowSize(browserWindow);
        // await since(
        //     'after resize to normal view, aiAssistant shows up is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await aiAssistant.getAssistantContainer().isDisplayed())
        //     .toBe(true);
        // await since(
        //     'after resize to normal view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await commentsPage.getCommentsPanel().isDisplayed())
        //     .toBe(false);
    });
});
