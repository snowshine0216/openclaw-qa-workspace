import setWindowSize from '../../../config/setWindowSize.js';
import urlParser from '../../../api/urlParser.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import {
    botConfigUsageUser,
    botConfigLearningUser,
    getBotObjectToEdit,
    languageIdMap,
} from '../../../constants/bot.js';
import { mockBotStatistics, mockDownloadBotStatisticsError } from '../../../api/mock/mock-response-utils.js';
import { mockApplicationFeedback, mockApplicationLearning } from '../../../api/mock/mock-application.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';

describe('AI Bot UsagePanel', () => {
    let { loginPage, libraryPage, botAuthoring, aibotChatPanel, aibotUsagePanel } = browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC94788 Bot Usage Test';
    const BotToCreate = getBotObjectToEdit({
        botName: botName,
        version: 'v2',
        datasets: [{ id: 'F75D33638248CE1CAE0AE5B825A28139', name: 'Airline Data' }],
        enableInterpretation: true,
    });
    const adminUser = {
        username: 'mstr1',
        password: 'newman1#',
        id: '86A002474C1A18F1F92F2B8150A43741',
    };

    const feedbackQuestion = 'list airlines that have high delay';
    const kaQuestion = 'show me delay ratio for A group';
    const feedback = 'high delay means avg delay time > 30 mins';
    const kaFile = 'AirlineKA.xlsx';

    let statistics = {
        questionCount: 1,
        userCount: 2,
        effectivenessRatio: 1.0,
        interpretationRequestsRatio: 1.0,
        definitionsUsedCount: 1,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botConfigUsageUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: botConfigUsageUser, botInfo: BotToCreate });
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
        await resetUserLanguage({ credentials: botConfigUsageUser });
        await logoutFromCurrentBrowser();
    });

    async function createLearning() {
        // clear learning
        await aibotChatPanel.askQuestion(feedbackQuestion);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverChatBubbleToClickThumbDownByIndex({});
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedback);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await aibotChatPanel.openInterpretation();
    }

    it('[TC94788_01] learning is off in application', async () => {
        await mockApplicationLearning({});
        await browser.refresh();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_01_learningOff');
    });

    it('[TC94788_02] feedback is off in application', async () => {
        await mockApplicationFeedback({});
        await browser.refresh();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_02_learningOff');
    });

    // mock get nugget response
    it('[TC94788_03] check Definitions tab ', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_03_01noKnowledgeAssets');
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(kaFile);
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_03_02hasKnowledgeAssets');
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await botAuthoring.saveBot({});
    });

    it('[TC94788_04] usage panel e2e test', async () => {
        // check points 1. different user asks questions
        // 2. user gives feedback
        // 3. user click on interpretations
        // 4. user upload ka and ask questions
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(kaFile);
        await botAuthoring.saveBot({});
        await libraryPage.openDefaultApp();

        // switch to botConfigTopicUser
        await libraryPage.switchUser(botConfigLearningUser);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await createLearning();
        await aibotChatPanel.askQuestion(feedbackQuestion);
        // await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.askQuestion(kaQuestion);

        // total questions should be 2, definition used should be 1, interpretation request should be 50%, response effectiveness should be 50%, users should be 1
        await libraryPage.openDefaultApp();
        await libraryPage.switchUser(botConfigUsageUser);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_04_usagePanelE2E');
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await botAuthoring.saveBot({});
    });

    it('[TC94788_05] check usage panel time period ', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await mockBotStatistics({ botId: botId, statistics: statistics });
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_05_01last30days');
        statistics.definitionsUsedCount += 1;
        statistics.effectivenessRatio = 0.5;
        statistics.interpretationRequestsRatio = 0.5;
        statistics.questionCount += 1;
        statistics.userCount += 1;

        await mockBotStatistics({ botId: botId, statistics: statistics, period: 'last60days' });
        await aibotUsagePanel.clickUsageDateRangeDropdown();
        await aibotUsagePanel.clickUsageDateRange('last 60 days');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_05_02last60days');

        statistics.definitionsUsedCount += 1;
        statistics.effectivenessRatio = 0.25;
        statistics.interpretationRequestsRatio = 0.25;
        statistics.questionCount += 1;
        statistics.userCount += 1;
        await mockBotStatistics({ botId: botId, statistics: statistics, period: 'last90days' });
        await aibotUsagePanel.clickUsageDateRangeDropdown();
        await aibotUsagePanel.clickUsageDateRange('last 90 days');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_05_03last90days');

        statistics.definitionsUsedCount += 1;
        statistics.effectivenessRatio = 0.2;
        statistics.interpretationRequestsRatio = 0.2;
        statistics.questionCount += 1;
        statistics.userCount += 1;
        await mockBotStatistics({ botId: botId, statistics: statistics, period: 'all' });
        await aibotUsagePanel.clickUsageDateRangeDropdown();
        await aibotUsagePanel.clickUsageDateRange('all');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_05_04all');
    });

    it('[TC94788_06] check Download error', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        // click download button
        await mockDownloadBotStatisticsError(botId);
        await aibotUsagePanel.clickUsageDownloadButton();
        await takeScreenshotByElement(await aibotUsagePanel.getUsageDownloadFailedMessage(), 'TC94788_07_DowloadError');
        await aibotUsagePanel.clickUsageDownloadFailedOkButton();
    });

    it('[TC94788_07] no write acl for bot usage panel', async () => {
        //remove acl for test user
        await setObjectAcl({
            credentials: adminUser,
            object: { id: botId, name: botName, project: BotToCreate.project },
            acl: [
                {
                    value: 'Custom',
                    id: botConfigUsageUser.id,
                    name: botConfigUsageUser.username,
                    rights: 133,
                    denyRights: 122,
                },
            ],
        });
        await libraryPage.switchUser(botConfigUsageUser);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        // when no write acl, it should shows no data
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_08_noWriteACLUsagePanel');
        // click download button, it should show error message
        await aibotUsagePanel.clickUsageDownloadButton();
        await takeScreenshotByElement(
            await aibotUsagePanel.getUsageDownloadFailedMessage(),
            'TC94788_08_noWriteACLDowloadError'
        );
        await aibotUsagePanel.clickUsageDownloadFailedOkButton();
    });

    it('[TC94788_08] bot usage panel i18n', async () => {
        await setUserLanguage({
            baseUrl: urlParser(browser.options.baseUrl),
            userId: botConfigUsageUser.id,
            adminCredentials: adminUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await libraryPage.switchUser(botConfigUsageUser);
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await botAuthoring.selectBotConfigTabByName('Usage');
        await takeScreenshotByElement(await aibotUsagePanel.getUsageContent(), 'TC94788_09_BotUsageI18n');
        await mockDownloadBotStatisticsError(botId);
        await aibotUsagePanel.clickUsageDownloadButton();
        await takeScreenshotByElement(
            await aibotUsagePanel.getUsageDownloadFailedMessage(),
            'TC94788_09_DowloadErrorI8n'
        );
        await aibotUsagePanel.clickUsageDownloadFailedOkButton();
    });
});
