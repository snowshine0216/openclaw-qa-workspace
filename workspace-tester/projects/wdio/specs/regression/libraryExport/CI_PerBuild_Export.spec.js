import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { waitForFileExists } from '../../../utils/compareImage.js';
import { isFileNotEmpty, getFileSize, deleteFile, findDownloadedFile } from '../../../config/folderManagement.js';
import path from 'path';
//export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import '../../../utils/toMatchExcel.js';
import '../../../utils/toMatchPdf.ts';
import { getPdfNum } from '../../../utils/submitPdf.js';

const baselineDirectory = 'resources';
const downloadDirectory = 'downloads';
describe('ExportToPDF - Tanzu Sanity Test', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200
    };

    const dossierOOTB = {
        id: 'D52E71694E46A52879E153A385ECDC2A',
        name: 'OOTB',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const OOTBFile= {
        name: dossierOOTB.name,
        fileType: '.pdf'
    };

    const dossierHRA = {
        id: '4C4BB57C11EB4EFF96550080EF952010',
        name: 'Human Resources Analysis',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const HRAFile = {
        name: dossierHRA.name,
        fileType: '.pdf'
    };

    const dossierORS = {
        id: 'F6252B9211E7B348312C0080EF55DB6A',
        name: 'Office Royale Sales',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const ORSFile = {
        name: dossierORS.name,
        fileType: '.pdf'
    };
    
    const dossierTestExcel = {
        id: '08CE05A9BC434822E0145C90C48987D0',
        name: 'testExcel',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const DTEFile = {
        name: dossierTestExcel.name,
        fileType: '.pdf'
    }

    const RSD = {
        id: 'E7C332E3D344F8ED92F0E5BD2F753ECE',
        name: 'RSD_for_Exporting',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const RSDFile= {
        name: RSD.name,
        fileType: '.pdf'
    };

    const dossierCCM = {
        id: '4480640B11EAF10334D90080EF950B74',
        name: 'Call Center Management',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };


    let baseVisualization, loginPage, dossierPage,libraryPage, share, toc, infoWindow, subscribe, pdfExportWindow, bookmark, sidebar, userAccount, excelExportPanel, mockedExcelRequest, mockedPdfRequest;

    beforeAll(async () => {
        ({
            baseVisualization,
            loginPage,
            dossierPage,
            libraryPage,
            share,
            toc,
            infoWindow,
            subscribe,
            pdfExportWindow,
            bookmark,
            sidebar,
            userAccount,
            excelExportPanel
        } = browsers.pageObj1);

        await setWindowSize(browserWindow);
        await loginPage.login({username: 'export', password: 'newman1#'});
        mockedExcelRequest = await browser.mock('https://**/excel');
        mockedPdfRequest = await browser.mock('https://**/pdf');
    });

    afterEach(async() =>{
        //await dossierPage.goToLibrary();
        mockedExcelRequest.clear();
        mockedPdfRequest.clear();
    });

    it('[TC78192] [Tanzu] Export dossier to Excel from entry Info Window', async() => {
        await deleteFile({name:'Human Resources Analysis',fileType:'.xlsx'});
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierHRA
        });
        await libraryPage.moveDossierIntoViewPort(dossierHRA.name);
        await libraryPage.openDossierInfoWindow(dossierHRA.name);
        await libraryPage.sleep(1000);
        await infoWindow.clickExportExcelButton();
        
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isLibraryExportExcelWindowOpen()).toBe(true);
          
        await excelExportPanel.clickInfoWindowExportButton();
        /*
        const fileName = 'Human Resources Analysis.xlsx';
        const downloadPath = path.join(downloadDirectory, fileName);
        const baselinePath = path.join(baselineDirectory, fileName);
        await waitForFileExists(downloadPath, 15000);

        
        await expect(downloadPath).toMatchExcel(baselinePath, {
            difference: path.join(downloadDirectory, 'Human Resources Analysis_Differences.xlsx'),
        });
        */
        await infoWindow.waitForDownloadComplete({name:'Human Resources Analysis',fileType:'.xlsx'});
        since(`The excel file for ${dossierHRA.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'Human Resources Analysis',fileType:'.xlsx'})).toBe(true);
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        await infoWindow.sleep(1000);
        since('Entire dashboard is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL");
        await dossierPage.goToLibrary();
    });

    it('[TC77680] [Tanzu] Export dossier to Excel from entry Share Panel', async() => {
        await deleteFile({name:'Call Center Management_Open Cases',fileType:'.xlsx'});
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierCCM
        });
        await libraryPage.moveDossierIntoViewPort(dossierCCM.name);
        await libraryPage.openDossier(dossierCCM.name);
        await dossierPage.openShareDropDown();
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        //since('The page contains more than one girds, the grid list display is supposed to be #{expected}, instead we have #{actual}.')
        //    .expect(await excelExportPanel.getGridList().isDisplayed()).toBe(true);
        const vizList = excelExportPanel.getVizList();
        await vizList.waitForExist({ reverse: true });
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC77680', 'Grid list', {tolerance: 0.5});
        await excelExportPanel.selectGrid('Average Call Duration');
        since('There are still grids checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await excelExportPanel.selectGridOnly('Open Cases');
        await excelExportPanel.selectGrid('Average Case Age');
        await excelExportPanel.selectGrid('Employee Details');
        since('There are still grids checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC77680', 'Selected Grids',{tolerance: 0.5});
        await excelExportPanel.clickShareMenuExportButton();
        /*
        const fileName = 'Call Center Management_Open Cases.xlsx';
        const downloadPath = path.join(downloadDirectory, fileName);
        const baselinePath = path.join(baselineDirectory, fileName);
        await waitForFileExists(downloadPath, 10000);
        
        await expect(downloadPath).toMatchExcel(baselinePath, {
            difference: path.join(downloadDirectory, 'Call Center Management_Open Cases_Differences.xlsx'),
        });
        */
        await share.waitForDownloadComplete({name:'Call Center Management_Open Cases',fileType:'.xlsx'});
        since(`The excel file for ${dossierCCM.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'Call Center Management_Open Cases',fileType:'.xlsx'})).toBe(true);
        await libraryPage.sleep(1000);
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('All grids are exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.keys).toEqual(['W304','W83','W181']);
        await dossierPage.goToLibrary();
    });

    it('[TC77681] [Tanzu] Export to Excel - Check grid can be export to excel from visualization', async() => {
        await deleteFile({name:'testExcel',fileType:'.xlsx'});
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierTestExcel
        });
        await libraryPage.moveDossierIntoViewPort(dossierTestExcel.name);
        await libraryPage.openDossier(dossierTestExcel.name);
        await baseVisualization.selectExportToExcelOnVisualizationMenu('Sample Grid');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        await dossierPage.sleep(2000);
        /*
        const fileName = 'testExcel.xlsx';
        const downloadPath = path.join(downloadDirectory, fileName);
        const baselinePath = path.join(baselineDirectory, fileName);
        await waitForFileExists(downloadPath, 10000);
        await expect(downloadPath).toMatchExcel(baselinePath, {
            difference: path.join(downloadDirectory, 'testExcel_Differences.xlsx'),
        });
        */
        since(`The excel file for ${dossierTestExcel.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'testExcel',fileType:'.xlsx'})).toBe(true);
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('The selected grid is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.key).toEqual('W502');
        await dossierPage.goToLibrary();
    });

    it('[TC82727] [Tanzu] Export OOTB dossier to PDF', async() => {
        await deleteFile(OOTBFile);
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierOOTB
        });
        // Open info window of target dossier
        await libraryPage.moveDossierIntoViewPort(dossierOOTB.name);
        await libraryPage.openDossierInfoWindow(dossierOOTB.name);
        // Open PDF export settings from info window and check default export settings
        await infoWindow.openExportPDFSettingsWindow();
        await infoWindow.sleep(1000);
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        // Modify exporting settings and export to PDF
        await pdfExportWindow.selectDetailLevel('Both');
        await pdfExportWindow.selectPageSize('A4 8.27" x 11.69"');
        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.exportSubmitDossier();
        /*
        const filepath = path.join(downloadDirectory, `${dossierOOTB.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dossierOOTB.name}.pdf`));
        */
        await infoWindow.close();
        await infoWindow.waitForDownloadComplete(OOTBFile);
        since(`The pdf file for ${dossierOOTB.name} was not downloaded`)
            .expect(await isFileNotEmpty(OOTBFile)).toBe(true);
        // Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        await infoWindow.sleep(1000);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(true);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(true);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.27);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11.69);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);
        since('The setting of Table of Contents is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeToc).toBe(false);
        const downloadedOOTB = await findDownloadedFile(OOTBFile);
        since('3 pages should be uploaded')
            .expect(await getPdfNum('TC82727', 'OOTB', downloadedOOTB, 'A4'))
            .toBe(4);

    });

    it('[TC77677] [Tanzu] Export dossier to PDF from entry Info Window', async() => {
        await deleteFile(HRAFile);
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierHRA
        });
        // Open info window of target dossier
        await libraryPage.moveDossierIntoViewPort(dossierHRA.name);
        await libraryPage.openDossierInfoWindow(dossierHRA.name);
        // Open PDF export settings from info window and check default export settings
        await infoWindow.openExportPDFSettingsWindow();
        await infoWindow.sleep(1000);
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC77677', 'Default settings', {tolerance: 0.3});
        // Modify exporting settings and export to PDF
        await pdfExportWindow.selectDetailLevel('Both');
        await pdfExportWindow.selectPageSize('A4 8.27" x 11.69"');
        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.selectFilterSummary('All filters after each chapter');
        await takeScreenshotByElement(infoWindow.getInfoWindow(),'TC77677', 'CustomizedSettings', {tolerance: 0.3});
        await pdfExportWindow.exportSubmitDossier();
        await infoWindow.waitForDownloadComplete(HRAFile);
        since(`The pdf file for ${dossierHRA.name} was not downloaded`)
            .expect(await isFileNotEmpty(HRAFile)).toBe(true);
        await infoWindow.close();
        /*
        const filepath = path.join(downloadDirectory, `${HRAFile.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${HRAFile.name}.pdf`));
        */
       // Check API request
       const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
       await infoWindow.sleep(1000);
       since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.filterSummary).toBe('page');
       since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.fitToPage).toBe(true);
       since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.includeDetailedPages).toBe(true);
       since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.includeFooter).toBe(false);
       since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.includeHeader).toBe(true);
       since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.includeOverview).toBe(true);
       since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.orientation).toBe('NONE');
       since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.pageHeight).toBe(8.27);
       since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.pageOption).toBe('all');
       since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.pageWidth).toBe(11.69);
       since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.repeatColumnHeader).toBe(true);
       since('The setting of Table of Contents is supposed to be #{expected}, instead we have #{actual}.')
           .expect(postData.includeToc).toBe(false);
       // Upload images convered by PDF
       const downloadedHRA = await findDownloadedFile(HRAFile);
       since('16 pages should be uploaded')
           .expect(await getPdfNum('TC77677', 'Human Resources Analysis', downloadedHRA, 'A4')).toBe(18);
       await dossierPage.goToLibrary();
      
    });

    it('[TC77678] [Tanzu] Export dossier to PDF from entry Share Panel', async() => {
        await deleteFile(ORSFile);
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierORS
        });
        // Open dossier
        await libraryPage.openDossier(dossierORS.name);
        await dossierPage.waitForDossierLoading();
        // Open PDF export settings from share panel and check default export settings
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        since('The export panel should open is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isDossierExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC77678', 'Default settings2', {tolerance:0.3});
        // Change export settings and export to PDF
        await pdfExportWindow.clickPDFRangeSetting();
        // Uncheck all
        await pdfExportWindow.clickRangeAll();
        // Check all
        await pdfExportWindow.clickRangeAll();
        await pdfExportWindow.clickPDFRangeSetting();
        await pdfExportWindow.clickMoreSettings();
        await pdfExportWindow.selectPageSize('A3 11.69" x 16.54"');
        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.selectFilterSummary('Both');
        await pdfExportWindow.togglePageNumbersCheckBox();
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC77678', 'CustomizedSettings2', {tolerance:0.3});
        await pdfExportWindow.exportSubmitDossier();
        /*
        const filepath = path.join(downloadDirectory, `${ORSFile.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${ORSFile.name}.pdf`));
        */
       await share.waitForDownloadComplete(ORSFile);
        since(`The pdf file for ${dossierORS.name} was not downloaded`)
            .expect(await isFileNotEmpty(ORSFile)).toBe(true);
        // Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        await libraryPage.sleep(1000);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('all');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(false);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(false);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(true);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(11.69);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(16.54);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);
        since('The setting of Table of Contents is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeToc).toBe(true);
        // Upload images convered by PDF
        const downloadedORS = await findDownloadedFile(ORSFile);
        since('5 pages should be uploaded')
            .expect(await getPdfNum('TC77678', 'Office Royale Sales', downloadedORS, 'A3')).toBe(7);
        await dossierPage.goToLibrary();
    });

    xit('[TC77679] [Tanzu] Export dossier to PDF from entry Viz Menu', async() => {
        await deleteFile(DTEFile);
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: dossierTestExcel
        });
        // Open dossier
        await libraryPage.openDossier(dossierTestExcel.name);
        await dossierPage.waitForDossierLoading();
        // Open PDF export settings from entry visualization menu and check default export settings
        await baseVisualization.selectExportToPDFOnVisualizationMenu('Sample Grid');
        await dossierPage.sleep(1000);
        since('The export dialog present is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isVisExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC77679', 'DefaultSettings', {tolerance: 0.3});
        // Change export settings and export to PDF
        await pdfExportWindow.selectMojoPageSize('B5 9.8" x 6.9"');
        await pdfExportWindow.selectMojoOrientation('Portrait');
        await pdfExportWindow.selectMojoFilterSummary('Filter summary on each PDF page');
        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC77679', 'CustomizedSettings', {tolerance: 0.3});
        // Export to PDF
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(3000);
        /*
        const filepath = path.join(downloadDirectory, `${dossierTestExcel.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${dossierTestExcel.name}.pdf`));
        */
        await share.waitForDownloadComplete(DTEFile);
        since(`The pdf file for ${dossierTestExcel.name} was not downloaded`)
            .expect(await isFileNotEmpty(DTEFile)).toBe(true);
        // Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        await libraryPage.sleep(1000);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('BAR');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(1);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(1);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(false);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(9.8);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('DEFAULT');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(6.9);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);
        // Upload images convered by PDF
        const downloadedDTE = await findDownloadedFile(DTEFile);
        since('1 pages should be uploaded')
            .expect(await getPdfNum('TC77679', 'Dossier_TestExcel_Grid', downloadedDTE, 'Letter')).toBe(1);
        await dossierPage.goToLibrary();
    });

    // Export RSD
    it('[TC90029] Exporting RSD to PDF from info window', async() => {
        await deleteFile(RSDFile);
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: RSD
        });
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);

        //Open PDF setting window and export with default settings
        await infoWindow.exportRSD();
        await dossierPage.sleep(1000);
        /*
        const filepath = path.join(downloadDirectory, `${RSD.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${RSD.name}.pdf`));
        await infoWindow.close();
        */
       
        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');

        // Upload images convered by PDF
        const downloadedRSD = await findDownloadedFile(RSDFile);
        since('5 pages should be uploaded')
            .expect(await getPdfNum('TC90029', 'RSD_for_Exporting', downloadedRSD, 'Letter')).toBe(5);
        await dossierPage.goToLibrary();
    });

    it('[TC90030] Exporting RSD to PDF from share panel', async() => {
        await deleteFile(RSDFile);
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: RSD
        });
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.selectRange('Entire document');

        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC90030_m2021', 'OpenRSDExportPDFSettingsWindow', {tolerance: 0.3});

        //Click export
        await pdfExportWindow.exportSubmitDossier();
        await share.closeSharePanel();
        /*
        const filepath = path.join(downloadDirectory, `${RSD.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${RSD.name}.pdf`));
        */

        //Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');

        // Upload images convered by PDF
        const downloadedRSD = await findDownloadedFile(RSDFile);
        since('5 pages should be uploaded')
            .expect(await getPdfNum('TC90030', 'RSD_for_Exporting', downloadedRSD, 'Letter')).toBe(5);

        await dossierPage.goToLibrary();
    });

    it('[TC90031] Exporting RSD to Excel from info window', async() => {
        await deleteFile({name:'RSD_for_Exporting',fileType:'.xlsx'});
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: RSD
        });
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);

        //Open PDF setting window and export with default settings
        await infoWindow.clickExportExcelButton();
        await libraryPage.sleep(3000);
        /*
        const fileName = 'testExcel.xlsx';
        const downloadPath = path.join(downloadDirectory, fileName);
        const baselinePath = path.join(baselineDirectory, fileName);
        await waitForFileExists(downloadPath, 10000);
        await expect(downloadPath).toMatchExcel(baselinePath, {
            difference: path.join(downloadDirectory, 'RSD_for_Exporting_Differences.xlsx'),
        });
        */
        await infoWindow.waitForDownloadComplete({name:'RSD_for_Exporting',fileType:'.xlsx'});
        since(`The excel file for ${RSD.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'RSD_for_Exporting',fileType:'.xlsx'})).toBe(true);
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('Entire RSD is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL");
        await dossierPage.goToLibrary();
    });

    it('[TC90032] Exporting RSD to Excel from share panel', async() => {
        await deleteFile({name:'RSD_for_Exporting',fileType:'.xlsx'});
        await resetDossierState({
            credentials: {username: 'export', password: 'newman1#'},
            dossier: RSD
        });
        //Open RSD
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to Excel settings window
        await dossierPage.openShareDropDown();
        await share.clickReportExportToExcel();
        await excelExportPanel.selectExcelRange('Entire document');
        await takeScreenshotByElement(excelExportPanel.getRSDExportExcelPanel(),'TC90032_m2021', 'OpenRSDExportExcelSettingsWindow', {tolerance: 0.3});
        //Click export
        await excelExportPanel.clickRSDExportButton();
        await share.closeSharePanel();
        /*
        const fileName = 'RSD_for_Exporting.xlsx';
        const downloadPath = path.join(downloadDirectory, fileName);
        const baselinePath = path.join(baselineDirectory, fileName);
        await libraryPage.sleep(3000);
        await waitForFileExists(downloadPath, 10000);
        await expect(downloadPath).toMatchExcel(baselinePath, {
            difference: path.join(downloadDirectory, 'RSD_for_Exporting_Differences.xlsx'),
        });
        */
        await infoWindow.waitForDownloadComplete({name:'RSD_for_Exporting',fileType:'.xlsx'});
        since(`The excel file for ${RSD.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'RSD_for_Exporting',fileType:'.xlsx'})).toBe(true);

        //Check API request
        const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('ALL');
        await dossierPage.goToLibrary();
    });
});
