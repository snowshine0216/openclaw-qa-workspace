import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const RefreshBot1 = {
        id: 'F1BEAC553C4530D9DD6FD0A9894DC5D7',
        name: '09-managed-sample data-post',
        datasetName: 'airline-sample-data.xls',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RefreshBot1_1 = {
        id: '8D97BBD25640A77E32A8A1B9E7F21C9B',
        name: 'unpublish bot',
        datasetName: 'retail-sample-data.xls',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RefreshBot2 = {
        id: 'E826BC3E644F7016932988B299B5C613',
        name: '08-managed-file-chinese',
        datasetName: '中国南方航空公司航班计划(2018-01-05更新).xls 中国部分机场与所在城市.xlsx (2 tables)',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const ManagedBot = {
        id: '5618377A8345C4B892486494460995F3',
        name: '07-managed-clipboard',
        datasetName: 'automation dataset',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel, aibotDatasetPanelContextMenu, dossierAuthoringPage } =
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

    it('[TC92348] Verify cancel refresh dataset in AI bot dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: RefreshBot1.project.id, botId: RefreshBot1.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await takeScreenshotByElement(
            aibotDatasetPanel.getRefreshContainer(),
            'TC92348-01',
            'Refresh Dataset container is displayed'
        );
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1.datasetName);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92348-02',
            'Dataset is not changed after cancel refresh dataset'
        );
    });

    it('[TC92411] Verify refresh dataset in AI bot dataset panel - basic scenario', async () => {
        await libraryPage.editBotByUrl({ projectId: RefreshBot1.project.id, botId: RefreshBot1.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Refresh');
        await aibotDatasetPanel.waitForRefreshLoading();
        await aibotDatasetPanel.clickMojoPageButton('Done');
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Airline Name');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1.datasetName);
    });

    it('[TC92411_01] Verify refresh dataset in AI bot dataset panel - unpublished sample data', async () => {
        await libraryPage.editBotByUrl({ projectId: RefreshBot1_1.project.id, botId: RefreshBot1_1.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1_1.datasetName);
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await since('Error icon of dataset displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Refresh');
        await aibotDatasetPanel.waitForRefreshLoading();
        await aibotDatasetPanel.clickMojoPageButton('Done');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(RefreshBot1_1.datasetName);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1_1.datasetName);
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(false);
        await since('Error icon of dataset displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92411_01-01',
            'Dataset is not changed after refresh dataset'
        );
    });

    it('[TC97752] Verify refresh dataset unpublished sample data - unpaused mode check', async () => {
        await libraryPage.editBotByUrl({ projectId: RefreshBot1_1.project.id, botId: RefreshBot1_1.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot1_1.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Refresh');
        await aibotDatasetPanel.waitForRefreshLoading();
        await aibotDatasetPanel.clickMojoPageButton('Done');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(RefreshBot1_1.datasetName);
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.rightClickOnDataName('City');
        await aibotDatasetPanelContextMenu.getRenameButton().click();
        await aibotDatasetPanelContextMenu.renameElementAndPressEnter('attribute', 'City_rename');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC97752_01',
            'rename attribute take effects'
        );
        await aibotDatasetPanelContextMenu.changeMetricNumberFormattingToType('Percentage', 'Cost');
        await aibotDatasetPanel.rightClickOnDataName('Cost');
        await aibotDatasetPanelContextMenu.hoverOnNumberFormatButton();
        await takeScreenshotByElement(
            aibotDatasetPanelContextMenu.getNumberFormatContainer(),
            'TC97752_02',
            'check number format container after changing number format to percentage'
        );
    });

    it('[TC92347] Verify refresh dataset in AI bot dataset panel - File', async () => {
        await libraryPage.editBotByUrl({ projectId: RefreshBot2.project.id, botId: RefreshBot2.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(RefreshBot2.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await takeScreenshotByElement(
            aibotDatasetPanel.getRefreshContainer(),
            'TC92347-01',
            'Refresh dataset page of File is displayed'
        );
        await aibotDatasetPanel.checkAllInRefresh();
        await takeScreenshotByElement(
            aibotDatasetPanel.getRefreshContainer(),
            'TC92347-02',
            'Show browse button when select all in refresh dataset page'
        );
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
    });

    it('[TC92386] Verify refresh dataset in AI bot dataset panel - clipboard', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(ManagedBot.datasetName);
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await takeScreenshotByElement(
            aibotDatasetPanel.getRefreshContainer(),
            'TC92386-01',
            'Refresh dataset page of File is displayed'
        );
        await aibotDatasetPanel.checkAllInRefresh();
        await takeScreenshotByElement(
            aibotDatasetPanel.getRefreshContainer(),
            'TC92386-02',
            'Show browse button when select all in refresh dataset page'
        );
        await aibotDatasetPanel.clickMojoPageButton('Upload');
        await aibotDatasetPanel.waitForUploadFilePageLoading();
        await takeScreenshotByElement(
            aibotDatasetPanel.getUploadFilePage(),
            'TC92386-03',
            'Upload file page is displayed'
        );
    });
});
