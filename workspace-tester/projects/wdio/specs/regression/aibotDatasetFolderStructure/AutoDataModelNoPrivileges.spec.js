import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { noAnyPrivilegeBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - AutoModelNoPrivilege', () => {
    const FlatViewBot = {
        id: '28F24A939A48A0BD9171F1B40C2F7D3A',
        name: 'FlatViewNewDataModel',
        datasetName: 'FlatViewNewDataModel',
        newDataset: 'flatView',
        existDataset: 'File',
        tooltipText: 'You do not have use or execute access to this dataset.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

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
        await loginPage.login(noAnyPrivilegeBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC96426] verify search data with flat view - no privileges', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC96426',
            'Check dataset panel without menu icon'
        );
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.hoverErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipText())
            .toBe(FlatViewBot.tooltipText);
    });

    it('[TC96427] verify search data with folder structure - no privileges', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC96427',
            'Check dataset panel without menu icon'
        );
    });
});
