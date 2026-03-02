import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings - AutoModelReplace', () => {
    const StandaloneBot = {
        id: '102F91FAD14545989E56CCBB57B4ABAB',
        name: '28-2-Standalone-OLAP-datatime&derived metrics',
        datasetName: 'OLAP',
        dataPanelTtile: 'Manage access to data to answer questions',
        noMatchMessage: 'No Matched Content',
        newDataset: 'Sales Data',
        existDataset: 'File',
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

    const MTDIBot = {
        id: '56EC2F3623464FBD38849187488289EC',
        name: '24-2-Standalone-pgsql-long-time',
        datasetName: 'PostgreSQL-Tutorial WH',
        sampleFile: 'Airline Sample Data',
        newDataset: 'airline-sample-data.xls',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const ManagedBot = {
        id: '5618377A8345C4B892486494460995F3',
        name: '07-managed-clipboard',
        datasetName: 'automation dataset',
        newDataset: 'Sales Data',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel } =
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

    it('[TC94875] verify replace dataset in dataset panel with new data model - OLAP -> FolderStructure', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await since('The dataset panel replace page show should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDisplayReplacePage())
            .toBe(true);
        await aibotDatasetPanel.searchInReplaceDialog(FolderStructureBot.datasetName);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(FolderStructureBot.datasetName);
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await browser.pause(3000);
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(FolderStructureBot.datasetName);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC94875',
            'Check dataset is updated to Folder structure one'
        );
    });

    it('[TC95334] verify replace dataset in dataset panel with new data model - MTDI -> flat view', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(ManagedBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(FlatViewBot.datasetName);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(FlatViewBot.datasetName);
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await browser.pause(3000);
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(FlatViewBot.datasetName);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95334',
            'Check dataset is updated to flat view'
        );
    });

    it('[TC95336] verify replace dataset in dataset panel with new data model - folder structure to MTDI', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(FolderStructureBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace with New Data');
        await aibotDatasetPanel.chooseDataType('Sample Files');
        await aibotDatasetPanel.waitForFileSamplePageLoading();
        await aibotDatasetPanel.chooseFileInNewDI(MTDIBot.sampleFile);
        await aibotDatasetPanel.clickMojoPageButton('Import');
        await aibotDatasetPanel.waitForNewDIPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Create');
        await aibotDatasetPanel.waitForNewDIClose();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('ket Desc Po');
        await takeScreenshotByElement(
            aibotChatPanel.getAutoCompleteArea(),
            'TC95336-01',
            'Check dataset is updated to the MTDI sample data'
        );
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(MTDIBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95336-02',
            'Check dataset is updated to the new one - Folder Structure to managed MTDI'
        );
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95336-03',
            'Check dataset panel menu with managed dataset'
        );
    });

    it('[TC95337] verify replace dataset in dataset panel with new data model - folder structure to folder structure', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(FolderStructureBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(FolderStructureBot.newDataset);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(FolderStructureBot.newDataset);
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(FolderStructureBot.newDataset);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(FolderStructureBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC95337',
            'Check dataset is updated to the new one - folder structure dataset updated'
        );
    });
});
