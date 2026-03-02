import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Export - Export prompted dashboard to Google Sheets (XFunction)', () => {
    const dossier = {
        id: '',
        name: 'AUTOPromptedDashboard',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report = {
        id: '',
        name: 'AUTOPromptedReport',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const customApp = {
        id: '2BBF421DCD164E0B80D1AECEC6F3FD6D',
        name: 'NoExportOptions',
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1400,
        height: 1000,
    };

    let { dossierPage, excelExportPanel, libraryPage, infoWindow, loginPage, promptEditor, search, searchPage } =
        browsers.pageObj1;

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

    it('[BCVE-4989_01] Export prompted dashboard to Google Sheets from info window after answering prompt', async () => {
        // Search for the prompted dashboard in library
        await search.openSearchSlider();
        await search.inputTextAndSearch(dossier.name);
        await libraryPage.waitForItemLoading();
        // Open info window from search results page
        await searchPage.openGlobalResultInfoWindow(dossier.name);
        await infoWindow.clickExportGoogleSheetsButton();
        await infoWindow.sleep(2000);
        await excelExportPanel.clickExportButton();
        // Wait for prompt editor to appear and answer the prompt
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'BCVE-4989_01', 'Prompt Editor', {
            tolerance: 0.3,
        });
        await promptEditor.run();
        await excelExportPanel.waitForExportComplete();
        // Verify the Google Sheets export request
        const googleSheetsURL = mockedGoogleSheetsRequest.calls[0].body;
        const postData = excelExportPanel.getRequestPostData(mockedGoogleSheetsRequest.calls[0]);
        const urlPrefixCheck = await excelExportPanel.checkGoogleSheetsURLPrefix(googleSheetsURL);
        // Verify the response contains no error code
        const responseBody = mockedGoogleSheetsRequest.calls[0].response?.body;
        await since('The response should not contain an error code, expected #{expected}, got #{actual}')
            .expect(responseBody?.errorCode)
            .toBeUndefined();
        await since('The checkGoogleSheetsURLPrefix function is supposed to be #{expected}, instead we have #{actual}')
            .expect(urlPrefixCheck)
            .toBe(true);
        await since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption)
            .toEqual('ALL');
        await since('Level is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.content.level)
            .toEqual('page');
        await since('filterDetails is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.sheet.header.filterDetails)
            .toEqual(false);
    });

    it('[BCVE-4989_02] Export prompted report to Google Sheets from info window after answering prompt', async () => {
        // Search for the prompted report in library
        await search.openSearchSlider();
        await search.inputTextAndSearch(report.name);
        await libraryPage.waitForItemLoading();
        // Open info window from search results page
        await searchPage.openGlobalResultInfoWindow(report.name);
        await infoWindow.clickExportGoogleSheetsButton();
        await infoWindow.sleep(2000);
        await excelExportPanel.clickExportButton();
        // Wait for prompt editor to appear and answer the prompt
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'BCVE-4989_02', 'Prompt Editor', {
            tolerance: 0.3,
        });
        await promptEditor.run();
        await excelExportPanel.waitForExportComplete();
        // Verify the Google Sheets export request
        const googleSheetsURL = mockedGoogleSheetsRequest.calls[0].body;
        const postData = excelExportPanel.getRequestPostData(mockedGoogleSheetsRequest.calls[0]);

        // Verify the response contains no error code
        const responseBody = mockedGoogleSheetsRequest.calls[0].response?.body;
        await since('The response should not contain an error code, expected #{expected}, got #{actual}')
            .expect(responseBody?.errorCode)
            .toBeUndefined();

        const urlPrefixCheck = await excelExportPanel.checkGoogleSheetsURLPrefix(googleSheetsURL);
        await since('The checkGoogleSheetsURLPrefix function is supposed to be #{expected}, instead we have #{actual}')
            .expect(urlPrefixCheck)
            .toBe(true);
        await since('Range is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption)
            .toEqual('ALL');
    });

    it('[BCVE-4989_03] Verify Google Sheets export is not available in NoExportOptions application', async () => {
        // Switch to NoExportOptions application
        await libraryPage.openCustomAppById({ id: customApp.id });
        // Search for the dashboard in library
        await search.openSearchSlider();
        await search.inputTextAndSearch(dossier.name);
        await libraryPage.waitForItemLoading();
        // Open info window from search results page
        await searchPage.openGlobalResultInfoWindow(dossier.name);
        // Verify that the Google Sheets export icon is not available
        await since(
            'Google Sheets export button should not be displayed in NoExportOptions app, expected #{expected}, got #{actual}'
        )
            .expect(await infoWindow.isExportGoogleSheetsEnabled())
            .toBe(false);
    });
});
