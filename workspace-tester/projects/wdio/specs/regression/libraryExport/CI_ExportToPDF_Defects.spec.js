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

    const dossierForSmartDefault = {
        id: '384EB9E143C2EB7EA60D90A1AA98E974',
        name: '(Auto) SmartDefault_PageLink',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };


    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1500,
        height: 1200
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
        textbox
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

    it('[TC63338] Validation of DE163594: [Library][Export Dialog] Inconsistent string between the selected one and string in list in Info Window of Library', async() => {
        //await loginPage.login({username: 'nee_auto', password: 'newman1#'});
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.openExportPDFSettingsWindow();
        await pdfExportWindow.selectFilterSummary('All filters after each chapter');
        since('The filter summary setting is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.FilterSummarySelectedItem()).toBe('All filters after each chapter');
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC63338_m2021', 'CheckFilter', {tolerance: 0.3});
        await infoWindow.close();
    });


    it('[TC82679] Check PDF smart default settings after linking to other page', async() => {
        await resetDossierState({
            credentials: {username: 'nee_auto', password: ''},
            dossier: dossierForSmartDefault
        });
        //Open dossier
        await libraryPage.openDossier(dossierForSmartDefault.name);
        await dossierPage.waitForDossierLoading();

        //Link to C2 P1 - 1 grid
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P1-1grid', {tolerance: 0.3});
        await share.closeSharePanel();
        // Go back and check export option for no grid/viz
        // await dossierPage.clickUndo();
        await dossierPage.resetDossierIfPossible();
        await dossierPage.waitForItemLoading();
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C1P1-nogrid/viz', {tolerance: 0.3});
        await share.closeSharePanel();

        //Link to C2 P2 - 1 grid + other
        await textbox.navigateLink(1);
        
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P2-1grid+other', {tolerance: 0.3});
        await share.closeSharePanel();
       
        // Go back to C1P1
        await dossierPage.resetDossierIfPossible();
        await dossierPage.waitForItemLoading();
        
        //Link to C2 P3 - 1 viz
        await textbox.navigateLink(2);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P3-1viz', {tolerance: 0.3});
        await share.closeSharePanel();
        // Go back to C1P1
        // await dossierPage.clickUndo();
        await dossierPage.resetDossierIfPossible();
        await dossierPage.waitForItemLoading();

        //Link to C2 P4 - 1 viz + other
        await textbox.navigateLink(3);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C2P4-1viz+other', {tolerance: 0.3});
        await share.closeSharePanel();


        //Click the text box to C4 P1 - Panel Stack grid hidden
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C24P1-panelstack-grid-hidden', {tolerance: 0.3});
        await share.closeSharePanel();

        //Click the text box to go back to C1 P1 and check settings again
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C1P1-nogrid/viz-2', {tolerance: 0.3});
        await share.closeSharePanel();


        //Click the text box to C4 P3 - Panel Stack 1 grid + other
        await textbox.navigateLink(6);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C4P3-panelstack-1grid+other', {tolerance: 0.3});
        await share.closeSharePanel();



        //Click the text box to C4 P5 - Panel Stack 1 viz + other
        await textbox.navigateLink(0);
        await dossierPage.openShareDropDown();
        // Check export option
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC82679', 'C4P5-panelstack-1viz+other', {tolerance: 0.3});
        await share.closeSharePanel();

        await dossierPage.goToLibrary();

    });

});
