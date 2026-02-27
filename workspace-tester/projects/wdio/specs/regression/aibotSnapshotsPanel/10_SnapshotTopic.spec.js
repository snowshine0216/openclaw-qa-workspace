import setWindowSize from '../../../config/setWindowSize.js';
import { snapshotBotUser } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import fs from 'fs';

describe('AIbotSnapshot_Topic', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const botInfo_01 = {
        data: {
            idtypes: [
                {
                    did: '0881F399FD425ACE5AB4D782C5DBCB54',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };

    const aibot = {
        id: 'FC9B0512B846524EDCD485A1F29B73AC',
        name: 'Topic',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);


    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC94986] Add Topic message to snapshot', async () => {
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/10_Topic_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Open Topic bot
        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Check copy/download button exist in Topic message
        const tag_copyButton = await aibotChatPanel.checkIfCopyScreenshotButtonExisting(1);
        await since(
            'CopyButton is existing and tag_copyButton is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(tag_copyButton)
            .toBe(true);

        const tag_downloadButton = await aibotChatPanel.checkIfDownloadButtonExisting(1);
        await since(
            'DownloadButton is existing and tag_downloadButton is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(tag_downloadButton)
            .toBe(true);

        // Add last Topic Message to Snapshot
        await since('Initial snapshot card number is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(4);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();
        await since(
            'Add 1 topic snapshot, the snapshot card number is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(5);
        await aibotChatPanel.ClickUnpinNthChatAnswerFromEnd(1);

        // Search snapshot
        await aibotSnapshotsPanel.searchByText('Sales Growth by Region');
        await since('Snapshot of specific answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);

        // Clear search
        await aibotSnapshotsPanel.clearSearch();

        // Open focus mode
        const answerText = 'The comboChart visualization reveals the profitability of different product categories';
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByText(answerText);
        await snapshot.clickMaximizeButton();
        await snapshotDialog.clickInterpretationButton();
        await since('Interpretation displayed is expected to be #{expected}, instead we have #{actual}}')
            .expect(await snapshotDialog.isInterpretationComponentDisplayed())
            .toBe(true);
        await snapshotDialog.clickCloseButton();

        // Sort by Category
        await aibotSnapshotsPanel.setSortBy('Category');
        await aibotSnapshotsPanel.setSortBy('Z-A');

        // Move snapshot to other category
        await snapshot.clickMoveButton();
        await snapshot.selectMoveToCategory('Others');
        const othersCategoryArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('Others');
        await othersCategoryArea.isDisplayed();
        await since('Category Others is created to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.isExisting())
            .toBe(true);
        await since('Snapshot card was moved to Others category to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.getSnapshotCardInsideByText(answerText).isExisting())
            .toBe(true);

        // Rename snapshot title
        const newTitleRaw = '<h>html</h>';
        const newTitle = '<h>html<h>';
        await snapshot.renameSnapshotTitle(newTitleRaw);

        // Ask again twice
        await snapshot.copySnapshotTitle();
        await snapshot.copySnapshotTitle();
        await since(
            'Ask again twice the content in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(newTitle);

        // Exit bot
        await aibotChatPanel.goToLibrary();
    });
});
