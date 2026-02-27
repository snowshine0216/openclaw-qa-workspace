import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import path from 'path';
import { info } from 'console';
//export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import '../../../utils/toMatchPdf.ts';
const downloadDirectory = 'downloads';

describe('LibraryExportToPDF - Check Default Settings', () => {
    let { loginPage, libraryPage, share, dossierPage, pdfExportWindow, toc, libraryAuthoringPage, libraryAuthoringPDFExport, autoDashboard, infoWindow, baseVisualization, subscribe, sidebar } = browsers.pageObj1;

    const dossier_Auto_Grids = {
        id: 'EB8C2D4842DCEB6537EC59A5D677025E',
        name: 'Auto_Grids',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Mix_defaultExport  = {
        id: '288676034953F5E1DA5E81AA7D9F0EC9',
        name: 'Auto_Mix_defaultExport',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Mix_defaultExport2  = {
        id: '61083C3240AA094E93EC8BB46742302D',
        name: 'Auto_Mix_defaultExport2',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Mix_defaultExport3  = {
        id: '2265D6D04977277AB64527AF586CFA2E',
        name: 'Auto_Mix_defaultExport3',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Auto_Mix_defaultExport4  = {
        id: '88819E80401ACF9B37EB6483C35CBD47',
        name: 'Auto_Mix_defaultExport4',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login(exportFrontendUser);
        await resetBookmarks({
            credentials: {username: 'auto_frontend', password: 'newman1#'},
            dossier: dossier_Auto_Mix_defaultExport3
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95175_11] InfoWindow_Do manipulations and check export dialog', async () => {
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport4.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport4.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_11-InfoWindow_CheckPDFExportSettings_default_beforeManipulation',
            1
        );
        await pdfExportWindow.selectDetailLevel('All visualizations together');
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.toggleFilterSummaryCheckBox();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_11-InfoWindow_CheckPDFExportSettings_update_1',
            1
        );
        await pdfExportWindow.close();
        
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_11-InfoWindow_CheckPDFExportSettings_update_2', // update_1 and update_2 should be the same
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport4.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_update = 'resources/TC95175_11/infoWindow_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_update, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));
        await infoWindow.close();
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport4.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport4.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_11-InfoWindow_CheckPDFExportSettings_default_afterManipulation', // should be default value
            1
        );
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_default = 'resources/TC95175_11/infoWindow_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_default, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));
        await dossierPage.goToLibrary();


    });

    it('[TC95175_12] SharePanel_Do manipulations and check export dialog', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix_defaultExport4,
        });
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport4.project.id, dossier_Auto_Mix_defaultExport4.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_12-Share_CheckPDFExportSettings_default_beforeManipulation',
            1
        );
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.toggleFilterSummaryCheckBox()
        await pdfExportWindow.selectFilterSummary('Both');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_12-Share_CheckPDFExportSettings_update_1',
            1
        );
        await share.openExportPDFSettingsWindow();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_12-Share_CheckPDFExportSettings_update_2',
            1
        );
        await share.openExportPDFSettingsWindow();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'non vizs' });
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_12-Share_CheckPDFExportSettings_update_3',
            1
        );
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport4.name}.pdf`);
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_update = 'resources/TC95175_12/shareMenu_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_update, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));  
    });  

    it('[TC95175_13] VizMenu_Do manipulations and check export dialog', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix_defaultExport2,
        });
        await deleteFile({name: dossier_Auto_Mix_defaultExport2.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport2.project.id, dossier_Auto_Mix_defaultExport2.id); 
        await dossierPage.waitForDossierLoading();
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Bar');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_13-VizMenu_CheckPDFExportSettings_default_beforeManipulation',
            1
        );
        await pdfExportWindow.selectMojoPageSize('Ledger 11" x 17"');
        await pdfExportWindow.selectMojoOrientation('Portrait');
        await pdfExportWindow.selectMojoFilterSummary('Filter summary on each PDF page');
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_13-VizMenu_CheckPDFExportSettings_update',
            1
        );
        await pdfExportWindow.cancelExportSettingsVisualization();
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Bar');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_13-VizMenu_CheckPDFExportSettings_default_afterManipulation',
            1
        );
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(1000);
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport2.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_vizMenu_default = 'resources/TC95175_13/vizMenu_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_vizMenu_default, `${dossier_Auto_Mix_defaultExport2.name}.pdf`));


    });
    
    xit('[TC95175_14] Create PDF subscription for dashboard with default export settings', async () => {
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport3.project.id, dossier_Auto_Mix_defaultExport3.id);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        // Create PDF subscription
        await subscribe.inputName('Auto_Subscription_PDF 1');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Auto_Subscription_PDF 1');
        await checkElementByImageComparison(
            subscribe.getSubscriptionPanel(),
            'T4969/subscription',
            'TC95175_14-Subscription_defaultSettings',
            1
        );

        await subscribe.selectFormat('PDF');
        // Set exporting range
        await subscribe.clickRangeDropdown();
        await dossierPage.sleep(1000);
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getAllCheckboxStatus())
            .toBe('true');
        await subscribe.clickRangeAll();
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getAllCheckboxStatus())
            .toBe('false');
        await dossierPage.sleep(500);
        await subscribe.clickOnlyByChapterName('Chapter 1');
        since('Check box status of Chapter 1 should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getRangeCheckboxStatus('Chapter 1'))
            .toBe('true');
        await dossierPage.sleep(500);
        await subscribe.clickRangeAll();
        await dossierPage.sleep(500);
        await subscribe.clickRangeAll();
        since('Check box status of (All) should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getAllCheckboxStatus())
            .toBe('true');
        await dossierPage.sleep(500);
        await subscribe.clickRangeDropdown();
        // Check PDF settings
        await subscribe.openPDFSettingsMenu();
        await checkElementByImageComparison(
            subscribe.getPDFSettingsPanel(),
            'T4969/subscription',
            'TC95175_14-Subscription_defaultPDFSettings',
            1
        );
        await dossierPage.sleep(1000);
        await pdfExportWindow.selectPageSize('A4 8.27" x 11.69"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.toggleHeaderCheckBox();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/subscription',
            'TC95175_14-Subscription_ModifiedPDFSettings',
            1
        );
        await subscribe.exitPDFSettingsMenu();
        await dossierPage.sleep(1000);
        await subscribe.searchRecipientByName('Administrator');
        await subscribe.selectRecipients(['Administrator']);
        await subscribe.createSubscription();
        await dossierPage.sleep(5000);

        // Create second subscription and check default PDF settings.
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Auto_Subscription_PDF 2');
        await dossierPage.sleep(1000);
        await subscribe.selectBookmark('Include current view as a bookmark');
        await subscribe.selectFormat('PDF');
        await subscribe.openPDFSettingsMenu();
        await checkElementByImageComparison(
            subscribe.getPDFSettingsPanel(),
            'T4969/subscription',
            'TC95175_14-Subscription_defaultPDFSettings_secondCheck',
            1
        );
        await subscribe.exitPDFSettingsMenu();
        await dossierPage.sleep(1000);
        await subscribe.searchRecipientByName('Administrator');
        await subscribe.selectRecipients(['Administrator']);
        await subscribe.createSubscription();
        await dossierPage.sleep(5000);

        await dossierPage.goToLibrary();
    }); 

    xit('[TC95175_15] Check PDF settings for subscription from info window', async () => {
        await libraryPage.clickLibraryIcon();
        // Open info window
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport3.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport3.name);
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);
        // Open Manager Subscriptions Window
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await subscribe.clickInfoWindowEdit();
        await infoWindow.sleep(5000);
        await subscribe.openPDFSettingsMenu();
        await infoWindow.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getInfoWindowPDFSettingsPanel(),
            'T4969/subscription',
            'TC95175_15-Subscription_PDFSettingsForSubscription1',
            1
        );
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await subscribe.clickSave();
        await infoWindow.sleep(5000);
        await subscribe.closeSubscribe();
        
    });

    xit('[TC95175_16] Check PDF settings for subscription from sidebar', async () => {
        await dossierPage.goToLibrary();
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        // await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT); //wait for subscription api returned
        await subscribe.hoverSubscription('Auto_Subscription_PDF 2');
        await subscribe.clickEditButtonInSidebar('Auto_Subscription_PDF 2');
        await dossierPage.sleep(1000);
        await subscribe.openPDFSettingsMenu();
        await infoWindow.sleep(1000);
        await checkElementByImageComparison(
            subscribe.getSidebarPDFSettingsPanel(),
            'T4969/subscription',
            'TC95175_16-Subscription_PDFSettingsForSubscription2',
            1
        );
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await subscribe.clickSidebarSave();
        await dossierPage.sleep(1000);
        await dossierPage.goToLibrary();
    });

});
