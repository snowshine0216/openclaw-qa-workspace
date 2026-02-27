import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_PinToc', () => {
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

    let customAppIdPinToc, customAppIdPinTocDisableToolbar, customAppIdPinTocNotAllowClose;

    let { libraryPage, dossierPage, toc, grid, loginPage, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
        customAppIdPinToc = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocBody,
        });
        await resetDossierState({
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
            customAppIdList: [customAppIdPinToc, customAppIdPinTocDisableToolbar, customAppIdPinTocNotAllowClose],
        });
    });

    it('[TC90863_01] check pin Toc', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinToc });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check toc is by default pinned, and no pin icon, close icon shows up
        await since(
            'when firstly open custom app, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.getCloseIcon().isDisplayed())
            .toBe(true);

        // click on toc icon, and toc is closed
        await toc.closeMenu({ icon: 'toc' });
        await since(
            'after click on toc menu to close it, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await (await toc.getMenuContainer()).isDisplayed())
            .toBe(false);

        // refresh page -> toc panel not show
        await browser.refresh();
        await dossierPage.waitForDossierLoading();
        await since(
            'after close toc menu and refresh page, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);

        // click on toc icon again, toc panel shows up
        await toc.openMenu();
        await since(
            'after click toc menu again and, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);

        // click on close button, tock panel is closed
        await toc.closeMenu({ icon: 'close' });
        await since(
            'after close toc menu by clicking close butto, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
        await toc.openMenu();

        // resize to mobile view
        await setWindowSize(mobileWindow);
        // check toc is gone
        await since(
            'after resize window to mobile view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        // check toc is not back if allow to close
        await since(
            'after resize window to desktop view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.customVizRSD.name);
        await dossierPage.waitForDossierLoading();
        // toc panel is pinned by default for rsd
        await since(
            'when open custom app with toc pinned and run document, toc panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.simpleReport.name);
        await dossierPage.waitForDossierLoading();
        // toc panel is not pinned by default for report
        await since(
            'when open custom app with toc pinned and run open report, tco panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.bydBalanceBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'when open app with toc panel pinned and run bot, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
    });

    it('[TC90863_02] check pin toc and not allow close', async () => {
        // create app
        customAppIdPinTocNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinTocNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check toc is by default pinned, and no pin icon, no close icon
        // may need to enhance
        await since(
            'when firstly open custom app, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await (await toc.getTOCPin()).isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.getCloseIcon().isDisplayed())
            .toBe(false);

        // click on toc icon, and toc is not closed
        await toc.closeMenuWithoutWait({ icon: 'toc' });
        await since(
            'after click on toc menu to close it, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);

        // resize to mobile view
        await setWindowSize(mobileWindow);
        // check toc is gone
        await since(
            'after resize window to mobile view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        // check toc is back if not allow close
        await since(
            'after resize window to desktop view, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);

        // click on close button, tock panel is closed
        await toc.closeMenuWithoutWait({ icon: 'toc' });
        await since(
            'after close toc menu by clicking close button, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
    });

    it('[TC90863_03] check pin toc and toolbar is disabled', async () => {
        // won't check collapse toolbar because when collapse toolbar from workstation
        // toc panel will be unpinned
        // check when toolbar is disabled, toc menu is shown and not able to close
        // create app
        customAppIdPinTocDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinTocDisableToolbarBody,
        });

        await libraryPage.openCustomAppById({ id: customAppIdPinTocDisableToolbar });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when open disable tool bar app with toc panel pinned, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await since(
            'when open disable tool bar app with toc panel pinned, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.getCloseIcon().isDisplayed())
            .toBe(false);

        await libraryPage.openCustomAppById({ id: customAppIdPinTocDisableToolbar });
        await libraryPage.openDossier(consts.customVizRSD.name);
        await dossierPage.waitForDossierLoading();
        // toc panel is pinned by default for rsd
        await since(
            'when open disable tool bar app with toc panel pinned and run document, toc panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await libraryPage.openCustomAppById({ id: customAppIdPinTocDisableToolbar });
        await libraryPage.openDossier(consts.simpleReport.name);
        await dossierPage.waitForDossierLoading();
        // toc panel is not pinned by default for report
        await since(
            'when open disable tool bar app with toc panel pinned and run report, tco panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
        // toc panel should not be pinned for bot
        await libraryPage.openCustomAppById({ id: customAppIdPinTocDisableToolbar });
        await libraryPage.openDossier(consts.bydBalanceBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'when open disable tool bar app with toc panel pinned and run bot, toc panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
    });

    it('[TC90863_04] check linking when toc is pinned', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinToc });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.goToPage({ chapterName: consts.sourceDossier.chapter, pageName: consts.sourceDossier.page1 });
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // link dossier to new tab and check toc is still pinned
        await since('when link to new tab, toc menu shows up is expected to be #{expected}, instead we have #{actual}')
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check toc is still pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'when link to current tab, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        // click back button and check toc is still pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);

        // user close toc menu and do link again
        await toc.closeMenu({ icon: 'close' });
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.waitForDossierLoading();
        await dossierPage.switchToTab(1);
        // link dossier to new tab and check toc is still pinned
        await since(
            'after user close toc menu, when link to new tab, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check toc is not pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'after user close toc menu, when link to current tab, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        // click back button and check toc is not pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(false);
    });

    // add home dossier case based on test results
});
