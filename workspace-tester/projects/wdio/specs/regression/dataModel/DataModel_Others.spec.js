import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import deleteAllDataModelFavorites from '../../../api/dataModel/deleteAllDataModelFavorites.js';
import { verifyRequestContent } from '../../../api/pendo/pendoEventDecoder.js';

const specConfiguration = { ...customCredentials('_datamodel_pendo') };

describe('Data Model on Others', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const datamodel_base = {
        id: 'F5DC9A8174144EE0999A2FDC59D169BF',
        name: '(AUTO) Data Model',
        project: project,
    };
    const datamodel_CD = {
        id: 'EC8458A044CFB29F65E0C5B5831A4252',
        name: '(AUTO) Data Model_CD',
        project: project,
    };
    const datamodel_fullACL = {
        id: '1D7E2EBA40981201FE3CE9BE9368C9C7',
        name: '(AUTO) Data Model_Full',
        project: project,
    };
    const datamodel_modifyACL = {
        id: '697DA16E4042A6DA0A67E7B4B61A686F',
        name: '(AUTO) Data Model_Modify',
        project: project,
    };
    const datamodel_writeACL = {
        id: '83B123C64CEBE1D4A7D3F083C3CB810F',
        name: '(AUTO) Data Model_Write',
        project: project,
    };
    const datamodel_viewACL = {
        id: 'EE19BF62405C4F5C1AE0D48D48D7788C',
        name: '(AUTO) Data Model_View',
        project: project,
    };
    const datamodel_folder = {
        name: 'Target Folder',
        path: ['Shared Reports', '_Automation_', 'Data Model'],
    };
    const customApp_NoDM = {
        id: 'EA9FE42CAEE04D9BB043C7C317C76074',
        name: '(AUTO) DataModel_NoDM',
    };
    const customApp_NoCreateDM = {
        id: 'AD9491A57BFC4E32AF0B932F3545BF88',
        name: '(AUTO) DataModel_NoCreateDM',
    };
    const customApp_NoFavoritesAndCreateBD = {
        id: '74F80B2A14894ECD870C74292712731F',
        name: '(AUTO) DataModel_NoFavoritesAndCreateBD',
    };
    const user_ACL = {
        username: 'tester_auto_DM_ACL',
        password: '',
    };
    const user_NoDM = {
        username: 'tester_auto_NoDataModel',
        password: '',
    };
    const user_NoCreateDashboard = {
        username: 'tester_auto_DM_NoCreateDB',
        password: '',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        infoWindow,
        manageAccess,
        sidebar,
        contentDiscovery,
        loginPage,
        listView,
        quickSearch,
        fullSearch,
        filterOnSearch,
        libraryAuthoringPage,
        securityFilter,
        userAccount,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);

        // delete all favorites
        await deleteAllDataModelFavorites(specConfiguration.credentials);

        // open data model page
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        // sort data model
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);

        // open default app
        await libraryPage.openDefaultApp();

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

    it('[TC96841] Data Model - Data model on search results page', async () => {
        // search
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(datamodel_base.name);
        await fullSearch.clickAllTab();
        const allCount = await fullSearch.getAllTabCount();

        // filter on search results page
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Data Model');
        await filterOnSearch.applyFilterChanged();
        await since(
            'Filter on search results page, data model count should be less than #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getAllTabCount())
            .toBeLessThan(allCount);

        // check data model
        await fullSearch.openInfoWindow(datamodel_base.name);
        await since(
            'Open info window on search results, action buttons count should #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(6);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC96841', 'InfoWindow_searchPage', {
            tolerance: 0.12,
        });
        await infoWindow.close();

        await fullSearch.backToLibrary();
    });

    it('[TC96842] Data Model - Data model on content discovery page', async () => {
        // open content discovery
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(datamodel_folder.path);

        // hover
        await listView.hoverDossier(datamodel_CD.name);
        await since('Hover on list view,favorites icon present is supposed to be #{expected},instead we have #{actual}')
            .expect(await listView.isFavoritesIconPresent(datamodel_CD.name))
            .toBe(true);
        await since('Hover on list view, edit icon present is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierEditIconPresent(datamodel_CD.name))
            .toBe(true);
        await takeScreenshotByElement(
            await listView.getItemRowActionBar(datamodel_CD.name),
            'TC96842',
            'contentDiscovery_hover',
            { tolerance: 0.12 }
        );

        // open context menu
        await listView.openContextMenu(datamodel_CD.name);
        await since('Open context menu, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(14);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96842', 'contentDiscovery_ContextMenu');

        // open info window
        await listView.clickContextMenuItem('Get Info');
        await since('Open info window, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowActionCount())
            .toBe(6);
        await takeScreenshotByElement(listView.getItemShare(), 'TC96842', 'contentDiscovery_infoWindow', {
            tolerance: 0.12,
        });
        // more
        await listView.clickMoreMenuFromIW();
        await since('Open info window, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowMorActionAcount())
            .toBe(6);
        await takeScreenshotByElement(
            listView.getMoreOptiobDropDownInIW(),
            'TC96842',
            'contentDiscovery_infoWindow_more'
        );
        await listView.clickCloseIcon();
    });

    it('[TC96843] Data Model - Custom app setting for data model', async () => {
        // custom app: data model
        await libraryPage.openCustomAppById({ id: customApp_NoDM.id });
        await libraryPage.openSidebarOnly();
        await since('No data model app, siebar present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(false);
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('No data model app, create data model button present should be #{expected}, while we get #{actual}')
            .expect(await libraryAuthoringPage.isCreateDataModelBtnPresent())
            .toBe(true);
        await quickSearch.inputTextAndSearch('model');
        await fullSearch.clickAllTab();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since(
            'No data model app, data model in search filter present should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('Data Model'))
            .toBe(false);
        await fullSearch.backToLibrary();

        // custom app: create data model
        await libraryPage.openCustomAppById({ id: customApp_NoCreateDM.id });
        await libraryPage.openSidebarOnly();
        await since('No create data model app, sidebar present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(true);
        await sidebar.openDataSection();
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('No data model app, create data model button present should be #{expected}, while we get #{actual}')
            .expect(await libraryAuthoringPage.isCreateDataModelBtnPresent())
            .toBe(false);
        await libraryPage.dissmissPopup();

        // custom app: favorites data model, create dashboard, create bot
        await libraryPage.openCustomAppById({ id: customApp_NoFavoritesAndCreateBD.id });
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await since('No favorites data model app, Favorites present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
        //// -- info window
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await since(
            'No favorites data model app, action icon count supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(3);
        await since(
            'No favorites data model app, create dashboard present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isCreateBotPresent())
            .toBe(false);
        await infoWindow.close();
        //// -- context menu
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await since(
            'No favorites and create app, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96843', 'customApp_favorites');
        await since(
            'No favorites data model app, favorites present supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.isItemDisplayedInContextMenu('Favorite'))
            .toBe(false);
        await libraryPage.openDefaultApp();
    });

    it('[TC96848] Data Model - Pendo integration with data model', async () => {
        // open data model pae
        await libraryPage.openSidebarOnly();
        console.log('open data model');
        await sidebar.openDataSection();

        // favorite data model
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        console.log('favorite data model');

        // Capture requests
        const output = await browser.mock('**');
        await infoWindow.clickFavoriteIcon();
        // Verify requests
        await verifyRequestContent(output, 'library-item-info-favorite');
    });

    it('[TC96849] Data Model - Mobile view on data model', async () => {
        // delete all favorites
        await deleteAllDataModelFavorites(specConfiguration.credentials);
        await libraryPage.refresh();
        // set mobile view
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 550,
            height: 800,
        });
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        // list view
        await listView.selectListViewModeMobile();
        //// -- info window
        await listView.openInfoWindowFromMobileView(datamodel_base.name);
        await since(
            'Mobile view, info-window on list view openned supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await listView.isMobileInfoWindowOpened())
            .toBe(true);
        await takeScreenshotByElement(listView.getItemShare(), 'TC96849', 'MobileView_InfoWindow_listView', {
            tolerance: 4,
        });
        await listView.clickCloseIcon();

        // grid view
        await listView.deselectListViewModeMobile();
        //// -- info window
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await since('Mobile view, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(3);
        await since('Mobile view, create bot present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateDashboardPresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC96849', 'MobileView_InfoWindow');
        await infoWindow.close();
        //// -- context menu
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await since('Mobile view,context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await since('Mobile view, Edit present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(false);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC96849', 'MobileView_ContextMenu');

        // manage access dialogue
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await takeScreenshotByElement(manageAccess.getManageAccessDialog(), 'TC96849', 'MobileView_ManageAccess');
        await manageAccess.cancelManageAccessChange();

        // security filter dialogue
        await libraryPage.openDossierContextMenu(datamodel_base.name);
        await libraryPage.clickDossierContextMenuItem('Security Filter');
        await securityFilter.waitForSecurityFilterLoading();
        await securityFilter.closeDialogue();
    });

    it('[TC96850] Data Model - Priviledge check for data model ', async () => {
        // re-login with user with no priviledge to data model
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({ username: user_NoDM.username, password: user_NoDM.password });

        // check data model entries
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('No data model priviledge, create button present should be #{expected}, while we get #{actual}')
            .expect(await libraryAuthoringPage.isCreateDataModelBtnPresent())
            .toBe(false);
        await since('No data model priviledge, sidebar present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(false);
        await libraryPage.dissmissPopup();
        //// - on search results page
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('model');
        await fullSearch.clickAllTab();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since(
            'No data model app, data model in search filter present should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('Data Model'))
            .toBe(false);
        await fullSearch.backToLibrary();

        // re-login with user with no create dashboard priviledge
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({ username: user_NoCreateDashboard.username, password: user_NoCreateDashboard.password });
        // check data model entries
        await libraryAuthoringPage.clickNewDossierIcon();
        await since(
            'No create dashboard priviledge, create data model button present should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryAuthoringPage.isCreateDataModelBtnPresent())
            .toBe(true);
        await since(
            'No create dashboard priviledge, create dashboard button present should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryAuthoringPage.isCreateDashboardBtnPresent())
            .toBe(false);
        await libraryPage.dissmissPopup();
        await libraryPage.openSidebarOnly();
        await since(
            'No create dashboard priviledge,data model sidebar present supposed to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.isDataSectionPresent())
            .toBe(true);
        await sidebar.openDataSection();
        // check create dashboard entry
        await libraryPage.openDossierInfoWindow(datamodel_base.name);
        await since('Privledge check, create dashboard present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateDashboardPresent())
            .toBe(false);
        await infoWindow.close();

        // re-login with default user
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC96851] Data Model - ACL check for data model', async () => {
        // re-login with acl user
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({ username: user_ACL.username, password: user_ACL.password });

        // full access
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await libraryPage.openDossierContextMenu(datamodel_fullACL.name);
        await since('Full access, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(15);
        await libraryPage.dissmissPopup();

        // modify access
        await libraryPage.openDossierContextMenu(datamodel_modifyACL.name);
        await since('Modify access, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(14);
        await libraryPage.dissmissPopup();

        // write access
        await libraryPage.openDossierContextMenu(datamodel_writeACL.name);
        await since('Write access, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);
        await since('Write access, Delete present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Delete'))
            .toBe(false);
        await libraryPage.dissmissPopup();

        // view access
        await libraryPage.openDossierContextMenu(datamodel_viewACL.name);
        await since('View access, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(10);
        await since('View access, Edit present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(false);
        await libraryPage.dissmissPopup();

        // re-login with default user
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC97353_09] Global Search - Validate search object ID on My Library and All tab - data model', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(datamodel_base.id);
        await since(
            `Search by ${datamodel_base.id}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by ${datamodel_base.id}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${datamodel_base.id}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(0);
        await since(
            `Search by ${datamodel_base.id}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(1);
        await fullSearch.backToLibrary();
    });
});
export const config = specConfiguration;
