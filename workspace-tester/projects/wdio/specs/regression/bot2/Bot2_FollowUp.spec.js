import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bot 2.0 Follow Up', () => {
    const { loginPage, libraryPage, aibotChatPanel, bot2Chat, historyPanel } = browsers.pageObj1;
    const aibot = {
        id: '9CC318019FBB4B96BDF680B034F60833',
        name: 'AUTO_BOT_FollowUp',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_history = {
        id: '9F6F351E40C04BAF8A1EF210EDE3B018',
        name: 'AUTO_BOT_FollowUp_History',
        projectId: bot.project_applicationTeam.id,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser3);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.openBotById({ projectId: aibot.projectId, botId: aibot.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterAll(async () => {
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: aibot.id,
            projectId: aibot.projectId,
            credentials: bot.botUser3,
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99019_1] Follow up - Q&A on follow up question', async () => {
        const question1 = 'what is the profit by category';
        const keywords_1 = 'profit; Electronics; Music; Movies; Books; 2,334; 80; 106';
        const question2 = 'what is the cost by category';
        const keywords_2 = 'cost; Electronics; Music; Movies; Books; 964; 10,326';
        const question_quoted1 = 'calculate the total';
        const keywords_quoted1 = 'profit; 2,761; 2761';
        const question_quoted2 = 'calculate the total';
        const keywords_quoted2 = 'cost; 15,247; 15247';
        const question_quoted3 = 'show above in grid';
        const keywords_quoted3 = 'profit; 2,761; 2761 ';

        // send first question
        await aibotChatPanel.askQuestion(question1, true);
        await since(`send 1st question and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(false);
        await since(`send 1st question and answer should contain one of the keywords: ${keywords_1}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_1))
            .toBe(true);

        // send second question
        await aibotChatPanel.askQuestion(question2, true);
        await since(`send 2nd question and answer should contain one of the keywords: ${keywords_2}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_2))
            .toBe(true);

        // follow up on first question
        await aibotChatPanel.followUpByIndex(0);
        await since(`quoted 1st question and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.askQuestion(question_quoted1);
        await since(`quoted 1st question and answer should contain one of the keywords: ${keywords_quoted1}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_quoted1))
            .toBe(true);
        await since(`Quoted one and quoted message count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageCount())
            .toBe(1);

        // follow up on second question
        await aibotChatPanel.followUpByIndex(1);
        await since(`quoted 2nd question and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.askQuestion(question_quoted2);
        await since(`quoted 2nd question and answer should contain one of the keywords: ${keywords_quoted2}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_quoted2))
            .toBe(true);
        await since(`Quoted twice and quotedmessage count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageCount())
            .toBe(2);

        // follow up on follow-up question
        await aibotChatPanel.followUpByIndex(2);
        await since(`quoted follow-up question and quoted message present should be #{expected}, while get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.askQuestion(question_quoted3);
        await since(`quoted follow-up question and answer should contain one of the keywords: ${keywords_quoted3}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_quoted3))
            .toBe(true);
        await since(`Quoted third and quotedmessage count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageCount())
            .toBe(3);
    });

    it('[TC99019_2] Follow up - Clear quoted message by delete icon and clear history', async () => {
        const question = 'what is the profit by category?';
        const question_quoted = 'what is the total';
        const keywords = 'profit; 2,762; 2762';

        // send first question
        await aibotChatPanel.askQuestion(question, true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await since(`Follow up button present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.isFollowUpBtnDisplayedByLatestAnswer())
            .toBe(true);
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await since(`Follow up and quoted message in input box present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);

        // delete quoted message by delete icon
        await aibotChatPanel.clickQuotedMessageCloseButton();
        await since(`Delete and quoted message in input box present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(false);

        // follow up question
        await aibotChatPanel.followUpByIndex(0);
        await since(`Follow up and quoted message in input box present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.askQuestion(question_quoted);
        await since(`Answer should contain expected keywords: ${keywords}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);
        await since(`Quoted message count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageCount())
            .toBe(1);

        // delete quoted message by clear history
        await aibotChatPanel.followUpByIndex(1);
        await aibotChatPanel.copyQuestionToQuery(1);
        await since(`Follow up again and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.sleep(500); //wait for GUI to update
        await since(`Clear history and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(false);
    });

    it('[TC99019_3] Follow up - Ask again on a follow-up question', async () => {
        const question = 'what is the profit by category';
        const keywords = 'profit; Electronics; Music; Movies; Books; 2,334; 80; 106';
        const question_quoted = 'calculate the total';
        const keywords_quoted = 'profit; 2,761; 2761';

        // send question
        await aibotChatPanel.askQuestion(question, true);
        await since(`send question and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(false);
        await since(`send question and answer should contain one of the keywords: ${keywords}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);

        // follow up on question
        await aibotChatPanel.followUpByIndex(0);
        await since(`follow up and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.askQuestion(question_quoted);
        await since(`follow up and answer should contain one of the keywords: ${keywords_quoted}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_quoted))
            .toBe(true);
        await since(`follow up and quoted message count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageCount())
            .toBe(1);

        // ask again on follow-up question
        await aibotChatPanel.copyQuestionToQuery(1);
        await since(`ask again and quoted message present should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since(`ask again and answer should contain one of the keywords: ${keywords_quoted}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords_quoted))
            .toBe(true);
        await since(`ask again and quoted message count should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQuotedMessageCount())
            .toBe(2);
    });

    it('[TC99019_4] Follow up - Error handling when quoted question is deleted(> 30 history)', async () => {
        const error = 'This message was cleared in the history';

        await libraryPage.openBotById({ projectId: aibot.projectId, botId: aibot_history.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // switch to chat history
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat('DONOTDELETE_History');
        await historyPanel.closeChatHistoryPanel();

        // check follow up question which is alredy deleted due to > 30 history
        await since(`the warning message count should be greater than #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getFollowUpErrors().length)
            .toBeGreaterThan(1);
        await since(`the warning message should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getFollowUpErrorText())
            .toContain(error);
        await takeScreenshotByElement(await aibotChatPanel.getLatestFollowUpError(), 'TC99019_4', 'FollowUpError');
    });
});
