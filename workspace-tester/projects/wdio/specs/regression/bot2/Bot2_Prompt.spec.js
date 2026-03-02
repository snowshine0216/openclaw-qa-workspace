import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';

// npm run regression -- --spec=specs/regression/bot2/Bot2_Prompt.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 AI Powered Prompts on Landing Page', () => {
    const { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage,
        aibotChatPanel,
        botAuthoring,
        aiBotPromptPanel,
        historyPanel,
        bot2Chat,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const aibot = {
        id: 'EE34057E268B404B9B631533D6A979D6',
        name: 'AUTO_Prompts',
        project: project
    };

    const aibot2 = {
        id: '9B440B92FD5043AAB26AAB5F56E7F8A2',
        name: 'AUTO_Prompts_Consumption',
        project: project
    };

    const prompts = {
        flightsByYear: {
            name: 'Number of flights by year',
            question: 'Show me Number of flights by year in bar chart',
        },
        avgDelayByDay: {
            name: 'Avg Delay by day',
            question: 'Show me line chart with Day of Week, and Avg Delay (min)',
        },
        highestFlightsCancelled: {
            name: 'Highest Flights Cancelled',
            question: 'Which Airline Name has the highest Flights Cancelled',
        },

        flightsByAirport: {
            name: 'Number of flights by airport',
            question: 'Show me Number of flights by Origin Airport in bar chart',
        },
    };

    const chats = {
        playgroud: 'Prompt Playground',
    };

    const expectedKeywords = {
        flightsByYear: 'number of flights',
        highestFlightsCancelled: 'Southwest Airlines Co.',
        avgDelayByDay: 'Thursday',
        flightsByAirport: 'BWI',
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser2);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99225_1] Configuration: create prompts, save bot, modify prompt, save again', async () => {
        infoLog('switch to prompt panel, add 3 prompts');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('The greeting title on landing page should be #{expected}, but got: #{actual}')
            .expect(await aibotChatPanel.getWelcomePageGreetingTitle().getText())
            .toBe('Hi, bot2_automation!');

        await botAuthoring.selectBotConfigTabByName('Prompt');
        await aiBotPromptPanel.clickAddPromptBtn();
        await aiBotPromptPanel.clickAddPromptBtn();
        await aiBotPromptPanel.clickAddPromptBtn();
        await since('Expected prompts count to be #{expected}, but got #{actual}')
            .expect(await aiBotPromptPanel.getAllAliasObjCount())
            .toBe(3);
        
        infoLog('fill in first prompt');    
        await aiBotPromptPanel.renameAliasName(0, prompts.flightsByYear.name);
        await since(`First prompt name should be "${prompts.flightsByYear.name}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasNameInputByIndex(0).getAttribute('value'))
            .toBe(prompts.flightsByYear.name);
        await aiBotPromptPanel.updatePromptQuesion(0, prompts.flightsByYear.question);
        await since(`First prompt question should be "${prompts.flightsByYear.question}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasTextAreaContentByIndex(0).getText())
            .toBe(prompts.flightsByYear.question);

        infoLog('fill in second prompt');
        await since('Second prompt object should be visible. Expected: #{expected}, but got: #{actual}')
            .expect(await aiBotPromptPanel.getAliasObjByIndex(1).isDisplayed())
            .toBe(true);
        await aiBotPromptPanel.renameAliasName(1, prompts.avgDelayByDay.name);
        await since(`Second prompt name should be "${prompts.avgDelayByDay.name}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasNameInputByIndex(1).getAttribute('value'))
            .toBe(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.updatePromptQuesion(1, prompts.avgDelayByDay.question);
        await since(`Second prompt question should be "${prompts.avgDelayByDay.question}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasTextAreaContentByIndex(1).getText())
            .toBe(prompts.avgDelayByDay.question);

        infoLog('fill in third prompt');
        await since('Third prompt object should be visible. Expected: #{expected}, but got: #{actual}')
            .expect(await aiBotPromptPanel.getAliasObjByIndex(2).isDisplayed())
            .toBe(true);
        await aiBotPromptPanel.renameAliasName(2, prompts.highestFlightsCancelled.name);
        await since(`Third prompt name should be "${prompts.highestFlightsCancelled.name}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasNameInputByIndex(2).getAttribute('value'))
            .toBe(prompts.highestFlightsCancelled.name);
        await aiBotPromptPanel.updatePromptQuesion(2, prompts.highestFlightsCancelled.question);
        await since(`Third prompt question should be "${prompts.highestFlightsCancelled.question}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasTextAreaContentByIndex(2).getText())
            .toBe(prompts.highestFlightsCancelled.question);

        infoLog('save bot and verify prompt card on landing page');
        await botAuthoring.saveExistingBotV2();
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByYear.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);
   
        infoLog('modify first prompt');
        await botAuthoring.selectBotConfigTabByName('Prompt');
        await aiBotPromptPanel.renameAliasName(0, prompts.flightsByAirport.name);
        await since(`First prompt name should be "${prompts.flightsByAirport.name}". Expected: #{expected}, but got: #{actual}`)
            .expect(await aiBotPromptPanel.getAliasNameInputByIndex(0).getAttribute('value'))
            .toBe(prompts.flightsByAirport.name);
        await aiBotPromptPanel.updatePromptQuesion(0, prompts.flightsByAirport.question);
        await since(`First prompt question should be "${prompts.flightsByAirport.question}". Expected: #{expected}, but got: #{actual}`)
            .expect(await (await aiBotPromptPanel.getAliasTextAreaContentByIndex(0)).getText())
            .toBe(prompts.flightsByAirport.question);

        infoLog('click play the prompt before save, verify "Prompt Playgroud" chat');
        await aiBotPromptPanel.clickPromptPlayBtn(0);
        await aibotChatPanel.clickHistoryChatButton();
        await since('The chat history panel is present should be #{expected}, instead we have #{actual}')
            .expect(await historyPanel.isHistoryPanelPresent())
            .toBe(true);
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(prompts.flightsByAirport.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`The chat "${chats.playgroud}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPresent(chats.playgroud))
            .toBe(true);
        await since(`Answer should contain expected keywords: ${expectedKeywords.flightsByAirport}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.flightsByAirport))
            .toBe(true);
        await historyPanel.clickChatContextMenuBtn(chats.playgroud);
        await since('Third prompt object should be visible. Expected: #{expected}, but got: #{actual}')
            .expect(await historyPanel.getChatContextMenuItem('Rename').isDisplayed())
            .toBe(false);
        
        infoLog('save bot and verify prompt card on landing page');
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.clickNewChatButton();
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByAirport.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);

        infoLog('click play the prompt after save, verify question title');
        await aiBotPromptPanel.clickPromptPlayBtn(0);
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(prompts.flightsByAirport.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`Answer should contain expected keywords: ${expectedKeywords.flightsByAirport}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.flightsByAirport))
            .toBe(true);

        infoLog('delete "Prompt Playgroud" chat, delete all prompts');
        await historyPanel.deleteChat(chats.playgroud);
        await since(`The chat "${chats.playgroud}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPresent(chats.playgroud))
            .toBe(false);
        await aiBotPromptPanel.deleteAllPrompts();
        await botAuthoring.saveExistingBotV2();
    });

    it('[TC99225_2] Consumption: click prompts on landing page to trigger Q&A', async () => {
        infoLog('open bot in consumption mode, verify landing page');
        await libraryPage.openBotById({ projectId:project.id, botId:aibot2.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByYear.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);
        await browser.pause(5000);

        infoLog('click on prompt card on landing page');
        await aibotChatPanel.clickHistoryChatButton();
        await aiBotPromptPanel.clickPromptCardByTitle(prompts.flightsByYear.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(prompts.flightsByYear.name);
        await since(`Answer should contain expected keywords: ${expectedKeywords.flightsByYear}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.flightsByYear))
            .toBe(true);
        await historyPanel.deleteCurrentChat();

        await aibotChatPanel.clickNewChatButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByYear.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);
        await aiBotPromptPanel.clickPromptCardByTitle(prompts.avgDelayByDay.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(prompts.avgDelayByDay.name);
        await since(`Answer should contain expected keywords: ${expectedKeywords.avgDelayByDay}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.avgDelayByDay))
            .toBe(true);
        await historyPanel.deleteCurrentChat();

        infoLog('click on prompt card on landing page, clear history');
        await aibotChatPanel.clickNewChatButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByYear.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);
        await aiBotPromptPanel.clickPromptCardByTitle(prompts.highestFlightsCancelled.name);
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toContain(prompts.highestFlightsCancelled.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`Answer should contain expected keywords: ${expectedKeywords.highestFlightsCancelled}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.highestFlightsCancelled))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByYear.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);
        await historyPanel.deleteCurrentChat();

    });

    it('[TC99225_3] Consumption: verfiy prompts above input box', async () => {
        infoLog('verify prompt card on landing page');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot2.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.flightsByYear.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.avgDelayByDay.name);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.highestFlightsCancelled.name);

        infoLog('verify that prompt quick replies are not available when the chat is empty');
        await aibotChatPanel.clickHistoryChatButton();
        await since(`The prompt quick replies button should not be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await aiBotPromptPanel.getPromptQuickRepliesBtn().isDisplayed())
            .toBe(false);
        
        infoLog('click prompt quick replies');
        await aibotChatPanel.askQuestionNoWaitViz('hi');
        await since(`The prompt quick replies button should not be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await aiBotPromptPanel.getPromptQuickRepliesBtn().isDisplayed())
            .toBe(true);
        await aiBotPromptPanel.clickPromptQuickRepliesBtn();

        await since(`The prompt quick replies flightsByYear should displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await aiBotPromptPanel.getPromptQuickRepliesByTitle(prompts.flightsByYear.name).isDisplayed())
            .toBe(true);
        await since(`The prompt quick replies avgDelayByDay should displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await aiBotPromptPanel.getPromptQuickRepliesByTitle(prompts.avgDelayByDay.name).isDisplayed())
            .toBe(true);
        await since(`The prompt quick replies highestFlightsCancelled should displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await aiBotPromptPanel.getPromptQuickRepliesByTitle(prompts.highestFlightsCancelled.name).isDisplayed())
            .toBe(true);
        await browser.pause(5000)

        await aiBotPromptPanel.clickPromptQuickRepliesByTitle(prompts.flightsByYear.name);
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(prompts.flightsByYear.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`Answer should contain expected keywords: ${expectedKeywords.flightsByYear}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.flightsByYear))
            .toBe(true);

        await aiBotPromptPanel.clickPromptQuickRepliesByTitle(prompts.highestFlightsCancelled.name);
        await since(`The question sent should be #{expected}, while we get #{actual}`)
            .expect(await aibotChatPanel.getQueryTextByIndex(2))
            .toBe(prompts.highestFlightsCancelled.name);
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await since(`Answer should contain expected keywords: ${expectedKeywords.highestFlightsCancelled}`)
            .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords.highestFlightsCancelled))
            .toBe(true);

        infoLog('delete current chat');
        await historyPanel.deleteCurrentChat();
    });

});
