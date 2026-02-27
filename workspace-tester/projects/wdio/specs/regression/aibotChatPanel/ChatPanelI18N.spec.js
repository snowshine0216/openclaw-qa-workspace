import { browserWindow, aibotMediumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, botChnUser, conEduProId } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsResponse,
    mockLongLearningResult,
    mockInterpretationContents,
} from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel I18N', () => {
    const aibots = {
        bot8CustomTheme: {
            id: 'C528FB47BC46DA75512BA1BB331D1394',
            name: '9.3 Custom theme',
        },
        bot9SeeMore: {
            id: 'DBACCB170D4BBE27A8D1F8B725A2BC59',
            name: '13. see more',
        },
        bot10AllLanguage: {
            id: '883F6CA6F34CD4A6A572099427C669B5',
            name: '15. All Language',
        },
        bot11CustomThemeWithAnswer: {
            id: 'D43E558CF344BB2FAA0B06BF08BAA640',
            name: '9.3 Custom theme with answer',
        },
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
        bot12CustomThemeThumbDown: {
            id: '51013234EC421C5D7765209FC6944B8F',
            name: '9.3 Custom theme thumb down',
        },
        bot13LearningNoContents: {
            name: '9.3 Custom theme learning',
            id: '21A42DB8F344452E1521D596E5B18218',
        },
        bot14FollowUpColorThemeI18N: {
            name: '35. Follow up Color Theme I18n',
            id: 'A1F27D52C941E0B65AF61EA37796F83F',
        },
        bot15FollowUpErrorMessageColorThemeI18N: {
            name: '35. Follow up Error Message Color Theme I18n',
            id: '39DD8A6C2E45E17CF0A2E4B3B45CDCD8',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;
    let defaultDisclaimerAppId;
    let openFeedbackCustomThemeAppId;
    let openLearningCustomThemeAppId;
    let result =
        "Identify the country with the highest CO2 emissions from coal and display it in one grid, sorted by 'From Coal' in descending order.";

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botChnUser);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: botChnUser,
            customAppIdList: [defaultDisclaimerAppId, openFeedbackCustomThemeAppId, openLearningCustomThemeAppId],
        });
        await browser.mockRestoreAll();
        await logoutFromCurrentBrowser();
    });

    async function postponeLearningResponse() {
        const suggestionRequst = await browser.mock('**/aiservice/chats/learnings', { method: 'post' });
        suggestionRequst.respondOnce(
            async (request) =>
                new Promise((resolve) => {
                    console.log('Postpone the response of **/aiservice/chats/learnings');
                    setTimeout(() => resolve({ statusCode: request.statusCode, body: request.body }), 10 * 1000);
                })
        );
    }

    it('[TC91753_1] display under custom theme and I18N', async () => {
        await setWindowSize(aibotMediumWindow);
        let customAppInfo = getRequestBody({
            name: 'defaultContentsDisclaimerApp',
        });

        defaultDisclaimerAppId = await createCustomApp({
            credentials: botChnUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: defaultDisclaimerAppId });
        await libraryPage.openBotById({
            appId: defaultDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.bot8CustomTheme.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        await checkElementByImageComparison(
            aibotChatPanel.getDisclaimer(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - disclaimer Chinese'
        );
        await libraryPage.switchUser(chatPanelUser);
        await libraryPage.openDossier('9.3 Custom theme');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await checkElementByImageComparison(
            aibotChatPanel.getDisclaimer(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - disclaimer change to English user'
        );
        await libraryPage.switchUser(botChnUser);
        await libraryPage.openDossier('9.3 Custom theme');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await checkElementByImageComparison(
            aibotChatPanel.getDisclaimer(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - disclaimer change back to Chinese user'
        );

        await aibotChatPanel.hoverOnLinksPopoverBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - link button tooltip'
        );

        await aibotChatPanel.clickLinksPopoverButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLinksPopoverContents());
        await checkElementByImageComparison(
            aibotChatPanel.getLinksPopoverContents(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - link popover'
        );
        await aibotChatPanel.hoverOnLinksPopoverItemByIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - long link tooltip'
        );

        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(1));
        await aibotChatPanel.hoverOnRecommendationByIndex(1);
        await checkElementByImageComparison(
            aibotChatPanel.getRecommendationByIndex(1),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - suggestion bubble hover status'
        );

        // after QA
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getRecommendations(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - related suggestion'
        );
        await aibotChatPanel.hoverOnRecommendationRefreshBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - refresh button tooltip'
        );
        await aibotChatPanel.scrollChatPanelTo(-100);
        await aibotChatPanel.hoverOnHistoryQuestion(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getCopyToQueryBtnByIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getQueryMessageContentByIndex(0),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - hover status on history question bubble'
        );

        await aibotChatPanel.hoverOnCopyToQueryIcon();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - copy to query box icon tooltip'
        );

        await aibotChatPanel.hoverOnHistoryAnswer(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - copy download and snapshot button'
        );

        await aibotChatPanel.hoverOnInterpretationBtn(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - interpretation button tooltip'
        );
        await mockInterpretationContents(result);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - Interpretation components'
        );

        await aibotChatPanel.hoverOnInterpretationCopyToQueryBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - interpretation copy to query button tooltip'
        );

        //await aibotChatPanel.hoverOnInterpretationCopyLLMInstructionsBtn();
        //await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        //await checkElementByImageComparison(
        //aibotChatPanel.getTooltip(),
        //'dashboardctc/ChatPanel/TC91753_1',
        //'Custom theme and I18N - interpretation copy LLM instructions button tooltip'
        //);

        await aibotChatPanel.hoverOnInputBox();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - input box hover status'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('I am a user, I want to ask you a question.');
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - input box input and send status'
        );

        await setWindowSize(browserWindow);
        await aibotChatPanel.clickClearHistoryButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getClearHistoryConfirmationDialog());
        await checkElementByImageComparison(
            aibotChatPanel.getClearHistoryConfirmationDialog(),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme and I18N - clear history confirmation dialog'
        );

        // click no or panel area, it will dismiss clear history confirmation dialog
        await aibotChatPanel.clickClearHistoryNoButton();
        await since('History is not cleared is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isVizAnswerDisplaed())
            .toBe(true);
        await aibotChatPanel.clickClearHistoryButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getClearHistoryConfirmationDialog());
        await aibotChatPanel.clickBotName();
        await since('History is not cleared is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isVizAnswerDisplaed())
            .toBe(true);
        await since(
            'Clear history confirmation dialog should be dimissed is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.isClearHistpryConfirmationDialogDisplayed())
            .toBe(false);

        //Check custom theme with answer
        await setWindowSize(aibotMediumWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot11CustomThemeWithAnswer.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAnswerbyIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC91753_1',
            'Custom theme - grid answer'
        );
    });

    it('[TC91753_2] see more see less', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot9SeeMore.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));

        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.hoverOnSeeMoreLessBtn();
        await since('See more tooltip is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTooltipDisplayed())
            .toBe(false);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC91753_2',
            'Answer with see more'
        );
        await aibotChatPanel.clickSeeMoreLessBtn();
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC91753_2',
            'Click see more'
        );
        await aibotChatPanel.clickSeeMoreLessBtn();
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC91753_2',
            'Click see less'
        );
    });

    it('[TC91753_3] auto comlplete panel', async () => {
        await libraryPage.openBotById({ projectId: aibots.project.id, botId: aibots.bot10AllLanguage.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('润');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAutoCompleteArea());
        await checkElementByImageComparison(
            aibotChatPanel.getAutoCompleteArea(),
            'dashboardctc/ChatPanel/TC91753_3',
            'Custom theme and I18N - auto complete panel'
        );
        await aibotChatPanel.clearHistory();
    });

    it('[TC91753_4] Thumb down display under custom theme and I18N', async () => {
        let feedbackContents = 'I want 2.';
        await setWindowSize(aibotMediumWindow);
        let customAppInfo = getRequestBody({
            name: 'openFeedbackAppCustomTheme',
            feedback: true,
        });

        openFeedbackCustomThemeAppId = await createCustomApp({
            credentials: botChnUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: openFeedbackCustomThemeAppId });
        await libraryPage.openBotById({
            appId: openFeedbackCustomThemeAppId,
            projectId: conEduProId,
            botId: aibots.bot12CustomThemeThumbDown.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await checkElementByImageComparison(
            aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0),
            'dashboardctc/ChatPanel/TC91753_4',
            'Custom theme and I18N - hover will show thumb down button'
        );
        await aibotChatPanel.hoverThumbDownButtonbyIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_4',
            'Custom theme and I18N - thumb down button tooltip'
        );
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackPanel(),
            'dashboardctc/ChatPanel/TC91753_4',
            'Custom theme and I18N - click thumb down'
        );
        await aibotChatPanel.clickFeedbackTabByName('回答不完整');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackPanel(),
            'dashboardctc/ChatPanel/TC91753_4',
            'Custom theme and I18N - add feedback'
        );
        await aibotChatPanel.clickFeedbackSubmitButton();
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC91753_4',
            'Custom theme and I18N - click submit feedback'
        );
        await aibotChatPanel.clearHistory();
    });

    it('[TC91753_5] learning display under custom theme and I18N', async () => {
        let feedbackContents = 'Give me 2 countries';
        await setWindowSize(aibotMediumWindow);
        let customAppInfo = getRequestBody({
            name: 'openLearningAppCustomTheme',
            feedback: true,
            learning: true,
        });

        openLearningCustomThemeAppId = await createCustomApp({
            credentials: botChnUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: openLearningCustomThemeAppId });
        await libraryPage.openBotById({
            appId: openLearningCustomThemeAppId,
            projectId: conEduProId,
            botId: aibots.bot13LearningNoContents.id,
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
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(1));
        await aibotChatPanel.clickSmartSuggestion(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getFeedbackResults());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getThumbDownLoadingSpinner());
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC91753_5',
            'Custom theme and I18N - learning loading triggered by smart suggestion'
        );
        await browser.mockRestoreAll();
        await mockLongLearningResult();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('回答不完整');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getFeedbackResultPanel(),
            'dashboardctc/ChatPanel/TC91753_5',
            'Custom theme and I18N - learning result triggered by feedback'
        );
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await aibotChatPanel.clearHistory();
    });

    it('[TC91753_6]Follow up display under custom theme and I18N', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot14FollowUpColorThemeI18N.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await checkElementByImageComparison(
            aibotChatPanel.getQueryByIndex(1),
            'dashboardctc/ChatPanel/TC91753_6',
            'color theme i18n - quoted message in question'
        );
        await aibotChatPanel.scrollChatPanelTo(-200);
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await aibotChatPanel.hoverOnToolBarMoreButtonByIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_6',
            'color theme i18n - More button tooltip'
        );
        await aibotChatPanel.clickToolBarMoreButtonByIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getToolBarMoreMenu(),
            'dashboardctc/ChatPanel/TC91753_6',
            'color theme i18n - Tool bar more menu'
        );
        await aibotChatPanel.hoverOnFollowUpIconByIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC91753_6',
            'color theme i18n - Follow up button tooltip'
        );
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC91753_6',
            'color theme i18n - quoted message in input area'
        );
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot15FollowUpErrorMessageColorThemeI18N.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await checkElementByImageComparison(
            aibotChatPanel.getFollowUpError(),
            'dashboardctc/ChatPanel/TC91753_6',
            'color theme i18n - error message in question'
        );
    });
});
