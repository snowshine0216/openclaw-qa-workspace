import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { compareCsv, compareExcel, detectFileBom } from '../../../utils/fileCompare.js';
import { isFileNotEmpty, deleteFolderContents, findDownloadedFile, getFileSize } from '../../../config/folderManagement.js';
import path from 'path';
import { fileURLToPath } from 'url';


describe('Bot 2.0 exporting result check', () => {
    let { loginPage, libraryPage, aibotChatPanel, historyPanel, aibotSnapshotsPanel, botAuthoring } = browsers.pageObj1;
    const generalSettings = botAuthoring.generalSettings;
    const chatUser = {
        username: 'bot2_auto_chat',
        password: '',
    };
    const exportBot = {
        botId: '9FAC21FBA2574C61805E8CBC23E6F5B0',
        name: 'AUTO_NumberFormatting',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const exportBotImage = {
        botId: 'E28B5BF23DA24B858972B7E4240020C1',
        name: 'AUTO_BOT_imageURL',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const exportHrs = {
        botId: '89EDF0103D3B4C64A1941401573F39F7',
        name: 'AUTO_ElementSearch_HRS',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        };
    const botNoExportPrivUser = {
        username: 'bot2_auto_export_nopri',
        password: 'newman1#',
    };

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const baselineFolder = path.resolve(__dirname, '../../../agentTestFiles/baselineFiles');
    const downloadFolder = path.resolve(__dirname, '../../../downloads');


    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await deleteFolderContents(downloadFolder);
        // await deleteFile({name:exportBot.name, fileType:'.csv'});
        // await deleteFile({name:exportBot.name, fileType:'.xlsx'});
        await loginPage.login(chatUser);
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99024_1] export grid', async () => {
        await libraryPage.openBotById(exportBot);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('Grid');

        // hide some columns before exporting
        await aibotChatPanel.manipulationOnAgGrid(0, 'Total Units Sold', 'Choose Columns');
        await aibotChatPanel.selectUnselectColumnOnAgGrid('Total Units Sold', false);
        await aibotChatPanel.closeAgColumnPickerDialog();

        // pin Region column to Right before exporting
        await aibotChatPanel.manipulationOnAgGrid(0, 'Region', 'Pin Column', 'Pin Right');

        // sort before exporting
        await aibotChatPanel.manipulationOnAgGrid(0, 'Total Product ($)', 'Sort Descending');

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedCsv = await findDownloadedFile({name:'', fileType:'.csv'});
        await since(`The csv file for ${exportBot.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedCsv.name, fileType:'.csv'})).toBe(true);

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedExcel = await findDownloadedFile({name:'', fileType:'.xlsx'});
        await since(`The excel file for ${exportBot.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedExcel.name,fileType:'.xlsx'})).toBe(true);

        const baselineCsv = path.join(baselineFolder, 'TC99024_1.csv');
        await since(`The csv file for ${exportBot.name} should encoded by UTF-8-BOM`)
        .expect(detectFileBom(downloadedCsv.fullPath)).toBe('utf-8-bom');
        const csvComparisonResult = compareCsv(baselineCsv, downloadedCsv.fullPath, { showDiff: true });
        await since(`The csv file for ${exportBot.name} should be same as baseline, instead we have ${csvComparisonResult}`)
        .expect(csvComparisonResult).toBe(true); 

        const baselineExcel = path.join(baselineFolder, 'TC99024_1.xlsx');
        const excelComparisonResult = compareExcel(baselineExcel, downloadedExcel.fullPath, { showDiff: true });
        await since(`The excel file for ${exportBot.name} should be same as baseline, instead we have ${excelComparisonResult}`)
        .expect(excelComparisonResult).toBe(true);

    });

    it('[TC99024_2] export chart', async () => {
        await libraryPage.openBotById(exportBot);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('Chart');

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedCsv = await findDownloadedFile({name:'', fileType:'.csv'});
        await since(`The csv file for ${exportBot.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedCsv.name,fileType:'.csv'})).toBe(true);

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedExcel = await findDownloadedFile({name:'', fileType:'.xlsx'});
        await since(`The excel file for ${exportBot.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedExcel.name,fileType:'.xlsx'})).toBe(true);

        const baselineCsv = path.join(baselineFolder, 'TC99024_2.csv');
        await since(`The csv file for ${exportBot.name} should encoded by UTF-8-BOM`)
        .expect(detectFileBom(downloadedCsv.fullPath)).toBe('utf-8-bom');
        const csvComparisonResult = compareCsv(baselineCsv, downloadedCsv.fullPath, { showDiff: true });
        await since(`The csv file for ${exportBot.name} should be same as baseline, instead we have ${csvComparisonResult}`)
        .expect(csvComparisonResult).toBe(true);

        const baselineExcel = path.join(baselineFolder, 'TC99024_2.xlsx');
        const excelComparisonResult = compareExcel(baselineExcel, downloadedExcel.fullPath, { showDiff: true });
        await since(`The excel file for ${exportBot.name} should be same as baseline, instead we have ${excelComparisonResult}`)
        .expect(excelComparisonResult).toBe(true);

    });

    it('[TC99024_3] no export privilege', async () => {
        // switch to no privilege user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(botNoExportPrivUser);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openBotById(exportBot);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        // check chat panel
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('AUTOMATION');
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Export to CSV button display is expected to be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isExportToCsvIconDisplayedByLatestAnswer())
        .toBe(false);
        await since('Export to Excel button display is expected to be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isExportToExcelIconDisplayedByLatestAnswer())
        .toBe(false);

        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotSnapshotsPanel.waitForSnapshotCardLoaded(0);
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        await since('Snapshot export to CSV button display is expected to be #{expected}, instead we have #{actual}')
        .expect(await snapshotCard.getExportCSVButton().isDisplayed())
        .toBe(false);
        await since('Snapshot export to Excel button display is expected to be #{expected}, instead we have #{actual}')
        .expect(await snapshotCard.getExportExcelButton().isDisplayed())
        .toBe(false);

    });

    it('[TC99024_4] export with image url', async () => {
        await libraryPage.openBotById(exportBotImage);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('AUTO_Export_Image');

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedCsv = await findDownloadedFile({name:'', fileType:'.csv'});
        await since(`The csv file for ${exportBotImage.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedCsv.name,fileType:'.csv'})).toBe(true);
        await since(`The CSV file size should be greater than #{expected}, instead we have #{actual}`)
            .expect(await getFileSize({name:downloadedCsv.name, fileType:'.csv'}))
            .toBeGreaterThan(800); //800B

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedExcel = await findDownloadedFile({name:'', fileType:'.xlsx'});
        await since(`The excel file for ${exportBotImage.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedExcel.name,fileType:'.xlsx'})).toBe(true);
        // excel with image usually large than 122KB
        await since(`The Excel file size should be greater than #{expected}, instead we have #{actual}`)
            .expect(await getFileSize({name:downloadedExcel.name, fileType:'.xlsx'}))
            .toBeGreaterThan(122000); //122KB

        // compare data only, ignore image comparison
        const baselineCsv = path.join(baselineFolder, 'TC99024_4.csv');
        const csvComparisonResult = compareCsv(baselineCsv, downloadedCsv.fullPath, { showDiff: true });
        await since(`The csv file for ${exportBotImage.name} should be same as baseline, instead we have ${csvComparisonResult}`)
        .expect(csvComparisonResult).toBe(true);

        const baselineExcel = path.join(baselineFolder, 'TC99024_4.xlsx');
        const excelComparisonResult = compareExcel(baselineExcel, downloadedExcel.fullPath, { showDiff: true });
        await since(`The excel file for ${exportBotImage.name} should be same as baseline, instead we have ${excelComparisonResult}`)
        .expect(excelComparisonResult).toBe(true);
    });

    it('[TC99024_5] export percentage calculated on the fly', async () => {
        await libraryPage.openBotById(exportBotImage);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('AUTO_PercentageOnTheFly');

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedCsv = await findDownloadedFile({name:'', fileType:'.csv'});
        await since(`The csv file for ${exportBotImage.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedCsv.name,fileType:'.csv'})).toBe(true);

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        await aibotChatPanel.waitForExportComplete();
        const downloadedExcel = await findDownloadedFile({name:'', fileType:'.xlsx'});
        await since(`The excel file for ${exportBotImage.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedExcel.name,fileType:'.xlsx'})).toBe(true);


        const baselineCsv = path.join(baselineFolder, 'TC99024_5.csv');
        const csvComparisonResult = compareCsv(baselineCsv, downloadedCsv.fullPath, { showDiff: true });
        await since(`The csv file for ${exportBotImage.name} should be same as baseline, instead we have ${csvComparisonResult}`)
        .expect(csvComparisonResult).toBe(true);

        const baselineExcel = path.join(baselineFolder, 'TC99024_5.xlsx');
        const excelComparisonResult = compareExcel(baselineExcel, downloadedExcel.fullPath, { showDiff: true });
        await since(`The excel file for ${exportBotImage.name} should be same as baseline, instead we have ${excelComparisonResult}`)
        .expect(excelComparisonResult).toBe(true);
    });

    it('[TC99024_6] export greater than 1000 rows grid - full data', async () => {
        await libraryPage.openBotById(exportHrs);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('AUTO>1000Rows');

        const mockedExportRequest = await browser.mock('**/fulldata?conversationId=**');

        // export csv
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        // check flag skipSQLExecution is false for this case
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 0),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        let payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[0]);
        since('The flag skipSQLExecution is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.skipSQLExecution).toBe(false);
        // compare result
        await aibotChatPanel.waitForExportComplete();
        const downloadedCsv = await findDownloadedFile({name:'', fileType:'.csv'});
        await since(`The csv file for ${exportHrs.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedCsv.name,fileType:'.csv'})).toBe(true);

        const baselineCsv = path.join(baselineFolder, 'TC99024_6.csv');
        const csvComparisonResult = compareCsv(baselineCsv, downloadedCsv.fullPath, { showDiff: true });
        await since(`The csv file for ${exportHrs.name} should be same as baseline, instead we have ${csvComparisonResult}`)
        .expect(csvComparisonResult).toBe(true);

        // export excel
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();

        // check flag skipSQLExecution is false for this case
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 1),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
        payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[1]);
        since('The flag skipSQLExecution is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.skipSQLExecution).toBe(false);
        // compare result
        await aibotChatPanel.waitForExportComplete();
        const downloadedExcel = await findDownloadedFile({name:'', fileType:'.xlsx'});
        await since(`The excel file for ${exportHrs.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedExcel.name,fileType:'.xlsx'})).toBe(true);

        const baselineExcel = path.join(baselineFolder, 'TC99024_6.xlsx');
        const excelComparisonResult = compareExcel(baselineExcel, downloadedExcel.fullPath, { showDiff: true });
        await since(`The excel file for ${exportHrs.name} should be same as baseline, instead we have ${excelComparisonResult}`)
        .expect(excelComparisonResult).toBe(true);
       
        mockedExportRequest.clear();
    });

    it('[TC99024_7] export greater than 1000 rows grid - first 1000 data', async () => {
        await libraryPage.editBotByUrl({ projectId: exportHrs.projectId, botId: exportHrs.botId });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        // disable full data export setting
        await generalSettings.turnOffExportFullData();

        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('AUTO>1000Rows');

        const mockedExportRequest = await browser.mock('**/fulldata?conversationId=**');
        // export to check skipSQLExecution=true
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        // check flag skipSQLExecution is false for this case
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 0),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        let payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[0]);
        since('The flag skipSQLExecution is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.skipSQLExecution).toBe(true);
        // compare result
        await aibotChatPanel.waitForExportComplete();
        const downloadedCsv = await findDownloadedFile({name:'', fileType:'.csv'});
        await since(`The csv file for ${exportHrs.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedCsv.name,fileType:'.csv'})).toBe(true);
        const baselineCsv = path.join(baselineFolder, 'TC99024_7.csv');
        const csvComparisonResult = compareCsv(baselineCsv, downloadedCsv.fullPath, { showDiff: true });
        await since(`The csv file for ${exportHrs.name} should be same as baseline, instead we have ${csvComparisonResult}`)
        .expect(csvComparisonResult).toBe(true);
        // export excel to check skipSQLExecution=true
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        // check flag skipSQLExecution is false for this case
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 1),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
        payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[1]);
        since('The flag skipSQLExecution is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.skipSQLExecution).toBe(true);
        // compare result
        await aibotChatPanel.waitForExportComplete();
        const downloadedExcel = await findDownloadedFile({name:'', fileType:'.xlsx'});
        await since(`The excel file for ${exportHrs.name} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadedExcel.name,fileType:'.xlsx'})).toBe(true);
        const baselineExcel = path.join(baselineFolder, 'TC99024_7.xlsx');
        const excelComparisonResult = compareExcel(baselineExcel, downloadedExcel.fullPath, { showDiff: true });
        await since(`The excel file for ${exportHrs.name} should be same as baseline, instead we have ${excelComparisonResult}`)
        .expect(excelComparisonResult).toBe(true);
        mockedExportRequest.clear();
        await botAuthoring.clickCloseButton();
    });

});
