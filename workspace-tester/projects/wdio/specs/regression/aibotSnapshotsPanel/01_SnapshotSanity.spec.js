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

describe('AIbotSnapshotSanity', () => {
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

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);

    const answerTrend =
        'trend of Revenue';
    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
        // console.log('iserverresetURL: ' + iServerRest);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92413] SanityTestSnapshot pin search category', async () => {
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

        // Open SanityTestSnapshot bot
        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        // Snapshot Panel should be Closed by default
        await since('SnapshotPanel closed is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isSnapshotPanelClosed())
            .toBe(true);

        // Add snapshot to panel
        const answer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        const answerText = await answer.getText();
        const pinButton = await aibotChatPanel.getPinButtonOfNthChatAnswer(1);
        await checkElementByImageComparison(pinButton, 'snapshots/TC92413', 'pinButton', 1);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();

        // Check the Snapshot panel icon with dot means new snapshot added
        const snapshotPanelIcon = await aibotChatPanel.getOpenSnapshotPanelButton();
        await checkElementByImageComparison(snapshotPanelIcon, 'snapshots/TC92413', 'buttonWithDot', 1);

        // Check snapshot panel
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await since('unread icon Existing in newly added snapshot top 5 subcategories is to be #{expected}, instead we have #{actual}')
            .expect(
                await aibotSnapshotsPanel
                    .getSnapshotCardByText('The top 5 subcategories by Revenue')
                    .getUnreadIcon()
                    .isExisting()
            )
            .toBe(true);
        await libraryPage.sleep(4000);
        await since('unread icon disappear after 3s in snapshot which is to be #{expected}, instead we have #{actual}')
            .expect(
                await aibotSnapshotsPanel
                    .getSnapshotCardByText('The top 5 subcategories by Revenue')
                    .getUnreadIcon()
                    .isExisting()
            )
            .toBe(false);
        // Close snapshot panel and check dot disappered
        await aibotSnapshotsPanel.closeSnapshotsPanel();
        await aibotChatPanel.isSnapshotPanelClosed();
        // Check the snapshot panel button, no notification dot anymore
        await since('new snapshot notification icon is to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getDotInSnapshotPanelButton().isExisting())
            .toBe(false);
        // Unpin button is blue
        const unPinButton = await aibotChatPanel.getUnpinButtonOfNthChatAnswer(1);
        await checkElementByImageComparison(unPinButton, 'snapshots/TC92413', 'unPinButton', 1);
        //await aibotChatPanel.clickCloseSnapshotAddedButton();

        // Open Snapshot panel again to sort/search
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        // Check default sort icon
        const sortButton = await aibotSnapshotsPanel.getSortButton();
        await sortButton.isDisplayed();
        await checkElementByImageComparison(sortButton, 'snapshots/TC92413', 'Default A-Z sort button display', 1);

        // Search snapshot
        await aibotSnapshotsPanel.searchByText('What are the top 5 subcategories by revenue?');
        await since('Snapshot of specific answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByText(answerText);
        await aibotSnapshotsPanel.setSnapshotTimeForAll('Yesterday');
        await checkElementByImageComparison(
            aibotSnapshotsPanel.getMySnapshotsPanel(),
            'snapshots/TC92413',
            'Only search result is displayed',
            1
        );

        // Open focus mode
        await snapshot.clickMaximizeButton();
        await snapshotDialog.setSavedTime('Saved at XX/XX/XXXX XX:XXXX');
        await checkElementByImageComparison(
            snapshotDialog.getSnapshotDialog(),
            'snapshots/TC92413',
            'Focus mode on',
            1
        );

        // Click see more button
        await snapshotDialog.clickSeeMoreButton();
        await checkElementByImageComparison(
            snapshotDialog.getSnapshotDialog(),
            'snapshots/TC92413',
            'Focus mode on with see more triggered',
            1
        );

        // Delete snapshot on focus mode
        await snapshotDialog.clickDeleteButton();
        await snapshotDialog.confirmDelete();
        await since('Snapshot of specific answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(0);

        // Clear search
        await aibotSnapshotsPanel.clearSearch();

        // Move snapshot to other category
        await aibotSnapshotsPanel.searchByText(answerTrend);
        const snapshot1 = aibotSnapshotsPanel.getSnapshotCardByText(answerTrend, 'en');
        await snapshot1.clickMoveButton();

        await snapshot1.selectMoveToCategory('Others');
        const othersCategoryArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('Others');
        await othersCategoryArea.isDisplayed();
        await since('Category Others is created to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.isExisting())
            .toBe(true);
        await since('Snapshot card was moved to Others category to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.getSnapshotCardInsideByText(answerTrend).isExisting())
            .toBe(true);

        // Delete snapshot on snapshot card
        await snapshot1.hoverAndGetTooltip(await snapshot1.getDeleteButton());
        await snapshot1.clickDeleteButton();
        await snapshot1.confirmDelete();
        await since('Category Others is created to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.isExisting())
            .toBe(false);
        await aibotSnapshotsPanel.clearSearch();

        // Add snapshot back
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(2);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();
        const revenueByQuarterCategoryArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('Revenue by Quarter');
        // await since('unread icon Existing in newly added snapshot trend is to be #{expected}, instead we have #{actual}')
        // .expect(
        //     await revenueByQuarterCategoryArea.getSnapshotCardInsideByText(answerTrend).getUnreadIcon().isExisting()
        // )
        // .toBe(true);
        await since('Category Revenue by Quarter is created to be #{expected}, instead we have #{actual}')
            .expect(await revenueByQuarterCategoryArea.getSnapshotCardInsideByText(answerTrend).isExisting())
            .toBe(true);
        //await aibotChatPanel.clickCloseSnapshotAddedButton();
        // Exit bot
        await aibotChatPanel.goToLibrary();
    });

    it('[TC92413_2] Clear all snapshots', async () => {
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

        // Open SanityTestSnapshot bot
        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        // Clear all snapshots
        await aibotSnapshotsPanel.clickClearSnapshots();
        const clearSnapshotsController = aibotSnapshotsPanel.getClearSnapshotsController();
        await checkElementByImageComparison(
            clearSnapshotsController,
            'snapshots/TC92413_2',
            'ClearSnapshotsController',
            1
        );
        await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        // Check empty snapshot panel
        const emptyContent = await aibotSnapshotsPanel.getEmptySnapshotPanel();
        await emptyContent.isDisplayed();
        await checkElementByImageComparison(
            emptyContent,
            'snapshots/TC92413_2',
            'EmptySnapshotsPanel_afterClearAll',
            2
        );
        // Exit bot
        await aibotChatPanel.goToLibrary();
    });
});
