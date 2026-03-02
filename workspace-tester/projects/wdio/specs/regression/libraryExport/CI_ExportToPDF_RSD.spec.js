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

    const RSD = {
        id: 'C6170D284606E65E982F5E93AD180CF5',
        name: '(AUTO) Export - RSD',
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


    //Export RSD
    it('[TC58930] Export to PDF - Verify Export RSD from info Window', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(RSD.name);
        await libraryPage.openDossierInfoWindow(RSD.name);

        //Open PDF setting window and export with default settings
        await infoWindow.exportRSD();
        await infoWindow.close();

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('all');
    });

    it('[TC58931] Export to PDF - Verify Export RSD from dossier', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and expand advanced settings window
        await dossierPage.openShareDropDown();
        // since('The privilege of export PDF is supposed to be #{expected}, instead we have #{actual}.')
        //     .expect(await share.isExportPDFEnabled()).toBe(true);
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC58931_m2021', 'OpenExportPDFSettingsWindow', {tolerance: 0.3});

        //Click export
        await pdfExportWindow.exportSubmitDossier();
        await share.closeSharePanel();

        //Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('current');


        await dossierPage.goToLibrary();
    });

    it('[TC61449] Export to PDF - the selector of exporting pdf range in RSD cannot draw back after clicking at the blank space or itself', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.openRangeDialog();
        await dossierPage.sleep(1000);
        since('The range setting dropdown opened is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRSDRangeDropDownListOpen()).toBe(true);
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC61449', 'RangeShouldBeOpen', {tolerance: 0.3});
        //await pdfExportWindow.getDossierExportPDFPanel().click();
        await pdfExportWindow.openRangeDialog();
        await dossierPage.sleep(1000);
        since('The range setting dropdown opened is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isRSDRangeDropDownListOpen()).toBe(false);
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC61449', 'RangeShouldBeClosed', {tolerance: 0.3});
        await dossierPage.goToLibrary();
    });

    it('[TC20889] Export to PDF - Verify Export RSD to PDF with Watermark in Library', async() => {
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and expand advanced settings window
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getRSDExportDialog(),'TC20889_m2021', 'OpenExportPDFSettingsWindow', {tolerance: 0.3});

        //Click export
        await pdfExportWindow.exportSubmitDossier();
        await share.closeSharePanel();

        //Check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of Page Option is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toBe('current');


        await dossierPage.goToLibrary();
    });

    it('[TC20650] Export to PDF - Verify Export Document from title bar of grid and graph in Library Web', async() => {
        await deleteFile({name: RSD.name,fileType:'.pdf'});
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open RSD
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();

        //Export single visualization to PDF
        await pdfExportWindow.openRSDVisualizationMenu();
        await pdfExportWindow.ExportDocumentSingleVisualization('Export to PDF');

        //Check API request
        const filepath = path.join(downloadDirectory, `${RSD.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The default setting of node key is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.nodeKey).toBe('K89');
        since('The default setting of orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('AUTO');
        await dossierPage.goToLibrary();
    });



});
