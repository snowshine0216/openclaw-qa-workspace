import * as consts from '../../../constants/teams.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import reinstallApp from '../../../api/teams/reinstallApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('QA', () => {
    let { infoWindow, libraryPage, teamsDesktop, aibotChatPanel, mainTeams, conversation } = browsers.pageObj1;

    const question1 = 'show a bar chart of total cost and category using retail analysis bot',
        question2 = 'show a grid of top 2 total cost and category using retail analysis bot',
        question3 = 'show the top 5 items by gross profit in line chart using retail analysis bot ',
        bot = 'Retail Analysis Bot',
        team = 'F41100',
        channel = 'TestQA';

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await reinstallApp([
            { teams: '94570715-1976-496a-a630-2e7ef908565d' }, //F41100
        ]);
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        await teamsDesktop.switchToActiveWindow();
    });

    afterEach(async () => {
        await browser.switchToFrame(null);
        await mainTeams.switchToAppInSidebar('Teams');
    });

    afterAll(async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('bot@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('bot');
        }
    });

    it('[TC95661_01] Verify QA in 1-1 chat', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser('bot@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('bot');
        }
        // clear history in bot
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossier(bot);
        await aibotChatPanel.clearHistory();
        // ask question in 1-1 chat
        await mainTeams.switchToChat(consts.teamsApp);
        await conversation.switchToTabInChat('Home');
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: question1 });
        // viz size
        await since('1 Viz size should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer())
            .toBe(true);
        // bot name
        await since('2 Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessage())
            .toBe(bot);
        await takeScreenshotByElement(
            conversation.getVizImageInLatestMessage(),
            'TC95661_01_01',
            'Viz image in bar chart',
            { tolerance: 8 }
        );
        // open home tab, history sync and viz render
        await conversation.switchToTabInChat('Home');
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossier(bot);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('3 Viz type should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatBotVizByType('Bar Chart').isDisplayed())
            .toBe(true);
        // color palette
        await since('4 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
    });

    it('[TC95661_02] Verify QA in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.botInTeamsUser.credentials.username);
        // clear history in bot
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossier(bot);
        await aibotChatPanel.clearHistory();
        // clear badge on Activity
        await mainTeams.switchToAppInSidebar('Activity');
        await mainTeams.waitForElementInvisible(mainTeams.getBadgeOnActivity());
        // ask question in group chat
        await mainTeams.switchToChat(consts.testGroupChat1);
        await conversation.askQuestionsWithMention({ question: question2, mention: consts.teamsApp });
        await mainTeams.sleep(5000);
        await mainTeams.waitForElementVisible(mainTeams.getBadgeOnActivity());
        await mainTeams.switchToAppInSidebar('Activity');
        await since('1 Message preview should contain #{expected}, instead we have #{actual}')
            .expect(await mainTeams.getMessagePreviewInActivity())
            .toContain('total cost');
        await mainTeams.switchToChat(consts.testGroupChat1);
        await since('2 Is viz size correct should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer())
            .toBe(true);
        await since('3 Tag user should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTagInLatestResponse())
            .toBe(consts.botInTeamsUser.name);
        await since('4 Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessage())
            .toBe(bot);
        await takeScreenshotByElement(
            conversation.getVizImageInLatestMessage(),
            'TC95661_02_01',
            'Viz image in grid',
            { tolerance: 8 }
        );
        // open home tab, history sync and viz render
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossier(bot);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('5 Viz type should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatBotVizByType('Grid').isDisplayed())
            .toBe(true);
    });

    it('[TC95661_03] Verify QA in channel', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        // clear history in bot
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossier(bot);
        await aibotChatPanel.clearHistory();
        // clear badge on Activity
        await mainTeams.switchToAppInSidebar('Activity');
        await mainTeams.waitForElementInvisible(mainTeams.getBadgeOnActivity());
        // ask question in channel
        await mainTeams.switchToTeamsChannel({ team, channel });
        await conversation.askQuestionsWithMention({ question: question3, mention: consts.teamsApp, isChannel: true });
        await mainTeams.sleep(5000);
        await mainTeams.waitForElementVisible(mainTeams.getBadgeOnActivity());
        await mainTeams.switchToAppInSidebar('Activity');
        await since('1 Preview message should be #{expected}, instead we have #{actual}')
            .expect(await mainTeams.getMessagePreviewInActivity())
            .toContain('The top 5 items by gross profit are led by');
        await mainTeams.switchToTeamsChannel({ team, channel });
        await since('2 Is viz size correct should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer(true))
            .toBe(true);
        await since('3 Tag user should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTagInLatestResponse(true))
            .toBe(consts.autoInTeamsUser.name);
        await since('4 Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessage(true))
            .toBe(bot);
        await takeScreenshotByElement(
            conversation.getVizImageInLatestMessage(true),
            'TC95661_03_01',
            'Viz image in line chart',
            { tolerance: 8 }
        );
        // open bot in library, history sync and viz render
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossier(bot);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('5 Viz type should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatBotVizByType('Line Chart').isDisplayed())
            .toBe(true);
    });

    it('[TC95661_04] Verify privilege error', async () => {
        // switch to user "Megan"
        if (!(await teamsDesktop.checkCurrentTeamsUser('MeganB@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Megan Bowen');
        }
        // greeting hi in 1-1 chat
        await mainTeams.switchToChat(consts.teamsApp);
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await since('1 Greeting in chat when no privilege should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noPrivilegeError);
        await conversation.askQuestionsByWaiting({ question: question1 });
        await since('2 Answer in chat when no privilege should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noPrivilegeError);
        // greeting hello in group chat
        await mainTeams.switchToChat(consts.testGroupChat1);
        await conversation.askQuestionsByWaiting({ question: 'hello', mention: consts.teamsApp });
        await since('3 Greeting in group when no privilege should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noPrivilegeError);
        await conversation.askQuestionsByWaiting({ question: question1, mention: consts.teamsApp });
        await since('4 Answer in group when no privilege should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noPrivilegeError);
        // greeting what can you do in channel
        await mainTeams.switchToTeamsChannel({ team, channel });
        await conversation.askQuestionsByWaiting({
            question: 'what can you do?',
            isChannel: true,
            mention: consts.teamsApp,
        });
        await since('5 Greeting in channel when no privilege should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.noPrivilegeError);
        await conversation.askQuestionsByWaiting({ question: question1, isChannel: true, mention: consts.teamsApp });
        await since('6 Answer in channel when no privilege should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.noPrivilegeError);
    });

    it('[TC95661_05] Verify no bots error', async () => {
        // switch to user with no bots
        if (!(await teamsDesktop.checkCurrentTeamsUser('JoniS@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Joni Sherman');
        }
        // greeting hi in 1-1 chat
        await mainTeams.switchToChat(consts.teamsApp);
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await since('1 Greeting in chat when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noBotsError);
        await conversation.askQuestionsByWaiting({ question: question1 });
        await since('2 Answer in chat when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noBotsError);
        // greeting hello in group chat
        await mainTeams.switchToChat(consts.testGroupChat1);
        await conversation.askQuestionsByWaiting({ question: 'hello', mention: consts.teamsApp });
        await since('3 Greeting in group when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.simpleGreetingMessage);
        await conversation.askQuestionsByWaiting({ question: question1, mention: consts.teamsApp });
        await since('4 Answer in group when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noBotsError);
        // greeting what can you do in channel
        await mainTeams.switchToTeamsChannel({ team, channel });
        await conversation.askQuestionsByWaiting({
            question: 'what can you do?',
            isChannel: true,
            mention: consts.teamsApp,
        });
        await since('5 Greeting in channel when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.simpleGreetingMessage);
        await conversation.askQuestionsByWaiting({ question: question1, isChannel: true, mention: consts.teamsApp });
        await since('6 Answer in channel when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.noBotsError);
    });

    it('[TC95661_06] Check typing animation', async () => {
        if (!(await teamsDesktop.checkCurrentTeamsUser(consts.autoInTeamsUser.credentials.username))) {
            await teamsDesktop.switchToTeamsUser(consts.autoInTeamsUser.name);
        }
        // ask question in 1-1 chat
        await mainTeams.switchToChat(consts.teamsApp);
        await conversation.askQuestions(question1);
        await conversation.waitForElementVisible(await conversation.getTypingAnimation());
        await conversation.waitForElementStaleness(await conversation.getTypingAnimation());
        // ask question in group chat
        await mainTeams.switchToChat(consts.testGroupChat1);
        await conversation.askQuestionsWithMention({ question: question1 });
        await conversation.waitForElementVisible(await conversation.getTypingAnimation());
    });
});
