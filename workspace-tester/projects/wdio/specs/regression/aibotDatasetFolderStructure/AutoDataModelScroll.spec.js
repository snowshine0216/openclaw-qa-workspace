import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - AutoModelScroll', () => {
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

    it('[TC94874] verify folder structure scrollbar in dataset panel with new data model', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC94874-00',
            'Check folder structure scrollbar - folder expanded automatically'
        );
        await aibotDatasetPanel.clickFolderArrow('deep_folder');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC94874-01',
            'Check folder structure scrollbar - deep folder'
        );
        await aibotDatasetPanel.clickFolderArrow('deep_folder');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC94874-02',
            'Check folder structure scrollbar - deep folder expands'
        );
    });
});
