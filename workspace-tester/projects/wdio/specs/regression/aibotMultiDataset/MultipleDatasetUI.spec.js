import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('Multiple Datasets - UI', () => {
    const FolderStructureBot = {
        id: 'F3EC730EC849172B67A7B799A1DDAE00',
        name: 'FolderStructureBot',
        dataset1: 'folderStructure',
        dataset2: 'test-nw1',
        dataPanelTtile: 'Manage access to data to answer questions',
        noMatchMessage: 'No Matched Content',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const FlatViewBot = {
        id: '6B7F19A1A948E4B7C1025FB09A74C205',
        name: 'FlatViewBot',
        dataset1: 'Sales Data',
        dataset2: 'base report',
        dataset3: 'OLAP',
        dataset4: 'airline-sample-data.xls',
        dataPanelTtile: 'Manage access to data to answer questions',
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
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const DarkThemeBot = {
        id: 'BABC69B0114C5532E1DF14A949D6163A',
        name: 'DarkThemeBot',
        dataset1: 'MDX cube',
        dataset2: 'NAA report',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel, aibotChatPanel, aibotDatasetPanelContextMenu } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(dataBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        if (aibotDatasetPanel.isDataChecked('Cost') === true) {
            await aibotDatasetPanel.checkOrUncheckData('Cost');
            await aibotDatasetPanel.checkOrUncheckData('Store Wifi');
            await aibotDatasetPanel.checkOrUncheckData('NAA attribute');
            await botAuthoring.saveBot({});
        }
        await logoutFromCurrentBrowser();
    });

    it('[TC96300] Verify multiple datasets UI component - message', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset panel message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelTitle().getText())
            .toBe(ComplexViewBot.dataPanelTtile);
    });

    it('[TC96302] Verify multiple datasets UI component - Advanced', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getAdvancedContainer(),
            'TC96302',
            'Check dataset panel basic UI components - advanced'
        );
    });

    it('[TC95808] Verify multiple datasets UI component - attribute linking', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset link icon display should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isLinkIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC95808',
            'Check dataset panel - attribute linking'
        );
    });

    it('[TC96301] Verify multiple datasets UI component - search', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset panel should have search is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isSearchPresent())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getSearchContainer(),
            'TC96301',
            'Check dataset panel basic UI components - search'
        );
    });

    it('[TC96303] Verify multiple datasets UI component - search result', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.closeDataset(ComplexViewBot.dataset2);
        await aibotDatasetPanel.inputSearchText('a');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96303-01',
            'Check dataset panel search result - close dataset'
        );
        await aibotDatasetPanel.openDataset(ComplexViewBot.dataset2);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96303-02',
            'Check dataset panel search result - open dataset'
        );
        await since('The dataset clear search icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isClearSearchIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.inputSearchText('123/`');
        await since('The dataset panel show error message is #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getNoContentMessage().getText())
            .toBe(ComplexViewBot.noMatchMessage);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96303-03',
            'Check dataset panel search result - no matched content'
        );
    });

    it('[TC95806] verify flat view menu in dataset panel with multiple datasets', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset panel message should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelTitle().getText())
            .toBe(FlatViewBot.dataPanelTtile);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(0))
            .toBe(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC95806-01',
            'Check dataset panel - flat view new data model'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95806-02',
            'Check dataset panel menu - with delete - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset1);
        await aibotDatasetPanel.closeDataset(FlatViewBot.dataset1);
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset2);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95806-03',
            'Check dataset panel menu - report - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset2);
        await aibotDatasetPanel.closeDataset(FlatViewBot.dataset2);
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset3);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95806-04',
            'Check dataset panel menu - OLAP with delete - flat view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset3);
        await aibotDatasetPanel.closeDataset(FlatViewBot.dataset3);
        await aibotDatasetPanel.clickMenuButtonForDataset(FlatViewBot.dataset4);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC95806-05',
            'Check dataset panel menu - managed with delete - flat view'
        );
    });

    it('[TC96287] Verify multiple datasets UI component - folder structure view', async () => {
        await libraryPage.editBotByUrl({ projectId: FolderStructureBot.project.id, botId: FolderStructureBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(1))
            .toBe(FolderStructureBot.dataset2);
        await aibotDatasetPanel.closeDataset(FolderStructureBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC96287-01',
            'Check dataset panel - folder structure view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(FolderStructureBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC96287-02',
            'Check dataset panel menu - with delete - folder structure view'
        );
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FolderStructureBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC96287-03',
            'Check dataset panel - folder structure view unselected'
        );
    });

    it('[TC96289] Verify multiple datasets UI component - complex view', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText(0))
            .toBe(ComplexViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC96289-01',
            'Check dataset panel - complex view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(ComplexViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC96289-02',
            'Check dataset panel menu - with delete - complex view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(ComplexViewBot.dataset1);
        await aibotDatasetPanel.clickMenuButtonForDataset(ComplexViewBot.dataset2);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC96289-03',
            'Check dataset panel menu - report - complex view'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(ComplexViewBot.dataset2);
    });

    it('[TC96304] Verify multiple datasets UI component - select/unselect', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(ComplexViewBot.dataset1);
        if (aibotDatasetPanel.isDataChecked('Cost') === true) {
            await aibotDatasetPanel.checkOrUncheckData('Cost');
        }
        if (aibotDatasetPanel.isDataCheckedInFolder('Store Wifi') === false) {
            await aibotDatasetPanel.checkOrUncheckData('Store Wifi');
        }
        if (aibotDatasetPanel.isDataChecked('NAA attribute') === true) {
            await aibotDatasetPanel.checkOrUncheckData('NAA attribute');
        }
        await aibotDatasetPanel.checkOrUncheckData('Store Wifi');
        await aibotDatasetPanel.checkOrUncheckData('Cost');
        await aibotDatasetPanel.checkOrUncheckData('NAA attribute');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('B');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC96304-01', 'Check unselect result');
        await botAuthoring.saveBot({});
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(ComplexViewBot.dataset1);
        await libraryPage.clickLibraryIcon();
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96304-02',
            'Check dataset panel select/unselect attribute/metrics'
        );
        await aibotDatasetPanel.checkOrUncheckData('Store Wifi');
        await aibotDatasetPanel.checkOrUncheckData('Cost');
        await aibotDatasetPanel.checkOrUncheckData('NAA attribute');
        await botAuthoring.saveBot({});
        await libraryAuthoringPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96304-03',
            'Check dataset panel select/unselect attribute/metrics'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(' N');
        await takeScreenshotByElement(aibotChatPanel.getAutoCompleteArea(), 'TC96304-04', 'Check unselect result');
    });

    it('[TC96305] Verify multiple datasets UI component - select/unselect all', async () => {
        await libraryPage.editBotByUrl({ projectId: FlatViewBot.project.id, botId: FlatViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.dataset1);
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.dataset2);
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.dataset3);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96305-01',
            'Check dataset panel unselect all'
        );
        await aibotDatasetPanel.clickCheckboxOnDatasetTitle(FlatViewBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96305-03',
            'Check dataset panel select dataset1'
        );
    });

    it('[TC96371] Verify multiple datasets UI component - dark theme', async () => {
        await libraryPage.editBotByUrl({ projectId: DarkThemeBot.project.id, botId: DarkThemeBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC96371-01',
            'Check dataset panel with dark theme'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getAdvancedContainer(),
            'TC96371-02',
            'Check dataset panel basic UI components - advanced with dark mode'
        );
        await takeScreenshotByElement(
            aibotDatasetPanel.getSearchContainer(),
            'TC96371-03',
            'Check dataset panel basic UI components - search with dark theme'
        );
        await aibotDatasetPanel.clickMenuButtonForDataset(DarkThemeBot.dataset1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC96371-04',
            'Check dataset panel menu - with dark theme'
        );
        await aibotDatasetPanel.hoverOnDatasetName(1);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC96371-06',
            'Check dataset panel tooltip - Dark theme'
        );
    });

    it('[TC96433] Verify multiple datasets UI component - tooltip and object context menu', async () => {
        await libraryPage.editBotByUrl({ projectId: ComplexViewBot.project.id, botId: ComplexViewBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.hoverOnDatasetName(0);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetPanel(),
            'TC96433-01',
            'Check dataset name tooltip layout'
        );
        await aibotDatasetPanel.hoverOnDataName('NAA attribute');
        await takeScreenshotByElement(aibotDatasetPanel.getDatasetPanel(), 'TC96433-02', 'Check data tooltip');
        await aibotDatasetPanel.rightClickOnDataName('Cost');
        await since('The dataset context menu should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isNumberFormatButtonDisplayed())
            .toBe(true);
        await since('The dataset context menu should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isRenameDisplayed())
            .toBe(true);
        await since('The dataset context menu should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isAttributeFormsButtonDisplayed())
            .toBe(false);
        await aibotDatasetPanel.rightClickOnDataName('NAA attribute');
        await since('The dataset context menu should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isNumberFormatButtonDisplayed())
            .toBe(false);
        await since('The dataset context menu should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isRenameDisplayed())
            .toBe(true);
        await since('The dataset context menu should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanelContextMenu.isAttributeFormsButtonDisplayed())
            .toBe(true);
    });
});
