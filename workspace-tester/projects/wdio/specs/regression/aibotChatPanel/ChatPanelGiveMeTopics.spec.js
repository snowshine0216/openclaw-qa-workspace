//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelGiveMeTopics.spec.js'
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId, botChnUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('AIBotChatPanel GiveMeTopics', () => {
    const aibots = {
        bot1: {
            id: '6AF0E31BF544D8A99404E5B7A4B24B1E',
            name: '25. GiveMeTopics',
        },
        bot2: {
            id: 'C11BFB16BB46C2B3F48B5CB19AB2188C',
            name: '25. GiveMeTopics_YellowTheme',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC94329_1] Show give me topics', async () => {
        await libraryPage.openDefaultApp();
        await loginPage.login(chatPanelUser);
        //Open bot, show topics button enabled
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot1.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementEnabled(aibotChatPanel.getTopicsIcon());
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC94329_1',
            '01_Input_box_with_show_topics_button'
        );
        await aibotChatPanel.hoverOnTopicsBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTopicTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTopicTooltip(),
            'dashboardctc/ChatPanel/TC94329_1',
            '02_GiveMeTopic_Tooltip'
        );

        //Click show topics, show topics, then button disabled
        await aibotChatPanel.clickTopicsBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopic());
        await aibotChatPanel.hoverOnTopicsBtn();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC94329_1',
            '03_Topic_panel_shows_GiveMeTopic_disabled'
        );

        //Clear history, show topics button enabled
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await since('Clear history disabled topic button is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(false);

        //Chose topics, when generating, topics button disabled
        await browser.setNetworkConditions({ latency: 2000, throughput: 50 });
        await aibotChatPanel.sleep(1000);
        await aibotChatPanel.clickTopicsBtn();
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        void browser.pause(5000);
        await since('When question is generating topic button is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(true);
        await browser.deleteNetworkConditions();

        //After generation, show topics button enabled
        await aibotChatPanel.waitForTopicAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getDisabledTopicsIcon(), 15 * 1000);
        await since('Clear history, topic button is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isTopicsIconDisplayed())
            .toBe(true);
        await since('Clear history disabled topic button is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(false);

        //Input text, show send button
        await aibotChatPanel.getInputBox().click();
        const longQuestion = 'LongQuestion'.repeat(120);
        await aibotChatPanel.typeKeyboard(longQuestion);
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC94329_1',
            '04_Long_input'
        );
        //Delete input, show topics button
        await aibotChatPanel.getInputBox().setValue('test');
        await aibotChatPanel.clearInputbox();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTopicsIcon());
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC94329_1',
            '05_After_clear_input_show_topics_button_inline'
        );

        //After send question, show topics button again
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.copyRecommendationToQuery(0);
        await since('Input question the send button is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.isSendIconDisplayed())
            .toBe(true);
        await browser.setNetworkConditions({ latency: 2000, throughput: 50 });
        void browser.pause(5000);
        await aibotChatPanel.clickSendIcon();
        await since('When question is generating topic button is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(true);
        await browser.deleteNetworkConditions();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await since('After sending question topic button is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.isTopicsIconDisplayed())
            .toBe(true);
    });

    it('[TC94329_2] I18N | Show give me topic with bot theme', async () => {
        await libraryPage.openDefaultApp();
        await loginPage.login(botChnUser);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot2.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC94329_2',
            '01_Topics_button_YellowTheme_I18N'
        );
        await aibotChatPanel.hoverOnTopicsBtn();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTopicTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTopicTooltip(),
            'dashboardctc/ChatPanel/TC94329_2',
            '02_GiveMeTopic_Tooltip_YellowTheme_I18N'
        );
    });
});
