import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials, downloadDirectory } from '../../../constants/index.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';
import resetDossierState from '../../../api/resetDossierState.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import path from 'path';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';

const specConfiguration = { ...customCredentials('_recent') };

describe('Recent', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const RWDWithPrompt = {
        id: 'C000A09F476CA7A196745880B5D932F7',
        name: 'Prompt RSD',
        project: project,
    };

    const reportWithParameter = {
        id: '46CF7A7E4FC3DFDAAF75E198B9086184',
        name: 'Report Parameter',
        project: project,
    };

    const dossier = {
        id: '3C84BA0549994604D8D168A88B685BF2',
        name: 'Show data',
        project: project,
    };

    const dossierNotInLibrary = {
        id: '0015FFBA4BA20DED0CBC029F205C3959',
        name: "Winky's dossier",
        project: project,
    };

    const dashboardExportToPDF = {
        id: '38B540944543F631AC69328E43B65139',
        name: '(AUTO) RunAsExportToPDF',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        fileType: '.pdf',
    };

    const linkingSource = {
        id: 'C1177BD84848BAC761C02583D0DE40A0',
        name: '(AUTO) DossierLinking_Pass Filter',
        project: project,
    };

    const saveAndOpenDossier = {
        id: '600EE8B54C5BC551B501B598D09651D9',
        name: '(Auto) Library Recents',
        project: project,
    };

    let {
        libraryPage,
        infoWindow,
        quickSearch,
        fullSearch,
        sidebar,
        promptEditor,
        dossierPage,
        loginPage,
        listView,
        listViewAGGrid,
        group,
        libraryAuthoringPage,
        dossierAuthoringPage,
        grid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.switchUser(specConfiguration.credentials);
        // delete all favorites
        await deleteAllFavorites(specConfiguration.credentials);
    });

    afterEach(async () => {
        //await libraryPage.resetToLibraryHome();
    });

    afterAll(async () => {
        // delete all favorites
        await deleteAllFavorites(specConfiguration.credentials);
        // delete all groups
        await deleteAllGroups(specConfiguration.credentials);
    });

    it('[TC71915_01] Recent - check recent tab list and sort-by/filter options', async () => {
        // reset dossier with prompt first
         await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: RWDWithPrompt,
        });
        // check the empty recent list
        await libraryPage.openSidebar();
        await sidebar.openRecentsSectionList();
        await since('Recent section content display should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('Recently viewed content will appear here.');
        // open different objects
        await sidebar.openAllSectionList();
        await libraryPage.openDossier(reportWithParameter.name);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(RWDWithPrompt.name);
        await promptEditor.waitForEditor();
        await promptEditor.cancelEditor();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.goToLibrary();

        // check the recent tab
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        since('Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(3);
        // check the sort-by and filter options in recent section
        since('The default sort option in recent tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Viewed');
        await libraryPage.openSortMenu();
        since ('Sort options in recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.librarySort.getAllSortOptionsText())
            .toEqual(['Name', 'Owner', 'Date Updated', 'Date Viewed', 'Certified', 'Project', 'Oldest on Top', 'Newest on Top']);

        // change the sort-by option to be Sort by name
        await libraryPage.selectSortOption('Name');
        since('The current items sort-by name in recent tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(['Prompt RSD', 'Report Parameter', 'Show data']);
        // Click Filter Icon, Filter type: Dossier
        await libraryPage.clickFilterIcon();
        await libraryPage.libraryFilter.openFilterTypeDropdown();
        await libraryPage.libraryFilter.checkFilterType('Dashboard');
        await libraryPage.libraryFilter.clickApplyButton();
        const dossierOnly = ['Show data'];
        await since('DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(dossierOnly);

        // switch tabs in library sidebar and check the sort-by and filter options
        await sidebar.openAllSectionList();
        since('The default sort option in All tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Viewed');
        since('Filter option in All tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryFilter.filterApplyCount())
            .toBe('0');

        // check the sort options in All tab
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Certified');

        // go back to Recent tab
        await sidebar.openRecentsSectionList();
        // -- check the sort option
        since('The current sort option in recent tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Name');
        // -- check the filter option
        since('Filter option in Recent tab should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryFilter.filterApplyCount())
            .toBe('1');
        // change the filter option to be certified
        await libraryPage.clickFilterIcon();
        await libraryPage.libraryFilter.selectCertifiedOnly();
        await libraryPage.libraryFilter.clickApplyButton();
        await libraryPage.clearFilters();
        since('Dossier Items count in Recent tab should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(3);
    });

    it('[TC71915_02] Favorites - Favorites and remove from favorites from recent and other entries', async () => {

        // open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.goToLibrary();

        // favorite from recent section home card
        await libraryPage.openSidebar();
        await sidebar.openRecentsSectionList();
        await libraryPage.favoriteByImageIcon(dossier.name);
        
        // check favorite status for info-window
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('Favorite dossier by recent section, favorites button on info-window image should be selected')
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        await since('Path in info window should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.objectTypeInInfoWindow())
            .toContain('Dashboard');
        
        // unfavorite from recent info-window
        await infoWindow.removeFavorite();
        await infoWindow.close();
        await since('Remove Favorite dossier by recent info-window, favorites icon on dossier image should be selected')
            .expect(await libraryPage.isFavoritesIconSelected(dossier.name))
            .toBe(false);

        // favorite from dashboard toolbar in recent section
        await libraryPage.openDossier(dossier.name);
        await dossierPage.favorite();
        await dossierPage.goToLibrary();
        since('Favorite dossier by recent section, favorites icon on dossier image should be selected')
            .expect(await libraryPage.isFavoritesIconSelected(dossier.name))
            .toBe(true);
        
        // check favorite result in favorites section
        await sidebar.openFavoriteSectionList();
        since('Library items count in Favorites section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
    });

    it('[TC71915_03] Recent - Dossier not in library', async () => {
        // remove dossier not in library first
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, dossierNotInLibrary);
         // open dossier which is not in library home
        const currentUrl = await browser.getUrl();
        const url = currentUrl + '/' + dossierNotInLibrary.project.id + '/' + dossierNotInLibrary.id;
        await browser.url(url.toString());
        await dossierPage.waitForDossierLoading();
        await since('Add to Library icon in dossier Toolbar should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await dossierPage.goToLibrary();

        // check the recent section
        await libraryPage.openSidebar();
        await sidebar.openRecentsSectionList();
        since('Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(1);
        since('Add to Library icon on dossier not in library should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.isAddToLibraryIconDisplayed(dossierNotInLibrary.name))
            .toBe(true);
        
        // favorite dossier not in library
        await libraryPage.favoriteByImageIcon(dossierNotInLibrary.name);
        since(
            'Add to Library icon on dossier not in library after favorite should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.libraryItem.isAddToLibraryIconDisplayed(dossierNotInLibrary.name))
            .toBe(false);
        
        // check favorite count in favorites section
        await sidebar.openFavoriteSectionList();
        since('Library items count in Favorites section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
        await libraryPage.removeFavoriteByImageIcon(dossierNotInLibrary.name);
        
        // check the total count in home section
        await sidebar.openAllSectionList();
        since('Library items count in Home section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(6);
    });

    it('[TC71915_04] Recent - Context menu + multi select in list view', async () => {
        // delete all groups first
        await deleteAllGroups(specConfiguration.credentials);
        await libraryPage.reload();

        // reset dossier with prompt first
         await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: RWDWithPrompt,
        });

        // remove dossier not in library first
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, dossierNotInLibrary);

        // open dossier which is not in library home
        const currentUrl = await browser.getUrl();
        const url = currentUrl + '/' + dossierNotInLibrary.project.id + '/' + dossierNotInLibrary.id;
        await browser.url(url.toString());
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        // open objects in library home
        await libraryPage.openDossier(reportWithParameter.name);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(RWDWithPrompt.name);
        await promptEditor.waitForEditor();
        await promptEditor.cancelEditor();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.goToLibrary();

        // check the recent section in list view
        await libraryPage.openSidebar();
        await sidebar.openRecentsSectionList();
        await listView.selectListViewMode(); 

        // select all items and add to new group
        await listViewAGGrid.clickCheckboxSelectAll();
        await listView.rightClickToOpenContextMenu({ name: dossier.name });
        await since(`context menu option should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getContextMenuList())
            .toEqual(['4 items', 'Add to Library', 'Favorite', 'New Group']);
        await libraryPage.clickDossierContextMenuItem('New Group');
        await group.inputGroupName('Recent Group');
        await group.clickGroupSaveBtn();
        await listView.deselectListViewMode();

        // check the group number
        await sidebar.openGroupSection('Recent Group');
        await since(
            `Move to group from recent tab, dossier count of this group should be #{expected}, while we get #{actual}`
        ).expect(await libraryPage.getGroupCountFromTitle('Recent Group')).toBe(4);

        // check the home section
        await sidebar.openAllSectionList();
        since('Library items count in Home section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(6);
    });

    it('[TC71915_05] Recent - Context menu + multi select in grid view', async () => {
        // remove dossier not in library first
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, dossierNotInLibrary);

        // open dossier which is not in library home
        const currentUrl = await browser.getUrl();
        const url = currentUrl + '/' + dossierNotInLibrary.project.id + '/' + dossierNotInLibrary.id;
        await browser.url(url.toString());
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        // open objects in library home
        await libraryPage.openDossier(reportWithParameter.name);
        await dossierPage.goToLibrary();

        // check the recent section in list view
        await libraryPage.openSidebar();
        await sidebar.openRecentsSectionList();
        await listView.deselectListViewMode();

        // multi select and favorite
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossierNotInLibrary.name);
        await libraryPage.selectDossier(reportWithParameter.name);
        await libraryPage.openDossierContextMenu(reportWithParameter.name);
        await since(`context menu option should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getContextMenuList())
            .toEqual(['2 items', 'Add to Library', 'Favorite', 'New Group']);
        await libraryPage.clickDossierContextMenuItem('Favorite');

        // check favorite count in favorites section
        await sidebar.openFavoriteSectionList();
        await since('Library items count in Favorites section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(2);
       
        // check the home section
        await sidebar.openAllSectionList();
        await since('Library items count in Home section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(4);
    });

    it('[TC71915_06] Recent - different open mode ', async () => {
        // consumption
        await libraryPage.openDossierById({
            projectId: project.id,
            dossierId: saveAndOpenDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        // authoring
        await libraryPage.editDossierByUrl({
            projectId: project.id,
            dossierId: dossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        // run as export
        const runAsExport =
            browser.options.baseUrl +
            'app/' +
            dashboardExportToPDF.project.id +
            '/' +
            dashboardExportToPDF.id +
            '/K53--K46/export/pdf';
        console.log('runAsExport' + runAsExport);
        await browser.url(runAsExport);
        const filepath = path.join(downloadDirectory, `${dashboardExportToPDF.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await deleteFile({
            name: dashboardExportToPDF.name,
            fileType: '.pdf',
        });
        await browser.url(browser.options.baseUrl);
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        await since('Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(3);

        // linking target
        await libraryPage.openSidebar();
        await libraryPage.openDossier(linkingSource.name);
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Add to library banner should not be displayed')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();
        await sidebar.openRecentsSectionList();
        await since('Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(4);

        // embedded dossier
    });

    it('[TC71915_07] Recent - local storage ', async () => {
        await libraryPage.openDossier(reportWithParameter.name);
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        await since('Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(1);
        // relogin
        await libraryPage.switchUser(specConfiguration.credentials);
        await since('After re-login, Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(1);

        // switch user
        const switchUser = {
            username: 'shuanwang',
            password: '',
        };
        await libraryPage.switchUser(switchUser);
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        await since('Recent section content display should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('Recently viewed content will appear here.');

        await libraryPage.switchUser(specConfiguration.credentials);
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        await since('Switch user, Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(1);

        // switch custom app
        await libraryPage.openCustomAppById({ id: '6068D82AC32B47219C6BA28846668D81' });
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        await since('After switch app, Recent section content display should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('Recently viewed content will appear here.');
    });

    it('[TC71915_08] Recent - Save and Open', async () => {
        // newly created
        await libraryAuthoringPage.createBlankDashboardFromLibrary();
        await dossierAuthoringPage.saveAndOpen();
        const newDossierName = 'SaveAndOpenDossier' + Math.random(1000);
        await dossierAuthoringPage.inputDossierNameAndSave(newDossierName);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([newDossierName, 'Chapter 1', 'Page 1']);
        await since('Add to Library icon on should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.isAddToLibraryIconDisplayed(dossierNotInLibrary.name))
            .toBe(false);

        await dossierPage.goToLibrary();
        await deleteObjectByNames({
            credentials: specConfiguration.credentials,
            projectId: project.id,
            parentFolderId: 'D3C7D461F69C4610AA6BAA5EF51F4125',
            names: [newDossierName],
        });

        // edit existing
        await libraryPage.editDossierByUrl({
            projectId: saveAndOpenDossier.project.id,
            dossierId: saveAndOpenDossier.id,
        });
        await dossierAuthoringPage.saveAndOpen();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([saveAndOpenDossier.name, 'Chapter 1', 'Page 1']);
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openRecentsSectionList();
        await since('Item list count on Recent section should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.libraryItem.getAllItemsCount())
            .toBe(2);
    });
});
export const config = specConfiguration;
