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
import { checkCopiedImage, checkDownloadedImage } from '../../../utils/compareImage.js';

describe('AIbotSnapshot_Interpretation_PowerUser', () => {
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
        id: '6CEB7FEE8349E760364F448EC26311AF',
        name: 'Interpretation',
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

    const answer1 = 'The average revenue per order varies slightly by region';

    it('[TC93553_1] PowerUser - show interpretation and close', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '0B65EC04464B2B9410DD07AE23C67C8B',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/09_Interpretation_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openBotById({ projectId: aibot.project.id, botId: '6CEB7FEE8349E760364F448EC26311AF' });
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        const interpretationButton_black = await snapshotCard.getInterpretationButton();
        await checkElementByImageComparison(interpretationButton_black, 'snapshots/TC93553_1', 'InterpretationButton_black', 1);
        await snapshotCard.showInterpretationContent();
        await since('Interpretation text should contain #{expected}, instead we have #{actual}')
            .expect(await snapshotCard.getInterpretationContentText())
            .toContain('Revenue per Order');
        await snapshotCard.setInterpretationText('Provide the AVG_avg revenue per Order by Region');
        const InterpretationContent = await snapshotCard.getInterpretationContent();
        await checkElementByImageComparison(InterpretationContent, 'snapshots/TC93553_1', 'InterpretationContent', 1);
        const interpretationButton_blue = await snapshotCard.getInterpretationButton();
        await checkElementByImageComparison(interpretationButton_blue, 'snapshots/TC93553_1', 'InterpretationButton_blue', 1);
        await snapshotCard.closeInterpretationButton();
        const tag_interpretationContent = await snapshotCard.getInterpretationContent().isExisting();
        await since('interpretationContent is closed and tag is expected to be #{expected}, instead we have #{actual}')
            .expect(tag_interpretationContent)
            .toBe(false);
        await libraryPage.clickLibraryIcon();
    });

    it('[TC93553_2] PowerUser - snapshot manipulations (search, sort)', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '0B65EC04464B2B9410DD07AE23C67C8B',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/09_Interpretation_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openBotById({ projectId: aibot.project.id, botId: '6CEB7FEE8349E760364F448EC26311AF' });
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        await snapshotCard.showInterpretationContent();

        await aibotSnapshotsPanel.setSortBy('Category');
        await aibotSnapshotsPanel.setSortBy('Z-A');
        const tag_interpretationContent1 = await snapshotCard.getInterpretationContent().isExisting();
        await since('interpretationContent is open and tag is expected to be #{expected}, instead we have #{actual}')
            .expect(tag_interpretationContent1)
            .toBe(true);

        await aibotSnapshotsPanel.searchByText('What is');
        const tag_interpretationContent2 = await snapshotCard.getInterpretationContent().isExisting();
        await since('interpretationContent is open and tag is expected to be #{expected}, instead we have #{actual}')
            .expect(tag_interpretationContent2)
            .toBe(true);

        await libraryPage.clickLibraryIcon();
    });

    it('[TC93553_3] PowerUser - focus view (view more/view less)', async () => {
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '0B65EC04464B2B9410DD07AE23C67C8B',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/09_Interpretation_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openBotById({ projectId: aibot.project.id, botId: '6CEB7FEE8349E760364F448EC26311AF' });
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        await snapshotCard.showInterpretationContent();
        await snapshotCard.clickMaximizeButton();

        const maximizedSnapshot_interpretationClose = await snapshotDialog.getSnapshotDialog();
        //await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(
            maximizedSnapshot_interpretationClose,
            'snapshots/TC93553_3',
            'maximizedSnapshot_interpretationClose',
            2
        );

        await snapshotDialog.clickInterpretationButton();
        await snapshotDialog.clickLongContentButton();
        const maximizedSnapshot_interpretationOpen = await snapshotDialog.getSnapshotDialog();
        await checkElementByImageComparison(
            maximizedSnapshot_interpretationOpen,
            'snapshots/TC93553_3',
            'maximizedSnapshot_interpretationOpen',
            2
        );
        await snapshotDialog.clickCloseButton();

        await libraryPage.clickLibraryIcon();
    });
});
