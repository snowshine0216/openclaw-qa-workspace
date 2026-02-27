import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('Multiple Datasets', () => {
    const FlatViewBot = {
        id: '6B7F19A1A948E4B7C1025FB09A74C205',
        name: 'FlatViewBot',
        dataset1: 'Sales Data',
        dataset2: 'base report',
        dataset3: 'OLAP',
        dataset4: 'airline-sample-data.xls',
        sampleFile: 'Airline Sample Data',
        dataPanelTtile: 'Manage access to data to answer questions',
        newName: '12.xd d中文·~@3',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const ComplexViewBot = {
        id: 'F191B4C19D481BAB8DDF489253A45833',
        name: 'ComplexViewBot_update',
        dataset1: 'folderStructure',
        dataset2: 'base report',
        dataset3: 'NAA report',
        dataPanelTtile: 'Manage access to data to answer questions',
        noMatchMessage: 'No Matched Content',
        sampleFile: 'Airline Sample Data',
        newDataset: 'airline-sample-data.xls',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel } = browsers.pageObj1;
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

    it('[TC96382] Verify manipulation on dataset panel with multiple datasets - replace datasets cancel', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickOneDatasetManipuButton(ComplexViewBot.dataset2, 'Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await since('The dataset panel replace page show should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDisplayReplacePage())
            .toBe(true);
        await aibotDatasetPanel.clickReplacePageButton('Cancel');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(1))
            .toBe(ComplexViewBot.dataset2);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace with New Data');
        await aibotDatasetPanel.waitForNewDIPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(1))
            .toBe(ComplexViewBot.dataset2);
    });

    it('[TC96299] Verify manipulation on dataset panel with multiple datasets - replace to new', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickOneDatasetManipuButton(ComplexViewBot.dataset2, 'Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace with New Data');
        await aibotDatasetPanel.chooseDataType('Sample Files');
        await aibotDatasetPanel.waitForFileSamplePageLoading();
        await aibotDatasetPanel.chooseFileInNewDI(ComplexViewBot.sampleFile);
        await aibotDatasetPanel.clickMojoPageButton('Import');
        await aibotDatasetPanel.waitForNewDIPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Create');
        await aibotDatasetPanel.waitForNewDIClose();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(ComplexViewBot.newDataset);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('a');
        await takeScreenshotByElement(
            aibotChatPanel.getAutoCompleteArea(),
            'TC96299-01',
            'Check dataset is updated to the new one'
        );
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(2))
            .toBe(ComplexViewBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96299-02',
            'Check dataset is updated to the new one - standalone MTDI to managed MTDI'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(ComplexViewBot.newDataset);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC96299-03',
            'Check dataset panel menu with managed dataset'
        );
    });

    it('[TC96383] Verify manipulation on dataset panel with multiple datasets - replace with listed dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96383-01',
            'Check dataset, 4 datasets'
        );
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset2, 'Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(FlatViewBot.dataset1);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(FlatViewBot.dataset1);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96383-02',
            'Check dataset is updated, dataset number changes to 3'
        );
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(1))
            .toBe(FlatViewBot.dataset3);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(0))
            .toBe(FlatViewBot.dataset1);
    });

    it('[TC96286] Verify manipulation on dataset panel with multiple datasets - delete dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96286-01',
            'Check dataset, 4 datasets'
        );
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset2, 'Delete');
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96286-02',
            'Check dataset is deleted, dataset number changes to 3'
        );
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset3, 'Delete');
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96286-03',
            'Check dataset is deleted, dataset number changes to 2'
        );
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset4, 'Delete');
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96286-04',
            'Check dataset is deleted, dataset number changes to 1'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC96286-05',
            'Check dataset panel menu - no delete when there is only 1 dataset'
        );
    });

    it('[TC96384] Verify manipulation on dataset panel with multiple datasets - rename', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(3))
            .toBe(FlatViewBot.dataset4);
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset4, 'Rename');
        await aibotDatasetPanel.setName(FlatViewBot.newName);
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(3))
            .toBe(FlatViewBot.newName);
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.newName, 'Rename');
        await aibotDatasetPanel.setName(FlatViewBot.dataset3);
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(3))
            .toBe(FlatViewBot.dataset3);
    });

    it('[TC96385] Verify manipulation on dataset panel with multiple datasets - refresh', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(0))
            .toBe(FlatViewBot.dataset1);
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset1, 'Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await takeScreenshotByElement(
            aibotDatasetPanel.getRefreshContainer(),
            'TC96385-01',
            'Refresh Dataset container is displayed'
        );
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(0))
            .toBe(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96385-02',
            'Dataset is not changed after cancel refresh dataset'
        );
    });

    it('[TC96405] Verify multiple datasets UI component - edit dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickOneDatasetManipuButton(FlatViewBot.dataset4, 'Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        await aibotDatasetPanel.clickButtonInEditPage();
        await aibotDatasetPanel.chooseDataType('Sample Files');
        await aibotDatasetPanel.waitForFileSamplePageLoading();
        await aibotDatasetPanel.chooseFileInNewDI(FlatViewBot.sampleFile);
        await aibotDatasetPanel.clickMojoPageButton('Import');
        await aibotDatasetPanel.waitForNewDIPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Update');
        await aibotDatasetPanel.waitForEditPageClose();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('所在城市');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96405',
            'Check dataset is not changed after canceling edit.'
        );
    });
});
