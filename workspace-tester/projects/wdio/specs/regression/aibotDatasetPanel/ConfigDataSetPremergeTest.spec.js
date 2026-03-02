import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('AIBot Dataset Settings ', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };
    const ManagedBot = {
        id: '5618377A8345C4B892486494460995F3',
        name: '07-managed-clipboard',
        datasetName: 'automation dataset',
        dataPanelTtile: 'Manage access to data to answer questions',
        noMatchMessage: 'No Matched Content',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const StandaloneBot = {
        id: 'A4A3FC67CA4B153690998BA234561EBE',
        name: '25-Standalone-file',
        datasetName: 'File',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RefreshBot = {
        id: 'F8974F609042922799D98FB503719299',
        name: '09-managed-sample data',
        datasetName: 'airline-sample-data.xls',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(browsers.params.credentials);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92136] check dataset panel basic UI components', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe('automation dataset');
        await since('The dataset panel message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelTitle().getText())
            .toBe(ManagedBot.dataPanelTtile);
        await since('The dataset panel should have search is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isSearchPresent())
            .toBe(true);
        await aibotDatasetPanel.checkOrUncheckData('Subcategory');
        await aibotDatasetPanel.checkOrUncheckData('Year');
        await aibotDatasetPanel.checkOrUncheckData('Unit Cost');
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        // await since('The dataset panel show error message should be #{expected}, instead we have #{actual}')
        //     .expect(await aibotDatasetPanel.isErrorIconDisplayed())
        //     .toBe(true);
        await aibotDatasetPanel.inputSearchText('a');
        await since('The dataset panel searchbox show clear icon is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isClearSearchIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.inputSearchText('123');
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage().getText())
            .toBe(ManagedBot.noMatchMessage);
    });

    it('[TC91645] Verify replace dataset to a new one in dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: StandaloneBot.project.id, botId: StandaloneBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe('File');
        await aibotDatasetPanel.clickDatasetArrow();
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await since('The dataset panel replace page show should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDisplayReplacePage())
            .toBe(true);
        await aibotDatasetPanel.clickReplacePageButton('Cancel');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickDataSortBy('Name');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickDataSortBy('Name');
        await aibotDatasetPanel.clickOnDatasetInReplace('TL Dataset');
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.selectBotConfigTabByName('Data');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe('TL Dataset');
    });

    it('[TC92179] Verify refresh dataset in AI bot dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: RefreshBot.project.id, botId: RefreshBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe('airline-sample-data.xls');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Refresh Dataset');
        await aibotDatasetPanel.waitForRefreshPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Refresh');
        await aibotDatasetPanel.waitForRefreshLoading();
        await aibotDatasetPanel.clickMojoPageButton('Done');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe('airline-sample-data.xls');
    });

    it('[TC91647] Edit dataset in AI bot dataset panel', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Cancel');
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Edit Dataset');
        await aibotDatasetPanel.waitForEditPageLoading();
        await aibotDatasetPanel.clickMojoPageButton('Update Dataset');
        await aibotDatasetPanel.checkOrUncheckData('Unit Cost');
    });
});
