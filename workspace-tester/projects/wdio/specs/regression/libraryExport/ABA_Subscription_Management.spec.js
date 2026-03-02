import { exportSubscriptionUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('LibraryExport - Check Sort, Filter and Resize Functions for Subscription from Sidebar', () => {
    let {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        subscribe,
        infoWindow,
        sidebar,
        librarySearch,
        fullSearch,
        hamburgerMenu,
    } = browsers.pageObj1;
    const dossier_Auto_SingleGraph = {
        id: 'DEEFFBFE427F3C343B6ABC9D2A6D83F9',
        name: 'Auto_SingleGraph',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const app01 = '525F338052DF493684E3A76C12001159';
    const app02 = '4FDEB086915C4970992A584BAC79EB38';
    const defaultAppID = 'C2B2023642F6753A2EF159A75E0CFF29';

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login(exportSubscriptionUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98741_1] Check Subscription Sort Function from Sidebar', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_1-Sidebar_CheckSubscriptionList_Init',
            3
        );
        await subscribe.clickSubscriptionSortByOption('Name');
        dossierPage.sleep(1000);
        await subscribe.clickSubscriptionSortByOption('Content');
        dossierPage.sleep(1000);
        await subscribe.clickSubscriptionSortByOption('Type');
        dossierPage.sleep(1000);
        await subscribe.clickSubscriptionSortByOption('Schedule');
        dossierPage.sleep(1000);
        await subscribe.clickSubscriptionSortByOption('Delivery');
        dossierPage.sleep(1000);

        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionList_AfterSortAll',
            3
        );
        await dossierPage.goToLibrary();
    });

    it('[TC98741_2] Check Subscription Filter Content from Sidebar', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionFilterContent_Init',
            3
        );

        // Open subscription filter
        await subscribe.clickSubscriptionFilter();
        // Select Content
        await dossierPage.sleep(1000);
        await subscribe.clickFilterContent();
        await subscribe.clickFilterOption('Dashboard');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOption('Report');
        await dossierPage.sleep(500);
        await checkElementByImageComparison(
            subscribe.getFilterDropdownMainDialg(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionFilters_Dashboard_Report',
            3
        );
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionList_ApplyFilter_1',
            3
        );
        await subscribe.clickSubscriptionFilter();
        await subscribe.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(500);
        await subscribe.clickSubscriptionFilter();
        await subscribe.clickFilterContent();
        await subscribe.clickFilterOption('Dashboard');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOption('Report');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOptionOnly('Document');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getFilterDropdownMainDialg(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionFilters_DocumentOnly',
            3
        );
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionList_ApplyFilter_2',
            3
        );
        await subscribe.clickSubscriptionFilter();
        await subscribe.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await subscribe.clickFiltersApplyButton();
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_2-Sidebar_CheckSubscriptionList_ClearAll',
            3
        );
        await dossierPage.goToLibrary();
    });

    it('[TC98741_3] Check Subscription Filter Type from Sidebar', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_3-Sidebar_CheckSubscriptionFilterType_Init',
            3
        );
        
        // Open subscription filter
        await subscribe.clickSubscriptionFilter();
        // Select Types
        await dossierPage.sleep(1000);
        await subscribe.clickFilterType();
        await subscribe.clickFilterOption('Email');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOption('History List');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOption('FTP');
        await dossierPage.sleep(500);
        await checkElementByImageComparison(
            subscribe.getFilterDropdownMainDialg(),
            'T4969/subscription',
            'TC98741_3-Sidebar_CheckSubscriptionFilters_Email_HistoryList_FTP',
            3
        );
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_3-Sidebar_CheckSubscriptionList_ApplyFilter_1',
            3
        );
        await subscribe.clickSubscriptionFilter();
        await subscribe.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(500);
        await subscribe.clickSubscriptionFilter();
        await subscribe.clickFilterType();
        await subscribe.clickClearAllButton();
        await subscribe.clickSelectAllButton();
        await checkElementByImageComparison(
            subscribe.getFilterDropdownMainDialg(),
            'T4969/subscription',
            'TC98741_3-Sidebar_CheckSubscriptionFilters_SelectAll',
            3
        );
        await subscribe.clickFilterContent();
        await subscribe.clickFilterOption('Document');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOption('Report');
        await dossierPage.sleep(500);
        await subscribe.clickFilterOption('Intelligent Cube');
        await checkElementByImageComparison(
            subscribe.getFilterDropdownMainDialg(),
            'T4969/subscription',
            'TC98741_3-Sidebar_CheckSubscriptionFilters_Mix',
            3
        );
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_3-Sidebar_CheckSubscriptionList_ApplyFilter_2',
            3
        );

        await subscribe.clickSubscriptionFilter();
        await subscribe.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await subscribe.clickFiltersApplyButton();
        await dossierPage.sleep(500);
        await dossierPage.goToLibrary();
    });

    it('[TC98741_4] Resize Subscription Column from Sidebar', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_4-Sidebar_CheckSubscriptionList_Resize_Init',
            3
        );
        await subscribe.dragHeaderWidth('Subscription Name', 300);
        await subscribe.dragHeaderWidth('Content', 100);
        await subscribe.dragHeaderWidth('Type', -50);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_4-Sidebar_CheckSubscriptionList_Resize_1',
            3
        );
        await subscribe.dragHeaderWidth('Subscription Name', -400);
        await subscribe.dragHeaderWidth('Content', -150);
        await subscribe.dragHeaderWidth('Type', -50);
        await subscribe.dragHeaderWidth('Schedule', -50);
        await subscribe.dragHeaderWidth('Next Delivery', -50);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_4-Sidebar_CheckSubscriptionList_Resize_2',
            3
        );
        await dossierPage.goToLibrary();
    });

    it('[TC98741_5] Switch Application and Check Subscription Column from Sidebar', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_5-Sidebar_CheckSubscriptionList_App_Default',
            6
        );

        await dossierPage.openCustomAppById({ id: app01 });
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await subscribe.dragHeaderWidth('Subscription Name', 100);
        await subscribe.dragHeaderWidth('Content', 100);
        await subscribe.dragHeaderWidth('Type', 100);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_5-Sidebar_CheckSubscriptionList_app01_+100',
            3
        );
        await dossierPage.openCustomAppById({ id: app02 });
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await subscribe.dragHeaderWidth('Subscription Name', -50);
        await subscribe.dragHeaderWidth('Content', -50);
        await subscribe.dragHeaderWidth('Type', -50);
        await subscribe.dragHeaderWidth('Schedule', -50);
        await subscribe.dragHeaderWidth('Next Delivery', -50);
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_5-Sidebar_CheckSubscriptionList_app02_-50',
            3
        );

        await dossierPage.openCustomAppById({ id: app01 });
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_5-Sidebar_CheckSubscriptionList_backToApp01_+100',
            3
        );
        await subscribe.dragHeaderWidth('Subscription Name', 100);
        await subscribe.dragHeaderWidth('Content', -50);

        await dossierPage.openCustomAppById({ id: app02 });
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarList(),
            'T4969/subscription',
            'TC98741_5-Sidebar_CheckSubscriptionList_backToApp02_-50',
            3
        );
        await dossierPage.goToLibrary();
    });

});