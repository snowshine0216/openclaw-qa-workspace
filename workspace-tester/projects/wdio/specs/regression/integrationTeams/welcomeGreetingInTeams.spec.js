import * as consts from '../../../constants/teams.js';
import { mstrUser } from '../../../constants/bot.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import reinstallApp from '../../../api/teams/reinstallApp.js';

describe('Test welcome and greeting in Teams', () => {
    let { mainTeams, apps, teamsDesktop, conversation, teamsViewAllBotsPage } = browsers.pageObj1;
    const teamsApp = browsers.params.teamsAppName;
    const testUserWithLessBot = 'PattiF@nvy2.onmicrosoft.com';

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await reinstallApp([
            { teams: 'e52ecfde-b408-4b36-8b3e-14094f17075f' }, // Auto_Teams
        ]);
        await resetObjectAcl({
            credentials: mstrUser,
            object: {
                id: consts.mstrStockBot.id,
                name: consts.mstrStockBot.name,
                project: consts.mstrStockBot.project,
            },
            acl: [
                {
                    value: 'Full Control',
                    id: consts.botInTeamsUser.id,
                    name: consts.botInTeamsUser.credentials.username,
                },
            ],
        });
        await teamsDesktop.switchToActiveWindow();
    });

    beforeEach(async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.botInTeamsUser.credentials.username);
        await apps.openTeamsApp(teamsApp);
        await mainTeams.switchToChat(teamsApp);
    });

    afterEach(async () => {
        await teamsViewAllBotsPage.closeViewAllBotsWindow();
    });

    afterAll(async () => {
        await mainTeams.switchToAppInSidebar(teamsApp);
    });

    it('[TC95620_01] trigger welcome page in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        const textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since(
            `1. welcome page should include ${consts.greetingMessage1InWelcomeCard} , instead it does not and actual text is ${textAnswer}`
        )
            .expect(textAnswer.includes(consts.greetingMessage1InWelcomeCard))
            .toBe(true);
        await since(
            `2. welcome page should include ${consts.greetingMessage2InWelcomeCard} , instead it does not and actual text is ${textAnswer}`
        )
            .expect(textAnswer.includes(consts.greetingMessage2InWelcomeCard))
            .toBe(true);
        await since(
            `3. welcome page should include ${consts.greetingMessage3InWelcomeCard} , instead it does not and actual text is ${textAnswer}`
        )
            .expect(textAnswer.includes(consts.greetingMessage3InWelcomeCard))
            .toBe(true);
        await takeScreenshotByElement(
            await conversation.getLatestReceivedChatMessage(),
            'TC95620_01_01',
            'welcome card',
            { tolerance: 5 }
        );
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC95620_01_02',
            'view all bots in welcome card'
        );
    });

    it('[TC95620_02] show greetings when hover on bot in view all bots window', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await teamsViewAllBotsPage.triggerTooltipOnBotItem(1);
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC95620_02_01',
            'hover to show greeting message'
        );
    });

    it('[TC95620_03] send greeting in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'what can you do?' });
        await takeScreenshotByElement(
            await conversation.getLatestReceivedChatMessage(),
            'TC95620_03_01',
            'welcome card',
            { tolerance: 2 }
        );
        const textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since(
            `1. welcome page should include ${consts.greetingMessage1InWelcomeCard} , instead it does not and actual text is ${textAnswer}`
        )
            .expect(textAnswer.includes(consts.greetingMessage1InWelcomeCard))
            .toBe(true);
    });

    it('[TC95620_04] send hi in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToChat(consts.testGroupChat3);
        await conversation.waitForChatTabLoaded(consts.testGroupChat3);
        await conversation.askQuestionsByWaiting({ question: 'hi', mention: teamsApp });
        await takeScreenshotByElement(
            await conversation.getLatestChatMessage(),
            'TC95620_04_01',
            'greeting message in group chat'
        );
    });

    it('[TC95620_05] send greeting in group chat', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToChat(consts.testGroupChat3);
        await conversation.waitForChatTabLoaded(consts.testGroupChat3);
        await conversation.askQuestionsByWaiting({ question: 'what do you do?', mention: teamsApp });
        await takeScreenshotByElement(
            await conversation.getLatestChatMessage(),
            'TC95620_05_01',
            'greeting message in group chat'
        );
    });

    it('[TC95620_06] send greeting in teams channel', async () => {
        const channel = 'General';
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.autoInTeamsUser.credentials.username);
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await conversation.askQuestionsWithMention({ question: 'hi', mention: teamsApp, isChannel: true });
        await conversation.getResponseInLatestMessage();
        await since('Greeting in channel should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.simpleGreetingMessage);
    });

    // DE305614 - [Teams] [aqdt-mirror3] bot list in welcome page is not align to bots list in view all bots window
    it('[TC95620_09] switch user with different welcome contents', async () => {
        await teamsDesktop.switchToTeamsUserIfNeeded(testUserWithLessBot);
        await apps.openTeamsApp(teamsApp);
        await mainTeams.switchToChat(teamsApp);
        await conversation.switchToTabInChat('Home');
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(
            await conversation.getLatestReceivedChatMessage(),
            'TC95620_09_01',
            'welcome card with 1 bot',
            { tolerance: 5 }
        );
        await teamsDesktop.switchToTeamsUserIfNeeded(consts.botInTeamsUser.credentials.username);
        await apps.openTeamsApp(teamsApp);
        await mainTeams.switchToChat(teamsApp);
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(
            await conversation.getLatestReceivedChatMessage(),
            'TC95620_09_02',
            'welcome card with more than 5 bots',
            { tolerance: 5 }
        );
    });
});
