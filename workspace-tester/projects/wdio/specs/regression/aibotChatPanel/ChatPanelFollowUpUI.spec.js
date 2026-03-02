import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import {
    mockInterpretationContents,
    mockAmbiguousAndFollowUpResponseAIBot,
    mockAlternativeSuggestionsResponse,
} from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Follow Up', () => {
    const aibots = {
        bot1FollowUpUI: {
            name: '35. Follow up UI',
            id: '8D3DAC02A24179112BBFBFADC5348817',
        },
        bot2FollowUpUINoSnapshot: {
            name: '35. Follow up UI No Snapshot',
            id: '7AE8C93A634FE36230FA13AA1249EEA9',
        },
        bot3FollowUpLongHistory: {
            name: '35. Follow up Long History',
            id: '0B0F59C1F444CB3848059995F8F5FEC9',
        },
        bot4FollowUpMiddleHistory: {
            name: '35. Follow up Middle History',
            id: 'DB0EA272D64F7F1411CBF8A2232BD9E6',
        },
        bot5FollowUpUINewQuestion: {
            name: '35. Follow up UI New Question',
            id: '79475C83F14E31896769A0A6D1C7B194',
        },
        bot6FollowUpReachLimit: {
            name: '35. Follow up Limit',
            id: '8DFE2D342B450E127738379679D6FDEB',
        },
        bot7XXSBot: {
            name: '37.XSS Bot',
            id: 'B2C88DF3A841D9A6F09AA8BF2B5B2951',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, botConsumptionFrame, aibotSnapshotsPanel } = browsers.pageObj1;
    let closeFeedbackCustomAppId;
    let openFeedbackCustomAppId;
    let result =
        "Identify the country with the highest CO2 emissions from coal and display it in one grid, sorted by 'From Coal' in descending order.";

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        let customAppInfoClose = getRequestBody({
            name: 'closeFeedbackApp',
            disclaimer: '',
        });
        closeFeedbackCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfoClose,
        });
        let customAppInfoOpen = getRequestBody({
            name: 'openFeedbackApp',
            disclaimer: '',
            feedback: true,
        });
        openFeedbackCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfoOpen,
        });
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [closeFeedbackCustomAppId, openFeedbackCustomAppId],
        });
        await logoutFromCurrentBrowser();
        await browser.mockRestoreAll();
    });

    it('[TC95831_1]Buttons in toolbar', async () => {
        await mockInterpretationContents(result);
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1FollowUpUI.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.scrollChatPanelTo(-200);
        await aibotChatPanel.hoverOnHistoryAnswer(0);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC95831_1',
            'Tool bar - 6 buttons'
        );
        await aibotChatPanel.hoverOnToolBarMoreButtonByIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC95831_1',
            'More button tooltip'
        );
        await aibotChatPanel.clickToolBarMoreButtonByIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_1',
            'Open sub panel'
        );
        await setWindowSize(aibotMinimumWindow);
        await aibotChatPanel.hoverOnHistoryAnswer(0);
        await aibotChatPanel.clickToolBarMoreButtonByIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_1',
            'Open sub panel - 500px'
        );
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_1',
            'Quoted message in input box - 500px'
        );
        await setWindowSize(browserWindow);
        await aibotChatPanel.hoverOnHistoryAnswer(0);
        await aibotChatPanel.clickToolBarMoreButtonByIndex(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_1',
            'Open interpretation with sub panel'
        );
        await aibotChatPanel.clickToolBarMoreButtonByIndex(0);
        await since('Toolbar More menu display should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getToolBarMoreMenu().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickToolBarMoreButtonByIndex(0);
        await since(
            'Click more button again toolbar More menu display should be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.getToolBarMoreMenu().isDisplayed())
            .toBe(false);
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverTextOnlyChatAnswer(1);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC95831_1',
            'Tool bar - Interpretation button pinned'
        );
        await checkElementByImageComparison(
            aibotChatPanel.getBottomButtonIconContainerbyIndex(1),
            'dashboardctc/ChatPanel/TC95831_1',
            'Tool bar - 5 buttons'
        );
        await libraryPage.openBotById({
            appId: closeFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1FollowUpUI.id,
        });
        await aibotChatPanel.hoverTextOnlyChatAnswer(1);
        await checkElementByImageComparison(
            aibotChatPanel.getBottomButtonIconContainerbyIndex(1),
            'dashboardctc/ChatPanel/TC95831_1',
            'Tool bar - 4 buttons'
        );
        await libraryPage.openBotById({
            appId: closeFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2FollowUpUINoSnapshot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await checkElementByImageComparison(
            aibotChatPanel.getBottomButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC95831_1',
            'Tool bar - 3 buttons'
        );
    });

    it('[TC95831_2]Quoted message in input area and question', async () => {
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1FollowUpUI.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.scrollChatPanelTo(-200);
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await aibotChatPanel.hoverOnFollowUpIconByIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Follow up button tooltip'
        );
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Click follow up icon, quoted message in input area'
        );
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.clickQuotedMessageCloseButton();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Click close quoted message in input area'
        );
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2FollowUpUINoSnapshot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Short quoted message in input area'
        );
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(2));
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Enter edit mode, quoted message disappear in input area'
        );
        await aibotChatPanel.hoverTextOnlyChatAnswer(3);
        await aibotChatPanel.clickFollowUpIconbyIndex(2);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Long word quoted message in question'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.hoverTextOnlyChatAnswer(2);
        await aibotChatPanel.clickFollowUpIconbyIndex(1);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_2',
            'Click follow up again, quoted message in input area should be replaced'
        );
    });

    it('[TC95831_3]Revisit follow up answer', async () => {
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1FollowUpUI.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickQuotedMessageButtonByIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_3',
            'Click quoted message in question -- top in answer list'
        );
        await aibotChatPanel.sleep(3000);
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverTextOnlyChatAnswer(3);
        await aibotChatPanel.clickFollowUpIconbyIndex(2);
        await aibotChatPanel.clickQuotedMessageButtonByIndex(1);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_3',
            'Click quoted message in input area -- bottom in answer list'
        );
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3FollowUpLongHistory.id,
        });
        await aibotChatPanel.clickFollowUpError();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_3',
            'Click error message when follow up answer is not available'
        );
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickQuotedMessageButtonByIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_3',
            'History incremental loading'
        );
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot4FollowUpMiddleHistory.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.scrollChatPanelTo(-800);
        await aibotChatPanel.hoverTextOnlyChatAnswer(5);
        await aibotChatPanel.clickFollowUpIconbyIndex(5);
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.sleep(2000);
        await aibotChatPanel.clickQuotedMessageButtonByIndex(2);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC95831_3',
            'Middle in list'
        );
    });

    it('[TC95831_4]Ask again with quoted message', async () => {
        let answer1 = 'The rank of each country based on median age is as follows:';
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1FollowUpUI.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.copyQuestionToQuery(2);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'Input area empty, click ask again'
        );
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.copyQuestionToQuery(0);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'Normal question, click ask again'
        );
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.copyRecommendationToQuery(0);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'Recommendation, click use as question'
        );
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot4FollowUpMiddleHistory.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.copyQuestionToQuery(6);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'middle history, click ask again'
        );
        await aibotChatPanel.copyQuestionToQuery(7);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'middle history, replace text and quoted message'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        await snapshotCard.copySnapshotTitle();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'snapshot, click ask again'
        );
        await snapshotCard.showInterpretationContent();
        await snapshotCard.clickAskAgainButton();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'snapshot interpretation, click ask again'
        );
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot5FollowUpUINewQuestion.id,
        });
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await mockInterpretationContents(result);
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('111111111111111111');
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await aibotChatPanel.clickSmartSuggestionCopyIcon();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'smart suggestion, click ask again'
        );
        await aibotChatPanel.clickInterpretationbyIndex(1);
        await aibotChatPanel.clickInterpretationCopyToQueryIcon();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'Interpretation, click ask again'
        );
        await aibotChatPanel.clearHistory();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC95831_4',
            'Clear history, the follow up bubble should be closed'
        );
    });

    it('[TC95831_5]Reach limit', async () => {
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot6FollowUpReachLimit.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await checkElementByImageComparison(
            aibotChatPanel.getBottomButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC95831_5',
            'Reach limit, follow up button should be gray'
        );
    });

    it('[TC95831_6]XSS when copy to query box is clicked', async () => {
        let inputQuestion = "'><img src=x onerror=alert('Previoustablecolumn1')>";
        let inputQuestion2 = '\'><img src="x" onerror="alert(\'Previoustablecolumn1\')">';
        await libraryPage.openDossier(aibots.bot7XXSBot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForEitherElemmentVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.copyRecommendationToQuery(0);
        await since(
            'XSS copy from welcome page recommendation to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForEitherElemmentVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.copyRecommendationToQuery(0);
        await since(
            'XSS copy from recommendation to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.copyQuestionToQuery(0);
        await since('XSS copy from question to input field is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion2);
        await aibotChatPanel.clearInputbox();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Show me data');
        await mockInterpretationContents(inputQuestion);
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = [inputQuestion]; //when list < 3, show only 2 items
        const suggestions = [inputQuestion];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await aibotChatPanel.clickSmartSuggestionCopyIcon();
        await since(
            'XSS copy from smart suggestion to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.sleep(2000);
        await aibotChatPanel.clickInterpretationbyIndex(1);
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.clickInterpretationCopyToQueryIcon();
        await since(
            'XSS copy from interpretation to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        const snapshotCard1 = aibotSnapshotsPanel.getSnapshotCardByText('It looks like');
        await snapshotCard1.copySnapshotTitle();
        await since(
            'XSS copy from snapshot question to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        const snapshotCard2 = aibotSnapshotsPanel.getSnapshotCardByText('The data from');
        await snapshotCard2.showInterpretationContent();
        await snapshotCard2.clickAskAgainButton();
        await since(
            'XSS copy from snapshot interpretation to input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.clearHistory();
    });
});
