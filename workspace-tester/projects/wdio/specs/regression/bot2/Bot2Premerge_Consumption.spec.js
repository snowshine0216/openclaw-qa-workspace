import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botV2Premerge } from '../../../constants/bot2.js';
import { clearBotV2SnapshotsByAPI } from '../../../api/bot2/snapshotAPI.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { infoLog } from '../../../config/consoleFormat.js';
import urlParser from '../../../api/urlParser.js';

describe('Bot 2.0 Consumption', () => {
    let { loginPage, libraryPage, aibotChatPanel, bot2Chat, aibotSnapshotsPanel } = browsers.pageObj1;

    const premergeBot = {
        botId: '365AA262AF554D6FB517288037380D07',
        name: 'Auto_Premerge_QA',
        projectId: botV2Premerge.projectId,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botV2Premerge);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await clearBotV2SnapshotsByAPI({
            ...premergeBot,
            credentials: botV2Premerge,
        });
        await deleteBotV2ChatByAPI({
            ...premergeBot,
            credentials: botV2Premerge,
        });
        await libraryPage.openBotById(premergeBot);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });


    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99012_1] Basic Q&A', async () => {
        await since('Welcome page bot image should be displayed')
            .expect(await aibotChatPanel.isBot2WelcomePageDisplayed())
            .toBe(true);
        // simple question no viz
        await aibotChatPanel.askQuestionNoWaitViz('what is the subcategory name with highest profit in 2020');
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        const expectedKeywords = 'Cameras';
        await since(`Answer should contain expected keywords: ${expectedKeywords}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
            .toBe(true);
        await since('Insights section should be displayed')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(true);

        // AG grid
        await aibotChatPanel.askQuestion('show profit by category in grid', true);
        await since('Grid should be displayed, the AG grid count should > 0, instead we have #{actual}')
            .expect(await aibotChatPanel.getAgGrids().length)
            .toBeGreaterThan(0);
        if (await aibotChatPanel.isToBottomBtnDisplayed()) {
            await aibotChatPanel.clickToBottom();
        }
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Grid Export CSV Btn display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToCsvIconDisplayedByLatestAnswer())
            .toBe(true);
        await since('Grid Export Excel Btn display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToExcelIconDisplayedByLatestAnswer())
            .toBe(true);

        // Bar chart
        await aibotChatPanel.askQuestion('show profit by category in bar chart', true);
        await since('Bar chart should be displayed')
            .expect(await aibotChatPanel.getVizBubble().isDisplayed())
            .toBe(true);

        if (await aibotChatPanel.isToBottomBtnDisplayed()) {
            await aibotChatPanel.clickToBottom();
        }
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Bar chart Export CSV Btn display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToCsvIconDisplayedByLatestAnswer())
            .toBe(true);
        await since('Bar chart Export Excel Btn display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isExportToExcelIconDisplayedByLatestAnswer())
            .toBe(true);
    });

    it('[TC99012_2] Snapshot', async () => {
        // Ask question
        await aibotChatPanel.askQuestion('show profit by category in bar chart', true);
        if (await aibotChatPanel.isToBottomBtnDisplayed()) {
            await aibotChatPanel.clickToBottom();
        }

        // add to snapshot
        const lastAnswer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEndV2(1);
        const lastAnswerText = await lastAnswer.getText();

        const pinButton = await aibotChatPanel.getPinButtonOfNthChatAnswer(1);
        await since('Pin button is expected to be displayed, instead we have #{actual}')
            .expect(await pinButton.isExisting())
            .toBe(true);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();
        const unPinButton = await aibotChatPanel.getUnpinButtonOfNthChatAnswer(1);
        await since('Unpin button is expected to be #{expected}, instead we have #{actual}')
            .expect(await unPinButton.isExisting())
            .toBe(true);
        // check snapshot panel
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await since('Snapshot added, the count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);
        // search
        await aibotSnapshotsPanel.searchByText('noresult');
        await since('search no result, the snapshot count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(0);
        await aibotSnapshotsPanel.clearSearch();
        await aibotSnapshotsPanel.searchByText(lastAnswerText);
        await since(
            'search out 1 snapshot, the snapshot count is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);
        await aibotSnapshotsPanel.clearSearch();
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByIndex();
        await snapshot.clickDeleteButton();
        await snapshot.confirmDelete();
        await libraryPage.sleep(1000);
        await since('Snapshot deleted is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(0);
    });

    it('[TC99012_3] Check Sugguestion', async () => {
        infoLog('1. Verify initial suggestions are displayed');
        await aibotChatPanel.waitForRecommendationLoading();
        await since('Recommendations should be displayed')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(0))
            .toBe(true);
        const initialSuggestion = await aibotChatPanel.getRecommendationTextsByIndex(0);

        infoLog('2. Suggestions should be updated after clicked suggestion');
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();

        await aibotChatPanel.openRecommendationPanel();
        await since('Suggestion should be shown after clicked suggestion')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(0))
            .toBe(true);
        const newSuggestion = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await since('Suggestions should be updated after clicked suggestion')
            .expect(newSuggestion)
            .not.toBe(initialSuggestion);

        infoLog('3. Click refresh suggestions button');
        await aibotChatPanel.clickRefreshRecommendationIcon();
        await aibotChatPanel.waitForRecommendationLoading();
        const newSuggestion2 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await since('Suggestions should be updated after refresh').expect(newSuggestion2).not.toBe(newSuggestion);

        infoLog('4. Manual collapse -> will NOT expand automatically');
        await aibotChatPanel.clickFoldRecommendation();
        const baseUrl = urlParser(browser.options.baseUrl);
        const getSuggestionsMock = await browser.mock(`${baseUrl}/api/questions/suggestions?conversationId=**`);
        await aibotChatPanel.askQuestion(newSuggestion2);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForRecommendationLoading();
        await since('Suggestions should not be expanded automatically after collapsed')
            .expect(await aibotChatPanel.isRecommendationDisplayed())
            .toBe(false);
        await since('Suggestions should be not displayed after manually collapsed')
            .expect(getSuggestionsMock.calls.length)
            .toBe(0);
        getSuggestionsMock.clear();
    });
});
