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

    //Entry point: visualization

    // [TC56916] Check default settings, cancel, and export from visualization (Grid)
    // 1. Open dossier
    // 2. Hover on the visualization
    // 3. Click menu > Export > PDF, to open export dialog
    // 4. Check if the Export dialog display
    // 5. Click cancel to dismiss the exprot dialog
    // 6. Check if the Export dialog dismiss
    // 7. Do step 2~4 again
    // 8. Click Export button
    // 9. Check if the export dialog dismiss
    // 10. Go back to Library
    // 11. Check RestAPI request parameters

    it('[TC56916] Export to PDF - Check default settings, cancel, and export from visualization (Grid)', async() => {
        await deleteFile(dossierFile);
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open export to PDF editor from visualization menu, and check tooltips, and then cancel
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Attribute < 50%');
        await dossierPage.sleep(2000);
        since('The export dialog present is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isVisExportPDFSettingsWindowOpen()).toBe(true);

        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC56916_m2021', 'DefaultSettings', {tolerance: 0.3});
        await pdfExportWindow.cancelExportSettingsVisualization();

        since('The export dialog present is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isVisExportPDFSettingsWindowOpen()).toBe(false);

        //Open export to PDF editor from visualization menu, and export with default settings
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Attribute < 50%');
        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(3000);


        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('PAGE');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(1);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(1);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(false);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('DEFAULT');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

        await dossierPage.goToLibrary();
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);
    });


    // [TC56917] Modify settings to check controllers functionality, and export from visualization (Grid)
    // 1. Open dossier
    // 2. Hover on the visualization
    // 3. Click menu > Export > PDF, to open export dialog
    // 4. Check if the Export dialog display
    // 5. Modify settings
    // 5a) Detail level
    // 5b) Grid settings
    // 5c) Page size
    // 5d) Orientation
    // 5e) Content settings
    // 6. Click Export button
    // 7. Check if the export dialog dismiss
    // 8. Go back to Library
    // 9. Check RestAPI request parameters

    it('[TC56917] Export to PDF - Modify settings to check controllers functionality, and export from visualization (Grid)', async() => {
        await deleteFile(dossierFile);
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open export to PDF editor from visualization menu, and check tooltips, and then cancel
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Attribute < 50%');
        await dossierPage.sleep(2000);
        since('The export dialog present is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isVisExportPDFSettingsWindowOpen()).toBe(true);

        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC56917_m2021', 'DefaultSettings', {tolerance: 0.3});
        await pdfExportWindow.selectMojoFilterSummary('All filters after each chapter');
        await pdfExportWindow.selectMojoPageSize('B5 9.8" x 6.9"');
        await pdfExportWindow.selectMojoOrientation('Portrait');
        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC56917_m2021', 'CustomizedSettings', {tolerance: 0.3});


        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(3000);


        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('PAGE');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(1);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(1);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(false);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(9.8);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('DEFAULT');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(6.9);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

        await dossierPage.goToLibrary();
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);

    });


    // [TC56918] Check default settings and export from visualization (not Grid)
    // 1. Open dossier
    // 2. Hover on the visualization
    // 3. Click menu > Export > PDF, to open export dialog
    // 4. Check if the Export dialog
    // 5. Check if the grid settings display
    // 6. Click Export button
    // 7. Check if the export dialog dismiss
    // 8. Go back to Library
    // 9. Check RestAPI request parameters

    it('[TC56918] Export to PDF - Check default settings and export from visualization with customized settings (not Grid)', async() => {
        await deleteFile(dossierFile);
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open export to PDF editor from visualization menu, and check tooltips, and then cancel
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Area Chart');
        await dossierPage.sleep(2000);
        since('The export dialog present is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isVisExportPDFSettingsWindowOpen()).toBe(true);

        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC56918_m2021', 'DefaultSettings', {tolerance: 0.3});
        await pdfExportWindow.selectMojoFilterSummary('All filters after each chapter');
        await pdfExportWindow.selectMojoPageSize('Letter 8.5" x 11"');
        await dossierPage.sleep(2000);
        await pdfExportWindow.selectMojoOrientation('Landscape');
        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC56918_m2021', 'CustomizedSettings', {tolerance: 0.3});


        await pdfExportWindow.clickVizExportButton();
        await dossierPage.sleep(3000);

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('PAGE');
        since('The default setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(true);
        since('The default setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(1);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(1);
        since('The default setting of Include Overview is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeOverview).toBe(false);
        since('The default setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The default setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('DEFAULT');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

        await dossierPage.goToLibrary();
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);

    });



});
