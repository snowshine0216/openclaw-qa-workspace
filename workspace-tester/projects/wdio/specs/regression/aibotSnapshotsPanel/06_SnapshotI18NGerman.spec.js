import setWindowSize from '../../../config/setWindowSize.js';
import { snapshotBotUserGerman } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import fs from 'fs';

describe('AIbotSnapshotI18NGerman', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot_de',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const botInfo_01 = {
        data: {
            idtypes: [
                {
                    did: 'DA7BD20D5747648C7CCF83855AF807C6',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };

    const aibot = {
        id: 'F20C0AE87A403136CDC6C8AFAE13A6A8',
        name: 'SanityTestSnapshotI18NGerman',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);

    beforeAll(async () => {
        await loginPage.login(snapshotBotUserGerman);
        await setWindowSize(browserWindow);
        aibotSnapshotsPanel.setLanguage('de');
        snapshotDialog.setLanguage('de');
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        aibotSnapshotsPanel.setLanguage('en');
        snapshotDialog.setLanguage('en');
        await logoutFromCurrentBrowser();
    });

    const answer1 = 'Die Regionen mit dem höchsten Umsatz sind:';
    it('[TC92571_4] Check empty snapshot panel in German', async () => {
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/06_I18NGerman_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }

        const snapshotPanelHeader = await aibotSnapshotsPanel.getSnapshotPanelHeader();
        await since('Snapshot panel header in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotPanelHeader.getText())
            .toBe('Meine Snapshots');

        const emptySnapshotPanel = await aibotSnapshotsPanel.getEmptySnapshotPanel();
        await since(
            'Empty Snapshot panel content text in German is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await emptySnapshotPanel.getText())
            .toBe('Machen Sie einen Snapshot Ihrer Antworten, um sie später erneut zu lesen.');
        await checkElementByImageComparison(emptySnapshotPanel, 'snapshots/TC92571', 'emptySnapshotPanel in German', 2);
    });

    it('[TC92571_5] Check chat answer and sort in German', async () => {
        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        const chatAnswer = aibotChatPanel.getChatAnswerByText(answer1, 'de');
        const copyTooltip = await chatAnswer.hoverAndGetTooltip(await chatAnswer.getCopyButton());
        await since('Copy button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await copyTooltip.getText())
            .toBe('Als Bild kopieren');

        const downloadTooltip = await chatAnswer.hoverAndGetTooltip(await chatAnswer.getDownloadButton());
        await since('Download button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await downloadTooltip.getText())
            .toBe('Herunterladen');

        const addToSnapshotTooltip = await chatAnswer.hoverAndGetTooltip(await chatAnswer.getPinButton());
        await since(
            'Add to snapshot button tooltip text in German is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await addToSnapshotTooltip.getText())
            .toBe('Snapshot erstellen');

        await chatAnswer.clickPinButton();
        const toast = await aibotChatPanel.getToastbyMessage('Snapshot hinzugefügt');
        await toast.isDisplayed();

        await aibotSnapshotsPanel.clickSortButton();
        const sortContentDate = await aibotSnapshotsPanel.getSortContent();
        await checkElementByImageComparison(sortContentDate, 'snapshots/TC92571', 'Sort by date content in German', 1);
        await aibotSnapshotsPanel.esc();

        await aibotSnapshotsPanel.setSortBy('Kategorie');

        await aibotSnapshotsPanel.clickSortButton();
        const sortContentCategory = await aibotSnapshotsPanel.getSortContent();
        await checkElementByImageComparison(
            sortContentCategory,
            'snapshots/TC92571',
            'Sort by category content in German',
            1
        );
        await aibotSnapshotsPanel.esc();

        const searchInput = await aibotSnapshotsPanel.getSearchInput();
        await since('Search input placeholder text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await searchInput.getAttribute('placeholder'))
            .toBe('Suchen');

        const snapshotArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('Kategorie', 'de');
        await snapshotArea.clickThreeDotsButton();
        const categoryMenu = await snapshotArea.getCategoryMenu();
        await checkElementByImageComparison(categoryMenu, 'snapshots/TC92571', 'Category content menu in German', 1);
        await snapshotArea.esc();

        // Search and check no result
        //await aibotSnapshotsPanel.clearSearch();
        await aibotSnapshotsPanel.searchByText('Test no result');
        const searchNoResult = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(
            searchNoResult,
            'snapshots/TC92571',
            'Check snapshot with no search result in German',
            2
        );
        await aibotSnapshotsPanel.clearSearch();
    });

    it('[TC92571_6] Check snapshot card and dialog in German', async () => {
        await libraryPage.openDossier(aibot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1, 'de');
        await snapshotCard.clickSeeMoreButton();
        await snapshotCard.clickSeeLessButton();

        const maximizeTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getMaximizeButton());
        await since('Maximize button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await maximizeTooltip.getText())
            .toBe('Maximieren');

        const moveTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getMoveButton());
        await since('Move button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await moveTooltip.getText())
            .toBe('Verschieben');

        const copyTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getCopyButton());
        await since('Copy button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await copyTooltip.getText())
            .toBe('Als Bild kopieren');

        const downloadTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getDownloadButton());
        await since('Download button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await downloadTooltip.getText())
            .toBe('Herunterladen');

        const deleteTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getDeleteButton());
        await since('Delete button tooltip text in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await deleteTooltip.getText())
            .toBe('Löschen');

        await snapshotCard.clickMaximizeButton();
        const savedTime = await snapshotDialog.getSavedTime();
        await since('Snapshot dialog in German is expected to be #{expected}, instead we have #{actual}')
            .expect(await savedTime.getText())
            .toBe('Gespeichert unter 12/10/2023 10:24PM');
        await snapshotDialog.clickCloseButton();

        await snapshotCard.clickMoveButton();
        const moveDialog = await snapshotCard.getMoveDialog();
        await checkElementByImageComparison(moveDialog, 'snapshots/TC92571', 'Move dialog in German', 1);
        await snapshotCard.esc();

        await aibotSnapshotsPanel.setSortBy('Erstellungsdatum');

        await snapshotCard.clickDeleteButton();
        const confirmationDialog = await snapshotCard.getConfirmDeleteDialog();
        await checkElementByImageComparison(
            confirmationDialog,
            'snapshots/TC92571',
            'Delete confirmation dialog in German',
            1
        );
        await snapshotCard.confirmDelete();
    });
});
