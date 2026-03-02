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
    } = browsers.pageObj1;

    let mockedPDFRequest;

    const dossier_1cha1page = {
        id: '00B756BE45186A7D6BDE8FB52CFA9D87',
        name: '1cha1page',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_noviz = {
        id: '694F808C4950ABF9931CEF8B695DEFFA',
        name: 'noviz',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
 
    const dossier_Auto_Export_2 = {
        id: 'C93B91A441AA8CC01BA57BAFA4DA9295',
        name: 'Auto_Export_2',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
 
    const dossier_Auto_TitleBarExport = {
        id: '06E7258048E33F77B3CECF88CE98DE99',
        name: 'Auto_TitleBarExport',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await resetDossierState({
            credentials: {
                username: 'auto_frontend',
                password: 'newman1#',
            },
            dossier: dossier_1cha1page,
        });
        await loginPage.login(exportFrontendUser);
        mockedPDFRequest = await browser.mock('http://**/pdf');
    });

    afterEach(async() =>{
        mockedPDFRequest.clear();
    });

    it('[TC99171_1] Set PDF Margin in Library Authoring', async () => {
        await libraryPage.openUrl(dossier_1cha1page.project.id, dossier_1cha1page.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        const dashboardPropertiesExportToPDFDialog = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'TC99171_1-MarginSettings_original',
            1
        );
        await libraryAuthoringPDFExport.clickReactAdjustMarginCheckbox();
        await libraryAuthoringPDFExport.setReactMarginLeft(0.66);
        await libraryAuthoringPDFExport.setReactMarginRight(0.77);
        await libraryAuthoringPDFExport.setReactMarginTop(0.88);
        await libraryAuthoringPDFExport.setReactMarginBottom(0.99);
        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'TC99171_1-MarginSettings_modified',
            1
        );
        await libraryAuthoringPDFExport.clickOKButton();
        await dossierAuthoringPage.clickSaveDossierButton(dossier_1cha1page.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
        
    });

    it('[TC99171_2] Check saved PDF Margin in Library Consumption from Info Window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_1cha1page.name);
        await libraryPage.openDossierInfoWindow(dossier_1cha1page.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC99171_2-InfoWindow_CheckPDFExportSettings',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.sleep(1000);
        const postData = pdfExportWindow.getRequestPostData(mockedPDFRequest.calls[0]);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginTop).toBe(0.88);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginRight).toBe(0.77);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginBottom).toBe(0.99);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginLeft).toBe(0.66);
        console.log(postData);

        await dossierPage.goToLibrary();
        
    });

    it('[TC99171_3] Check saved PDF Margin and Update them in Library Consumption from Share Panel', async () => {
        await libraryPage.openDossier(dossier_1cha1page.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        const exportPDFSettingsWindow_savedValue = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_savedValue,
            'T4969/export/pdf',
            'TC99171_3-Share_CheckSavedMarginValue',
            1
        );
        await pdfExportWindow.setMarginTop(1.88);
        await pdfExportWindow.setMarginRight(1.77);
        await pdfExportWindow.setMarginBottom(1.99);
        await pdfExportWindow.setMarginLeft(1.66);
        await dossierPage.sleep(1000);
        const exportPDFSettingsWindow_updatedValue = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow_updatedValue,
            'T4969/export/pdf',
            'TC99171_3-Share_CheckUpdatedMarginValue',
            1
        );
        await pdfExportWindow.exportSubmitDossier();
        await dossierPage.sleep(2000);
        const postData = pdfExportWindow.getRequestPostData(mockedPDFRequest.calls[0]);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginTop).toBe(1.88);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginRight).toBe(1.77);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginBottom).toBe(1.99);
        since('The marginTop is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.marginLeft).toBe(1.66);
        console.log(postData);
        await dossierPage.goToLibrary();
        
    });

    it('[TC99171_4] Select different paper sizes/orientations and check corresponding margin value', async () => {
        await libraryPage.openDossier(dossier_noviz.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.clickAdjuectMarginCheckbox();

        
        const marginOption_Letter = pdfExportWindow.getMarginOption();
        await checkElementByImageComparison(
            marginOption_Letter,
            'T4969/export/pdf',
            'TC99171_4-Share_marginOption_Letter',
            1
        );

        await pdfExportWindow.selectPortraitOrientation();
        const marginOption_Letter_Portrait = pdfExportWindow.getMarginOption();
        await checkElementByImageComparison(
            marginOption_Letter_Portrait,
            'T4969/export/pdf',
            'TC99171_4-Share_marginOption_Letter_Portrait',
            1
        );

        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.selectPageSize('A0 33.11" x 46.81"');
        await dossierPage.sleep(1000);
        const marginOption_A0 = pdfExportWindow.getMarginOption();
        await checkElementByImageComparison(
            marginOption_A0,
            'T4969/export/pdf',
            'TC99171_4-Share_marginOption_A0',
            1
        );

        await pdfExportWindow.selectPageSize('Statement 5.5" x 8.5"');
        await dossierPage.sleep(1000);
        const marginOption_Statement = pdfExportWindow.getMarginOption();
        await checkElementByImageComparison(
            marginOption_Statement,
            'T4969/export/pdf',
            'TC99171_4-Share_marginOption_Statement',
            1
        );

        await dossierPage.goToLibrary();

    
    });

    it('[TC99171_5] Set valid and invalid margin value and check the frontend behavior', async () => {
        await libraryPage.openDossier(dossier_noviz.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.clickAdjuectMarginCheckbox();
        await pdfExportWindow.setMarginTop(0.11);
        await pdfExportWindow.setMarginRight(0.22);
        await pdfExportWindow.setMarginBottom(0.33);
        await pdfExportWindow.setMarginLeft(0.44);
        const marginOption_Letter_ValidValue = pdfExportWindow.getMarginOption();
        await pdfExportWindow.selectPageSize('A0 33.11" x 46.81"');
        await checkElementByImageComparison(
            marginOption_Letter_ValidValue,
            'T4969/export/pdf',
            'TC99171_5-marginOption_Letter_ValidValue',
            1
        );

        await pdfExportWindow.selectPageSize('A4 8.27" x 11.69"');
        await pdfExportWindow.setMarginTop(1.11);
        await pdfExportWindow.setMarginRight(2.22);
        await pdfExportWindow.setMarginBottom(3.33);
        await pdfExportWindow.setMarginLeft(4.44);
        const marginOption_Statement_invalidValue = pdfExportWindow.getMarginOption();
        await pdfExportWindow.selectPageSize('Statement 5.5" x 8.5"');
        await checkElementByImageComparison(
            marginOption_Statement_invalidValue,
            'T4969/export/pdf',
            'TC99171_5-marginOption_Statement_invalidValue',
            1
        );

        await pdfExportWindow.setMarginTop(-0.11);
        await pdfExportWindow.setMarginRight(-0.22);
        await pdfExportWindow.setMarginBottom(-0.33);
        await pdfExportWindow.setMarginLeft(-0.44);
        const marginOption_Statement_negValue = pdfExportWindow.getMarginOption();
        await pdfExportWindow.selectPageSize('Statement 5.5" x 8.5"');
        await checkElementByImageComparison(
            marginOption_Statement_negValue,
            'T4969/export/pdf',
            'TC99171_5-marginOption_Statement_negValue',
            1
        );

        await dossierPage.sleep(1000);
        await dossierPage.goToLibrary();
    });

    it('[F6494_1] Set Customized PDF Header and Footer in Library Authoring', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openUrl(dossier_Auto_Export_2.project.id, dossier_Auto_Export_2.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        const dashboardPropertiesExportToPDFDialog = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'F6494_1-ExportSettings_original',
            1
        );

        // Lock footer
        await libraryAuthoringPDFExport.clickReactLockButton('header');

        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'F6494_1-ExportSettings_modified',
            1
        );
        await libraryAuthoringPDFExport.clickOKButton();
        await dossierAuthoringPage.clickSaveDossierButton(dossier_Auto_Export_2.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
        
    });

    it('[F6494_2] Check Locked PDF Header and Footer in Library Consumption from Info Window', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Export_2.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Export_2.name);
        await infoWindow.openExportPDFSettingsWindow();
        const exportPDFPageInfo = pdfExportWindow.getExportPageInfo();
        await checkElementByImageComparison(
            exportPDFPageInfo,
            'T4969/export/pdf',
            'F6494_2-InfoWindow_CheckPDFPageInfo',
            1
        );
        await infoWindow.sleep(1000);
        await dossierPage.goToLibrary();
        
    });

    it('[F6494_3] Check Locked PDF Header and Footer in Library Consumption from Share Panel', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openDossier(dossier_Auto_Export_2.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        const exportPDFPageInfo = pdfExportWindow.getExportPageInfo();
        await checkElementByImageComparison(
            exportPDFPageInfo,
            'T4969/export/pdf',
            'F6494_3-Share_CheckPDFPageInfo',
            1
        );
        await dossierPage.goToLibrary();
    });

    it('[F6494_4] Check Locked PDF Header and Footer in Library Consumption from Visualization', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openDossier(dossier_Auto_Export_2.name);
        await dossierPage.waitForDossierLoading();
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Pie');
        await dossierPage.sleep(1000);
        const exportPDFDisplayOption = pdfExportWindow.getMojoPDFExportSettingsEditor();
        await checkElementByImageComparison(
            exportPDFDisplayOption,
            'T4969/export/pdf',
            'F6494_4-Viz_CheckPDFDisplayOption',
            1
        );
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.goToLibrary();
    });

    it('[F41877] Export visualization to PDF from title bar export button', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openDossier(dossier_Auto_TitleBarExport.name);
        await dossierPage.waitForDossierLoading();
        await pdfExportWindow.clickTitlebarExportPDFButton('Grid');
        await dossierPage.sleep(1000);
        await pdfExportWindow.tabForward(9);
        await dossierPage.sleep(1000);
        await pdfExportWindow.enter();
        await dossierPage.sleep(3000);
        // Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPDFRequest.calls[0]);
        await libraryPage.sleep(2000);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary)
            .toBe('PAGE');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage)
            .toBe(true);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages)
            .toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter)
            .toBe(1);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader)
            .toBe(1);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview)
            .toBe(false);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation)
            .toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight)
            .toBe(8.5);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption)
            .toBe('DEFAULT');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth)
            .toBe(11);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader)
            .toBe(true);
        await dossierPage.goToLibrary();
    });


});