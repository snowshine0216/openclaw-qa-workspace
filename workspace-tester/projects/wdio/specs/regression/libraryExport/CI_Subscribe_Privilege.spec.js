import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('LibrarySubscription - Check subscription privilege in Library', () => {
    let {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        subscriptionDialog,
        infoWindow,
        sidebar,
        userAccount
    } = browsers.pageObj1;

    const dossier = {
        id: 'B19C0726492EA090968FE1A2464735EF',
        name: '(AUTO) Subscription',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier_privilege = {
        id: 'D3FA0C934222C68D2D3C7891B5BEB54A',
        name: '(AUTO) Subscription_Privilege',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const report = {
        id: '3F2DFB4035400E8C020FBD936DCBBB35',
        name: '(AUTO) Report',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const RSD = {
        id: '60C8CE46E942FF51C3C7F49E26ADA59B',
        name: '(AUTO) RSD_2',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });


    it('[F43156_fullPrivilege] Check privileges for subscription in Library', async() => {
        // login using account auto_subscription
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('Created in Web_(AUTO) Subscription');
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('Created in Web_(AUTO) Subscription')).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('Created in Web_(AUTO) Subscription')).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('Created in Web_(AUTO) Subscription')).toBe(true);
        //since('There is no Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
        //    .expect(await subscriptionDialog.isSubscriptionNotePresent()).toBe(false);

        
        await subscriptionDialog.hoverSubscription('(AUTO) RSD_2');
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) RSD_2')).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) RSD_2')).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) RSD_2')).toBe(true);

        
        await subscriptionDialog.hoverSubscription('(AUTO) RSD HL');
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) RSD HL')).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) RSD HL')).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) RSD HL')).toBe(true);

        // Open info window
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(true);
        await subscriptionDialog.closeSubscribe();

        await libraryPage.moveDossierIntoViewPort(report.name);
        await libraryPage.openDossierInfoWindow(report.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(true);
        await subscriptionDialog.closeSubscribe();

        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(true);
        await subscriptionDialog.closeSubscribe();

        await dossierPage.goToLibrary();
    });

    it('[F43156_noPrivilege] Check privileges for subscription in Library', async () => {
        // Logout and login using account auto_subscription_noPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_noPrivilege', password: 'newman1#'});
        // await loginPage.login({username: 'administrator', password: ''});

        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('(AUTO) Subscription_for noPrivilege');

        since('User does not have privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) Subscription_for noPrivilege')).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) Subscription_for noPrivilege')).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) Subscription_for noPrivilege')).toBe(false);
        since('User can check the Note of subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionNotePresent()).toBe(true);

        // Check privilege from info window
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        since('User does not have privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        // Check privilege from share panel
        await dossierPage.openShareDropDown();
        since('User does not have privilege of subscription, Subscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscribePresent()).toBe(false);
        await share.closeSharePanel();

    });

    it('[F43156_Privilege1] Check privileges for subscription in Library', async () => {
        // Logout and login using account auto_subscription_noPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_Privilege1', password: 'newman1#'});
        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('(AUTO) Subscription_ Privilege web admin created for user Privilege1');
        since('User does not have privilege of subscription created by others, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege1')).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege1')).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege1')).toBe(false);
        //since('There is no Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
        //    .expect(await subscriptionDialog.isSubscriptionNotePresent()).toBe(false);

        await subscriptionDialog.hoverSubscription('(AUTO) Subscription_admin created for p1p2');
        since('User does not have privilege of subscription created by others, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) Subscription_admin created for p1p2')).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) Subscription_admin created for p1p2')).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) Subscription_admin created for p1p2')).toBe(true);
        //since('There is Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
        //    .expect(await subscriptionDialog.isSubscriptionNotePresent()).toBe(true);
        
        // Check privilege from info window
        // await dossierPage.goToLibrary();
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier_privilege.name);
        await libraryPage.openDossierInfoWindow(dossier_privilege.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);

        since('User does not have privilege of subscription created by others,, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(false);
        await infoWindow.close();

        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        since('User does not have privilege of subscription created by others,, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(true);
        await infoWindow.close();

        await libraryPage.openDossier(dossier_privilege.name);
        await dossierPage.waitForDossierLoading();
        // Check privilege from share panel
        await dossierPage.openShareDropDown();
        since('User does not have privilege of subscription, Subscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscribePresent()).toBe(false);
        await share.closeSharePanel();

        await dossierPage.goToLibrary();

    });

    it('[F43156_Privilege2] Check privileges for subscription in Library', async () => {
        // Logout and login using account auto_subscription_noPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_Privilege2', password: 'newman1#'});
        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('(AUTO) Subscription 2');
        since('User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) Subscription 2')).toBe(false);
        since('User has privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) Subscription 2')).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) Subscription 2')).toBe(true);
        //since('There is no Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
        //    .expect(await subscriptionDialog.isSubscriptionNotePresent()).toBe(false);

        await subscriptionDialog.hoverSubscription('(AUTO) Subscription_ Privilege web admin created for user Privilege2');
        since('User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarRunNowPresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege2')).toBe(false);
        since('User has privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSidebarEditPresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege2')).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege2')).toBe(false);

        // Check privilege from info window
        // await dossierPage.goToLibrary();
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);

        since('User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(false);
        since('User has privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(true);
        await infoWindow.close();

        await libraryPage.moveDossierIntoViewPort(dossier_privilege.name);
        await libraryPage.openDossierInfoWindow(dossier_privilege.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);

        since('User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionRunNowPresent()).toBe(false);
        since('User has privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubscriptionEditPresent()).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUnSubscribePresent()).toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        // Check privilege from share panel
        await dossierPage.openShareDropDown();
        await dossierPage.sleep(1000);
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(1000);
        since('User does not have privilege of Subscription SendNow, Subscription SendNow checkbox is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSendNowPresent()).toBe(false);
        await subscriptionDialog.clickCloseButton();
        await share.closeSharePanel();
        await dossierPage.goToLibrary();

    });
});
