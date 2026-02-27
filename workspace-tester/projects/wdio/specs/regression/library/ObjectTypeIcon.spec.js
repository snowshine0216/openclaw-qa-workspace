import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_home') };

describe('Object Type', () => {
    const dossier = {
        id: 'E4F211FF456BCA08EA6AD0B6DD869C0C',
        name: 'Dossier General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdSample = {
        id: 'E0A287A543C415BDE985778B5CFD7764',
        name: 'Sample RSD with selector and link drill',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        adminPage,
        dossierPage,
        infoWindow,
        libraryPage,
        loginPage,
        sidebar,
        quickSearch,
        fullSearch,
        listView,
        listViewAGGrid,
        contentDiscovery,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.logoutClearCacheAndLogin(specConfiguration.credentials);
    });

    it('[TC96588_01] Verify Library Object Type icon for Library Home - web view', async () => {
        // sort by name
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Name');

        // check grid view icon
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(dossier.name))
            .toBe(true);
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(rsdSample.name))
            .toBe(true);
        await libraryPage.libraryItem.hoverOnObjectTypeIcon(dossier.name);
        await since('Tooltip shows for grid view icon is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip())
            .toBe('Dashboard');
        await libraryPage.openDossierInfoWindow(rsdSample.name);
        await since(
            'For info window, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.objectTypeInInfoWindow())
            .toContain('Document');

        // check search result
        await quickSearch.openSearchSlider();
        await quickSearch.inputText('Sample RSD');
        await since(
            'For search suggestion, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await quickSearch.isSearchSuggestionObjectTypeIconDisplayed(rsdSample.name))
            .toBe(true);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await since(
            'In search result page, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isObjectTypeIconInSearchResultsDisplayed(rsdSample.name))
            .toBe(true);
        await fullSearch.openInfoWindow(rsdSample.name);
        await since('For Grid view info window, Object Type icon should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.objectTypeInInfoWindow())
            .toContain('Document');
        await fullSearch.backToLibrary();

        // check list view icon
        await listView.selectListViewMode();
        await since('Library Object Type icon for list view should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isSortBarColumnElementPresent('Type'))
            .toBe(true);
        await listViewAGGrid.clickInfoWindowIconInGrid(dossier.name);
        await since('For List View info window, Object Type icon should be #{expected}, instead we have #{actual}')
            .expect(await listView.objectTypeInListViewIndoWindow())
            .toContain('Dashboard');
        await listView.clickCloseIcon();
    });

    it('[TC96588_02] Verify Library Object Type icon for Library Home - mobile view', async () => {
        await setWindowSize({
            width: 360,
            height: 800,
        });

        // check grid view icon
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(dossier.name))
            .toBe(true);
        await libraryPage.libraryItem.hoverOnObjectTypeIcon(dossier.name);
        await since('Tooltip shows for grid view icon is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip())
            .toBe('Dashboard');
        await libraryPage.moveDossierIntoViewPort(rsdSample.name);
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(rsdSample.name))
            .toBe(true);
        await libraryPage.openDossierInfoWindow(rsdSample.name);
        await since(
            'For info window, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.objectTypeInInfoWindow())
            .toContain('Document');
        await infoWindow.close();

        // check list view icon
        await listView.selectListViewModeMobile();
        await since('Library Object Type icon for list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.objectTypeInListMobileViewDisplayed(rsdSample.name))
            .toBe(true);
        await listView.openInfoWindowFromMobileView(dossier.name);
        await since(
            'For List View info window, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await listView.objectTypeInListViewIndoWindow())
            .toContain('Dashboard');
        await listView.clickCloseIcon();
    });

    it('[TC96588_03] Verify Library Object Type icon for Library Home - disable object in custom app', async () => {
        await libraryPage.openCustomAppById({ id: 'A55BF2E39B37499BBAB1140F7A64751F' });

        // check grid view icon
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(dossier.name))
            .toBe(false);
        await libraryPage.openDossierInfoWindow(rsdSample.name);
        await since(
            'For info window, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isObjectTypeInInfoWindowPresent())
            .toBe(false);

        // search
        await quickSearch.openSearchSlider();
        await quickSearch.inputText('Sample RSD');
        await since(
            'For search suggestion, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await quickSearch.isSearchSuggestionObjectTypeIconDisplayed(rsdSample.name))
            .toBe(false);
        await quickSearch.clickViewAll();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await since(
            'In search result page, Library Object Type icon for grid view should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.isObjectTypeIconInSearchResultsDisplayed(rsdSample.name))
            .toBe(false);
        await fullSearch.backToLibrary();

        // content discovery
        await libraryPage.openSidebar();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - Content Discovery']);
        await since('Library Object Type icon for content discovery should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isSortBarColumnElementPresent('Type'))
            .toBe(false);
        await sidebar.clickAllSection();
        await libraryPage.closeSidebar();

        // list view
        await listView.selectListViewMode();
        await since('Library Object Type icon for list view should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.isSortBarColumnElementPresent('Type'))
            .toBe(false);

        await setWindowSize({
            width: 360,
            height: 740,
        });
        await since('Library Object Type icon for list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.objectTypeInListMobileViewDisplayed(rsdSample.name))
            .toBe(false);
        await listView.openInfoWindowFromMobileView(dossier.name);
        await since('For info window, Library Object Type icon should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectTypeInInfoWindowPresent())
            .toBe(false);
        await listView.clickCloseIcon();

        // check list view icon
        await listView.deselectListViewModeMobile();
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(rsdSample.name))
            .toBe(false);
        await libraryPage.openCustomAppById({ id: '' });
    });
});

export const config = specConfiguration;
