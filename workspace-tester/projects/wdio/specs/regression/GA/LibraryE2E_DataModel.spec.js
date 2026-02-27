import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import deleteAllDataModelFavorites from '../../../api/dataModel/deleteAllDataModelFavorites.js';

const specConfiguration = { ...customCredentials('_datamodel') };

describe('Data Model E2E', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const datamodel_E2E = {
        id: 'B5844907A6534DC38AE516DDA4BA0FC6',
        name: '(AUTO) Data Model E2E',
        project: project,
    };
    const datamodel_folder = {
        name: 'Target Folder',
        path: ['Shared Reports', '_Automation_', 'Data Model'],
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { libraryPage, infoWindow, sidebar, contentDiscovery, loginPage, listView, quickSearch, fullSearch } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);

        // delete all favorites
        await deleteAllDataModelFavorites(specConfiguration.credentials);
    });

    beforeEach(async () => {
        // open data model page
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await listView.deselectListViewMode();

        // sort data model
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('A-Z');
    });

    it('[TC96614] Validate data model E2E workflow on Library Web', async () => {
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();
        const dataModelCount = await libraryPage.getDataModelCountFromTitle();

        // Date model page - context menu
        await libraryPage.openDossierContextMenu(datamodel_E2E.name);
        await since(
            'Open context menu on gid view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(14);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96614', 'gridView_ContextMenu');

        // Data model page - info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Open info window on gid view, action buttons count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(6);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC96614', 'gridView_infoWindow');

        // Favorite data model
        await infoWindow.favorite();
        await since('Favorite, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since('Favorite, the total data model count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataModelCount - 1);

        // content discovery
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(datamodel_folder.path);
        //// -- context menu
        await listView.openContextMenu(datamodel_E2E.name);
        await since('On content discovery, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);

        // search data model
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(datamodel_E2E.name);
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(datamodel_E2E.name);
        await since('On search results, info window action buttons count should #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(6);
        await since('On search results, favorite selected should #{expected}, while we get #{actual}')
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC96614', 'CD_infoWindow');
        await infoWindow.removeFavorite();
        await fullSearch.backToLibrary();
    });
});
export const config = specConfiguration;
