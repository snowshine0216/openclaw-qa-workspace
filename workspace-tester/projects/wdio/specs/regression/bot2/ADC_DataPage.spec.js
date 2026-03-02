import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import deleteAllDataModelFavorites from '../../../api/dataModel/deleteAllDataModelFavorites.js';
import resetCertify from '../../../api/resetCertify.js';
import * as bot from '../../../constants/bot2.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';

describe('ADC on Data Page', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const adc_base = {
        id: '543D024AEF40FFC0F84701AB1672563A',
        name: 'AUTO_ADC_Home',
        project: project,
    };
    const adc_fullACL = {
        id: '648674E1F9489EC4723FCFB9F682D0EA',
        name: 'AUTO_ADC_ObjectManagement',
        project: project,
    };
    const adc_rename = {
        id: '4F4A9FC1874F4C5D1C97F0B53DBE9F30',
        name: 'AUTO_ADC_Rename',
        project: project,
    };
    const user_acess = {
        username: 'bot2_auto',
        password: '',
    };
    const adc_folder = {
        name: 'Target Folder',
        path: ['Shared Reports', 'Bot2.0', 'Automation', 'ADC'],
    };
    const shortcutFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'ShortcutFolder'],
    };
    const moveToFolder = {
        name: 'Target Folder',
        path: ['My Reports', 'TargetMoveToFolder'],
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const adc_OriginalName = 'AUTO_ADC_Rename_New';
    const adc_RenamedName = '1_ADC_Rename_Renamed';
    const adc_RenamedNameNew = '1_ADC_Rename_Renamed_New';
    const adc_copyName = 'AUTO_Copy ADC';

    let {
        libraryPage,
        listViewAGGrid,
        infoWindow,
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
        libraryFilter,
        aibotChatPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.adcUser.credentials);
        await libraryPage.waitForLibraryLoading();
        // // delete all favorites
        await deleteAllDataModelFavorites(bot.adcUser.credentials);

        // open data  page
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        // sort data
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await listView.deselectListViewMode();
    });

    afterAll(async () => {
        // delete all favorites
        await deleteAllDataModelFavorites(bot.adcUser.credentials);
        const isCertified = await libraryPage.libraryItem.isItemCertified(adc_base.name);
        // reset certify
        const testObjectsList = [adc_base, adc_fullACL, adc_rename];
        for (const testObject of testObjectsList) {
            if (isCertified) {
                await resetCertify({
                    dossier: testObject,
                    credentials: bot.adcUser.credentials,
                    type: '55',
                    certify: false,
                });
                await libraryPage.refresh();
            }
        }

        const parentFolderIdNamesMap = {
            // Delete temporary test objects from My Reports folder
            '703FC5687B4F691DF85862AED3C2D5B4': [adc_OriginalName, adc_RenamedName, adc_RenamedNameNew, adc_copyName],
            // Delete temporary test objects from My Reports > ShortcutFolder folder
            '24BCF3728E45F914ABCA5594FA92E5FB': [adc_fullACL.name],
            // Delete temporary test objects from My Reports > TargetMoveToFolder folder
            '7F9E97359445A028AF64D0B4198B2519': [adc_copyName],
        };
        for (const [parentFolderId, names] of Object.entries(parentFolderIdNamesMap)) {
            await deleteObjectByNames({
                credentials: bot.adcUser.credentials,
                projectId: project.id,
                parentFolderId: parentFolderId,
                names: names,
            });
        }
    });

    it('[TC99001_1] ADC - Grid view and list view', async () => {
        //reset certify status in case unstable context menu screenshot
        const isCertified = await libraryPage.libraryItem.isItemCertified(adc_base.name);
        if (isCertified) {
            await resetCertify({
                dossier: adc_base,
                credentials: bot.adcUser.credentials,
                type: '55',
                certify: false,
            });
            await libraryPage.refresh();
        }

        // grid view
        //// context menu
        await libraryPage.openDossierContextMenu(adc_base.name);
        await since(
            'Open context menu on gid view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'ADC_Manipulation', 'gridView_ContextMenu');
        //// info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Open info window on gid view, action buttons count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(4);
        await since(
            'Open info window on gid view, related content present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'ADC_Manipulation', 'gridView_infoWindow');
        await infoWindow.close();

        // switch to list view
        await listView.selectListViewMode();
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.selectFilterDetailsPanelItem('Owned by me');
        await libraryFilter.clickApplyButton();

        //// context menu
        await listView.openContextMenu(adc_base.name);
        await since(
            'Open context menu on list view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'ADC_Manipulation', 'listView_ContextMenu');
        //// info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Open info window on list view, info window present should be #{expected}, while we get #{actual}')
            .expect(await listView.isListViewInfoWindowPresent())
            .toBe(true);
        await since(
            'Open info window on grid view, related content present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(listView.getItemShare(), 'ADC_Manipulation', 'listView_infoWindow');

        // multi-select
        await listView.selectItemInListView(adc_base.name);
        await listView.selectItemInListView(adc_fullACL.name);
        await listView.selectItemInListView(adc_rename.name);
        await listView.openContextMenu(adc_base.name);
        await since(
            'Open context menu on list view in multi-select mode, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(2);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'ADC_Manipulation',
            'multiSelect_listView_ContextMenu'
        );
        //// switch to grid view
        await listView.deselectListViewMode();
        await libraryPage.openDossierContextMenu(adc_base.name);
        await since(
            'Open context menu on grid view in multi-select mode, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(2);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'ADC_Manipulation',
            'multiSelect_ListView_ContextMenu'
        );
        await libraryPage.clickDossierContextMenuItem('3 items');

        await libraryPage.clickFilterIcon();
        await libraryFilter.clickClearAllButton();
        await libraryFilter.clickApplyButton();
    });

    it('[TC99001_2] ADC - Favorite and Unfavorite', async () => {
        const adcCount = await libraryPage.getDataModelCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();
        // favorite by card
        await libraryPage.moveDossierIntoViewPort(adc_base.name);
        await libraryPage.favoriteByImageIcon(adc_base.name);
        await libraryPage.sleep(1000); // wait for static rendering
        // -- favorites count
        await since('Favorite by card, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        // -- ADC count
        await since('Favorite by card, the total ADC count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(adcCount - 1);

        // favorite by info window
        await libraryPage.openDossierInfoWindow(adc_fullACL.name);
        await infoWindow.favoriteData();
        await infoWindow.sleep(500); // wait for static rendering
        // -- ADC count
        await since('Favorite by infowindow, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 2);
        // -- favorites count
        await since('Favorite by infowindow, the total ADC count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(adcCount - 2);

        // remove favorite by context menu in multi-select mode
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(adc_base.name);
        await libraryPage.selectDossier(adc_fullACL.name);
        await libraryPage.openDossierContextMenu(adc_base.name);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'ADC_Manipulation', 'favorites_multiSelect');
        await libraryPage.clickDossierContextMenuItem('Remove from Favorites');
        // -- ADC count
        await since(
            'remove favorite by context menu, the total ADC count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(adcCount);
        // -- favorites section
        await since('Remove favorite, Favorites present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
    });

    it('[TC99001_3] ADC - Rename', async () => {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.selectFilterDetailsPanelItem('Owned by me');
        await libraryFilter.clickApplyButton();
        // Copy ADC first
        await libraryPage.openDossierContextMenu(adc_rename.name);
        await libraryPage.clickDossierContextMenuItem('Copy to');
        await copyMoveWindow.renameDossier(adc_OriginalName);
        await copyMoveWindow.openFolder('My Reports');
        await copyMoveWindow.clickCreate();

        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await sidebar.openDataSection();

        // Rename in grid view
        await libraryPage.openDossierContextMenu(adc_OriginalName);
        await libraryPage.clickDossierContextMenuItem('Rename');
        await libraryPage.renameDossier(adc_RenamedName);
        await libraryPage.waitForItemLoading();
        await listView.selectListViewMode();

        // Rename in list view
        await listView.openContextMenu(adc_RenamedName);
        await listView.clickContextMenuItem('Rename');
        await listViewAGGrid.renameDossierInGrid(adc_RenamedNameNew);
        await libraryPage.waitForItemLoading();

        // Delete the renamed ADC
        await listView.openContextMenu(adc_RenamedNameNew);
        await listView.clickContextMenuItem('Delete');
        await libraryPage.confirmDelete();

        await libraryPage.clickFilterIcon();
        await libraryFilter.clickClearAllButton();
        await libraryFilter.clickApplyButton();
    });

    it('[TC99001_4] ADC - Copy, move and delete', async () => {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.selectFilterDetailsPanelItem('Owned by me');
        await libraryFilter.clickApplyButton();

        const waitTime = 2000;
        const count = await libraryPage.getDataModelCountFromTitle();

        // copy to
        await libraryPage.openDossierContextMenu(adc_fullACL.name);
        await libraryPage.clickDossierContextMenuItem('Copy to');
        await since('copy ADC, copy to window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await takeScreenshotByElement(copyMoveWindow.getCopyMoveContent(), 'ADC_Manipulation', 'copyToWindow');
        await copyMoveWindow.renameDossier(adc_copyName);
        await copyMoveWindow.openFolder('My Reports');
        await copyMoveWindow.clickCreate();

        await libraryPage.sleep(waitTime); // delay to send get data model request
        await libraryPage.refresh(); // refresh to get the new data model due to time delay
        await libraryPage.openSidebarOnly();
        await since('copy ADC, ADC count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count + 1);

        // move to
        await libraryPage.openDossierContextMenu(adc_copyName);
        await libraryPage.clickDossierContextMenuItem('Move to');
        await since('move to ADC, move to window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await copyMoveWindow.openFolderByPath(moveToFolder.path);
        await copyMoveWindow.clickCreate();

        await libraryPage.sleep(waitTime); // delay to send get data model request
        await libraryPage.refresh(); // refresh to get the new data model due to time delay
        await since('copy ADC, ADC count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count + 1);

        // delete
        await libraryPage.openDossierContextMenu(adc_copyName);
        await libraryPage.clickDossierContextMenuItem('Delete');
        await since('delete ADC, delete window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isDeleteWindowPresent())
            .toBe(true);
        await libraryPage.confirmDelete();
        try {
            await libraryPage.waitForProgressBarGone();
        } catch (error) {
            // do nothing if progress bar not present
        }
        await since('delete ADC, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);

        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await sidebar.openDataSection();
        await since('delete ADC, ADC count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count);

        await libraryPage.clickFilterIcon();
        await libraryFilter.clickClearAllButton();
        await libraryFilter.clickApplyButton();
    });

    it('[TC99001_5] ADC - Create Shortcut', async () => {
        const count = await libraryPage.getDataModelCountFromTitle();
        await libraryPage.openDossierContextMenu(adc_fullACL.name);

        // create shortcut
        await libraryPage.clickDossierContextMenuItem('Create Shortcut');
        await since('creat shortcut, window present should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.isWindowPrensent())
            .toBe(true);
        await since('creat shortcut, project should be #{expected}, while we get #{actual}')
            .expect(await copyMoveWindow.getProject())
            .toBe(project.name);
        await copyMoveWindow.openFolderByPath(shortcutFolder.path);
        await copyMoveWindow.clickCreate();

        await libraryPage.refresh(); // refresh to get the new ADC due to time delay
        await since('create shortcut of ADC, count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getDataModelCountFromTitle())
            .toBe(count);

        // delete ADC - error shows
        await libraryPage.openDossierContextMenu(adc_fullACL.name);
        await libraryPage.clickDossierContextMenuItem('Delete');
        await since('delete ADC, delete window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isDeleteWindowPresent())
            .toBe(true);
        await takeScreenshotByElement(libraryPage.getDeleteConfirmationWindow(), 'ADC_Manipulation', 'deleteADC');
        await libraryPage.confirmDelete();
        await takeScreenshotByElement(libraryPage.getErrorDialogMainContainer(), 'ADC_Manipulation', 'deleteADC_error');
        await since('delete ADC, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await libraryPage.dismissError();

        // open content disvovery page
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(shortcutFolder.path);
        // delete shortcut of adc
        await listView.openContextMenu(adc_fullACL.name);
        await listView.clickContextMenuItem('Delete');
        await libraryPage.confirmDelete();
        await since('delete shorcut ADC, error window present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
    });

    it('[TC99001_6] ADC - Manage access', async () => {
        // manage access
        await libraryPage.openDossierInfoWindow(adc_fullACL.name);

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

        await takeScreenshotByElement(manageAccess.getManageAccessDialog(), 'ADC_Manipulation', 'manageAccessWindow');
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

    it('[TC99001_7] ADC - Certify', async () => {
        const isCertified = await libraryPage.libraryItem.isItemCertified(adc_fullACL.name);
        if (isCertified) {
            await resetCertify({
                dossier: adc_fullACL,
                credentials: bot.adcUser.credentials,
                type: '55',
                certify: false,
            });
            await libraryPage.refresh();
        }

        // Certify ADC
        await libraryPage.openDossierContextMenu(adc_fullACL.name);
        await since('On contenxt menu, Certify present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Certify'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Certify');

        // check certify status
        await libraryPage.openDossierInfoWindow(adc_fullACL.name);
        await since('Certified, On info window, Certify present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCertifiedPresent())
            .toBe(true);
        await infoWindow.close();

        // decertify
        await libraryPage.openDossierContextMenu(adc_fullACL.name);
        await since('On contenxt menu, Decertify present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Decertify'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Decertify');
        await libraryPage.openDossierInfoWindow(adc_fullACL.name);
        await since('Decertified, On info window, Certify present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCertifiedPresent())
            .toBe(false);
        await infoWindow.close();
    });

    it('[TC99001_8] ADC - Search', async () => {
        // Search results page - library home tab
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('bot');
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickMyLibraryTab();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since('Open info window on library search, ADC type exist should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('AI Data Collection'))
            .toBe(true); // behavior changed due to search tabs introduced on search results page
        await filterOnSearch.closeFilterPanel();

        // Search results page - all tab
        await quickSearch.inputTextAndSearch(adc_base.name);
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since('Open info window on library search, ADC type exist should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('AI Data Collection'))
            .toBe(true);

        // Check ADC filter results count
        const noFilterResultsCount = await fullSearch.getAllTabCount();
        await filterOnSearch.selectOptionInCheckbox('AI Data Collection');
        await filterOnSearch.applyFilterChanged();
        const filterResultsCount = await fullSearch.getAllTabCount();
        await since(
            'Filter on search, no filter results count minus filter results count should be #{expected}, while we get #{actual}'
        )
            .expect(noFilterResultsCount - filterResultsCount)
            .toBeGreaterThan(0);

        // Open info window and create bot
        await fullSearch.openInfoWindow(adc_base.name);
        await since(
            'Open info window on full search, related content present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'ADC_Manipulation', 'fullSearch_infoWindow');

        await infoWindow.clickCreateBotButton();
        await botAuthoring.waitForPageLoading();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await botAuthoring.exitBotAuthoringWithoutSave();
    });

    it('[TC99001_9] ADC - Content Discovery', async () => {
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(adc_folder.path);
        await listView.openContextMenu(adc_base.name);
        await since(
            'Open context menu on list view, context menu option count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'ADC_Manipulation', 'listView_ContextMenu');

        // Open info window
        await listView.openInfoWindowFromListView(adc_base.name);
        await since('Open info window, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowActionCount())
            .toBe(7);
        await takeScreenshotByElement(listView.getItemShare(), 'ADC_Manipulation', 'contentDiscovery_infoWindow', {
            tolerance: 0.12,
        });
        // More
        await listView.clickMoreMenuFromIW();
        await since('Open info window, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowMorActionAcount())
            .toBe(3);
        await takeScreenshotByElement(
            listView.getMoreOptiobDropDownInIW(),
            'ADC_Manipulation',
            'contentDiscovery_infoWindow_more'
        );

        // Create bot from info window
        await listView.clickCreateBotFromIW();
        await botAuthoring.waitForPageLoading();
        await botAuthoring.exitBotAuthoringWithoutSave();
    });
});
