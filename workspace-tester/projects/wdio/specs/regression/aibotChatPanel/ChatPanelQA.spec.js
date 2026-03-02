import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';

describe('AIbotChatPanelQA', () => {
    const aibot = {
        id: 'C223BACF9C408CA2D52C998E349DA5FB',
        name: '13. QA',
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;
    let recommendationItemIndex = 1;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibot.id });
    });

    beforeEach(async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });

    it('[TC92368_1] ai bot qa welcome page copy recommendation', async () => {
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        let RecommendationToQuery = await aibotChatPanel.getRecommendationTextsByIndex(recommendationItemIndex);
        await aibotChatPanel.copyRecommendationToQuery(recommendationItemIndex);
        await since(
            'Welcome page copy recommendation contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(RecommendationToQuery);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'Welcome page copy recommendation chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since(
            'Welcome page copy recommendation viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelToTop();
        await since(
            'Welcome page copy recommendation question display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(RecommendationToQuery);
        await aibotChatPanel.clickExpandRecommendation();
        await since('recommendation update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(false);
    });

    it('[TC92368_2] ai bot qa input question', async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(recommendationItemIndex);
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        let inputQuestion = 'Which country has the highest CO2 emissions from coal?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Input chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatAnswerByIndexDisplayed(0))
            .toBe(true);
        await since('Input question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(inputQuestion);
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(1));
        await since('recommendation update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(false);
    });

    it('[TC92368_3] ai bot qa copy input question', async () => {
        let inputQuestion = 'Which country has the highest CO2 emissions from coal?';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.copyQuestionToQuery(0);
        await since(
            'Copy input question contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Input chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatAnswerByIndexDisplayed(0))
            .toBe(true);
        await since('Input question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(inputQuestion);
    });

    it('[TC92368_4] ai bot qa copy recommendation', async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(recommendationItemIndex);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(1));
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        let RecommendationToQuery = await aibotChatPanel.getRecommendationTextsByIndex(1);
        await aibotChatPanel.copyRecommendationToQuery(1);
        await since(
            'Copy recommendation contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(RecommendationToQuery);
        await since('AutoCompleteArea display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Copy recommendation chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since('Copy recommendation viz answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelToTop();
        await since('Input question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(RecommendationToQuery);
        await aibotChatPanel.clickExpandRecommendation();
        await since('recommendation update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(false);
    });

    it('[TC92368_5] ai bot qa click recommendation', async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(recommendationItemIndex);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(1));
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        let RecommendationToSend = await aibotChatPanel.getRecommendationTextsByIndex(1);
        await aibotChatPanel.clickRecommendationByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Copy recommendation chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since('Copy recommendation viz answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelTo(-500);
        await since('Copy recommendation question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(RecommendationToSend);
        await since('recommendation update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) !== recommendation)
            .toBe(true);
    });

    it('[TC92368_6] ai bot qa auto complete', async () => {
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(recommendationItemIndex);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.askQuestionByAutoComplete('country', 0);
        let askQuestionByAutoComplete = await aibotChatPanel.getInputBoxText();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'Ask question by autocomplete chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since(
            'Ask question by autocomplete viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelTo(-500);
        await since(
            'Ask question by autocomplete question display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(askQuestionByAutoComplete);
        await aibotChatPanel.clickExpandRecommendation();
        await since('recommendation update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(false);
    });

    it('[TC92368_7] ai bot qa copy auto complete', async () => {
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.askQuestionByAutoComplete('population', 0);
        await aibotChatPanel.typeKeyboard('for country');
        let askQuestionByAutoComplete = await aibotChatPanel.getInputBoxText();
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        let recommendation1 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await aibotChatPanel.scrollChatPanelTo(-500);
        await aibotChatPanel.sleep(3000);
        await aibotChatPanel.copyQuestionToQuery(0);
        await since(
            'Copy autocomplete contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(askQuestionByAutoComplete);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'Copy autocomplete question chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(1))
            .toBe(true);
        await since(
            'Copy autocomplete question viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(1))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelTo(-500);
        await since('Copy autocomplete question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(askQuestionByAutoComplete);
        await aibotChatPanel.clickExpandRecommendation();
        await since('recommendation1 update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation1)
            .toBe(false);

        //Recommendation should be updated after click refresh icon
        let recommendation2 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await aibotChatPanel.clickRefreshRecommendationIcon();
        await since('recommendation2 update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation2)
            .toBe(false);
    });

    it('[TC92368_8] cancel loading answer suggestion should show could clear history', async () => {
        //DE281580 and DE281728
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(recommendationItemIndex);
        await aibotChatPanel.clickCancelLoadingAnswerButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await since('cancel loading recommendation display1 is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(2))
            .toBe(true);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('List all countries with their CO2 emissions from coal.');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.clickCancelLoadingAnswerButton();
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await since('cancel loading recommendation display2 is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(2))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await since(
            'could clear history when only having question expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(true);
        await aibotChatPanel.sleep(2000); //avoid conflict with next clear history in afterEach step
    });

    it('[TC92368_9] XSS from Chatbot chat input box when copy to query box is clicked', async () => {
        //DE283273
        // eslint-disable-next-line prettier/prettier
        let inputQuestion = "'><img src=\"x\" onerror=\"alert('Previoustablecolumn1')\">";
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(inputQuestion);
        await since(
            'Type input question contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.copyQuestionToQuery(0);
        await since(
            'Copy input question contents in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.sleep(2000); //avoid conflict with next clear history in afterEach step
        await aibotChatPanel.copyQuestionToQuery(0);
        await since(
            'Copy input question content again in input field is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(inputQuestion);
        await aibotChatPanel.sleep(2000); //avoid conflict with next clear history in afterEach step
    });

    afterEach(async () => {
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });
});
