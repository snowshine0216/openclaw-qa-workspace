//import { checkElementByImageComparison } from '../../../utils/TakeScreenshots.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('LibrarySubscription - Create and Manage PDF Subscription in Library', () => {
    let {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        subscribe,
        pdfExportWindow,
        infoWindow,
        sidebar,
    } = browsers.pageObj1;

    const dossier_PDF = {
        id: '465444CB48EDA9186E300BB60A0A3BEC',
        name: '(AUTO) Subscription_General',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const customAppID = 'BD9B2178B92449C2BA7237C89F04ED73';
    const defaultAppID = 'C2B2023642F6753A2EF159A75E0CFF29';
    let mockedSubscribeRequest, mockedEditSubscriptionRequest;

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login({ username: 'auto_subscription', password: 'newman1#' });
        // Delete existing bookmark that to be created in next step
        await resetBookmarks({
            credentials: { username: 'auto_subscription', password: 'newman1#' },
            dossier: dossier_PDF,
        });
        mockedSubscribeRequest = await browser.mock('https://**/api/subscriptions');
        mockedEditSubscriptionRequest = await browser.mock('https://**/api/subscriptions/*', { method: 'PUT' });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    beforeEach(() => {
        mockedSubscribeRequest.clear();
        mockedEditSubscriptionRequest.clear();
    });

    it('[TC79674] Create PDF subscription from share panel', async () => {
        await libraryPage.openUrl(dossier_PDF.project.id, dossier_PDF.id);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();

        // Create PDF subscription 1
        await subscribe.inputName('Auto_Subscription_PDF 1');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Auto_Bookmark_PDF 1');
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC79674', 'Auto PDF Subscription 1', {
            tolerance: 0.3,
        });
        await subscribe.selectFormat('PDF');
        // Set exporting range
        await subscribe.clickRangeDropdown();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79674', 'Default range', { tolerance: 0.3 });
        await dossierPage.sleep(500);
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getAllCheckboxStatus())
            .toBe('true');
        await subscribe.clickRangeAll();
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getAllCheckboxStatus())
            .toBe('false');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79674', 'UnCheck range_All');
        await dossierPage.sleep(500);
        await subscribe.clickOnlyByChapterName('Chapter 1');
        since('Check box status of Chapter 1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('Chapter 1'))
            .toBe('true');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79674', 'Check Chapter 1 Only', { tolerance: 0.3 });
        await dossierPage.sleep(500);
        await subscribe.clickRangeAll();
        await dossierPage.sleep(500);
        await subscribe.clickRangeAll();
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getAllCheckboxStatus())
            .toBe('true');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79674', 'Check range_All', { tolerance: 0.3 });
        await dossierPage.sleep(500);
        await subscribe.clickRangeDropdown();
        // Check PDF settings
        await subscribe.openPDFSettingsMenu();
        await takeScreenshotByElement(subscribe.getPDFSettingsPanel(), 'TC79674', '(Default) PDF Settings 1', {
            tolerance: 0.3,
        });
        await dossierPage.sleep(1000);
        await pdfExportWindow.selectPageSize('A4 8.27" x 11.69"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.toggleHeaderCheckBox();
        await pdfExportWindow.selectFilterSummary('Both');
        await takeScreenshotByElement(
            pdfExportWindow.getDossierExportPDFPanel(),
            'TC79674',
            '(Modified) PDF Settings 1',
            { tolerance: 0.3 }
        );
        await subscribe.exitPDFSettingsMenu();
        await subscribe.inputBookmark('Auto_Bookmark_PDF 1');
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.inputNote('Create Auto PDF Subscription 1');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        // Check the modified settings
        await takeScreenshotByElement(
            subscribe.getSubscriptionPanel(),
            'TC79674',
            '(Modified) Auto PDF Subscription 1',
            { tolerance: 0.3 }
        );
        await dossierPage.sleep(1000);
        await subscribe.createSubscription();
        await dossierPage.sleep(3000);
        await subscribe.waitForLoadingButtonToDisappear();
        // Check application id in the request post data
        const postData = subscribe.getRequestPostData(mockedSubscribeRequest.calls[0]);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.delivery.applicationId)
             .toBe(defaultAppID);

        // Modify settings and create Auto PDF Subscription 2
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Auto_Subscription_PDF 2');
        await dossierPage.sleep(1000);
        await subscribe.selectBookmark('Include current view as a bookmark');
        await subscribe.selectFormat('PDF');
        // Set exporting range
        await subscribe.clickRangeDropdown();
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByChapterName('Chapter 1');
        since('Check box status of Chapter 1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('Chapter 1'))
            .toBe('false');
        await dossierPage.sleep(500);
        await subscribe.clickArrowByChapterName('Ch3');
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByPageName('ch3-p2');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79674', 'RangeSetting 2', { tolerance: 0.3 });
        await dossierPage.sleep(500);
        since('Check box status of ch3-p2 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('ch3-p2'))
            .toBe('false');
        await subscribe.clickRangeDropdown();
        await subscribe.openPDFSettingsMenu();
        await takeScreenshotByElement(subscribe.getPDFSettingsPanel(), 'TC79674', '(Default) PDF Settings 2', {
            tolerance: 0.3,
        });
        await subscribe.exitPDFSettingsMenu();
        await subscribe.inputBookmark('Auto_Bookmark_PDF 2');
        await subscribe.selectSchedule('On Database Load');
        await dossierPage.sleep(1000);
        await subscribe.inputNote('Create PDF Subscription 2');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        // Check the modified settings
        await takeScreenshotByElement(
            subscribe.getSubscriptionPanel(),
            'TC79674',
            '(Modified) Auto PDF Subscription 2',
            { tolerance: 0.3 }
        );
        await dossierPage.sleep(1000);
        await subscribe.createSubscription();
        await dossierPage.sleep(3000);
        await subscribe.waitForLoadingButtonToDisappear();

        // Modify settings and create Auto Subscription 3
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Auto_Subscription_PDF 3');
        await dossierPage.sleep(1000);
        await subscribe.selectBookmark('Auto_Bookmark_PDF 1');
        await subscribe.selectFormat('PDF');
        // Set exporting range
        await subscribe.clickRangeDropdown();
        await subscribe.clickRangeAll();
        await dossierPage.sleep(500);
        await subscribe.clickArrowByChapterName('Ch3');
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByPageName('ch3-p1');
        await dossierPage.sleep(500);
        since('Check box status of ch3-p1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('ch3-p1'))
            .toBe('true');
        await subscribe.clickArrowByChapterName('Chapter 2');
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByPageName('ch2-p1');
        since('Check box status of ch2-p1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('ch2-p1'))
            .toBe('true');
        await subscribe.clickCheckboxByPageName('ch2-p3');
        await dossierPage.sleep(500);
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79674', 'RangeSetting 3', { tolerance: 0.3 });
        await dossierPage.sleep(500);
        since('Check box status of ch2-p3 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('ch2-p3'))
            .toBe('true');
        await subscribe.clickRangeDropdown();
        await subscribe.selectSchedule('On Database Load');
        await dossierPage.sleep(1000);
        await subscribe.inputNote('Create PDF Subscription 3');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        // Check the modified settings
        await takeScreenshotByElement(subscribe.getSubscriptionPanel(), 'TC79674', 'Auto PDF Subscription 3', {
            tolerance: 0.3,
        });
        await dossierPage.sleep(1000);
        //await subscribe.createSubscription();
        await subscribe.createSubscription();
        await dossierPage.sleep(3000);
        await subscribe.waitForLoadingButtonToDisappear();

        await dossierPage.goToLibrary();
    });

    it('[TC79675] Manage PDF subscription from info window', async () => {
        // Open info window
        await libraryPage.moveDossierIntoViewPort(dossier_PDF.name);
        await libraryPage.openDossierInfoWindow(dossier_PDF.name);
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC79675',
            'Default view of manage subscription',
            { tolerance: 0.5 }
        );

        // Unsubscribe Auto_Subscription 2
        await subscribe.clickSwitchRight();
        await infoWindow.sleep(1000);
        await subscribe.clickUnsubscribe();
        await infoWindow.sleep(1000);
        await subscribe.clickUnsubscribeYes();
        await infoWindow.sleep(1000);
        // await subscribe.clickSwitchRight();

        // Edit subscriptions
        await subscribe.clickInfoWindowEdit();
        await infoWindow.sleep(5000);
        await subscribe.inputName('Auto_Subscription_PDF 3_InfoWindowModified');
        await dossierPage.sleep(1000);
        await subscribe.inputNote('Modify Auto_Subscription_PDF 3 in Info Window');
        await infoWindow.sleep(1000);
        // Modify exporting range
        await subscribe.clickRangeDropdown();
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByChapterName('Chapter 1');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79675', 'Range_CheckChapter1', { tolerance: 0.3 });
        await dossierPage.sleep(500);
        since('Check box status of Chapter 1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('Chapter 1'))
            .toBe('true');
        await subscribe.clickArrowByChapterName('Chapter 2');
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByPageName('ch2-p2');
        since('Check box status of ch2-p1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('ch2-p2'))
            .toBe('true');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79675', 'RangeSetting 3_Modified', {
            tolerance: 0.3,
        });
        await subscribe.clickRangeDropdown();
        // Modify PDF Settings
        await subscribe.openPDFSettingsMenu();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(subscribe.getInfoWindowPDFSettingsPanel(), 'TC79675', '(Original) PDF Settings', {
            tolerance: 0.3,
        });
        await pdfExportWindow.selectDetailLevel('Each visualization separately');
        await pdfExportWindow.selectGridSettings('Scale to page width');
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.selectFilterSummary('Filter summary on each PDF page');
        await takeScreenshotByElement(subscribe.getInfoWindowPDFSettingsPanel(), 'TC79675', '(Modified) PDF Settings', {
            tolerance: 0.3,
        });
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await subscribe.clickSend();
        await takeScreenshotByElement(subscribe.getInfoWindowEditPanel(), 'TC79675', 'Modified PDF Subscription 3', {
            tolerance: 0.3,
        });
        await subscribe.clickSave();
        await infoWindow.sleep(5000);

        // Check application id in the request post data
        const postDataEdit = subscribe.getRequestPostData(mockedEditSubscriptionRequest.calls[0]);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postDataEdit.delivery.applicationId)
             .toBe(defaultAppID);
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC79675',
            'Check PDF Subscriptions in Info Window',
            { tolerance: 0.3 }
        );
        await subscribe.closeSubscribe();
    });

    it('[TC97317] Change application, create and check new subscription', async () => {    
        await dossierPage.openCustomAppById({ id: customAppID });
        await libraryPage.openDossier(dossier_PDF.name)
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        // Create subscription and check application ID
        await subscribe.inputName('Auto_Subscription_CheckCustomAppID');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Auto_Bookmark_CheckCustomAppID');
        await subscribe.selectSchedule('Books Closed');
        await dossierPage.sleep(1000);
        await subscribe.inputNote('CheckCustomAppID');
        await dossierPage.sleep(1000);
        await subscribe.clickSend();
        await dossierPage.sleep(1000);
        await subscribe.createSubscription();
        await dossierPage.sleep(5000);
        await subscribe.waitForLoadingButtonToDisappear();
        // Check application id in the request post data
        const postData = subscribe.getRequestPostData(mockedSubscribeRequest.calls[0]);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postData.delivery.applicationId)
             .toBe(customAppID);
        await dossierPage.goToLibrary();

        // Check application ID from info window
        await libraryPage.moveDossierIntoViewPort(dossier_PDF.name);
        await libraryPage.openDossierInfoWindow(dossier_PDF.name);
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await subscribe.clickInfoWindowEdit();
        await infoWindow.sleep(5000);
        await subscribe.inputNote('Edit in Info Window'); 
        await infoWindow.sleep(1000);
        await subscribe.clickSave();
        await infoWindow.sleep(5000);
        // Check application id in the request post data
        const postDataInfoWindowEdit = subscribe.getRequestPostData(mockedEditSubscriptionRequest.calls[0]);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
             .expect(postDataInfoWindowEdit.delivery.applicationId)
             .toBe(customAppID);
        await subscribe.closeSubscribe();
        
        // Check application ID from sidebar
        await dossierPage.goToLibrary();
        await dossierPage.sleep(3000);
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT); //wait for subscription api returned
        await subscribe.hoverSubscription('Auto_Subscription_CheckCustomAppID');
        await subscribe.clickEditButtonInSidebar('Auto_Subscription_CheckCustomAppID');
        await subscribe.inputName('Auto_Subscription_CheckCustomAppID_update');
        await subscribe.clickSidebarSave();
        // Check application id in the request post data
        const postDataSidebarEdit = subscribe.getRequestPostData(mockedEditSubscriptionRequest.calls[0]);
        since('The application id is supposed to be #{expected}, instead we have #{actual}.')
              .expect(postDataSidebarEdit.delivery.applicationId)
              .toBe(customAppID);
        await dossierPage.sleep(1000);
        await subscribe.clickSidebarUnsubscribe('Auto_Subscription_CheckCustomAppID_update');
        await subscribe.clickUnsubscribeYes();
        await dossierPage.sleep(1000);
    });

    it('[TC79676] Manage PDF subscription from sidebar', async () => {
        // await dossierPage.goToLibrary();
        // Open Subscriptions in sidebar
        // await dossierPage.sleep(3000);
        // await libraryPage.clickLibraryIcon();
        // await sidebar.openSubscriptions();
        // await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT); //wait for subscription api returned
        await takeScreenshot('TC79676', 'Check subscription list in sidebar_before manipulation', { tolerance: 0.3 });
        // Modify Auto_Subscription 1
        await subscribe.hoverSubscription('Auto_Subscription_PDF 1');
        await subscribe.clickEditButtonInSidebar('Auto_Subscription_PDF 1');
        // await dossierPage.sleep(1000);
        // Modify range setting
        await subscribe.clickRangeDropdown();
        await subscribe.clickArrowByChapterName('Chapter 1');
        await dossierPage.sleep(500);
        await subscribe.clickCheckboxByPageName('ch1-p1');
        since('Check box status of ch1-p1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('ch1-p1'))
            .toBe('false');
        since('Check box status of Chapter1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('Chapter 1'))
            .toBe('false');
        await takeScreenshotByElement(subscribe.getRangePanel(), 'TC79676', 'RangeSetting 1_Modified', {
            tolerance: 0.3,
        });
        await subscribe.clickRangeDropdown();
        await subscribe.openPDFSettingsMenu();
        await infoWindow.sleep(1000);
        await takeScreenshotByElement(
            subscribe.getSidebarPDFSettingsPanel(),
            'TC79676',
            '(Original) PDF Settings for PDF subscription 1',
            { tolerance: 0.3 }
        );
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.toggleHeaderCheckBox();
        await pdfExportWindow.selectFilterSummary('All filters after each chapter');
        await takeScreenshotByElement(
            subscribe.getSidebarPDFSettingsPanel(),
            'TC79676',
            '(Modified) PDF Settings for PDF subscription 1',
            { tolerance: 0.3 }
        );
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await subscribe.clickSidebarSave();
        await dossierPage.sleep(3000);
         // Check application id in the request post data
         const postDataEdit = subscribe.getRequestPostData(mockedEditSubscriptionRequest.calls[0]);
         since('The application id is supposed to be #{expected}, instead we have #{actual}.')
              .expect(postDataEdit.delivery.applicationId)
              .toBe(defaultAppID);
        await libraryPage.clickLibraryIcon();
        // Check modified settings
        await subscribe.hoverSubscription('Auto_Subscription_PDF 3_InfoWindowModified');
        await subscribe.clickEditButtonInSidebar('Auto_Subscription_PDF 3_InfoWindowModified');
        await subscribe.openPDFSettingsMenu();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(
            subscribe.getSidebarPDFSettingsPanel(),
            'TC79676',
            'Check PDF Settings for PDF subscription 3',
            { tolerance: 0.3 }
        );
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await subscribe.clickSidebarCancel();
        await dossierPage.sleep(1000);
        await subscribe.hoverSubscription('Auto_Subscription_PDF 1');
        await dossierPage.sleep(2000);
        await subscribe.clickEditButtonInSidebar('Auto_Subscription_PDF 1');
        await subscribe.openPDFSettingsMenu();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(
            subscribe.getSidebarPDFSettingsPanel(),
            'TC79676',
            'Check modified PDF Settings for PDF subscription 1',
            { tolerance: 0.3 }
        );
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await subscribe.clickSidebarCancel();
        // Unsubscribe below subscriptions
        await subscribe.clickSidebarUnsubscribe('Auto_Subscription_PDF 1');
        await subscribe.clickUnsubscribeYes();
        await dossierPage.sleep(1000);
        await subscribe.clickSidebarUnsubscribe('Auto_Subscription_PDF 3_InfoWindowModified');
        await subscribe.clickUnsubscribeYes();
        await dossierPage.sleep(1000);
        await takeScreenshot('TC79676', 'Check subscription list in sidebar_after manipulation', { tolerance: 0.3 });
        await dossierPage.goToLibrary();
    });


    
});
