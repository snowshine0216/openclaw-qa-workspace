import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import resetBookmarks from '../../../api/resetBookmarks.js';

/**
 * Library Home:
 * 01 Onboarding
 * 02 Sort
 * 03 Filters
 * 04 Sidebar
 * 05 Favorites
 * 06 Group
 * 07 Subscription
 * 08 Global search
 * 09 Manage library
 * 10 Info-window
 */
const dossierNewName = 'Dossier Renamed';
describe('E2E Per Build Test on Library Home', () => {
    const dossier = {
        id: '4480640B11EAF10334D90080EF950B74',
        name: 'Call Center Management',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossierNotInMyLibrary = {
        id: 'FE72F33B11E7F54F000000802F31418D',
        name: 'Advanced and Predictive Analytics',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossierRenamed = {
        id: 'FE72F33B11E7F54F000000802F31418D',
        name: dossierNewName,
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        dossierPage,
        libraryPage,
        libraryFilter,
        librarySearch,
        infoWindow,
        userAccount,
        onboardingTutorial,
        sidebar,
        group,
        quickSearch,
        fullSearch,
        filterOnSearch,
        manageLibrary,
        subscribe,
        share,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(browsers.params.credentials);

        await deleteAllFavorites(browsers.params.credentials);
        await deleteAllGroups(browsers.params.credentials);
        await libraryPage.removeDossierFromLibrary(browsers.params.credentials, dossierRenamed);
        await libraryPage.removeDossierFromLibrary(browsers.params.credentials, dossierNotInMyLibrary);

        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });


        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
    });

    /**
     * [TC77736_01] Take a tour
     * 1. Open take a tour from account menu
     * 2. Click Continue button
     * 3. Click Next link
     * 4. Click Skip button
     * 5. Open dossier and check on-boarding is skipped
     */
    it('[TC77736_01] Library Web - Home - Take a tour', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Skip');
        // open dossier, no onboarding displays
        await libraryPage.openDossier(dossier.name);
        await since('Skip explorer library, onboarding should NOT be appeared on dossier page')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(false);
        await dossierPage.goToLibrary();
    });

    /**
     * [TC77736_02] Sort in Library homepage
     * 1. Check default sort option
     * 2. Sort by dossier name and check
     * 3. Sort by Z-A and check
     * 4. Close sort
     */
    it('[TC77736_02] Library Web - Home - Sort', async () => {
        //Check initial state
        await since('The sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Viewed');

        //Sort by name
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
        await libraryPage.openSortMenu();
        await since('The sort status after change sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Name');
        await takeScreenshotByElement(libraryPage.getSortMenu(), 'TC77736', 'Library sort - Sort by Name, A-Z');

        //Sort by Z-A
        await libraryPage.selectSortOrder('Z-A');
        await libraryPage.openSortMenu();
        await since('The sort status after change sort order should #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortStatus())
            .toEqual(['Name', 'dsc']);
        await libraryPage.closeSortMenu();
    });

    /**
     * [TC77736_03] Filter in Library homepage
     * 1. Check default filter option
     * 2. Filter by type Dossier and check
     * 3. Filter by Updated
     * 4. Clear filter and close
     */
    it('[TC77736_03] Library Web - Home - Filter', async () => {
        //Check initial state
        await libraryPage.hoverFilter();
        await since('The tooltip of Filter should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip(libraryPage.tooltip()))
            .toBe('Library Filter');

        //Click Filter Icon, Filter type: Dossier
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await since('Filter dossier on homepage, the Dossier shoule be selected')
            .expect(await libraryPage.isDossierSelected())
            .toBe(true);
        await libraryFilter.clickApplyButton();

        //Click Filter Icon, Filter type: Dossier and Updated
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Status');
        await libraryFilter.checkFilterType('Updated');
        await libraryFilter.clickApplyButton();
        await libraryPage.clickFilterIcon();
        await takeScreenshotByElement(libraryPage.getFilterContainer(), 'TC77736', 'Library Filter: Dossier & Updated');

        //Click Filter Icon, Clear Filter
        await libraryPage.clickFilterClearAll();
        await libraryFilter.clickApplyButton();
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await since('Filter dossier on homepage, after clear all, the Dossier shoule NOT be selected')
            .expect(await libraryPage.isDossierSelected())
            .toBe(false);
        await libraryPage.closeFilterPanel();
    });

    /**
     * [TC77736_05] Favorite dossiers
     * 1. Favorite dossier by icon, check favorite icon and count
     * 2. Open Favorites sidebar section and check
     * 3. Open info-window, unfavorite and check
     * 4. Back to ALl sectio and close sidebar
     */
    it('[TC77736_05] Library Web - Home - Favorites', async () => {
        // Favorite from favorite icon
        await libraryPage.favoriteByImageIcon(dossier.name);
        await since('Favorite dossier by favorites icon, favorites icon on dossier image should be selected')
            .expect(await libraryPage.isFavoritesIconSelected(dossier.name))
            .toBe(true);
        await since(
            'Favorite dossier by favorites icon, the total favorites count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
        await libraryPage.openSidebar();
        await since(
            'Favorite dossier, the total favorites count on Favorite list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);

        // Unfavorites dossier from info-window
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.removeFavorite();
        await since('Remove favorite dossier, Favorites should NOT be present on All list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);

        await libraryPage.closeSidebar();
    });

    /**
     * [TC77736_06] Group dossier
     * 1. Open sidebar, new group and check
     * 2. Move all dossier to group by multi-select bar, and check
     * 3. Switch to group section
     * 4. Remove one dossier from group, and check
     * 5. Delete group
     * 6. Close sidebar
     */
    it('[TC77736_06] Library Web - Home - Personal group', async () => {
        const groupName = 'Per Build Group';
        const total = await libraryPage.getAllCountFromTitle();
        // new group by sidebar
        await libraryPage.openSidebar();
        await sidebar.clickAddGroupBtn();
        await group.inputGroupName(groupName);
        await group.clickGroupSaveBtn();
        await since(`Add group, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);
        await since(`Add group, group count should be #{expected}, while we get #{actual}`)
            .expect(await sidebar.getGroupCount())
            .toBe(1);
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC77736s', 'Library Sidebar: group');

        // move all dossiers to group through multi-select bar
        await libraryPage.clickMultiSelectBtn();
        await group.clickGroupBarSelectAllBtn();
        await group.clickGroupBarActionBtn();
        await group.selectGroupBarContextMenu('Existing Group', groupName);
        await since(
            'Move to group from group bar in multi selection mode, after move, the group bar should NOT be presented'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        await sidebar.openGroupSection(groupName);
        await since(
            `Move to group from group bar in multi selection mode, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(total);

        // remove dossier from group
        await libraryPage.openDossierContextMenu(dossier.name);
        await libraryPage.clickDossierContextMenuItem('Remove from');
        await since(
            `Remove from context menu, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(total - 1);

        // delete group
        await sidebar.clickGroupOptions(groupName);
        await sidebar.deleteGroup();
        await since(`Delete group, after delete, group ${groupName} should NOT be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(false);
        await since(`Delete group, after delete, group list should be empty`)
            .expect(await sidebar.isGroupEmpty())
            .toBe(true);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    /**
     * [TC77736_07] Subscription
     * 1. Open dossier
     * 2. Create subsription and check
     * 3. Open sidebar, and open subscription section
     * 4. Unscribe this subscription, and check
     * 5. Close sidebar
     */
    it('[TC77736_07] Library Web - Home - Subscription', async () => {
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        
        const name = 'Subscrirption for Automation' + Math.random(1000);
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);

        // Create subscription
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName(name);
        await subscribe.createSubscription();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);
        await dossierPage.goToLibrary();

        // Sidebar subscription  - unsubscribe
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT * 2); //wait for subscription api returned
        await since('Create subcription, the newly created subscription should be existed')
            .expect(await subscribe.isSubscriptionExisted(name))
            .toBe(true);
        await subscribe.clickSidebarUnsubscribe(dossier.name);
        await subscribe.clickUnsubscribeYes();
        await subscribe.sleep(subscribe.DEFAULT_API_TIMEOUT);

        // Close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    /**
     * [TC77736_08] Global Search
     * 1. Enter search key and check search suggestion text
     * 2. View all results
     * 3. Sort results by dossier name, and check
     * 4. Filter results by Owner, and check
     * 5. Back to homepage
     */
    it('[TC77736_08] Library Web - Home - Global search', async () => {
        const keyword = 'call';
        await quickSearch.openSearchSlider();

        // Search dossier
        await quickSearch.inputText(keyword);
        await since(
            'Search dossier on quick search, search suggestion text items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(5);
        await quickSearch.clickViewAll();
        await fullSearch.clickMyLibraryTab();

        // Sort by dossier name
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(2);
        await since('Sort by dossier name, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Name');

        // Filter Owner on my library tab
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Owner');
        await filterOnSearch.selectOptionInCheckbox('Administrator');
        await since('Filter owner on My library tab, Administrator should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Owner', 'Administrator'))
            .toBe(true);
        await takeScreenshotByElement(filterOnSearch.getFilterDetailsPanel(), 'TC77736', 'Global Search: Filter');
        await filterOnSearch.applyFilterChanged();
        await since('Filter owner on My library tab, total counts should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(1);
        await fullSearch.backToLibrary();
    });

    /**
     * [TC77736_09] Manage Librarys
     * 1. Search dossier from Metedata
     * 2. Open dossier, add to my library
     * 3. Open manage library from account menu
     * 4. Rename this dossier
     * 5. Close manage library
     */
    it('[TC77736_09] Library Web - Home - Add to library and manage library', async () => {
        // Search dossier and Add to library
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('Advanced Predictive Analytics');
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResults(dossierNotInMyLibrary.name);
        await quickSearch.switchToNewWindow();

        await since('Add to library button display should be displayed')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await dossierPage.addToLibrary();
        await since('Add to library button display should NOT be visible')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await dossierPage.closeCurrentTab();
        await dossierPage.switchToTab(0);
        await dossierPage.goToLibrary();

        // rename dossier
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Added');
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await manageLibrary.editName({ option: 'icon', name: dossierNotInMyLibrary.name, newName: dossierNewName });
        await since(`The presence of renamed dossier is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(dossierNewName))
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();
    });

    /**
     * [TC77736_10] Dossier info window
     * 1. Open dossier info-window for newly added dosssier
     * 2. Click remove button to remove, and check
     *
     */
    it('[TC77736_10] Library Web - Home - Info window', async () => {
        const total = await libraryPage.getAllCountFromTitle();
        await libraryPage.moveDossierIntoViewPort(dossierRenamed.name);
        await libraryPage.openDossierInfoWindow(dossierRenamed.name);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC77736', 'Dossier infowindow');

        //remove from library
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        await since('Remove dossier from my librry, the dossier count should #{expected}, while we get #{actual}')
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(total - 1);
    });
});
