import { browserWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId, autoBotNoEditPrivilegeUser } from '../../../constants/bot.js';
import { clipboard } from 'clipboard-sys';
import { mockInterpretationError, mockInterpretationContents, } from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Interpretation', () => {
    const aibots = {
        bot1InterpretationWithHistory: {
            name: '24. Interpretation with history',
            id: 'CF32CC5E084DCACBDB31DE8DA8752C02',
        },
        bot2Interpretation: {
            id: '41421CC1804B8D95B9BCB5ACE24671CA',
            name: '23. Interpretation',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring, botConsumptionFrame } = browsers.pageObj1;
    let result =
        "Identify the country with the highest CO2 emissions from coal and display it in one grid, sorted by 'From Coal' in descending order.";

    beforeAll(async () => {
        await browser.mockRestoreAll();
    });

    afterEach(async () => {
        await browser.mockRestoreAll();
    });

    it('[TC93344_1]render bot with history and open interpretation power user consumption mode', async () => {
        let interpretedAs =
            "Identify the country with the highest CO2 emissions from coal and display it in one grid, sorted by 'From Coal' in descending order.";
        let LLMInstructions = 'SELECT `Country@ID`, `From Natural Gas/Capita` FROM `24. Interpretation with history`';
        await mockInterpretationContents(result);
        await loginPage.login(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot1InterpretationWithHistory.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_1',
            'Interpretation of bot with history'
        );
        await aibotChatPanel.clickInterpretation();
        await since('Interpretation panel close is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isInterpretationComponentDisplayed())
            .toBe(false);
        await aibotChatPanel.clickMarkDownByIndex(0);
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(1);
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.clickInterpretationCopyToQueryIcon();
        await since('Interpreted as text expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.getInterpretedAsText())
            .toBe(interpretedAs);
        await aibotChatPanel.clickInterpretationCopyLLMInstructionsIcon();
        //Can't run on ci
        //await since('LLM instructions text expected to be #{expected}, instead we have #{actual}}')
        //.expect(await clipboard.readText())
        //.toBe(LLMInstructions);
        await aibotChatPanel.clickInterpretationbyIndex(1);
        await aibotChatPanel.clickMarkDownByIndex(1);
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(2);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getChatPanel(),
            'dashboardctc/ChatPanel/TC93344_1',
            'Interpretation expand down'
        );
        await aibotChatPanel.scrollChatPanelToTop(-500);
        await aibotChatPanel.scrollChatPanelToBottom();
        await aibotChatPanel.clickExpandRecommendation();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_1',
            'Interpretation will not collapse'
        );
    });

    it('[TC93344_2]render bot with history no mock and open interpretation normal user consumption mode', async () => {
        await mockInterpretationContents(result);
        await libraryPage.switchUser(autoBotNoEditPrivilegeUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot1InterpretationWithHistory.id });
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_2',
            'Interpretation of bot with history'
        );
        await since('LLM instructions button display expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isInterpretationCopyLLMInstructionsIconDisplayed())
            .toBe(false);
    });

    it('[TC93344_3]ask question and open interpretation powser user edit mode ', async () => {
        await mockInterpretationContents(result);
        await libraryPage.switchUser(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot2Interpretation.id });
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('interpretation chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_3',
            'Interpretation of asking a question'
        );
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('interpretation chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isChatAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await botAuthoring.exitBotAuthoring();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_3',
            'Interpretation will not collapse after exit bot edit mode'
        );
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });

    it('[TC93344_4]Interpretation error handling ', async () => {
        await libraryPage.switchUser(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot2Interpretation.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await mockInterpretationError();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_4',
            'Interpretation error'
        );
        await browser.mockRestoreAll();
        await mockInterpretationContents(result);
        await aibotChatPanel.clickInterpretationReloadButton();
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_4',
            'Interpretation reload'
        );
    });

    it('[TC93344_5]Interpretation no mock', async () => {
        await libraryPage.switchUser(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot2Interpretation.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInterpretationComponent(),
            'dashboardctc/ChatPanel/TC93344_5',
            'Interpretation no mock'
        );
    });
});
