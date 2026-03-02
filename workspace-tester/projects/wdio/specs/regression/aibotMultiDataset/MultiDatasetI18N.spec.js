import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataI18BotUser, dataset } from '../../../constants/bot.js';

describe('Mulitiple Datasets - i18n', () => {
    const TestBot = {
        id: '47EE8BF1504AEFD8919449BD5AFAB1D8',
        name: '08-managed-file-chinese',
        dataset1: '中国南方航空公司航班计划(2018-01-05更新).xls 中国部分机场与所在城市.xlsx (2 tables)',
        dataset2: 'naa report',
        dataset3: '1-2 prompt - attribute qualitification - a predefined list',
        dataset4: 'DDA-PostgreSQL-Tutorial WH',
        dataPanelTtile: '管理数据的可访问性以回答问题',
        noMatchMessage: '无匹配内容',
        tooltipText1: '不支持该数据源使用机器人，需替换当前数据集。',
        tooltipText2: '机器人不支持带提示的报表。',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(dataI18BotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95801] certify i18n of new added message - UI change', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset panel message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelTitle().getText())
            .toBe(TestBot.dataPanelTtile);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95801',
            'Check dataset panel basic UI components in Chinese language'
        );
    });

    it('[TC95805] certify i18n of delete button', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickMenuButtonForDataset(TestBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95805',
            'Check dataset panel menu with Managed dataset in Chinese - delete'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(TestBot.dataset1);
    });

    it('[TC96399] certify i18n of new added error handling message - prompt report', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.closeDataset(TestBot.dataset1);
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isWarningForDatasetDisplayed(TestBot.dataset3))
            .toBe(true);
        await aibotDatasetPanel.hoverErrorIconForDataset(TestBot.dataset3);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(TestBot.dataset3))
            .toBe(TestBot.tooltipText2);
    });

    it('[TC96400] certify i18n of new added error handling message - DDA dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isWarningForDatasetDisplayed(TestBot.dataset4))
            .toBe(true);
        await aibotDatasetPanel.closeDataset(TestBot.dataset4);
        await aibotDatasetPanel.hoverErrorIconForDataset(TestBot.dataset4);
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipTextForDataset(TestBot.dataset4))
            .toBe(TestBot.tooltipText1);
    });

    it('[TC96401] certify i18n of new added error handling message - no matched result', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.inputSearchText('123/`');
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage(1).getText())
            .toBe(TestBot.noMatchMessage);
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage(2).getText())
            .toBe(TestBot.noMatchMessage);
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage(0).getText())
            .toBe(TestBot.noMatchMessage);
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage(3).getText())
            .toBe(TestBot.noMatchMessage);
    });
});
