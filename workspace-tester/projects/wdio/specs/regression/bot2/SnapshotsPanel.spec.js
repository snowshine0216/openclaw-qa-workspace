import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { project_applicationTeam } from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { clearBotV2SnapshotsByAPI } from '../../../api/bot2/snapshotAPI.js';
import detectBlob from '../../../utils/detectBlob.js';
import { isFileNotEmpty, deleteFolderContents, findDownloadedFile } from '../../../config/folderManagement.js';
import path from 'path';
import { fileURLToPath } from 'url';

//TODO: Need to update after the tanzu automation environment is ready
const snapshotBotUser = {
    username: 'bot2_auto_snapshot',
    password: '',
};

const snapshotBot = {
    botId: 'A9DFA37D21164859990E7F4BAE2B292A',
    name: '_Auto_ Snapshort',
    projectId: project_applicationTeam.id,
};

let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog, historyPanel } = browsers.pageObj1;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadFolder = path.resolve(__dirname, '../../../downloads');

let downloadFile = null;

describe('Bot2 Snapshot Panel', () => {
    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
    });

    beforeEach(async () => {
        await deleteFolderContents(downloadFolder);
        await clearBotV2SnapshotsByAPI({
            ...snapshotBot,
            credentials: snapshotBotUser,
        });
        await libraryPage.openBotById(snapshotBot);
        await aibotChatPanel.clickHistoryChatButton();
        const isCategory2025Open = await historyPanel.isChatCategoryOpen('2025');
        if (!isCategory2025Open) {
            await historyPanel.clickChatCategoryHeader('2025');
        }
        await historyPanel.switchToChat('Category profit data query');
        await historyPanel.closeChatHistoryPanel();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99010_1] SanityTestSnapshot: Add, Delete, Clear all snapshots', async () => {
        await since('SnapshotPanel closed is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isSnapshotPanelClosed())
            .toBe(true);

        infoLog('Add snapshot to panel');
        const lastAnswer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEndV2(1);
        const lastAnswerText = await lastAnswer.getText();
        const pinButton = await aibotChatPanel.getPinButtonOfNthChatAnswer(1);
        await since('Pin button is expected to be displayed, instead we have #{actual}')
            .expect(await pinButton.isExisting())
            .toBe(true);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();

        infoLog('Check the Snapshot panel icon with dot means new snapshot added');
        await since('new snapshot notification icon is to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isDotInSnapshotPanelButtonV2())
            .toBe(true);

        infoLog('Check snapshot panel');
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await libraryPage.sleep(4000);
        await since('unread icon disappear after 3s in snapshot which is to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getSnapshotCardByTextV2(lastAnswerText).getUnreadIconV2().isExisting())
            .toBe(false);

        infoLog('Close snapshot panel and check dot disappered');
        await aibotSnapshotsPanel.closeSnapshotsPanel();
        await aibotChatPanel.isSnapshotPanelClosed();

        infoLog('Check the snapshot panel button, no notification dot anymore');
        await since('new snapshot notification icon is to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isDotInSnapshotPanelButtonV2())
            .toBe(false);

        infoLog('Unpin button is blue');
        const unPinButton = await aibotChatPanel.getUnpinButtonOfNthChatAnswer(1);
        await since('Unpin button is expected to be #{expected}, instead we have #{actual}')
            .expect(await unPinButton.isExisting())
            .toBe(true);

        infoLog('Delete snapshot');
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        await snapshot.hoverAndGetTooltip(await snapshot.getDeleteButton());
        await snapshot.clickDeleteButton();
        await snapshot.confirmDelete();
        await libraryPage.sleep(1000);
        await since('Snapshot deleted is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(0);

        infoLog('Clear all snapshots');
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotSnapshotsPanel.clickClearSnapshots();
        await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        await since('Snapshot cleared is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(0);
    });

    it('[TC99010_3] Snapshot Manipulation In Snapshot Card', async () => {
        infoLog('Add last answer to the snapshot panel and open snapshot panel');
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.clickOpenSnapshotPanelButton();

        infoLog('check interpretation function of snapshot card');
        await aibotSnapshotsPanel.clickInterpretationFromSnapshot();
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        await since('Interpretation component is expected to be displayed, instead we have #{actual}')
            .expect(await snapshotCard.getInterpretationContent().isExisting())
            .toBe(true);
        const InterpretationTitle = await snapshotCard.getInterpretationContentTitle();
        await since('interpretation title shoule be #{expected}, instead we have #{actual}').expect(InterpretationTitle).toBe('Interpreted as:');
        await aibotSnapshotsPanel.clickInterpretationFromSnapshot();
        await since('Interpretation component is expected to be not displayed, instead we have #{actual}')
            .expect(await snapshotCard.getInterpretationContent().isExisting())
            .toBe(false);

        infoLog('check export csv function of snapshot card');
        // const csvBlob = await detectBlob(async () => {
        //     const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        //     await snapshotCard.clickExportCSVButton();
        // });
        // await since('Excel blob should be created').expect(csvBlob).toBeDefined();
        // await since('Excel blob should have csv type').expect(csvBlob.type).toBe('text/csv');
        const mockedExportRequest = await browser.mock('**/fulldata?conversationId=**');

        await snapshotCard.clickExportCSVButton();
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 0),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        let payloadData = aibotSnapshotsPanel.getRequestPostData(mockedExportRequest.calls[0]);
        since('The csv file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('csv');
        await aibotSnapshotsPanel.waitForExportComplete();
        downloadFile = await findDownloadedFile({name:'',fileType:'.csv'});
        since(`The csv file was downloaded should be #{expected}, instead we have #{actual}.`)
        .expect(await isFileNotEmpty({name:downloadFile.name, fileType:'.csv'})).toBe(true);

        infoLog('check export xls function of snapshot card');
        // const xlsBlob = await detectBlob(async () => {
        //     const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        //     await snapshotCard.clickExportExcelButton();
        // });
        // await since('Excel blob should be created').expect(xlsBlob).toBeDefined();
        // await since('Excel blob should have xls type')
        //     .expect(xlsBlob.type)
        //     .toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await snapshotCard.clickExportExcelButton();
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 1),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        payloadData = aibotSnapshotsPanel.getRequestPostData(mockedExportRequest.calls[1]);
        since('The excel file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('xlsx');
        await aibotSnapshotsPanel.waitForExportComplete();
        downloadFile = await findDownloadedFile({name:'',fileType:'.xlsx'});
        since(`The excel file was downloaded should be #{expected}, instead we have #{actual}.`)
        .expect(await isFileNotEmpty({name:downloadFile.name, fileType:'.xlsx'})).toBe(true);

        infoLog('check download function of snapshot card');
        const imgBlob = await detectBlob(async () => {
            const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
            await snapshotCard.clickDownloadButton();
        });
        await since('Image blob should be created').expect(imgBlob).toBeDefined();
        await since('Image blob should have image type').expect(imgBlob.type).toBe('image/png');

        mockedExportRequest.clear();
    });

    it('[TC99010_4] Snapshot Manipulation In Snapshot Dialog', async () => {
        infoLog('Add last answer to the snapshot panel and open snapshot panel');
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.clickOpenSnapshotPanelButton();

        infoLog('Open snapshot dialog');
        await aibotSnapshotsPanel.clickMaximizeButton(0);

        infoLog('check interpretation function of snapshot dialog');
        await snapshotDialog.clickInterpretationButton();
        await since('Interpretation component is expected to be displayed, instead we have #{actual}')
            .expect(await snapshotDialog.isInterpretationComponentDisplayed())
            .toBe(true);
        await snapshotDialog.clickInterpretationButton();
        await since('Interpretation component is expected to be not displayed, instead we have #{actual}')
            .expect(await snapshotDialog.isInterpretationComponentDisplayed())
            .toBe(false);

        // export csv
        infoLog('check export csv function of snapshot dialog');
        const mockedExportRequest = await browser.mock('**/fulldata?conversationId=**');

        await snapshotDialog.clickExportCSVButton();
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 0),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        let payloadData = snapshotDialog.getRequestPostData(mockedExportRequest.calls[0]);
        since('The csv file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('csv');
        downloadFile = await findDownloadedFile({name:'',fileType:'.csv'});
        since(`The csv file was downloaded should be #{expected}, instead we have #{actual}.`)
        .expect(await isFileNotEmpty({name:downloadFile.name, fileType:'.csv'})).toBe(true);

        // export excel
        infoLog('check export excel function of snapshot dialog');
        await snapshotDialog.clickExportExcelButton();
        await browser.waitUntil(
            async () => (mockedExportRequest.calls.length > 1),
            {
              timeout: 5000,
              timeoutMsg: 'no export request was captured',
            }
          );
                    
        payloadData = aibotSnapshotsPanel.getRequestPostData(mockedExportRequest.calls[1]);
        since('The excel file is exported, the type is supposed to be #{expected}, instead we have #{actual}.')
            .expect(payloadData.type).toEqual('xlsx');
        downloadFile = await findDownloadedFile({name:'',fileType:'.xlsx'});
        since(`The excel file was downloaded should be #{expected}, instead we have #{actual}.`)
        .expect(await isFileNotEmpty({name:downloadFile.name, fileType:'.xlsx'})).toBe(true);

        // download image
        infoLog('check download function of snapshot dialog');
        const imgBlob = await detectBlob(async () => {
            await snapshotDialog.clickDownloadButton();
        });
        await since('Image blob should be created').expect(imgBlob).toBeDefined();
        await since('Image blob should have image type').expect(imgBlob.type).toBe('image/png');

        infoLog('close snapshot dialog');
        await snapshotDialog.clickCloseButton();
        await since('Snapshot dialog is expected to be not displayed, instead we have #{actual}')
            .expect(await snapshotDialog.isSnapshotDialogDisplayed())
            .toBe(false);

        infoLog('check delete function of snapshot Panel');
        await aibotSnapshotsPanel.clickMaximizeButton(0);
        await snapshotDialog.clickDeleteButton();
        await snapshotDialog.confirmDelete();
        await since('Snapshot deleted is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isSnapshotDialogDisplayed())
            .toBe(false);

        mockedExportRequest.clear();
    });

});
