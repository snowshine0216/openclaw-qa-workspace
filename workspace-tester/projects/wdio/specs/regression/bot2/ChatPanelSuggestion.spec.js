import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { infoLog } from '../../../config/consoleFormat.js';
import urlParser from '../../../api/urlParser.js';
import { project_applicationTeam } from '../../../constants/bot2.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';

//npm run regression -- --baseUrl=http://10.23.32.212:8080/MicroStrategyLibrary/ --params.credentials.username=admin --params.credentials.password= --spec specs/regression/bot2/ChatPanelSuggestion.spec.js --params.locale=en_US

describe('Chat Panel Suggestion', () => {
    //TODO: Need to update after the tanzu automation environment is ready
    const botSuggestionUser = {
        username: 'bot2_auto_suggestion',
        password: '',
    };

    const botFor0Suggestion = {
        botId: 'E6DBADC7EB4B82942F0530A65B5D2068',
        name: 'Suggestion - 0',
        projectId: project_applicationTeam.id,
    };
    const botFor1Suggestion = {
        botId: '818853873D4E3D3BA9E392A36DE38782',
        name: 'Suggestion - 1',
        projectId: project_applicationTeam.id,
    };
    const botFor5Suggestions = {
        botId: 'E405956167BA43EC86BF31ACA7B823D6',
        name: 'Suggestion - 5',
        projectId: project_applicationTeam.id,
    };
    const botForSuggestion = botFor5Suggestions;

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botSuggestionUser);
        await libraryPage.waitForLibraryLoading();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99007_1] BotSuggestion_Expand and collapse status', async () => {
        infoLog('0. Open bot');
        await libraryPage.openBotById(botForSuggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());

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
        await aibotChatPanel.sleep(200);

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

    it('[TC99007_2] BotSuggestion_Custom suggestion', async () => {
        // Open bot
        await libraryPage.openBotById(botForSuggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());

        const firstCustomSuggestionIndex = 3;
        const customSuggestionTexts = ['Custom suggestion 1', 'Custom suggestion 2'];

        infoLog('Check the custom suggestion');
        await aibotChatPanel.waitForRecommendationLoading();
        for (let i = 0; i < customSuggestionTexts.length; i++) {
            await since('Recommendations should be custom suggestion')
                .expect(await aibotChatPanel.getRecommendationTextsByIndex(firstCustomSuggestionIndex + i))
                .toBe(customSuggestionTexts[i]);
        }

        infoLog('Check the custom suggestion after clicked');
        const customSuggestion = await aibotChatPanel.getRecommendationTextsByIndex(firstCustomSuggestionIndex)
        await aibotChatPanel.clickRecommendationByIndex(firstCustomSuggestionIndex);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.openRecommendationPanel();
        await since('Recommendations is updated after click')
            .expect(await aibotChatPanel.getRecommendationTextsByIndex(firstCustomSuggestionIndex))
            .not.toBe(customSuggestion);
    });

    it('[TC99007_3] BotSuggestion_Different suggestion numbers', async () => {
        // No suggestion
        infoLog('Check the 0 suggestion case');
        await libraryPage.openBotById(botFor0Suggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Recommendations should not be displayed if 0 suggestion')
            .expect(await aibotChatPanel.isRecommendationDisplayed())
            .toBe(false);
        await browser.back();
        await libraryPage.waitForLibraryLoading();

        // 1 suggestion
        infoLog('Check the 1 suggestion case');
        await libraryPage.openBotById(botFor1Suggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());

        await aibotChatPanel.waitForRecommendationLoading();
        await since('The 1st recommendation should be displayed if 1 suggestion')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(1);
        await browser.back();
        await libraryPage.waitForLibraryLoading();

        // 5 suggestions
        infoLog('Check the 5 suggestions case');
        await libraryPage.openBotById(botFor5Suggestions);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());

        await aibotChatPanel.waitForRecommendationLoading();
        await since('The 5th recommendation should be displayed if 5 suggestions')
            .expect(await aibotChatPanel.getRecommendationCount())
            .toBe(5);
    });

    it('[TC99007_4] BotSuggestion_Suggestion when hide metric/atrribute', async () => {
        await libraryPage.openBotById(botForSuggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());

        // Hidden attribute
        const hiddenAttribute = 'Subcategory';
        await aibotChatPanel.askQuestion(`how about the ${hiddenAttribute}?`);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.openRecommendationPanel();

        for (let i = 0; i < 3; i++) {
            await since('Recommendations should be displayed')
                .expect(await aibotChatPanel.getRecommendationByIndex(i))
                .not.toContain(hiddenAttribute);
        }

        // Hidden metric
        const hiddenMetric = 'Unit Price';
        await aibotChatPanel.askQuestion(`how about the ${hiddenMetric}?`);
        await aibotChatPanel.waitForAnswerLoading();

        for (let i = 0; i < 3; i++) {
            await since('Recommendations should be displayed')
                .expect(await aibotChatPanel.getRecommendationByIndex(i))
                .not.toContain(hiddenMetric);
        }
    });

    it('[TC99007_5] BotSuggestion_Check suggestion payload', async () => {
        // delete chat
        await deleteBotV2ChatByAPI({
            ...botForSuggestion,
            credentials: botSuggestionUser,
        });

        const baseUrl = urlParser(browser.options.baseUrl);
        const getSuggestionsMock = await browser.mock(`${baseUrl}/api/questions/suggestions?conversationId=**`);

        infoLog('check the suggestion request is sent with empty history payload');
        await libraryPage.openBotById(botForSuggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationLoading();
        const emptyRequestBodyJSON = getSuggestionsMock.calls[0].postData;
        const emptyRequestBody = JSON.parse(emptyRequestBodyJSON);
        await since('payload should be empty if no question asked').expect(emptyRequestBody.history.length).toBe(0);
        await since('payload should be empty if no question asked').expect(emptyRequestBody.charts.length).toBe(0);

        infoLog('check the suggestion request is sent after asking an error question');
        await aibotChatPanel.askQuestion('Test');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.openRecommendationPanel();
        const createQuestionMock = await browser.mock(`${baseUrl}/api/questions?conversationId=**`);
        createQuestionMock.respondOnce({ error: 'error' }, { statusCode: 500, fetchResponse: false });
        await aibotChatPanel.askQuestion('Test');
        await aibotChatPanel.waitForAnswerLoading();
        const requestWithErrorAnswerJSON = getSuggestionsMock.calls[1].postData;
        const requestWithErrorAnswer = JSON.parse(requestWithErrorAnswerJSON);
        await since('payload should be updated after asking a question')
            .expect(requestWithErrorAnswer.history.length)
            .toBe(1);

        infoLog('check the suggestion request is sent after asking a correct question');
        await aibotChatPanel.askQuestion('How about the Category?');
        await aibotChatPanel.waitForAnswerLoading();

        const requestWithRightAnswerJSON2 = getSuggestionsMock.calls[2].postData;
        const requestWithRightAnswer2 = JSON.parse(requestWithRightAnswerJSON2);
        await since('payload should be updated after asking a question')
            .expect(requestWithRightAnswer2.history.length)
            .toBe(1);


    });

    it('[TC99007_6] BotSuggestion_Check suggestion request in different scenarios', async () => {
        const baseUrl = urlParser(browser.options.baseUrl);
        const getSuggestionsMock = await browser.mock(`${baseUrl}/api/questions/suggestions?conversationId=**`);

        infoLog('open bot with edit mode');
        await libraryPage.editBotByUrl(botForSuggestion);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForRecommendationLoading();
        await since('The suggestion request should be sent for the intiail loading')
            .expect(getSuggestionsMock.calls.length)
            .toBe(1);

        infoLog('open data option panel and edit dataset options');
        await botAuthoring.selectBotConfigTabByName('Data');
        await botAuthoring.clickBotConfigDatasetDescription();
        await botAuthoring.getBotConfigDatasetDescriptionInputText().addValue('Test');

        infoLog('check the suggestion request is not sent when editing dataset description');
        await aibotChatPanel.waitForRecommendationLoading();
        await since('The suggestion request should not be sent when editing dataset description')
            .expect(getSuggestionsMock.calls.length)
            .toBe(1);

        infoLog('check the suggestion request is sent when saving the dataset description');
        await botAuthoring.clickSaveButton();
        await botAuthoring.waitForSaveAsButtonClickable();
        await aibotChatPanel.waitForRecommendationLoading();
        await since('The suggestion request should be sent after saving')
            .expect(getSuggestionsMock.calls.length)
            .toBe(2);
    });
});
