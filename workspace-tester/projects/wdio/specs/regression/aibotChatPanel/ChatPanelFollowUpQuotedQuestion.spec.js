import { browserWindowTallHeight } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import { chatPanelUser, conEduProId, botChatConfigI18NUser, languageIdMap } from '../../../constants/bot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import deleteUserNuggets from '../../../api/bot/nuggets/deleteUserNuggetsRestAPI.js';
import urlParser from '../../../api/urlParser.js';

describe('Chat Panel Follow Up Quoted Question', () => {
    const baseUrl = urlParser(browser.options.baseUrl);
    const aibot = {
        id: '3843E36D7E49A0FAFDCF64813CE340A6',
        name: '35. Follow up request',
    };

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring, aibotDatasetPanel, libraryAuthoringPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await resetUserLanguage({ credentials: botChatConfigI18NUser });
        await setUserLanguage({
            baseUrl,
            userId: botChatConfigI18NUser.id,
            adminCredentials: botChatConfigI18NUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await loginPage.login(botChatConfigI18NUser);
        await setWindowSize(browserWindowTallHeight);
    });

    beforeEach(async () => {
        await deleteUserNuggets({ credentials: botChatConfigI18NUser });
    });

    afterAll(async () => {
        await browser.mockRestoreAll();
        await logoutFromCurrentBrowser();
    });

    function extractInfo(requestMock) {
        var followUpFlag = false;
        var parsedPostData;
        var parsedQuotedQuestion;
        for (let i = 0; i < requestMock.matches.length; i++) {
            if (requestMock.matches[i].body.questionAssessment) {
                followUpFlag = requestMock.matches[i].body.questionAssessment.followUp;
                parsedPostData = JSON.parse(requestMock.matches[i].postData);
                parsedQuotedQuestion = parsedPostData.quotedQuestion;
                break;
            }
        }

        for (let i = 0; i < requestMock.matches.length; i++) {
            parsedPostData = JSON.parse(requestMock.matches[i].postData);
            if (parsedPostData.quotedQuestion) {
                parsedQuotedQuestion = parsedPostData.quotedQuestion;
                break;
            }
        }
        return { followUpFlag, parsedQuotedQuestion };
    }

    it('[TC96447_1] Remove viz request and quoted question parents max length is 3', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        // 1. Clear history and ask question
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        const requestMock = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion1 = 'Which top 2 country has the highest population density?';
        await aibotChatPanel.askQuestion(inputQuestion1);
        const firstMatchRequest = requestMock.matches[0];
        const postData = JSON.parse(firstMatchRequest.postData);
        await expect(postData.quotedQuestion).toBeUndefined();

        // 2. Ask not explicitlyQuoted question
        const requestMock2 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion2 = 'Which top 2 country has the lowest population density?';
        await aibotChatPanel.askQuestion(inputQuestion2);
        var parsedQuotedQuestion;
        var followUpFlag2 = false;
        ({ followUpFlag: followUpFlag2, parsedQuotedQuestion } = extractInfo(requestMock2));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(parsedQuotedQuestion.parents).toEqual([]);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);

        // 3. Quote 2nd question, explicitlyQuoted
        const requestMock3 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion3 = 'What is the median age in the top 2 countries with the lowest population density?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion3);
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(1, 1);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        var followUpFlag3 = false;
        ({ followUpFlag: followUpFlag3, parsedQuotedQuestion } = extractInfo(requestMock3));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        if (followUpFlag2) {
            await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion1);
        } else {
            await expect(parsedQuotedQuestion.parents).toEqual([]);
        }
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(followUpFlag3).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion2);

        // 4. Ask not explicitlyQuoted question, follow up is true
        const requestMock4 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        var inputQuestion =
            'What is the net change in population in the top 2 countries with the lowest population density?';
        await aibotChatPanel.askQuestion(inputQuestion);
        var followUpFlag4 = false;
        ({ followUpFlag: followUpFlag4, parsedQuotedQuestion } = extractInfo(requestMock4));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        if (followUpFlag2) {
            await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion2);
            await expect(parsedQuotedQuestion.parents[1].question).toEqual(inputQuestion1);
        } else {
            await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion2);
        }
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion3);

        // 5. Quote 1st answer
        const requestMock5 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion5 =
            'What is the yearly change in population in the top 2 countries with the highest population density?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion5);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        var followUpFlag5 = false;
        ({ followUpFlag: followUpFlag5, parsedQuotedQuestion } = extractInfo(requestMock5));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(followUpFlag5).toBe(true);
        await expect(parsedQuotedQuestion.parents).toEqual([]);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion1);

        // 6. Quote 5th answer, templateAvailable will be true
        const requestMock6 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion6 = 'What is the world share of the top 2 countries with the highest population density?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion6);
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(6, 4);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(2000);
        var followUpFlag6 = false;
        ({ followUpFlag: followUpFlag6, parsedQuotedQuestion } = extractInfo(requestMock6));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion1);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion5);
        await expect(followUpFlag6).toBe(true);

        // 7. No quote, templateAvailable will be true, no remove viz request send out, 2nd vizs used in 6th question
        const requestMock7 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const removeVizRequestMock7 = await browser.mock('**/instance/**', { method: 'put' });
        const inputQuestion7 = 'What is yearly change of the top 2 country with the highest population density?';
        await aibotChatPanel.askQuestion(inputQuestion7);
        await browser.pause(2000);
        var followUpFlag7 = false;
        ({ followUpFlag: followUpFlag7, parsedQuotedQuestion } = extractInfo(requestMock7));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion); // when quote  question 2, will beInvalid template unit key
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion5);
        await expect(parsedQuotedQuestion.parents[1].question).toEqual(inputQuestion1);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion6);
        var index = removeVizRequestMock7.calls.length - 1;
        var parsedPageState = JSON.parse(removeVizRequestMock7.matches[index].postData).pageState;
        await expect(parsedPageState.widgetState.actions[0].act).toEqual('removeUnit');

        // 8. Not quote, templateAvailable will be true, send remove viz request
        const requestMock8 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const removeVizRequestMock8 = await browser.mock('**/instance/**', { method: 'put' });
        const inputQuestion8 = 'Which top 2 country has the highest yearly change?';
        await aibotChatPanel.askQuestion(inputQuestion8);
        await browser.pause(2000);
        var followUpFlag8 = false;
        ({ followUpFlag: followUpFlag8, parsedQuotedQuestion } = extractInfo(requestMock8));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion7);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        if (followUpFlag7) {
            await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion6);
            await expect(parsedQuotedQuestion.parents[1].question).toEqual(inputQuestion5);
            await expect(parsedQuotedQuestion.parents[2].question).toEqual(inputQuestion1);
        }
        // await expect(removeVizRequestMock8.calls.length).toEqual(3);
        index = removeVizRequestMock8.calls.length - 1;
        parsedPageState = JSON.parse(removeVizRequestMock8.matches[index].postData).pageState;
        await expect(parsedPageState.widgetState.actions[0].act).toEqual('removeUnit');

        // 9. Quote 8th answer again, parent max length is 3
        const requestMock10 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        inputQuestion =
            'What is the urban population percentage in the top 2 countries with the highest yearly change in fertility rate?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(10, 7);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        var followUpFlag9 = false;
        ({ followUpFlag: followUpFlag9, parsedQuotedQuestion } = extractInfo(requestMock10));
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion8);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        if (followUpFlag8) {
            await expect(parsedQuotedQuestion.parents[0].question).toEqual(inputQuestion7);
            if (followUpFlag7) {
                await expect(parsedQuotedQuestion.parents[1].question).toEqual(inputQuestion6);
                await expect(parsedQuotedQuestion.parents[2].question).toEqual(inputQuestion5);
                await expect(parsedQuotedQuestion.parents.length).toEqual(3);
            }
        }
    });

    it('[TC96447_2] templateAvailable will be false when viz deleted of the quoted question', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        var inputQuestion = 'Which top 2 countries have the highest population density?';
        await aibotChatPanel.askQuestion(inputQuestion);

        inputQuestion = 'Which top 2 countries have the lowest population density?';
        await aibotChatPanel.askQuestion(inputQuestion);

        inputQuestion = 'Which top 3 countries have the lowest urban population percentage?';
        await aibotChatPanel.askQuestion(inputQuestion);

        //Update question to avoid error: It seems there was an issue retrieving the data. Please try again or check if the data is available.
        inputQuestion = 'Which top 3 countries with the lowest fertility rate?';
        await aibotChatPanel.askQuestion(inputQuestion);

        inputQuestion = 'Which top 3 countries with the lowest net change?';
        await aibotChatPanel.askQuestion(inputQuestion);

        // sliding winodw is 5, ask 6th question, 1st viz will be deleted since it's not used in the last 5 questions
        const removeVizRequestMock = await browser.mock('**/instance/**', { method: 'put' });
        inputQuestion = 'Which top 3 countries with the lowest yearly change?';
        await aibotChatPanel.askQuestion(inputQuestion);
        await browser.pause(1000);
        const index = removeVizRequestMock.calls.length - 1;
        const parsedPageState = JSON.parse(removeVizRequestMock.matches[index].postData).pageState;
        await expect(parsedPageState.widgetState.actions[0].act).toEqual('removeUnit');

        // Quoted 1st question, templateAvailable will be false since removed in the 5th question
        const requestMock2 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        inputQuestion = 'What is the median age for the top 3 countries with the highest yearly population change?'; // hit 'invalid templateunit key' error
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        const parsedQuotedQuestion = JSON.parse(requestMock2.matches[0].postData).quotedQuestion;
        console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(false);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
    });

    it('[TC96447_3] Follow up on topics answer', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        // 1. Does not explicitly Quoted 3rd topics answer, templateAvailable always be false for topics DE301624
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.clickChatPanelTopicByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        // const requestMock1 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        // var inputQuestion = 'Which top 2 countries have the highest population density?';
        // await aibotChatPanel.askQuestion(inputQuestion);
        // await browser.pause(1000);
        // var parsedQuotedQuestion = JSON.parse(requestMock1.matches[0].postData).quotedQuestion;
        // await expect(parsedQuotedQuestion.templateAvailable).toBe(false);
        // await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        // await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        // await expect(parsedQuotedQuestion.parents).toEqual([]);
        // await expect(parsedQuotedQuestion.question).toEqual('Which country has the highest yearly population change?');

        // // 2. Explicitly Quoted 2nd topics answer
        // const requestMock2 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        // inputQuestion = 'Which top 2 countries have the highest population density?';
        // await aibotChatPanel.getInputBox().click();
        // await aibotChatPanel.typeKeyboard(inputQuestion);
        // await aibotChatPanel.scrollChatPanelTo(-400);
        // await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(1, 1);
        // await aibotChatPanel.clickSendIcon();
        // await aibotChatPanel.waitForAnswerLoading();
        // await browser.pause(1000);
        // parsedQuotedQuestion = JSON.parse(requestMock2.matches[0].postData).quotedQuestion;
        // await expect(parsedQuotedQuestion.templateAvailable).toBe(false);
        // await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        // await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
        // await expect(parsedQuotedQuestion.parents).toEqual([]);
        // await expect(parsedQuotedQuestion.question).toEqual('What is the average world share of the population?');

        // 3. Explicitly Quoted 1st topics answer
        const markDownCount = await aibotChatPanel.getMarkDownAnswerCount();
        const requestMock3 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion = 'What is the net change in population for the top 2 countries with smallest population?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        const parsedQuotedQuestion = JSON.parse(requestMock3.matches[0].postData).quotedQuestion;
        //console.log('Parsed postData.quotedQuestion:', parsedQuotedQuestion);
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true); // topic request changed to similar as open-ended question
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.parents).toEqual([]);
        if (markDownCount == 1) {
            await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        } else {
            await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
        }
        //await expect(parsedQuotedQuestion.question).toEqual('What is the average yearly population change?');
    });

    it('[TC96447_4] Clear history should clear quoted question but NOT text in input box', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        var inputQuestion = 'Which top 2 countries have the highest population density?';
        await aibotChatPanel.askQuestion(inputQuestion);
        await aibotChatPanel.waitForAnswerLoading();

        inputQuestion = 'Which top 2 countries have the highest population density?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.clearHistory();
        await since('Quoted question displayed in input box is #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isQuotedQuestionDisplayedInInputBox())
            .toBe(false);
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Question sent is #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isMarkDownByIndexDisplayed(0))
            .toBe(true);
    });

    it('[TC96447_5] Edit or replace dataset or save bot should remove viz', async () => {
        // 1. save bot, viz pool will be cleared by iserver, no remove viz request send from client, templateAvailable will be false
        await libraryPage.editBotByUrl({ projectId: conEduProId, botId: '8DB90F651644CEA87F3ED684658C5EFC' }); //35.c Follow up edit dataset
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        const inputQuestion1 = 'Which 2 top airlines have the most delays?'; // did you mean can show out
        await aibotChatPanel.askQuestion(inputQuestion1);
        await aibotChatPanel.waitForAnswerLoading();
        const removeVizRequestMock = await browser.mock('**/instance/**', { method: 'put' });
        await botAuthoring.saveBot(true, true);
        await browser.pause(1000);
        // no remove viz request send from client
        await expect(removeVizRequestMock.calls.length).toEqual(0);

        const requestMock1 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion2 = 'Which 2 top airlines have the least delays?';
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.askQuestion(inputQuestion2); // did you mean can show out
        await browser.pause(1000);
        var parsedQuotedQuestion = JSON.parse(requestMock1.matches[0].postData).quotedQuestion;
        // templateAvailable will be false when quote 1st question
        await expect(parsedQuotedQuestion.templateAvailable).toBe(false);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.parents).toEqual([]);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion1);

        // 2. Edit dataset
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        const removeVizRequestMock2 = await browser.mock('**/instance/**', { method: 'put' });
        await aibotDatasetPanel.clickMojoPageButton('Update Dataset');
        await aibotDatasetPanel.waitForEditPageClose();
        await browser.pause(1000);
        // no remove viz request send from client
        await expect(removeVizRequestMock2.calls.length).toEqual(0);

        const requestMock2 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion3 = 'Which 2 top airlines have the most on-time flights?';
        await aibotChatPanel.askQuestion(inputQuestion3);
        await browser.pause(1000);
        parsedQuotedQuestion = JSON.parse(requestMock2.matches[0].postData).quotedQuestion;
        // templateAvailable will be false when not explicitly quote last question
        await expect(parsedQuotedQuestion.templateAvailable).toBe(false);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion2);
    });

    it('[TC96447_6] Ask again in smart suggestion', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: '8DB90F651644CEA87F3ED684658C5EFC' }); //35.c Follow up edit dataset
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        const inputQuestion1 = 'What is the average delay by departure hour?';
        await aibotChatPanel.askQuestion(inputQuestion1);
        await aibotChatPanel.waitForAnswerLoading();

        const inputQuestion2 = 'flights?';
        await aibotChatPanel.askQuestion(inputQuestion2);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getEnabledSmartSuggestion(0));
        const requestMock = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const learningRequestMock = await browser.mock('**/api/aiservice/chats/learnings', { method: 'post' });
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        const parsedQuotedQuestion = JSON.parse(requestMock.matches[0].postData).quotedQuestion;
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion1); // Fixed DE301420 issue 2: should quote 1st question

        const parsedLearningPostData = JSON.parse(learningRequestMock.matches[0].postData);
        await expect(parsedLearningPostData.history[0].question).toEqual(inputQuestion1); //DE302439
        await expect(parsedLearningPostData.history[1].question).toEqual(inputQuestion2);

        const inputQuestion3 = 'Which 2 top airlines have the Flights?';
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.askQuestion(inputQuestion3);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getEnabledSmartSuggestion(0));
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await aibotChatPanel.clickSmartSuggestionCopyIcon(); // DE301420 issue 1: ask again should show quoted question in input box
        await since('Quoted question should be displayed in input box is #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isQuotedQuestionDisplayedInInputBox())
            .toBe(true);

        await aibotChatPanel.clickCloseQuotedMessageIcon();
        await since('Quoted question should be displayed in input box is #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isQuotedQuestionDisplayedInInputBox())
            .toBe(false);
    });

    it('[TC96447_7] Quoted questions in alternativeSuggestions', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: '10B34C1125416701027EF597BCFFB9DB' }); //35.d Follow up questions in alternativeSuggestions
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());

        const inputQuestion1 = 'Which 2 top airlines have the most Flights Cancelled?';
        const requestMock1 = await browser.mock('**/api/aiservice/chats/alternativeSuggestions', { method: 'post' });
        await aibotChatPanel.askQuestion(inputQuestion1);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        var parsedHistory = '';
        if (requestMock1.matches.length > 0) {
            parsedHistory = JSON.parse(requestMock1.matches[0].postData).context.history;
            await expect(parsedHistory).toEqual([]);
        }

        const requestMock2 = await browser.mock('**/api/aiservice/chats/alternativeSuggestions', { method: 'post' });
        const inputQuestion2 = 'Which 2 top airlines have the most Time?'; //'Which 2 top airlines have the least Flights Cancelled?';
        await aibotChatPanel.askQuestion(inputQuestion2);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        if (requestMock2.matches.length > 0) {
            parsedHistory = JSON.parse(requestMock2.matches[0].postData).context.history;
            await expect(parsedHistory[0].question).toBe(inputQuestion1);
        }
        const requestMock3 = await browser.mock('**/api/aiservice/chats/alternativeSuggestions', { method: 'post' });
        const inputQuestion3 = 'Which 3 top airlines have the Flights Cancelled?';
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(1, 1);
        await aibotChatPanel.askQuestion(inputQuestion3);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        if (requestMock3.matches.length > 0) {
            parsedHistory = JSON.parse(requestMock3.matches[0].postData).context.history;
            await expect(parsedHistory[0].question).toBe(inputQuestion1);
            await expect(parsedHistory[1].question).toBe(inputQuestion2);
        }

        const requestMock4 = await browser.mock('**/api/aiservice/chats/alternativeSuggestions', { method: 'post' });
        const inputQuestion4 = 'Which 3 top airlines have the most del?';
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(3, 2);
        await aibotChatPanel.askQuestion(inputQuestion4);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        if (requestMock4.matches.length > 0) {
            parsedHistory = JSON.parse(requestMock4.matches[0].postData).context.history;
            await expect(parsedHistory[0].question).toBe(inputQuestion1);
            await expect(parsedHistory[1].question).toBe(inputQuestion2);
            await expect(parsedHistory[2].question).toBe(inputQuestion3);
        }

        const inputQuestion5 = 'Which 2 top airlines have the most delay?';
        const requestMock5 = await browser.mock('**/api/aiservice/chats/alternativeSuggestions', { method: 'post' });
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(5, 3);
        await aibotChatPanel.askQuestion(inputQuestion5);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        if (requestMock5.matches.length > 0) {
            parsedHistory = JSON.parse(requestMock5.matches[0].postData).context.history;
            await expect(parsedHistory[0].question).toBe(inputQuestion1);
            await expect(parsedHistory[1].question).toBe(inputQuestion2);
            await expect(parsedHistory[2].question).toBe(inputQuestion3);
            await expect(parsedHistory[3].question).toBe(inputQuestion4);
        }
    });

    it('[TC96447_8] Quoted questions in thumb down and smart suggestion learning', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: '8DB90F651644CEA87F3ED684658C5EFC' }); //35.c Follow up edit dataset
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        const inputQuestion1 = 'List Airline name';
        await aibotChatPanel.askQuestion(inputQuestion1);
        await aibotChatPanel.waitForAnswerLoading();

        const inputQuestion2 = 'What is the average delay by departure hour?';
        await aibotChatPanel.askQuestion(inputQuestion2);
        await aibotChatPanel.waitForAnswerLoading();

        const inputQuestion3 = 'the most flight';
        const alternativeSuggestionsMock = await browser.mock('**/api/aiservice/chats/alternativeSuggestions', {
            method: 'post',
        });
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.askQuestion(inputQuestion3);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(4000);
        if (alternativeSuggestionsMock.matches.length > 0) {
            // on ci, no smart suggestion sometimes...
            //console.log('8 alternativeSuggestionsMock.matches.length:', alternativeSuggestionsMock.matches.length);
            await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
            await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
            await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
            await aibotChatPanel.waitForElementVisible(aibotChatPanel.getEnabledSmartSuggestion(0));
            const parsedHistory = JSON.parse(alternativeSuggestionsMock.matches[0].postData).context.history;
            console.log('8 postData:', JSON.parse(alternativeSuggestionsMock.matches[0].postData));
            await expect(parsedHistory[0].question).toBe(inputQuestion1);
            await expect(parsedHistory.length).toEqual(1);
        }

        const requestMock = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const learningRequestMock = await browser.mock('**/api/aiservice/chats/learnings', { method: 'post' });
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(3000);
        const parsedQuotedQuestion = JSON.parse(requestMock.matches[0].postData).quotedQuestion;
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion1);
        await since(
            'Question from smart suggestion should be with quoted message, MarkDown count should be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.getMarkDownAnswerCount())
            .toEqual(6);

        var parsedLearningPostData = JSON.parse(learningRequestMock.matches[0].postData);
        await expect(parsedLearningPostData.history[0].question).toEqual(inputQuestion1); //DE302439

        // thumb down learning
        await aibotChatPanel.scrollChatPanelToBottom();
        // let lastMarkDownIndex = (await aibotChatPanel.getMarkDownAnswerCount()) - 1;
        // let lastThumbDownCount = (await aibotChatPanel.getThumbDownCount()) - 1;
        await aibotChatPanel.hovertoClickThumbDownbyIndex(5, 3);
        const learningRequestMock2 = await browser.mock('**/api/aiservice/chats/learnings', { method: 'post' });
        await aibotChatPanel.clickFeedbackTabByName('Incorrect data');
        await aibotChatPanel.inputFeedbackContents('Not based on average delay');
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await browser.pause(3000);
        parsedLearningPostData = JSON.parse(learningRequestMock2.matches[0].postData);
        await expect(parsedLearningPostData.history[0].question).toEqual(inputQuestion1);
    });

    function extractPostData(requestMock) {
        var parsedQuotedQuestion;
        for (let i = 0; i < requestMock.matches.length; i++) {
            const parsedPostData = JSON.parse(requestMock.matches[i].postData);
            if (parsedPostData.quotedQuestion) {
                parsedQuotedQuestion = parsedPostData.quotedQuestion;
                break;
            }
        }
        return { parsedQuotedQuestion };
    }

    it('[TC96447_9] Not explicitly follow up with open ended question', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: 'DCA6F642FB4DC43172D6DD8E25C2C93E' }); //35.e Follow up open-ended
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());

        // 1. ask 1st open-ended question
        const inputQuestion1 = 'Tell me something interesting about Units Available. open-ended';
        await aibotChatPanel.askQuestion(inputQuestion1);
        await aibotChatPanel.waitForAnswerLoading();

        // 2. ask 2nd open-ended question
        const inputQuestion2 = 'Tell me something interesting about Supplier. open-ended';
        const requestMockOpenEnded2 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        await aibotChatPanel.askQuestion(inputQuestion2);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(3000);
        var { parsedQuotedQuestion } = extractPostData(requestMockOpenEnded2);
        await expect(
            parsedQuotedQuestion.templateAvailable,
            `Q2 Expected templateAvailable to be true, but got: ${parsedQuotedQuestion.templateAvailable}`
        ).toBe(true);
        await expect(
            parsedQuotedQuestion.explicitlyQuoted,
            `Q2 Expected explicitlyQuoted to be false, but got: ${parsedQuotedQuestion.explicitlyQuoted}`
        ).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.parents).toEqual([]);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion1);

        // 3. ask one precise question
        const requestMock3 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        const inputQuestion3 = 'Which month has the highest unit sales?';
        await aibotChatPanel.askQuestion(inputQuestion3);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(1000);
        ({ parsedQuotedQuestion } = extractPostData(requestMock3));
        await expect(
            parsedQuotedQuestion.explicitlyQuoted,
            `Q3 Expected explicitlyQuoted to be false, but got: ${parsedQuotedQuestion.explicitlyQuoted}`
        ).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion2);

        // 4. ask one open-ended question
        const requestMock4 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        await aibotChatPanel.askQuestion(inputQuestion1);
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(3000);
        ({ parsedQuotedQuestion } = extractPostData(requestMock4));
        await expect(
            parsedQuotedQuestion.templateAvailable,
            `Q4 Expected templateAvailable to be true, but got: ${parsedQuotedQuestion.templateAvailable}`
        ).toBe(true);
        await expect(
            parsedQuotedQuestion.explicitlyQuoted,
            `Q4 Expected explicitlyQuoted to be false, but got: ${parsedQuotedQuestion.explicitlyQuoted}`
        ).toBe(false);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion3);
    });

    it('[TC96447_10] Explicitly follow up with open ended question', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: '635441010642DF6973011592FAA5F520' }); //35.f Follow up open-ended airline
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        // 1. topcis
        await aibotChatPanel.clickChatPanelTopicByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        var markDownCount = await aibotChatPanel.getMarkDownAnswerCount();
        //const topicsQuestion1 = await aibotChatPanel.getMarkDownTextByIndex(0);

        // 2. follow up on topics answer, ask one open-ended question
        const inputQuestion2 = 'Show me something interesting. open-ended';
        const requestMock1 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion2);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(2000);
        var parsedQuotedQuestion = JSON.parse(requestMock1.matches[0].postData).quotedQuestion;
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true); // topics's template now is also available
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        //await expect(parsedQuotedQuestion.question).toEqual(topicsQuestion1);
        await expect(parsedQuotedQuestion.parents).toEqual([]);
        if (markDownCount == 1) {
            await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        } else {
            await expect(parsedQuotedQuestion.latestQuestion).toBe(false);
        }

        var firstOpenEndedUserMessage1, firstOpenEndedUserMessage2, firstOpenEndedUserMessage3;
        var count = 0;
        var postData = '';
        for (var i = requestMock1.matches.length - 1; i >= 0; i--) {
            postData = JSON.parse(requestMock1.matches[i].postData);
            if (postData.userMessage) {
                count++;
                if (count === 1) {
                    firstOpenEndedUserMessage3 = postData.userMessage;
                } else if (count === 2) {
                    firstOpenEndedUserMessage2 = postData.userMessage;
                } else if (count === 3) {
                    firstOpenEndedUserMessage1 = postData.userMessage;
                }
            }
        }

        // 3. quote open-ended question, ask precise question
        const requestMock2 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        markDownCount = await aibotChatPanel.getMarkDownAnswerCount();
        var followUpCount = await aibotChatPanel.getFollowUpCount();
        const inputQuestion3 = 'Which airport has the most flight cancellations?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion3);
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(markDownCount - 1, followUpCount - 1);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        parsedQuotedQuestion = JSON.parse(requestMock2.matches[0].postData).quotedQuestion;
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(firstOpenEndedUserMessage3);
        //await expect(parsedQuotedQuestion.parents[0].question).toEqual(topicsQuestion1);

        // 4. quote normal question, ask open-ended question
        markDownCount = await aibotChatPanel.getMarkDownAnswerCount();
        followUpCount = await aibotChatPanel.getFollowUpCount();
        const requestMock3 = await browser.mock('**/api/aiservice/chats/recommendations/dossier', { method: 'post' });
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion2);
        await aibotChatPanel.hoverChatAnswertoClickFollowUpbyIndex(markDownCount - 1, followUpCount - 1);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await browser.pause(3000);
        parsedQuotedQuestion = JSON.parse(requestMock3.matches[0].postData).quotedQuestion;
        await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        await expect(parsedQuotedQuestion.question).toEqual(inputQuestion3);

        // parsedQuotedQuestion = JSON.parse(requestMock3.matches[1].postData).quotedQuestion;
        // await expect(parsedQuotedQuestion.templateAvailable).toBe(true);
        // await expect(parsedQuotedQuestion.explicitlyQuoted).toBe(true);
        // await expect(parsedQuotedQuestion.latestQuestion).toBe(true);
        // await expect(parsedQuotedQuestion.question).toEqual(inputQuestion3);
        // await expect(parsedQuotedQuestion.parents[0].question).toEqual(firstOpenEndedUserMessage3);

        // 5. thumb down in open-ended question
        await aibotChatPanel.scrollChatPanelToBottom();
        markDownCount = await aibotChatPanel.getMarkDownAnswerCount();
        const thumbDownCount = await aibotChatPanel.getThumbDownCount();
        await aibotChatPanel.hovertoClickThumbDownbyIndex(markDownCount - 1, thumbDownCount - 1);
        const learningRequestMock = await browser.mock('**/api/aiservice/chats/learnings', { method: 'post' });
        await aibotChatPanel.clickFeedbackTabByName('Incorrect data');
        await aibotChatPanel.inputFeedbackContents('Not exactly');
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await browser.pause(3000);
        const parsedLearningPostData = JSON.parse(learningRequestMock.matches[0].postData);
        //await expect(parsedLearningPostData.history[0].question).toEqual(topicsQuestion1);
        await expect(parsedLearningPostData.history[1].question).toEqual(firstOpenEndedUserMessage3);
        await expect(parsedLearningPostData.history[2].question).toEqual(inputQuestion3);
    });
});
