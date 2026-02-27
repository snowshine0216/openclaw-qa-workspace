import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
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

    it('[TC92355] Verify cancel in replace dataset window of aibot dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
        await aibotDatasetPanel.clickDatasetArrow();
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await since('The dataset panel replace page show should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDisplayReplacePage())
            .toBe(true);
        await aibotDatasetPanel.clickReplacePageButton('Cancel');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace with New Data');
        await aibotDatasetPanel.waitForNewDIPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
    });

    it('[TC92412] Verify replace dataset to a new one in dataset panel - standalone OLAP to standalone MTDI', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(StandaloneBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(StandaloneBot.newDataset);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(StandaloneBot.newDataset);
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(StandaloneBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92412',
            'Check dataset is updated to the new one'
        );
    });

    it('[TC92343] Verify replace dataset to a new one in dataset panel - standalone MTDI to managed MTDI', async () => {
        await libraryPage.editBotByUrl({ projectId: MTDIBot.project.id, botId: MTDIBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(MTDIBot.datasetName);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Brac');
        await takeScreenshotByElement(
            aibotChatPanel.getAutoCompleteArea(),
            'TC92343-01',
            'Check data changes and display in the chatpanel'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getDataPanelContainer(),
            'TC92343-02',
            'Check dataset panel UI and data icon.'
        );
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
            'TC92343-03',
            'Check dataset is updated to the new one'
        );
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(MTDIBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92343-04',
            'Check dataset is updated to the new one - standalone MTDI to managed MTDI'
        );
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92343-05',
            'Check dataset panel menu with managed dataset'
        );
    });

    it('[TC92372] Verify replace dataset to a new one in dataset panel - managed MTDI to standalone', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(ManagedBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(ManagedBot.newDataset);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(ManagedBot.newDataset);
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(ManagedBot.newDataset);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Supplier Latitude');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(ManagedBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92372-01',
            'Check dataset is updated to the new one - managed MTDI to standalone'
        );
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92372-02',
            'Check dataset panel menu with standalone dataset'
        );
    });
});
