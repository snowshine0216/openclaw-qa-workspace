import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import deleteAllDataModelFavorites from '../../../api/dataModel/deleteAllDataModelFavorites.js';
import resetCertify from '../../../api/resetCertify.js';

const specConfiguration = { ...customCredentials('_datamodel') };

describe('Data Model on Data Model Page', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const datamodel_base = {
        id: 'F5DC9A8174144EE0999A2FDC59D169BF',
        name: '(AUTO) Data Model',
        project: project,
    };
    const datamodel_fullACL = {
        id: '636AF4B74EDD2E98108A73A1B8AE3025',
        name: '(AUTO) Data Model_Full',
        project: project,
    };
    const datamodel_folder = {
        name: 'Target Folder',
        path: ['Shared Reports', '_Automation_', 'Data Model'],
    };
    const moveToFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'TargetMoveToFolder'],
    };
    const shortcutFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'ShortcutFolder'],
    };
    const datamodel_copyName = datamodel_base.name + '_Copy' + Math.random();
    const datamodel_rename = datamodel_base.name + '_Rename' + Math.random();
    const user_acess = {
        username: 'DM_FM_ACL',
        password: '',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        infoWindow,
        libraryFilter,
        manageAccess,
        copyMoveWindow,
        sidebar,
        contentDiscovery,
        loginPage,
        listView,
        quickSearch,
        fullSearch,
        filterOnSearch,
        botAuthoring,
        dossierAuthoringPage,
        libraryAuthoringPage,
        dataModel,
        securityFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);

        // // delete all favorites
        await deleteAllDataModelFavorites(specConfiguration.credentials);

        // open data model page
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        // sort data model
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
    });

    beforeEach(async () => {
        // open data model page
        await libraryPage.resetToLibraryHome();
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await listView.deselectListViewMode();
    });

    it('[TC96809] Data model - Grid view and list view', async () => {
        //reset certify status in case unstable context menu screenshot
        const isCertified = await libraryPage.libraryItem.isItemCertified(datamodel_base.name);
        if (isCertified) {
            await resetCertify({
                dossier: datamodel_base,
                credentials: specConfiguration.credentials,
                type: '3',
                certify: false,
            });
            await libraryPage.refresh();
        }

        // grid view
        //// context menu
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await since(
            'Open context menu on gid view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(15);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96809', 'gridView_ContextMenu');
        //// info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Open info window on gid view, action buttons count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(6);
        await since(
            'Open info window on gid view, related content present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC96809', 'gridView_infoWindow');
        await infoWindow.close();

        // switch to list view
        await listView.selectListViewMode();
        //// context menu
        await listView.openContextMenu(datamodel_base.name);
        await since(
            'Open context menu on list view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(14);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96809', 'listView_ContextMenu');
        //// info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Open info window on list view, info window present should be #{expected}, while we get #{actual}')
            .expect(await listView.isListViewInfoWindowPresent())
            .toBe(true);
        await since('Open info window on list view, action buttons count should be #{expected}, while we get #{actual}')
            .expect(await listView.getInfoWindowActionCount())
            .toBe(6);
        await since(
            'Open info window on gid view, related content present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(listView.getItemShare(), 'TC96809', 'listView_infoWindow');

        // multi-select
        await listView.selectItemInListView(datamodel_base.name);
        await listView.selectItemInListView(datamodel_fullACL.name);
        await listView.openContextMenu(datamodel_base.name);
        await since(
            'Open context menu on list view in multi-select mode, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(2);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC96809',
            'multiSelect_listView_ContextMenu'
        );
        //// switch to grid view
        await listView.deselectListViewMode();
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await since(
            'Open context menu on grid view in multi-select mode,, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(2);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC96809',
            'multiSelect_ListView_ContextMenu'
        );
        await libraryPage.clickDossierContextMenuItem('2 items');
    });

    it('[TC96810] Data model - Create and edit data model', async () => {
        // create new data model
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('Create data model, data model button present should be #{expected}, while we get #{actual}')
            .expect(await libraryAuthoringPage.isCreateDataModelBtnPresent())
            .toBe(true);
        await takeScreenshotByElement(libraryAuthoringPage.getCreateNewPanelContent(), 'TC96810', 'createDataModel');
        // await libraryAuthoringPage.clickNewDataModelButton();
        // await since('Create data model, project list window present should be #{expected}, while we get #{actual}')
        //     .expect(await libraryAuthoringPage.isProjectSelectionWindowPresent())
        //     .toBe(true);
        // await libraryAuthoringPage.selectProject(project.name);
        // await libraryAuthoringPage.saveProjectSelection();
        // await dataModel.waitForNewDataModelLoading();
        // await dataModel.clickLibraryIcon();

        // // edit data model from info window
        // await libraryPage.openDossierInfoWindow(datamodel_base.name);
        // await infoWindow.clickEditButton();
        // await since(
        //     'Edit data model from info window, project list window present should be #{expected}, while we get #{actual}'
        // )
        //     .expect(await libraryAuthoringPage.isProjectSelectionWindowPresent())
        //     .toBe(false);
        // await dataModel.waitForEditDataModelLoading();
        // await dataModel.clickLibraryIcon();

        // // edit data model from contex menu
        // await libraryPage.openDossierContextMenu(datamodel_base.name);
        // await libraryPage.clickDossierContenxtMenuItem('Edit');
        // await since(
        //     'Edit data model from context menu, project list window present should be #{expected}, while we get #{actual}'
        // )
        //     .expect(await libraryAuthoringPage.isProjectSelectionWindowPresent())
        //     .toBe(false);
        // await dataModel.waitForEditDataModelLoading();
        // await dataModel.clickLibraryIcon();
    });

    it('[TC96818] Data Model - Open data model from different entries', async () => {
        // Grid view - open by image
        await libraryPage.openDossier(datamodel_base.name);
        await since('Open from image on grid view , authoring title should be #{expected}, while we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('New Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // Grid view - open by info window
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await infoWindow.clickCoverImage();
        await since('Openfrom info window on grid view,  authoring title should be #{expected}, while we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('New Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // List view - open by image
        await listView.selectListViewMode();
        await listView.openDossier(datamodel_base.name);
        await since('Open from image on list view , authoring title should be #{expected}, while we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('New Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // List view - open by info window
        await listView.openInfoWindowFromListView(datamodel_base.name);
        await listView.clickCoverImageOnInfoWindow();
        await since(
            'Open from info window on list view , authoring title should be #{expected}, while we get #{actual}'
        )
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('New Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // Search results page - open by image
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(datamodel_base.name);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResults(datamodel_base.name);
        await since('Open from search results , authoring title should be #{expected}, while we get #{actual}')
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('New Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // Search results page - open by info window
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(datamodel_base.name);
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(datamodel_base.name);
        await infoWindow.clickCoverImage();
        await since(
            'Open from info window on search results , authoring title should be #{expected}, while we get #{actual}'
        )
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('New Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC96820] Data Model - Create dashboard and bot', async () => {
        // create dashoard - from context menu
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await since('Create dashboard present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create Dashboard'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Create Dashboard');
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // create dashoard - from info window
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await since('Create dashboard on info window present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateDashboardPresent())
            .toBe(true);
        await infoWindow.clickCreateDashboardButton();
        await dossierAuthoringPage.closeDossierWithoutSaving();

        // create bot - from context menu
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await since('Create bot present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create Bot'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Create Bot');
        await botAuthoring.exitBotAuthoringWithoutSave();

        // create bot - from info window
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await since('Create dashboard on info window present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateBotPresent())
            .toBe(true);
        await infoWindow.clickCreateBotButton();
        await botAuthoring.exitBotAuthoringWithoutSave();
    });

    it('[TC96822] Data Model - Favorite data model', async () => {
        const dataModelCount = await libraryPage.getDataModelCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();
        // favorite by card
        await libraryPage.moveDossierIntoViewPort(datamodel_base.name);
        await libraryPage.favoriteByImageIcon(datamodel_base.name);
        await libraryPage.sleep(1000); // wait for static rendering
        // -- favorites count
        await since('Favorite by card, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        // -- data model count
        await since('Favorite by card, the total data model count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataModelCount - 1);

        // favorite by info window
        await libraryPage.openDossierInfoWindow(datamodel_fullACL.name);
        await infoWindow.favorite();
        await infoWindow.sleep(500); // wait for static rendering
        // -- data model count
        await since('Favorite by infowindow, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 2);
        // -- favorites count
        await since('Favorite by infowindow, the total data model count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataModelCount - 2);

        // remove favorite by context menu in multi-select mode
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(datamodel_base.name);
        await libraryPage.selectDossier(datamodel_fullACL.name);
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96614_04', 'favorites_multiSelect');
        await libraryPage.clickDossierContextMenuItem('Remove from Favorites');
        // -- data model count
        await since(
            'remove favorite by context menu, the total data model count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(dataModelCount);
        // -- favorites section
        await since('Remove favorite, Favorites present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
    });

    it('[TC96823] Data Model - object management(copy to, move to, rename, delete) on data model', async () => {
        const waitTime = 2000;
        const count = await libraryPage.getDataModelCountFromTitle();
        console.log('data model initial count: ', count);

        // copy to
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await libraryPage.clickDossierContextMenuItem('Copy to');
        await since('copy data model, copy to window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await takeScreenshotByElement(copyMoveWindow.getCopyMoveContent(), 'TC96823', 'copyToWindow');
        await copyMoveWindow.renameDossier(datamodel_copyName);
        await copyMoveWindow.openFolder('My Reports');
        await copyMoveWindow.clickCreate();
        console.log('copy to: ', datamodel_copyName);

        await libraryPage.sleep(waitTime); // delay to send get data model request
        await libraryPage.refresh(); // refresh to get the new data model due to time delay
        await libraryPage.openSidebarOnly();
        await since('copy data model, data model count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count + 1);

        // move to
        await libraryPage.openDossierContextMenu(datamodel_copyName);
        await libraryPage.clickDossierContextMenuItem('Move to');
        await since('move to data model, move to window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await copyMoveWindow.openFolderByPath(moveToFolder.path);
        await copyMoveWindow.clickCreate();
        console.log('move to: ', datamodel_copyName);

        await libraryPage.sleep(waitTime); // delay to send get data model request
        await libraryPage.refresh(); // refresh to get the new data model due to time delay
        await since('copy data model, data model count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count + 1);

        // rename
        await libraryPage.openDossierContextMenu(datamodel_copyName);
        await libraryPage.clickDossierContextMenuItem('Rename');
        await libraryPage.renameDossier(datamodel_rename);
        console.log('rename: ', datamodel_rename);

        await libraryPage.sleep(waitTime * 2); // delay to send get data model request
        await libraryPage.refresh(); // refresh to get the new data model due to time delay

        // delete
        await libraryPage.openDossierContextMenu(datamodel_rename);
        await libraryPage.clickDossierContextMenuItem('Delete');
        await since('delete data model, delete window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isDeleteWindowPresent())
            .toBe(true);
        await libraryPage.confirmDelete();
        await libraryPage.waitForProgressBarGone();
        await since('delete data model, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        console.log('delete: ', datamodel_rename);

        await libraryPage.sleep(waitTime); // delay to send get data model request
        await libraryPage.refresh(); // refresh to get the new data model due to time delay
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await sidebar.openDataSection();
        await since('delete data model, data model count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count);
    });

    it('[TC96824] Data Model - Create shortcut on data model', async () => {
        const count = await libraryPage.getDataModelCountFromTitle();
        await libraryPage.openDossierContextMenu(datamodel_base.name);

        // create shortcut
        await libraryPage.clickDossierContextMenuItem('Create Shortcut');
        await since('creat shorcut, window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await since('creat shorcut, project should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.getProject())
            .toBe(project.name);
        await copyMoveWindow.openFolderByPath(shortcutFolder.path);
        await copyMoveWindow.clickCreate();

        await libraryPage.refresh(); // refresh to get the new data model due to time delay
        await since('create shortcut data model, count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count);

        // delete data model - error shows
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await libraryPage.clickDossierContextMenuItem('Delete');
        await since('delete data model, delete window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isDeleteWindowPresent())
            .toBe(true);
        await takeScreenshotByElement(libraryPage.getDeleteConfirmationWindow(), 'TC96824', 'deleteDataModel');
        await libraryPage.confirmDelete();
        await takeScreenshotByElement(libraryPage.getErrorDialogMainContainer(), 'TC96824', 'deleteDataModel_error');
        await since('delete data model, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await libraryPage.dismissError();

        // open content disvovery page
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(shortcutFolder.path);
        // delete shortcut data model
        await listView.openContextMenu(datamodel_base.name);
        await listView.clickContextMenuItem('Delete');
        await libraryPage.confirmDelete();
        await since('delete shorcut data model, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
    });

    it('[TC96831] Data Model - Manage access on data model ', async () => {
        await libraryPage.openDossierInfoWindow(datamodel_fullACL.name);

        // open manage access
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since('open manage access, manage access window present should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.isManageAccessPresent())
            .toBe(true);
        // clear dirty data
        const isExisted = await manageAccess.isUserACLExisted(user_acess.username);
        if (isExisted) {
            await manageAccess.removeACL(user_acess.username);
        }

        await takeScreenshotByElement(manageAccess.getManageAccessDialog(), 'TC96831', 'manageAccessWindow');
        const acl_count = await manageAccess.getACLItemscount();

        // add acl
        await manageAccess.addACL([user_acess.username], [], 'Can View');
        await since('add acl, acl items count should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.getACLItemscount())
            .toBe(acl_count + 1);

        // delete acl
        await manageAccess.removeACL(user_acess.username);
        await since('delete acl, acl items count should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.getACLItemscount())
            .toBe(acl_count);

        await manageAccess.cancelManageAccessChange();
        await infoWindow.close();
    });

    it('[TC96832] Data Model - Certify data model', async () => {
        // await infoWindow.close();
        const isCertified = await libraryPage.libraryItem.isItemCertified(datamodel_fullACL.name);
        if (isCertified) {
            await resetCertify({
                dossier: datamodel_fullACL,
                credentials: specConfiguration.credentials,
                type: '3',
                certify: false,
            });
            await libraryPage.refresh();
        }

        // Certify data model
        await libraryPage.openDossierContextMenu(datamodel_fullACL.name);
        await since('On contenxt menu, Certify present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Certify'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Certify');

        // check cerify status
        await libraryPage.openDossierInfoWindow(datamodel_fullACL.name);
        await since('Certified, On info window, Certify present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCertifiedPresent())
            .toBe(true);
        await infoWindow.close();

        // switch to content discovery
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(datamodel_folder.path);

        // decertify
        await listView.openContextMenu(datamodel_fullACL.name);
        await listView.clickContextMenuItem('Decertify');
        await listView.openInfoWindowFromListView(datamodel_fullACL.name);
        await since('Decertified, On info window, Certify present should be #{expected}, while we get #{actual}')
            .expect(await listView.isCertifiedPresentInInfoWindow())
            .toBe(false);
        await listView.clickCloseIcon();
    });

    it('[TC96834] Data Model - Security filter on data model', async () => {
        // open from context menu
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await libraryPage.clickDossierContextMenuItem('Security Filter');
        await libraryPage.sleep(1000); //wait rendering
        await since('click security filter, window present should be #{expected}, while we get #{actual}')
            .expect(await securityFilter.isSecurityFilterDialogPresent())
            .toBe(true);
        await takeScreenshotByElement(securityFilter.getSecurityFilterContainer(), 'TC96834', 'securityFilter_main');
        //// -- new security filter
        await securityFilter.clickNewIcon();
        await since('snew security filter, window present should be #{expected}, while we get #{actual}')
            .expect(await securityFilter.isNewQualificationEditorPresent())
            .toBe(true);
        await takeScreenshotByElement(securityFilter.getSecurityFilterContainer(), 'TC96834', 'securityFilter_new');
        //// -- new qualification
        await securityFilter.clickNewQualificaiton();
        await since('new qualification, qualification editor present should be #{expected}, while we get #{actual}')
            .expect(await securityFilter.isNewQualificationEditorPresent())
            .toBe(true);
        await takeScreenshotByElement(
            securityFilter.getSecurityFilterContainer(),
            'TC96834',
            'securityFilter_qualification',
            { tolerance: 0.15 }
        );
        await securityFilter.cancelNewQualification();
        await securityFilter.cancelNewSecurity();
        await securityFilter.cancelSecurityFilterDialog();

        // open from info window
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await since('open info window, security filter button present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isSecurityFilterPresent())
            .toBe(true);
        await infoWindow.clickSecurityFilterButton();
        await securityFilter.clickNewIcon();
        await since('snew security filter, window present should be #{expected}, while we get #{actual}')
            .expect(await securityFilter.isNewQualificationEditorPresent())
            .toBe(true);
        await securityFilter.cancelNewSecurity();
        await securityFilter.closeDialogue();
    });
});
export const config = specConfiguration;
