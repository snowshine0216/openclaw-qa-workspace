//import { checkElementByImageComparison } from '../../../utils/TakeScreenshots.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import {scrollElementToBottom} from '../../../utils/scroll.js';

describe('LibrarySubscription - Create and Manage Subscription for Group as Recipients in Library', () => {
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

    let mockedSubscribeRequest, mockedEditSubscriptionRequest;
    const recipientOwnerA_id = '61CC94AA4689DF7DB241A29ABC160E4B';
    const subscriptionGroup1_id = '339D2ACC3C41D4D32E5413B31475713D';
    const subscriptionGroup2_id ='30CBDFF37343174D063EB4A9083D98C5';
    const subscriptionTestGroup_id ='3529241BFB44E62BFEF82282143EBFCF';

    const dossier_testGroup = {
        id: '26910CA9C2486E5BBB5D37B8828054A6',
        name: '(AUTO) Subscription - testGroup',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        // Delete existing bookmark that to be created in next step
        await resetBookmarks({
            credentials: {username: 'auto_subscription_testGroup', password: 'newman1#'},
            dossier: dossier_testGroup
        });
        mockedSubscribeRequest = await browser.mock('https://**/api/subscriptions');
        mockedEditSubscriptionRequest = await browser.mock('https://**/api/subscriptions/*', { method: 'PUT' });
        
    });

    beforeEach(() => {
        mockedSubscribeRequest.clear();
        mockedEditSubscriptionRequest.clear();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98932_1] Create subscription for groups', async() => {
        await loginPage.login({username: 'auto_subscription_testGroup', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testGroup.name);
        await libraryPage.openDossier(dossier_testGroup.name);
        await dossierPage.sleep(1000);
        // Create subscription for grou and recipients
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Subscription for groups (No allow unsubscribe option)');
        await dossierPage.sleep(1000);
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Subscription for groups');
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_1', 'DeliverTo_Origin', {tolerance: 1});
        await subscribe.deleteRecipient('auto_subscription_testGroup');
        await subscribe.searchRecipient('auto_subscription_group1');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipientGroup('auto_subscription_group1');
        await dossierPage.sleep(1000);        
        await subscribe.searchRecipient('auto_subscription_group2');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipientGroup('auto_subscription_group2');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_1', 'AddGroups', {tolerance: 1});
        await dossierPage.sleep(1000);
        //await subscribe.createSubscription();
        await dossierPage.sleep(3000);
        await subscribe.createSubscription();
        await dossierPage.sleep(5000);
        await subscribe.waitForLoadingButtonToDisappear();
        // Check recipient group id in the request post data
        const postData = subscribe.getRequestPostData(mockedSubscribeRequest.calls[0]);
        console.log(postData);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.recipients[0].id)
             .toBe(subscriptionGroup1_id);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.recipients[1].id)
             .toBe(subscriptionGroup2_id);
        await dossierPage.goToLibrary();
    });

    it('[TC98932_2] Create subscription for groups and recipients', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_testGroup', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testGroup.name);
        await libraryPage.openDossier(dossier_testGroup.name);
        await dossierPage.sleep(1000);
        // Create subscription for groups and recipients
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Subscription for group and recipients: allow unsubscribe');
        await dossierPage.sleep(1000);
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Create subscription for groups and recipients');
        await subscribe.searchRecipient('auto_subscription_ownerA');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['auto_subscription_ownerA']);
        await dossierPage.sleep(1000);
        await subscribe.searchRecipient('auto_subscription_group1');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipientGroup('auto_subscription_group1');
        await dossierPage.sleep(1000);
        await subscribe.searchRecipient('auto_subscription_group2');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipientGroup('auto_subscription_group2');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_2', 'AddGroupsAndRecipients', {tolerance: 1});
        await dossierPage.sleep(1000);
        await subscribe.createSubscription();
        await dossierPage.sleep(5000);
        await subscribe.waitForLoadingButtonToDisappear();
        // Check recipient id in the request post data
        const postData = subscribe.getRequestPostData(mockedSubscribeRequest.calls[0]);
        console.log(postData);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.recipients[0].id)
             .toBe(subscriptionGroup1_id);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.recipients[1].id)
             .toBe(subscriptionGroup2_id);       
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.recipients[2].id)
             .toBe(recipientOwnerA_id);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.recipients[3].id)
             .toBe(subscriptionTestGroup_id);
        await dossierPage.goToLibrary();
    });

    it('[TC98932_3] Check status of empty group', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_testGroup', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testGroup.name);
        await libraryPage.openDossier(dossier_testGroup.name);
        await dossierPage.sleep(1000);
        // Check empty group status.
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Subscription for group and recipients: allow unsubscribe');
        await dossierPage.sleep(1000);
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Create subscription for groups and recipients');
        await subscribe.searchRecipient('emptygroup');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscribe.getSubscriptionShareResipientList(), 'TC98932_3', 'Subscription_Recipient_emptyGroup', {tolerance: 1});
        await dossierPage.sleep(1000);

    });

    it('[TC98932_4] Check Recipients in DeliverTo after Manipulations', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription_testGroup', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_testGroup.name);
        await libraryPage.openDossier(dossier_testGroup.name);
        await dossierPage.sleep(1000);
        
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Manipulations for recipients');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Manipulations for recipients');
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getRecipientSearchSection(), 'TC98932_4', 'Recipient_initial', {tolerance: 1});
        //Add one group
        await subscribe.searchRecipient('auto_subscription_group1');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipientGroup('auto_subscription_group1');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_4', 'GroupAndOwner_NoAllowUnsubscribe', {tolerance: 1});
        since('Current recipients are group and owner, AllowUnsubscribe is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isGetAllowUnsubscribePresent()).toBe(false);
        //Delete current user
        await subscribe.deleteRecipient('auto_subscription_testGroup');
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_4', 'OneGroup_NoAllowUnsubscribe', {tolerance: 1});
        since('Current recipients are group, AllowUnsubscribe is supposed to be #{expected}, instead we have #{actual}')
        .expect(await subscribe.isGetAllowUnsubscribePresent()).toBe(false);
        //Add other recipient
        await subscribe.searchRecipient('subscription_groupMemberA');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['subscription_groupMemberA']);
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_4', 'OneGroupAndOther_AllowUnsubscribe', {tolerance: 1});
        since('Current recipients are others, AllowUnsubscribe is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.isGetAllowUnsubscribePresent()).toBe(true);
        //Delete recipient user
        await subscribe.deleteRecipient('subscription_groupMemberA');
        await subscribe.searchRecipient('auto_subscription_group2');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipientGroup('auto_subscription_group2');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_4', 'TwoGroups_NoAllowUnsubscribe', {tolerance: 1});
        since('Current recipients are groups, AllowUnsubscribe is supposed to be #{expected}, instead we have #{actual}')
        .expect(await subscribe.isGetAllowUnsubscribePresent()).toBe(false);
        //Add current user
        await subscribe.searchRecipient('auto_subscription_testGroup');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['auto_subscription_testGroup']);
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_4', 'GroupsAndOwner_NoAllowUnsubscribe', {tolerance: 1});
        since('Current recipients are groups, AllowUnsubscribe is supposed to be #{expected}, instead we have #{actual}')
        .expect(await subscribe.isGetAllowUnsubscribePresent()).toBe(false);
        //Add other as recipient
        await subscribe.searchRecipient('subscription_groupMemberB');
        await dossierPage.sleep(1000);
        await subscribe.selectRecipients(['subscription_groupMemberB']);
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC98932_4', 'GroupsAndRecipients_AllowUnsubscribe', {tolerance: 1});
        since('Current recipients are groups and recipients, AllowUnsubscribe is supposed to be #{expected}, instead we have #{actual}')
        .expect(await subscribe.isGetAllowUnsubscribePresent()).toBe(true);
        await dossierPage.sleep(1000);

    });
    


});
