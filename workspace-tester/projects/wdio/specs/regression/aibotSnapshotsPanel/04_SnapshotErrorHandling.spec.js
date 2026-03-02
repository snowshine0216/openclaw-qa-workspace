import setWindowSize from '../../../config/setWindowSize.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import { snapshotBotUser } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import fs from 'fs';

describe('AIbotSnapshotErrorHandling', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const aibot1 = {
        id: 'B6E3F2B9384DF67410DE43BE993D5311',
        name: 'SnapshotPanelDisabled',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot2 = {
        id: 'A9E270F7B74F6C5072239093C8F05D99',
        name: 'Hit50Limit',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot3 = {
        id: '1A29D5C7DA475FAFBBF681B6A5AE1EA8',
        name: 'EmptySnapshotPanel',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot4 = {
        id: 'E63E46CAB241643CF26317B06C1A63F6',
        name: 'EmptySnapshotPanel-Dark',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot5 = {
        id: 'BC2E3BE4804B568B4C1E4DB21D5A978C',
        name: 'EmptySnapshotPanel-Red',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot6 = {
        id: 'BD06B68DA54EE7945C007998C38D3C8B',
        name: 'VizError',
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
    const answer1 = 'The top 5 categories in terms of units sold are:';

    it('[TC92416_1] AI Bot Snapshot: Check SnapshotPanelDisabled', async () => {
        // Reset to bot's original state
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: 'D935D154ED488DB05A3C07AC3CF4CA2A',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openDossier(aibot1.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Check download/copd add snapshpt buttons
        const tag_snapshotPanel = await aibotSnapshotsPanel.getMySnapshotsPanel().isExisting();
        await since('Snapshot panel is disabled and tag is expected to be #{expected}, instead we have #{actual}')
            .expect(tag_snapshotPanel)
            .toBe(false);

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

        const tag_snapshotButton = await aibotChatPanel.checkIfSnapshotButtonExisting(1);
        await since(
            'SnapshotButton is not existing and tag_snapshotButton is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(tag_snapshotButton)
            .toBe(false);

        await libraryPage.clickLibraryIcon();
    });

    it('[TC92416_2] AI Bot Snapshot: Hit50Limit', async () => {
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: '91B48C2BAD42E19388780DA5DE65A72C',
                        tp: 89,
                        pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                    },
                ],
            },
        };
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_02 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/04_ErrorHandling_Bot02.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Open Hit50Limit bot
        await libraryPage.openDossier(aibot2.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Add snapshot to panel fail
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('The number of snapshots has exceeded the maximum of 50').isDisplayed();
        await aibotChatPanel.goToLibrary();
    });

    it('[TC92416_3] AI Bot Snapshot: EmptySnapshotPanel in different theme', async () => {
        await libraryPage.openDossier(aibot3.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Check empty snapshot panel with light theme
        const emptyContent = await aibotSnapshotsPanel.getEmptySnapshotPanel();
        await emptyContent.isDisplayed();
        await checkElementByImageComparison(emptyContent, 'snapshots/TC92416_3', 'Empty_Snapshot_panel', 2);

        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibot4.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Check empty snapshot panel with dark theme
        const emptyContentInDark = await aibotSnapshotsPanel.getEmptySnapshotPanel();
        await emptyContentInDark.isDisplayed();
        await checkElementByImageComparison(
            emptyContentInDark,
            'snapshots/TC92416_3',
            'Empty_Snapshot_panel_in_dark',
            2
        );

        await aibotChatPanel.goToLibrary();

        await libraryPage.openDossier(aibot5.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Check empty snapshot panel with red theme
        const emptyContentInYellow = await aibotSnapshotsPanel.getEmptySnapshotPanel();
        await emptyContentInYellow.isDisplayed();
        await checkElementByImageComparison(
            emptyContentInYellow,
            'snapshots/TC92416_3',
            'Empty_Snapshot_panel_in_red',
            2
        );

        await aibotChatPanel.goToLibrary();
    });

    it('[TC92416_6] AI Bot Snapshot: Check message for error viz', async () => {
        await libraryPage.openDossier(aibot6.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1, 'en');
        const errorVizCard = await snapshotCard.getSnapshotContent();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(errorVizCard, 'snapshots/TC92416_6', 'snapShotPanel_errorViz', 2);
        await snapshotCard.clickViewDetailsButton();
        const errorMessage = await snapshotCard.getErrorMessageDialog();
        await checkElementByImageComparison(errorMessage, 'snapshots/TC92416_6', 'snapShotPanel_errorMessageDialog', 1);
        await aibotChatPanel.goToLibrary();
    });
});
