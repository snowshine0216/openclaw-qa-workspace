import * as consts from '../../../constants/teams.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';



describe('Teams Bot 2.0', () => {
    let { infoWindow, libraryPage, teamsDesktop, aibotChatPanel, mainTeams, conversation, apps, teamsViewAllBotsPage, teamsInteractiveChart } = browsers.pageObj1;

    const question1 = 'What is the tenure of employee "Qiuchen Xu"?',
        question2 = 'show me a bar chart of Umsatz in Euro by Warensortiment and Ländercode',
        question3 = "show me a grid of Umsatz in Euro by Warensortiment and Ländercode",
        bot1 = 'HRS Bot',
        bot2 = 'DMTECH机器人',
        teamsApp = 'Eng_bot',
        groupChat = 'Test Group',
        team = 'Bot2.0',
        channel = 'Auto';

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        // await reinstallApp([
        //     { teams: '77f548e3-58e3-43c9-8d33-eb6700682daa' }, //Bot2.0
        // ]);
        await teamsDesktop.switchToActiveWindow('https://teams.microsoft.com/v2/?ring=ring3_6', 'Chat');
        await apps.openTeamsApp(teamsApp);
        await mainTeams.switchToChat(teamsApp);
        if (!(await teamsDesktop.checkCurrentTeamsUser('bot@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('bot', 'https://teams.microsoft.com/v2/?ring=ring3_6', 'Chat');
        }
        await apps.openTeamsApp(teamsApp);
        await mainTeams.switchToChat(teamsApp);
    });

    afterAll(async () => {
        await browser.switchToFrame(null);
        await mainTeams.switchToChat(teamsApp);
    });


    it('[TC99023_01] trigger welcome page in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        const botNumber = await conversation.getNumberOfBotInWelcomeCard();
        await since('the number of bots in welcome card should be 5, instead we have #{actual}')
            .expect(botNumber)
            .toBe(5);
        const textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since(
            `1. welcome page should include ${consts.greetingMessage1InBot2} , instead it does not and actual text is ${textAnswer}`
        )
            .expect(textAnswer.includes(consts.greetingMessage1InBot2))
            .toBe(true);
        await since(
            `2. welcome page should include ${consts.greetingMessage2InBot2} , instead it does not and actual text is ${textAnswer}`
        )
            .expect(textAnswer.includes(consts.greetingMessage2InBot2))
            .toBe(true);
        await takeScreenshotByElement(
            await conversation.getLatestReceivedChatMessage(),
            'TC99023_01',
            'welcome card',
            { tolerance: 5 }
        );
        await conversation.clickViewAllAgentsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC99023_01',
            'view all bots in welcome card'
        );
        await teamsViewAllBotsPage.closeViewAllBotsWindow();
    });

    it('[TC99023_02] Verify QA in 1-1 chat', async () => {
        await conversation.switchToTabInChat('Chat');
        // ask question without viz
        await conversation.askQuestionsByWaiting({ question: question1 });
        let textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since('ask for tenure. Answer should contain #{expected}, instead we have #{actual}')
            .expect(textAnswer.includes('12.80 years'))
            .toBe(true);
        await since('ask for tenure. Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessageV2())
            .toBe(bot1);

        // ask question with viz
        await conversation.askQuestionsByWaiting({ question: question2 });
        
        // viz size
        await since('1 Viz size should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer())
            .toBe(true);
        // bot name
        await since('2 Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessageV2())
            .toBe(bot2);
        // verify view more message
        await since('3 View more message should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getViewMoreMessageOfLatestMessage())
            .toBe(consts.viewMoreMessage);
        await takeScreenshotByElement(
            conversation.getVizImageInLatestMessage(),
            'TC99023_02',
            'Viz image in bar chart',
            { tolerance: 6 }
        );
        await conversation.clickViewMoreButtonOfLatestMessage();
        await teamsInteractiveChart.waitForLoadingOfViz();
        // await takeScreenshotByElement(
        //     teamsInteractiveChart.getVisualization(),
        //     'TC99023_02',
        //     'Interactive viz in bar chart',
        //     { tolerance: 8 }
        // );

        // click interpretation button check bg color and close
        await since('4 Interpretation bg color should be #{expected}, instead we have #{actual}')
            .expect(await teamsInteractiveChart.getInterpretationBackgroundColor())
            .toBe('rgb(242, 243, 245)');
        await teamsInteractiveChart.clickInterpretationButton();
        await since('5 Open interpretation, interpretation bg color should be #{expected}, instead we have #{actual}')
            .expect(await teamsInteractiveChart.getInterpretationBackgroundColor())
            .toBe('rgb(233, 242, 254)');
        await teamsInteractiveChart.clickInterpretationButton();
        // enable data labels
        await teamsInteractiveChart.modifyChartOption('Data Labels', 'Enable');
        await takeScreenshotByElement(
            teamsInteractiveChart.getVisualization(),
            'TC99023_02',
            'Interactive viz with data labels',
            { tolerance: 6 }
        );
        // reopen menu to check if data labels are enabled
        await since('6 Data labels should be enabled, instead we have #{actual}')
            .expect(await teamsInteractiveChart.checkMenuOptionEnabled('Data Labels', 'Enable'))
            .toBe(true);
        await teamsInteractiveChart.closeInteractiveChartWindow();

        // ask question with grid
        await conversation.askQuestionsByWaiting({ question: question3 });
        // grid size
        await since('6 grid size should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer())
            .toBe(true);
        await conversation.clickViewMoreButtonOfLatestMessage();
        // grid displayed in interactive window
        await teamsInteractiveChart.waitForLoadingOfViz();
        await teamsInteractiveChart.closeInteractiveChartWindow();
    });

    it('[TC99023_03] Verify QA in group chat', async () => {
        await mainTeams.switchToAppInSidebar('Activity');
        await mainTeams.waitForElementInvisible(mainTeams.getBadgeOnActivity());
        // ask question in group chat
        await mainTeams.switchToChat(groupChat);
        await conversation.askQuestionsWithMention({ question: question2, mention: teamsApp });
        await mainTeams.sleep(5000);
        await mainTeams.waitForElementVisible(mainTeams.getBadgeOnActivity());
        await mainTeams.switchToAppInSidebar('Activity');
        await since('1 Message preview should contain #{expected}, instead we have #{actual}')
            .expect(await mainTeams.getMessagePreviewInActivity())
            .toContain('Euro');
        await mainTeams.switchToChat(groupChat);
        await since('2 Is viz size correct should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer())
            .toBe(true);
        await since('3 Tag user should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTagInLatestResponse())
            .toBe(consts.botInTeamsUser.name);
        await since('4 Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessageV2())
            .toBe(bot2);
        await conversation.clickViewMoreButtonOfLatestMessage();
        await teamsInteractiveChart.waitForLoadingOfViz();
        await teamsInteractiveChart.modifyChartOption('Data Labels', 'Enable');
        await since('5 Data labels should be enabled, instead we have #{actual}')
            .expect(await teamsInteractiveChart.checkMenuOptionEnabled('Data Labels', 'Enable'))
            .toBe(true);
        await teamsInteractiveChart.closeInteractiveChartWindow();
    });

    it('[TC99023_04] Verify QA in channel', async () => {
        // clear badge on Activity
        await mainTeams.switchToAppInSidebar('Activity');
        await mainTeams.waitForElementInvisible(mainTeams.getBadgeOnActivity());
        // say hi in channel
        await mainTeams.switchToTeamsChannel({ team, channel });
        await conversation.askQuestionsWithMention({ question: 'Hello', mention: teamsApp, isChannel: true });
        await mainTeams.sleep(5000);
        await mainTeams.waitForElementVisible(mainTeams.getBadgeOnActivity());
        await mainTeams.switchToAppInSidebar('Activity');
        await since('1 Preview message should be #{expected}, instead we have #{actual}')
            .expect(await mainTeams.getMessagePreviewInActivity())
            .toBe(consts.simpleGreetingMessage);
        
        // ask question in channel
        await mainTeams.switchToTeamsChannel({ team, channel });
        await conversation.askQuestionsWithMention({ question: question2, mention: teamsApp, isChannel: true });
        await mainTeams.sleep(5000);
        await mainTeams.waitForElementVisible(mainTeams.getBadgeOnActivity());
        await mainTeams.switchToAppInSidebar('Activity');
        await since('2 Preview message should be #{expected}, instead we have #{actual}')
            .expect(await mainTeams.getMessagePreviewInActivity())
            .toContain('Euro');
        await mainTeams.switchToTeamsChannel({ team, channel });
        await since('3 Is viz size correct should be #{expected}, instead we have #{actual}')
            .expect(await conversation.isVizSizeCorrectInLatestAnswer(true))
            .toBe(true);
        await since('4 Tag user should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTagInLatestResponse(true))
            .toBe(consts.botInTeamsUser.name);
        await since('5 Bot name should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getBotNameOnLatestMessageV2(true))
            .toBe(bot2);
    });


    it('[TC99023_05] Verify no bots error', async () => {
        // switch to user with no bots
        if (!(await teamsDesktop.checkCurrentTeamsUser('JoniS@nvy2.onmicrosoft.com'))) {
            await teamsDesktop.switchToTeamsUser('Joni Sherman', 'https://teams.microsoft.com/v2/?ring=ring3_6', 'Chat');
        }
        // greeting hi in 1-1 chat
        await mainTeams.switchToChat(teamsApp);
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await mainTeams.sleep(1000);
        await since('1 Greeting in chat when no agents should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noAgentsError);
        await conversation.askQuestionsByWaiting({ question: question1 });
        await mainTeams.sleep(1000);
        await since('2 Answer in chat when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noAgentsError);
        // greeting hello in group chat
        await mainTeams.switchToChat(groupChat);
        await conversation.askQuestionsByWaiting({ question: 'hello', mention: teamsApp });
        await mainTeams.sleep(1000);
        await since('3 Greeting in group when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.simpleGreetingMessage);
        await conversation.askQuestionsByWaiting({ question: question1, mention: teamsApp });
        await mainTeams.sleep(1000);
        await since('4 Answer in group when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.noAgentsError);
        // greeting what can you do in channel
        await mainTeams.switchToTeamsChannel({ team, channel });
        await conversation.askQuestionsByWaiting({
            question: 'what can you do?',
            isChannel: true,
            mention: teamsApp,
        });
        await mainTeams.sleep(1000);
        await since('5 Greeting in channel when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.simpleGreetingMessage);
        await conversation.askQuestionsByWaiting({ question: question1, isChannel: true, mention: teamsApp });
        await mainTeams.sleep(1000);
        await since('6 Answer in channel when no bots should be #{expected}, instead we have #{actual}')
            .expect(await conversation.getTextInLatestResponse())
            .toBe(consts.noAgentsError);
    });


});
