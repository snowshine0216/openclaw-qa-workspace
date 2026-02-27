import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import { mockApplicationLearning } from '../../../api/mock/mock-application.js';
import {
    mockDownloadLearningError,
    mockLearningData,
    mockTelemetryStatus,
} from '../../../api/mock/mock-response-utils.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import urlParser from '../../../api/urlParser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import {
    botConfigLearningUser,
    getBotObjectToEdit,
    languageIdMap,
    messageDownloadLearning,
} from '../../../constants/bot.js';
import { browserWindow } from '../../../constants/index.js';
import { getStringOfDate, getToday } from '../../../utils/DateUtil.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AI Bot Download Learning', () => {
    let { loginPage, libraryPage, botAuthoring, aibotChatPanel } = browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC95811 Bot Download Learning Test';
    const BotToCreate = getBotObjectToEdit({
        botName: botName,
        version: 'v2',
        datasets: [{ id: 'F75D33638248CE1CAE0AE5B825A28139', name: 'Airline Data' }],
    });
    const adminUser = {
        username: 'mstr1',
        password: 'newman1#',
        id: '86A002474C1A18F1F92F2B8150A43741',
    };

    const inputQuestion = 'list airlines that have high delay';
    const feedback = 'high delay means avg delay time > 30 mins';
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botConfigLearningUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: botConfigLearningUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        // await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        if (botIdsToDelete.length > 0) {
            await deleteBotList({
                credentials: adminUser,
                botList: [...botIdsToDelete],
                projectId: BotToCreate.project.id,
            });
            botIdsToDelete.length = 0;
        }
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await resetUserLanguage({ credentials: botConfigLearningUser });
        await logoutFromCurrentBrowser();
    });

    async function createLearning() {
        // clear learning
        await aibotChatPanel.askQuestionNoWaitViz('/DeleteLearning -all');
        await aibotChatPanel.clearHistoryAndAskQuestion(inputQuestion);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverChatBubbleToClickThumbDownByIndex({});
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedback);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
    }

    it('[TC95811_01] no learning and learning setting is off in application', async () => {
        await mockApplicationLearning({});
        // await mockLearningData({ botId }); //workaround for no learning
        await browser.refresh();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getDownloadLearningSection(),
            'TC95811_01_learningOff-noLearning'
        );
        // hover on info icon and check info dialog
        await botAuthoring.custommizationPanel.hoverDownloadLearningInfoIcon();
        await since(
            'When hover on info icon, Info dialog should be shown should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(messageDownloadLearning.English.tooltip);
    });

    it('[TC95811_02] no learning and learning setting is on in application', async () => {
        // await mockLearningData({ botId }); //workaround for no learning
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getDownloadLearningSection(),
            'TC95811_02_learningOn-noLearning'
        );
    });

    it('[TC95811_03] has learning and learning setting is off in application', async () => {
        await mockApplicationLearning({});
        await mockLearningData({ botId, lastDownload: '2021-09-01T00:00:00.000Z', total: 1 });
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getDownloadLearningSection(),
            'TC95811_03_learningOff-hasData'
        );
    });

    it('[TC95811_04] has learning and learning setting is on in application', async () => {
        await mockLearningData({ botId, total: 1, lastDownload: '2021-09-01T00:00:00.000Z' });
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getDownloadLearningSection(),
            'TC95811_04_learningOn-hasData'
        );
    });
    /*
    check points: 1. (has learning) hover on info icon
    2. (has learning) click download button
    3. (has learning) check downloaded time 
    4. click on forget learning, check learning number is 0 
    */
    it('[TC95811_05] learning section check', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        await createLearning();

        // clear learning
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        // check learning number is 0
        await browser.refresh();
        await botAuthoring.waitPageRefresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('After forget learning, Total learnings captured should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.custommizationPanel.getTotalLearningCaptured())
            .toBe('0');

        await createLearning();
        await browser.refresh();
        await botAuthoring.waitPageRefresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // check learning number
        await since('After learning, Total learnings captured should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.custommizationPanel.getTotalLearningCaptured())
            .toBe('1');
        // click download button
        await botAuthoring.custommizationPanel.clickDownloadLearningButton();
        // check downloaded time
        await since(
            'After click download button, Downloaded time should be shown should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.getLastDownloadedTime())
            .toBe(getStringOfDate(getToday()));

        // clear learning
        await aibotChatPanel.askQuestionNoWaitViz('/DeleteLearning -all');
    });

    it('[TC95811_06] check telemetry status error', async () => {
        await mockTelemetryStatus(400);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // when get telemetry error, hide whole section
        await since(
            'When get telemetry error, Learning section should be hidden should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.isLearningSectionVisible())
            .toBe(false);
        await mockTelemetryStatus(200);
    });

    it('[TC95811_07] check Download error', async () => {
        await mockLearningData({ botId, total: 1 });
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // click download button
        await mockDownloadLearningError(botId);
        await botAuthoring.custommizationPanel.clickDownloadLearningButton();
        // check download error message
        await since(
            'When download error, Download error message should be shown should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(messageDownloadLearning.English.error);
        // after 3 seconds, error message should be hiddenm download button should be enabled
        await botAuthoring.custommizationPanel.sleep(3000);
        await since(
            'After 3 seconds, Download button should be enabled should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.isDownloadLearningButtonEnabled())
            .toBe(true);
    });

    it('[TC95811_08] no write acl download learning', async () => {
        //remove acl for test user
        await setObjectAcl({
            credentials: adminUser,
            object: { id: botId, name: botName, project: BotToCreate.project },
            acl: [
                {
                    value: 'Custom',
                    id: botConfigLearningUser.id,
                    name: botConfigLearningUser.username,
                    rights: 133,
                    denyRights: 122,
                },
            ],
        });
        await libraryPage.switchUser(botConfigLearningUser);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        // when no write acl, learning section should be hidden
        await since(
            'When no write acl, Learning section should be hidden should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.isLearningSectionVisible())
            .toBe(false);
    });

    it('[TC95811_09] learning info i18n', async () => {
        await mockLearningData({ botId, total: 1, lastDownload: '2021-09-01T00:00:00.000Z' });
        await setUserLanguage({
            baseUrl: urlParser(browser.options.baseUrl),
            userId: botConfigLearningUser.id,
            adminCredentials: adminUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await libraryPage.switchUser(botConfigLearningUser);
        await mockApplicationLearning({});
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getDownloadLearningSection(),
            'TC95811_09_LearningI18n'
        );
        await since(
            'When no learning and learning setting is off, Warning message should be shown should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.getAdaptiveLearningWarning())
            .toBe(messageDownloadLearning.ChineseSimplified.warning);
        await botAuthoring.custommizationPanel.hoverDownloadLearningInfoIcon();
        await since('[i18n] When hover on info icon, Info dialog should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(messageDownloadLearning.ChineseSimplified.tooltip);
        // click download button
        await botAuthoring.custommizationPanel.clickDownloadLearningButton();
        // check error message
        await since(
            '[i18n]When download error, Download error message should be shown should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(messageDownloadLearning.ChineseSimplified.error);
    });
});
