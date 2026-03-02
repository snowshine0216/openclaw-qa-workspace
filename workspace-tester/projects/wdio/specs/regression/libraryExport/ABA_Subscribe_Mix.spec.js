import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
describe('ABA - Automation for Subscription - Create and Manage Subscription in Library', () => {
    // Tanzu environemnt
    const dossier = {
        id: '8D57A2284F323D3875A3ACB4F5EBF81F',
        name: '(AUTO) Subscription',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };
    
    const report = {
        id: '7F3C3EE345BDAA3D9837FFA50DBC72EE',
        name: '(AUTO) Report',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const RSD = {
        id: '25E6C53A44899E3CE9E4FFA1237659FE',
        name: '(AUTO) RSD',
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
        // Delete existing bookmark that to be created in next step
        
        mockedSubscribeRequest = await browser.mock('https://**/api/subscriptions');
        mockedEditSubscriptionRequest = await browser.mock('https://**/api/subscriptions/*', { method: 'PUT' });
        await loginPage.login({username: 'auto_subscription', password: 'newman1#'});
        await resetDossierState({
            credentials: {username: 'auto_subscription', password: 'newman1#'},
            //credentials: {username: 'mstr', password: 'F2t-N%l_e7w4'},
            dossier: dossier
        });
    });

    beforeEach(async () => {
        mockedSubscribeRequest.clear();
        mockedEditSubscriptionRequest.clear();
    });


    it('[F43156_11] Manage Email subscription for Report from info window', async() => {
        await libraryPage.moveDossierIntoViewPort(report.name);
        await libraryPage.openDossierInfoWindow(report.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(2000);
        // Edit subscriptions
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(3000);
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'F43156_11', 'ContentSettings_before', {tolerance: 0.3});
        await subscriptionDialog.clickExpandPageByCheckbox();
        await subscriptionDialog.inputFileName('F43156_11_FileName_UpdatedFromInfoWindow');
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.clickUseTimezonesCheckbox();
        await subscriptionDialog.inputNote('F43156_11_Message_UpdatedFromInfoWindow');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'F43156_11', 'ContentSettings_after', {tolerance: 0.3});

        // Check saved advanced settings and update
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_11', 'AdvancedSettings_before', {tolerance: 0.3});
        await subscriptionDialog.clickCompressZipFileCheckbox()
        await subscriptionDialog.inputZipFileName("Customized Zip File Name for (AUTO) Report");
        await subscriptionDialog.inputZipFilePW("1234567");
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_11', 'AdvancedSettings_after', {tolerance: 0.3});
        //await subscriptionDialog.clickBackButton();
        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);      
        await subscriptionDialog.closeSubscribe();

    });

    it('[F43156_12] Manage Email subscription for RSD from info window', async() => {
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(2000);
        // Edit subscriptions
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(3000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_12', 'ContentSettings_before', {tolerance: 0.3});
        await subscriptionDialog.selectFormat('PDF');
        await subscriptionDialog.clickExpandLayoutsCheckbox();
        await subscriptionDialog.clickExpandPageByCheckbox();
        await subscriptionDialog.inputFileName('F43156_12_(AUTO) RSD_UpdatedFromInfoWindow');
        await subscriptionDialog.clickSendNowCheckbox();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_12', 'ContentSettings_after', {tolerance: 0.3});

        // Check saved advanced settings and update
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_12', 'AdvancedSettings_before', {tolerance: 0.3});
        await subscriptionDialog.clickCompressZipFileCheckbox()
        await subscriptionDialog.inputZipFileName("Customized Zip File Name for (AUTO) RSD");
        await subscriptionDialog.inputZipFilePW("1234567");
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickAllowChangeDeliveryCheckbox();
        await subscriptionDialog.clickAllowChangePersonalizationCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_12', 'AdvancedSettings_after', {tolerance: 0.3});
        //await subscriptionDialog.clickBackButton();
        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);
        await subscriptionDialog.closeSubscribe();

    });

    it('[F43156_13] Manage Email subscription for Report from sidebar', async() => {
        await dossierPage.goToLibrary();
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        //await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('(AUTO) Report');
        await subscriptionDialog.clickEditButtonInSidebar('(AUTO) Report');
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'F43156_13', 'ContentSettings_before', {tolerance: 0.3});
        await subscriptionDialog.inputFileName('F43156_13_FileName');
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickExpandPageByCheckbox();
        since('Use recipients time zones is supposed to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.isUseTimezonesCheckboxChecked()).toBe(true);       
        await subscriptionDialog.clickUseTimezonesCheckbox();
        await subscriptionDialog.inputNote('F43156_13_Message');
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getContentPanel(), 'F43156_13', 'ContentSettings_after', {tolerance: 0.3});
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_13', 'AdvancedSettings_before', {tolerance: 0.3});    
        await subscriptionDialog.clickCompressZipFileCheckbox()
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_13', 'AdvancedSettings_after', {tolerance: 0.3});    
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSave();
        await dossierPage.sleep(3000);
    });

    it('[F43156_14] Manage Email subscription for RSD from sidebar', async() => {
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('(AUTO) RSD');
        await subscriptionDialog.clickEditButtonInSidebar('(AUTO) RSD');
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_14', 'ContentSettings_before', {tolerance: 0.3});
        await subscriptionDialog.selectFormat('HTML');
        await subscriptionDialog.clickExpandLayoutsCheckbox();
        await subscriptionDialog.clickExpandPageByCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getContentSettingsSection(), 'F43156_14', 'ContentSettings_after', {tolerance: 0.3});
        //await subscriptionDialog.clickAdvancedSettingsButton();
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await subscriptionDialog.tabForward(1);
        await subscriptionDialog.enter();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_14', 'AdvancedSettings_before', {tolerance: 0.3});    
        await subscriptionDialog.clickAllowChangeDeliveryCheckbox();
        await subscriptionDialog.clickAllowChangePersonalizationCheckbox();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscriptionDialog.getAdvancedSettingsDialog(), 'F43156_14', 'AdvancedSettings_after', {tolerance: 0.3});    
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSave();
        await dossierPage.sleep(1000);
        await dossierPage.goToLibrary();
    });

    });