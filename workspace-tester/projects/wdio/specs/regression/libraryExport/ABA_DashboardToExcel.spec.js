import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import path from 'path';
import { reverse } from 'dns';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import { isFileNotEmpty, getFileSize, deleteFile } from '../../../config/folderManagement.js';
import { dossier } from '../../../constants/teams.js';

describe('Export - Export Dashboard to Excel', () => {
    let {
        loginPage,
        libraryPage,
        share,
        infoWindow,
        dossierPage,
        excelExportPanel,
        libraryAuthoringPage,
        libraryAuthoringExcelExport,
        librarySearch,
        fullSearch,
        listView,
        toc,
        hamburgerMenu,
        autoDashboard,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    let mockedExcelRequest;

    const dossier_Auto_ExcelDefault_1 = {
            id: '830F223C472DD2F6DD41B48680DBE3E2',
            name: 'Auto_ExcelDefault_1',
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
                dossier: dossier_Auto_ExcelDefault_1,
            });
            await loginPage.login(exportFrontendUser);
            mockedExcelRequest = await browser.mock('http://**/excel');
        });
    
        beforeEach(async () => {
            await resetDossierState({
                credentials: {
                    username: 'auto_frontend',
                    password: 'newman1#',
                },
                dossier: dossier_Auto_ExcelDefault_1,
            });
        });
    
        afterEach(async() =>{
            mockedExcelRequest.clear();
        });

    it('[F43272_1] Set default Excel export setting in dashboard properties', async () => {
        await libraryPage.openUrl(dossier_Auto_ExcelDefault_1.project.id, dossier_Auto_ExcelDefault_1.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();

        await libraryAuthoringPage.clickExportToExcelTab();
        const dashboardPropertiesExportToExcelDialog = libraryAuthoringPage.getDashboardPropertiesExportToExcelDialog();
        await checkElementByImageComparison(
            dashboardPropertiesExportToExcelDialog,
            'T4969/export/excel',
            'F43272_1-ExportSettings_original',
            1
        );

        await libraryAuthoringExcelExport.clickReactDropdownOption('Range', 'Entire dashboard');
        await libraryAuthoringExcelExport.clickReactDropdownOption('Contents', 'Each visualization separately');
        await libraryAuthoringExcelExport.clickReactShowFiltersCheckbox();
        await checkElementByImageComparison(
            dashboardPropertiesExportToExcelDialog,
            'T4969/export/excel',
            'F43272_1-ExportSettings_modified',
            1
        );
        await libraryAuthoringExcelExport.clickOKButton();
        await dossierAuthoringPage.clickSaveDossierButton(dossier_Auto_ExcelDefault_1.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
    });

        
    it('[F43272_2] Check configured Excel export setting from Info Window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_ExcelDefault_1.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_ExcelDefault_1.name);
        await infoWindow.clickExportExcelButton();
        const exportExcelPanel = excelExportPanel.getExportExcelPanelContent();
        await since('The contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.getExcelContents().getText())
            .toBe('Each visualization separately');
        await checkElementByImageComparison(
            exportExcelPanel,
            'T4969/export/excel',
            'F43272_2-InfoWindow',
            1
        );
        await excelExportPanel.clickInfoWindowExportButton();
        await infoWindow.waitForExportLoadingButtonToDisappear();
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL"); 
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("visualization"); 
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(true);    
        await dossierPage.goToLibrary();
    });

    it('[F43272_3] Check configured Excel export setting, modify and export from Share Panel', async () => {
        await libraryPage.openUrl(dossier_Auto_ExcelDefault_1.project.id, dossier_Auto_ExcelDefault_1.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'F43272_3-Share-initialSetting',
            1
        );
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickOnlyByChapterName('Chapter 2');
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.selectExcelContents('Entire page to worksheet');
        await excelExportPanel.clickShowFiltersCheckbox();
        await dossierPage.sleep(1000);
        const exportExcelSettingsPanel_update = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_update,
            'T4969/export/excel',
            'F43272_3-Share-updatedSetting',
            1
        );
        await dossierPage.sleep(1000);
        await excelExportPanel.clickShareMenuExportButton();
        await excelExportPanel.waitForExportLoadingButtonToDisappear();
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        console.log(postData);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT"); 
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("page"); 
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(false);     
        await dossierPage.goToLibrary();  

    });

    it('[F43272_4] Do manipulations and check Excel export settings from Share Panel', async () => {
        await libraryPage.openUrl(dossier_Auto_ExcelDefault_1.project.id, dossier_Auto_ExcelDefault_1.id);
        await share.openSharePanel();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel,
            'T4969/export/excel',
            'F43272_4-Share-initialSetting',
            1
        );
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickOnlyByChapterName('Chapter 3');
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.selectExcelContents('Entire page to worksheet');
        await excelExportPanel.clickShowFiltersCheckbox();
        await dossierPage.sleep(1000);
        const exportExcelSettingsPanel_update = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_update,
            'T4969/export/excel',
            'F43272_4-Share-updatedSetting',
            1
        );
        // Close Export to Excel dialog and reopen
        await share.clickExportToExcel();
        await share.openExportPDFSettingsWindow();
        await share.clickExportToExcel();
        const exportExcelSettingsPanel_reopen = excelExportPanel.getExportExcelSettingsPanel();
        await checkElementByImageComparison(
            exportExcelSettingsPanel_reopen,
            'T4969/export/excel',
            'F43272_4-Share-updatedSetting_reopen',
            1
        );
        await dossierPage.sleep(1000);
        await excelExportPanel.clickShareMenuExportButton();
        await excelExportPanel.waitForExportLoadingButtonToDisappear();
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        console.log(postData);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL"); 
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("page"); 
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(false);     
        await dossierPage.goToLibrary(); 
    });

    it('[F41877] Export visualization to Excel from title bar export button', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openDossier(dossier_Auto_TitleBarExport.name);
        await dossierPage.waitForDossierLoading();
        await excelExportPanel.clickTitlebarExportExcelButton('Grid');
        await dossierPage.sleep(1000);
        await excelExportPanel.tabForward(3);
        await dossierPage.sleep(1000);
        await excelExportPanel.enter();
        await dossierPage.sleep(2000);
        // Check API request
       const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT"); 
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("visualization"); 
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(false);     
        await dossierPage.goToLibrary();
    });
});