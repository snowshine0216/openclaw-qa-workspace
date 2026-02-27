import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
describe('Automation for Subscription - Add Address in Library', () => {
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


    let loginPage, dossierPage,libraryPage, subscriptionDialog, sidebar, userAccount, mockedSubscribeRequest, mockedEditSubscriptionRequest;

    beforeAll(async () => {
        ({
            loginPage,
            dossierPage,
            libraryPage,
            subscriptionDialog,
            sidebar,
            userAccount
        } = browsers.pageObj1);
        await setWindowSize(browserWindow);        
    });

    beforeEach(async () => {
        await resetDossierState({
            //credentials: {username: 'auto_subscription', password: 'newman1#'},
            credentials: {username: 'auto_subscription2', password: 'newman1#'},
            dossier: dossier
        });
    });



    it('[F42962_AddAddress] Add personal address', async() => {
        //await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        await loginPage.login({username: 'auto_subscription2', password: 'newman1#'});
        await dossierPage.goToLibrary();
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        //await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        

        // Modify Auto_Subscription 1
        await subscriptionDialog.hoverSubscription('Add Address Automation');
        await subscriptionDialog.clickEditButtonInSidebar('Add Address Automation');
        await subscriptionDialog.addRecipient('test');
        await subscriptionDialog.clickAddNewAddressButton();
        await subscriptionDialog.clickAddressNameTextBox();
        await subscriptionDialog.input('Test');
        await subscriptionDialog.clickEmailAddressTextBox();
        await subscriptionDialog.input('Test@strategy.com');
        await takeScreenshotByElement(await subscriptionDialog.$('.mstrd-RecipientComboBox-dialog'), 'F42962_01', 'Create Email Address', {tolerance: 0.3});
        await subscriptionDialog.clickAddressCancelButton();
        await subscriptionDialog.clickCloseButton();
    
    });

   

});