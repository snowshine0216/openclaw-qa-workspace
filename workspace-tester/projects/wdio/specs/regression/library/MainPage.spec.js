import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import shareDossierToUsers from '../../..//api/shareDossierToUsers.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetCertify from '../../../api/resetCertify.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';

const specConfiguration = { ...customCredentials('_home') };
const userID = '780684284B707E37EDE5B391CC2B7516';

describe('Library main page', () => {
    const dossier = {
        id: 'E4F211FF456BCA08EA6AD0B6DD869C0C',
        name: 'Dossier General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierCertified = {
        id: '3240627F4FDC5AB2B0DC02AC4FE4A632',
        name: 'Dossier Certified',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierNew = {
        id: '09F680E542F7A8D454CE91B850EDFF44',
        name: 'Dossier New',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierUpdated = {
        id: '296402064D39949AD2B446A8CD6D0BAF',
        name: 'Dossier Updated',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierPublish1 = {
        id: '751C330C44471F34BF0081AFEE3B1120',
        name: 'Dossier sanity_MDX RA',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierPublish2 = {
        id: '9129882E41BB13067C03D78D3A0D6417',
        name: 'target dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierLongName = {
        id: 'BF4912B543716A239F58E8BDB3D0EEBF',
        name: 'Dossier with looooooooooooooooooooong name',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierRenamed = {
        id: '9129882E41BB13067C03D78D3A0D6417',
        name: 'Dossier renamed',
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

    const dossierContext = {
        id: 'D09ABAF743EE44B4C725A6BC7B405ED8',
        name: '(AUTO) Remove from library',
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
        libraryFilter,
        notification,
        loginPage,
        userAccount,
        manageLibrary,
        promptEditor,
        reset,
        shareDossier,
        dossierAuthoringPage,
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
        await deleteAllFavorites(specConfiguration.credentials);
        const isCertified = await libraryPage.libraryItem.isItemCertified(dossierLongName.name);
        if (isCertified === true) {
            await resetCertify({
                dossier: dossierLongName,
                credentials: specConfiguration.credentials,
                type: '55',
                certify: false,
            });
        }
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, dossierPublish1);
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, dossierPublish2);
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, dossierContext);
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.logoutClearCacheAndLogin(specConfiguration.credentials);
    });

    // [TC73978] Dossier | Verify Sort Dossier Items in Library Page
    // 1. Hover on tooltip to check the tooltip of the sort status
    // 2. Open sort menu to check the tooltip of the sort status, and close sort menu
    // 3. Click quick sort, and check sort status
    // 4. Sort by Content Name Ascending, and check sort status
    // 5. Sort by Date Added Ascending, and check sort status
    // 6. Sort by Date Viewed Ascending, and check sort status

    it('[TC73977] Dossier | Verify Sort Dossier Items in Library Page', async () => {
        // Check initial state (Date Viewed)
        await since('sortOption is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.librarySort.currentSortOption())
            .toBe('Date Viewed');
        await libraryPage.sleep(2000);

        // Sort By Dossier Updated
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Date Updated');
        await since(
            'Sort By date updated, last DossierName in Library should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.lastItem())
            .toEqual('RSD Panel URL Test');
        await libraryPage.librarySort.openSortMenu();

        // Sort by Dossier Name
        await libraryPage.librarySort.selectSortOption('Name');
        const sortByDossierName = [
            'Dossier Certified',
            'Dossier General',
            'Dossier New',
            'Dossier Updated',
            'Dossier with looooooooooooooooooooong name',
            'RSD Panel URL Test',
            'Sample RSD with selector and link drill',
        ];
        await since('sortByDossierName, DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(sortByDossierName);

        // Sort by Date Added
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Date Added');
        const sortByDateAdded = [
            'Dossier General',
            'Dossier New',
            'Sample RSD with selector and link drill',
            'Dossier Updated',
            'Dossier Certified',
            'Dossier with looooooooooooooooooooong name',
            'RSD Panel URL Test',
        ];
        await since('sortByDateAdded, DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(sortByDateAdded);

        // Sort by Date Viewed
        await libraryPage.openDossier(dossierCertified.name);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossierLongName.name);
        await dossierPage.goToLibrary();
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Date Viewed');
        const sortByDateViewed = ['Dossier with looooooooooooooooooooong name', 'Dossier Certified'];
        await since('sortByDateViewed, dossier in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.firstTwoItems())
            .toEqual(sortByDateViewed);
    });

    // [TC73978] Dossier | Verify Filter Dossier Items in Library Page
    // 1. Hover on Filter to check the tooltip of the sort status
    // 2. Open Filter container and filter type: Dossier
    // 3. Click apply and check library page
    // 4. Open Filter container and filter type: Updated
    // 5. Click apply and check library page
    // 6. Click clear all, apply, and check library page

    it('[TC73978] Dossier | Verify Filter Dossier Items in Library Page', async () => {
        // sort by name
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Name');

        //Check initial state
        await since('The dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(7);
        await libraryPage.hoverFilter();
        await since('The tooltip of Filter should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip())
            .toBe('Library Filter');

        //Click Filter Icon, Filter type: Dossier
        await libraryPage.clickFilterIcon();
        await since('Filter dropdown options should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterOptions())
            .toEqual(['Project', 'Type', 'Owner', 'Status', 'Certified Only']);
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.selectOptionInCheckbox('Dashboard');
        await libraryFilter.clickApplyButton();
        const filterOnlyDossier = [
            'Dossier Certified',
            'Dossier General',
            'Dossier New',
            'Dossier Updated',
            'Dossier with looooooooooooooooooooong name',
        ];
        await since('filterOnlyDossier, dossier in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(filterOnlyDossier);
        await since('The dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(5);
        await since('Filter count should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterCount())
            .toBe('1');

        //Click Filter Icon, Filter type: Dossier and Updated
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Status');
        await libraryFilter.selectFilterOptionButton('Updated');
        await libraryFilter.clickApplyButton();
        const dossierAndUpdated = ['Dossier Updated'];
        await since('dossierAndUpdated, DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(dossierAndUpdated);
        await since('The updated dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(1);
        await since('Filter count should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterCount())
            .toBe('2');

        //Click Filter Icon, Filter type: Dossier and New
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Status');
        await libraryFilter.keepOnlyOption('New');
        await libraryFilter.clickApplyButton();
        const dossierAndNew = ['Dossier New'];
        await since('dossierAndUpdated, DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(dossierAndNew);
        await since('The new dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(1);
        await since('Filter count should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterCount())
            .toBe('2');

        //Click Filter Icon, Filter type: Dossier and Certified
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Status');
        await libraryFilter.clickFilterDetailsPanelButton('Clear All');
        await libraryFilter.selectCertifiedOnly();
        await libraryPage.closeFilterPanel();
        const dossierAndCertify = ['Dossier Certified'];
        await since('dossierAndCertify, DossierName in Library should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.allItemList())
            .toEqual(dossierAndCertify);
        await since('The certified dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(1);
        await since('Filter count should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterCount())
            .toBe('2');

        // check project filter
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Project');
        await libraryFilter.searchFilterItem('MicroStrategy Tutorial1');
        await since('Is Library empty should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.noElementText())
            .toBe('No elements found');
        await libraryFilter.clearSearch();
        await libraryFilter.searchFilterItem('MicroStrategy Tutorial');
        await libraryFilter.keepOnlyOption('MicroStrategy Tutorial Timezone');
        await libraryFilter.clickApplyButton();
        // await libraryFilter.sleep(2000);
        await since('Is Library empty should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isLibraryEmptyFromFilter())
            .toBe(true);

        // check owner
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Project');
        await libraryFilter.clickFilterDetailsPanelButton('Select All');
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.keepOnlyOption('user withLoooooooooooooongName');
        await libraryFilter.toggleViewSelected();
        await since('Number of Selected Items should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getDetailsPanelItemsCount())
            .toBe(1);
        await libraryFilter.clickApplyButton();
        await since('The certified dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(1);

        //Click Filter Icon, Clear Filter
        await libraryPage.clickFilterIcon();
        await libraryPage.clickFilterClearAll();
        await libraryPage.closeFilterPanel();
        await since('The dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(7);
    });

    it('[TC96586] Verify Library Filter for different sections', async () => {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.selectOptionInCheckbox('Document');
        await libraryFilter.clickApplyButton();

        // switch custom app
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
        await libraryPage.openSidebarOnly();
        await sidebar.clickPredefinedSection('Browse Folders');
        await since('Filter count should be #{expected  }, instead we have #{actual}')
            .expect(await libraryFilter.isFilterCountDisplayed())
            .toBe(false);
        since('In browse folders page without items, library filter display should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.isLibraryFilterDisplay())
            .toBe(false);
        since('In browse folders page without items , library sort display should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.librarySort.isSortDisplay())
            .toBe(false);
        await contentDiscovery.openFolderByPath(['Shared Reports']);
        await libraryPage.clickFilterIcon();
        await since('In browse folders page, library filter should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterOptions())
            .toEqual(['Type', 'Certified Only']);
        await libraryPage.closeFilterPanel();

        await libraryPage.openCustomAppById({ id: '' });
        await since('Filter count should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.filterCount())
            .toBe('1');
    });

    // [TC23592] Dossier | Verify Info Window Functionalities in Library Page
    // 1. Open info window and check tooltip
    // 2. Check sanity functionality of Export To PDF: Open PDF setting window and export with default settings
    // 3. Check sanity functionality of Download
    // 4. Check sanity functionality of Reset
    // 5. Check sanity functionality of Edit
    // 6. Check sanity functionality of Remove

    it('[TC23592] Dossier | Verify Info Window Functionalities in Library Page', async () => {
        await resetDossierState({
            credentials,
            dossier,
        });

        // set web url firstly on library admin page
        await adminPage.openAdminPage();
        await adminPage.chooseTab('Library Server');
        await adminPage.inputMicroStrategyWebLink(browsers.params.mstrWebUrl);
        await adminPage.clickSaveButton();
        await adminPage.clickLaunchButton();
        await adminPage.switchToTab(1);

        // Open info window and check tooltip
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showIconTooltip({ option: 'Favorite' }))
            .toBe('Add to Favorites');
        await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showIconTooltip({ option: 'Share' }))
            .toBe('Share Dashboard');
        await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showIconTooltip({ option: 'ExportToPDF' }))
            .toBe('Export to PDF');
        await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showIconTooltip({ option: 'Reset' }))
            .toBe('Reset');
        await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showIconTooltip({ option: 'Remove' }))
            .toBe('Remove from Library');
        if ((await infoWindow.isEditIconPresent()) === true) {
            await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
                .expect(await infoWindow.showIconTooltip({ option: 'Edit' }))
                .toBe('Edit');
        }

        // Check sanity functionality of Favorites
        await infoWindow.favoriteDossier(dossier.name);
        await since(
            'Favorite dossier by hoempage info-window, favorites button on info-window image should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        await since(
            'Favorite dossier by hoempage info-window, the total favorites should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);

        //uncheck favorite
        await infoWindow.removeFavoriteDossier(dossier.name);
        await since(
            'Uncheck Favorite dossier by hoempage info-window, favorites button on info-window image should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(false);

        // Check sanity functionality of Share
        await infoWindow.shareDossier();
        await shareDossier.copyLink();
        await shareDossier.closeDialog();

        // Check sanity functionality of Reset
        await libraryPage.reload();
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.selectReset();
        await infoWindow.confirmResetWithPrompt();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        //Library Authoring enabled
        await libraryPage.moveDossierIntoViewPort(rsdSample.name);
        await libraryPage.openDossierInfoWindow(rsdSample.name);

        // Check sanity functionality of Edit
        if ((await infoWindow.isEditIconPresent()) === true) {
            await infoWindow.clickEditButton();
            await libraryPage.switchToTab(2);
            await since('Current Url should contain be')
                .expect(await browser.getUrl())
                .toBe(browsers.params.mstrWebUrl);
            await libraryPage.switchToTab(1);
            await libraryPage.closeTab(2);
        }
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        // Check sanity functionality of Remove
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        await since('The dossier has been removed, the dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(6);
        await shareDossierToUsers({
            dossier,
            credentials,
            targetUserIds: [userID],
            targetCredentialsList: [credentials],
        });
        await libraryPage.reload();
        await libraryPage.openDossier(dossier.name);
        await promptEditor.run();
        await libraryPage.reload();

        // reset web link on library admin page
        await libraryPage.switchToTab(0);
        await adminPage.inputMicroStrategyWebLink('');
        await adminPage.clickSaveButton();
        await adminPage.switchToTab(1);
    });

    // it('[TC88165] Verify removing the "Add to Library" bar will trigger a re-adjustment of the content dimensions', async () => {
    //     const dossierPublish1Url =
    //         browser.options.baseUrl + 'app/' + dossierPublish1.project.id + '/' + dossierPublish1.id;
    //     await browser.url(dossierPublish1Url, 30000);
    //     since('The "Add to Library" bar should be removed')
    //         .expect(await dossierPage.isAddToLibraryBarVisible())
    //         .toBe(false);
    // });

    // [TC73976] Dossier | Library management end-to-end workflow
    // 1. Add new dossier to library through "Add to Library" button
    // 2. Sort Dossier items in Library page
    // 3. Add new dossier to library through API
    // 4. Rename dossier
    // 5. Remove two dossiers

    it('[TC73976] Dossier | Verify Library management end-to-end workflow', async () => {
        // publish new dossier to library and add to library
        const dossierPublish1Url =
            browser.options.baseUrl + 'app/' + dossierPublish1.project.id + '/' + dossierPublish1.id;
        await browser.url(dossierPublish1Url, 30000);
        await dossierPage.addToLibrary();
        await since('Thd dossier is new added, the reset button should be disabled')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();

        // check if the dossier is the first item when sorting by "Date Added"
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Added');
        // await since('Thd latest added dossier should be #{expected}, instead we have #{actual}')
        //     .expect(await libraryPage.getFirstDossierName()).toBe(dossierPublish1.name);

        // publish another dossier by API
        await shareDossierToUsers({
            dossier: dossierPublish2,
            credentials,
            targetUserIds: [userID],
            targetCredentialsList: [credentials],
        });
        await libraryPage.reload();

        // rename dossier
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await manageLibrary.editName({ option: 'icon', name: dossierPublish2.name, newName: 'Dossier renamed' });
        await since(
            `The presence of dossier ${dossierPublish2.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable('Dossier renamed'))
            .toBe(true);

        // remove two new added dossiers
        await manageLibrary.selectItem(dossierPublish1.name);
        await manageLibrary.selectItem('Dossier renamed');
        await manageLibrary.hitRemoveButton();
        await manageLibrary.confirmRemoval();
        await manageLibrary.closeManageMyLibrary();
        await since('The dossier has been removed, the dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(7);
    });

    // [TC20535] Dossier name got inappropriately truncated in Info Window
    // 1. Hover on dossier title to check tooltip
    // 2. Open info window to check dossier title
    // 3. Close dossier info window

    it('[TC20535] Dossier name got inappropriately truncated in Info Window', async () => {
        // Open info window and check tooltip
        await libraryPage.moveDossierIntoViewPort(dossierLongName.name);
        await libraryPage.hoverOnDossierName(dossierLongName.name);
        await since('Thd dossier name is too long, so the tooltip should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.tooltip())
            .toBe(dossierLongName.name);
        await libraryPage.openDossierInfoWindow(dossierLongName.name);
        await since('Thd dossier title should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getDossierTitle().getText())
            .toBe(dossierLongName.name);
        await infoWindow.close();
    });

    // [TC18917] Any operations can't take effect after select manage My Library in user account when recommendation panel opened
    // 1. open dossier info window
    // 2. open user account menu and open management page
    // 3. do manipulations
    // 4. close management page

    it("[TC18917] Any operations can't take effect after select manage My Library in user account when recommendation panel opened", async () => {
        await libraryPage.openDossierInfoWindow(dossier.name);
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await manageLibrary.selectAll();
        await since('Is item selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isItemSelected('Dossier General'))
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();
    });

    // [TC23913] Verify E2E test of Recommendation in Library Main Page
    // 1. open dossier info window
    // 2. click view more to check recommendation list
    // 3. open dossier from recommendation list

    it('[TC23913] Verify E2E test of Recommendation in Library Main Page', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickViewMoreButton();
        await infoWindow.openDossierFromRecommendationsListByIndex(1);
        await dossierPage.goToLibrary();
    });

    it('[TC83699] Verify user with long name displays as expected in Library Main Page', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.libraryItem.hoverOnUserName(dossier.name);
        await since('Tooltip shows for long name is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.getTooltipText())
            .toBe('user withLoooooooooooooongName');
    });

    it('[TC87864] Dossier | Verify certify icon in Library Page', async () => {
        await libraryPage.moveDossierIntoViewPort(dossierCertified.name);
        await libraryPage.libraryItem.hoverOnCertifiedIcon(dossierCertified.name);

        // certify tooltip in main page
        const certifyInfo = 'Certified by Liu Hungchao 123öeè!@#4我 on 02/19/2021, 6:44:24 PM';
        const certifyInfoHQ = 'Certified by Liu Hungchao 123öeè!@#4我 on 02/19/2021, 5:44:24 AM';
        const certifyTooltipText = await libraryPage.libraryItem.getTooltipText();
        await since('Certified infomation is supposed to be #{expected}, instead we have #{actual}')
            .expect(certifyInfo === certifyTooltipText || certifyInfoHQ === certifyTooltipText)
            .toBe(true);

        // certify tooltip in manage library
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await libraryPage.libraryItem.hoverOnCertifiedIcon(dossierCertified.name);
        await libraryPage.sleep('1000');
        const certifyUserInfo = 'Certified by Liu Hungchao 123öeè!@#4我 on 02/19/2021, 6:44:24 PM';
        const certifyUserInfoHQ = 'Certified by Liu Hungchao 123öeè!@#4我 on 02/19/2021, 5:44:24 AM';
        const certifyTooltipTextInManageLibrary = await libraryPage.libraryItem.getTooltipText();
        await since(
            'In manage Library page, Certified infomation is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                certifyUserInfo === certifyTooltipTextInManageLibrary ||
                    certifyUserInfoHQ === certifyTooltipTextInManageLibrary
            )
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();
    });

    it('[TC88548] Certification information in Info Window not update when decertify/certify dossier again', async () => {
        const oldCredentials = {
            username: 'shuanwang',
            password: '',
        };
        await libraryPage.switchUser(oldCredentials);

        await resetCertify({ dossier: dossierLongName, credentials: oldCredentials, type: '55', certify: true });
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossierLongName.name);
        await libraryPage.openDossierInfoWindow(dossierLongName.name);
        await since('In infoWindow, Certified infomation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.certifiedDetails())
            .toContain(oldCredentials.username);
        await libraryPage.switchUser(specConfiguration.credentials);
        await libraryPage.moveDossierIntoViewPort(dossierLongName.name);
        await libraryPage.openDossierInfoWindow(dossierLongName.name);
        await since('Before re-certify, Certified infomation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.certifiedDetails())
            .toContain(oldCredentials.username);
        await libraryPage.openDossierContextMenu(dossierLongName.name);
        await libraryPage.clickDossierContextMenuItem('Decertify');
        await libraryPage.openDossierContextMenu(dossierLongName.name);
        await libraryPage.clickDossierContextMenuItem('Certify');
        await since('In infoWindow, Certified infomation is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.certifiedDetails())
            .toContain(credentials.username);
    });

    it('[TC96787] Verify Reset/Remove from Library in context menu', async () => {
        await shareDossierToUsers({
            dossier: dossierContext,
            credentials,
            targetUserIds: [userID],
            targetCredentialsList: [credentials],
        });
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossierContext.name);
        await libraryPage.openDossier(dossierContext.name);
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Page 1' });
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierContextMenu(dossierContext.name);
        await libraryPage.clickDossierContextMenuItem('Reset');
        await since('Reset confirmation message is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.errorMsg())
            .toBe(
                'Are you sure you want to reset the dashboard "(AUTO) Remove from library"? The action cannot be undone.'
            );
        await libraryPage.clickErrorActionButton('Reset');
        await dossierPage.waitForDossierLoading();
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierContextMenu(dossierContext.name);
        await libraryPage.clickDossierContextMenuItem('Remove from Library');
        await since('The message should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorMsg())
            .toBe(
                'This action will remove the object "(AUTO) Remove from library" from library and permanently delete all related bookmarks or subscriptions. Continue?'
            );
        await libraryPage.clickErrorActionButton('Remove');
        await since('The dossier has been removed, the dossier items should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getDossierCount())
            .toBe(7);
    });

    it('[TC94946] Verify UI of account panel when closed with different methods', async () => {
        // check UI for cancel
        await libraryPage.openUserAccountMenu();
        await userAccount.openMyApplicationPanel();
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC94946', 'Account Panel when click cancel');

        // check UI for click account
        await userAccount.openMyApplicationPanel();
        await userAccount.clickAccountButton();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC94946', 'Account Panel when click account');

        // check UI for click blank area
        await userAccount.openMyApplicationPanel();
        await libraryFilter.clickFilterIcon();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(
            userAccount.getAccountDropdown(),
            'TC94946',
            'Account Panel when click blank area'
        );
        await libraryPage.closeUserAccountMenu();
    });

    it('[TC83617] Verify UI in Library Main Page', async () => {
        await resetDossierState({
            credentials,
            dossier,
        });

        //sort by name
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Name');

        // check phone view of library main page
        await setWindowSize({
            width: 360,
            height: 740,
        });
        await takeScreenshot('TC83617', 'Library Page in phone view', { tolerance: 0.2 });
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(dossier.name))
            .toBe(true);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.hideIdInInfoWindow();
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC83617', 'Info window in phone view', {
            tolerance: 0.3,
        });
        await infoWindow.close();
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await takeScreenshot('TC83617', 'Dossier Page in phone view', { tolerance: 0.3 });
        await libraryPage.clickLibraryIcon();

        // check tablet view of library main page
        await setWindowSize({
            width: 580,
            height: 800,
        });

        // check UI of library sort
        await libraryPage.hamburgerMenu.openLibraryFilterInMobileView();
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSortAndFilterPanel(),
            'TC83617',
            'Library sortandfilter panel in mobile view',
            { tolerance: 0.4 }
        );
        await libraryPage.hamburgerMenu.openSortByDropdownInMobileView();
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSortAndFilterPanel(),
            'TC83617',
            'Open sort dropdown in mobile view',
            { tolerance: 0.4 }
        );
        await libraryPage.hamburgerMenu.closeSortByDropdownInMobileView();

        // check UI of library filter - types
        await libraryPage.hamburgerMenu.openTypesDropdownInMobileView();
        await libraryPage.hamburgerMenu.waitForElementVisible(libraryFilter.getFilterDetailPanelCheckboxItems()[0]);
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSortAndFilterPanel(),
            'TC83617',
            'Open types dropdown in mobile view',
            { tolerance: 0.4 }
        );
        await libraryPage.hamburgerMenu.closeFilterPanelInMobileView();
        await takeScreenshot('TC83617', 'Library Page in mobile view');

        // check UI of info window
        await resetDossierState({
            credentials,
            dossier,
        });
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.hideRelatedContentContainer();
        await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC83617', 'Info Window', { tolerance: 0.4 });
        await infoWindow.clickViewMoreButton();
        await infoWindow.hideRelatedContentItem();
        await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC83617', 'Dossier Info Window', { tolerance: 0.4 });

        // check UI of manage library
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Account');
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Manage Library');
        await since('Library Object Type icon for grid view should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.libraryItem.isObjectTypeIconDisplayed(dossier.name))
            .toBe(true);
        await takeScreenshot('TC20535', 'Manage Library in mobile view');
        await libraryPage.hamburgerMenu.closeManageLibrary();

        await setWindowSize(browserWindow);
        // check UI of library sort
        await libraryPage.librarySort.openSortMenu();
        await takeScreenshotByElement(libraryPage.librarySort.getSortDropdown(), 'TC83617', 'Library page - sort menu');
        await libraryPage.librarySort.selectSortOption('Name');
        await takeScreenshot('TC83617', 'Library Page');

        // check UI of library filter
        await libraryPage.clickFilterIcon();
        await takeScreenshotByElement(
            libraryPage.libraryFilter.getFilterContentsContainer(),
            'TC83617',
            'Library Filter container'
        );
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await takeScreenshotByElement(libraryPage.getFilterContainer(), 'TC83617', 'Library Filter container: Dossier');
        await libraryPage.selectFilterOptionButton('Updated');
        await libraryPage.selectFilterOptionButton('New');
        await takeScreenshotByElement(
            libraryPage.getFilterContainer(),
            'TC83617',
            'Library Filter container: updated and new'
        );
        await libraryPage.clickFilterClearAll();
        await libraryPage.closeFilterPanel();

        // check UI of info window
        await resetDossierState({
            credentials,
            dossier,
        });
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.hideRelatedContentItem();
        await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC83617', 'Info Window', { tolerance: 0.4 });
        await infoWindow.clickViewMoreButton();
        await infoWindow.hideRelatedContentItem();
        await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC83617', 'Dossier Info Window', { tolerance: 0.4 });

        // check UI of manage library
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await takeScreenshot('TC83617', 'Manage Library');
        await manageLibrary.selectAll();
        await takeScreenshot('TC83617', 'Manage Library: select all');
        await manageLibrary.closeManageMyLibrary();
    });

    it('[TC84217_01] Verify Library homepage displays as expected from different entrance - open from dossier page', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        const dossierPublishUrl =
            browser.options.baseUrl + 'app/' + dossierPublish1.project.id + '/' + dossierPublish1.id;
        await browser.url(dossierPublishUrl, 30000);
        await loginPage.login(specConfiguration.credentials);
        await dossierPage.goToLibrary();
        //sort by name
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Name');
        await libraryPage.openSidebar();
        await libraryPage.moveToPosition(100, 0);
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC84217_01', 'Library page - sidebar');
        await libraryPage.librarySort.openSortMenu();
        await takeScreenshotByElement(
            libraryPage.librarySort.getSortDropdown(),
            'TC84217_01',
            'Library page - sort menu'
        );
        await libraryPage.clickFilterIcon();
        await takeScreenshotByElement(libraryPage.getFilterContainer(), 'TC84217_01', 'Library Filter container');
        await libraryPage.userAccount.openUserAccountMenu();
        await takeScreenshotByElement(libraryPage.userAccount.getAccountDropdown(), 'TC84217_01', 'Library Account');
        await libraryPage.userAccount.closeUserAccountMenu();
    });

    it('[TC84217_02] Verify Library homepage displays as expected from different entrance - open from dossierAuthoring page ', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        const dossierPublishUrl =
            browser.options.baseUrl + 'app/' + dossierPublish1.project.id + '/' + dossierPublish1.id + '/edit';
        await browser.url(dossierPublishUrl, 30000);
        // await loginPage.login(specConfiguration.credentials);
        await loginPage.loginToEditMode(specConfiguration.credentials);
        await dossierAuthoringPage.goToLibrary();
        //sort by name
        await libraryPage.librarySort.openSortMenu();
        await libraryPage.librarySort.selectSortOption('Name');
        await libraryPage.openSidebar();
        await takeScreenshotByElement(
            sidebar.getSidebarContainer(),
            'TC84217_02',
            'Library page - sidebar from dossierAuthoring'
        );
        await libraryPage.librarySort.openSortMenu();
        await takeScreenshotByElement(
            libraryPage.librarySort.getSortDropdown(),
            'TC84217_02',
            'Library page - sort menu from dossierAuthoring'
        );
        await libraryPage.clickFilterIcon();
        await takeScreenshotByElement(
            libraryPage.getFilterContainer(),
            'TC84217_02',
            'Library Filter container from dossierAuthoring'
        );
        await libraryPage.userAccount.openUserAccountMenu();
        await takeScreenshotByElement(
            libraryPage.userAccount.getAccountDropdown(),
            'TC84217_02',
            'Library Account from dossierAuthoring'
        );
        await libraryPage.userAccount.closeUserAccountMenu();
    });
});

export const config = specConfiguration;
