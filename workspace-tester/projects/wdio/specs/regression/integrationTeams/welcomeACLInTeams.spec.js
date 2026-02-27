import * as consts from '../../../constants/teams.js';
import { mstrUser } from '../../../constants/bot.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import { AclType, getCustomAclData } from '../../../constants/customAcl.js';

describe('Test welcome ACL permssion in Teams', () => {
    let { mainTeams, apps, teamsDesktop, conversation, teamsViewAllBotsPage } = browsers.pageObj1;
    const teamsApp = browsers.params.teamsAppName;

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await teamsDesktop.switchToActiveWindow();
        await apps.openTeamsApp(teamsApp);
        const isCurrentUser = await teamsDesktop.checkCurrentTeamsUser(consts.botInTeamsUser.credentials.username);
        if (!isCurrentUser) {
            await teamsDesktop.switchToTeamsUser(consts.botInTeamsUser.credentials.username);
        }
    });

    beforeEach(async () => {
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
        await mainTeams.switchToChat(teamsApp);
    });

    afterEach(async () => {
        await teamsViewAllBotsPage.closeViewAllBotsWindow();
    });

    afterAll(async () => {
        await mainTeams.switchToAppInSidebar(teamsApp);
    });

    it('[TC96672_01] no execute acl permission', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(conversation.getLatestReceivedChatMessage(), 'TC96672_01_01', 'welcome card', {
            tolerance: 5,
        });
        const textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since(`1. welcome page should include bot ${consts.mstrStockBot.name} , instead it does not`)
            .expect(textAnswer.includes(consts.mstrStockBot.name))
            .toBe(true);
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC96672_01_02',
            'view all bots in welcome card'
        );
        await teamsViewAllBotsPage.closeViewAllBotsWindow();
        await resetObjectAcl({
            credentials: mstrUser,
            object: {
                id: consts.mstrStockBot.id,
                name: consts.mstrStockBot.name,
                project: consts.mstrStockBot.project,
            },
            acl: getCustomAclData({
                aclType: AclType.READ_AND_NO_EXECUTE,
                userId: consts.botInTeamsUser.id,
                userName: consts.botInTeamsUser.credentials.username,
            }),
        });
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(
            conversation.getLatestReceivedChatMessage(),
            'TC96672_01_03',
            'no execute acl in welcome',
            {
                tolerance: 3,
            }
        );
        const textAnswer2 = await conversation.getLatestReceivedChatMessage().getText();
        await since(`2. welcome page should not include bot ${consts.mstrStockBot.name} , instead it does`)
            .expect(textAnswer2.includes(consts.mstrStockBot.name))
            .toBe(false);
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC96672_01_04',
            'no execute acl in view all bots'
        );
    });

    it('[TC96672_02] no read acl permission', async () => {
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC96672_02_01',
            'view all bots in welcome card'
        );
        await teamsViewAllBotsPage.closeViewAllBotsWindow();
        await resetObjectAcl({
            credentials: mstrUser,
            object: {
                id: consts.mstrStockBot.id,
                name: consts.mstrStockBot.name,
                project: consts.mstrStockBot.project,
            },
            acl: getCustomAclData({
                aclType: AclType.NO_READ,
                userId: consts.botInTeamsUser.id,
                userName: consts.botInTeamsUser.credentials.username,
            }),
        });
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(
            conversation.getLatestReceivedChatMessage(),
            'TC96672_02_03',
            'no execute acl in welcome',
            {
                tolerance: 3,
            }
        );
        const textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since(`1. welcome page should not include bot ${consts.mstrStockBot.name} , instead it does`)
            .expect(textAnswer.includes(consts.mstrStockBot.name))
            .toBe(false);
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC96672_02_04',
            'no execute acl in view all bots'
        );
    });

    it('[TC96672_03] only read and execute acl permission', async () => {
        await resetObjectAcl({
            credentials: mstrUser,
            object: {
                id: consts.mstrStockBot.id,
                name: consts.mstrStockBot.name,
                project: consts.mstrStockBot.project,
            },
            acl: getCustomAclData({
                aclType: AclType.ONY_READ_EXECUTE,
                userId: consts.botInTeamsUser.id,
                userName: consts.botInTeamsUser.credentials.username,
            }),
        });
        await conversation.switchToTabInChat('Chat');
        await conversation.askQuestionsByWaiting({ question: 'hi' });
        await takeScreenshotByElement(
            conversation.getLatestReceivedChatMessage(),
            'TC96672_03_01',
            'only read and execute in welcome',
            { tolerance: 2 }
        );
        const textAnswer = await conversation.getLatestReceivedChatMessage().getText();
        await since(`1. welcome page should not include bot ${consts.mstrStockBot.name} , instead it does not`)
            .expect(textAnswer.includes(consts.mstrStockBot.name))
            .toBe(false);
        await conversation.clickViewAllBotsButtonOfLatestMessage();
        await teamsViewAllBotsPage.waitForLoadingInViewAllBots();
        await takeScreenshotByElement(
            teamsViewAllBotsPage.getBotListContainer(),
            'TC96672_03_02',
            'only read and execute in view all bots'
        );
    });
});
