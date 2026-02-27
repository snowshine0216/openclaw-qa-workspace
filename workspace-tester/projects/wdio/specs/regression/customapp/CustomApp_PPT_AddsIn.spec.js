import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { browserWindow, mobileWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('PPT adds-in End to End test', () => {
    let {
        libraryPage,
        libraryAuthoringPage,
        librarySearch,
        quickSearch,
        fullSearch,
        filterOnSearch,
        dossierPage,
        toc,
        bookmark,
        reset,
        filterPanel,
        userAccount,
        textbox,
        contentDiscovery,
        listView,
    } = browsers.pageObj1;

    const mstrUser = {
        credentials: {
            username: 'mstr1',
            password: 'newman1#',
        },
    };

    const contentGroup = {
        name: '-3.Auto_web_content_group',
        id: '2A026748A44410F3A72FF89BF2B0FFFC',
    };

    const testDossier = {
        id: '3D5AD91611E8285C3D690080EFA5ACC6',
        name: 'Financial Analysis',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const homeDossier = consts.homeDossier;

    const dossierNotInLibrary = {
        id: 'DFB368A64A4B2B24F2CB1091344E5E3F',
        name: 'Custom-App-Test-Target',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const testRSD = {
        id: '688551A69743F9B407C66BA909F038E9',
        name: 'RSDGraph',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const testReport = {
        id: '028F2A1446B9ACA28C7ED79D75232B21',
        name: 'Customer List',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let customAppObj = consts.LibraryAsHomeCustomAppObj;
    customAppObj.homeScreen.homeLibrary.contentBundleIds = [contentGroup.id];
    customAppObj.homeScreen.homeLibrary.showAllContents = true;
    let dossierAsHomeObj = consts.DossierAsHomeCustomAppObj;
    let botAsHomeObj = consts.bydBotAsHomeCustomAppObj;

    let customAppId, dossierAsHomeAppId, botAsHomeAppId;

    beforeAll(async () => {
        customAppId = await createCustomApp({ credentials: mstrUser.credentials, customAppInfo: customAppObj });
        dossierAsHomeAppId = await createCustomApp({
            credentials: mstrUser.credentials,
            customAppInfo: dossierAsHomeObj,
        });
        botAsHomeAppId = await createCustomApp({
            credentials: mstrUser.credentials,
            customAppInfo: botAsHomeObj,
        });
        await setWindowSize(browserWindow);
        await browsers.pageObj1.loginPage.login(browsers.params.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({ credentials: browsers.params.credentials, dossier: testDossier });
        await resetDossierState({ credentials: browsers.params.credentials, dossier: homeDossier });
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: mstrUser.credentials,
            customAppIdList: [customAppId, dossierAsHomeAppId, botAsHomeAppId],
        });
        await setWindowSize(browserWindow);
        await logoutFromCurrentBrowser();
    });

    /**
     * PPT adds-in mode Library web UI disabling
     * 1. No New Content(Dossier & Report)
     * 2. No Notification panel
     * 3. No Account icon
     */
    it('[TC89557_01] Library Home toolbar icon check in PPT adds-in', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // in account panel, check user name is not displayed
        await since(
            'isDisplay() of new content in Library home toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await (await libraryAuthoringPage.getNewDossierIcon()).isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of notificaiton icon in Library home toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getNotificationIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of user account in Library home toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.userAccount.getUserAccount().isDisplayed())
            .toBe(false);

        // mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.openHamburgerMenu();
        await since(
            'isDisplay() of new content in responsive view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryAuthoringPage.getNewDossierIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of notifications option in responsive view of side menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Notifications').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of account option in responsive view of side menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Account').isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC89557_01',
            'Notification and account in hamberger menu is disabled'
        );
    });

    /**
     * 1. No insights/subscription tab in side bar
     * 2. No add my group icon
     */
    it('[TC89557_02] No insights and subscription in Library Home side bar', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openSidebar();
        await since('isDisplay() of Insights in side bar is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.sidebar.getPredefinedSectionItem('Insights').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Subscriptions in side bar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.sidebar.getPredefinedSectionItem('Subscriptions').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Add group icon in side bar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.sidebar.getAddGroupBtn().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.sidebar.getSidebarContainer(),
            'TC89557_02',
            'Insight subscription and add my group is disabled'
        );

        // mobile view
        await setWindowSize(mobileWindow);
        await since(
            'isDisplay() of Insights in side bar of responsive view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.sidebar.getPredefinedSectionItem('Insights').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Subscriptions in side bar of responsive view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.sidebar.getPredefinedSectionItem('Subscriptions').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Add group icon in side bar of responsive view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.sidebar.getAddGroupBtn().isDisplayed())
            .toBe(false);
    });

    /**
     * Filter out document & report, only show dossiers in
     * 1. All
     * 2. Favorites
     * 3. Recents
     * 4. Content groups
     * 5. My groups
     * 6. etc
     */
    it('[TC89557_03] Only show dossiers in PPT adds-in', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openSidebar();
        await since(
            'isDisplay() of document in PPT adds-in All tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getItem(testRSD.name).isDisplayed())
            .toBe(true);
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openGroupSection(contentGroup.name);
        await since(
            'isDisplay() of document in PPT adds-in Content Groups tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getItem(testRSD.name).isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Report in PPT adds-in Content Groups tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getItem(testReport.name).isDisplayed())
            .toBe(false);
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openGroupSection('Documents');
        await since(
            'isDisplay() of document in PPT adds-in My Groups tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getItem(testRSD.name).isDisplayed())
            .toBe(true);
    });

    /**
     *  Only show dossier in quick search, global search, recent viewed
     *  Not type in library home search filter & global search filter
     */
    it('[TC89557_04] Only show dossier in search', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openAllSectionList();
        await libraryPage.clickFilterIcon();
        await takeScreenshotByElement(
            libraryPage.libraryFilter.getFilterContentsContainer(),
            'TC89557_04',
            'Filter panel in library home'
        );
        await libraryPage.closeFilterPanel();
        await librarySearch.openSearchBox();
        await librarySearch.search(testRSD.name);
        await takeScreenshotByElement(librarySearch.getResults(), 'TC89557_04', 'Quick search for documents');
        await librarySearch.pressEnter();
        // await dossierPage.sleep(2000);
        await since(
            'isDisplay() of document in global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getResultItemByName(testRSD.name).isDisplayed())
            .toBe(true);
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(testReport.name);
        await librarySearch.pressEnter();
        await since('isDisplay() of report in global search is expected to be #{expected}, instead we have #{actual}.')
            .expect(await fullSearch.getResultItemByName(testReport.name).isDisplayed())
            .toBe(false);
        await fullSearch.waitForSearchLoading();
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(testDossier.name);
        await filterOnSearch.openSearchFilterPanel();
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC89557_04',
            'Filter panel in global search'
        );
        await filterOnSearch.closeFilterPanel();
        await fullSearch.backToLibrary();
    });

    /**
     * UI control in info window of Library Home and search
     * 1. No recommandation
     * 2. Only Remove from dossier/favorite/reset buttons, others hidden
     */
    it('[TC89557_05] UI control in info window', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openAllSectionList();
        await libraryPage.openDossierInfoWindow(testDossier.name);
        await since(
            'isDisplay() of Favorite button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getFavoriteButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Reset button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getResetButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Remove button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getRemoveButton().isDisplayed())
            .toBe(true);

        await since(
            'isDisplay() of Share button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getShareButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Manage Subscription button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getManageSubscriptionsButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Export to Excel button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getExportExcelButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Export to PDF button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getExportPDFButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Download .mstr file button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getDownloadDossierButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Edit button in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getEditButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Recommandation section info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.infoWindow.getRecommendationsList().isDisplayed())
            .toBe(false);
        await libraryPage.infoWindow.close();
        await librarySearch.openSearchBox();
        await librarySearch.search(testDossier.name);
        await librarySearch.pressEnter();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(testDossier.name);
        await since(
            'isDisplay() of Favorite button in info window of global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getFavoriteButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Reset button in info window of global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getResetButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Reset button in info window of global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getRemoveButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Share button in info window of global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getShareButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Manage Subscription button in info window of global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getManageSubscriptionsButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Export to Excel button in info window of global search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getExportExcelButton().isDisplayed())
            .toBe(false);
        await fullSearch.infoWindow.fakeTimestamp();
        await takeScreenshotByElement(
            fullSearch.infoWindow.getInfoWindow(),
            'TC89557_05',
            'Info window in my Library tab in search'
        );
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(testDossier.name);
        await since(
            'isDisplay() of Favorite button in info window of global search all tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getFavoriteButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Reset button in info window of global search all tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getResetButton().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Reset button in info window of global search all tab is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await fullSearch.infoWindow.fakeTimestamp();
        await takeScreenshotByElement(
            fullSearch.infoWindow.getInfoWindow(),
            'TC89557_05',
            'Info window my All tab in search'
        );
    });

    /**
     * No context menu in Library home
     */
    it('[TC89557_06] No context menu in Library home', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openSidebar();
        await libraryPage.openDossierContextMenuNoWait(testDossier.name);
        await since(
            'isDisplay() of Context menu in Library home is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenu().isDisplayed())
            .toBe(false);
    });

    /**
     * Dossier toolbar UI control
     * Comment, share, account, edit and viz export should hide
     */
    it('[TC89557_07] UI control in dossier toolbar when Library as home', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openDossier(testDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'isDisplay() of Reset button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of TOC button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Boomkmark button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Filter icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);

        await since(
            'isDisplay() of Comment icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Share icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Account icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Edit icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getEditIcon().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(dossierPage.getNavigationBarLeft(), 'TC89557_07', 'Dossier left toolbar control');
        await takeScreenshotByElement(
            dossierPage.getNavigationBarRight(),
            'TC89557_07',
            'Dossier right toolbar control'
        );
        // mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.openHamburgerMenu();
        await since(
            'isDisplay() of Filter option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Filter').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Bookmarks option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Bookmarks').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Reset option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Reset').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC89557_07',
            'Dossier toolbar control in responsive view'
        );
    });

    it('[TC89557_08] UI control in dossier toolbar when dossier as home', async () => {
        await libraryPage.openCustomAppById({ id: dossierAsHomeAppId });
        await libraryPage.openDossier(homeDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'isDisplay() of TOC button in Dossier toolbar  is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Boomkmark button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Filter icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Notification icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);

        await since(
            'isDisplay() of Comment icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Share icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Account icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Edit icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getEditIcon().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierPage.getNavigationBar(),
            'TC89557_08',
            'Dossier toolbar control when dossier as home'
        );
        // mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.openHamburgerMenu();
        await since(
            'isDisplay() of Filter option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Filter').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Bookmarks option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Bookmarks').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Account option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Account').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Collaboration option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Collaboration').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Notifications option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Notifications').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Share option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Share').isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC89557_08',
            'Dossier toolbar control when dossier as home in responsive view'
        );
    });

    /**
     * Dossier toolbar UI control in target dossier
     */
    it('[TC89557_09] UI control in dossier toolbar when linking to target', async () => {
        await libraryPage.openCustomAppById({ id: dossierAsHomeAppId });
        await libraryPage.openDossier(homeDossier.name);
        await dossierPage.waitForDossierLoading();
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();
        await since(
            'isDisplay() of TOC button in Dossier toolbar  is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Boomkmark button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Filter icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Notification icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Home icon in target Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getHomeIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Library icon in target Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getLibraryIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Back button in target Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);

        await since(
            'isDisplay() of Comment icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Share icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Account icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Edit icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getEditIcon().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            dossierPage.getNavigationBar(),
            'TC89557_09',
            'Dossier toolbar control after linking when dossier as home'
        );
        // mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.openHamburgerMenu();
        await since(
            'isDisplay() of Filter option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Filter').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Bookmarks option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Bookmarks').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Share option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Share').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Collaboration option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Collaboration').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Account option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Account').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Home option in Dossier hamburger menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Go to Library').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC89557_09',
            'Dossier toolbar control after linking when dossier as home in responsive view'
        );
    });

    /**
     * Library list view UI control
     */
    it('[TC89557_10] UI control in Library list view', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await listView.selectListViewMode();
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isFavoritesIconPresent(testDossier.name))
            .toBe(true);
        await since('isDisplay() of Reset icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierResetIconPresent(testDossier.name))
            .toBe(true);

        await since('isDisplay() of Edit icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierEditIconPresent(testDossier.name))
            .toBe(false);
        await since('isDisplay() of Share icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierShareIconPresent(testDossier.name))
            .toBe(false);
        await since('isDisplay() of Download icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierDownloadIconPresent(testDossier.name))
            .toBe(false);

        await listView.rightClickToOpenContextMenu({ name: testDossier.name, isWaitCtxMenu: false });
        await since('isDisplay() of context menu should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getDossierContextMenu(testDossier.name).isDisplayed())
            .toBe(false);
    });

    /**
     * Library list view multi select should be disabled.
     */
    it('[TC89557_11] Disable multi-select in library home list view', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await listView.deselectListViewMode();
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC89557_11', 'Library toolbar in tile view');
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC89557_11', 'Library toolbar in list view');
        await listView.hoverDossier(testDossier.name);
        await since('isDisplay() of Select All should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSelectAllCheckbox().isDisplayed())
            .toBe(false);
        await since('isDisplay() of select item should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSingleSelectCheckbox(testDossier.name).isDisplayed())
            .toBe(false);
    });

    /**
     * Library list view info window UI control, only show favorite/reset/delete
     */
    it('[TC89557_12] UI control in info window of Library home list view', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(testDossier.name);
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getFavoriteIcon().isDisplayed())
            .toBe(true);
        await since('isDisplay() of Reset icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getResetIcon().isDisplayed())
            .toBe(true);
        await since('isDisplay() of Delete icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getRemoveIcon().isDisplayed())
            .toBe(true);

        await since('isDisplay() of Export pdf icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getExportPDFIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Export excel icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getExportExcelIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Subscription icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSubscriptionIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Download icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getDownloadIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of More menu icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getMoreMenuIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Recommandation section should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getRecommendationList().isDisplayed())
            .toBe(false);
    });

    /**
     * Library Content Discovery, only show dossier, filter out document/report/cube etc
     */
    it('[TC89557_13] Only show dossier in folder browsing', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // switch to content discovery tab
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openContentDiscovery();
        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(testDossier.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Custom-App-Test']);
        await since('isDisplay() of Dossier is expected to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getItem('Dossier-CustomApp-Test').isDisplayed())
            .toBe(true);
        await since('isDisplay() of Document is expected to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getItem('Custom Viz').isDisplayed())
            .toBe(true);
        await since('isDisplay() of Report is expected to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getItem('Base Report').isDisplayed())
            .toBe(false);
        await since('count of content items is expected to be #{expected}, instead we have #{actual}.')
            .expect((await listView.getItems()).length)
            .toBe(3);
        await libraryPage.clickFilterIcon();
        await takeScreenshotByElement(
            libraryPage.getFilterContainer(),
            'TC89557_13',
            'Filter panel in folder browsing'
        );
        await libraryPage.closeFilterPanel();
        //await takeScreenshotByElement(libraryPage.getLibraryContentContainer(), 'TC89557_13', 'Only show dossier in folder borwsing');
    });

    /**
     * Library Content Discovery, only show add to library, favorite icon when hovering on item
     */
    it('[TC89557_14] Only show favorite and add to library when hovering on list item in folder browsing', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // switch to content discovery tab
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openContentDiscovery();
        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(homeDossier.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Custom-App-Test']);
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isFavoritesIconPresent(homeDossier.name))
            .toBe(true);
        await since('isDisplay() of Add to Library icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isAddToLibraryIconPresent(homeDossier.name))
            .toBe(false);
        await since('isDisplay() of Edit icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierEditIconPresent(homeDossier.name))
            .toBe(false);

        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isFavoritesIconPresent(dossierNotInLibrary.name))
            .toBe(true);
        await since('isDisplay() of Add to Library icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isAddToLibraryIconPresent(dossierNotInLibrary.name))
            .toBe(true);
        await since('isDisplay() of Edit icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierEditIconPresent(dossierNotInLibrary.name))
            .toBe(false);

        await listView.rightClickToOpenContextMenu({ name: homeDossier.name, isWaitCtxMenu: false });
        await since('isDisplay() of context menu should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getDossierContextMenu(homeDossier.name).isDisplayed())
            .toBe(false);
    });

    /**
     * Library Content Discovery, info window action buttons only show add to Library and favorite when dossier not in Library
     */
    it('[TC89557_15] Only show favorite and add to library in folder browsing info window when dossier not in library', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // switch to content discovery tab
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openContentDiscovery();
        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(dossierNotInLibrary.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Custom-App-Test']);
        await listView.openInfoWindowFromListView(dossierNotInLibrary.name);
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getFavoriteIcon().isDisplayed())
            .toBe(true);
        await since('isDisplay() of Add to Library icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getAddToLibraryIcon().isDisplayed())
            .toBe(true);
        await since('isDisplay() of Reset icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getResetIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Delete icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getRemoveIcon().isDisplayed())
            .toBe(false);

        await since('isDisplay() of Export pdf icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getExportPDFIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Export excel icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getExportExcelIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Subscription icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSubscriptionIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Download icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getDownloadIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of More menu icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getMoreMenuIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Recommandation section should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getRecommendationList().isDisplayed())
            .toBe(false);
    });

    /**
     * Library Content Discovery, info window action buttons only show favorite when dossier in library
     */
    it('[TC89557_16] Only show favorite in folder browsing info window when dossier in library', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // switch to content discovery tab
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openContentDiscovery();
        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(homeDossier.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Custom-App-Test']);
        await listView.openInfoWindowFromListView(homeDossier.name);
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getFavoriteIcon().isDisplayed())
            .toBe(true);
        await since('isDisplay() of Add to Library icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getAddToLibraryIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Reset icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getResetIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Delete icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getRemoveIcon().isDisplayed())
            .toBe(false);

        await since('isDisplay() of Export pdf icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getExportPDFIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Export excel icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getExportExcelIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Subscription icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSubscriptionIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Download icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getDownloadIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of More menu icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getMoreMenuIcon().isDisplayed())
            .toBe(false);
        await since('isDisplay() of Recommandation section should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getRecommendationList().isDisplayed())
            .toBe(false);
    });

    /**
     * Library home list view in responsive mode
     */
    it('[TC89557_17] UI control in library home list mobile view', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openAllSectionList();
        await listView.selectListViewMode();
        await libraryPage.closeSidebar();
        await setWindowSize(mobileWindow);
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isFavoritesIconPresent(homeDossier.name, true))
            .toBe(false);
        await since('isDisplay() of Add to Library icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isAddToLibraryIconPresent(homeDossier.name, true))
            .toBe(false);
        await since('isDisplay() of Edit icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierEditIconPresent(homeDossier.name, true))
            .toBe(false);
        await listView.rightClickToOpenContextMenu({
            name: homeDossier.name,
            isMobileView: true,
            isWaitCtxMenu: false,
        });
        await since(
            'isDisplay() of Context menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenu().isDisplayed())
            .toBe(false);
    });

    /**
     * Library Content Discovery in responsive mode
     */
    it('[TC89557_18] UI control in content Discovery mobile view', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // switch to content discovery tab
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openContentDiscovery();
        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(homeDossier.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Custom-App-Test']);
        await libraryPage.closeSidebar();
        await setWindowSize(mobileWindow);
        await since('isDisplay() of Favorite icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isFavoritesIconPresent(homeDossier.name, true))
            .toBe(false);
        await since('isDisplay() of Add to Library icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isAddToLibraryIconPresent(homeDossier.name, true))
            .toBe(false);
        await since('isDisplay() of Edit icon should be #{expected}, instead we have #{actual}.')
            .expect(await listView.isDossierEditIconPresent(homeDossier.name, true))
            .toBe(false);
        await listView.rightClickToOpenContextMenu({
            name: homeDossier.name,
            isMobileView: true,
            isWaitCtxMenu: false,
        });
        await since(
            'isDisplay() of Context menu in mobile view is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenu().isDisplayed())
            .toBe(false);
    });

    /**
     * List view multi select in folder browsing should be disabled.
     */
    it('[TC89557_19] Disable multi-select in folder browsing list view', async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        // switch to content discovery tab
        await libraryPage.openSidebar();
        await libraryPage.sidebar.openContentDiscovery();
        // open folder
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(homeDossier.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Custom-App-Test']);
        await libraryPage.closeSidebar();
        await since('isDisplay() of Select All should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSelectAllCheckbox().isDisplayed())
            .toBe(false);
        await since('isDisplay() of select item should be #{expected}, instead we have #{actual}.')
            .expect(await listView.getSingleSelectCheckbox(testDossier.name).isDisplayed())
            .toBe(false);
    });

    /**
     * Custom app with bot as home
     */
    it('[TC89557_20] Force to Library as home in PPT adds for bot as home app', async () => {
        await libraryPage.openCustomAppById({ id: botAsHomeAppId });
        await libraryPage.openDossier(testDossier.name);
        await dossierPage.waitForDossierLoading();
        await since(
            'isDisplay() of Reset button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of TOC button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Boomkmark button in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of Filter icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterPanel.getFilterIcon().isDisplayed())
            .toBe(true);

        await since(
            'isDisplay() of Comment icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Share icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getShareIcon().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Account icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of Edit icon in Dossier toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getEditIcon().isDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC89557_20', 'Library toolbar when bot as home');
    });
});
