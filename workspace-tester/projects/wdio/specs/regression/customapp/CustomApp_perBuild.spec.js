import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Custom App on Tanzu per build', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let config = {
        libraryAsHomeCollapsed: 'DA026D6EF010434F899CB09E8DB12E18',
        libraryAsHomeDisableSidebar: '5D7E6544155F4C519C48A1B3394BCECD',
        dossierAsHomeDisableUndoRedo: '32D634C087B44071B75ECD62AA37C401',
        libraryAsHomeiOS: '2B5D3B2BE7BB447BBD4D76FF9482E700',
        libraryAsHomePalette: '8C3B55CFD79C4A39AF699817894083A9',
        libraryAsHomeContentGroup: 'C4161652CA2B486B9484D12775C7A11A',
    };

    const dossierName = 'Call Center Management';
    const dossierPalette = {
        id: '1532D3684B9D88716CFFAA921CA17458',
        name: 'Waterfall',
        project: 'config/C4161652CA2B486B9484D12775C7A11A/B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const userContentGroup = {
        credentials: {
            username: 'web.contentGroup',
            password: 'newman1#',
        },
    };

    const userCustomApp = {
        credentials: {
            username: 'web.customapp',
            password: 'newman1#',
        },
    };

    let {
        libraryPage,
        dossierPage,
        libraryFilter,
        libraryAuthoringPage,
        infoWindow,
        searchPage,
        toc,
        quickSearch,
        loginPage,
        filterPanel,
        commentsPage,
        filterSummaryBar,
        tocMenu,
        dossierAuthoringPage,
        sidebar,
        fullSearch,
        graphMatrix,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(userCustomApp.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    it('[TC82381] Library Web - CustomApp - Verify customized item for custom app', async () => {
        // check disable side bar link
        await libraryPage.openCustomAppById({ id: config.libraryAsHomeDisableSidebar });
        let currentUrl = await browser.getUrl();
        await since('URL contain config id is expected to be #{expected}, instead we have #{actual}.')
            .expect(currentUrl.includes(config.libraryAsHomeDisableSidebar))
            .toBe(true);
        // check library icon is not there
        await since('library icon displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isLibraryIconPresent())
            .toBe(false);

        // check disable account link
        await libraryPage.openCustomAppById({ id: config.dossierAsHomeDisableUndoRedo });
        await dossierPage.waitForDossierLoading();

        // check undo redo button is not there
        await since('Undo icon displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getUndoIcon().isDisplayed())
            .toBe(false);
        await since('Redo icon displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getRedoIcon().isDisplayed())
            .toBe(false);

        // check collapse toolbar link
        await libraryPage.openCustomAppById({ id: config.libraryAsHomeCollapsed });
        await since('narviation bar displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isNavigationBarPresent())
            .toBe(false);
        // check edit icon is not in the infowindow
        await libraryPage.openDossierInfoWindow(dossierName);
        await since('edit button displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);

        // run dossier check collapsed toolbar
        await libraryPage.openDossier(dossierName);
        await since('Is narviation bar displayed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isNavigationBarPresent())
            .toBe(false);
        await dossierPage.expandCollapsedNavBar();
        // check edit icon is not in the nav bar
        await since('edit button displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(false);
    });

    it('[TC82384] Library Web - CustomApp - Verify user preference for custom app', async () => {
        await dossierPage.openCustomAppById({ id: config.libraryAsHomeiOS });
        // library search
        await quickSearch.inputTextAndSearch('dossier');
        await searchPage.goToLibrary();

        // library sort
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOrder('Z-A');

        // library filter
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await libraryPage.closeFilterPanel();

        await libraryPage.openDossier(dossierName);

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
        await since('search result displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await quickSearch.isQuickSearchViewPresent())
            .toBe(false);
        await libraryPage.dismissQuickSearch();

        // verify library sort
        await libraryPage.openSortMenu();
        await since('Sort option should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.currentSortOption())
            .toBe('Date Viewed');
        await since('Sort order should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.currentSortOrder())
            .toBe('Newest on Top');
        await libraryPage.closeSortMenu();

        // verify library filter
        await libraryPage.clickFilterIcon();
        await since(
            'In library filter, Dossier selected status is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.isDossierSelected())
            .toBe(false);
        await libraryPage.closeFilterPanel();

        await libraryPage.openDossier(dossierName);

        // verify filter summary
        await since('Filter summary displayed to be #{expected}, instead we have #{actual}.')
            .expect(await filterSummaryBar.isFilterSummaryPresent())
            .toBe(true);

        // verify filter panel dock status
        await filterPanel.openFilterPanel();
        await since('Dock icon in filter panel displayed is expectedto be #{expected}, instead we have #{actual}.')
            .expect(await filterPanel.isDockIconDisplayed())
            .toBe(true);
        await filterPanel.closeFilterPanel();

        // verify toc panel dock status
        await toc.openMenu();
        await since('Dock icon in toc panel displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await tocMenu.isDockIconDisplayed())
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });

        // verify comment panel dock status
        await commentsPage.openCommentsPanel();
        await since('Dock icon displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.isDockIconDisplayed())
            .toBe(true);
        await commentsPage.closeCommentsPanel();
    });

    // check custom palettes
    it('[TC82385] Library Web - CustomApp - verify custom palettes for custom app', async () => {
        // dossier using customized palette
        await dossierPage.openCustomAppById({ id: config.libraryAsHomePalette });
        await libraryPage.openDossier(dossierPalette.name);
        await since(
            'After run dosser in the custom app, the fill color of the box plot should be  #{expected} instead we have #{actual}.'
        )
            .expect(await graphMatrix.getBoxPlotFillColor())
            .toBe('rgb(225,245,201)');
        await libraryAuthoringPage.editDossierFromLibrary();
        await since('After edit dossier, the fill color of the box plot should be changed to the custom palette')
            .expect(await graphMatrix.getBoxPlotFillColor())
            .toBe('rgb(225,245,201)');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await since(
            'After edit dossier, the palettes in format menu should includes #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierAuthoringPage.getPaletteNames())
            .toContain('(Default) rainy');
        await since('After edit dossier, the default palette should be checked, instead we have #{actual}.')
            .expect(await dossierAuthoringPage.isPaletteChecked('rainy'))
            .toBe(true);
        // change to Sunset
        await dossierAuthoringPage.actionOnSubmenu('sunny');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'After switch to sunny palette, the box plot fill color should be #{expected}, instead we have #{actual}.'
        )
            .expect(await graphMatrix.getBoxPlotFillColor())
            .toBe('rgb(251,218,217)');
        // save and exit edit mode, check palette is applied
        await dossierAuthoringPage.clickSaveDossierButton(dossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        // change back
        await dossierPage.openCustomAppById({ id: config.libraryAsHomePalette });
        await libraryPage.openDossier(dossierPalette.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await since(
            'After save and reopen dossier, the box plot fill color should be #{expected}, instead we have #{actual}.'
        )
            .expect(await graphMatrix.getBoxPlotFillColor())
            .toBe('rgb(251,218,217)');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await since(
            'After save and reopen dossier, the default palette should not be checked, instead we have #{actual}.'
        )
            .expect(await dossierAuthoringPage.isPaletteChecked('rainy'))
            .toBe(false);
        await since('After save and reopen dossier, the sunny palette should be checked, instead we have #{actual}.')
            .expect(await dossierAuthoringPage.isPaletteChecked('sunny'))
            .toBe(true);
        await dossierAuthoringPage.actionOnSubmenu('(Default) rainy');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since(
            'After use default palette, the box plot fill color should be #{expected}, instead we have #{actual}.'
        )
            .expect(await graphMatrix.getBoxPlotFillColor())
            .toBe('rgb(225,245,201)');
        await dossierAuthoringPage.clickSaveDossierButton(dossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await since(
            'After save and reopen dossier, the box plot fill color should be #{expected}, instead we have #{actual}.'
        )
            .expect(await graphMatrix.getBoxPlotFillColor())
            .toBe('rgb(225,245,201)');
    });

    // check content group
    it('[TC82383] Library Web - CustomApp - verify content group for custom app', async () => {
        // non -recipient login, should see empty content
        await dossierPage.openCustomAppById({ id: config.libraryAsHomeContentGroup });
        await since('Is library empty to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        await libraryPage.switchUser(userContentGroup.credentials);
        // expand side bar to check default groups and my groups
        await libraryPage.clickLibraryIcon();
        await sidebar.openAllSectionList();
        await since('content group displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await sidebar.isGroupExisted('Content Group'))
            .toBe(true);
        await sidebar.openGroupSection('Content Group');
        await since('New group content count should be #{expected}, while we get #{actual}.')
            .expect(await libraryPage.getGroupCountFromTitle('Content Group'))
            .toBe(2);
        // user search should only see ressult in his own library
        await quickSearch.inputTextAndSearch('dossier');
        await since('all tab displayed in search result page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await fullSearch.isAllTabPresent())
            .toBe(false);
        await fullSearch.backToLibrary();
        // open share link, no add to library button
        await libraryPage.openUrl(dossierPalette.project, dossierPalette.id);
        await since('add to library button displayed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
    });
});
