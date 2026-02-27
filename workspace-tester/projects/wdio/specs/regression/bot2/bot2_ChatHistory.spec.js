import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';

// npm run regression -- --spec=specs/regression/bot2/bot2_ChatHistory.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 Chat History Panel', () => {
    const { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage,
        aibotChatPanel,
        historyPanel,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const aibot = {
        id: '78412F33121D41BA9C6508629827DF83',
        name: 'AUTO_HistoryPanel',
        project: project
    };

    const Q = {
        question1: 'show me category by profit',
        question2: '告诉我利润最高的类别名字',
        // Arabic (rigth to left language): Which airports have the most flight delays?
        question3: 'ما هي أكثر المطارات تأخيراً في مواعيد الرحلات؟',
    };

    const chats = {
        flightChinese: 'Flight Chinese',
        productQ415: 'Product Q 4/15',
        chat415: '4/15_chat',
        newChat: 'New Chat',
        topCategoryProfit: 'Top categories by profit',
        test: 'test',
        chineseQPartial: '利润',
        arabicQPartial: 'تأخير',
    };


    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser2);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99146_1] Open chat history panel, switch chats, create new chat, delete/reneme chat', async () => {
        infoLog('enable chat history panel');
        await aibotChatPanel.clickHistoryChatButton();
        await since('The chat history panel is present should be #{expected}, instead we have #{actual}')
            .expect(await historyPanel.isHistoryPanelPresent())
            .toBe(true);
        await historyPanel.clickChatCategoryHeader('2025');
        await since('The chat category "2025" should be expanded. Expected: #{expected}, but got: #{actual}}')
            .expect(await historyPanel.isChatCategoryOpen('2025'))
            .toBe(true);
        
        infoLog('switch chats');
        await historyPanel.switchToChat(chats.productQ415);
        await since(`The chat "${chats.productQ415}" should be currently open. Expected: #{expected}, but got: #{actual}`)
            .expect(await historyPanel.isChatCurrent(chats.productQ415))
            .toBe(true);

        infoLog('create new chat');
        await aibotChatPanel.clickNewChatButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await since(`The chat "${chats.newChat}" should be currently open. Expected: #{expected}, but got: #{actual}`)
            .expect(await historyPanel.isChatCurrent(chats.newChat))
            .toBe(true);

        infoLog('rename the chat');
        await historyPanel.renameChat(chats.newChat, chats.test);
        await since(`The chat "${chats.test}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPresent(chats.test))
            .toBe(true);

        infoLog('delete the chat')
        await historyPanel.deleteChat(chats.test);
        await since(`The chat "${chats.test}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPresent(chats.test))
            .toBe(false);
    });

    it('[TC99146_2] New chat, rename chat, ask quesion, verify chat title', async () => {
        infoLog('create new chat');
        await aibotChatPanel.clickNewChatButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());

        infoLog('enable history panel, rename the chat');
        await aibotChatPanel.clickHistoryChatButton();
        await since('The chat history panel is present should be #{expected}, instead we have #{actual}')
            .expect(await historyPanel.isHistoryPanelPresent())
            .toBe(true);
        await historyPanel.renameChat(chats.newChat, chats.topCategoryProfit);
        await since(`The chat "${chats.topCategoryProfit}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPresent(chats.topCategoryProfit))
            .toBe(true);

        infoLog('ask question in new chat, verify the chat title');
        await aibotChatPanel.askQuestionNoWaitViz(Q.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(Q.question1);
        await since(`The chat "${chats.topCategoryProfit}" should be currently open. Expected: #{expected}, but got: #{actual}`)
            .expect(await historyPanel.isChatCurrent(chats.topCategoryProfit))
            .toBe(true);
        
        infoLog('expand/collapse chat category')
        await historyPanel.clickChatCategoryHeader('Today');
        await since('The chat category "Today" should be collapsed. Expected: #{expected}, but got: #{actual}}')
            .expect(await historyPanel.isChatCategoryOpen('Today'))
            .toBe(false);
        await historyPanel.clickChatCategoryHeader('Today');
        await since('The chat category "Today" should be expanded. Expected: #{expected}, but got: #{actual}}')
            .expect(await historyPanel.isChatCategoryOpen('Today'))
            .toBe(true);

        infoLog('delete the chat')
        await historyPanel.deleteChat(chats.topCategoryProfit);
        await since(`The chat "${chats.topCategoryProfit}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPresent(chats.topCategoryProfit))
            .toBe(false);
        await since('The chat catgeory "Today" should be displayed. Expected: #{expected}, but got: #{actual}}')
            .expect(await historyPanel.getChatCategoryByName('Today').isDisplayed())
            .toBe(false);
    });

    it('[TC99146_3] Search in chat history panel', async () => {
        infoLog('enable chat history panel');
        await aibotChatPanel.clickHistoryChatButton();
        await since('The chat history panel is present should be #{expected}, instead we have #{actual}')
            .expect(await historyPanel.isHistoryPanelPresent())
            .toBe(true);
        await historyPanel.clickChatCategoryHeader('2025');
        await since('The chat category "2025" should be expanded. Expected: #{expected}, but got: #{actual}}')
            .expect(await historyPanel.isChatCategoryOpen('2025'))
            .toBe(true);
        await historyPanel.switchToChat(chats.flightChinese);
        
        infoLog('search chat title, clear search');
        await historyPanel.searchChat('4/15');
        await since('Number of chats should be #{expected}, instead we have #{actual}}')
            .expect(await historyPanel.getChatCount())
            .toBe(2);
        await historyPanel.clearChatSearch();
        await since('Number of chats should be #{expected}, instead we have #{actual}}')
            .expect(await historyPanel.getChatCount())
            .toBe(4);

        infoLog('search chat content, clear search');
        await historyPanel.searchChat('book');
        await since('Number of chats should be #{expected}, instead we have #{actual}}')
            .expect(await historyPanel.getChatCount())
            .toBe(2);
        await historyPanel.clearChatSearch();
        await since('Number of chats should be #{expected}, instead we have #{actual}}')
            .expect(await historyPanel.getChatCount())
            .toBe(4);
        
        infoLog('close chat history panel')
        await historyPanel.closeChatHistoryPanel();
        await since('The chat history panel is present should be #{expected}, instead we have #{actual}')
            .expect(await historyPanel.isHistoryPanelPresent())
            .toBe(false);

    });

    it('[TC99146_4] i18n ask question in non-English, verify chat title', async () => {
        infoLog('ask Chinese question in new chat');
        await aibotChatPanel.askQuestionNoWaitViz(Q.question2);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(Q.question2);
        
        infoLog('ask Arabic question in new chat');
        await aibotChatPanel.clickNewChatButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.askQuestionNoWaitViz(Q.question3);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(Q.question3);

        infoLog('enable history panel and verify the title');
        await aibotChatPanel.clickHistoryChatButton();
        await since('The chat history panel is present should be #{expected}, instead we have #{actual}')
            .expect(await historyPanel.isHistoryPanelPresent())
            .toBe(true);
        await historyPanel.clickChatCategoryHeader('2025');
        await since('The chat category "2025" should be expanded. Expected: #{expected}, but got: #{actual}}')
            .expect(await historyPanel.isChatCategoryOpen('2025'))
            .toBe(true);
        
        // The chat title is generated by AI, so it's not the same every time. 
        // Verify partial text in chat title
        await since('Number of chats should be #{expected}, instead we have #{actual}}')
            .expect(await historyPanel.getChatCount())
            .toBe(6);
        await since(`The chat "${chats.chineseQPartial}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPartialNamePresent(chats.chineseQPartial))
            .toBe(true);
        await since(`The chat "${chats.arabicQPartial}" should be displayed. Expected: #{expected}, but got: #{actual}}`)
            .expect(await historyPanel.isChatPartialNamePresent(chats.arabicQPartial))
            .toBe(true);
        await since(`The chat "${chats.newChat}" should be present. Expected: #{expected}, but got: #{actual}`)
            .expect(await historyPanel.isChatPresent(chats.newChat))
            .toBe(false);
        
        infoLog('delete the chats')
        await historyPanel.deleteChatByIndex(0);
        await historyPanel.deleteChatByIndex(0);
        await since('Number of chats should be #{expected}, instead we have #{actual}}')
            .expect(await historyPanel.getChatCount())
            .toBe(4);
    });
});
