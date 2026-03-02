import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - App-Level User Preference', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };
    let {
        loginPage,
        libraryPage,
        libraryFilter,
        quickSearch,
        searchPage,
        filterPanel,
        toc,
        tocMenu,
        filterSummaryBar,
        commentsPage,
        dossierPage,
    } = browsers.pageObj1;

    let libraryHomeBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoLibraryHomeUserPreference',
    });
    let dossierHomeBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoDossierHomeUserPreference',
        dossierMode: 1,
        sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups'],
        url: `/app/${consts.dossierDEWithFiltersLink.project.id}/${consts.dossierDEWithFiltersLink.id}`,
    });
    let dossierHomeBody2 = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoDossierHomeUserPreference2',
        dossierMode: 1,
        sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups'],
        url: `/app/${consts.dossierDEWithFiltersLink.project.id}/${consts.dossierDEWithFiltersLink.id}`,
    });

    let customAppIdLibraryHome, customAppIdDossierHome, customAppIdDossierHome2;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdLibraryHome, customAppIdDossierHome, customAppIdDossierHome2],
        });
    });

    it('[TC80099] Library as home', async () => {
        // create app
        customAppIdLibraryHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: libraryHomeBody,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHome });
        await libraryPage.waitForLibraryLoading();
        // library search
        await quickSearch.inputTextAndSearch('dossier');
        await searchPage.goToLibrary();

        // library sort
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
        // await libraryPage.openSortMenu();
        // await libraryPage.selectSortOrder('Z-A');

        // library filter
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await libraryPage.closeFilterPanel();

        await libraryPage.openDossier(consts.dossierWithPSfilterLink.name);

        // filter summary
        await filterPanel.openFilterPanel();
        await filterPanel.toggleFilterSummary();
        await filterPanel.dockFilterPanel();
        await filterPanel.closeFilterPanel();

        // TOC
        await toc.openMenu();
        await toc.pinTOC();
        await toc.closeMenu({ icon: 'close' });

        // Comment panel
        await commentsPage.openCommentsPanel();
        await commentsPage.dockCommentPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.openDefaultApp();

        // verify library search
        await quickSearch.openSearchSlider();
        await since('Search view shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await quickSearch.isQuickSearchViewPresent())
            .toBe(false);
        await libraryPage.dismissQuickSearch();

        // verify library sort
        await libraryPage.openSortMenu();
        await since('Sort option is expected be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.currentSortOption())
            .toBe('Date Viewed');
        await since('Sort order is expected be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.currentSortOrder())
            .toBe('Newest on Top');
        await libraryPage.closeSortMenu();

        // verify library filter
        await libraryPage.clickFilterIcon();
        await since('Dossier type selected is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isDossierSelected())
            .toBe(false);
        await libraryPage.closeFilterPanel();

        await libraryPage.openDossier(consts.dossierWithPSfilterLink.name);

        // verify filter summary
        await since('Filter summary shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await filterSummaryBar.isFilterSummaryPresent())
            .toBe(true);

        // verify filter panel dock status
        await filterPanel.openFilterPanel();
        await since('Dock icon in filter panel shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await filterPanel.isDockIconDisplayed())
            .toBe(true);
        await filterPanel.closeFilterPanel();

        // verify toc panel dock status
        await toc.openMenu();
        await since('Dock icon in toc menu shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await tocMenu.isDockIconDisplayed())
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });

        // verify comment panel dock status
        await commentsPage.openCommentsPanel();
        await since('Dock icon in comments panel shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.isDockIconDisplayed())
            .toBe(true);
        await commentsPage.closeCommentsPanel();
    });

    it('[TC80100] Dossier as home', async () => {
        // create app
        customAppIdDossierHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierHomeBody,
        });
        customAppIdDossierHome2 = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierHomeBody2,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDossierHome, dossier: true });
        await dossierPage.waitForDossierLoading();
        // filter summary
        await filterPanel.openFilterPanel();
        await filterPanel.toggleFilterSummary();
        await filterPanel.dockFilterPanel();
        await filterPanel.closeFilterPanel();

        // TOC
        await toc.openMenu();
        await toc.pinTOC();
        await toc.closeMenu({ icon: 'close' });

        // Comment panel
        await commentsPage.openCommentsPanel();
        await commentsPage.dockCommentPanel();
        await commentsPage.closeCommentsPanel();

        await libraryPage.openCustomAppById({ id: customAppIdDossierHome2, dossier: true });
        await dossierPage.waitForDossierLoading();

        // verify filter summary
        await since(
            'When dossier as home, filter summary shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterSummaryBar.isFilterSummaryPresent())
            .toBe(true);

        // verify filter panel dock status
        await filterPanel.openFilterPanel();
        await since(
            'When dossier as home, dock icon in filter panel shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.isDockIconDisplayed())
            .toBe(true);
        await filterPanel.closeFilterPanel();

        // verify toc panel dock status
        await toc.openMenu();
        await since(
            'When dossier as home, dock icon in toc menu shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await tocMenu.isDockIconDisplayed())
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });

        // verify comment panel dock status
        await commentsPage.openCommentsPanel();
        await since(
            'When dossier as home, dock icon in comments panel displayed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await commentsPage.isDockIconDisplayed())
            .toBe(true);
        await commentsPage.closeCommentsPanel();
    });
});
