import setWindowSize from '../../../config/setWindowSize.js';
import { snapshotBotUser } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import fs from 'fs';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';


describe('AIbotSnapshot_Thumbdown', () => {
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
                    did: 'DB9CB6205D49422C577094B309CE7F61',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };

    const aibot = {
        id: '0FC315CE1D4B84BEE88DD4A0B4E8E81A',
        name: 'SanityTestSnapshot-pin/search/category',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        loginPage,
        libraryPage,
        aibotSnapshotsPanel,
        aibotChatPanel,
        snapshotDialog,
        botAuthoring,
        botConsumptionFrame,
    } = browsers.pageObj1;
    let customAppId = '';
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);

    const answer1 = 'Based on the trend';
    const answer2 = 'The top 5 categories by Revenue';
    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
        let customAppInfo = getRequestBody({
            name: 'ThumbdownAppOff',
            disclaimer: '',
            feedback: false,
        });
        customAppId = await createCustomApp({
            credentials: snapshotBotUser,
            customAppInfo: customAppInfo,
        });
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: snapshotBotUser,
            customAppIdList: [customAppId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC95332] Add thumbdown message to snapshot', async () => {
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/01_Sanity_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Open Sanity snapshot bot
        await libraryPage.openBotById({ projectId: aibot.project.id, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickOpenSnapshotPanelButton();

        // Click Thumb down for normal message (already added in snapshot) and check the icon in snapshot
        await aibotChatPanel.hoverNthChatAnswerFromEndtoClickThumbdown(2);
        await aibotSnapshotsPanel.searchByText(answer1);
        const snapshot1 = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        await since('Thumbdown icon for snapshot card is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot1.getThumbdownIcon().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            snapshot1.getThumbdownIcon(),
            'snapshots/TC95332',
            'Thumbdown displayed for snapshot',
            1
        );
        await snapshot1.clickMaximizeButton();
        await since('Thumbdown icon for focus mode is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isThumbdownIconDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            snapshotDialog.getThumbdownIcon(),
            'snapshots/TC95332',
            'Thumbdown displayed for focus mode',
            1
        );
        await snapshotDialog.clickCloseButton();
        await aibotSnapshotsPanel.clearSearch();

        // Click Thumb down for last message and add to snapshot, then check icon in snapshot
        await aibotChatPanel.hoverNthChatAnswerFromEndtoClickThumbdown(1);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();
        await aibotSnapshotsPanel.setSortBy('Date Created');
        const snapshot2 = aibotSnapshotsPanel.getSnapshotCardByText(answer2);
        await since('Thumbdown icon for newly added snapshot is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getThumbdownIcon().isDisplayed())
            .toBe(true);
        // Delete the snapshot with thumb down and add back, check the icon exist
        await snapshot2.hoverAndGetTooltip(await snapshot2.getDeleteButton());
        await snapshot2.clickDeleteButton();
        await snapshot2.confirmDelete();
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await since('Thumbdown icon for snapshot added again is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getThumbdownIcon().isDisplayed())
            .toBe(true);
        // Edit the bot check the thumb down icon and check icon in snapshot
        await botConsumptionFrame.clickEditButton();
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        await since('Thumbdown icon for bot authoring is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getThumbdownIcon().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            snapshot2.getThumbdownIcon(),
            'snapshots/TC95332',
            'Thumbdown for snapshot authoring',
            1
        );
        await snapshot2.clickMaximizeButton();
        await since('Thumbdown icon of focus mode for bot authoring is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isThumbdownIconDisplayed())
            .toBe(true);
        await snapshotDialog.clickCloseButton();
        // Exit bot
        await aibotChatPanel.goToLibrary();
        // open bot with thumbdown disabled
        await libraryPage.openBotById({ appId: customAppId, projectId: aibot.project.id, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await since('Thumbdown icon existing when AI config OFF is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getThumbdownIcon().isDisplayed())
            .toBe(false);

        // Exit bot
        await aibotChatPanel.goToLibrary();
    });
});
