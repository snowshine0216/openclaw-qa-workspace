import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import { snapshotBotUser } from '../../../constants/bot.js';

import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { checkCopiedImage, checkDownloadedImage } from '../../../utils/compareImage.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';

import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import fs from 'fs';


describe('AIbotCopyDownloadTest', () => {
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
        id: 'B310339858453AD6D7C9698C78AFD93D',
        name: 'SnapshotMap-copy/download',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot2 = {
        id: '11639288684F71787674A08EC56D72F3',
        name: 'CopyDownload',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot3 = {
        id: '6CEB7FEE8349E760364F448EC26311AF',
        name: 'Interpretation',
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

    const answer1 = 'The revenue contribution by subcategory over different regions shows significant variations.';
    const answer2 = 'From January 2014 to December 2016, there is a significant upward trend in revenue';
    const answer3 = 'The overall average of Revenue';
    const answer4 = 'Based on the forecast analysis for Revenue,';
    const answer5 = 'The total revenue is';
    const answer6 = 'The revenue contribution by subcategory';
    const answer7 = 'In 2015, the Order Count for different categories showed distinct trends';
    const answer8 = 'The data reveals that Video Equipment leads in revenue';
    const answer9 = 'The top two categories by profit';
    const answer10 = 'The revenue contribution by subcategory over the months';
    const answer11 = 'The average revenue per order varies slightly by region.';

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92415_1] SnapshotMap copy download', async () => {
        // Bot01 in 03_CopyDownload
        const botInfo_01 = {
            data: {
                idtypes: [
                    {
                        did: '1290F0ED784FC18701CD7DB99E025F11',
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
        const filePath = 'specs/regression/aibotSnapshotsPanel/03_CopyDownload_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Open SnapshotMap-copy/download bot
        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Check default sort icon
        const sortButton = await aibotSnapshotsPanel.getSortButton();
        await sortButton.isDisplayed();
        await takeScreenshotByElement(sortButton, 'TC92415', 'Default date sort button display', { tolerance: 0.5 });

        //Check pin button
        const answer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        const answerText = await answer.getText();
        const chatAnswer = aibotChatPanel.getChatAnswerByText(answerText);
        const pinButton = await chatAnswer.getPinButton();
        await pinButton.isDisplayed();

        // Copy and download snapshot on chat answer
        //await chatAnswer.clickCopyButton();
        //await checkCopiedImage('TC92415', 'MapSnapshotCopiedFromChatAnswer.png');
        await chatAnswer.clickDownloadButton();
        await checkDownloadedImage('Bot with Map', 'TC92415', 'MapSnapshotDownloadedFromChatAnswer');

        // Click see more on snapshot card
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answerText);
        await snapshotCard.clickSeeMoreButton();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await takeScreenshotByElement(
            snapshotCard.getElement(),
            'TC92415',
            'Map Snapshot Card with see more triggered',
            { tolerance: 0.5 }
        );

        // Copy and download snapshot on snapshot card
        //await snapshotCard.clickCopyButton();
        //await checkCopiedImage('TC92415', 'MapSnapshotCopiedFromSnapshotCard.png');
        await snapshotCard.clickDownloadButton();
        await checkDownloadedImage('Bot with Map', 'TC92415', 'MapSnapshotDownloadedFromSnapshotCard');

        // Maximize snapshot
        await snapshotCard.clickMaximizeButton();

        // Copy and download snapshot on focus mode
        // await snapshotDialog.clickSeeMoreButton();
        await snapshotDialog.setSavedTime('Saved at XX/XX/XXXX XX:XXXX');
        await takeScreenshotByElement(snapshotDialog.getSnapshotDialog(), 'TC92415', 'Map_Focus_mode_on', {
            tolerance: 2,
        });
        //await snapshotDialog.clickCopyButton();
        //await checkCopiedImage('TC92415', 'MapSnapshotCopiedFromFocusMode');
        await snapshotDialog.clickDownloadButton();
        await checkDownloadedImage('Bot with Map', 'TC92415', 'MapSnapshotDownloadedFromFocusMode');
        await snapshotDialog.clickCloseButton();

        await aibotChatPanel.goToLibrary();
    });

    it('[TC92415_2] SnapshotVisualization copy download', async () => {
        // Bot02 in 03_CopyDownload
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: 'BF58FD9FC343E0745F705ABE2B647F7C',
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
        const filePath = 'specs/regression/aibotSnapshotsPanel/03_CopyDownload_Bot02.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Open CopyDownload bot
        await libraryPage.openBotById({ projectId: aibot2.project.id, botId: aibot2.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        await aibotSnapshotsPanel.searchByText(answer1);
        const snapshotCard1 = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        //await snapshotCard1.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'CopyDownload_HeatMap.png');
        await snapshotCard1.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'CopyDownload_HeatMap');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer2);
        const snapshotCard2 = aibotSnapshotsPanel.getSnapshotCardByText(answer2);
        //await snapshotCard2.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'insightLineChartTrend.png');
        await snapshotCard2.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'insightLineChartTrend_HeatMap');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer3);
        const snapshotCard3 = aibotSnapshotsPanel.getSnapshotCardByText(answer3);
        //await snapshotCard3.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'keyDriver.png');
        await snapshotCard3.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'keyDriver');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer4);
        const snapshotCard4 = aibotSnapshotsPanel.getSnapshotCardByText(answer4);
        //await snapshotCard4.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'insightLineChartForecast.png');
        await snapshotCard4.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'insightLineChartForecast');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer5);
        const snapshotCard5 = aibotSnapshotsPanel.getSnapshotCardByText(answer5);
        //await snapshotCard5.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'KPI.png');
        await snapshotCard5.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'KPI');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer6);
        const snapshotCard6 = aibotSnapshotsPanel.getSnapshotCardByText(answer6);
        //await snapshotCard6.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'Pie.png');
        await snapshotCard6.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'Pie');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer7);
        const snapshotCard7 = aibotSnapshotsPanel.getSnapshotCardByText(answer7);
        //await snapshotCard7.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'Line.png');
        await snapshotCard7.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'Line');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer8);
        const snapshotCard8 = aibotSnapshotsPanel.getSnapshotCardByText(answer8);
        //await snapshotCard8.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'Bar.png');
        await snapshotCard8.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'Bar');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer9);
        const snapshotCard9 = aibotSnapshotsPanel.getSnapshotCardByText(answer9);
        //await snapshotCard9.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'Grid_2Row.png');
        await snapshotCard9.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'Grid_2Row');
        await aibotSnapshotsPanel.clearSearch();

        await aibotSnapshotsPanel.searchByText(answer10);
        const snapshotCard10 = aibotSnapshotsPanel.getSnapshotCardByText(answer10);
        //await snapshotCard10.clickCopyButton();
        //await checkCopiedImage('TC92415_2', 'Grid.png');
        await snapshotCard10.clickDownloadButton();
        await checkDownloadedImage('VizBot', 'TC92415_2', 'Grid');
        await aibotSnapshotsPanel.clearSearch();

        await aibotChatPanel.goToLibrary();
    });

    xit('[TC93546_5] Consumption - snapshot manipulations (copy/download)', async () => {
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
        const filePath = 'specs/regression/aibotSnapshotsPanel/08_Interpretation_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openBotById({ projectId: aibot3.project.id, botId: '6CEB7FEE8349E760364F448EC26311AF' });
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

        await snapshotCard.clickDownloadButton();
        await checkDownloadedImage('withInterpretation', 'TC93546_5', 'Download_withInterpretation');

        await libraryPage.clickLibraryIcon();
    });

    it('[TC93553_4] PowerUser - snapshot manipulations (search, sort, copy/download)', async () => {
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

        await libraryPage.openBotById({ projectId: aibot3.project.id, botId: '6CEB7FEE8349E760364F448EC26311AF' });
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer11);
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

        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await snapshotCard.clickMaximizeButton();
        await snapshotDialog.clickCloseButton();

        await snapshotCard.clickDownloadButton();
        await checkDownloadedImage('New Bot', 'TC93553_4', 'Download_withInterpretation', { tolerance: 0.5 });

        await libraryPage.clickLibraryIcon();
    });
});
