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

describe('AIbotSnapshotPanel', () => {
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
        id: '05A185978A47DAEBF53CD2873EFCB44D',
        name: 'SnapshotTheme-sort',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const aibot2 = {
        id: 'FEA65F40834BCFD8835F5CA65F343EC7',
        name: 'SnapshotCategory',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);

    const answer1 = 'The top 3 cities in terms of revenue are:';
    const answer2 = 'The overall average of Profit is';

    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92414_1] AI Bot Snapshot: Check theme and sort', async () => {
        // Bot01 in 02_SnapshotsPanel
        const botInfo_01 = {
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
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
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

        await libraryPage.openDossier(aibot1.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Sort by Date
        await aibotSnapshotsPanel.setSortBy('Date Created');
        await aibotSnapshotsPanel.setSortBy('Oldest on Top');
        const sortByDateButton = await aibotSnapshotsPanel.getSortButton();
        await checkElementByImageComparison(
            sortByDateButton,
            'snapshots/TC92414_1',
            'snapShotPanel_checkSortByDateButton',
            0.5
        );

        const oldestCard = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(oldestCard, 'snapshots/TC92414_1', 'snapShotPanel_oldestCard', 2);

        // Sort by Category
        await aibotSnapshotsPanel.setSortBy('Category');
        await aibotSnapshotsPanel.setSortBy('Z-A');
        const sortByCategoryButton = await aibotSnapshotsPanel.getSortButton();
        await checkElementByImageComparison(
            sortByCategoryButton,
            'snapshots/TC92414_1',
            'snapShotPanel_checkSortByCategoryButton',
            0.5
        );

        const lastCardByCategory = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(
            lastCardByCategory,
            'snapshots/TC92414_1',
            'snapShotPanel_lastCardByCategory',
            2
        );

        // Check Theme
        const snapShotPanel = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(snapShotPanel, 'snapshots/TC92414_1', 'snapShotPanel_checkTheme', 2);

        // Maximize snapshot
        const answertmp = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        const answerText1 = await answertmp.getText();
        const snapShotCard1 = aibotSnapshotsPanel.getSnapshotCardByText(answerText1);
        await snapShotCard1.clickMaximizeButton();
        const maximizedSnapshot = await snapshotDialog.getSnapshotDialog();
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(maximizedSnapshot, 'snapshots/TC92414_1', 'maximizedSnapshot_Heatmap', 2);

        // Delete snapshot
        await snapshotDialog.clickDeleteButton();
        await snapshotDialog.confirmDelete();

        // Add snapshot
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        const answerText_tmp = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        const answerText_check1 = await answerText_tmp.getText();
        const snapShotCard_check1 = aibotSnapshotsPanel.getSnapshotCardByText(answerText_check1);
        await since('Snapshot is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapShotCard_check1.isDisplayed())
            .toBe(true);

        // Search and check results
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await aibotSnapshotsPanel.searchByText('Electronics:');
        const searchResult = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(searchResult, 'snapshots/TC92414_1', 'snapShotPanel_searchResult', 2);

        // Search and check no result
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await aibotSnapshotsPanel.clearSearch();
        await aibotSnapshotsPanel.searchByText('Test no result');
        const searchNoResult = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(searchNoResult, 'snapshots/TC92414_1', 'snapShotPanel_searchNoResult', 2);

        await libraryPage.clickLibraryIcon();
    });

    it('[TC92414_2] AI Bot Snapshot: Rename snapshots', async () => {
        // Bot02 in 02_SnapshotsPanel
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: '73219EAF0C428378A725C8B4B6EDB54B',
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
        const filePath = 'specs/regression/aibotSnapshotsPanel/02_Panel_Bot02.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openDossier(aibot2.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        // Check snapshot number
        const snapshotNumber = await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard();
        await since('Category number is to be #{expected}, instead we have #{actual}').expect(snapshotNumber).toBe(3);

        // Collapse/open snapshot
        const categoryArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('City-wise Sales');
        await categoryArea.clickCollapseButton();
        const category_collspse = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(
            category_collspse,
            'snapshots/TC92414_2',
            'snapShotPanel_CategoryCityWiseSales_Collapse',
            2.5
        );

        await categoryArea.clickCollapseButton();
        const categoryCityWise = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(
            categoryCityWise,
            'snapshots/TC92414_2',
            'snapShotPanel_CategoryCityWiseSales',
            2
        );

        // Rename snapshot
        await categoryArea.renameCategory('');
        await since('Category City-wise Sales is created to be #{expected}, instead we have #{actual}')
            .expect(await categoryArea.isDisplayed())
            .toBe(true);

        await categoryArea.renameCategory('invalide chars []/');
        const newCategoryArea_1 = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('invalide chars');
        await since('Category City-wise Sales is created to be #{expected}, instead we have #{actual}')
            .expect(await newCategoryArea_1.isDisplayed())
            .toBe(true);

        await newCategoryArea_1.renameCategory('Sales by Subcategory');
        const newCategoryArea_2 = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('invalide chars');
        await since('Category City-wise Sales is created to be #{expected}, instead we have #{actual}')
            .expect(await newCategoryArea_2.isDisplayed())
            .toBe(true);

        await newCategoryArea_2.renameCategory('Cannot rename over 25 charactors');
        const newCategoryArea_3 = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('Cannot rename over 25 cha');
        await since('Category City-wise Sales is created to be #{expected}, instead we have #{actual}')
            .expect(await newCategoryArea_3.isDisplayed())
            .toBe(true);

        await newCategoryArea_3.renameCategory('City-wise Sales');
        const newCategoryArea_4 = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('City-wise Sales');
        await since('Category City-wise Sales is created to be #{expected}, instead we have #{actual}')
            .expect(await newCategoryArea_4.isDisplayed())
            .toBe(true);

        await libraryPage.clickLibraryIcon();
    });

    it('[TC92414_3] AI Bot Snapshot: Rename snapshot title', async () => {
        // Bot02 in 02_SnapshotsPanel
        const botInfo_02 = {
            data: {
                idtypes: [
                    {
                        did: '73219EAF0C428378A725C8B4B6EDB54B',
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
        const filePath = 'specs/regression/aibotSnapshotsPanel/02_Panel_Bot02.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openDossier(aibot2.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        const snapshotCard1 = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        await snapshotCard1.renameSnapshotTitle('This is the new name');
        const newSnapshotTitle = await snapshotCard1.getSnapshotOperations();
        await checkElementByImageComparison(
            newSnapshotTitle,
            'snapshots/TC92414_3',
            'renameSnapshotTitle_newSnapshotName',
            1
        );

        await libraryPage.clickLibraryIcon();
    });

    it('[TC92414_4] AI Bot Snapshot: Copy snapshot title', async () => {
        const botInfo_01 = {
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
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
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

        await libraryPage.openDossier(aibot1.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        await aibotSnapshotsPanel.searchByText(answer2);
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer2);
        await snapshotCard.copySnapshotTitle();
        const queryBox = await aibotChatPanel.getInputBox();
        /* 
        Exist unexpected special character.
        const snapshotTitle = await snapshotCard1.getSnapshotTitle();
        const inputContent = await aibotChatPanel.getInputBox().getText();
        await since('Content in querybox is expected to be #{expected}, instead we have #{actual}')
        .expect(inputContent)
        .toBe(snapshotTitle);
        */
        await checkElementByImageComparison(queryBox, 'snapshots/TC92414_4', 'copySnapshotTitle_queryBox_bold', 1);
        await libraryPage.clickLibraryIcon();
    });
});
