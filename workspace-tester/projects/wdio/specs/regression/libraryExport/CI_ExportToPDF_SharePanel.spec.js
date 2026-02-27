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

    it('[TC56914] Export to PDF - Check for GUI of Export panel, cancel, and export with default settings', async() => {
        await deleteFile(dossierFile);
        await dossierPage.goToLibrary();
        await libraryPage.reload();
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open share menu, open export to PDF settings window, and dismiss export panel
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(),'TC56914_m2021', 'OpenExportPDFSettingsWindow', {tolerance: 0.3});
        await share.closeExportPDFSettingsWindow();
        await dossierPage.sleep(1000);
        since('The export panel should dismiss supposed to be #{expected}, instead we have #{actual}. ')
            .expect(await pdfExportWindow.isDossierExportPDFSettingsWindowOpen()).toBe(false);

        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.exportSubmitDossier();
        const filepath = path.join(downloadDirectory, `${dossier.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        await dossierPage.goToLibrary();

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
            .expect(postData.pageOption).toBe('default');
        since('The default setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(11);
        since('The default setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(true);

    });

});
