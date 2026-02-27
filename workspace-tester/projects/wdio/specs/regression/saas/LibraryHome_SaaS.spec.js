/* eslint-disable @typescript-eslint/no-floating-promises */
import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';
import setWindowSize from '../../../config/setWindowSize.js';
import renameDossier from '../../../api/renameDossier.js';
import setLibraryHomeConfigForSaaS from '../../../api/setLibraryHomeConfigForSaaS.js';

const specConfiguration = { ...customCredentials('_saas') };
const specConfiguration_Recipient = { ...customCredentials('_saas_recipient@microstrategy.com') };

describe('Library Home for SaaS', () => {
    const dashboard_owner = {
        id: '769138044549B18100693B8736A557FE',
        name: 'Dashboard for SaaS',
        project: {
            id: '1152A6705748CC4B2DA766AE4B6CD8D1',
            name: 'MicroStrategy Tutorial',
        },
    };

    const newdashboard_tobedeleted = {
        id: '769138044549B18100693B8736A557FE',
        name: 'NewDashboard_ToBeDeleted',
        project: {
            id: '1152A6705748CC4B2DA766AE4B6CD8D1',
            name: 'MicroStrategy Tutorial',
        },
    };

    const bot_owner = {
        id: '769138044549B18100693B8736A557FE',
        name: 'Bot for SaaS',
        project: {
            id: '88877BAE6E418D09240AD8A8CEA69B58',
            name: 'MicroStrategy Tutorial',
        },
    };

    const bot_expire = {
        id: '769138044549B18100693B8736A557FE',
        name: 'New Bot_Expire',
        project: {
            id: '88877BAE6E418D09240AD8A8CEA69B58',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dashboard_expire = {
        id: '769138044549B18100693B8736A557FE',
        name: 'New Dashboard_Expire',
        project: {
            id: '88877BAE6E418D09240AD8A8CEA69B58',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dashboard_rename = {
        id: '97788AC7054F48723B6258B89C88CDC8',
        name: 'Dashboard for SaaS_Rename',
        project: {
            id: '69D4DA35264BAA98CC2BF68356064C35',
            name: 'MicroStrategy Tutorial',
        },
    };

    const bot_rename = {
        id: '9B624191B64E78B2495FA8BC6A9FA3AD',
        name: 'Bot for SaaS_Rename',
        project: {
            id: '69D4DA35264BAA98CC2BF68356064C35',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;
    const { credentials: recipientCredentials } = specConfiguration_Recipient;

    let {
        share,
        shareDossier,
        dossierPage,
        libraryPage,
        libraryFilter,
        libraryAuthoringPage,
        dossierAuthoringPage,
        infoWindow,
        quickSearch,
        filterOnSearch,
        fullSearch,
        commentsPage,
        listView,
        datasetsPanel,
        libraryItem,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await deleteAllFavorites(specConfiguration.credentials);
        //await libraryPage.executeScript('window.pendo.stopGuides();');
    });

    beforeEach(async () => {
        await libraryPage.switchUser(credentials);
        await libraryPage.executeScript('window.pendo.stopGuides();');
    });

    it('[TC92813] Verify Sidebar/Filter/Search/Account in library home UI for SaaS', async () => {
        // check title in library home
        since('Title should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isTitleDisaplayed()).toBe(false);

        // check sider bar section UI
        since('Sider bar opened status by default should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        since('defalt section count shown in sider bar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getPredefinedSectionItemsCount()).toBe(4);
        since('grayed out sections in sidebar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getGrayedSectionNames()).toEqual([]);
        since('add group button on sider bar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.isAddGroupBtnForSaaSDisplayed()).toBe(false);
        await libraryPage.sidebar.clickPredefinedSection('Insights');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC92813', 'Trial Wrapper_Insights',{ tolerance: 0.2 });
        await libraryPage.sidebar.clickPredefinedSection('Subscriptions');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC92813', 'Trial Wrapper_Subscription',{ tolerance: 0.2 });
        await libraryPage.sidebar.clickPredefinedSection('Content Discovery');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC92813', 'Trial Wrapper_ContentDiscovery',{ tolerance: 0.2 });
        await libraryPage.sidebar.clickPredefinedSection('My Groups');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC92813', 'Trial Wrapper_MyGroup',{ tolerance: 0.2 });

        // check library home filter UI
        await libraryPage.sidebar.clickAllSection();
        //Click Filter Icon, Filter type: Dossier
        await libraryPage.clickFilterIcon();
        since('Filter dropdown options should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterDropdownOptionsNames())
            .toEqual(['Type', 'Owner', 'Status']);
        await libraryFilter.openFilterTypeDropdown();
        since('filter types should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterTypeItemsNames())
            .toEqual(['Dashboard', 'Bot']);
        //await libraryFilter.closeFilterTypeDropdown();
        await libraryPage.closeFilterPanel();

        // check create entry
        // await libraryAuthoringPage.clickNewDossierIcon();
        // since('create  should be #{expected}, instead we have #{actual}')
        //     .expect(await libraryAuthoringPage.getCreateNewMenuItemsText()).toEqual(['Dashboard', 'Bot']);
        // await libraryAuthoringPage.clickNewDossierIcon();

        // check IW option for dossier with owner
        await libraryPage.moveDossierIntoViewPort(dashboard_owner.name);
        await libraryPage.openDossierInfoWindow(dashboard_owner.name);
        since(`IW options for owner dossier should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Share Dashboard', 'Export to Excel', 'Export to PDF', 'Reset', 'Delete', 'Edit', 'Manage Access']);
        since(`delete button tooltip for owner dossier should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Delete');
        since('ObjectID for owner dossier info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow()).toBe(false);
        since('Related Content section for owner dossier info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow()).toBe(false);
        await infoWindow.close();

        // check IW option for bot with owner
        await libraryPage.moveDossierIntoViewPort(bot_owner.name);
        await libraryPage.openDossierInfoWindow(bot_owner.name);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        since(`IW options for owner bot should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Share Bot', 'Delete', 'Edit', 'Manage Access', 'Active']);
        since(`delete button tooltip for owner bot should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Delete');
        since('ObjectID for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow()).toBe(false);
        since('Related Content section for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow()).toBe(false);
        await infoWindow.close();

        // check list view IW options for dossier with recipient
        // user switch to the list view mode
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(dashboard_owner.name);
        await since('Delete tootip for owner dossier list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.getDeleteIconTooltipInInfoWindow()).toBe('Delete');
        await since('Edit option for owner dossier list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.isEditButtonPresentInIW()).toBe(true);
        since('ObjectID for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow()).toBe(false);
        since('Related Content section for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow()).toBe(false);
        await listView.openInfoWindowFromListView(bot_owner.name);
        await since('Edit option for owner bot list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.isEditButtonPresentInIW()).toBe(true);
        await since('Delete tootip for owner bot list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.getDeleteIconTooltipInInfoWindow()).toBe('Delete');
        await listView.clickCloseIcon();
        await listView.deselectListViewMode();
        // check library search result
        const keyword = 'saas';
        await quickSearch.openSearchSlider();

        // Search dossier
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.openInfoWindow(dashboard_owner.name);
        since(`IW options for owner dossier in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Share Dashboard', 'Export to Excel', 'Export to PDF', 'Reset', 'Delete', 'Edit', 'Manage Access']);
        since(`delete button tooltip for owner dossier in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Delete');
        since('ObjectID for owner dossier info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow()).toBe(false);
        since('Related Content section for owner dossier info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow()).toBe(false);
        await fullSearch.infoWindow.close();

        // check IW options for bot with owner
        await fullSearch.openInfoWindow(bot_owner.name);
        since(`IW options for owner bot in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Share Bot', 'Delete', 'Edit', 'Manage Access', 'Active']);
        since(`delete button tooltip for owner bot in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Delete');
        since('ObjectID for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow()).toBe(false);
        since('Related Content section for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow()).toBe(false);
        await fullSearch.infoWindow.close();
        since('Search result all tab should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.isAllTabPresent()).toBe(false);
        since('Search result my library tab should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.isMyLibraryTabPresent()).toBe(false);

        // Check Filter on Search
        await filterOnSearch.openSearchFilterPanel();
        since('search filter types should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.getSearchFilterItemsName()).toEqual(['Type', 'Owner', 'Last Updated']);
        await filterOnSearch.openFilterDetailPanel('Type');
        since('the types in search filter details should be #{expected}, instead we have #{actual}')
            .expect(await filterOnSearch.getOptionsInCheckboxDetailPanelName())
            .toEqual(['Dashboard', 'Bot']);
        await filterOnSearch.closeFilterPanel();

        // check the UI for account panel of search page
        await libraryPage.userAccount.openUserAccountMenu();
        since('account menu items in search page should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.userAccount.getAccountMenuOptionsNames()).toEqual(['Preferences', 'Help']);
        await libraryPage.userAccount.openPreferencePanel();
        since('preference sections should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.userAccount.getPreferenceSectionsNames()).toEqual(['My Language']);
        await libraryPage.userAccount.closeUserAccountMenu();

        // check the UI for account panel of library home page
        await fullSearch.backToLibrary();
        await libraryPage.userAccount.openUserAccountMenu();
        since('account menu items in library home page should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.userAccount.getAccountMenuOptionsNames()).toEqual(['Preferences', 'Take a Tour', 'Help']);
        await libraryPage.userAccount.openPreferencePanel();
        since('preference sections should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.userAccount.getPreferenceSectionsNames()).toEqual(['My Language']);
        await libraryPage.userAccount.closeUserAccountMenu();

    });

    it('[TC93385] Verify Dashboard/Bot UI for SaaS', async () => {
        // check dossier toolbar UI of owner
        await libraryPage.openDossier(dashboard_owner.name);
        since('Library Home Tooltip for Dashboard is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getLibraryHomeTooltipText()).toBe('Auto Express Home');
        since('Edit button in dossier page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(true);
        await commentsPage.openCommentsPanelForSaaS();
        await takeScreenshotByElement(commentsPage.getCommentsPanelForSaaS(), 'TC93378', 'Comments Panel for SaaS',{ tolerance: 0.3 });
        await commentsPage.closeCommentsPanelForSaaS();
        since('Comment tooltip after close comment panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.isTooltipDisplayed('Collaboration')).toBe(false);
        await share.openSharePanel();
        await since('Share options in share panel expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierPanelItemsName())
            .toEqual(['Share Dashboard', 'Manage Access', 'Export to Excel', 'Export to PDF']);
        await share.closeSharePanel();
        await dossierPage.goToLibrary();

        // check bot toolbar UI of owner
        await libraryPage.openDossier(bot_owner.name);
        since('Library Home Tooltip for Bot is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getLibraryHomeTooltipText()).toBe('Auto Express Home');
        await since('Edit button in bot page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(true);
        since('Comment button disabled status in bot page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.isCommentIconPresent()).toBe(false);
        await share.openSharePanel();
        await since('Share options in share panel for bot expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierPanelItemsName())
            .toEqual(['Share Bot', 'Embed Bot', 'Manage Access']);
        await share.closeSharePanel();
        await dossierPage.goToLibrary();
    });

    it('[TC93387] Verity Sider bar open status sync for SaaS', async () => {
        // check sider bar default open status
        await libraryPage.logoutClearCacheAndLogin(credentials);
        since('Sider bar opened status by default should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        // check the tooltip for library home sider bar
        since('Library Home Tooltip for siderbar opened is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getLibraryHomeTooltipText()).toBe('Hide Sidebar');
        since('Default selected section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getSelectedSectionName())
            .toBe('All');
        // change the selected section
        await libraryPage.sidebar.clickPredefinedSection('My Groups');
        await libraryPage.switchUser(credentials);
        since('Modified selected section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getSelectedSectionName())
            .toBe('My Groups');
        // hide sider bar
        await libraryPage.closeSidebar();
        await libraryPage.switchUser(credentials);
        // check the tooltip for library home sider bar
        since('Library Home Tooltip for siderbar closed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getLibraryHomeTooltipText()).toBe('Show Sidebar');
        since('Sider bar opened status after hide sider bar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(false);
        // change to default one
        await libraryPage.logoutClearCacheAndLogin(credentials);
        since('Sider bar opened status by default should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        since('Default selected section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getSelectedSectionName())
            .toBe('All');
    });

    it('[TC93394] Verify recipient Library home UI for SaaS', async () => {
        // switch to recipient
        await libraryPage.switchUser(recipientCredentials);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        // check IW option for dossier with recipient
        await libraryPage.moveDossierIntoViewPort(dashboard_owner.name);
        await libraryPage.openDossierInfoWindow(dashboard_owner.name);
        since(`IW options for recipient dossier should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Export to Excel', 'Export to PDF', 'Reset', 'Remove from Library']);
        since(`delete button tooltip for owner dossier should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Remove from Library');
        await infoWindow.close();

        // check IW option for bot with recipient
        await libraryPage.moveDossierIntoViewPort(bot_owner.name);
        await libraryPage.openDossierInfoWindow(bot_owner.name);
        since(`IW options for owner bot should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Remove from Library']);
        since(`delete button tooltip for owner bot should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Remove from Library');
        await infoWindow.close();

        // check list view IW options for dossier with recipient
        // user switch to the list view mode
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(dashboard_owner.name);

        await since('Delete tootip for recipient dossier list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.getDeleteIconTooltipInInfoWindow()).toBe('Remove from Library');    
        await since('Edit option for recipient dossier list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.isEditButtonPresentInIW()).toBe(false);
        await listView.openInfoWindowFromListView(bot_owner.name);
        await since('Edit option for recipient bot list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.isEditButtonPresentInIW()).toBe(false);
        await since('Delete tootip for recipient bot list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.getDeleteIconTooltipInInfoWindow()).toBe('Remove from Library');  
        await listView.clickCloseIcon();  
        await listView.deselectListViewMode();

        // check library search result
        const keyword = 'saas';
        await quickSearch.openSearchSlider();

        // Search dossier
        await quickSearch.inputText(keyword);
        await quickSearch.clickViewAll();
        await fullSearch.openInfoWindow(dashboard_owner.name);
        since(`IW options for recipient dossier in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Export to Excel', 'Export to PDF', 'Reset', 'Remove from Library']);
        since(`delete button tooltip for owner dossier in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Remove from Library');
        await fullSearch.infoWindow.close();

        // check IW options for bot with owner
        await fullSearch.openInfoWindow(bot_owner.name);
        since(`IW options for recipient bot in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Remove from Library']);
        since(`delete button tooltip for owner bot in search result page should be #{expected}, instead we have #{actual}`)
            .expect(await fullSearch.infoWindow.showIconTooltip({ option: 'Remove' })).toBe('Remove from Library');
        await fullSearch.infoWindow.close();
        await fullSearch.backToLibrary();

        // check dossier toolbar UI of owner
        await libraryPage.openDossier(dashboard_owner.name);
        await since('Edit button in dossier page for recipient is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(false);
        await since('Comment button disabled status in dossier page for recipient is expected to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.isCommentIconDisabled())
            .toBe(true);
        await commentsPage.openCommentsPanelForSaaS();
        await takeScreenshotByElement(commentsPage.getCommentsPanelForSaaS(), 'TC93394', 'Comments Panel for SaaS',{ tolerance: 0.2 });
        await commentsPage.closeCommentsPanelForSaaS();
        await share.openSharePanel();
        await since('Share options in share panel expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierPanelItemsName())
            .toEqual(['Export to Excel', 'Export to PDF']);
        await share.closeSharePanel();
        await dossierPage.goToLibrary();
    });

    it('[TC93400] Verify delete base object in library home for SaaS', async () => {
        // remove the dossier firstly in recipient library
        await libraryPage.switchUser(recipientCredentials);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        if (await libraryPage.isDossierInLibrary(newdashboard_tobedeleted)) {
            await libraryPage.moveDossierIntoViewPort(newdashboard_tobedeleted.name);
            await libraryPage.openDossierInfoWindow(newdashboard_tobedeleted.name);
            await infoWindow.selectRemove();
            await infoWindow.confirmRemove();
        }
        // switch to owner
        await libraryPage.switchUser(credentials);
        // create a new dossier
        await libraryAuthoringPage.createDossierFromLibrary();
        await datasetsPanel.clickCancelButton();
        await dossierAuthoringPage.saveNewDossier(newdashboard_tobedeleted.name);
        // share the dossier to recipient via IW share option
        await libraryPage.moveDossierIntoViewPort(newdashboard_tobedeleted.name);
        await libraryPage.openDossierInfoWindow(newdashboard_tobedeleted.name);
        await infoWindow.shareDossier();
        await shareDossier.addUserForSaaS([recipientCredentials.username]);
        await shareDossier.shareDossier();

        // switch to recipient
        await libraryPage.switchUser(recipientCredentials);
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(newdashboard_tobedeleted.name);
        await listView.clickDeleteFromIW();
        since('delete confirm dialog message in list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.getRemoveConfirmationMessageText()).toBe('Remove?');
        await listView.cancelRemoveFromInfoWindow();
        await listView.clickCloseIcon();
        await listView.deselectListViewMode();

        // delete the dashboard 
        await libraryPage.moveDossierIntoViewPort(newdashboard_tobedeleted.name);
        await libraryPage.openDossierInfoWindow(newdashboard_tobedeleted.name);
        await infoWindow.selectRemove(); 
        since('delete confirm dialog message for recipient should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getConfirmMessageText()).toBe('Remove?');
        await infoWindow.confirmRemove();
        
        // switch to owner to share delete the dossier again
        await libraryPage.switchUser(credentials);
        await libraryPage.moveDossierIntoViewPort(newdashboard_tobedeleted.name);
        await libraryPage.openDossierInfoWindow(newdashboard_tobedeleted.name);
        await infoWindow.shareDossier();
        await shareDossier.addUserForSaaS([recipientCredentials.username]);
        await shareDossier.shareDossier();

        // switch to recipient
        await libraryPage.switchUser(recipientCredentials);
        since('New dossier display in recipient libray home after share should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierInLibrary(newdashboard_tobedeleted)).toBe(true);
        // switch to owner and check list view delete
        await libraryPage.switchUser(credentials);
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(newdashboard_tobedeleted.name);
        await listView.clickDeleteFromIW();
        since('delete confirm dialog message in list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.getRemoveConfirmationMessageText()).toBe('Delete?');
        await listView.cancelRemoveFromInfoWindow();
        await listView.clickCloseIcon();
        await listView.deselectListViewMode();

        // back to grid view to delete the dossier
        await libraryPage.moveDossierIntoViewPort(newdashboard_tobedeleted.name);
        await libraryPage.openDossierInfoWindow(newdashboard_tobedeleted.name);
        await infoWindow.selectRemove();
        since('delete confirm dialog message should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getConfirmMessageText()).toBe('Delete?');
        await infoWindow.confirmRemove();

        // switch to recipient
        await libraryPage.switchUser(recipientCredentials);
        since('New dossier display in recipient libray home after delete should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierInLibrary(newdashboard_tobedeleted)).toBe(false);
    });

    it('[TC93527] Verify bot sent from expired user in library home for SaaS', async () => {
        // remove the dossier firstly in recipient library
        await libraryPage.switchUser(recipientCredentials);
        since('Bot sent from expired user inactive status should be #{expected}, instead we have #{actual}')
            .expect(await libraryItem.isBotHasInactiveInName(bot_expire.name)).toBe(true);
        // check IW option for bot with recipient
        await libraryPage.moveDossierIntoViewPort(bot_expire.name);
        await libraryPage.openDossierInfoWindow(bot_expire.name);
        since(`IW options for bot sent from expired owner should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Remove from Library']);
        await infoWindow.close();
        await libraryPage.openDossierNoWait(bot_expire.name);
        await since("Run inactive bot from library home, the error message should be \"#{expected}\", instead we have \"#{actual}\"")
            .expect(await dossierPage.errorMsg()).toEqual("This bot is currently inactive.");
        await libraryPage.dismissError();

        // check the dashboard
        since('Dashboard sent from expired user inactive status should be #{expected}, instead we have #{actual}')
            .expect(await libraryItem.isBotHasInactiveInName(dashboard_expire.name)).toBe(true);
        // check IW option for bot with recipient
        await libraryPage.moveDossierIntoViewPort(dashboard_expire.name);
        await libraryPage.openDossierInfoWindow(dashboard_expire.name);
        since(`IW options for dashboard sent from expired owner should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName()).toEqual(['Add to Favorites', 'Remove from Library']);
        await infoWindow.close();
        await libraryPage.openDossierNoWait(dashboard_expire.name);
        await since("Run inactive dashboard from library home, the error message should be \"#{expected}\", instead we have \"#{actual}\"")
            .expect(await dossierPage.errorMsg()).toEqual("This dashboard is currently inactive.");
        await libraryPage.dismissError();
    });

    it('[TC93548] Verify trial banner for SaaS', async () => {
        // set expire day to < 0 day
        await setLibraryHomeConfigForSaaS({ credentials, day: 0, isUpgradeClicked: false });
        await libraryPage.refresh();
        since('Trial banner message of < 0 expired day should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTrialBannerMessageText()).toBe("Last chance to explore! Your Auto Express trial ends tomorrow.")
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_<0 Expired Day',{ tolerance: 0.2 });
        await browser.mockRestoreAll(); 

        // set expire day to 23 hours 
        await setLibraryHomeConfigForSaaS({ credentials, day: 0, hour: 23, isUpgradeClicked: false });
        await libraryPage.refresh();
        since('Trial banner message of 23 hours expired day should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTrialBannerMessageText()).toBe("Last chance to explore! Your Auto Express trial ends tomorrow.")
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_23 hours Expired Day',{ tolerance: 0.2 });
        await browser.mockRestoreAll(); 

        // set expire day to 1 day + 1 minute 
        await setLibraryHomeConfigForSaaS({ credentials, day: 1, minute: 1, isUpgradeClicked: false });
        await libraryPage.refresh();
        since('Trial banner message of 1 day + 1 minute expired day should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTrialBannerMessageText()).toBe("Only 2 days left to make the most of your Auto Express trial!")
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_1 + 1 Minute Expired Day',{ tolerance: 0.2 });
        await browser.mockRestoreAll(); 
 
        // set expire day to 2 days
        await setLibraryHomeConfigForSaaS({ credentials, day: 2, isUpgradeClicked: false });
        await libraryPage.refresh();
        since('Trial banner message of 2 days expired days should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTrialBannerMessageText()).toBe("Only 2 days left to make the most of your Auto Express trial!")
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_2 Expired Day',{ tolerance: 0.2 });
        await browser.mockRestoreAll();

        // set expire day to 2 days + 1hour
        await setLibraryHomeConfigForSaaS({ credentials, day: 2, hour: 2, isUpgradeClicked: false });
        await libraryPage.refresh();
        since('Trial banner message of 2 days + 2 hour expired days should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTrialBannerMessageText()).toBe("You have 3 days left to experience Auto Express.")
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_2 + 2 hours Expired Day',{ tolerance: 0.2 });
        await browser.mockRestoreAll();

        // set expire day to 10 days
        await setLibraryHomeConfigForSaaS({ credentials, day: 10, isUpgradeClicked: false });
        await libraryPage.refresh();
        // since('Trial banner message of 10 expired days should be #{expected}, instead we have #{actual}')
        //     .expect(await libraryPage.getTrialBannerMessageText()).toBe("You have 10 days left to experience Auto Express.")
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_10 Expired Day',{ tolerance: 0.2 });
        await browser.mockRestoreAll();

        // check upgrade button in trial banner
        await setLibraryHomeConfigForSaaS({ credentials, day: 30, isUpgradeClicked: true });
        await libraryPage.refresh();
        since('Upgrade button in Trial banner display should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isUpgradeButtonInTrialBannerPresent()).toBe(false);
        await libraryPage.sidebar.clickPredefinedSection('Insights');
        since('Upgrade button in Insights section display should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isUpgradeButtonInSiderSectionPresent()).toBe(false);
        await libraryPage.sidebar.clickPredefinedSection('Subscriptions');
        since('Upgrade button in Subcription section display should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isUpgradeButtonInSiderSectionPresent()).toBe(false);
        await libraryPage.sidebar.clickPredefinedSection('Content Discovery');
        since('Upgrade button in Content Discovery section display should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isUpgradeButtonInSiderSectionPresent()).toBe(false);
        await libraryPage.sidebar.clickPredefinedSection('My Groups');
        since('Upgrade button in My Groups section display should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isUpgradeButtonInSiderSectionPresent()).toBe(false);

        // go to comments panel to check upgrade button
        await libraryPage.sidebar.clickAllSection();
        await libraryPage.openDossier(dashboard_owner.name);
        await commentsPage.openCommentsPanelForSaaS();
        since('Upgrade button in comment panel should be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.isUpgradeButtonInCommentsPanelPresent()).toBe(false);
        await commentsPage.closeCommentsPanelForSaaS();

        // go back to lirary home and reset mock
        await dossierPage.goToLibrary();
        await browser.mockRestoreAll();
        await libraryPage.refresh();

        // check click upgrade button link in trial banner
        await libraryPage.clickUpgradeButtonInTrialBanner();
        await libraryPage.waitForPageLoadByUrl('https://www.strategysoftware.com/express');
        await browser.url(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();

        // check click upgrade button link in sider bar
        await libraryPage.sidebar.clickPredefinedSection('Insights');
        await libraryPage.clickUpgradeButtonInSiderSection();
        await libraryPage.waitForPageLoadByUrl('https://www.strategysoftware.com/express');
        await browser.url(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();

        // check click upgrade button link in comment panel
        await libraryPage.sidebar.clickAllSection();
        await libraryPage.openDossier(dashboard_owner.name);
        await commentsPage.openCommentsPanelForSaaS();
        await commentsPage.clickUpgradeButtonInCommentsPanel();
        await libraryPage.waitForPageLoadByUrl('https://www.strategysoftware.com/express');
        await browser.url(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.goToLibrary();
    });

    it('[TC93551] Verify rename dashboard/bot for SaaS', async () => {
        // reset dashboard and bot name
        await renameDossier({
            credentials: credentials,
            dossier: dashboard_rename,
            name: dashboard_rename.name,
        });

        await renameDossier({
            credentials: credentials,
            dossier: bot_rename,
            name: bot_rename.name,
        });
        // refresh library home to update the name
        await libraryPage.openSidebar();
        await listView.deselectListViewMode();
        // rename dashboard for owner from library home grid view
        await libraryPage.openDossierContextMenuNoWait(dashboard_rename.name);
        await libraryPage.clickDossierContextMenuItem('Rename');
        await libraryPage.renameDossier(dashboard_rename.name + '_new');

        // rename bot for owner from library home list view
        await listView.selectListViewMode();
        await listView.rightClickToOpenContextMenu({ name: bot_rename.name });
        await libraryPage.clickDossierContextMenuItem('Rename');
        await libraryPage.renameDossier(bot_rename.name + '_new');
        await listView.deselectListViewMode();

        // switch to recipient to check baseobject rename
        await libraryPage.switchUser(recipientCredentials);
        since('Original dashboard shown in recipient library home should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierInLibrary(dashboard_rename.name)).toBe(false);
        since('Original bot should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierInLibrary(bot_rename.name)).toBe(false);

        // check recipient context menu
        await libraryPage.openDossierContextMenuNoWait(dashboard_rename.name + '_new');
        since('Rename option in context menu for recipient should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Rename')).toBe(false);
        
        // switch to list view to check rename option
        await listView.selectListViewMode();
        await listView.rightClickToOpenContextMenu({ name: bot_rename.name + '_new' });
        since('Rename option in context menu for recipient should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Rename')).toBe(false);
        await listView.deselectListViewMode();

        // switch to sender to reset name
        await libraryPage.switchUser(credentials);
        await renameDossier({
            credentials: credentials,
            dossier: dashboard_rename,
            name: dashboard_rename.name,
        });

        await renameDossier({
            credentials: credentials,
            dossier: bot_rename,
            name: bot_rename.name,
        });
    });

    it('[TC93646] Verify tab order in accessibility for SaaS', async () => {
        // tab to the greyed out sections and check upgrade button
        await libraryPage.sidebar.tab(13);
        await libraryPage.enter();
        since('Instruction title in sider bar section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getInstructionTitleInSiderSectionText()).toBe('Monitor & explore your most important KPIs.');
        await libraryPage.enter();
        await libraryPage.waitForPageLoadByUrl('https://www.microstrategy.com/trial/mytrial');
        await browser.back();

        // tab to the greyed out sections and check upgrade button
        await libraryPage.sidebar.tab(10);
        await libraryPage.enter();
        since('Instruction title in sider bar section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getInstructionTitleInSiderSectionText()).toBe('Everything. Everywhere. All In One.');
        await libraryPage.sidebar.shiftTab(1);
        await libraryPage.enter();
        since('Instruction title in sider bar section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getInstructionTitleInSiderSectionText()).toBe('Tree Structure for effortless exploration!');
        await libraryPage.sidebar.shiftTab();
        await libraryPage.enter();
        since('Instruction title in sider bar section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getInstructionTitleInSiderSectionText()).toBe('Manage your content at ease!');
        await libraryPage.sidebar.tab(1);
        await libraryPage.enter();
        await libraryPage.waitForPageLoadByUrl('https://www.microstrategy.com/trial/mytrial');
        await browser.back();
        // tab to the dossier toolbar
        await libraryPage.sidebar.clickAllSection();
        await libraryPage.moveDossierIntoViewPort(dashboard_owner.name);
        await libraryPage.openDossier(dashboard_owner.name);
        await dossierPage.tab(3);
        await dossierPage.enter();
        since('Comment panel in dossier page after press comments icon should be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.isCommentsPanelForSaaSPresent()).toBe(true);
        await dossierPage.tab();
        await dossierPage.enter();
        since('Comment panel in dossier page after press close button should be #{expected}, instead we have #{actual}')
            .expect(await commentsPage.isCommentsPanelForSaaSPresent()).toBe(false);
        // reopen the comment panel and tab to the upgrade button
        await dossierPage.enter();
        await dossierPage.tab(1);
        await dossierPage.enter();
        await libraryPage.waitForPageLoadByUrl('https://www.microstrategy.com/trial/mytrial');
        await browser.back();
        await dossierPage.goToLibrary();

    });
});

export const config = specConfiguration;
