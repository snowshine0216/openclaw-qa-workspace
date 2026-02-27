import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { snapshotBotUser } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import authentication from '../../../api/authentication.js';
import urlParser from '../../../api/urlParser.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import fs from 'fs';

describe('Reset_Example', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };
    // info used by bulkReadObjectsAPI
    const botInfo = {
        data: {
            idtypes: [
                {
                    did: 'AF34717FF34F0B336F409E988AA4757A',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };

    const aibot1 = {
        id: '2646F5C63740C1565BCED38F49154698',
        name: 'Bot_hy',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const credentials = {
        username: 'auto_ai_snapshot',
        password: '',
    };

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
    });

    xit('[TCxxxx01] Reset_Example: Save bot data to local json file', async () => {
        const iServerRest = 'http://mci-ze4yt-dev.hypernow.microstrategy.com:30037';
        const sessionID = await createSessionAPI({ iServerRest, basicInfo });
        const bot_data = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo });
        console.log('-------------------------originalBotData---------------------------------------------');
        console.log(bot_data);
        // Body data requested by bulkWriteObjectsAPI
        const bot_data_new = {
            save: bot_data.data,
        };
        // Save bot data to local file
        const jsonString = JSON.stringify(bot_data_new, null, 2); // The third parameter (2) is for indentation
        // Specify the file path where you want to save the JSON data
        const filePath = 'specs/regression/aibotSnapshotsPanel/bot_data_original_backup.json';
        fs.writeFileSync(filePath, jsonString);
        console.log('JSON data saved to', filePath);
    });

    xit('[TCxxxx02] Reset_Example: Reset bot by local json file', async () => {
        const iServerRest = 'http://mci-ze4yt-dev.hypernow.microstrategy.com:30037';
        const sessionID = await createSessionAPI({ iServerRest, basicInfo });
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        // Specify the file path from which you want to read the JSON data
        const filePath = 'specs/regression/aibotSnapshotsPanel/bot_data_original_backup.json';
        // Read the content of the file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        // Parse the JSON data into an object
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        console.log(botData);
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Test scripts
        await libraryPage.openDossier(aibot1.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        // Sort by Date
        await aibotSnapshotsPanel.setSortBy('Date Created');
        await aibotSnapshotsPanel.setSortBy('Oldest on Top');
        const sortByDateButton = await aibotSnapshotsPanel.getSortButton();
        await takeScreenshotByElement(sortByDateButton, 'TCxxxxx', 'snapShotPanel_checkSortByDateButton', {
            tolerance: 0.1,
        });
        const oldestCard = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await takeScreenshotByElement(oldestCard, 'TCxxxxx', 'snapShotPanel_oldestCard', { tolerance: 2 });
        // Maximize snapshot and delete
        const answertmp = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        const answerText1 = await answertmp.getText();
        const snapShotCard1 = aibotSnapshotsPanel.getSnapshotCardByText(answerText1);
        await snapShotCard1.clickMaximizeButton();
        const maximizedSnapshot = await snapshotDialog.getSnapshotDialog();
        await snapshotDialog.clickDeleteButton();
        await snapshotDialog.confirmDelete();
        await libraryPage.clickLibraryIcon();
    });

    afterAll(async () => {
        await loginPage.logout();
    });
});
