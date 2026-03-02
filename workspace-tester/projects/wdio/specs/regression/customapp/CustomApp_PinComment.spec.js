import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinComment', () => {
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

    let customAppIdPinCommentPanel,
        customAppIdDisableToolbar,
        customAppIdNotAllowClose,
        customAppIdDisableToolbarLibraryHome,
        customAppIdPinCommentLibraryHome;

    let {
        libraryPage,
        dossierPage,
        toc,
        grid,
        hamburgerMenu,
        commentsPage,
        loginPage,
        aibotChatPanel,
        // groupDiscussion,
        // notification,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        customAppIdPinCommentPanel = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentHomeDossierBody,
        });
        await loginPage.login(consts.appUser.credentials);
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.sourceDossier,
        });

        // may need to delete all comments, notificaitons and discussions
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdPinCommentPanel,
                customAppIdDisableToolbar,
                customAppIdNotAllowClose,
                customAppIdPinCommentLibraryHome,
                customAppIdDisableToolbarLibraryHome,
            ],
        });
    });

    // test for dossier as home
    it('[TC90865_01] check pin Comment', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinCommentPanel, dossier: true });
        await dossierPage.waitForDossierLoading();
        await commentsPage.waitForCommentPanelPresent();
        // check comment panel is by default pinned, and no pin icon, close icon shows up
        await since(
            'when firstly open custom app, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCloseIcon().isDisplayed())
            .toBe(true);

        // click on comment icon, and comment panel is closed
        await commentsPage.closeCommentsPanel();
        await since(
            'after click on close button to close it, comments panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        // refresh page -> comment panel not show
        await dossierPage.reload();
        await dossierPage.waitForDossierLoading();
        await since(
            'after close comment panel and refresh page, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await commentsPage.openCommentsPanel();
        await since('after reopen comment panel, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(false);
        await commentsPage.closeCommentsPanel({ option: 'comment' });
        await since(
            'after click on comment icon to close it, comments panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        await commentsPage.openCommentsPanel();

        // resize to mobile view
        await setWindowSize(mobileWindow);
        // check filter panel is gone
        await since(
            'after resize window to mobile view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await hamburgerMenu.getSliderMenuContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        // check filter panel is back?
        await since(
            'after resize window to desktop view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
    });

    it('[TC90865_02] check pin comment panel and not allow close', async () => {
        // create app
        customAppIdNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommenNotAllowCloseHomeDossierBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdNotAllowClose, dossier: true });
        await dossierPage.waitForDossierLoading();
        await commentsPage.waitForCommentPanelPresent();
        // check comment panel is by default pinned, and no pin icon, no close icon
        await since(
            'when firstly open custom app, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.getUndockIcon().isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCloseIcon().isDisplayed())
            .toBe(false);

        // click on comment icon, and comment panel is not closed
        await commentsPage.closeCommentsPanel({ option: 'comment' });
        await since(
            'after click on comment icon to close it, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        // resize to mobile view
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        // check filter panel is gone
        await since(
            'after resize window to mobile view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await hamburgerMenu.getSliderMenuContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        await dossierPage.waitForDossierLoading();
        // check filter panel is back?
        await since(
            'after resize window to desktop view, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
    });

    it('[TC90865_03] check pin comment panel and toolbar is disabled', async () => {
        // check when toolbar is disabled, filter panel is shown and not able to close
        // create app
        customAppIdDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentDisableToolbarHomeDossierBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableToolbar, dossier: true });
        await dossierPage.waitForDossierLoading();
        await since(
            'when open disable tool bar app, comment  shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCloseIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC90865_04] check linking when comment panel is pinned', async () => {
        // let grid1Info = { title: 'not pass, new tab', headerName: 'Category', elementName: 'Books' };
        // let grid2Info = { title: 'not pass, current tab', headerName: 'Category', elementName: 'Books' };
        await libraryPage.openCustomAppById({ id: customAppIdPinCommentPanel, dossier: true });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // link dossier to new tab and check filter panel is still pinned
        await since(
            'when link to new tab, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check toc is still pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'when link to current tab, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        // click back button and check toc is still pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);

        // user close toc menu and do link again
        await commentsPage.closeCommentsPanel();
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // link dossier to new tab and check toc is still pinned
        await since(
            'after user close comments panel and then link to new tab, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check toc is not pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'after user close comments panel and then link to current tab, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        // click back button and check toc is not pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier,  comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
    });

    // check pin comment for report, document and bot
    it('[TC90865_05] check pin comment panel for report and document', async () => {
        // create app
        customAppIdPinCommentLibraryHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentBody,
        });
        customAppIdDisableToolbarLibraryHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinCommentDisableToolbarLibraryHome,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinCommentLibraryHome });
        await libraryPage.openDossier(consts.customVizRSD.name);
        await dossierPage.waitForDossierLoading();
        // comment panel is pinned by default for rsd
        await since(
            'when open custom app with comment pinned and run document, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.simpleReport.name);
        await dossierPage.waitForDossierLoading();
        // comment panel is not pinned by default for report
        await since(
            'when open custom app with comment pinned and run report, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        // comment panel is not pinned by default for bot
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.bydBalanceBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'when open custom app with comment pinned and run bot, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);

        // check when toolbar is disalbed and comment panel is pinned
        await libraryPage.openCustomAppById({ id: customAppIdDisableToolbarLibraryHome });
        await libraryPage.openDossier(consts.customVizRSD.name);
        await dossierPage.waitForDossierLoading();
        // comment panel is pinned by default for document
        await since(
            'when open custom app with comment pinned and toolbar disabled, run document, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(true);
        await libraryPage.openCustomAppById({ id: customAppIdDisableToolbarLibraryHome });
        await libraryPage.openDossier(consts.simpleReport.name);
        await dossierPage.waitForDossierLoading();
        // comment panel is not pinned by default for reports
        await since(
            'when open custom app with comment pinned and toolbar disabled, run report, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
        // comment panel is not pinned by default for bot
        await libraryPage.openCustomAppById({ id: customAppIdDisableToolbarLibraryHome });
        await libraryPage.openDossier(consts.bydBalanceBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'when open custom app with comment pinned and toolbar disabled, run bot, comment panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await commentsPage.getCommentsPanel().isDisplayed())
            .toBe(false);
    });
});
