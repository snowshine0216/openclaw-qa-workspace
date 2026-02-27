import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('CustomApp_FilterLeft', () => {
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

    let customAppIdLeftFilterPinned,
        customAppIdLeftFilter,
        customAppIdLeftFilterCollapseToolbar,
        customAppIdLeftFilterPinnedNotAllowCloseDisableToolbar;

    let { libraryPage, dossierPage, toc, grid, filterPanel, hamburgerMenu, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        customAppIdLeftFilter = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.leftFilterBody,
        });
        customAppIdLeftFilterPinned = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.leftFilterPinnedBody,
        });
        await loginPage.login(consts.appUser.credentials);
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
            customAppIdList: [
                customAppIdLeftFilterPinned,
                customAppIdLeftFilter,
                customAppIdLeftFilterCollapseToolbar,
                customAppIdLeftFilterPinnedNotAllowCloseDisableToolbar,
            ],
        });
    });

    it('[TC90864_05] check filter panel left', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilter });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check filter icon is by default on left
        await since(
            'when firstly open custom app, filter icon shows at left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterIconOnLeft().isDisplayed())
            .toBe(true);
        // switch to link to dossier has filter chapter, click on filter icon, filter panel shows up at left
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await filterPanel.openFilterPanel();
        // check filter panel is on left
        await since(
            'after click on filter icon to show it, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // click on close button, filter panel is closed
        await filterPanel.dockFilterPanel();
        await since(
            'after dock filter panel its position on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // resize to mobile view
        await setWindowSize(mobileWindow);
        // check filter panel is gone
        await since(
            'after resize window to mobile view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await hamburgerMenu.getSliderMenuContainer().isDisplayed())
            .toBe(false);

        // restore to desktop view
        await setWindowSize(browserWindow);
        // check filter panel is not back
        await since(
            'after resize window to desktop view, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC90864_06] check pin filter panel and it is left position', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilterPinned });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'link to itself NoFilter', pageName: 'link to current page' });
        // check toc is by default pinned at left
        await since(
            'when firstly open custom app, filter panel shows up at left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);

        // after change page, filter panel remains
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page1,
        });
        await since(
            'after change page, filter panel shows up at left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
    });

    it('[TC90864_07] check filter panel is left and toolbar disabled', async () => {
        // create app
        customAppIdLeftFilterCollapseToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.leftFilterCollapseToolbarBody,
        });
        customAppIdLeftFilterPinnedNotAllowCloseDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.leftFilterPinnedNotAllowCloseDisableToolbarBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilterCollapseToolbar });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        // check when toolbar is collapsed, filter panel is not shown
        await since(
            'when expand collapse toolbar app, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(false);
        // expand toolbar
        await dossierPage.expandCollapsedNavBar();
        await since(
            'when open collapsed toolbar, filter panel shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterIconOnLeft().isDisplayed())
            .toBe(true);
        // go to chapter with filter enabled
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page2,
        });
        // click on filter icon, filter panel shows up at left
        await filterPanel.openFilterPanel();
        await since(
            'after click on filter icon to show it, filter panel shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // pin filter panel
        await filterPanel.dockFilterPanel();
        await since(
            'after pin filter panel, filter panel shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        // toolbar can not be collapsed
        await since(
            'when toolbar is collapsed, after pin filter panel, collapse icon in tool bar shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.getNavigationBarCollapsedIcon().isDisplayed())
            .toBe(false);
        // check when toolbar is disabled, filter panel is shown and not able to close
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilterPinnedNotAllowCloseDisableToolbar });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'when open disable toolbar app, filter panel shows up on left is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
        await since(
            'when open disable toolbar app, close button in filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getCloseIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC90864_08] check linking when filter panel is left', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdLeftFilter });
        await libraryPage.openDossier(consts.sourceDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({
            chapterName: consts.sourceDossier.chapter,
            pageName: consts.sourceDossier.page2,
        });
        await dossierPage.waitForDossierLoading();
        await grid.linkToDossier(consts.sourceDossier.grid1Info);
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // link dossier to new tab and check filter icon is still on left
        await since(
            'when link to new tab, filter icon shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterIconOnLeft().isDisplayed())
            .toBe(true);
        await filterPanel.openFilterPanel();
        await since(
            'when link to new tab, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);

        // close current tab
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
        // pin the filter panel
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();
        // link to current tab and check filter icon is still on left
        await grid.linkToDossier(consts.sourceDossier.grid2Info);
        await dossierPage.waitForDossierLoading();
        await since(
            'after user pin filter panel and then link to current tab, filter panel shows up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(false);
        // click back button and check toc is still pinned
        await dossierPage.goBackFromDossierLink();
        await since(
            'after user pin filter panel and then go back from linked dossier, filter panel docked on left expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isLeftDocked())
            .toBe(true);
    });

    // add home dossier case based on test results
    // add more on page2 tests
});
