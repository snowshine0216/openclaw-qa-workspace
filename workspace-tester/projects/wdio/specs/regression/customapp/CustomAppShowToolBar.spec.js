import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/customApp/info.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Show Toolbar', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        browserInstance: browsers.browser1,
        width: 599,
        height: 640,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        libraryAuthoringPage,
        notification,
        librarySort,
        libraryFilter,
        quickSearch,
        userAccount,
        reset,
        toc,
        infoWindow,
        bookmark,
        filterPanel,
        checkboxFilter,
        textbox,
    } = browsers.pageObj1;

    let dossierHomeShowToolbarBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoDossierHomeShowToolbar',
        dossierMode: 1,
        // sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups'],
        url: `/app/${consts.dossierWithPSfilterLink.project.id}/${consts.dossierWithPSfilterLink.id}`,
    });

    let customAppIdLibraryHomeDisableAll, customAppIdLibraryHomeDisableFavorite, customAppIdDossierHomeShowToolbar;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        customAppIdDossierHomeShowToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierHomeShowToolbarBody,
        });
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdLibraryHomeDisableAll,
                customAppIdLibraryHomeDisableFavorite,
                customAppIdDossierHomeShowToolbar,
            ],
        });
    });

    it('[TC76714] Library as home - Disable All Icons', async () => {
        await setWindowSize(browserWindow);
        // create app
        let libraryHomeDisableAllBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoLibraryHomeDisableAll',
            iconsHomeLibrary: [],
            iconsHomeDocument: [],
            sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups'],
        });
        customAppIdLibraryHomeDisableAll = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: libraryHomeDisableAllBody,
        });
        // default app, show all icons
        await since('In default app, sort box shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await librarySort.getSortBox().isDisplayed())
            .toBe(true);
        await since('In default app, Library filter shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryFilter.getFilterIcon().isDisplayed())
            .toBe(true);
        await since('In default app, Search shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await quickSearch.getSearchIcon().isDisplayed())
            .toBe(true);
        await since('In default app, Notification shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await notification.getNotificationIcon().isDisplayed())
            .toBe(true);
        await since('In default app, Multi Selector shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.getMultiSelectButton().isDisplayed())
            .toBe(true);
        await since('In default app, User Account shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(true);
        await since('In default app, New Dossier shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.getNewDossierIcon().isDisplayed())
            .toBe(true);

        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since(
            'In default app, Favorite button shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isFavoritesBtnPresent())
            .toBe(true);
        await since('Is Share button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isSharePresent())
            .toBe(true);
        await since(
            'In default app, Subscription button shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getManageSubscriptionsButton().isDisplayed())
            .toBe(true);
        await since(
            'In default app, Export to Excel button shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getExportExcelButton().isDisplayed())
            .toBe(true);
        await since(
            'In default app, Export to PDF button shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isExportPDFPresent())
            .toBe(true);
        await since(
            'In default app, Download Dossier button shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isDownloadDossierPresent())
            .toBe(true);
        await since('In default app, Reset button shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isResetPresent())
            .toBe(true);
        await since('In default app,  Remove button shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(true);
        await since('In default app,  Edit button shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.close();

        await libraryPage.openDossier(consts.testedDossier.name);
        await since(
            'In default app - dossier page, Home icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getLibraryIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , TOC icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Reset icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Bookmark icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Filter icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Undo icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getUndoIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Comments icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Share icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(true);
        await since(
            'In default app - dossier page, , Account icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(true);

        //change to app that only enables undo redo
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableAll });
        await libraryPage.waitForLibraryLoading();
        await since('In disable all app, Sort box shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await librarySort.getSortBox().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app, Library filter shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryFilter.getFilterIcon().isDisplayed())
            .toBe(false);
        await since('In disable all app, Search shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await quickSearch.getSearchContainer().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app, Notification shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await notification.getNotificationIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app, Multi Selector shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getMultiSelectButton().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app,  User Account shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);

        await libraryPage.openDossier(consts.testedDossier.name);
        await since(
            'In disable all app - dossier page, Home icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getLibraryIcon().isDisplayed())
            .toBe(true);
        await since(
            'In disable all app - dossier page, TOC icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app - dossier page, Reset icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app - dossier page, Bookmark icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app - dossier page,  Filter icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app - dossier page, Undo icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getUndoIcon().isDisplayed())
            .toBe(true);
        await since(
            'In disable all app - dossier page, Comments icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable all app - dossier page, Share icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(false);
        await since('disable all, Account icon shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC78888] Library as home - Show Toolbar - Disable Favorites', async () => {
        // create app
        let libraryHomeDisableFavorite = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoLibraryHomeDisableFavorite',
            iconsHomeDocument: ['table_of_contents', 'bookmarks', 'reset', 'filters', 'comments', 'share'],
            sidebarsHomeLibrary: ['all', 'recents', 'my_groups'],
        });
        customAppIdLibraryHomeDisableFavorite = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: libraryHomeDisableFavorite,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableFavorite });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await takeScreenshotByElement(
            await infoWindow.getActionIcons(),
            'TC78888_01',
            'Custom info window - Only show all 7 icons'
        );
        await infoWindow.close();
        await libraryPage.openDossier(consts.testedDossier.name);
        await toc.openMenu();
        const favIcon = await toc.getFavoritesIcon();
        await since(
            'When disable Favorites, favorite icon in toc panel shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await favIcon.isDisplayed())
            .toBe(false);
    });

    it('[TC76711] Dossier as home - Show Toolbar - Filter & Panel Stack & Prompt', async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.dossierWithPSfilterLink,
        });
        await dossierPage.openCustomAppById({ id: customAppIdDossierHomeShowToolbar, dossier: true });
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName('Country');
        // await mqSliderFilter.updateUpperInput('Cost', 20000000);

        // await mqFilter.openDropdownMenu('Discount');
        // await mqFilter.selectOption('Profit', 'Highest');
        // await mqFilter.updateValue({filterName: 'Discount', valueLower: 2});
        await filterPanel.apply();

        await textbox.navigateLink(1);
        await dossierPage.switchToNewWindow();
        let currentUrl = await browser.getUrl();
        await since('After link to new tab, url should contain config id to be #{expected}, instead we have #{actual}.')
            .expect(currentUrl)
            .toContain(customAppIdDossierHomeShowToolbar);
        await dossierPage.closeTab(1);
        await dossierPage.switchToNewWindow();
        await dossierPage.waitForDossierLoading();
        await dossierPage.sleep(2000);

        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        // TODO cancel the comment once the error window issue resolved

        // await grid.linkToTargetByGridContextMenu({
        //     title: 'Panel 1',
        //     headerName: 'Category',
        //     elementName: 'Music'
        // });
        //
        // await dossierPage.switchToNewWindow();
        // await promptEditor.cancelEditor();
        //
        // await userAccount.openUserAccountMenu();
        // await userAccount.logout();
        // await dossierPage.openCustomAppById(config.dossierAsHomeToolbar);
        // await dossierPage.sleep(2000);
        // await loginPage.waitForLoginView();
        // await loginPage.login({
        //     username: 'app',
        //     password: ''
        // });
        // await dossierPage.waitForDossierLoading();
        // currentUrl = await browsers.browser1.getCurrentUrl();
        // await since('Library home page: Url should contain config id').expect(currentUrl.includes(config.dossierAsHomeToolbar)).toBe(true);
    });

    it('[TC76708] Sort and Filter', async () => {
        await libraryPage.openDefaultApp();
        // switch to tablet view
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 700,
            height: 800,
        });
        await since(
            'After switch to tablet view, in default app,  Sort box in the filter dropdown shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await librarySort.getSortBox().isDisplayed())
            .toBe(true);

        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');
        await since(
            'In default app, after sort by on homepage (All section), the selected sort by item should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.currentSortOption())
            .toEqual('Name');
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await since('In default app, dossier type selected is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isDossierSelected())
            .toBe(true);
        await setWindowSize(browserWindow);
    });

    it('[TC76711_2] Dossier as home - Show Toolbar - Mobile view', async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.dossierWithPSfilterLink,
        });
        await dossierPage.openCustomAppById({ id: customAppIdDossierHomeShowToolbar, dossier: true });
        await dossierPage.waitForDossierLoading();
        await setWindowSize(mobileWindow);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC76711_2_1', 'show toolbar');
        //open in current tab
        await textbox.navigateLink(0);
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC76711_2_2', 'show toolbar');
        await dossierPage.goBackFromDossierLink();
        await textbox.navigateLink(1);
        await dossierPage.switchToNewWindow();
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC76711_2_3', 'show toolbar');
        await dossierPage.closeTab(1);
    });
});
