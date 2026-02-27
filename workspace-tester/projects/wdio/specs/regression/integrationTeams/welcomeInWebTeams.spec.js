import * as consts from '../../../constants/teams.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Test Welcome page in teams web', () => {
    let { mainTeams, conversation, apps, teamsViewAllBotsPage } = browsers.pageObj1;

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await apps.openTeamsApp(consts.teamsApp);
    });

    beforeEach(async () => {
        await mainTeams.switchToChat(consts.teamsApp);
    });

    afterEach(async () => {
        await teamsViewAllBotsPage.closeViewAllBotsWindow();
    });

    it('[TC95620_07] Welcome card in teams web', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(
            conversation.getLatestChatMessage(),
            'TC95620_07_01',
            'welcome card in web teams'
        );
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC95620_07_02',
            'view all bots in welcome card on web teams'
        );
    });

    it('[TC95620_08] greeting tooltip on view all bots', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await teamsViewAllBotsPage.triggerTooltipOnBotItem(1);
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC95620_08_01',
            'hover to show greeting message on web teams'
        );
    });
});
