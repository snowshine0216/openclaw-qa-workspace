import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';



describe('Export - Export dashboard to Google Sheets', () => {
    const dossier = {
        id: 'E581E159584FF4255CDC8F9C86573A9D',
        name: '(AUTO) ExportToGoogleSheets',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1400,
        height: 1000
    };

    let {
        baseVisualization,
        dossierPage,
        excelExportPanel,
        libraryPage,
        share,
        infoWindow,
        loginPage,
        listView,
        listViewAGGrid,
        userAccount,
    } = browsers.pageObj1;

    let mockedGoogleSheetsRequest;

    beforeAll(async () => {
        await loginPage.login({ username: 'auto_googleSheets', password: 'newman1#' });
        await setWindowSize(browserWindow);
        mockedGoogleSheetsRequest = await browser.mock('https://**/googlesheets');
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        mockedGoogleSheetsRequest.clear();
    });

    it('[BCVE-5498_SharePanel] Export dashboard with selected chapter to Google Sheets from share panel', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await dossierPage.openShareDropDown();
        await share.openExportToGoogleSheetsDialog();
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickOnlyByChapterName('Chapter 2');
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.selectExcelContents('Entire page to worksheet');
        await excelExportPanel.clickShowFiltersCheckbox();
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(), 'BCVE-5498_SharePanel', 'Export Google Sheets dialog', { tolerance: 0.3 });
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickExportButton();
        await excelExportPanel.waitForExportComplete();
        await infoWindow.sleep(1000);
        const googleSheetsURL = mockedGoogleSheetsRequest.calls[0].body;
        const postData = excelExportPanel.getRequestPostData(mockedGoogleSheetsRequest.calls[0]);
        since('The checkGoogleSheetsURLPrefix function is supposed to be #{expected}, instead we have #{actual}')
            .expect(excelExportPanel.checkGoogleSheetsURLPrefix(googleSheetsURL)).toBe(true);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT");
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("page");
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(true);
        await libraryPage.reload();
    });

    it('[BCVE-5498_VizMenu] Export grid to Google Sheets from visualization menu', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await baseVisualization.selectExportToGoogleSheetsOnVisualizationMenu('grid (modern)');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        await excelExportPanel.waitForExportComplete();
        await infoWindow.sleep(1000);
        const googleSheetsURL = mockedGoogleSheetsRequest.calls[0].body;
        const postData = excelExportPanel.getRequestPostData(mockedGoogleSheetsRequest.calls[0]);
        since('The checkGoogleSheetsURLPrefix function is supposed to be #{expected}, instead we have #{actual}')
            .expect(excelExportPanel.checkGoogleSheetsURLPrefix(googleSheetsURL)).toBe(true);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("DEFAULT");
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("visualization");
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(false);
    });

    it('[BCVE-5498_InfoWindow] Export entire dashboard to Google Sheets from info window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.clickExportGoogleSheetsButton();
        await infoWindow.sleep(2000);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanelContent(), 'BCVE-5498_InfoWindow', 'Export Google Sheets dialog', { tolerance: 0.3 });
        await excelExportPanel.clickLibraryExportButton();
        await excelExportPanel.waitForExportComplete();
        await infoWindow.sleep(1000);
        const googleSheetsURL = mockedGoogleSheetsRequest.calls[0].body;
        const postData = excelExportPanel.getRequestPostData(mockedGoogleSheetsRequest.calls[0]);
        since('The checkGoogleSheetsURLPrefix function is supposed to be #{expected}, instead we have #{actual}')
            .expect(excelExportPanel.checkGoogleSheetsURLPrefix(googleSheetsURL)).toBe(true);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL");
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("page");
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(false);
    });

    it('[BCVE-5498_ListView] Export entire dashboard to Google Sheets from list view', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({ username: 'exportGoogleSheets', password: 'newman1#' });
        await listView.selectListViewMode();
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(dossier.name);
        await listViewAGGrid.clickInfoWindowIconInGrid(dossier.name);
        await infoWindow.clickExportGoogleSheetsButton();
        await infoWindow.sleep(2000);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanelContent(), 'BCVE-5498_ListView', 'Export Google Sheets dialog', { tolerance: 0.3 });
        await excelExportPanel.clickLibraryExportButton();
        await excelExportPanel.waitForExportComplete();
        await infoWindow.sleep(1000);
        const googleSheetsURL = mockedGoogleSheetsRequest.calls[0].body;
        const postData = excelExportPanel.getRequestPostData(mockedGoogleSheetsRequest.calls[0]);
        since('The checkGoogleSheetsURLPrefix function is supposed to be #{expected}, instead we have #{actual}')
            .expect(excelExportPanel.checkGoogleSheetsURLPrefix(googleSheetsURL)).toBe(true);
        since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL");
        since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level).toEqual("page");
        since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails).toEqual(false);
    });

});
