import resetDossierState from '../../../api/resetDossierState.js';
import resetFilterMode from '../../../api/resetFilterMode.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { isFileNotEmpty, getFileSize, deleteFile, findDownloadedFile } from '../../../config/folderManagement.js';
import { getPdfNum } from '../../../utils/submitPdf.js';

describe('Export - Export a Dossier to PDF', () => {

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1500,
        height: 1200
    };

    const dossier = {
        id: '59DB5DB4A442FA7EA01D34BC21215D8A',
        name: '(AUTO) Export - Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier_keyDriver = {
        id: '03C5D494E44B34FC12BC6DA06231A6D2',
        name: 'HTML_Sanitizer_keyDriver',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossierFile = {
        name: dossier.name,
        fileType: '.pdf'
    };

    const keyDriverFile= {
        name: dossier_keyDriver.name,
        fileType: '.pdf'
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
        userAccount
    } = browsers.pageObj1;
    let mockedPdfRequest;
    let dockMode = false;

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

    it('[TC71400] Export to PDF - Verify Export with Grid Expanding and TOC enabled from Info Window by click.', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout()
        await loginPage.login({username: 'nee_auto', password: ''});
        //Open Info window
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        //Open PDF setting window
        await infoWindow.openExportPDFSettingsWindow();
         since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
             .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        //Toggle Expand all grid data
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC71400', 'ExportPanelOutside_1_before', {tolerance: 0.2});
        await pdfExportWindow.toggleExpandAllGridDataCheckBox();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC71400', 'ExportPanelOutside_1_after', {tolerance: 0.2});
        //Toggle TOC
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await dossierPage.sleep(1000);
        //Un-togger footer
        await pdfExportWindow.togglePageNumbersCheckBox();
        await takeScreenshotByElement(infoWindow.getInfoWindowExportDetails(), 'TC71400', 'ExportPanelOutside_2_after', {tolerance: 0.2});
        //Export to PDF
        await pdfExportWindow.exportSubmitLibrary();
        await share.waitForDownloadComplete(dossierFile);
        since(`The pdf file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile)).toBe(true);
        await infoWindow.close();

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The setting of Grid Expanding is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.gridPagingMode).toBe('enlarge');
        since('The setting of Table of Contents is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeToc).toBe(true);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(false);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);

        await libraryPage.reload();
    });

    it('[TC71403] Export to PDF - Verify Export with Grid Expanding and TOC enabled from Export Dialog by click.', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'nee_auto', password: ''});
        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        //Open share menu, open exportation window and change export settings
        await dossierPage.openShareDropDown();
        await share.openExportPDFSettingsWindow();
        //Change Range
        await pdfExportWindow.clickRangeDropdown();
        // Uncheck all
        await pdfExportWindow.clickRangeAll();
        // Check all
        await pdfExportWindow.clickRangeAll();
        await pdfExportWindow.clickRangeDropdown();
        //Select Expand all grid data
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(), 'TC71403', 'ExportPanelInside_1_before', {tolerance: 0.2});
        await pdfExportWindow.toggleExpandAllGridDataCheckBox();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(), 'TC71403', 'ExportPanelInside_1_after', {tolerance: 0.2});
        //Select TOC
        await pdfExportWindow.clickMoreSettings();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(), 'TC71403', 'ExportPanelInside_2_before', {tolerance: 0.2});
        await pdfExportWindow.toggleTableofContentsCheckBox();
        await takeScreenshotByElement(pdfExportWindow.getDossierExportPDFPanel(), 'TC71403', 'ExportPanelInside_2_after', {tolerance: 0.2});
        await pdfExportWindow.exportSubmitDossier();

        //Check API request
        //Due to DE185567, this TC fails currently
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The setting of Grid Expanding is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.gridPagingMode).toBe('enlarge');
        since('The setting of Table of Contents is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeToc).toBe(true);
        since('The default setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('page');
        since('The default setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(true);
        since('The default setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.reload();


    });

    it('[TC75549] Export to PDF - Export grid to PDF from entry Show Data.', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'nee_auto', password: ''});

        //Open dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();

        //Open PDF export dialog from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('Attribute > 50%');
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        await dossierPage.sleep(1000);
        await baseVisualization.showDataDialog.exportShowData('PDF');
        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC75549', 'ShowData_PDFDialogDefault', {tolerance: 0.2});

        //Modify export settings
        await pdfExportWindow.toggleMojoGridSettings('Extend columns over pages');
        await pdfExportWindow.toggleMojoGridRepeatColumns();
        await pdfExportWindow.selectMojoPageSize('Statement 5.5" x 8.5"');
        await pdfExportWindow.selectMojoOrientation('Portrait');
        await pdfExportWindow.toggleMojoShowHeader();
        await pdfExportWindow.toggleMojoShowPageNumber();
        await pdfExportWindow.selectMojoFilterSummary('Both');
        await takeScreenshotByElement(pdfExportWindow.getMojoPDFExportSettingsEditor(),'TC75549', 'ShowData_ModifiedPDFExportSettings', {tolerance: 0.2});
        await pdfExportWindow.clickVizExportButton();
	    await baseVisualization.showDataDialog.clickShowDataCloseButton();

        //check API request
        const postData = pdfExportWindow.getRequestPostData(mockedPdfRequest.calls[0]);
        since('The setting of Filter Summary is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.filterSummary).toBe('ALL');
        since('The setting of Fit to Page is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.fitToPage).toBe(false);
        since('The setting of Include Detailed Pages is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeDetailedPages).toBe(true);
        since('The setting of Page Numbers is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeFooter).toBe(0);
        since('The setting of Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.includeHeader).toBe(0);
        since('The setting of Orientation is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.orientation).toBe('NONE');
        since('The setting of Height of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageHeight).toBe(8.5);
        since('The setting of Width of Page Size is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageWidth).toBe(5.5);
        since('The setting of Repeat Column Header is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.repeatColumnHeader).toBe(false);

        await dossierPage.goToLibrary();
        await libraryPage.reload();

    });

    it('[TC85172] Export to PDF - Export visualization key driver to PDF.', async() => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({username: 'Keydriver', password: ''});

        await deleteFile(keyDriverFile);
        await resetDossierState({
            credentials: {username: 'Keydriver', password: ''},
            dossier: dossier_keyDriver
        });

        // Open info window of target dossier
        await libraryPage.moveDossierIntoViewPort(dossier_keyDriver.name);
        await libraryPage.openDossierInfoWindow(dossier_keyDriver.name);
        // Open PDF export settings from info window and check default export settings
        await infoWindow.openExportPDFSettingsWindow();
        await infoWindow.sleep(1000);
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await pdfExportWindow.isLibraryExportPDFSettingsWindowOpen()).toBe(true);
        // Export visualization key driver to PDF
        await pdfExportWindow.selectDetailLevel('Both');
        await pdfExportWindow.exportSubmitDossier();
        await infoWindow.waitForDownloadComplete(keyDriverFile);
        since(`The pdf file for ${dossier_keyDriver.name} was not downloaded`)
            .expect(await isFileNotEmpty(keyDriverFile)).toBe(true);
        await infoWindow.close();
        // Upload images convered by PDF
        const downloadedKeyDriver = await findDownloadedFile(keyDriverFile);
        since('1 pages should be uploaded')
            .expect(await getPdfNum('TC85172', '(AUTO) Export to PDF', downloadedKeyDriver, 'Letter'))
            .toBe(1);
    });


});
