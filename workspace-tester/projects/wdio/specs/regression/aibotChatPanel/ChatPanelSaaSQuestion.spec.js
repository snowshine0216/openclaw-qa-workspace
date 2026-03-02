//npm run regression -- --baseUrl=https://mci-1fnch-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --xml specs/regression/config/AIBotSaaSQuestion.config.xml
//npm run regression -- --baseUrl=https://mci-1fnch-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --tcList=TC93107_3
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { saasQuestionUser } from '../../../constants/bot.js';
import { mockQuota } from '../../../api/mock/mock-response-utils.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('AIbotChatPanel Show Question quota on SaaS', () => {
    const saasProjectId = '69D4DA35264BAA98CC2BF68356064C35';
    const aibots = {
        saasQuestionBot: {
            id: 'FE55C481D74C6DCFF517B1A1B6996A1C',
            name: 'SaaS_Question_Bot',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel, botAuthoring, botConsumptionFrame, libraryAuthoringPage } =
        browsers.pageObj1;
    let question = 'Which airline has the highest average delay?';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(saasQuestionUser);
        await loginPage.waitForLibraryLoading();
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await loginPage.disableTutorial();
        await mockQuota({ user: saasQuestionUser, remaining: 2 });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93107_1] Show quota on consumption mode && switch mode', async () => {
        await libraryPage.openDossier(aibots.saasQuestionBot.name);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC93107_1',
            '01_Show_question_quota_on_consumption_mode'
        );

        //Ask question, count - 1
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'After ask question in consumption mode, the hint text should be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.getHintText())
            .toBe('Ask me a question. (Questions remaining: 1)');

        //Switch to edit mode and check the hint text
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        await since('After switching to edit mode, the hint text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe('Ask me a question. (Questions remaining: 1)');

        //Clear history not affect count
        await aibotChatPanel.clearHistory();
        await since('In edit mode, the initial hint text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe('Ask me a question. (Questions remaining: 1)');

        //Ask question in edit mode, count - 1
        await aibotChatPanel.askQuestion(question);
        await aibotChatPanel.waitForAnswerLoading();
        await checkElementByImageComparison(
            aibotChatPanel.getInputBoxContainer(),
            'dashboardctc/ChatPanel/TC93107_1',
            '02_No_quota_on_edit_mode'
        );

        //Back to consumption mode, count kept
        await botAuthoring.exitBotAuthoring();
        await since('In edit mode, the hint text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe('You have asked the maximum of questions.');
        await since('In edit mode, the disabled input should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isDisabledInputContainerDisplayed())
            .toBe(true);
    });

    it('[TC93107_2] Show quota on edit mode', async () => {
        await libraryPage.editBotByUrl({ projectId: saasProjectId, botId: aibots.saasQuestionBot.id });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('In edit mode, the initial hint text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe('Ask me a question. (Questions remaining: 2)');
        await botAuthoring.exitBotAuthoring();
    });

    it('[TC93107_3] Show quota on add mode', async () => {
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.waitForElementClickable(libraryAuthoringPage.getNewBotButton());
        await libraryAuthoringPage.click({ elem: libraryAuthoringPage.getNewBotButton() });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getInputBoxContainer());
        await since('In creation mode, the hint text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe('Ask me a question (Questions remaining: 2)');
        await libraryAuthoringPage.closeDataImportDialog();
    });

    it('[TC93107_4] Error Handling -- when request failed, disable input', async () => {
        const mock = await browser.mock('**/quota');
        mock.abort('Failed');
        await libraryPage.openDossier(aibots.saasQuestionBot.name);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getInputBoxContainer());
        await since('When request failed, the hint text should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe('You have asked the maximum of questions.');
        await since('When request failed, the disabled input should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isDisabledInputContainerDisplayed())
            .toBe(true);
    });
});
