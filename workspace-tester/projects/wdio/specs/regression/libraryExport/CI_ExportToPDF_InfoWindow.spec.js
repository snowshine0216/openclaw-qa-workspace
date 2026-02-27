import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
const downloadDirectory = 'downloads';
const specName = 'ExportToPDFDossier';
import path from 'path';

describe('Export - Export a Dossier to PDF', () => {
    const dossier = {
        id: '59DB5DB4A442FA7EA01D34BC21215D8A',
        name: '(AUTO) Export - Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };


    const dossierWithPrompt = {
        id: 'E20AD04345C6B07C35F30C9D377A678D',
        name: '(AUTO) Export - Dossier with prompt',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const RSD = {
        id: 'C6170D284606E65E982F5E93AD180CF5',
        name: '(AUTO) Export - RSD',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossierForSmartDefault = {
        id: '384EB9E143C2EB7EA60D90A1AA98E974',
        name: '(Auto) SmartDefault_PageLink',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossierFile = {
        name: dossier.name,
        fileType: '.pdf'
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1500,
        height: 1200
    };

    const dossier_DE = {
        id: '329C514843E7AFDCD83770813DD31536',
        name: 'Viz_NonViz',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    let {
        loginPage,
        baseVisualization,
        dossierPage,
        grid,
        libraryPage,
        infoWindow,
        pdfExportWindow,
        search,
        toc,
        share,
        filterPanel,
        checkboxFilter,
        excelExportPanel,
    } = browsers.pageObj1;
    let mockedPdfRequest;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login({username: 'nee_auto', password: ''});
        mockedPdfRequest = await browser.mock('https://**/pdf');
    });

    beforeEach(async () => {
        mockedPdfRequest.clear();
        await resetDossierState({
            credentials: {username: 'nee_auto', password: ''},
            dossier: dossier,
        });
    });

    {

    //Entry point: info window

    // [TC56909] Check export icon enabled and show tooltip
    // 1. Open info window of the dossier
    // 2. Check if Export icon exists and is enabled
    // 3. Hover on Export icon
    // 4. Check tooltip text
    // 5. Close info window

    it('[TC56909] Export to PDF - Check for Export icon enabled and show tooltip', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        since('Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        since('Tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showTooltipOfExportPDFIcon()).toBe('Export to PDF');
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC56909_m2021', 'ShowTooltip', {tolerance: 0.8});
        await infoWindow.close();
    });

    // [TC00002] Check for GUI of Export panel and cancel exporting
    // 1. Open info window of the dossier
    // 2. Click Export icon
    // 3. Check if the Export panel display
    // 4. Click Cancel button
    // 5. Check if the Export panel dismiss
    // 6. Close info window

    it('[TC56910] Export to PDF - Check fo GUI of Export panel and cancel exporting', async () => {
        // await dossierPage.goToLibrary();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.openExportPDFSettingsWindow();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56910_m2021', 'ExportPanel', {tolerance: 0.8});
        await pdfExportWindow.close();
        since('Exporting panel dismissed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(false);
        await infoWindow.close();
    });

    // [TC00003] Check for default export settings and directly export
    // 1. Open info window of the dossier
    // 2. Click Export icon
    // 3. Check the default selections in GUI
    // 4. Click Export button
    // 5. Check if the Export panel dismiss
    // 6. Close info window
    // 7. Check RestAPI request parameters

    it('[TC56911] Export to PDF - Check for default export settings and directly export', async () => {
        await deleteFile(dossierFile);
        // await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        //Open PDF setting window and export with default settings
        await infoWindow.openExportPDFSettingsWindow();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56911_m2021', 'ExportPanel', {tolerance: 0.8});
        await pdfExportWindow.exportSubmitLibrary();
        //await infoWindow.waitForDownloadComplete(dossierFile);
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(false);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(true);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(true);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

        await infoWindow.close();

    });


    // [TC00004] Modify settings to check controllers functionality, and then export (By mouse clicking)
    // 1. Open info window of the dossier
    // 2. Click Export icon
    // 3. Modify settings
    // 3a) Detail level
    // 3b) Grid settings
    // 3c) Page size
    // 3d) Orientation
    // 3e) Content settings
    // 4. Click Export button
    // 5. Check if the Export panel dismiss
    // 6. Close info window
    // 7. Check RestAPI request parameters

    it('[TC56912] Export to PDF - Modify settings to check controllers functionality, and then export', async () => {
        await deleteFile(dossierFile);
        // await dossierPage.goToLibrary();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);

        //Open PDF setting window and export with default settings
        await infoWindow.openExportPDFSettingsWindow();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56912_m2021', 'ExportPanel', {tolerance: 0.3});

        await pdfExportWindow.selectDetailLevel('All visualizations together');
        await pdfExportWindow.selectDetailLevel('Each visualization separately');
        since('The setting of Detail Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.detailLevelSelectedItem()).toBe('Each visualization separately');


        // //TODO: Check whether grid setting is enabled

        await pdfExportWindow.selectGridSettings('Extend columns over pages');
        await pdfExportWindow.toggleRepeatAttributeColumnsCheckBox();

        await pdfExportWindow.selectPageSize('B4 13.9" x 9.8"');
        await pdfExportWindow.selectPageSize('Letter 8.5" x 11"');
        since('The setting of Page size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.pageSizeSelectedItem()).toBe('Letter 8.5" x 11"');


        await pdfExportWindow.selectLandscapeOrientation();
        await pdfExportWindow.selectPortraitOrientation();
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isPortraitOrientationButtonSelected()).toBe(true);

        await pdfExportWindow.toggleHeaderCheckBox();
        await pdfExportWindow.togglePageNumbersCheckBox();

        await pdfExportWindow.selectFilterSummary('Both');
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC56912_m2021', 'ExportSettings', {tolerance: 0.3});
        await pdfExportWindow.exportSubmitLibrary();


        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('all');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(false);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(false);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(false);
        since('The setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(false);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(11);
        since('The setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(8.5);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(false);

        await infoWindow.close();
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        
        // Reload for initialization customized settings
        await libraryPage.reload();

    });
}

});
