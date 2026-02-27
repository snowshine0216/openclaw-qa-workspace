import setWindowSize from '../../../config/setWindowSize.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import { snapshotBotUser, conEduProName } from '../../../constants/bot.js';
import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import fs from 'fs';

describe('AIbotSnapshot_xFunction', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const aibot = {
        id: '05A185978A47DAEBF53CD2873EFCB44D',
        name: 'SnapshotTheme-sort',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dataset = 'World populations';

    let {
        loginPage,
        libraryPage,
        aibotSnapshotsPanel,
        aibotChatPanel,
        snapshotDialog,
        botAuthoring,
        libraryAuthoringPage,
    } = browsers.pageObj1;
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);

    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92416_4] AI Bot Snapshot: Check snapshot in mobile view', async () => {
        // Bot01 in 02_SnapshotsPanel, use this bot to check mobile view
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: '42D45053FB416B4790016693F0F42FBD',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_02 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/02_Panel_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Set window size to mobile view
        await setWindowSize(aibotMinimumWindow);
        await libraryPage.openBotById({ projectId: aibot.project.id, botId: '05A185978A47DAEBF53CD2873EFCB44D' });

        // await since('In mobile view, isSnapshotPanelClosed is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await aibotChatPanel.isSnapshotPanelClosed())
        //     .toBe(true);
        // Open snapshot panel
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.openMobileViewSnapshotPanel();
        const snapshotPanel_mobileView = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(
            snapshotPanel_mobileView,
            'snapshots/TC92416_4',
            'snapshotPanel_mobileView',
            2
        );

        await aibotSnapshotsPanel.searchByText('$4,098,943');
        await since('Snapshot of specific answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByText('top 5 categories');

        await aibotSnapshotsPanel.clearSearch();
        await aibotSnapshotsPanel.clickBackToChatPanel();
        await libraryPage.clickLibraryIcon();
    });

    it('[TC92416_5] AI Bot Snapshot: Create new bot and check category', async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await libraryAuthoringPage.createBotWithDataset({ project: conEduProName, dataset: dataset });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Add snapshot to panel
        const answer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        const answerText = await answer.getText();
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();

        // Sort by category
        await aibotSnapshotsPanel.setSortBy('Category');
        await aibotSnapshotsPanel.setSortBy('Z-A');

        // Check category
        const snapshot1 = aibotSnapshotsPanel.getSnapshotCardByText(answerText, 'en');
        await snapshot1.clickMoveButton();
        await since('Count of category items should be #{expected}, instead we have #{actual}')
        .expect(await aibotSnapshotsPanel.getCategoryCount())
        .toBe(6);
    });
});
