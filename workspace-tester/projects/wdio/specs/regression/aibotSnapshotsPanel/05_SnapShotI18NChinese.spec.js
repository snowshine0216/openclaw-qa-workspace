import setWindowSize from '../../../config/setWindowSize.js';
import { snapshotBotUserChinese } from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import fs from 'fs';

describe('AIbotSnapshotI18NChinese', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot_cn',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const botInfo_01 = {
        data: {
            idtypes: [
                {
                    did: '04655FAD774F181C4025019CABEC118C',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };

    const aibot = {
        id: '5E0625429543E6D8C6118C8446D2BC9E',
        name: 'SanityTestSnapshotI18NChinese',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, aibotSnapshotsPanel, aibotChatPanel, snapshotDialog } = browsers.pageObj1;
    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);


    beforeAll(async () => {
        await loginPage.login(snapshotBotUserChinese);
        await setWindowSize(browserWindow);
        aibotSnapshotsPanel.setLanguage('zh');
        snapshotDialog.setLanguage('zh');
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

    const answer1 =
        '收益最高的五个地区分别是：东北、南、中、中-大西洋和Web';

    it('[TC92571_1] Check empty snapshot panel in Chinese', async () => {
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/05_I18NChinese_Bot01.json';
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

        const snapshotPanelHeader = await aibotSnapshotsPanel.getSnapshotPanelHeader();
        await since('Snapshot panel header in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await snapshotPanelHeader.getText())
            .toBe('我的快照');

        const emptySnapshotPanel = await aibotSnapshotsPanel.getEmptySnapshotPanel();
        await since(
            'Empty Snapshot panel content text in Chinese is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await emptySnapshotPanel.getText())
            .toBe('快照一下您的答案，以便稍后再次访问。');
        await checkElementByImageComparison(
            emptySnapshotPanel,
            'snapshots/TC92571',
            'emptySnapshotPanel in Chinese',
            2
        );
    });

    it('[TC92571_2] Check chat answer and sort in Chinese', async () => {
        await libraryPage.openBotById({ projectId: aibot.project.id, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        const chatAnswer = aibotChatPanel.getChatAnswerByText(answer1, 'zh');
        await chatAnswer.clickMoreButton();

        const copyBtn = await chatAnswer.getCopyButton();
        await since('Copy button text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await copyBtn.getText())
            .toContain('复制为图像');

        const downloadBtn = await chatAnswer.getDownloadButton();
        await since('Download button text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await downloadBtn.getText())
            .toContain('下载');

        const addToSnapshotTooltip = await chatAnswer.hoverAndGetTooltip(await chatAnswer.getPinButton());
        await since(
            'Add to snapshot button tooltip text in Chinese is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await addToSnapshotTooltip.getText())
            .toBe('拍摄快照');

        await chatAnswer.clickPinButton();
        // const toast = await aibotChatPanel.getToastbyMessage('已添加快照');
        // await toast.isDisplayed();

        await aibotSnapshotsPanel.clickSortButton();
        const sortContentDate = await aibotSnapshotsPanel.getSortContent();
        await checkElementByImageComparison(sortContentDate, 'snapshots/TC92571', 'Sort by date content in Chinese', 1);

        await aibotSnapshotsPanel.esc();

        await aibotSnapshotsPanel.setSortBy('类别');

        await aibotSnapshotsPanel.clickSortButton();
        const sortContentCategory = await aibotSnapshotsPanel.getSortContent();
        await checkElementByImageComparison(
            sortContentCategory,
            'snapshots/TC92571',
            'Sort by category content in Chinese',
            1
        );

        await aibotSnapshotsPanel.esc();

        const searchInput = await aibotSnapshotsPanel.getSearchInput();
        await since('Search input placeholder text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await searchInput.getAttribute('placeholder'))
            .toBe('搜索');

        const snapshotArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('地区', 'zh');
        await snapshotArea.clickThreeDotsButton();
        const categoryMenu = await snapshotArea.getCategoryMenu();
        await checkElementByImageComparison(categoryMenu, 'snapshots/TC92571', 'Category content menu in Chinese', 1);
        await snapshotArea.esc();

        // Search and check no result
        await aibotSnapshotsPanel.searchByText('Test no result');
        const searchNoResult = await aibotSnapshotsPanel.getMySnapshotsPanel();
        await checkElementByImageComparison(
            searchNoResult,
            'snapshots/TC92571',
            'Check snapshot with no search result in Chinese',
            2
        );
        await aibotSnapshotsPanel.clearSearch();
    });

    it('[TC92571_3] Check snapshot card and dialog in Chinese', async () => {
        await libraryPage.openBotById({ projectId: aibot.project.id, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1, 'zh');
        await snapshotCard.clickSeeMoreButton();
        await snapshotCard.clickSeeLessButton();

        const maximizeTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getMaximizeButton());
        await since('Maximize button tooltip text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await maximizeTooltip.getText())
            .toBe('最大化');

        const moveTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getMoveButton());
        await since('Move button tooltip text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await moveTooltip.getText())
            .toBe('移动');

        const copyTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getCopyButton());
        await since('Copy button tooltip text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await copyTooltip.getText())
            .toBe('复制为图像');

        const downloadTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getDownloadButton());
        await since('Download button tooltip text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await downloadTooltip.getText())
            .toBe('下载');

        const deleteTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getDeleteButton());
        await since('Delete button tooltip text in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await deleteTooltip.getText())
            .toBe('删除');

        await snapshotCard.clickMaximizeButton();
        const savedTime = await snapshotDialog.getSavedTime();
        await since('Snapshot dialog in Chinese is expected to be #{expected}, instead we have #{actual}')
            .expect(await savedTime.getText())
            .toBe('保存于 04/08/2025 08:15AM');
        await snapshotDialog.clickCloseButton();

        await snapshotCard.clickMoveButton();
        const moveDialog = await snapshotCard.getMoveDialog();
        await checkElementByImageComparison(moveDialog, 'snapshots/TC92571', 'Move dialog in Chinese', 1);

        await snapshotCard.esc();

        await aibotSnapshotsPanel.setSortBy('创建日期');

        await snapshotCard.clickDeleteButton();
        const confirmationDialog = await snapshotCard.getConfirmDeleteDialog();
        await checkElementByImageComparison(
            confirmationDialog,
            'snapshots/TC92571',
            'Delete confirmation dialog in Chinese',
            1
        );

        await snapshotCard.confirmDelete();
    });

});
