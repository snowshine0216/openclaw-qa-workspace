import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { project_applicationTeam } from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { setBotV2SnapshotsSortByAPI } from '../../../api/bot2/snapshotAPI.js';

const snapshotBotUser = {
    username: 'bot2_auto_snapshot',
    password: '',
};

const snapshotBotWithTwoSnapshots = {
    botId: '15B0BFF575A34D528795E9173418E33A',
    name: '[Auto] Snapshot With 2 Snapshots',
    projectId: project_applicationTeam.id,
};

describe('Bot2 Snapshot Panel Sort & Search', () => {
    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, historyPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
    });

    beforeEach(async () => {
        await setBotV2SnapshotsSortByAPI({
            ...snapshotBotWithTwoSnapshots,
            credentials: snapshotBotUser,
            sortBy: 'date-',
        });
        await libraryPage.openBotById(snapshotBotWithTwoSnapshots);
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.clickChatCategoryHeader('2025');
        await historyPanel.switchToChat('Test Chat');
        await historyPanel.closeChatHistoryPanel();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });
    it('[TC99010_2] Bot2 Snapshot: Snapshot panel manipulation sort/search', async () => {
        infoLog('click open snapshot panel button');
        await aibotChatPanel.clickOpenSnapshotPanelButton();

        infoLog('get the last 2 answers text');
        const lastAnswer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEndV2(1);
        const lastAnswerText = (await lastAnswer.getText()).substring(0, 40);
        infoLog('last answer text: ' + lastAnswerText);

        infoLog('search the last answer text in snapshot panel');
        await aibotSnapshotsPanel.searchByText(lastAnswerText);

        infoLog('check the snapshot card is displayed');
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByTextV2(lastAnswerText);
        await since('Snapshot card is expected to be displayed, instead we have #{actual}')
            .expect(await snapshotCard.isDisplayed())
            .toBe(true);

        infoLog('check the another snapshot card is not displayed');
        const snapshotCard2 = aibotSnapshotsPanel.getSnapshotCardByTextV2(
            'Another answer text should not be displayed'
        );
        await since('Snapshot card is expected to be not displayed, instead we have #{actual}')
            .expect(await snapshotCard2.isDisplayed())
            .toBe(false);

        await aibotSnapshotsPanel.clearSearch();

        infoLog('check snapshot cards sorting');
        const firstSnapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        const firstSnapshotCardTitle = await firstSnapshotCard.getSnapshotTitle();
        infoLog('first snapshot card title: ' + firstSnapshotCardTitle);

        infoLog('sort by date created, oldest on top');
        await aibotSnapshotsPanel.setSortBy('Date Created');
        await aibotSnapshotsPanel.setSortBy('Oldest on Top');

        const firstSnapshotCardAfterSorting = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        const firstSnapshotCardAfterSortingTitle = await firstSnapshotCardAfterSorting.getSnapshotTitle();
        infoLog('first snapshot card title after sorting: ' + firstSnapshotCardTitle);

        await since('Snapshot card is expected to be #{expected}, instead we have #{actual}')
            .expect(firstSnapshotCardTitle)
            .not.toBe(firstSnapshotCardAfterSortingTitle);
    });
});
