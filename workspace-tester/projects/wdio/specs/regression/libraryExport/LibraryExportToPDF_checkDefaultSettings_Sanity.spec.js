import { exportFrontendUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import path from 'path';
import { info } from 'console';
//export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import '../../../utils/toMatchPdf.js';

const baselineDirectory = 'resources';
const downloadDirectory = 'downloads';

describe('LibraryExportToPDF - Check Default Settings', () => {
    let { loginPage, libraryPage, share, dossierPage, pdfExportWindow, toc, libraryAuthoringPage, libraryAuthoringPDFExport, autoDashboard, infoWindow, baseVisualization, librarySearch, fullSearch, dossierAuthoringPage } = browsers.pageObj1;

    const dossier_Auto_Mix_checkDefault = {
        id: 'A5E0596841E9EDAC7DF6C88C035E7EED',
        name: 'Auto_Mix_checkDefault',
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

    it('[TC95175_0] Check PDF Export Settings stored in MD', async () => {
        await resetDossierState({
            credentials: exportFrontendUser,
            dossier: dossier_Auto_Mix_checkDefault,
        });
        await libraryPage.openUrl(dossier_Auto_Mix_checkDefault.project.id, dossier_Auto_Mix_checkDefault.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        const exportPDFSettingsWindow = pdfExportWindow.getDossierExportPDFPanel();
        await checkElementByImageComparison(
            exportPDFSettingsWindow,
            'T4969/export/pdf',
            'TC95175_0-Share_CheckPDFExportSettings_MD',
            1
        );

        await dossierPage.goToLibrary();
        
    });

    it('[TC95175_1] Set Default PDF Export Settings in Library Authoring', async () => {
        await libraryPage.openUrl(dossier_Auto_Mix_checkDefault.project.id, dossier_Auto_Mix_checkDefault.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        const dashboardPropertiesExportToPDFDialog = libraryAuthoringPage.getDashboardPropertiesExportToPDFDialog();
        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'TC95175_1-ExportSettings_original',
            1
        );
        /*
        await libraryAuthoringPDFExport.openRangeDropdown();
        await libraryAuthoringPDFExport.selectPDFRange('Entire dashboard');
        await libraryAuthoringPDFExport.openContentDropdown();
        await libraryAuthoringPDFExport.selectPDFContent('All visualizations together');
        await libraryAuthoringPDFExport.openPaperSizeDropdown();
        await libraryAuthoringPDFExport.selectPaperSize('B5 9.8\" x 6.9\"'); 
        */
        await libraryAuthoringPDFExport.clickReactLandscapeButton();
        /*
        await libraryAuthoringPDFExport.openShowFilterDropdown();
        await libraryAuthoringPDFExport.selectFilteroption('Both');
        */
        await checkElementByImageComparison(
            dashboardPropertiesExportToPDFDialog,
            'T4969/export/pdf',
            'TC95175_1-ExportSettings_modified',
            1
        );
        await libraryAuthoringPDFExport.clickOKButton();
        await dossierAuthoringPage.clickSaveDossierButton(dossier_Auto_Mix_checkDefault.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
        
    });

    it('[TC95175_2] InfoWindow_Check PDF Export Settings in Library Consumption', async () => {
        await deleteFile({name: dossier_Auto_Mix_checkDefault.name,fileType:'.pdf'});
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Mix_checkDefault.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Mix_checkDefault.name);
        await infoWindow.openExportPDFSettingsWindow();
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
            'T4969/export/pdf',
            'TC95175_2-InfoWindow_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_checkDefault.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dossier_Auto_Mix_checkDefault.name}.pdf`));
        await infoWindow.openExportPDFSettingsWindow();
        await pdfExportWindow.selectDetailLevel('Both');
        await pdfExportWindow.selectPageSize('A4 8.27" x 11.69"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.selectFilterSummary('All filters after each chapter');
        await checkElementByImageComparison(
            infoWindow.getInfoWindowExportDetails(),
           'T4969/export/pdf',
           'TC95175_2-InfoWindow_CheckPDFExportSettings_modified',
           1
       );
        await infoWindow.close();
        await dossierPage.goToLibrary();
        
    });

    it('[TC95175_3] Share_Check PDF Export Settings in Library Consumption', async () => {
        await deleteFile({name: dossier_Auto_Mix_checkDefault.name,fileType:'.pdf'});
        await libraryPage.openUrl(dossier_Auto_Mix_checkDefault.project.id, dossier_Auto_Mix_checkDefault.id);
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_3-Share_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_checkDefault.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.selectPortraitOrientation();
        await pdfExportWindow.selectFilterSummary('Filter summary on each PDF page');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC95175_3-Share_CheckPDFExportSettings_modified',
            1
        );
        await dossierPage.goToLibrary();
        
    });

    it('[TC95175_4] VizMenu_Check PDF Export Settings in Library Consumption', async () => {
        await deleteFile({name: dossier_Auto_Mix_checkDefault.name,fileType:'.pdf'});
        await libraryPage.openDossier(dossier_Auto_Mix_checkDefault.name);
        await dossierPage.waitForDossierLoading();
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('grid');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_4-VizMenu_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.selectMojoPageSize('Ledger 11" x 17"');
        await pdfExportWindow.selectMojoOrientation('Portrait');
        await pdfExportWindow.selectMojoFilterSummary('Filter summary on each PDF page');
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC95175_4-VizMenu_CheckPDFExportSettings_modified',
            1
        );
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(1000);
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_checkDefault.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();        
    });

    it('[TC95175_5] SearchWindow_Check Default PDF Export Settings in Library Consumption', async () => {
        await deleteFile({name: dossier_Auto_Mix_checkDefault.name,fileType:'.pdf'});
        await librarySearch.search(dossier_Auto_Mix_checkDefault.name);
        await librarySearch.pressEnter();
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(dossier_Auto_Mix_checkDefault.name);
        await infoWindow.openExportPDFSettingsWindow();
        const pdfExportDialog = infoWindow.getInfoWindowExportDetails();
        await checkElementByImageComparison(
             pdfExportDialog,
            'T4969/export/pdf',
            'TC95175_5_SearchWindow_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_Auto_Mix_checkDefault.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();  
    });
});
