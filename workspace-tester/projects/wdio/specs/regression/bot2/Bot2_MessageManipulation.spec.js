import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { autoChatInfo } from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { isFileNotEmpty, deleteFolderContents, findDownloadedFile } from '../../../config/folderManagement.js';
import path from 'path';
import { fileURLToPath } from 'url';


describe('Bot 2.0 Message Manipulation Workflow', () => {
    const { loginPage, libraryPage, aibotChatPanel, historyPanel } = browsers.pageObj1;
    const { projectId, botId, botName } = autoChatInfo;
    // const baseUrl = urlParser(browser.options.baseUrl);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const downloadFolder = path.resolve(__dirname, '../../../downloads');

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(autoChatInfo);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await deleteFolderContents(downloadFolder);
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: botId,
            projectId: projectId,
            credentials: { username: autoChatInfo.username, password: autoChatInfo.password },
        });
        await libraryPage.openBotById({ projectId, botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99005_1] test interpretation', async () => {
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickInterpretation();
        await since('Interpretation should be displayed')
            .expect(await aibotChatPanel.isInterpretedAsDisplayed())
            .toBe(true);
        await aibotChatPanel.clickBotName();
        await aibotChatPanel.clickInterpretationAdvancedOption();
        await takeScreenshotByElement(
            aibotChatPanel.getInterpretationAdvancedOption(),
            'TC99005_1',
            'interpretation advanced expand'
        );
    });

    it('[TC99005_2] test snapshot', async () => {
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.takeSnapshot();
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Snapshot button(unpin) should be displayed')
            .expect(await aibotChatPanel.isSnapshotButtonUnpinDisplayed())
            .toBe(true);
        await aibotChatPanel.clickSnapshotUnpinButton();
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Snapshot button should be displayed')
            .expect(await aibotChatPanel.getChatBotPinIcon().isDisplayed())
            .toBe(true);
    });

    it('[TC99005_3] test image download', async () => {
        await browser.execute(() => {
            const originalCreateObjectURL = URL.createObjectURL;
            URL.createObjectURL = (blob) => {
                window.downloadedBlob = blob;
                return 'mocked-blob-url';
            };

            window.restoreCreateObjectURL = () => {
                URL.createObjectURL = originalCreateObjectURL;
            };
        });

        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickDownloadButton();

        const blob = await browser.execute(() => {
            const blob = window.downloadedBlob;
            return blob;
        });
        await since('Blob should be created').expect(blob).toBeDefined();

        const blobType = await browser.execute(() => window.downloadedBlob.type);
        await since('Blob type should be image/png').expect(blobType).toBe('image/png');

        // Restore the original createObjectURL function
        await browser.execute(() => window.restoreCreateObjectURL());
    });

    it('[TC99005_4] test csv/excel download for chart', async () => {
        const mockedExportRequest = await browser.mock('**/fulldata?conversationId=**');
        // ask question with bar chart
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airline with most flights delayed in bar chart');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        // wait for the export request to be captured
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 0),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        let payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[0]);
        since('The csv file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('csv');
        await aibotChatPanel.waitForExportComplete();
        let downloadFile = await findDownloadedFile({name:'',fileType:'.csv'});
        since(`The csv file for ${botName} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadFile.name,fileType:'.csv'})).toBe(true);

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 1),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
        payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[1]);
        since('The excel file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('xlsx');
        await aibotChatPanel.waitForExportComplete();
        downloadFile = await findDownloadedFile({name:'',fileType:'.xlsx'});
        since(`The excel file for ${botName} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadFile.name,fileType:'.xlsx'})).toBe(true);

        mockedExportRequest.clear();
    });

    it('[TC99005_5] test csv/excel download for grid', async () => {
        const mockedExportRequest = await browser.mock('**/fulldata?conversationId=**');
        // ask question with grid
        await aibotChatPanel.askQuestionNoWaitViz('show top 5 airlines with most flights delayed in grid');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToCsvButton();
        // wait for the export request to be captured
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 0),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        let payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[0]);
        since('The csv file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('csv');
        since('The grid is less than 1000 rows, the skipsqlexecution is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.skipSQLExecution).toBe(true);
        await aibotChatPanel.waitForExportComplete();
        let downloadFile = await findDownloadedFile({name:'',fileType:'.csv'});
        since(`The csv file for ${botName} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadFile.name,fileType:'.csv'})).toBe(true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickExportToExcelButton();
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 1),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
        payloadData = aibotChatPanel.getRequestPostData(mockedExportRequest.calls[1]);
        since('The excel file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('xlsx');
        since('The grid is less than 1000 rows, the skipsqlexecution is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.skipSQLExecution).toBe(true);
        await aibotChatPanel.waitForExportComplete();
        downloadFile = await findDownloadedFile({name:'',fileType:'.xlsx'});
        since(`The excel file for ${botName} was downloaded`)
        .expect(await isFileNotEmpty({name:downloadFile.name,fileType:'.xlsx'})).toBe(true);
        mockedExportRequest.clear();
    });
});
