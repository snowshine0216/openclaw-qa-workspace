import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - AutoModelSelect', () => {
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
        tooltipText: 'No content. Add content to the dataset to use the bot.',
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

    it('[TC94873] verify select/unselect folder in dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.checkOrUncheckData('12');
        await aibotDatasetPanel.checkOrUncheckData('中文名');
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Store');
        await takeScreenshotByElement(
            aibotChatPanel.getAutoCompleteArea(),
            'TC94873-01',
            'check unselect folder result'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(' City');
        await takeScreenshotByElement(
            aibotChatPanel.getAutoCompleteArea(),
            'TC94873-02',
            'check unselect folder result'
        );
        await aibotDatasetPanel.clickFolderArrow('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Store Service Center');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC94873-03', 'check expand folder result');
    });

    it('[TC95304] verify select all folder in dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.checkOrUncheckData('Store Address');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95304-01',
            'Check dataset panel unselect data'
        );
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FolderStructureBot.datasetName);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95304-02',
            'Check dataset panel select All'
        );
    });

    it('[TC95305] verify unselect all folder in dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FolderStructureBot.datasetName);
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FolderStructureBot.datasetName);
        await since('The dataset panel show error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await since('The dataset panel tab show error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95305',
            'Check dataset panel unselect ALL folder'
        );
    });

    it('[TC95338] verify unselect data in dataset panel - flat view', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.datasetName);
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.datasetName);
        await since('The dataset panel show error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await since('The dataset panel tab show error message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.hoverPanelErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.panelTooltipText())
            .toBe(FlatViewBot.tooltipText);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95338',
            'Check dataset panel unselect All'
        );
    });

    it('[TC95342] verify select all in dataset panel - flat view', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.datasetName);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95342-01',
            'Check dataset panel select All'
        );
    });
});
