import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import { isFileNotEmpty, getFileSize, deleteFile } from '../../../config/folderManagement.js';
import { dossier } from '../../../constants/teams.js';
import { subscribe } from 'diagnostics_channel';

describe('Export - Export Dashboard to PDF', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        csvExportPanel,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
        libraryAuthoringPDFExport,
        libraryAuthoringPage,
        autoDashboard,
        pdfExportWindow,
        dossierAuthoringPage,
        subscriptionDialog,
        userAccount,
    } = browsers.pageObj1;

    let mockedPDFRequest;
 
    const dossier_Auto_Export_0 = {
        id: '3BCFDD604502A5CC60502089D7EF6B2B',
        name: 'Auto_Export_0',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
 
    const dossier_Auto_Export_1 = {
        id: 'AB3F57814B33BFD2467EE0B5F43E5243',
        name: 'Auto_Export_1',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let mockedSubscribeRequest, mockedEditSubscriptionRequest;

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login(exportFrontendUser);
        mockedPDFRequest = await browser.mock('http://**/pdf');
        mockedSubscribeRequest = await browser.mock('http://**/api/subscriptions');
    });

    afterEach(async() =>{
        mockedPDFRequest.clear();
    });

    it('[TC0001] Configure PDF export settings in Library Authoring', async () => {
        await libraryPage.openUrl(dossier_Auto_Export_0.project.id, dossier_Auto_Export_0.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        const dashboardPropertiesExportToPDFDialog = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'TC0001-exportSettings_authoring_original',
            1
        );
        await libraryAuthoringPDFExport.clickReactExpandGridCheckbox();
        await libraryAuthoringPDFExport.clickReactScaleGridCheckbox();

        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'TC0001-exportSettings_authoring_update',
            1
        );
        await libraryAuthoringPDFExport.clickOKButton();
        await dossierAuthoringPage.clickSaveDossierButton(dossier_Auto_Export_0.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
        
    });

    it('[TC0002] Check and modify PDF export settings from Share Dialog', async () => {
        await libraryPage.openDossier(dossier_Auto_Export_0.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        const exportPDFSettingsWindow_savedValue = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_savedValue,
            'T4969/export/pdf',
            'TC0002-Share_CheckSavedSettings',
            1
        );
        await pdfExportWindow.clickExpandGridCheckbox();

        await dossierPage.sleep(1000);
        const exportPDFSettingsWindow_updated = pdfExportWindow.getDossierExportPDFPanel();

        await checkElementByImageComparison(
            exportPDFSettingsWindow_updated,
            'T4969/export/pdf',
            'TC0002-Share_CheckUpdatedSettings',
            1
        );

        await pdfExportWindow.exportSubmitDossier();
        await dossierPage.sleep(2000);
        const postData = pdfExportWindow.getRequestPostData(mockedPDFRequest.calls[0]);
        since('The gridPagingMode is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.gridPagingMode).toBe('none');
        since('The gridContainerFit is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.gridContainerFit).toBeUndefined();
        await dossierPage.goToLibrary();
        
    });

    it('[TC0003] Check and modify PDF export settings from Info Window', async () => { 
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Export_0.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Export_0.name);
        await libraryPage.sleep(2000);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC0003-InfoWindow_CheckSavedSettings',
            1.5
        );

        await pdfExportWindow.clickScaleGridCheckbox();
        await pdfExportWindow.clickExpandGridCheckbox();
        infoWindow.sleep(1000);
        await pdfExportWindow.clickExpandGridCheckbox();
        await libraryPage.sleep(1000);
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC0003-InfoWindow_CheckUpdatedSettings',
            1.5
        );
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.sleep(1000);
        const postData = pdfExportWindow.getRequestPostData(mockedPDFRequest.calls[0]);
        since('The gridPagingMode is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.gridPagingMode).toBe('enlarge');
        since('The gridContainerFit is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.gridContainerFit).toBe('horizontal');

        await dossierPage.goToLibrary();
    });

    it('[TC0004] Check and modify PDF export settings from Subscription Dialog', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'administrator', password: ''});
        await libraryPage.openUrl(dossier_Auto_Export_0.project.id, dossier_Auto_Export_0.id);
        await dossierPage.waitForDossierLoading();
        await dossierPage.isAddToLibraryDisplayed();
        await dossierPage.clickAddToLibraryButton();
        await dossierPage.openShareDropDown();
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(1000);
        await subscriptionDialog.selectFormat('PDF');
        await checkElementByImageComparison(
            subscriptionDialog.getContentSettingsSection(),
            'T4969/export/pdf',
            'TC0004-Subscription_CheckSavedSettings',
            1
        );
        
        await subscriptionDialog.clickExpandGridCheckbox();
        await subscriptionDialog.OpenScheduleOptions();
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed']);
        await subscriptionDialog.clickSendNowCheckbox();
        await checkElementByImageComparison(
            subscriptionDialog.getContentSettingsSection(),
            'T4969/export/pdf',
            'TC0004-Subscription_CheckUpdatedSettings',
            1
        );
        await dossierPage.sleep(1000);
        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(1000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();  
        await dossierPage.goToLibrary();
        const postData = subscriptionDialog.getRequestPostData(mockedSubscribeRequest.calls[0]);
        const exportOptions =  postData.contents[0].personalization.exportToPdfSettings;
        since('The gridPagingMode is supposed to be #{expected}, instead we have #{actual}.')
            .expect(exportOptions.gridPagingMode).toBe('none');
        since('The gridContainerFit is supposed to be #{expected}, instead we have #{actual}.')
            .expect(exportOptions.gridContainerFit).toBe('none');
        
    });


});