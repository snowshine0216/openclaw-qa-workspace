import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';

describe('CustomApp_PinFilter', () => {
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

    let customAppIdPinFilterPanel, customAppIdPinFilterDisableToolbar, customAppIdNotAllowClose;

    let { libraryPage, dossierPage, toc, grid, filterPanel, hamburgerMenu, loginPage, aibotChatPanel } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        customAppIdPinFilterPanel = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterBody,
        });
        await loginPage.login(consts.appUser.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdPinFilterPanel, customAppIdPinFilterDisableToolbar, customAppIdNotAllowClose],
        });
    });

    it('[TC90864_01] check pin Filter', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterPanel });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'link to itself NoFilter', pageName: 'link to current page' });
        // check filter is by default pinned, and no pin icon, close icon shows up
        await since(
            'when firstly open custom app, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getCloseIcon().isDisplayed())
            .toBe(true);

        // click on filter icon, and filter panel is closed and filter icon is gray, click on it won't trigger filter panel
        await filterPanel.closeFilterPanel();
        await since(
            'after click on filter icon to close it, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        await since(
            'after filter panel is closed, filter icon disabled should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isFilterIconDisabled())
            .toBe('true');

        // refresh page -> filter panel not show
        await browser.refresh();
        await dossierPage.waitForDossierLoading();
        await since(
            'after close filter panel and refresh page, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);

        // switch to link to dossier has filter chapter, click on filter icon again, filter panel shows up
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await filterPanel.openFilterPanel();
        await since(
            'after click on filter icon to show it, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // click on close button, filter panel is closed
        await filterPanel.closeFilterPanelByCloseIcon();
        await since(
            'after close filter panel by clicking close button, filter menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await filterPanel.openFilterPanel();
        await since(
            'after open filter panel by clicking filter icon, filter menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // resize to mobile view
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        // check filter panel is gone
        await since(
            'after resize window to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await hamburgerMenu.getSliderMenuContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        await dossierPage.waitForDossierLoading();
        // check filter panel is not back
        await since(
            'after resize window to desktop view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.customVizRSD.name);
        await dossierPage.waitForDossierLoading();
        // filter panel is not pinned by default for rsd
        await since(
            'when open app with filter panel pinned and run document, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.simpleReport.name);
        await dossierPage.waitForDossierLoading();
        // filter panel is not pinned for report
        await since(
            'when open app with filter panel pinned and run report, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        // filter panel should not be pinned for bot
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(consts.bydBalanceBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'when open app with filter panel pinned and run bot, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC90864_02] check pin filter panel and not allow close', async () => {
        // create app
        customAppIdNotAllowClose = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterNotAllowCloseBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdNotAllowClose });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check toc is by default pinned, and no pin icon, no close icon
        // may need to enhance
        await since(
            'when firstly open custom app, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        await since('when firstly open custom app, pin icon is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getUndockIcon().isDisplayed())
            .toBe(false);

        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getCloseIcon().isDisplayed())
            .toBe(false);

        // click on filter icon, and filter panel is not closed
        await filterPanel.getFilterIconOfOpenedFilterPanel().click();
        await since(
            'after click on filter panel to close it, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        // resize to mobile view
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        // check filter panel is gone
        await since(
            'after resize window to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await hamburgerMenu.getSliderMenuContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        await dossierPage.waitForDossierLoading();
        // check filter panel is back
        await since(
            'when not allow to close, after resize window to desktop view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
    });

    it('[TC90864_03] check pin filter panel and toolbar is disabled', async () => {
        // check when toolbar is disabled, filter panel is shown and not able to close
        // create app
        customAppIdPinFilterDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.pinFilterDisableToolbarBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterDisableToolbar });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when open disable tool bar app, toc menu shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await since(
            'when firstly open custom app, close button is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getCloseIcon().isDisplayed())
            .toBe(false);
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterDisableToolbar });
        await libraryPage.openDossier(consts.customVizRSD.name);
        await dossierPage.waitForDossierLoading();
        // filter panel is not pinned by default in rsd
        await since(
            'when open disable tool bar app with filter panel pinned and run document, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterDisableToolbar });
        await libraryPage.openDossier(consts.simpleReport.name);
        await dossierPage.waitForDossierLoading();
        // filter panel is not pinned by default in report
        await since(
            'when open disable tool bar app with filter panel pinned and run report, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        // filter panel should not be pinned for bot
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterDisableToolbar });
        await libraryPage.openDossier(consts.bydBalanceBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'when open disable tool bar app with filter panel pinned and run bot, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC90864_04] check linking when filter panel is pinned', async () => {
        // let grid1Info = { title: 'not pass, new tab', headerName: 'Category', elementName: 'Books' };
        // let grid2Info = { title: 'not pass, current tab', headerName: 'Category', elementName: 'Books' };
        await libraryPage.openCustomAppById({ id: customAppIdPinFilterPanel });
        await libraryPage.openDossier(consts.sourceDossier.name);
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
            'when link to new tab, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check toc is still pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'when link to current tab, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // click back button and check toc is still pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);

        // user close filter menu and do link again
        await filterPanel.closeFilterPanel();
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // link dossier to new tab and check filter panel is still pinned
        await since(
            'after user close filter menu and link to new tab, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // link to current tab and check toc is pinned
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'after user close filter menu and link to current tab, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        // click back button and check toc is not pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'when back from linked dossier, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    // add home dossier case based on test results
    // add more on page2 tests
});
