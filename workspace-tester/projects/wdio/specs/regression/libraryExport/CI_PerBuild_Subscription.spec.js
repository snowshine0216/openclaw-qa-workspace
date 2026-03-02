import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';

describe('Subscribe - Tanzu Sanity Test', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200
    };

    const dossierUSEA = {
        id: '19A95FA711EC45A93E0B0080AFAB8FDF',
        name: 'US Economy Analysis',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    let baseVisualization, loginPage, dossierPage,libraryPage, share, toc, infoWindow, subscriptionDialog, pdfExportWindow, bookmark, sidebar, userAccount;

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
        
        await resetBookmarks({
            credentials: {username: 'web.subscription', password: 'newman1#'},
            dossier: dossierUSEA
        });
        
    });


    it('[TC82125] PerBuild - Subscription - Create subscription in entry Share Panel', async() => {
        await loginPage.login({username: 'web.subscription', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossierUSEA.name);
        await libraryPage.openDossier(dossierUSEA.name);

        // Create Excel subscription from share panel
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await dossierPage.sleep(1000);
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');   
        await subscriptionDialog.inputSubscriptionName('Subscription_Excel');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputBookmarkName('Bookmark_Excel');
        await subscriptionDialog.clickRangeDropdown();
        await dossierPage.sleep(500);
        await subscriptionDialog.clickRangeAll();
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getAllCheckboxStatus()).toBe('false');
        await subscriptionDialog.clickArrowByChapterName('Economy Analysis');
        await subscriptionDialog.clickCheckboxByPageName('Overview');
        await dossierPage.sleep(1000);
        await dossierPage.sleep(500);
        since('Check box status of Chapter 1 should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getRangeCheckboxStatus('Overview')).toBe('true');
        await subscriptionDialog.clickRangeDropdown();
        await subscriptionDialog.OpenScheduleOptions();
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed']);
        await subscriptionDialog.clickSendNowCheckbox();
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputRecipient('export');
        await dossierPage.sleep(3000);
        await subscriptionDialog.selectRecipient('export');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputNote('This is a subscription in Excel format');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputEmailSubject('Test string of Email subject');
        await dossierPage.sleep(1000);
        // Check the modified settings
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'TC82125', 'Create Excel Subscription', {tolerance:0.3});
        await dossierPage.sleep(1000);
        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(3000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();

        // Create PDF subscription from share panel
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(2000);
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await dossierPage.sleep(1000);
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');   
        await subscriptionDialog.inputSubscriptionName('Subscription_PDF');
        await dossierPage.sleep(1000);
        await subscriptionDialog.selectBookmark('Include current view as a bookmark');
        await subscriptionDialog.inputBookmarkName('Bookmark_PDF');
        await dossierPage.sleep(500);
        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.OpenScheduleOptions();
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed']);
        await subscriptionDialog.clickSendNowCheckbox();
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputNote('This is a subscription in PDF format');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputRecipient('export');
        await dossierPage.sleep(1000);
        await subscriptionDialog.selectRecipient('export');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputEmailSubject('Test string of Email subject');
        await dossierPage.sleep(1000);
        // Check the modified settings
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'TC82125', 'Create PDF Subscription', {tolerance:0.3});
        await dossierPage.sleep(1000);
        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(3000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();

    });

    it('[TC82126] PerBuild - Subscription - Edit subscription in entry Info Window', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'web.subscription', password: 'newman1#'});
        //  Open info window
        await libraryPage.moveDossierIntoViewPort(dossierUSEA.name);
        await libraryPage.openDossierInfoWindow(dossierUSEA.name);
        await infoWindow.sleep(5000);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        // Edit subscriptions
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(5000);
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await dossierPage.sleep(1000);
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');   
        await subscriptionDialog.inputSubscriptionName('Subscription_Excel_Update');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputFileName('File_Name_Updated');
        await dossierPage.sleep(1000);
        await subscriptionDialog.inputNote('This is a subscription in Excel format_updated');
        await infoWindow.sleep(1000);
        await subscriptionDialog.OpenScheduleOptions();
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed', 'On Database Load']);
        await subscriptionDialog.clickSendNowCheckbox();
        await infoWindow.sleep(1000);
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'TC82126', 'Modified Excel Subscription', {tolerance: 0.3});
        await subscriptionDialog.clickSave();
        await infoWindow.sleep(3000);
        await subscriptionDialog.clickSwitchRight();
        await infoWindow.sleep(1000);
        await subscriptionDialog.clickUnsubscribe();
        await infoWindow.sleep(1000);
        await subscriptionDialog.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getInfoWindowSubscriptionPanel(),'TC82126', 'Check Excel Subscription in Info Window', {tolerance:0.3});
        await subscriptionDialog.closeSubscribe();
        //await dossierPage.goToLibrary();

    });

    it('[TC82127] PerBuild - Subscription - Manage subscription in entry Sidebar', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'web.subscription', password: 'newman1#'});
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(3000);
        // Modify Subscription_Excel_Update
        await subscriptionDialog.hoverSubscription('Subscription_Excel_Update');
        await subscriptionDialog.clickEditButtonInSidebar('Subscription_Excel_Update');
        // await dossierPage.sleep(1000);
        // Modify setting
        /* DE325661
        await subscriptionDialog.clickRangeDropdown();
        await subscriptionDialog.clickRangeAll();
        await dossierPage.sleep(500);
        await subscriptionDialog.clickRangeAll();
        await subscriptionDialog.clickRangeDropdown();
        */
        //await subscriptionDialog.searchRecipient('collab');
        //await dossierPage.sleep(1000);
        //await subscriptionDialog.selectRecipients(['collab']);
        await subscriptionDialog.clickSidebarSave();
        await dossierPage.sleep(3000);
        // Check modified settings
        await subscriptionDialog.hoverSubscription('Subscription_Excel_Update');
        await subscriptionDialog.clickEditButtonInSidebar('Subscription_Excel_Update');
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSidebarCancel();
        await dossierPage.sleep(1000);
        // Unsubscribe below subscription
        await subscriptionDialog.clickSidebarUnsubscribe('Subscription_Excel_Update');
        await subscriptionDialog.clickUnsubscribeYes();
        await infoWindow.sleep(3000);
        await since('There is no subscription now, Subscription Empty Content is supposed to be #{expected}, instead we have #{actual}')
             .expect(await subscriptionDialog.isSubscriptionEmptyContentPresent()).toBe(true);
        await dossierPage.goToLibrary();
    });

});
