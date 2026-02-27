import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Collapsed Toolbar', () => {
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

    // let config = {
    //     dossierAsHomeCollapsed: 'D98ED09C5DF04C6B85545F47ED000A6C',
    //     libraryAsHomeCollapsedEnableSearchOnly: '4C6806C6FD2145B3873BBAE9243978C7',
    // };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        filterOnSearch,
        reset,
        infoWindow,
        grid,
        fullSearch,
        bookmark,
        promptEditor,
        filterSummary,
        librarySearch,
        searchPage,
        baseVisualization,
        toc,
        filterPanel,
        commentsPage,
    } = browsers.pageObj1;

    let collapseToolbarDossierAsHomeBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoCollapseToolbarDossierAsHome',
        toolbarMode: 1,
        toolbarEnabled: true,
        dossierMode: 1,
        url: `/app/${consts.promptHomeDossier.projectId}/${consts.promptHomeDossier.dossierId}`,
    });

    let customAppIdCollapseToolbar, customAppIdCollapseToolbarEnableSearchOnly, customAppIdCollapseToolbarDossierAsHome;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
        customAppIdCollapseToolbarDossierAsHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: collapseToolbarDossierAsHomeBody,
        });
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdCollapseToolbar,
                customAppIdCollapseToolbarEnableSearchOnly,
                customAppIdCollapseToolbarDossierAsHome,
            ],
        });
    });

    it('[TC78891] Library as home - Collapsed Toolbar - Only enable search', async () => {
        // create app
        let collapseToolbarOnlyEnalbeSearchBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoCollapseToolbarOnlyEnableSearch',
            toolbarMode: 1,
            toolbarEnabled: true,
            iconsHomeLibrary: ['search'],
            iconsHomeDocument: [],
        });
        customAppIdCollapseToolbarEnableSearchOnly = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: collapseToolbarOnlyEnalbeSearchBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdCollapseToolbarEnableSearchOnly });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await takeScreenshotByElement(
            await infoWindow.getActionIcons(),
            'TC78891_01',
            'Custom info window - Only show delete icon'
        );
        await infoWindow.close();

        await libraryPage.expandCollapsedNavBar();
        await takeScreenshotByElement(
            await libraryPage.getNavigationBar(),
            'TC78891_02',
            'Custom Nav Bar - Only show search'
        );

        await librarySearch.openSearchBox();
        await librarySearch.search('RSDGraph');
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);
        await since('Back button shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await fullSearch.getBackIcon().isDisplayed())
            .toBe(true);
        await since('Filter button shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await filterOnSearch.getSearchFilterNavIcon().isDisplayed())
            .toBe(true);
        await searchPage.switchToOption('all');
        await searchPage.executeGlobalResultItem('RSDGraph');
        await dossierPage.waitForDossierLoading();
        await dossierPage.sleep(2000);
        // [FROM 25.07] add to library banner is moved to toolbar so that only expand toolbar can see the button
        // comment out below assertion
        // await since('Add to Library banner shows up is expected to be #{expected}, instead we have #{actual}.')
        //     .expect(await dossierPage.isAddToLibraryDisplayed())
        //     .toBe(true);
        await dossierPage.reload();
        await dossierPage.expandCollapsedNavBar();
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC78891_03',
            'Custom navbar - show home icon'
        );
        await dossierPage.goToLibrary();

        await since('Favorite icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isFavoriteIconPresent(consts.testedDossier.name))
            .toBe(false);
        await dossierPage.sleep(2000);
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await takeScreenshotByElement(
            await infoWindow.getActionIcons(),
            'TC78891_04',
            'Custom info window - Only show delete icon'
        );
        await infoWindow.close();
        await libraryPage.openDossier('Dossier with PS + filter + link');
        await since('Filter summary shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await filterSummary.getFilterCount().isDisplayed())
            .toBe(true);
        await baseVisualization.clickVisualizationTitle('Open in current tab, other dossier');
        await baseVisualization.openMenuOnVisualization('Open in current tab, other dossier');
        await since('Viz Export shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 1, option: 'Export' }))
            .toBe(false);
        await since('Show data shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 0, option: 'Show Data' }))
            .toBe(true);
        await dossierPage.expandCollapsedNavBar();
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC78891_05',
            'Custom navbar - Only show home icon'
        );

        await grid.selectGridContextMenuOption({
            title: 'Open in current tab, other dossier',
            headerName: 'Subcategory',
            elementName: 'Business',
            firstOption: 'Keep Only',
        });
        await dossierPage.waitForDossierLoading();
        await dossierPage.expandCollapsedNavBar();
        console.log(await reset.getResetButton().isDisplayed());
        await since('Reset icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(false);
    });

    it('[TC76707] Dossier as home - Collapsed Toolbar - Prompt & DL', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdCollapseToolbarDossierAsHome, dossier: true });
        await dossierPage.waitForPageLoading();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.expandCollapsedNavBar();
        await promptEditor.reprompt();
        await promptEditor.cancelEditor();
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.switchToNewWindow();
        await since('Navigation bar shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getNavigationBar().isDisplayed())
            .toBe(false);
        await since('Collapsed icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getNavigationBarCollapsedIcon().isDisplayed())
            .toBe(true);
        let currentUrl = await browser.getUrl();
        await since(
            'After link to new tab, URL contains config id is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes(customAppIdCollapseToolbarDossierAsHome))
            .toBe(true);
        await dossierPage.expandCollapsedNavBar();
        await since('Home icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getHomeIcon().isDisplayed())
            .toBe(true);
        await since('Back icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('TOC icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(true);
        await since('Reset icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(false);
        await since('Bookmark icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(true);
        await since('Filter icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);
        await since('Undo icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getUndoIcon().isDisplayed())
            .toBe(true);
        await since('Comments icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(true);
        await since('Share icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(true);
        await since('Account icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(true);
        // need to focus to other place if want to assert the collapsed bar.
        // await dossierPage.sleep(6000);
        // await since('Tool bar should be collapsed.').expect(dossierPage.getNavigationBar().isPresent()).toBe(false);
    });

    it('[TC76707_2] Mobile View - Dossier as home - Collapsed Toolbar - Prompt & DL', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdCollapseToolbarDossierAsHome, dossier: true });
        await setWindowSize(mobileWindow);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.expandCollapsedNavBar();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC76707_2_1', 'toolbar');
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 2',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.expandCollapsedNavBar();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC76707_2_2', 'toolbar');
        await dossierPage.previousPage();
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.switchToNewWindow();
        await dossierPage.expandCollapsedNavBar();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC76707_2_3', 'toolbar');
        await dossierPage.closeTab(1);
    });

    it('[TC78891_01] Library as home - Collapsed Toolbar', async () => {
        // create app
        let collapseToolbarBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoCollapseToolbar',
            toolbarMode: 1,
            toolbarEnabled: true,
        });
        customAppIdCollapseToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: collapseToolbarBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdCollapseToolbar });
        await libraryPage.expandCollapsedNavBar();
        // expand side bar
        await libraryPage.openSidebar();
        // check side bar is opened, toolbar is opened and collapse icon is hidden
        await since(
            'After expand collapsed toolbar and open sidebar, side bar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open sidebar, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open sidebar, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);

        // refresh page, settings should be persist
        await libraryPage.reload();
        await libraryPage.waitForLibraryLoading();

        await since(
            'After expand collapsed toolbar then open sidebar and refresh page, side bar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        // DE273991 ----
        // await since(
        //     'After expand collapsed toolbar then open sidebar and refresh page, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        // )
        //     .expect(await libraryPage.isNavigationBarPresent())
        //     .toBe(true);
        await since(
            'After expand collapsed toolbar then open sidebar and refresh page, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
        // check comment panel, toc panel, and filter panel when collapse toolbar
        await libraryPage.openDossier(consts.dossierWithPSfilterLink.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.expandCollapsedNavBar();
        await toc.openMenu();
        await toc.pinTOC();
        await since(
            'After expand collapsed toolbar and open toc, toc panel shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open toc, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open toc, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
        await dossierPage.reload();
        await since(
            'After expand collapsed toolbar and open toc and refresh page, toc panel shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await toc.isTOCMenuOpen())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open toc and refresh page, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open toc and refresh page, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
        await toc.closeMenu({ icon: 'toc' });

        await dossierPage.expandCollapsedNavBar();
        await commentsPage.openCommentsPanel();
        await commentsPage.dockCommentPanel();
        await since(
            'After expand collapsed toolbar and open comment panel, comment panel shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await commentsPage.isPanelOpen())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open comment panel, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open comment panel, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
        await dossierPage.reload();
        await since(
            'After expand collapsed toolbar and open comment panel and refresh page, toc panel shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await commentsPage.isPanelOpen())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open comment panel and refresh page, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open comment panel and refresh page, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);

        await commentsPage.closeCommentsPanel();
        await dossierPage.expandCollapsedNavBar();
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();
        await since(
            'After expand collapsed toolbar and open filter panel, comment panel shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await filterPanel.isMainPanelOpen())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open filter panel, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open filter panel, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
        await dossierPage.reload();
        await since(
            'After expand collapsed toolbar and open filter panel and refresh page, toc panel shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await filterPanel.isMainPanelOpen())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open filter panel and refresh page, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since(
            'After expand collapsed toolbar and open filter panel and refresh page, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);

        await filterPanel.closeFilterPanel();
        await dossierPage.expandCollapsedNavBar();
        await dossierPage.goToLibrary();
        // check wheter sidebar is still opened.
        // DE273991 ----
        await since(
            'After go back to library home, side bar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        // await since(
        //     'After go back to library home, toolbar shows up is expected to be #{expected}, instead we have actual #{actual}.'
        // )
        //     .expect(await libraryPage.isNavigationBarPresent())
        //     .toBe(true);
        await since(
            'After go back to library home, collapse icon shows up is expected to be #{expected}, instead we have actual #{actual}.'
        )
            .expect(await libraryPage.isNavBarExpandBtnPresent())
            .toBe(false);
    });
});
