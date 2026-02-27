import setWindowSize from '../../../config/setWindowSize.js';

describe('Guest Mode for Group, Favorites, Search', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const dossier = {
        id: 'D3B642B84B7C39002668F990DA49ADDE',
        name: 'Reset',
        project: project,
    };
    const dossier2 = {
        id: '9989C9714E97F8E7F2E0D58ACC55FE46',
        name: '(AUTO) GlobalSearch_Test Dossier',
        project: project,
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1000,
        height: 800,
    };

    let {
        libraryPage,
        dossierPage,
        loginPage,
        onboardingTutorial,
        quickSearch,
        fullSearch,
        filterOnSearch,
        toc,
        userAccount,
        infoWindow,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);

        await loginPage.loginAsGuest();

        await libraryPage.sleep(5000); // wait for login
        await onboardingTutorial.clickIntroToLibrarySkip();
    });

    it('[TC70859] Group - Validate guest mode for group on Library Web', async () => {
        // check sidebar
        await libraryPage.clickLibraryIcon();
        await since('In guest mode, click library icon, sidebar is not present')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);

        // check multi-select icons
        await since('In guest mode, group multi-select button is not present')
            .expect(await libraryPage.getMultiSelectButton().isDisplayed())
            .toBe(false);

        // check context menu
        await libraryPage.openDossierContextMenuNoWait(dossier.name);
        await since('In guest mode, right click dossier , context menu is not present')
            .expect(await libraryPage.getDossierContextMenu().isDisplayed())
            .toBe(false);
    });

    it('[TC67855] Favorites - Validate guest mode for favorite dossier', async () => {
        // check image icon
        await libraryPage.hoverDossier(dossier.name);
        await since('In guest mode, hover dossier, favorites icon is not present on dossier image')
            .expect(await libraryPage.getFavoriteIcon(dossier.name).isDisplayed())
            .toBe(false);

        // check info-window
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('In guest mode, favorites icon is not present on info window')
            .expect(await infoWindow.isFavoritesBtnPresent())
            .toBe(false);
        await infoWindow.close();

        // check toc
        await libraryPage.openDossier(dossier.name);
        await toc.openMenu();
        await since('In guest mode, favorites icon is not present on dossier toc menu')
            .expect(await toc.isFavoritesIconPresent())
            .toBe(false);
        await toc.closeMenu({ icon: 'close' });
        await dossierPage.goToLibrary();
    });

    it('[TC85250] Global Search - Validate guest mode for global search', async () => {
        // quick search list
        const keyword = 'a';
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(keyword);
        await since(
            'Search on guest mode, search suggestion shortcut items count should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBeGreaterThan(0);
        await since(
            'Search on guest mode, search suggestion text items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);

        // full search
        await quickSearch.clickViewAll();
        await since('Search on guest mode, All tab should not be present')
            .expect(await fullSearch.isAllTabPresent())
            .toBe(false);

        // filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Dashboard');
        await since('Filter owner on My library tab, Dashboard should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Type', 'Dashboard'))
            .toBe(true);
        await filterOnSearch.applyFilterChanged();

        // sort
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(3);
        await since('Sort by dossier name, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Date Added');
        await since(
            'Sort by dossier name, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier.name))
            .toContain('Added');

        // open dossier
        await fullSearch.openDossierFromSearchResults(dossier.name);
        await dossierPage.goToLibrary();
    });

    it('[TC82366] Validate customized application server error page to include CSP eader', async () => {
        // open invalid url 403
        await libraryPage.openInvalidUrl('jsp/');
        await since('Open invalid url, error page text should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getErrorPageText())
            .toBe('HTTP Status 403 - Forbidden');

        // open invalid url 404
        await libraryPage.openInvalidUrl('auth/ui/');
        await since('Open invalid url, error page text should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getErrorPageText())
            .toBe('HTTP Status 404 - Not Found');

        // open valid url
        await libraryPage.openUrl(dossier.project.id, dossier.id);
    });
});
