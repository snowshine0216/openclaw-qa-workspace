import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { mockTrialUser } from '../../../api/mock/mock-response-utils.js';
import { browserWindow } from '../../../constants/index.js';
import { configBotUser, getBotObjectInfo, getPublishInfo } from '../../../constants/bot.js';

describe('AI Bot Feature settings control on SAAS', () => {
    let { loginPage, libraryPage, botAuthoring } = browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC93073 Bot Features Setting on SAAS';
    const BotToCreate = getBotObjectInfo({ botName });
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await mockTrialUser({ user: configBotUser });
        await libraryPage.openDefaultApp();
        await loginPage.login(configBotUser);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: configBotUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        const publishInfo = getPublishInfo({ botId, projectId: BotToCreate.project.id });
        await publishBotByAPI({
            credentials: configBotUser,
            publishInfo: publishInfo,
        });
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: configBotUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    //TC93073: In Bot, hide the bot level question number limit of for SaaS
    it('[TC93073_01] hide question limit for trial user in SaaS', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Question limit settings should not display for trial users in SaaS, but it is displayed now!')
            .expect(await botAuthoring.generalSettings.getLimitsSection().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC93073_01',
            'hide question limit settings for trial user in Saas'
        );
    });

    it('[TC93073_02] edit bot settings by trial user in SaaS', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.turnOffEnableSuggestion();
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Enable suggestion should be #{expected} after turn it off, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isEnableSuggestionSwitchOn())
            .toBe(false);
    });
});
