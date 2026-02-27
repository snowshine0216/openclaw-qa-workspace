import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botLearningUser, conEduProId, botChnUser, chatPanelUser } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import deleteUserNuggets from '../../../api/bot/nuggets/deleteUserNuggetsRestAPI.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsResponse,
    mockShortLearningResult,
    mockLearningNone,
    mockLongLearningResult,
    mockAmbiguousAndFollowUpResponseAIBot,
} from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Learning', () => {
    const aibots = {
        bot1Learning: {
            name: '33. Learning',
            id: '8E1C195E584C5358A8453E9769D26045',
        },
        bot2LearningNoContents: {
            name: '33. Learning no contents',
            id: '9B6FC13DB8479E7A5ABF5B9EAC4CCC8D',
        },
        bot3LearningNoMock: {
            name: '33. Learning no mock',
            id: '4637B4C93B4F9133530605AFAFEC2D05',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring, botConsumptionFrame, dossierPage } = browsers.pageObj1;
    let openLearningCustomAppId;
    let closeLearningCustomAppId;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        let customAppInfOn = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            feedback: true,
            learning: true,
        });
        openLearningCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfOn,
        });
        let customAppInfOff = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            feedback: true,
            learning: false,
        });
        closeLearningCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfOff,
        });
    });

    beforeEach(async () => {
        await deleteUserNuggets({ credentials: chatPanelUser });
        await deleteUserNuggets({ credentials: botChnUser });
    });

    afterEach(async () => {
        await deleteUserNuggets({ credentials: chatPanelUser });
        await deleteUserNuggets({ credentials: botChnUser });
        await dossierPage.goToLibrary();
        await browser.mockRestoreAll();
    });

    afterAll(async () => {
        await browser.mockRestoreAll();
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [openLearningCustomAppId, closeLearningCustomAppId],
        });
        await logoutFromCurrentBrowser();
    });

    async function postponeLearningResponse() {
        const LearningRequst = await browser.mock('**/aiservice/chats/learnings', { method: 'post' });
        LearningRequst.respondOnce(
            async () =>
                new Promise((resolve) => {
                    console.log('Postpone the response of **/aiservice/chats/learnings');
                    const content =
                        'When I ask about the performance of flights, I am specifically interested in the performance of flights that were cancelled.';
                    const body = {
                        content,
                        contentId: '175fd1f0-353a-4788-b176-3fe2bfa1d11d',
                        nuggetsId: '172CFBE8DD6346E5B4C17903F2030D55',
                    };
                    setTimeout(() => resolve(body), 10 * 1000);
                })
        );
    }

    async function postponeLearningResponseNoNUggetsID() {
        const LearningRequst = await browser.mock('**/aiservice/chats/learnings', { method: 'post' });
        LearningRequst.respondOnce(
            async () =>
                new Promise((resolve) => {
                    console.log('Postpone the response of **/aiservice/chats/learnings');
                    const content =
                        'When I ask about the performance of flights, I am specifically interested in the performance of flights that were cancelled.';
                    const body = {
                        content,
                        nuggetsId: '172CFBE8DD6346E5B4C17903F2030D55',
                    };
                    setTimeout(() => resolve(body), 10 * 1000);
                })
        );
    }

    const checkRequestCount = async (requestMock, expectedCount) => {
        await browser.waitUntil(
            async () => {
                return requestMock.calls.length > 0 || requestMock.calls.length === expectedCount;
            },
            {
                timeout: 60000,
                timeoutMsg: 'No forget learning request is caught in 60000ms',
            }
        );
        return requestMock.calls.length === expectedCount;
    };

    it('[TC94914_1]Learning Basic UI', async () => {
        let feedbackContents = 'Give me 2 countries';
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1Learning.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponse(true);
        const alternatives = ['population density', 'urban population percentage']; //when list < 3, show only 2 items
        const suggestions = [
            'Which country has the highest population density?',
            'Which country has the highest urban population percentage?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await mockLongLearningResult();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC94914_1',
            'consumption mode - Learning triggered by feedback'
        );
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await since('forget learning expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
        await mockAmbiguousAndFollowUpResponse(true);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await mockShortLearningResult();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC94914_1',
            'consumption mode - Learning triggered by smart suggestion'
        );
        await aibotChatPanel.goToLibrary();

        // Reopen Bot
        await libraryPage.openDossier(aibots.bot1Learning.name);
        await since('reopen bot learning expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_2]No learning contents', async () => {
        let feedbackContents = 'Give me 2 countries';
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2LearningNoContents.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponse(true);
        const alternatives = ['population density', 'urban population percentage']; //when list < 3, show only 2 items
        const suggestions = [
            'Which country has the highest population density?',
            'Which country has the highest urban population percentage?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await mockLearningNone();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await since(
            'no learning contents triggered by feedback the feedback panlel show is expected to be #{expected}, while we get #{actual}'
        )
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponse(true);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await mockLearningNone();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        await since(
            'no learning contents triggered by smart suggest the feedback panlel show is expected to be #{expected}, while we get #{actual}'
        )
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
    });

    it('[TC94914_3]learning loading UI triggered by feedback', async () => {
        let feedbackContents = 'Give me 2 countries';
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2LearningNoContents.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await postponeLearningResponse();
        await mockAmbiguousAndFollowUpResponse(true);
        const alternatives = ['population density', 'urban population percentage']; //when list < 3, show only 2 items
        const suggestions = [
            'Which country has the highest population density?',
            'Which country has the highest urban population percentage?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getFeedbackResults());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getThumbDownLoadingSpinner());
        await since('Feedback result expected to be displayed, but not')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await since('Thanks for your feedback expected to be displayed, but not')
            .expect(await aibotChatPanel.getFeedbackResultsText())
            .toBe('Thanks for your feedback!');
        await since('Feedback result loading expected to be displayed, but not')
            .expect(await aibotChatPanel.getThumbDownLoadingSpinner().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC94914_3',
            'consumption mode - learning loading triggered by feedback'
        );
    });

    it('[TC94914_4]learning loading UI triggered by smart suggestion', async () => {
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2LearningNoContents.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await postponeLearningResponse();
        await mockAmbiguousAndFollowUpResponse(true);
        const alternatives = ['population density', 'urban population percentage'];
        const suggestions = [
            'Which country has the highest population density?',
            'Which country has the highest urban population percentage?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(1));
        await aibotChatPanel.clickSmartSuggestion(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getFeedbackResults());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getThumbDownLoadingSpinner());
        await since('Feedback result expected to be displayed, but not')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await since('Checking... expected to be displayed, but not')
            .expect(await aibotChatPanel.getLearningCheckingText())
            .toBe('Checking...');
        await since('Feedback result loading expected to be displayed, but not')
            .expect(await aibotChatPanel.getThumbDownLoadingSpinner().isDisplayed())
            .toBe(true);
        await since('Learning checking learning icon expected to be displayed, but not')
            .expect(await aibotChatPanel.getLearningIcon().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC94914_4',
            'consumption mode - learning loading triggered by smart suggestion'
        );
    });

    it('[TC94914_5]Learning should be forgot when click thumb down after getting learning result', async () => {
        const forgetRequestMock = await browser.mock('**/api/nuggets/**/deleteRequest');
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2LearningNoContents.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponse(true);
        const alternatives = ['population density', 'urban population percentage']; //when list < 3, show only 2 items
        const suggestions = [
            'Which country has the highest population density?',
            'Which country has the highest urban population percentage?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await mockLongLearningResult();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(1));
        await aibotChatPanel.clickSmartSuggestion(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        await aibotChatPanel.clickThumbDownButtonbyIndex(1);
        await since('click thumb down forget learning request count == 1 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(forgetRequestMock, 1))
            .toBe(true);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_6]Learning no mock to check function triggered by did you mearn', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        await since('learning expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('010101 Which Country has the best performance of change? Please give me a grid.');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('010101 Which Country has the best performance of change? Please give me a grid.');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(3);
        await aibotChatPanel.clickInterpretationbyIndex(3);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('learning interpretation expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getInterpretationLearning().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickInterpretationbyIndex(3);
        await aibotChatPanel.scrollChatPanelTo(-200);
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await since('forget learning expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getInterpretationLearning().isDisplayed())
            .toBe(false);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('010101 Which Country has the best performance of change? Please give me a grid.');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(4);
        await aibotChatPanel.clickInterpretationbyIndex(4);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('Learning interpretation icon expected to be not displayed')
            .expect(await aibotChatPanel.getNuggetTriggerIcon().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_7]Learning setting off', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        const learningMock = await browser.mock('**/api/aiservice/chats/learnings');
        await libraryPage.openCustomAppById({ id: closeLearningCustomAppId });
        await libraryPage.openBotById({
            appId: closeLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('learning setting off learning request count == 0 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(learningMock, 0))
            .toBe(true);
        await since('learning setting off, learning result display expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_8]Learning different user', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        await since('learning user1 learning result display expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await libraryPage.switchUser(botChnUser);
        await libraryPage.openDossier('33. Learning no mock');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('Learning icon expected to be not displayed')
            .expect(await aibotChatPanel.getNuggetTriggerIcon().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await libraryPage.switchUser(chatPanelUser);
    });

    it('[TC94914_9]Learning should be forgot when click thumb down before getting learning result', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        const forgetRequestMock = await browser.mock('**/api/nuggets/**/deleteRequest');
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await postponeLearningResponse();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getThumbDownIconbyIndex(1));
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getThumbDownIconbyIndex(1));
        await aibotChatPanel.clickThumbDownButtonbyIndex(1);
        await aibotChatPanel.sleep(20 * 1000);
        await since(
            'click thumb down before get learning response forget learning request count == 1 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(forgetRequestMock, 1))
            .toBe(true);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_10]Learning should be forgot when submit feedback before getting learning result', async () => {
        let feedbackContents = 'Please give me Migrants (net)';
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        const forgetRequestMock = await browser.mock('**/api/nuggets/**/deleteRequest');
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await postponeLearningResponse();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getFeedbackResultPanel());
        await aibotChatPanel.hoverChatAnswertoClickThumbDownbyIndex(1);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.sleep(20 * 1000);
        await since(
            'click thumb down before get learning response forget learning request count == 1 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(forgetRequestMock, 1))
            .toBe(true);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_11]Check learning request and response contents', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.mockRestoreAll();
        const LearningRequst = await browser.mock('**/aiservice/chats/learnings', { method: 'post' });
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        const parsedLearningRequestStatusCode = JSON.parse(LearningRequst.calls[0].statusCode);
        console.log('Parsed Learning Request Status Code:', parsedLearningRequestStatusCode);
        await expect(parsedLearningRequestStatusCode).toEqual(200);

        const parsedLearningRequestPostData = JSON.parse(LearningRequst.calls[0].postData);
        console.log('Parsed Learning Request Post Data:', parsedLearningRequestPostData);
        await expect(parsedLearningRequestPostData.type).toEqual('ambiguity');
        await expect(parsedLearningRequestPostData.nuggetsId).toEqual('');
        await expect(parsedLearningRequestPostData.userMessage).toEqual('Which Country has the best Yearly Change?');
        await expect(parsedLearningRequestPostData.answer).toBeNull();
        await expect(parsedLearningRequestPostData.feedback).toBeNull();
        await expect(parsedLearningRequestPostData.source.messageID).toEqual(expect.any(String));
        await expect(parsedLearningRequestPostData.source.id).toEqual('4637B4C93B4F9133530605AFAFEC2D05');
        await expect(parsedLearningRequestPostData.source.projectId).toEqual('CE52831411E696C8BD2F0080EFD5AF44');
        await expect(parsedLearningRequestPostData.source.type).toEqual(14084);
        await expect(parsedLearningRequestPostData.history[0].question).toEqual(
            'Which Country has the best performance of change?'
        );
        await expect(parsedLearningRequestPostData.history[0].answer).toEqual(expect.any(String));
        await expect(parsedLearningRequestPostData.history[0].nuggetsCollections).toEqual(expect.any(Array));
        await expect(parsedLearningRequestPostData.questionAssessment.type).toEqual('precise');
        await expect(parsedLearningRequestPostData.questionAssessment.reason).toEqual(expect.any(String));
        await expect(parsedLearningRequestPostData.questionAssessment.followUp).toBe(true);
        await expect(parsedLearningRequestPostData.questionAssessment.quotedQuestionId).toEqual(expect.any(String));
        await expect(parsedLearningRequestPostData.sql).toEqual(expect.any(String));
        await expect(parsedLearningRequestPostData.idObjectMapping.DFFD40F24C4F569138DB06AEB8D68B77).toEqual(
            expect.any(Object)
        );

        const LearningRequestBody = LearningRequst.calls[0].body;
        console.log('Learning Request Body:', LearningRequestBody);
        await expect(LearningRequestBody.content).toEqual(expect.stringContaining('yearly change'));
        await expect(LearningRequestBody.contentId).toEqual(expect.any(String));
        await expect(LearningRequestBody.nuggetsId).toEqual(expect.any(String));
        await expect(LearningRequestBody.telemetry).toEqual(expect.any(Object));
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_12]Learning no mock to check function triggered by thumb down', async () => {
        let feedbackContents = 'I want to know net change';
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await setWindowSize(aibotMinimumWindow);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94914_12',
            'consumption mode - Learning triggered by feedback 500px'
        );
        await setWindowSize(browserWindow);
        await botConsumptionFrame.clickEditButton();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94914_12',
            'Edit mode - Learning enter edit mode'
        );
        await botAuthoring.exitBotAuthoring();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94914_12',
            'consumption mode - Learning exit edit mode to consumption mode'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(1);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('learning interpretation expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getInterpretationLearning().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickInterpretationbyIndex(1);
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94914_12',
            'consumption mode - Forget learning triggered by feedback'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(2);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('forget learning interpretation expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getInterpretationLearning().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94914_13]Learning forgot request should not be sent when click thumb down before getting learning result and no nuggets ID', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        const forgetRequestMock = await browser.mock('**/api/nuggets/**/deleteRequest');
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3LearningNoMock.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await postponeLearningResponseNoNUggetsID();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getThumbDownIconbyIndex(1));
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getThumbDownIconbyIndex(1));
        await aibotChatPanel.clickThumbDownButtonbyIndex(1);
        await aibotChatPanel.sleep(20 * 1000);
        await since(
            'click thumb down before get learning response with no nuggets ID - forget learning request count == 0 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(forgetRequestMock, 0))
            .toBe(true);
        await aibotChatPanel.clearHistory();
    });
});
