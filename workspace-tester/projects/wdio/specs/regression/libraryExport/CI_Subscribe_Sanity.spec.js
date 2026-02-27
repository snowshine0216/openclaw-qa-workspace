import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
describe('Automation for Subscription - Create and Manage Subscription in Library', () => {
    // Tanzu environemnt
    const dossier = {
        id: 'B19C0726492EA090968FE1A2464735EF',
        name: '(AUTO) Subscription',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };
    
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200
    };

    const browserWindow_smallSize = {
        browserInstance: browsers.browser1,
        width: 800,
        height: 600
    };

    let baseVisualization, loginPage, dossierPage,libraryPage, share, toc, infoWindow, subscriptionDialog, pdfExportWindow, bookmark, sidebar, userAccount, mockedSubscribeRequest, mockedEditSubscriptionRequest;

    beforeAll(async () => {
        ({
            baseVisualization,
            loginPage,
            dossierPage,
            libraryPage,
            share,
            toc,
            infoWindow,
            subscriptionDialog,
            pdfExportWindow,
            bookmark,
            sidebar,
            userAccount
        } = browsers.pageObj1);
        await setWindowSize(browserWindow);       
    });

    it('[F43156_01] Create Excel subscription from share panel', async() => {
        await resetBookmarks({
            credentials: {username: 'auto_subscription', password: 'newman1#'},
            dossier: dossier
        });

        // Tanzu environment
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        //await libraryPage.userAccount.switchCustomApp('Web_auto_CustomPalette');
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        // Open subscription from share panel
        await dossierPage.openShareDropDown();
        await dossierPage.sleep(1000);
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await dossierPage.sleep(1000);
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');   
        await subscriptionDialog.inputSubscriptionName('Auto_Subscription');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'F43156_01', 'DefaultSettings', {tolerance: 0.3});
        await subscriptionDialog.inputBookmarkName('F43156_01_Bookmark_Excel');
        await subscriptionDialog.selectFormat('Excel');
        await subscriptionDialog.inputFileName('F43156_01_Auto_Subscription_Excel');
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_01', 'UpdatedContentSettings', {tolerance: 0.3});

        await subscriptionDialog.clickAllowUnsubscribeCheckbox();
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getRecipientsSettingsSection(), 'F43156_01', 'UpdatedRecipientSettings', {tolerance: 0.3});

        //await subscriptionDialog.inputEmailSubject('F43156_01_Test string of Email subject');
        await subscriptionDialog.OpenScheduleOptions();
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'F43156_01', 'DefaultScheduleOptions', { tolerance: 0.3 });
        await subscriptionDialog.clickTimeScheduleOptions(['All the Time','Daily', 'First of Month']);
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed','On Database Load']);
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'F43156_01', 'ScheduleOptions_01', { tolerance: 0.3 });
        await subscriptionDialog.clickSendNowCheckbox();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.inputNote('F43156_01_Test string in Notes_Excel');
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickUseTimezonesCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getDeliverySettingsSection(), 'F43156_01', 'UpdatedDeliverySettings', {tolerance: 0.3});
        await dossierPage.sleep(1000);

        // Set advanced settings
        await dossierPage.sleep(1000);
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(2);
        await dossierPage.sleep(1000);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_01', 'DefaultAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickCompressZipFileCheckbox();
        await subscriptionDialog.inputZipFileName("Customized Zip File Name");
        await subscriptionDialog.inputZipFilePW("1234567");
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_01', 'CustomizedAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickBackButton();

        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(1000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();  
        
    });

    it('[F43156_02] Manage subscription from info window', async() => {
        await dossierPage.goToLibrary();
        //  Open info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getInfoWindowSubscriptionPanel(),'F43156_02', 'Default view of manage subscription', {tolerance: 0.5});
        // Edit subscriptions
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(3000);
        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.inputFileName('F43156_02_Auto_Subscription_PDF');
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_02', 'UpdatedContentSettings', {tolerance: 0.3});
        //await subscriptionDialog.clickAllowUnsubscribeCheckbox();
        //await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getRecipientsSettingsSection(), 'F43156_02', 'UpdatedRecipientSettings', {tolerance: 0.3});

        //await subscriptionDialog.inputEmailSubject('F43156_02_Test string of Email subject: PDF');
        await subscriptionDialog.OpenScheduleOptions();
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'F43156_02', 'SavedScheduleOptions', { tolerance: 0.3 });
        await subscriptionDialog.clickTimeScheduleOptions(['First of Month', 'All the Time']);
        await subscriptionDialog.clickEventScheduleOptions(['On Database Load']);
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'F43156_02', 'ScheduleOptions_02', { tolerance: 0.3 });
        await subscriptionDialog.clickSendNowCheckbox();
        since('Use recipients time zones is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUseTimezonesCheckboxChecked()).toBe(true); 
        await infoWindow.sleep(2000);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.inputNote('F43156_02_Test string in Notes: PDF');
        await subscriptionDialog.clickUseTimezonesCheckbox();   
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getDeliverySettingsSection(), 'F43156_02', 'UpdatedDeliverySettings', {tolerance: 0.3});

        // Check saved advanced settings and update
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_02', 'CheckSavedAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickCompressZipFileCheckbox()
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_02', 'UpdatedAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickBackButton();

        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);
      
        await subscriptionDialog.closeSubscribe();
    });

    it('[F43156_03] Manage subscription from sidebar', async() => {
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await takeScreenshot('F43156_03', 'Check subscriptions in sidebar 1', {tolerance: 0.3});

        // Modify Auto_Subscription 1
        await subscriptionDialog.hoverSubscription('Auto_Subscription');
        await subscriptionDialog.clickEditButtonInSidebar('Auto_Subscription');

        await subscriptionDialog.selectFormat('CSV');
        await subscriptionDialog.inputFileName('F43156_03_Auto_Subscription_CSV');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_03', 'UpdatedContentSettings', {tolerance: 0.3});
        // await subscriptionDialog.inputEmailSubject('F43156_03_Test string of Email subject: CSV');
        await subscriptionDialog.OpenScheduleOptions();
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'F43156_03', 'SavedScheduleOptions', { tolerance: 0.3 });
        await subscriptionDialog.clickEventScheduleOptions(['Load Metadata Event Schedule']);
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'F43156_03', 'ScheduleOptions_03', { tolerance: 0.3 });
        await subscriptionDialog.clickSendNowCheckbox();
        since('Use recipients time zones is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUseTimezonesCheckboxChecked()).toBe(false);  
        await subscriptionDialog.inputNote('F43156_03_Test string in Notes: CSV');
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSendNowCheckbox();
        // Check saved advanced settings and update
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_03', 'CheckUpdatedAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickBackButton();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSave();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSidebarUnsubscribe('Auto_Subscription');
        await dossierPage.sleep(2000);
        await subscriptionDialog.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        await takeScreenshot('TC77895', 'Check subscriptions in sidebar 2', {tolerance: 0.3});
        await dossierPage.sleep(2000);
    });

    it('[F43156_04] Check subscription filter in sidebar', async() => {
        await takeScreenshot('F43156_04', 'Check subscriptions in sidebar_Origin', {tolerance: 0.3});
        await subscriptionDialog.clickSubscriptionSortByOption('Name');
        await dossierPage.sleep(1000);
        await takeScreenshot('F43156_04', 'Check subscriptions sort by name Z-A', {tolerance: 0.3});
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSubscriptionSortByOption('Name');
        await dossierPage.sleep(1000);
        // Open subscription filter and select dashboard
        await subscriptionDialog.clickSubscriptionFilter();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickFilterContent();
        await subscriptionDialog.clickFilterOption('Dashboard');
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter content: Dossier', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await dossierPage.sleep(1000);
        await takeScreenshot('F43156_04', 'Apply filter, content: Dossier', {tolerance: 0.3});
        // Select Content: Document only
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await subscriptionDialog.clickFiltersApplyButton();
        await dossierPage.sleep(500);
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickFilterContent();
        await subscriptionDialog.clickFilterOptionOnly('Document');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter content: Document Only', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply filter, content: Document Only', {tolerance: 0.3});

        // Select Content: Document and Report
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickFilterContent();
        await subscriptionDialog.clickFilterOption('Report');
        await dossierPage.sleep(1000);
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter content: Document and Report', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply filter, content: Document and Report', {tolerance: 0.3});

        // Content: Clear all
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter content: Clear All', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply filter, content: Clear All', {tolerance: 0.3});

        // Select Type: History List
        // Open subscription filter
        await subscriptionDialog.clickSubscriptionFilter();
        // Select Types
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickFilterType();
        await subscriptionDialog.clickFilterOption('History List');
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter type: History List', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply filter, type: History List', {tolerance: 0.3});

        // Select Type: Select All
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await subscriptionDialog.clickFiltersApplyButton();
        await dossierPage.sleep(500);
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickFilterType();
        await subscriptionDialog.clickClearAllButton();
        await subscriptionDialog.clickSelectAllButton();;
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter type: Select All', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply filter, type: Select All', {tolerance: 0.3});

        // Select Type: Email only
        await subscriptionDialog.clickSubscriptionFilter();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickFilterType();
        await subscriptionDialog.clickFilterOptionOnly('Email');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Check filter type: Email only', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply filter, type: Email only', {tolerance: 0.3});

        // Clear filters
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_04', 'Clear Filters', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_04', 'Apply Clear Filters', {tolerance: 0.3});
        await dossierPage.goToLibrary();
    });

});