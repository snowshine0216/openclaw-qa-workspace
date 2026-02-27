import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataI18BotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const TestBot = {
        id: 'E826BC3E644F7016932988B299B5C613',
        name: '08-managed-file-chinese',
        datasetName: '中国南方航空公司航班计划(2018-01-05更新).xls 中国部分机场与所在城市.xlsx (2 tables)',
        dataPanelTtile: '管理数据的可访问性以回答问题',
        noMatchMessage: '无匹配内容',
        tooltipText: '无内容。使用机器人，需向数据集添加内容。',
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

    it('[TC91620] Verify i18n of AI data set panel strings and format', async () => {
        await libraryPage.editBotByUrl({ projectId: TestBot.project.id, botId: TestBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset panel message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelTitle().getText())
            .toBe(TestBot.dataPanelTtile);
        await takeScreenshotByElement(
            aibotDatasetPanel.getSearchContainer(),
            'TC91620-01',
            'Check dataset panel search box UI with Chinese'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC91620-02',
            'Check dataset panel basic UI components in Chinese language'
        );
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC91620-03',
            'Check dataset panel menu with Managed dataset in Chinese'
        );
        await aibotDatasetPanel.openMenu();
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await aibotDatasetPanel.hoverPanelErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.panelTooltipText())
            .toBe(TestBot.tooltipText);
        await aibotDatasetPanel.inputSearchText('123/`');
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage().getText())
            .toBe(TestBot.noMatchMessage);
    });
});
