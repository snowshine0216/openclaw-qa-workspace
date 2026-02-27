import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { clientTelemetryConfiguration } from '../../../api/clientTelemetryConfiguration.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsResponse,
} from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Thumb Down', () => {
    const aibots = {
        bot1Thumbdown: {
            name: '27. Thumbdown',
            id: '86543CCA21430D13F75344B726C7E8E4',
        },
        bot2ThumbdownHistory: {
            name: '27. Thumbdown History',
            id: '81CFD648CC463F0896E3C8AE57702F25',
        },
        bot3ThumbdownTopic: {
            name: '27. Thumbdown Topic',
            id: '31ABE4215B4A8EED2EC94E91C3AF2F76',
        },
        bot4ThumbdownSmartSuggestion: {
            name: '27. Thumbdown Smart Suggestion',
            id: '9AA096160446006CC75F56AF7F9F2FDB',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring, botConsumptionFrame } = browsers.pageObj1;
    let openFeedbackCustomAppId;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        let customAppInfo = getRequestBody({
            name: 'openFeedbackApp',
            disclaimer: '',
            feedback: true,
        });
        openFeedbackCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: openFeedbackCustomAppId });
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [openFeedbackCustomAppId],
        });
        await logoutFromCurrentBrowser();
        await browser.mockRestoreAll();
    });

    const checkRequestCount = async (requestMock, expectedCount) => {
        await browser.waitUntil(
            async () => {
                return requestMock.calls.length > 0 || requestMock.calls.length === expectedCount;
            },
            {
                timeout: 60000,
                timeoutMsg: 'No pa request is caught in 60000ms',
            }
        );
        return requestMock.calls.length === expectedCount;
    };

    it('[TC94758_1]Thumb down consumption mode ask new question', async () => {
        let feedbackContents =
            '!@#$%^&*()_+[];,./ {}|Please give me top 3 countries with the highest population density.!@#$%^s';
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1Thumbdown.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - hover will show thumb down button'
        );
        await aibotChatPanel.hoverThumbDownButtonbyIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - thumb down button tooltip'
        );
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackPanel(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - click thumb down'
        );
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackPanel(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - add feedback'
        );
        await setWindowSize(aibotMinimumWindow);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerList(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - add feedback 500px'
        );
        await setWindowSize(browserWindow);
        await aibotChatPanel.clickThumbDownClickedButtonbyIndex(0);
        // await checkElementByImageComparison(
        //     aibotChatPanel.getFeedbackPanel(),
        //     'dashboardctc/ChatPanel/TC94758_1',
        //     'New question consumption mode - click thumb down again'
        // );
        await aibotChatPanel.clickFeedbackTabByName('Incorrect data');
        await aibotChatPanel.hoverThumbDownClickedButtonbyIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - thumb down button tooltip after clicking thumb down'
        );
        await aibotChatPanel.clickFeedbackSubmitButton();
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - click submit feedback'
        );
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(1);
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents('Hi');
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.clearFeedbackContents();
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackPanel(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - clear feedback contents submit button gray'
        );
        await aibotChatPanel.clickFeedbackCloseButtonbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerList(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - close feedback panel'
        );
        await aibotChatPanel.sleep(2000);
        await aibotChatPanel.hoverTextOnlyChatAnswer(1);
        await aibotChatPanel.clickThumbDownClickedButtonbyIndex(1);
        await since('click thumb down button again reopen feedback panel should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackPanel().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(2);
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.scrollChatPanelToBottom();
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerList(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - scroll will not close feedback panel'
        );
        //Reopen bot
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibots.bot1Thumbdown.name);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerList(),
            'dashboardctc/ChatPanel/TC94758_1',
            'New question consumption mode - reopen bot the feedback panel disappear'
        );
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(2000);
        await aibotChatPanel.hoverTextOnlyChatAnswer(3);
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(
            'Please give me top 3 countries with the highest population density.'
        );
        await botConsumptionFrame.clickEditButton();
        await since('enter edit mode feedback panel will keep should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackPanel().isDisplayed())
            .toBe(true);
        await botAuthoring.exitBotAuthoring();
        await since('exit  edit mode feedback panel will keep should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackPanel().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clearHistory();
    });

    it('[TC94758_2]Thumb down consumption mode panel expand combined with interpretation and smart suggestion', async () => {
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2ThumbdownHistory.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibots.bot2ThumbdownHistory.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - top open thumb down'
        );
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - top open interpretation'
        );
        await aibotChatPanel.scrollChatPanelToTop();
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - top open thumb down then interpretation'
        );
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(2);
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.clickThumbDownButtonbyIndex(1);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - bottom open interpretation then thumb down'
        );
        await aibotChatPanel.scrollChatPanelTo(-800);
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(1);
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - middle open interpretation then thumb down'
        );
        await aibotChatPanel.clickInterpretationbyIndex(1);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - middle close interpretation'
        );
        await aibotChatPanel.clickFeedbackCloseButtonbyIndex(1);
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC94758_2',
            'History consumption mode - middle close feedback'
        );
        await aibotChatPanel.clearHistory();
    });

    it('[TC94758_3]PA request for thumb down feature should be controlled by Client Telemetry setting  ', async () => {
        await clientTelemetryConfiguration({
            credentials: chatPanelUser,
            enableClientTelemetryForAll: 1,
            projectID: conEduProId,
        });
        await libraryPage.switchUser(chatPanelUser);
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1Thumbdown.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        const paRequestMock = await browser.mock('**/api/mstrServices/library/telemetryProducer/send');
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await since(
            'client telemetry on, click thumb down, the pa request == 1 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(paRequestMock, 1))
            .toBe(true);
        await browser.mockRestoreAll();
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents('Hi');
        const paRequestMock2 = await browser.mock('**/api/mstrServices/library/telemetryProducer/send');
        await aibotChatPanel.clickFeedbackSubmitButton();
        await since(
            'client telemetry on, submit feedback, the pa request == 1 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(paRequestMock2, 1))
            .toBe(true);
        await browser.mockRestoreAll();
        await aibotChatPanel.clearHistory();
        await clientTelemetryConfiguration({
            credentials: chatPanelUser,
            enableClientTelemetryForAll: 0,
            projectID: conEduProId,
        });
        await libraryPage.switchUser(chatPanelUser);
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1Thumbdown.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        const paRequestMock3 = await browser.mock('**/api/mstrServices/library/telemetryProducer/send');
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await since(
            'client telemetry off, click thumb down, the pa request == 0 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(paRequestMock3, 0))
            .toBe(true);
        await browser.mockRestoreAll();
        const paRequestMock4 = await browser.mock('**/api/mstrServices/library/telemetryProducer/send');
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents('Hi');
        await aibotChatPanel.clickFeedbackSubmitButton();
        await since(
            'client telemetry off, submit feedback, the pa request == 0 should be #{expected}, while we get #{actual}'
        )
            .expect(await checkRequestCount(paRequestMock4, 0))
            .toBe(true);
        await browser.mockRestoreAll();
        await aibotChatPanel.clearHistory();
        await clientTelemetryConfiguration({
            credentials: chatPanelUser,
            enableClientTelemetryForAll: 1,
            projectID: conEduProId,
        });
    });

    it('[TC94758_4]Topic no thumb down button', async () => {
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot3ThumbdownTopic.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverOnChatAnswer(0);
        await checkElementByImageComparison(
            aibotChatPanel.getBottomButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC94758_4',
            'Topic consumption mode - hover will not show thumb down button'
        );
        await aibotChatPanel.clearHistory();
    });

    it('[TC94758_5]Click thumb down button with did you mean', async () => {
        await libraryPage.openBotById({
            appId: openFeedbackCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot4ThumbdownSmartSuggestion.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        //Ask ambiguous question - Who has the best performance in non-technical departments?
        await mockAmbiguousAndFollowUpResponse(true);
        const alternatives = ['Experience Bracket > 5', 'Year of Experience > 10']; //when list < 3, show only 2 items
        const suggestions = [
            'Which DEP has the most employees with Experience Bracket > 5?',
            'Which DEP has the most employees with Year of Experience > 10?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerList(),
            'dashboardctc/ChatPanel/TC94758_5',
            'Show did you mean'
        );
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerList(),
            'dashboardctc/ChatPanel/TC94758_5',
            'Click thumb down with did you mean'
        );
        await aibotChatPanel.clearHistory();
    });
});
