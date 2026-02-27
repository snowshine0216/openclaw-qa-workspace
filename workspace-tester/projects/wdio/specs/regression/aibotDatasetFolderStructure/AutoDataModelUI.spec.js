import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - AutoModelUI', () => {
    const FolderStructureBot = {
        id: '2CCB3106194F3C77CF720EBE4760B5EF',
        name: 'folderBot',
        datasetName: 'test-nw1',
        newDataset: 'folderStructure',
        existDataset: 'File',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const FlatViewBot = {
        id: '28F24A939A48A0BD9171F1B40C2F7D3A',
        name: 'FlatViewNewDataModel',
        datasetName: 'FlatViewNewDataModel',
        newDataset: 'flatView',
        existDataset: 'File',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(dataBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95289] verify flat view menu in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(FlatViewBot.datasetName);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95289',
            'Check dataset panel menu - only replace dataset button - flat view'
        );
    });

    it('[TC95290] verify flat view UI in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95290',
            'Check dataset panel flat view UI dataset container - fact metric'
        );
    });

    it('[TC94872] verify folder structure view menu in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(FolderStructureBot.datasetName);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC94872',
            'Check dataset panel menu - only replace dataset button - folder structure'
        );
    });

    it('[TC95288] verify folder structure view UI in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95288-01',
            'Check dataset panel menu - dataset container - default folder structure view'
        );
        await aibotDatasetPanel.clickFolderArrow('deep_folder');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95288-02',
            'Check dataset panel folder structure view, collapse folders'
        );
        await botAuthoring.saveBot({});
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.clickCloseButton();
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95288-03',
            'Check dataset panel menu dataset container - back to default folder structure view'
        );
    });
});
