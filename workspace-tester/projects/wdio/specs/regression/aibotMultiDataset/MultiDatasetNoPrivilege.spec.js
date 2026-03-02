import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { noDataImportBotUser } from '../../../constants/bot.js';

describe('Mulitiple Datasets - noprivilege', () => {
    const FlatViewBot = {
        id: '6B7F19A1A948E4B7C1025FB09A74C205',
        name: 'FlatViewBot',
        dataset1: 'Sales Data',
        dataset2: 'base report',
        dataset3: 'OLAP',
        dataset4: 'airline-sample-data.xls',
        dataPanelTtile: 'Manage access to data to answer questions',
        newName: '12.xd d中文·~@3',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(noDataImportBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95800] Verify user privilege and dataset/data ACL handling with multiple datasets in bot', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC95800-01',
            'Check dataset panel - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95800-02',
            'Check dataset panel menu - with delete - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset1);
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset2);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95800-03',
            'Check dataset panel menu - report - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset2);
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset3);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95800-04',
            'Check dataset panel menu - OLAP with delete - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset3);
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset4);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95800-05',
            'Check dataset panel menu - managed with delete - flat view'
        );
    });
});
