//import { checkElementByImageComparison } from '../../../utils/TakeScreenshots.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('LibrarySubscription - Create and Manage Subscription for other recipients in Library', () => {
    let {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        subscribe,
        infoWindow,
        sidebar,
        userAccount
    } = browsers.pageObj1;

    const dossier_testRecipient = {
        id: '6F8516D442824877C3A037B0DBB531AE',
        name: '(AUTO) Subscription_testRecipient',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        // Delete existing bookmark that to be created in next step
        await resetBookmarks({
            credentials: {username: 'auto_subscription_OwnerA', password: 'newman1#'},
            dossier: dossier_testRecipient
        });
        
        
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC79872] Create subscription for other recipients', async() => {
        //Logout and login using account auto_subscription_OwnerA
        //await userAccount.openUserAccountMenu();
        //await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_OwnerA', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testRecipient.name);
        await libraryPage.openDossier(dossier_testRecipient.name);

        await dossierPage.sleep(1000);
        // Create subscription for other recipients
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Auto_Subscription_testRecipient');
        await dossierPage.sleep(1000);
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Auto_Bookmark_testRecipient');
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC79872', 'Auto_Subscription_testRecipient_origin', {tolerance: 0.3});
        await subscribe.deleteRecipient('auto_subscription_ownerA');
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC79872', 'Auto_Subscription_testRecipient_Delete A', {tolerance: 0.3});
        await subscribe.searchRecipient('auto_subscription_ownerA');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['auto_subscription_ownerA']);
        await subscribe.searchRecipient('auto_subscription_rcpB');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['auto_subscription_rcpB']);
        await dossierPage.sleep(1000);
        await subscribe.searchRecipient('auto_subscription_rcpC');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['auto_subscription_rcpC']);
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC79872', 'Auto_Subscription_testRecipient Add ABC', {tolerance: 0.3});
        await dossierPage.sleep(1000);
        await subscribe.createSubscription();
        await dossierPage.sleep(3000);
        await subscribe.waitForLoadingButtonToDisappear();

        // Create subscription and do not allow recipient to unsubscribe
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Recipient cannot unsubscribe');
        await dossierPage.sleep(1000);
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.deleteRecipient('auto_subscription_ownerA');
        await subscribe.searchRecipient('auto_subscription_rcpB');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['auto_subscription_rcpB']);
        await dossierPage.sleep(1000);
        await dossierPage.sleep(1000);
        await subscribe.clickAllowUnsubscribe();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC79872', 'Auto_Subscription_testRecipient Add B', {tolerance: 0.3});
        await subscribe.createSubscription();
        await dossierPage.sleep(3000);
        await subscribe.waitForLoadingButtonToDisappear();

    });

    it('[TC79891] Check subscriptions for recipients in entry of info window', async() => {
        // Check subscription for owner A
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_ownerA', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testRecipient.name);
        await libraryPage.openDossierInfoWindow(dossier_testRecipient.name);
        await infoWindow.sleep(1000);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC79891', 'Owner A: Auto_Subscription_testRecipient', {tolerance: 0.3});
        since('auto_subscription_ownerA: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(true);
        since('auto_subscription_ownerA: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(true);
        since('auto_subscription_ownerA: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(true);
        await subscribe.clickSwitchRight();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC79891', 'Owner A: Recipient cannot unsubscribe', {tolerance: 0.3});
        since('auto_subscription_ownerA: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(true);
        since('auto_subscription_ownerA: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(true);
        since('auto_subscription_ownerA: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(true);

        // Check subscription for recipient B
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_rcpB', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testRecipient.name);
        await libraryPage.openDossierInfoWindow(dossier_testRecipient.name);
        await infoWindow.sleep(1000);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC79891', 'Recipient B: Auto_Subscription_testRecipient', {tolerance: 0.3});
        await subscribe.clickUnsubscribe();
        await infoWindow.sleep(1000);
        await subscribe.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC79891', 'Recipient B: Recipient cannot unsubscribe', {tolerance: 0.3});
        since('auto_subscription_rcpB: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(false);
        since('auto_subscription_rcpB: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(false);
        since('auto_subscription_rcpB: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(false);

        // Check subscription for recipient C
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_rcpC', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testRecipient.name);
        await libraryPage.openDossierInfoWindow(dossier_testRecipient.name);
        await infoWindow.sleep(1000);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC79891', 'Recipient C: Auto_Subscription_testRecipient', {tolerance: 0.3});
        since('auto_subscription_rcpC: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(false);
        since('auto_subscription_rcpC: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(false);
        since('auto_subscription_rcpC: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(true);

    });

    it('[TC79892] Check subscriptions for recipients in entry of sidebar', async() => {
        // Check subscription for owner A
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_ownerA', password: 'newman1#'});
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('Auto_Subscription_testRecipient');
        await takeScreenshot('TC79892', '[Sidebar] Owner A: Auto_Subscription_testRecipient', {tolerance: 0.3});
        since('ownerA_Auto_Subscription_testRecipient: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('Auto_Subscription_testRecipient')).toBe(true);
        since('ownerA_Auto_Subscription_testRecipient: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('Auto_Subscription_testRecipient')).toBe(true);
        since('ownerA_Auto_Subscription_testRecipient: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('Auto_Subscription_testRecipient')).toBe(true);
        await subscribe.hoverSubscription('Recipient cannot unsubscribe');
        await takeScreenshot('TC79892', '[Sidebar] Owner A: Recipient cannot unsubscribe', {tolerance: 0.3});
        since('ownerA_Recipient_cannot_unsubscribe: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('Recipient cannot unsubscribe')).toBe(true);
        since('ownerA_Recipient_cannot_unsubscribe: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('Recipient cannot unsubscribe')).toBe(true);
        since('ownerA_Recipient_cannot_unsubscribe: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('Recipient cannot unsubscribe')).toBe(true);

        // Check subscription for recipient B
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_rcpB', password: 'newman1#'});
        // Check privilege of unsubscribe from sidebar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('Recipient cannot unsubscribe');
        await takeScreenshot('TC79892', '[Sidebar] Check privileges for recipient B', {tolerance: 0.3});
        since('auto_subscription_rcpB: User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('Recipient cannot unsubscribe')).toBe(false);
        since('auto_subscription_rcpB: User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('Recipient cannot unsubscribe')).toBe(false);
        since('auto_subscription_rcpB: User does not have privilege of unsubscribe, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('Recipient cannot unsubscribe')).toBe(false);

        // Check subscription for recipient C
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_rcpC', password: 'newman1#'});
        // Check privilege of unsubscribe from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('Auto_Subscription_testRecipient');
        await takeScreenshot('TC79892', '[Sidebar] Check privileges for recipient C', {tolerance: 0.3});
        since('auto_subscription_rcpC: Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('Auto_Subscription_testRecipient')).toBe(false);
        since('auto_subscription_rcpC: Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('Auto_Subscription_testRecipient')).toBe(false);
        since('auto_subscription_rcpC: Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('Auto_Subscription_testRecipient')).toBe(true);



    });
});
