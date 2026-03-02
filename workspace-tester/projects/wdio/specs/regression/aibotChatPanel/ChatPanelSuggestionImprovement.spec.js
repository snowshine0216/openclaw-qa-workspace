import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import {
    mockAlternativeSuggestionsResponse,
    mockAmbiguousAndFollowUpResponseAIBot,
} from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Suggestion Improvement', () => {
    const aibots = {
        bot1CustomSuggestion: {
            name: '34. Custom suggestion',
            id: 'E0746E23BF4A910F74EF9A833FC10551',
        },
        bot2CustomSuggestionDisappearAfter2Questions: {
            name: '34. Custom suggestion disappear after 2 question',
            id: 'BC4432BA3A41D240DDCCFF895B7C0A96',
        },
        bot3CustomSuggestionDisappearAfter2QuestionsTopic: {
            name: '34. Custom suggestion disappear after 2 question topic',
            id: 'A6CB1540E6430D1CD58D84BC2957FCB2',
        },
        bot4CustomSuggestionTopic: {
            name: '34. Custom suggestion topic',
            id: '168E70AA48420C65ECA0E19C1CF74C1E',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring, botConsumptionFrame, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await aibotChatPanel.clearHistory();
        await dossierPage.goToLibrary();
        await browser.mockRestoreAll();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await browser.mockRestoreAll();
    });

    it('[TC96365_1] Custom suggestion removed case consumption mode', async () => {
        let recommendation1 = 'Show me total population all years?';
        let recommendation2 = 'What is the median age in each country?';
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot1CustomSuggestion.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await since('Recommendation1 display to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation1)
            .toBe(false);
        await since('Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.copyRecommendationToQuery(0);
        await since(
            'Welcome page copy recommendation contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(recommendation2);
        await aibotChatPanel.clickExpandRecommendation();
        await since('Recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.clickSendIcon();
        await since('Recommendation2 display to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation2)
            .toBe(true);
        await since('Recommendation counts3 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(5000);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.copyRecommendationToQuery(1);
        await aibotChatPanel.clickSendIcon();
        await since('Recommendation3 display to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation1)
            .toBe(true);
        await since('Recommendation counts to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await since('Recommendation counts to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(5000);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(5000);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(5000);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(5000);
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Recommendation display to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendations().isDisplayed())
            .toBe(false);
        await since('Recommendation expand button display to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationFoldStateBtn().isDisplayed())
            .toBe(false);
        await since('Recommendation refresh button display to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationRefreshIcon().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Recommendation counts to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await since('Recommendation counts to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibots.bot1CustomSuggestion.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Recommendation counts to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_2] Custom suggestion removed case edit mode', async () => {
        let recommendation1 = 'Which country has the highest population?';
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot1CustomSuggestion.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Recommendation1 display to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation1)
            .toBe(false);
        await since('Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getRecommendationByIndex(0));
        await since('Edit mode - Recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Recommendation counts3 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Recommendation counts4 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Exit edit mode -Recommendation counts5 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Recommendation counts6 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clearHistory();
        await since('Edit mode - Recommendation counts7 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_3] Custom suggestions disappear after 2 questions consumption mode ', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot2CustomSuggestionDisappearAfter2Questions.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(2);
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await since('Recommendation counts3 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(2);
        await aibotChatPanel.clearHistory();
        await since('Recommendation counts4 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await since('Recommendation counts5 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Recommendation counts6 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Recommendation counts7 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(2);
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibots.bot2CustomSuggestionDisappearAfter2Questions.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(4));
        await since('Recommendation counts8 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.copyRecommendationToQuery(2);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.copyRecommendationToQuery(3);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Recommendation counts9 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(2);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
    });

    it('[TC96365_4] Custom suggestions disappear after 2 questions consumption mode ask about', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot2CustomSuggestionDisappearAfter2Questions.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askAboutbyIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Ask about - recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.askAboutbyIndex(1);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Ask about - recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(2);
    });

    it('[TC96365_5] Custom suggestions disappear after 2 questions consumption mode topic', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3CustomSuggestionDisappearAfter2QuestionsTopic.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(2000);
        await aibotChatPanel.clickTopicsBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopic());
        await aibotChatPanel.clickChatPanelTopicByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Topic - recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_6] Custom suggestions disappear after 2 questions edit mode ', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot2CustomSuggestionDisappearAfter2Questions.id,
        });
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Edit mode - Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await since('Edit mode - Recommendation counts3 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.clearHistory();
        await since('Edit mode - Recommendation counts4 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Recommendation counts5 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Edit mode - Recommendation counts6 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Recommendation counts7 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_7] Custom suggestions disappear after 2 questions edit mode ask about', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot2CustomSuggestionDisappearAfter2Questions.id,
        });
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askAboutbyIndex(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Ask about - recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await aibotChatPanel.askAboutbyIndex(1);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Ask about - recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_8] Custom suggestions disappear after 2 questions edit mode topic', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3CustomSuggestionDisappearAfter2QuestionsTopic.id,
        });
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickTopicsBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopic());
        await aibotChatPanel.clickChatPanelTopicByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Edit mode - Topic - recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_9] Custom suggestions disappear after 2 questions switch between edit mode and consumption mode ', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot2CustomSuggestionDisappearAfter2Questions.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(2);
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(4));
        await since('Recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(4));
        await since('Recommendation counts3 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC96365_10] Suggestion expand manually consumption mode', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot1CustomSuggestion.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('click suggestion - recommendation expanded1 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await since('type - recommendation expanded2 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'type answer load out -recommendation expanded3 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);

        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.copyRecommendationToQuery(0);
        await since('use as question - recommendation expanded4 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'use as question load out - recommendation expanded5 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(1).isDisplayed())
            .toBe(true);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getRecommendationByIndex(1));
        await aibotChatPanel.sleep(2000);
        await aibotChatPanel.clickRecommendationByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.copyQuestionToQuery(0);
        await since('ask again -recommendation expanded6 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask again load out - recommendation expanded7 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await botConsumptionFrame.clickEditButton();
        await since('enter edit mode - recommendation expanded8 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await botAuthoring.exitBotAuthoring();
        await since('exit edit mode - recommendation expanded9 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('clear history - recommendation expanded10 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibots.bot1CustomSuggestion.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('reopen dossier - recommendation expanded11 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
    });

    it('[TC96365_11] Suggestion expand manually edit mode - topic and ask about', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3CustomSuggestionDisappearAfter2QuestionsTopic.id,
        });
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await since('topic - recommendation expanded1 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.askAboutbyIndex(0);
        await since('ask about - recommendation expanded2 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask about ask other question - recommendation expanded3 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.askAboutbyIndex(1);
        await aibotChatPanel.clickFoldRecommendation();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask about manually close - recommendation expanded4 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
    });

    it('[TC96365_12] Suggestion expand manually - smart suggestion', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3CustomSuggestionDisappearAfter2QuestionsTopic.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await since('smart suggestion - recommendation expanded1 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'smart suggestion ask other question - recommendation expanded2 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickDidYouMeanCloseButton();
        await since(
            'smart suggestion manually close - recommendation expanded3 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'smart suggestion manullay expand and clear history - recommendation expanded4 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        //DE299279
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.mockRestoreAll();
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'smart suggestion clear history and click topic - recommendation expanded5 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
    });

    it('[TC96365_13] Suggestion collapse manually consumption mode', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot1CustomSuggestion.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickFoldRecommendation();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await since('type - recommendation collapsed1 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'type answer load out -recommendation collapsed2 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.copyQuestionToQuery(0);
        await since('ask again -recommendation collapsed3 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask again load out - recommendation collapsed4 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await botConsumptionFrame.clickEditButton();
        await since('enter edit mode - recommendation collapsed5 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await botAuthoring.exitBotAuthoring();
        await since('exit edit mode - recommendation collapsed6 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('clear history - recommendation collapsed7 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(aibots.bot1CustomSuggestion.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('reopen dossier - recommendation collapsed8 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
    });

    it('[TC96365_14] Suggestion collapse manually edit mode - topic and ask about', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3CustomSuggestionDisappearAfter2QuestionsTopic.id,
        });
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickFoldRecommendation();
        await aibotChatPanel.clickTopicsBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopic());
        await aibotChatPanel.clickChatPanelTopicByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('topic - recommendation collapsed1 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.askAboutbyIndex(0);
        await since('ask about - recommendation collapsed2 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask about ask other question - recommendation collapsed3 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.askAboutbyIndex(1);
        await aibotChatPanel.clickFoldRecommendation();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask about manually close - recommendation collapsed4 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
    });

    it('[TC96365_15] Suggestion collapse manually - smart suggestion', async () => {
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3CustomSuggestionDisappearAfter2QuestionsTopic.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickFoldRecommendation();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await since('smart suggestion - recommendation collapsed1 should to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'smart suggestion ask other question - recommendation collapsed2 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickDidYouMeanCloseButton();
        await since(
            'smart suggestion manually close - recommendation collapsed3 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'smart suggestion manullay expand and clear history - recommendation collapsed4 should to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(true);
    });

    it('[TC96365_16] Removed custom suggestion should show again after clearing history in responsive mode', async () => {
        //DE299278
        await setWindowSize(aibotMinimumWindow);
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot1CustomSuggestion.id,
        });
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.clearMobileViewHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(4);
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.clearMobileViewHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(4));
        await since('Recommendation counts2 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
        await setWindowSize(browserWindow);
    });

    it('[TC96365_17]Custom suggestion should not be removed when replaced by auto suggestion', async () => {
        //DE299280
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot2CustomSuggestionDisappearAfter2Questions.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.copyRecommendationToQuery(4);
        await aibotChatPanel.copyRecommendationToQuery(0);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await since('Recommendation counts1 to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });
});
