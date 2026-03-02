import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('LibrarySubscription - Check subscription privilege in Library', () => {
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


    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });


    it('[TC76458_fullPrivilege] Check privileges for subscription in Library', async() => {
        // login using account auto_subscription
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});

        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('Created in Web_(AUTO) Subscription');
        //await takeScreenshot('TC76458_fullPrivilege', '[Sidebar] Check privilege of subscription created in Web');
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('Created in Web_(AUTO) Subscription')).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('Created in Web_(AUTO) Subscription')).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('Created in Web_(AUTO) Subscription')).toBe(true);
        since('There is no Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionNotePresent()).toBe(false);

        //  Open info window
        // await dossierPage.goToLibrary();
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        // Check privilege from side bar
        //await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC76458_fullPrivilege', '[InfoWindow]] Check privilege of subscription created in Web');
        since('User has privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(true);
        since('User cannot edit subscription created in Web, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(false);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(true);
        await subscribe.closeSubscribe();
        await dossierPage.goToLibrary();
    });

    it('[TC76458_noPrivilege] Check privileges for subscription in Library', async () => {
        // Logout and login using account auto_subscription_noPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_noPrivilege', password: 'newman1#'});
        // await loginPage.login({username: 'administrator', password: ''});

        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('(AUTO) Subscription_for noPrivilege');
        //await takeScreenshot('TC76458_noPrivilege', '[Sidebar] Default view for noPrivilege user');
        since('User does not have privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('(AUTO) Subscription_for noPrivilege')).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('(AUTO) Subscription_for noPrivilege')).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('(AUTO) Subscription_for noPrivilege')).toBe(false);
        since('User can check the Note of subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionNotePresent()).toBe(true);

        // Check privilege from info window
        // await dossierPage.goToLibrary();
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        //await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC76458_noPrivilege', '[Info Window] Default view for noPrivilege user');
        since('User does not have privilege of subscription, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        // Check privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshotByElement(subscribe.getSharePanel(),'TC76458_noPrivilege', '[Share Panel] Default view for noPrivilege user');
        since('User does not have privilege of subscription, Subscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscribePresent()).toBe(false);
        await share.closeSharePanel();

    });

    it('[TC76458_Privilege1] Check privileges for subscription in Library', async () => {
        // Logout and login using account auto_subscription_noPrivilege

        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_Privilege1', password: 'newman1#'});
        // await loginPage.login({username: 'administrator', password: ''});

        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('(AUTO) Subscription_ Privilege web admin created for user Privilege1');
        //await takeScreenshot('TC76458_Privilege1', '[Sidebar] Default view for Privilege1 user');
        since('User does not have privilege of subscription created by others, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege1')).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege1')).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('(AUTO) Subscription_ Privilege web admin created for user Privilege1')).toBe(false);
        since('There is no Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionNotePresent()).toBe(false);

        // Check privilege from info window
        // await dossierPage.goToLibrary();
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier_privilege.name);
        await libraryPage.openDossierInfoWindow(dossier_privilege.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        //await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC76458_Privilege1', '[Info Window] Default view for Privilege1 user');
        since('User does not have privilege of subscription created by others,, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(false);
        since('User does not have privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(false);
        since('User does not have privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(dossier_privilege.name);
        await dossierPage.waitForDossierLoading();
        // Check privilege from share panel
        await dossierPage.openShareDropDown();
        //await takeScreenshotByElement(subscribe.getSharePanel(),'TC76458_Privilege1', '[Share Panel] Default view for Privilege1 user');
        since('User does not have privilege of subscription, Subscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscribePresent()).toBe(false);
        await share.closeSharePanel();

        await dossierPage.goToLibrary();

    });

    it('[TC76458_Privilege2] Check privileges for subscription in Library', async () => {
        // Logout and login using account auto_subscription_noPrivilege
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_Privilege2', password: 'newman1#'});
        // await loginPage.login({username: 'administrator', password: ''});

        // Check privilege from side bar
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.hoverSubscription('(AUTO) Subscription 2');
        //await takeScreenshot('TC76458_Privilege2', '[Sidebar] Default view for Privilege2 user');
        since('User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarRunNowPresentByName('(AUTO) Subscription 2')).toBe(false);
        since('User has privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSidebarEditPresentByName('(AUTO) Subscription 2')).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresentByName('(AUTO) Subscription 2')).toBe(true);
        since('There is no Note for this subscription, Note button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionNotePresent()).toBe(false);

        // Check privilege from info window
        // await dossierPage.goToLibrary();
        await sidebar.openAllSectionList();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        //await takeScreenshotByElement(subscribe.getInfoWindowSubscriptionPanel(),'TC76458_Privilege2', '[Info Window] Default view for Privilege2 user');
        since('User does not have privilege of Subscription RunNow, Subscription RunNow button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionRunNowPresent()).toBe(false);
        since('User has privilege of subscription, Subscription Edit button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscriptionEditPresent()).toBe(true);
        since('User has privilege of subscription, Unsubscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isUnSubscribePresent()).toBe(true);
        await infoWindow.close();

        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        // Check privilege from share panel
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        //await takeScreenshotByElement(subscribe.getSubscriptionPanel(),'TC76458_Privilege2', '[Share Panel] Default view for Privilege2 user');
        since('User has privilege of subscription, Subscribe button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSubscribePresent()).toBe(true);
        since('User does not have privilege of Subscription SendNow, Subscription SendNow checkbox is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isSendNowPresent()).toBe(false);

        await share.closeSharePanel();
        await dossierPage.goToLibrary();

    });
});
