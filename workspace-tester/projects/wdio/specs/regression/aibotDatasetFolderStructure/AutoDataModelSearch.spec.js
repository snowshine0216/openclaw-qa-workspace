import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - AutoModelSearch', () => {
    const FolderStructureBot = {
        id: '2CCB3106194F3C77CF720EBE4760B5EF',
        name: 'folderBot',
        datasetName: 'test-nw1',
        newDataset: 'folderStructure',
        existDataset: 'File',
        noMatchMessage: 'No Matched Content',
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

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel, adminPage } =
        browsers.pageObj1;
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

    it('[TC95299] verify search dataset name in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.inputSearchText(FolderStructureBot.datasetName);
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage().getText())
            .toBe(FolderStructureBot.noMatchMessage);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95299',
            'search folder in dataset panel - folder structure'
        );
    });

    it('[TC95343] verify search subfolder in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.inputSearchText('12');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95343-01',
            'search subfolder in dataset panel - folder structure'
        );
        await aibotDatasetPanel.clickFolderArrow('deep_folder');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95343-02',
            'search subfolder in dataset panel - folder structure'
        );
    });

    it('[TC95344] verify search data under folder', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.inputSearchText('Customer ID');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95344-01',
            'search data in dataset panel - folder structure'
        );
        await aibotDatasetPanel.clickFolderArrow('deep_folder');
        await aibotDatasetPanel.clickFolderArrow('deep_folder');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95344-02',
            'search data in dataset panel - folder structure after expand folder'
        );
    });

    it('[TC95345] verify search data with flat view', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.inputSearchText('Store');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95345-01',
            'search data in dataset panel - flat view'
        );
        await libraryPage.clickLibraryIcon();
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95345-02',
            'search result will not persist in dataset panel - flat view'
        );
    });
});
