import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import path from 'path';
import { info } from 'console';
//export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import '../../../utils/toMatchPdf.ts';
const downloadDirectory = 'downloads';

describe('LibraryExportToPDF - Check Default Settings', () => {
    let { loginPage, libraryPage, share, dossierPage, pdfExportWindow, toc, libraryAuthoringPage, libraryAuthoringPDFExport, autoDashboard, infoWindow, baseVisualization, librarySearch, fullSearch } = browsers.pageObj1;

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
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95175_6] Export dossier with default settings from info window and share panel, and viz menu', async () => {
        //Export dashboard with default settings from info window
        await deleteFile({name: dossier_Auto_Grids.name,fileType:'.pdf'});
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Grids.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Grids.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_6-InfoWindow_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Grids.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_default = 'resources/TC95175_6/infoWindow_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_default, `${dossier_Auto_Grids.name}.pdf`));
        await dossierPage.goToLibrary();

        //Export dashboard with default settings from viz menu  
        await deleteFile({name: dossier_Auto_Grids.name,fileType:'.pdf'});
        await libraryPage.openDossier(dossier_Auto_Grids.name);
        await dossierPage.waitForDossierLoading();
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Compound Grid');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_6-VizMenu_CheckPDFExportSettings',
            1
        );
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(1000);
        //filepath = path.join(downloadDirectory, `${dossier_Auto_Grids.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_vizMenu_default = 'resources/TC95175_6/vizMenu_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_vizMenu_default, `${dossier_Auto_Grids.name}.pdf`));
        await dossierPage.goToLibrary();     
        
        //Export dashboard with default settings from share menu
        await deleteFile({name: dossier_Auto_Grids.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Grids.project.id, dossier_Auto_Grids.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_6-Share_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_default = 'resources/TC95175_6/shareMenu_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_default, `${dossier_Auto_Grids.name}.pdf`));
        await dossierPage.goToLibrary();   

    });

    it('[TC95175_7] Modify export settings in info Window and export from share panel (default)', async () => {
        await dossierPage.goToLibrary(); 
        await deleteFile({name: dossier_Auto_Mix_defaultExport.name,fileType:'.pdf'});
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport.name);
        await infoWindow.openExportPDFSettingsWindow();
        const pdfExportDialog = infoWindow.getInfoWindowExportDetails();

        await pdfExportWindow.selectDetailLevel('Both');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.togglePageNumbersCheckBox();
        await checkElementByImageComparison(
            pdfExportDialog,
           'T4969/export/pdf',
           'TC95175_7-InfoWindow_CheckPDFExportSettings_update',
           1
       );
        await infoWindow.close();
        await dossierPage.goToLibrary();

        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport.project.id, dossier_Auto_Mix_defaultExport.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_7-Share_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport.name}.pdf`);
        await waitForFileExists(filepath, 50000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_default = 'resources/TC95175_7/shareMenu_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_default, `${dossier_Auto_Mix_defaultExport.name}.pdf`));
        await dossierPage.goToLibrary();
        
    });

    it('[TC95175_8] Modify export settings in share panel and export from info window (default)', async () => {
        await deleteFile({name: dossier_Auto_Mix_defaultExport2.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport2.project.id, dossier_Auto_Mix_defaultExport2.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.selectFilterSummary('Both');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.toggleTableofContentsCheckBox();
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC95175_8-Share_CheckPDFExportSettings_update',
            1
        );
        await dossierPage.goToLibrary();
        await dossierPage.sleep(1000);
        await dossierPage.goToLibrary();
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport2.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport2.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_8-InfoWindow_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport2.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_default = 'resources/TC95175_8/infoWindow_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_default, `${dossier_Auto_Mix_defaultExport2.name}.pdf`));
        await dossierPage.goToLibrary();
        
    });

    it('[TC95175_9] Modify export settings and export to PDF in info window and share panel separately (not default)', async () => {
        await dossierPage.goToLibrary();
        await deleteFile({name: dossier_Auto_Mix_defaultExport3.name,fileType:'.pdf'});
        //Modify export settings in info window and export
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport3.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport3.name);
        await infoWindow.openExportPDFSettingsWindow();
        const pdfExportDialog = infoWindow.getInfoWindowExportDetails();
        await pdfExportWindow.selectDetailLevel('All visualizations together');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.toggleHeaderCheckBox();
        await pdfExportWindow.togglePageNumbersCheckBox();
        await checkElementByImageComparison(
            pdfExportDialog,
           'T4969/export/pdf',
           'TC95175_9-InfoWindow_CheckPDFExportSettings_update',
           1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport3.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_update = 'resources/TC95175_9/infoWindow_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_update, `${dossier_Auto_Mix_defaultExport3.name}.pdf`));
        await infoWindow.close();
        await dossierPage.goToLibrary();

        // Export in share panel with default settings    
        await deleteFile({name: dossier_Auto_Mix_defaultExport3.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport3.project.id, dossier_Auto_Mix_defaultExport3.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC95175_9-Share_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_default = 'resources/TC95175_9/shareMenu_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_default, `${dossier_Auto_Mix_defaultExport3.name}.pdf`));        
        
        // Modify export settings in share panel and export
        await deleteFile({name: dossier_Auto_Mix_defaultExport3.name,fileType:'.pdf'});
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.selectPageSize('Ledger 11" x 17"');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_9-Share_CheckPDFExportSettings_update',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_update = 'resources/TC95175_9/shareMenu_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_update, `${dossier_Auto_Mix_defaultExport3.name}.pdf`));
        await dossierPage.goToLibrary();
    });

    it('[TC95175_10] Modify export settings and export to PDF in viz menu, share menu, and info window separately  (not default)', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix_defaultExport4,
        });
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport4.project.id, dossier_Auto_Mix_defaultExport4.id); 
        await dossierPage.waitForDossierLoading();
        //await baseVisualization.selectExportToPDFOnVisualizationMenu('Bar');
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Ring');
        await dossierPage.sleep(1000);
        await pdfExportWindow.selectMojoPageSize('Ledger 11" x 17"');
        await pdfExportWindow.selectMojoOrientation('Portrait');
        await pdfExportWindow.toggleMojoShowHeader();
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_10-VizMenu_CheckPDFExportSettings_update',
            1
        );
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(1000);
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_defaultExport4.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_vizMenu_update = 'resources/TC95175_10/vizMenu_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_vizMenu_update, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));

        // Export in share panel with default settings    
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Mix_defaultExport4.project.id, dossier_Auto_Mix_defaultExport4.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC95175_10-Share_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_default = 'resources/TC95175_10/shareMenu_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_default, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));        
        
        // Modify export settings in share panel and export
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.selectPageSize('Ledger 11" x 17"');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_10-Share_CheckPDFExportSettings_update',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu_update = 'resources/TC95175_10/shareMenu_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu_update, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));
        await dossierPage.goToLibrary(); 

        //Export in info window with default settings.
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await dossierPage.goToLibrary();
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport4.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport4.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
           'T4969/export/pdf',
           'TC95175_10-InfoWindow_CheckPDFExportSettings_default',
           1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_default = 'resources/TC95175_10/infoWindow_default';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_default, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));
        await infoWindow.close();

        //Modify export settings in info window and export
        await deleteFile({name: dossier_Auto_Mix_defaultExport4.name,fileType:'.pdf'});
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_defaultExport4.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_defaultExport4.name);
        await infoWindow.openExportPDFSettingsWindow();
        await pdfExportWindow.selectDetailLevel('All visualizations together');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.toggleHeaderCheckBox();
        await pdfExportWindow.togglePageNumbersCheckBox();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
           'T4969/export/pdf',
           'TC95175_10-InfoWindow_CheckPDFExportSettings_update',
           1
        );
        await pdfExportWindow.exportSubmitLibrary();
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_infoWindow_update = 'resources/TC95175_10/infoWindow_update';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_infoWindow_update, `${dossier_Auto_Mix_defaultExport4.name}.pdf`));
        await infoWindow.close();
        await dossierPage.goToLibrary();

    });
});
