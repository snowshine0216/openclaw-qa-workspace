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
    
/*
    // loacl mcp environment 
    const dossier = {
        id: 'D76FCF017940A1759E9592BBC8A90FAC',
        name: 'Auto_Subscription_yihu',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };
*/
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
        // Delete existing bookmark that to be created in next step
        
        mockedSubscribeRequest = await browser.mock('https://**/api/subscriptions');
        mockedEditSubscriptionRequest = await browser.mock('https://**/api/subscriptions/*', { method: 'PUT' });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: {username: 'auto_subscription', password: 'newman1#'},
            //credentials: {username: 'mstr', password: 'F2t-N%l_e7w4'},
            dossier: dossier
        });

        mockedSubscribeRequest.clear();
        mockedEditSubscriptionRequest.clear();
    });

    xit('[F43156_1] Create Excel subscription from share panel', async() => {
        await resetBookmarks({
            credentials: {username: 'auto_subscription', password: 'newman1#'},
            //credentials: {username: 'administrator', password: 'F2t-N%l_e7w4'},
            dossier: dossier
        });
        // await userAccount.openUserAccountMenu();
        // await userAccount.logout();

        // Tanzu environment
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        //await libraryPage.userAccount.switchCustomApp('Web_auto_CustomPalette');

        // mcp environment
        //await loginPage.login({username: 'mstr', password: 'F2t-N%l_e7w4'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        // Open subscription from share panel
        await dossierPage.openShareDropDown();
        await dossierPage.sleep(1000);
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(1000);

        await subscriptionDialog.clickAdvancedSettingsButton();
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_1', 'DefaultAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickCompressZipFileCheckbox()
        await subscriptionDialog.inputZipFileName("Customized Zip File Name");
        await subscriptionDialog.inputZipFilePW("1234567");
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_1', 'CustomizedAdvancedSettings', {tolerance: 0.3});
        await subscriptionDialog.clickBackButton();

        await subscriptionDialog.clickSubscriptionNameEditButton();
        await dossierPage.sleep(1000);
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');   
        await subscriptionDialog.inputSubscriptionName('Auto_Subscription');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'F43156_1', 'DefaultSettings', {tolerance: 0.3});
        await subscriptionDialog.inputBookmarkName('F43156_1_Bookmark_Excel');
        await subscriptionDialog.selectFormat('Excel');
        await subscriptionDialog.inputFileName('F43156_1_Auto_Subscription_Excel');
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_1', 'UpdatedContentSettings', {tolerance: 0.3});

        await subscriptionDialog.clickAllowUnsubscribeCheckbox();
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getRecipientsSettingsSection(), 'F43156_1', 'UpdatedRecipientSettings', {tolerance: 0.3});

        //await subscriptionDialog.inputEmailSubject('F43156_1_Test string of Email subject');
        await subscriptionDialog.selectSchedule('Books Closed');
        await subscriptionDialog.inputNote('F43156_1_Test string in Notes_Excel');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getDeliverySettingsSection(), 'F43156_1', 'UpdatedDeliverySettings', {tolerance: 0.3});

        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(1000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();  
        await dossierPage.goToLibrary();
        
    });

    xit('[F43156_2] Manage subscription from info window', async() => {
        //await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        //await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        //  Open info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getInfoWindowSubscriptionPanel(),'F43156_2', 'Default view of manage subscription', {tolerance: 0.3});
        /*
        // Unsubscribe Auto_Subscription 2
        await subscriptionDialog.clickSwitchRight();
        await infoWindow.sleep(1000);
        await subscriptionDialog.clickUnsubscribe();
        await infoWindow.sleep(1000);
        await subscriptionDialog.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        */
        // Edit subscriptions
        
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(3000);
        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.inputFileName('F43156_2_Auto_Subscription_PDF');
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_2', 'UpdatedContentSettings', {tolerance: 0.3});


        await subscriptionDialog.clickAllowUnsubscribeCheckbox();
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getRecipientsSettingsSection(), 'F43156_2', 'UpdatedRecipientSettings', {tolerance: 0.3});

        await subscriptionDialog.inputEmailSubject('F43156_2_Test string of Email subject: PDF');
        await subscriptionDialog.selectSchedule('Books Closed');
        await subscriptionDialog.inputNote('F43156_2_Test string in Notes: PDF');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getDeliverySettingsSection(), 'F43156_2', 'UpdatedDeliverySettings', {tolerance: 0.3});

        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);
        // Check application id in the request post data
        // const postDataEdit = subscriptionDialog.getRequestPostData(mockedEditSubscriptionRequest.calls[0]);
        // since('The application id is supposed to be #{expected}, instead we have #{actual}.')
        //     .expect(postDataEdit.delivery.applicationId)
        //     .toBe(undefined);
      
        await subscriptionDialog.closeSubscribe();
        await dossierPage.goToLibrary();
    });

    it('[F43156_3] Manage subscription from sidebar', async() => {
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        await dossierPage.goToLibrary();
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        //await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await takeScreenshot('F43156_3', 'Check subscriptions in sidebar 1', {tolerance: 0.3});

        // Modify Auto_Subscription 1
        await subscriptionDialog.hoverSubscription('(AUTO) RSD Email');
        await subscriptionDialog.clickEditButtonInSidebar('(AUTO) RSD Email');

        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.clickExpandLayoutsCheckbox();
        await subscriptionDialog.clickExpandPageByCheckbox();
        await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickAllowChangeDeliveryCheckbox();
        await subscriptionDialog.clickAllowChangePersonalizationCheckbox();


        await subscriptionDialog.inputFileName('F43156_3_Auto_Subscription_CSV');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_3', 'UpdatedContentSettings', {tolerance: 0.3});

        //await takeScreenshotByElement(subscriptionDialog.getRecipientsSettingsSection(), 'F43156_3', 'UpdatedRecipientSettings', {tolerance: 0.3});

        await subscriptionDialog.inputEmailSubject('F43156_3_Test string of Email subject: CSV');
        // await subscriptionDialog.selectSchedule('Books Closed');
        await subscriptionDialog.inputNote('F43156_3_Test string in Notes: CSV');
        
        await dossierPage.sleep(1000);
        
        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);
        
        await subscriptionDialog.clickSidebarUnsubscribe('Auto_Subscription');
        //await infoWindow.sleep(5000);
        await subscriptionDialog.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        await takeScreenshot('TC77895', 'Check subscriptions in sidebar 2', {tolerance: 0.3});
        await dossierPage.goToLibrary();

    });

    xit('[F43156_4] Check subscription filter in sidebar', async() => {
        // Logout and login using account auto_subscription
        //await userAccount.openUserAccountMenu();
        //await userAccount.logout();
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await dossierPage.sleep(1000);
        await takeScreenshot('F43156_4', 'Check subscriptions in sidebar_Origin', {tolerance: 0.3});
        await subscriptionDialog.clickSubscriptionSortByOption('Name');
        await dossierPage.sleep(1000);
        await takeScreenshot('F43156_4', 'Check subscriptions sort by name Z-A', {tolerance: 0.3});
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSubscriptionSortByOption('Name');
        await dossierPage.sleep(1000);
        // Open subscription filter and select dashboard
        await subscriptionDialog.clickSubscriptionFilter();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickFilterContent();
        await subscriptionDialog.clickFilterOption('Dashboard');
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter content: Dossier', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await dossierPage.sleep(1000);
        await takeScreenshot('F43156_4', 'Apply filter, content: Dossier', {tolerance: 0.3});
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
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter content: Document Only', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply filter, content: Document Only', {tolerance: 0.3});

        // Select Content: Document and Report
        await subscriptionDialog.clickSubscriptionFilter();
        //await subscriptionDialog.clickClearAllFiltersButton();
        //await dossierPage.sleep(500);
        //await subscriptionDialog.clickFiltersApplyButton();
        //await dossierPage.sleep(500);
        //await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickFilterContent();
        await subscriptionDialog.clickFilterOption('Report');
        await dossierPage.sleep(1000);
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter content: Document and Report', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply filter, content: Document and Report', {tolerance: 0.3});

        // Content: Clear all
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter content: Clear All', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply filter, content: Clear All', {tolerance: 0.3});

        // Select Type: History List
        // Open subscription filter
        await subscriptionDialog.clickSubscriptionFilter();
        // Select Types
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickFilterType();
        await subscriptionDialog.clickFilterOption('History List');
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter type: History List', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply filter, type: History List', {tolerance: 0.3});

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
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter type: Select All', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply filter, type: Select All', {tolerance: 0.3});

        // Select Type: Email only
        await subscriptionDialog.clickSubscriptionFilter();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickFilterType();
        await subscriptionDialog.clickFilterOptionOnly('Email');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Check filter type: Email only', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply filter, type: Email only', {tolerance: 0.3});

        // Clear filters
        await subscriptionDialog.clickSubscriptionFilter();
        await subscriptionDialog.clickClearAllFiltersButton();
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscriptionDialog.getFilterDropdownMainDialg(), 'F43156_4', 'Clear Filters', {tolerance: 0.3});
        await subscriptionDialog.clickFiltersApplyButton();
        await takeScreenshot('F43156_4', 'Apply Clear Filters', {tolerance: 0.3});
        await dossierPage.goToLibrary();
    });

});