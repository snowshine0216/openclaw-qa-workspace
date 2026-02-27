import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
describe('Automation for FTP Subscription - Create and Manage FTP Subscription in Library', () => {
    // Tanzu environemnt
    const dossier = {
        id: 'A31EC7BBB24C613C182741B656C2D513',
        name: '(AUTO) Subscription_FTP',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier_subscription = {
        id: 'B19C0726492EA090968FE1A2464735EF',
        name: '(AUTO) Subscription',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const report = {
        id: 'B390AEFC6A4BBB5A65644BBD036FAC1C',
        name: '(AUTO) Subscription_Report_FTP',
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

    let loginPage, dossierPage, libraryPage, share, infoWindow, subscriptionDialog, sidebar, mockedSubscribeRequest, mockedEditSubscriptionRequest, userAccount;

    beforeAll(async () => {
        ({
            loginPage,
            dossierPage,
            libraryPage,
            share,
            infoWindow,
            subscriptionDialog,
            sidebar,
            userAccount,
        } = browsers.pageObj1);
        await setWindowSize(browserWindow);
    });

    it('[BCVE-5242_01] Create Dashboard FTP subscription from share panel', async () => {
        await resetBookmarks({
            credentials: { username: 'auto_subscription_ftp', password: 'newman1#' },
            dossier: dossier
        });

        // Tanzu environment
        await loginPage.login({ username: 'auto_subscription_ftp', password: 'newman1#' });
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
        await subscriptionDialog.inputSubscriptionName('FTP_Subscription');
        await dossierPage.sleep(1000);
        await subscriptionDialog.selectType('FTP');
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'BCVE-5242_01', 'DefaultSettings', { tolerance: 0.3 });
        await subscriptionDialog.inputBookmarkName('BCVE-5242_01_Bookmark_FTP');
        await subscriptionDialog.selectFormat('Excel');
        await subscriptionDialog.inputFileName('BCVE-5242_01_FTP_Subscription_Excel');

        await subscriptionDialog.clickSubFolderRadioButton();
        await takeScreenshotByElement(subscriptionDialog.getFTPSettingsDialog(), 'BCVE-5242_01', 'FTP_Location_SubFolder_Default', { tolerance: 0.3 });
        await subscriptionDialog.selectSubscriptionDevice('FTP location');
        await subscriptionDialog.inputDeviceSubFolder("AUTO_FTP_Subscription_{&Date}");
        await subscriptionDialog.enter();
        await takeScreenshotByElement(subscriptionDialog.getFTPSettingsDialog(), 'BCVE-5242_01', 'FTP_Location_SubFolder_Update', { tolerance: 0.3 });
        await subscriptionDialog.clickUsersRadioButton();
        await subscriptionDialog.clickSendNowCheckbox();
        // Select schedules
        await subscriptionDialog.OpenScheduleOptions();
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'BCVE-5242_01', 'ScheduleOptions', { tolerance: 0.3 });
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed']);
        await subscriptionDialog.clickTimeScheduleOptions(['Daily', 'All the Time', 'First of Month']);
        await subscriptionDialog.clickSendNotificationCheckbox();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getDeliverySettingsSection(), 'BCVE-5242_01', 'ScheduleSettings', { tolerance: 0.3 });
        await dossierPage.sleep(1000);

        // Set advanced settings
        await dossierPage.sleep(1000);
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(2);
        await dossierPage.sleep(1000);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'BCVE-5242_01', 'DefaultAdvancedSettings', { tolerance: 0.3 });
        await subscriptionDialog.clickCompressZipFileCheckbox();
        await subscriptionDialog.inputZipFileName("Customized Zip File Name");
        await subscriptionDialog.inputZipFilePW("1234567");
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'BCVE-5242_01', 'CustomizedAdvancedSettings', { tolerance: 0.3 });
        await subscriptionDialog.clickBackButton();

        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(1000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();

    });

    it('[BCVE-5242_02] Manage Dashboard FTP subscription from info window', async () => {
        await dossierPage.goToLibrary();
        //  Open info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getInfoWindowSubscriptionPanel(), 'BCVE-5242_02', 'Default view of manage subscription', { tolerance: 0.5 });
        // Edit subscriptions
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(3000);
        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.inputFileName('BCVE-5242_02_Auto_Subscription_PDF');
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'BCVE-5242_02', 'UpdatedContentSettings', { tolerance: 0.3 });
        
        await subscriptionDialog.OpenScheduleOptions();
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'BCVE-5242_01', 'SavedScheduleOptions', { tolerance: 0.3 });
        await subscriptionDialog.clickTimeScheduleOptions(['Daily', 'First of Month']);
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed','On Database Load', 'Load Metadata Event Schedule']);
        await takeScreenshotByElement(subscriptionDialog.getScheduleOptionsDialog(), 'BCVE-5242_01', 'UpdatedScheduleOptions', { tolerance: 0.3 });
        await subscriptionDialog.clickSendNotificationCheckbox();

        // Check saved advanced settings and update
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'BCVE-5242_02', 'CheckSavedAdvancedSettings', { tolerance: 0.3 });
        await subscriptionDialog.clickCompressZipFileCheckbox();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'BCVE-5242_02', 'UpdatedAdvancedSettings', { tolerance: 0.3 });
        await subscriptionDialog.clickBackButton();

        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);

        await subscriptionDialog.closeSubscribe();
    });

    it('[BCVE-5242_03] Manage Dashboard FTP subscription from sidebar', async () => {
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await takeScreenshot('BCVE-5242_03', 'Check subscriptions in sidebar 1', { tolerance: 0.3 });

        // Modify Auto_Subscription 1
        await subscriptionDialog.hoverSubscription('FTP_Subscription');
        await subscriptionDialog.clickEditButtonInSidebar('FTP_Subscription');

        await subscriptionDialog.selectFormat('CSV');
        await subscriptionDialog.inputFileName('BCVE-5242_03_Auto_Subscription_CSV');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'BCVE-5242_03', 'UpdatedContentSettings', { tolerance: 0.3 });

        // Check saved advanced settings and update
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'BCVE-5242_03', 'CheckUpdatedAdvancedSettings', { tolerance: 0.3 });
        await subscriptionDialog.clickBackButton();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSave();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSidebarUnsubscribe('FTP_Subscription');
        await dossierPage.sleep(2000);
        await subscriptionDialog.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        await takeScreenshot('TC77895', 'Check subscriptions in sidebar 2', { tolerance: 0.3 });
    });

    it('[BCVE-5242_04] Manage Report FTP subscription from sidebar', async () => {
        // Modify Auto_Subscription 1
        await subscriptionDialog.hoverSubscription('(AUTO) Subscription_Report_FTP');
        await subscriptionDialog.clickEditButtonInSidebar('(AUTO) Subscription_Report_FTP');
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'BCVE-5242_04', 'SavedSettings_Excel', { tolerance: 0.3 });
        await subscriptionDialog.selectFormat('CSV');
        await subscriptionDialog.inputFileName('BCVE-5242_04_Auto_Subscription_CSV');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'BCVE-5242_04', 'ContentSettings_CSV', { tolerance: 0.3 });
        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.inputFileName('BCVE-5242_04_Auto_Subscription_PDF');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'BCVE-5242_04', 'ContentSettings_PDF', { tolerance: 0.3 });      
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSidebarCancel();
        await dossierPage.goToLibrary();

    });

    it('[BCVE-5242_05] Check create sub-folder function for user without privilege ', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        await libraryPage.moveDossierIntoViewPort(dossier_subscription.name);
        await libraryPage.openDossier(dossier_subscription.name);
        await dossierPage.openShareDropDown();
        await dossierPage.sleep(1000);
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(1000);
        await subscriptionDialog.selectType('FTP');
        await takeScreenshotByElement(subscriptionDialog.getFTPSettingsDialog(), 'BCVE-5242_05', 'FTP_Location_SubFolder_Default', { tolerance: 0.3 });
        since('User does not have privilege of creating sub-folder, sub-folder radio button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isSubFolderRadioAvailable()).toBe(false);
        await subscriptionDialog.clickCloseButton();
        await dossierPage.goToLibrary();

    });


    
});