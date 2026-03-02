import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { isFileNotEmpty } from '../../../config/folderManagement.js';

describe('E2E Library of Business User', () => {
    const dossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierMDX = {
        id: '751C330C44471F34BF0081AFEE3B1120',
        name: 'Dossier sanity_MDX RA',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierFile = {
        name: dossier.name,
        fileType: '.mstr',
    };

    const dossierExcelFile = {
        name: dossier.name,
        fileType: '.xlsx',
    };

    const dossierPDFFile = {
        name: dossier.name,
        fileType: '.pdf',
    };

    const dossierCSVFile = {
        name: dossier.name,
        fileType: '.csv',
    };

    const dossierMDXPDFFile = {
        name: dossier.name,
        fileType: '.pdf',
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        bookmark,
        checkboxFilter,
        dossierPage,
        dynamicFilter,
        excelExportPanel,
        filterPanel,
        filterSummary,
        filterSummaryBar,
        grid,
        libraryPage,
        libraryFilter,
        librarySearch,
        lineChart,
        infoWindow,
        notification,
        pdfExportWindow,
        pieChart,
        promptEditor,
        promptObject,
        search,
        quickSearch,
        searchBoxFilter,
        searchPage,
        share,
        toc,
        reset,
        userAccount,
        fullSearch,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossierMDX,
        });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await dossierPage.sleep(500);
    });
    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // [TC58942_01] Shows incorrect credentials error message when user uses wrong pwd or username
    // 1. Login with invalid user
    // 2. Dismiss error dialog
    // 3. Clear input and login with wrong password
    // 4. Dismiss error dialog
    // 5. Clear input

    it('[TC58942_01] Shows incorrect credentials error message when user uses wrong pwd or username', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();

        await loginPage.login({ username: 'UserNotExisted', password: '' });
        await since(
            'The username is invalid, the error dialogue should display, instead the error dialog did not display'
        )
            .expect(await loginPage.isErrorPresent())
            .toBe(true);
        await since('The error title should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorTitle())
            .toBe('Authentication Error');
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorMsg())
            .toBe('Incorrect username and/or password. Please try again.');
        await loginPage.dismissError();
        await loginPage.clearCredentials();
        await loginPage.login({ username: 'Tester_auto', password: 'WrongPassword' });
        await since(
            'The password is wrong, the error dialogue should display, instead the error dialog did not display'
        )
            .expect(await loginPage.isErrorPresent())
            .toBe(true);
        await since('The error title should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorTitle())
            .toBe('Authentication Error');
        await since('The error message2 should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorMsg())
            .toBe('Incorrect username and/or password. Please try again.');
        await loginPage.dismissError();
        await loginPage.clearCredentials();
    });

    // [TC58942_02] Login with valid username and password, and check GUI of Library homepage
    // 1. Login with valid user
    // 2. Check tooltips of the icons

    it('[TC58942_02] Login with valid username and password, and check GUI of Library homepage', async () => {
        await loginPage.currentURL().then(async (url) => {
            const include = url.includes('app');
            if (!include) {
                await loginPage.login(browsers.params.credentials);
            }
        });

        await since('The Library icon should display, instead it did not')
            .expect(await (await libraryPage.getLibraryIcon()).isDisplayed())
            .toBe(true);
        await libraryPage.hover({ elem: libraryPage.getLibraryIcon() });
        await since('The tooltip of Library icon should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip(libraryPage.getLibraryIcon()))
            .toBe('Show Sidebar');

        await since('The Search icon should display, instead it did not')
            .expect(await (await search.getSearchIcon()).isDisplayed())
            .toBe(true);
        await libraryPage.hover({ elem: search.getSearchIcon() });
        await since('The tooltip of Library icon should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip(search.getSearchIcon()))
            .toBe('Search');

        // await since('The Notification icon should display, instead it did not')
        //     .expect(await notification.getNotificationIcon().isPresent()).toBe(true);
        // await libraryPage.hover({elem: notification.getNotificationIcon()});
        // await since ('The tooltip of Library icon should be #{expected}, instead we have #{actual}')
        //     .expect(await libraryPage.tooltip(notification.getNotificationIcon())).toBe('Notifications');

        await since('The Account icon should display, instead it did not')
            .expect(await (await userAccount.getUserAccount()).isDisplayed())
            .toBe(true);
        await libraryPage.hover({ elem: userAccount.getUserAccount() });
        await since('The tooltip of Library icon should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip())
            .toBe('Account');
    });

    // [TC58942_03] Sort items in Library page
    // 1. Hover on tooltip to check the tooltip of the sort status
    // 2. Open sort menu to check the tooltip of the sort status, and close sort menu
    // 3. Click quick sort, and check sort status
    // 4. Sort by Content Name Ascending, and check sort status

    it('[TC58942_03] Sort items in Library page ', async () => {
        //Check initial state
        await since('The sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Date Viewed');
        await libraryPage.openSortMenu();
        await takeScreenshotByElement(libraryPage.getSortMenu(), 'TC58942_03', 'Library page - initial - sort menu');

        //Sort by name
        await libraryPage.selectSortOption('Name');
        const sortByName = [
            'Dossier sanity_General',
            'Dossier sanity_MDX RA',
            'Opportunity Management',
            'Restore_Opportunity',
            'RSD Panel URL Test',
            'RSD with all kinds of prompt',
            'Sample RSD with selector and link drill',
            'Target_Sample RSD with prompt_CheckboxSelector_Excluded_CGB',
        ];
        await since('DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(sortByName);
        await libraryPage.openSortMenu();
        await since('The sort status after change sort option should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortOption())
            .toEqual('Name');

        //Sort by Z-A
        await libraryPage.selectSortOrder('Z-A');
        await libraryPage.openSortMenu();
        await since('The sort status after change sort order should #{expected}, instead we have #{actual}')
            .expect(await libraryPage.currentSortStatus())
            .toEqual(['Name', 'dsc']);
        await libraryPage.closeSortMenu();
    });

    // [TC58942_04] Filter items in Library page
    // 1. Hover on Filter to check the tooltip of the sort status
    // 2. Open Filter container and filter type: Dossier
    // 3. Click apply and check library page
    // 4. Open Filter container and filter type: Updated
    // 5. Click apply and check library page
    // 6. Click clear all, apply, and check library page

    it('[TC58942_04] Filter items in Library page ', async () => {
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOrder('Z-A');

        //Check initial state
        await libraryPage.hoverFilter();
        await since('The tooltip of Filter should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip())
            .toBe('Library Filter');

        //Click Filter Icon, Filter type: Dossier
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await takeScreenshotByElement(
            libraryPage.getFilterContainer(),
            'TC58942_04',
            'Library Filter container: Dossier'
        );
        await libraryFilter.clickApplyButton();
        const dossierOnly = ['Dossier sanity_MDX RA', 'Dossier sanity_General'];
        await since('DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(dossierOnly);

        //Click Filter Icon, Filter type: Dossier and Updated
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Status');
        await libraryFilter.checkFilterType('Updated');
        await libraryFilter.clickApplyButton();
        await takeScreenshotByElement(libraryPage.getEmptyLibraryFromFilter(), 'TC58942_04', 'Empty Library');

        //Click Filter Icon, Clear Filter
        await libraryPage.clickFilterIcon();
        await libraryPage.clickFilterClearAll();
        await libraryFilter.clickApplyButton();
        const clearFilter = [
            'Target_Sample RSD with prompt_CheckboxSelector_Excluded_CGB',
            'Sample RSD with selector and link drill',
            'RSD with all kinds of prompt',
            'RSD Panel URL Test',
            'Restore_Opportunity',
            'Opportunity Management',
            'Dossier sanity_MDX RA',
            'Dossier sanity_General',
        ];
        await since('DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(clearFilter);
    });

    // [TC58942_05] Search dossier and filter search results
    // 1. Open search input box, there should be no clear search icon and no recently searched list
    // 2. Search sanity and go to search result page
    // 3. Switch to Dossier tab
    // 4. Run dossier

    it('[TC58942_05] Search dossier and filter search results', async () => {
        // open search input box, there should be no clear search icon and no recently searched list
        await librarySearch.openSearchBox();
        await since('Input box should be empty')
            .expect(await librarySearch.isInputBoxEmpty())
            .toBe(true);
        await since('With empty string there should be no clear search icon displayed')
            .expect(await librarySearch.isClearSearchIconDisplayed())
            .toBe(false);
        await since('No recently searched item is displayed as no search result has been executed yet')
            .expect(await librarySearch.isRecentlySearchedListPresent())
            .toBe(false);
        await librarySearch.search('sanity');
        await since(
            `Search by sanity, search suggestion text items count should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBeGreaterThan(1);
        await since(
            `Search by sanity, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(2);
        await librarySearch.pressEnter();

        await since('Search string will be carried from Library Search to Search Page')
            .expect(await searchPage.searchString())
            .toBe('sanity');
        await since('2 matches count should be displayed when there is no match result')
            .expect(await searchPage.matchCount('dossier'))
            .toBe('2');

        // await searchPage.switchToOption('DOSSIER');
        await fullSearch.clickMyLibraryTab();
        await searchPage.executeResultItem(dossier.name);
        // await promptEditor.waitForEditor();
        await searchPage.switchToNewWindow();
        await promptEditor.run();
        await searchPage.closeCurrentTab();
        await searchPage.switchToTab(0);
    });

    // [TC58942_06] Modify filter selections and apply
    // 1. Select exclude mode and Apply, check the results
    // 2. Re-open filter panel, clear selection
    // 3. Click select all then clear all
    // 4. Select some elements, click Apply
    // 5. Open filter summary to check

    it('[TC58942_06] Modify filter selections and apply', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Quarter');

        //Exclude
        await checkboxFilter.selectContextMenuOption('Quarter', 'Exclude');
        await since(
            'CapsuleExcluded value for 2015 Q3 Quarter attribute is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsuleExcluded({ filterName: 'Quarter', capsuleName: '2015 Q3' }))
            .toBe(true);
        await since(
            'CapsuleExcluded value for 2015 Q4 Quarter attribute is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsuleExcluded({ filterName: 'Quarter', capsuleName: '2015 Q4' }))
            .toBe(true);
        await filterPanel.apply();
        await since('The first element of Category should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Category' }))
            .toBe('Electronics');
        await since('The first element of Cost should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$243,330');
        await since('In filter summary, Qurter should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Quarter'))
            .toBe('(exclude 2015 Q3, 2015 Q4)');

        //Clear All Filters
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since(
            'Quarter checkbox filter capsule "Quarter" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsulePresent({ filterName: 'Quarter', capsuleName: '2015 Q3' }))
            .toBe(false);
        await since(
            'Quarter checkbox filter capsule "Quarter" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isCapsulePresent({ filterName: 'Quarter', capsuleName: '2015 Q4' }))
            .toBe(false);

        //Select All
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectAll();
        await since('Quarter checkbox filter capsule "+7" should be present but it is not')
            .expect(await checkboxFilter.isCapsulePresent({ filterName: 'Quarter', capsuleName: '+7' }))
            .toBe(true);

        //Clear All
        await checkboxFilter.clearAll();
        await checkboxFilter.hoverOnElement('2015 Q3');

        //keep only
        await checkboxFilter.keepOnly('2015 Q3');

        //Search
        await checkboxFilter.search('2015');
        await checkboxFilter.selectElementByName('2015 Q4');
        await filterPanel.apply();
        await since('The first element of Category should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Category' }))
            .toBe('Electronics');
        await since('The first element of Cost should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$61,416');
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterPanelItems of Quarter should #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Quarter'))
            .toBe('2015 Q3,2015 Q4');
    });

    // [TC58942_07] Add/modify/delete Bookmark and switch bookmark
    // 1. Open bookmark panel:
    // 2. Add bookmark directly without input customized name
    // 3. Continue add bookmark with customized name
    // 4. Edit bookmark by change the name
    // 5. Do some manipulation and check if the save icon display
    // 6. Add new bookmarks
    // 7. Single delete one bookmark
    // 8. Multi- delete another bookmark
    // 9. switch bookmark
    // 10. Close bookmark panel

    it('[TC58942_07] Add/modify/delete Bookmark and switch bookmark', async () => {
        //run dossier with default prompt answer
        await libraryPage.openDossierAndRunPrompt(dossier.name);

        // Reset Bookmark
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await since(
            'Empty input can be created successfully with a default name #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        // 'Add new Bookmark with standard name'
        await bookmark.addNewBookmark('New Bookmark 1');
        await bookmark.renameBookmark('New Bookmark 1', 'Change Bookmark Name');
        await bookmark.closePanel();
        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Subcategory',
            firstOption: 'Sort Descending',
        });
        await bookmark.openPanel();
        if (libraryPage.isSafari()) {
            // 'Change Bookmark Name' will become 'Change Bokmark Name' on safari
            await bookmark.hoverOnBookmark('Change Bokmark Name');
            await since('Bookmark save icon should be present, instead it did not')
                .expect(await bookmark.isUpdateBMPresent('Change Bokmark Name'))
                .toBe(true);
        } else {
            await bookmark.hoverOnBookmark('Change Bookmark Name');
            await since('Bookmark save icon should be present, instead it did not')
                .expect(await bookmark.isUpdateBMPresent('Change Bookmark Name'))
                .toBe(true);
        }
        await bookmark.addNewBookmark('Subcategory Sort Descending');
        await bookmark.addNewBookmark('');
        await bookmark.applyBookmark('Bookmark 1');
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$61,416');
        await bookmark.openPanel();
        await bookmark.deleteBookmark('Bookmark 1');
        await since('Number of Bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(3);
        await bookmark.editBulkDeleteBookmarks();
        if (libraryPage.isSafari()) {
            //'Change Bookmark Name' will become 'Change Bokmark Name' on safari
            await bookmark.selectBookmarkToDeleteByName('Change Bokmark Name');
        } else {
            await bookmark.selectBookmarkToDeleteByName('Change Bookmark Name');
        }
        await bookmark.selectBookmarkToDeleteByName('Bookmark 2');
        await bookmark.selectAllToDelete();
        await bookmark.bulkDeleteBookmarks();
        await bookmark.confirmDelete();
        await since('Number of Bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(0);
        await bookmark.closePanel();
    });

    // [TC58942_08] [TC58942_08] Share dossier via Get link, Download Dossier, and Export to Excel
    // 1. Click Share icon to open Share panel
    // 2. Click Get Link button to open Link detail panel
    // 3. Check the link URL and click Copy button
    // 4. Click Download Dossier button and wait for download success
    // 5. Click Export to Excel button to open Grid list
    // 6. Select Empty Grid and Export button should be disabled
    // 7. Select Grid and Export button should be enabled
    // 8. Click Export button and wait for download success

    it('[TC58942_08] Share dossier via Get link, Download Dossier, and Export to Excel', async () => {
        // const baseURL = browser.options.baseUrl.trim().endsWith('/')
        //     ? browser.options.baseUrl.trim()
        //     : browser.options.baseUrl.trim() + '/';

        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        const url = browser.options.baseUrl + 'app/' + dossier.project.id + '/' + dossier.id + '/share';
        await since('Link should be #{expected}, instead we have #{actual}')
            .expect(await share.getShareViaLink())
            .toBe(url);
        await share.clickCopyButton();
        await share.closeShareDossierPanel();
        // DE313993: [HCL need to fix] After opening share dashboard dialog, the original share panel was not dismissed
        // await dossierPage.openShareDropDown();
        await share.downloadDossier();
        const skipBrowsers = ['msedge', 'safari'];
        if (!(browsers.params.browser && skipBrowsers.includes(browsers.params.browser.browserName))) {
            await share.waitForDownloadComplete(dossierFile);
            await since('The MSTR File was not downloaded')
                .expect(await isFileNotEmpty(dossierFile))
                .toBe(true);
        }
    });

    // [TC58942_10] Reset dossier and apply new prompt answer
    // 1. Check Reset icon state and Reset dossier
    // 2. Remove all selected elements for Category
    // 3. Search by key word 'one', no elements returned
    // 4. Search again by key word 'o'
    // 5. Move the searched elements to right box either by add or add all icon
    // 6. Switch to next prompt 'Cost'
    // 7. Change the operator
    // 8. Change the value
    // 9. Click View summary
    // 10. Click Run

    it('[TC58942_10] Reset dossier and apply new prompt answer', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        // Checking reset state
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await reset.selectReset();
        await reset.confirmReset(true);
        const prompt1 = await promptObject.getPromptByName('Category');
        await promptObject.shoppingCart.removeAll(prompt1);
        await promptObject.shoppingCart.searchFor(prompt1, 'one');
        await since('Search result of "$$$" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt1))
            .toBe(0);
        await promptObject.shoppingCart.clearSearch(prompt1);
        await promptObject.shoppingCart.searchFor(prompt1, 'o');
        await since('Search result of "$$$" is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt1))
            .toBe(3);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt1, 'Electronics');
        await promptObject.shoppingCart.addSingle(prompt1);
        await since('Count of selectedcount is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt1))
            .toEqual(1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_10', 'Add Electronics to list');
        await promptObject.shoppingCart.addAll(prompt1);
        await since('After add all, Count of availablecount is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt1))
            .toBe(0);
        await since('After add all, Count of selectedcount is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt1))
            .toEqual(3);
        const prompt2 = await promptObject.getPromptByName('Cost');
        await promptObject.shoppingCart.openConditionDropdown(prompt2, 1);
        await promptObject.shoppingCart.selectCondition(prompt2, 'Highest%');
        await promptObject.shoppingCart.openMQFirstValue(prompt2, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt2, '5');
        await promptObject.shoppingCart.confirmValues(prompt2);
        await promptEditor.toggleViewSummary();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_10', 'Prompt Summary');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$113,371');
    });

    // Select one element of Category on grid, RMC to open context menu:
    // 1. Click keep only
    // 2. Click to Drill->Day
    // 3. Select one or more elements on Day, click exclude
    // 5. Click view filter, and check the filter condition
    // 6. Clear those conditions
    it('[TC58942_11] Do manipulation on Grid: Keep only, drill down, exclude and clear view filter to recover state', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await grid.selectGridElement({
            title: 'Grid',
            headerName: 'Subcategory',
            elementName: 'Cameras',
        });
        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Subcategory',
            elementName: 'Cameras',
            firstOption: 'Keep Only',
        });
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$160,957');
        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Category',
            elementName: 'Electronics',
            firstOption: 'Drill',
            secondOption: 'Day',
        });
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Day' }))
            .toBe('7/14/2015');
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$6,395');

        await grid.multiSelectGridElements({
            title: 'Grid',
            headerName: 'Day',
            elementName1: '7/14/2015',
            elementName2: '7/15/2015',
        });

        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Day',
            elementName: '7/14/2015',
            firstOption: 'Exclude',
        });

        await grid.openViewFilterContainer('Grid');
        await grid.clearViewFilter('Clear "Not Day = 7/14/2015 OR 7/15/2015"');
        await grid.openViewFilterContainer('Grid');
        await grid.clearViewFilter('Clear "Subcategory = Cameras"');
        await grid.openViewFilterContainer('Grid');
        await grid.clearViewFilter('Clear drill conditions');
        await since('View filter present should be #{expected}, instead we have #{actual}')
            .expect(await grid.isViewFilterPresent('Grid'))
            .toBe(false);
    });

    // [TC58942_12] Show data of the grid and export the dataset
    // 1. Click show data
    // 2. Select some attribute/metric
    // 3. Click "OK", check the data
    // 4. Click Export > Data
    // 5. Close show data window

    it('[TC58942_12] Do manipulation on Grid: Show data of the grid and export the dataset', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await grid.selectShowDataOnVisualizationMenu('Grid');
        await grid.showDataDialog.clickAddDataButton();
        await grid.showDataDialog.addElementToDataset({ title: 'Attributes', elem: 'Year' });
        await takeScreenshotByElement(
            grid.showDataDialog.getAddDataContainer(),
            'TC58942_12',
            'Add Year into Dataset',
            { tolerance: 0.2 }
        );
        await grid.showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();
        await grid.showDataDialog.clickShowDataCloseButton();
    });

    // Click go to target to link the target dossier:
    // 1. Click one Category element
    // 2. Link to target dossier either by context menu or tooltip
    // 2. In the target dossier, open filter summary to check filter should be passed
    // 3. Re-prompt, click view summary to check :
    //     category value should be the same as source
    // cost value should be the initial value of target
    // 4. open view filter, the Category={selected element}
    // 5. click back icon

    it('[TC58942_13] Click go to target to link the target dossier', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await grid.openGridElmContextMenu({
            title: 'Grid',
            headerName: 'Subcategory',
            elementName: `TV's`,
        });
        await since("'Go to Dashboard: (AUTO) DossierLinking_Source and Target' option should be present")
            .expect(
                await grid.isContextMenuOptionPresent({
                    level: 0,
                    option: 'Go to Dashboard: target dossier',
                })
            )
            .toBe(true);
        await grid.linkToTargetByGridContextMenu({ title: 'Grid', headerName: 'Subcategory', elementName: `TV's` });
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element of Category attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Category' }))
            .toBe('Electronics');
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$569,778');
        await since('Link to target from grid tooltip, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('The filterSummaryBar of Quarter is 2015 Q3, 2015 Q4')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2015 Q3, 2015 Q4)');
        await grid.openViewFilterContainer('Visualization 1');
        if (libraryPage.isSafari()) {
            await since('View filter should contain #{expected}, instead we have #{actual}')
                .expect(await grid.getViewFilterItemText())
                .toContain(`Clear "Subcategory =  TV&#039;s"`);
        } else {
            await since('View filter should contain #{expected}, instead we have #{actual}')
                .expect(await grid.getViewFilterItemText())
                .toContain(`Clear "Subcategory = TV&#039;s`);
        }
        await promptEditor.reprompt();
        await promptEditor.closeEditor();
        await dossierPage.waitForPageLoading();
        await dossierPage.goBackFromDossierLink();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Grid'))
            .toEqual(15);
        await since('The first element of Category attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Category' }))
            .toBe('Electronics');
        await since('The first element of Cost attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Grid', headerName: 'Cost' }))
            .toBe('$61,416');
    });

    // [TC58942_14] Do manipulation on Pie Chart and Line Chart
    // 1. Switch to page 2 from Toc menu
    // 2. Sort descending by Cost on Y axis
    // 3. Sort Ascending bu Subcategory on X axis
    // 4. Hover on element and check tooltip
    // 5. Exclude, Drill, and keep only
    // 6. Show data
    // 7. Do step 4~6 on Pie Chart

    it('[TC58942_14] Do manipulation on Pie Chart and Line Chart', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });

        //Line Chart
        await lineChart.selectYAxisContextMenuOption({ vizName: 'Line chart', firstOption: 'Sort Descending' });
        await lineChart.selectXAxisContextMenuOption({ vizName: 'Line chart', firstOption: 'Sort Ascending' });

        await lineChart.hoverOnElementByXAxis({ vizName: 'Line chart', eleName: 'Cameras', lineName: '2015' });
        await since('Tooltip contents should be "#{expected}" but is "#{actual}"')
            .expect(await lineChart.vizTooltip())
            .toBe('Year 2015 Subcategory Cameras Cost $160,957 ');

        if (libraryPage.isSafari()) {
            // click on y axis to dismiss the tooltip, if the tooltip exists
            // the class name for chart won't be found await since the chart is hovered
            await lineChart.clickOnYAxis('Line chart');
        }

        // exclude
        await lineChart.exclude({ vizName: 'Line chart', eleName: `TV's`, lineName: '2015' });
        await since('After exclude, Is element present should be "#{expected}" but is "#{actual}"')
            .expect(
                await lineChart.isElementPresent({
                    vizName: 'Line chart',
                    eleName: `TV's`,
                })
            )
            .toBe(false);

        // drill
        await lineChart.drill({ vizName: 'Line chart', eleName: 'Cameras', lineName: '2015', drillOption: 'Quarter' });
        await since('After drill, Is element present should be "#{expected}" but is "#{actual}"')
            .expect(
                await lineChart.isElementPresent({
                    vizName: 'Line chart',
                    eleName: 'Audio Equipment',
                })
            )
            .toBe(false);
        await since('After drill, Is element present should be "#{expected}" but is "#{actual}"')
            .expect(
                await lineChart.isElementPresent({
                    vizName: 'Line chart',
                    eleName: '2015 Q3',
                })
            )
            .toBe(true);

        // keep only
        await lineChart.keepOnly({ vizName: 'Line chart', eleName: '2015 Q3', lineName: '2015' });
        await since('After keepOnly, Is element present should be "#{expected}" but is "#{actual}"')
            .expect(
                await lineChart.isElementPresent({
                    vizName: 'Line chart',
                    eleName: '2015 Q4',
                })
            )
            .toBe(false);
        await since('After keepOnly, Is element present should be "#{expected}" but is "#{actual}"')
            .expect(
                await lineChart.isElementPresent({
                    vizName: 'Line chart',
                    eleName: '2015 Q3',
                })
            )
            .toBe(true);

        await lineChart.selectShowDataOnVisualizationMenu('Line chart');
        await since('For Linechart, Dataset row count should be "#{expected}" but is "#{actual}"')
            .expect(await lineChart.showDataDialog.getDatasetRowCount())
            .toBe(1);
        await lineChart.showDataDialog.clickShowDataCloseButton();
        await dossierPage.waitForPageLoading();

        //Pie Chart
        await pieChart.hoverOnSlice({ title: 'Pie chart', slice: 'Cameras' });
        await since('Tooltip contents should be "#{expected}" but is "#{actual}"')
            .expect(await pieChart.vizTooltip())
            .toBe('Total Cost $570,713   Subcategory Cameras Cost $160,957 Percent Contribution 28.20% ');

        // exlude
        await pieChart.exclude({ title: 'Pie chart', slice: `TV's` });
        await since('After exclude, Total number of pie slices should be #{expected} but are #{actual}')
            .expect(await pieChart.sliceCount('Pie chart'))
            .toBe(4);

        // drill
        await pieChart.drillTo({ title: 'Pie chart', slice: 'Cameras', drillTarget: 'Quarter' });
        await since('After drill, Total number of pie slices should be #{expected} but are #{actual}')
            .expect(await pieChart.sliceCount('Pie chart'))
            .toBe(2);
        await since('2015 Q4 pie slices exist should be #{expected} but are #{actual}')
            .expect(await pieChart.isSlicePresent({ title: 'Pie chart', label: '2015 Q4' }))
            .toBe(true);

        // keep only
        await pieChart.keepOnly({ title: 'Pie chart', slice: '2015 Q4' });
        await since('After keepOnly, Total number of pie slices should be #{expected} but are #{actual}')
            .expect(await pieChart.sliceCount('Pie chart'))
            .toBe(1);

        await pieChart.selectShowDataOnVisualizationMenu('Pie chart');
        await since('For pieChart, Dataset row count should be "#{expected}" but is "#{actual}"')
            .expect(await lineChart.showDataDialog.getDatasetRowCount())
            .toBe(1);
        await pieChart.showDataDialog.clickShowDataCloseButton();
        await dossierPage.waitForPageLoading();
    });

    // [TC58942_15] Share and reset dossier via recommendation window
    // 1. Open dossier info window
    // 2. Download dossier
    // 3. Click reset and confirm reset
    // 4. Run prompt with default prompt answer
    // 5. Open dossier info window
    // 6. Click Export to PDF to open Export to PDF panel
    // 7. Modify settings
    // 8. Check API parameters

    it('[TC58942_15] Share and reset dossier via recommendation window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('Recommendation panel exist should be #{expected} but are #{actual}')
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(true);
        await infoWindow.downloadDossier();
        await promptEditor.waitForEditor();
        await promptEditor.run();
        const skipBrowsers = ['msedge', 'safari'];
        if (!(browsers.params.browser && skipBrowsers.includes(browsers.params.browser.browserName))) {
            await infoWindow.waitForDownloadComplete(dossier.name, '.mstr');
            await since(`The dataset Excel file for ${dossier.name} was not downloaded`)
                .expect(await isFileNotEmpty(dossierFile))
                .toBe(true);
        }
        await infoWindow.selectReset();
        await infoWindow.confirmResetWithPrompt();
        await promptEditor.waitForEditor();
        await promptEditor.run();
    });

    it('[TC58942_16] Do manipulations on MDX hierarchy filter', async () => {
        await libraryPage.openDossier(dossierMDX.name);
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts(Group)');
        await dynamicFilter.clickBranchSelectionButton('Balance Sheet');
        await since(
            'Branch select "Balance Sheet", selection status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Balance Sheet'))
            .toBe(true);

        // Expand parent node, child nodes should also be selected and dynamic
        await dynamicFilter.expandElement('Balance Sheet');
        await since('Selection status for child node is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.isSelected('Assets'))
            .toBe(true);
        await dynamicFilter.singleDeselectElement('Balance Sheet');
        await since(
            'Single deselect father branch, selection status for father branch is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Balance Sheet'))
            .toBe(false);
        await since(
            'Single deselect father branch, selection status for child node is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Assets'))
            .toBe(true);

        // Expanded/collapsed status should be saved after applying filter
        await since(
            'Apply filter and open filter again, expand status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isExpanded('Balance Sheet'))
            .toBe(true);
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Account Level 02');

        // close level panel
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.expandElement('Net Income');
        await since(
            'Select level 2, selection status for node in level 2 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Profit'))
            .toBe(true);
        await dynamicFilter.expandElement('Operating Profit');
        await since(
            'Select level 2, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Gross Margin'))
            .toBe(false);

        /*** Branch selection & level selection ***/
        // first click, deselect 'Operating Profit'
        await dynamicFilter.clickBranchSelectionButton('Operating Profit');
        // second click, select branch 'Operating Profit'
        await dynamicFilter.clickBranchSelectionButton('Operating Profit');

        await since(
            'Select level 2 and branch select node in level 2, selection status for node in level 2 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Profit'))
            .toBe(true);
        await since(
            'Select level 2 and branch select node in level 2, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Gross Margin'))
            .toBe(true);

        // Clear level
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Account Level 03');
        await dynamicFilter.clearLevelByName('Account Level 03');
        await dynamicFilter.clickLevelIcon();
        await since(
            'Clear level 3, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Gross Margin'))
            .toBe(false);

        // Check capsule in filter panel
        await filterPanel.apply();
        await since('The row count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(34);

        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts(Group)');
        await dynamicFilter.selectNthSearchLevel(2);
        await since('Current search level is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.currentSearchLevel())
            .toBe('Account Level 02');
        await dynamicFilter.searchByEnter('O');
        await since(
            'Search NDE within specific level, result count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(5);
        await dynamicFilter.clickBranchSelectionButton('Other Income and Expense');
        await dynamicFilter.clickBranchSelectionButton('Operating Profit');
        await dynamicFilter.clearSearch();
        await since(
            'Search for un-expanded element, search result is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(11);
        await filterPanel.apply();
        await since('The row count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(22);
    });
});
