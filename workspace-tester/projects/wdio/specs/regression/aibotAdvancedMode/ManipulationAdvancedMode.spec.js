import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botAdModeUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import { dossier } from '../../../constants/teams.js';
import BaseVisualization from '../../../pageObjects/base/BaseVisualization.js';

describe('mainpulation in advanced mode scenarios', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const AdvancedBot = {
        id: '5750AF2876411151E4CE3F808EBE7A64',
        name: 'Admode',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const AdvancedBot4 = {
        id: 'D23DC13C4B4E549FCE446BBE10EDE814',
        name: 'Admode_folderStructure',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const AdvancedBotSaved = {
        id: '3361585AE1432C536BFE5188363C3669',
        name: 'Admode_saved',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage, 
        aibotChatPanel,
        botAuthoring, 
        aibotDatasetPanel, 
        toolbar, 
        visualizationPanel, 
        datasetsPanel, 
        dossierEditorUtility, 
        dossierAuthoringPage,
        baseVisualization,
        grid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botAdModeUser);
        await browser.execute(() => {
            localStorage.setItem('debugMojo', '1');
        });
 
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95825_1] manipulation of grid in advanced mode and save', async () => {
        await libraryPage.editBotByUrl({ projectId: AdvancedBot.project.id, botId: AdvancedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        // always execute mode, drag and drop, and pause mode
        await since('Pause button exist should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.getButtonFromToolbar('Pause Data Retrieval').isExisting() )
        .toBe(true);
        await datasetsPanel.doubleClickAttributeMetric('Quarter');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        // take screenshot
        await checkElementByImageComparison(
            visualizationPanel.getVizByMatchFullTitle('Data Preview 1'),
            'advancedMode/TC95825',
            'data added in grid'
        );
        // apply and go back to bot, re-enter advanced mode, still in execute mode, and the grid kept
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('Refresh button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Refresh') )
        .toBe(false);
        await since('Pause button exist should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.getButtonFromToolbar('Pause Data Retrieval').isExisting() )
        .toBe(true);
        await checkElementByImageComparison(
            visualizationPanel.getVizByMatchFullTitle('Data Preview 1'),
            'advancedMode/TC95825',
            'grid data kept'
        );
        // add new viz should be Modern grid
        await dossierAuthoringPage.actionOnToolbar('Add Grid');
        await since('New viz type should be #{expected}, instead we have #{actual}')
        .expect (await visualizationPanel.getVizTypeNameByTitle('Data Preview 2'))
        .toBe('Grid');
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('Cancel and back the newly created viz exist should be #{expected}, instead we have #{actual}')
        .expect (await visualizationPanel.getVizByMatchFullTitle('Data Preview 2').isExisting())
        .toBe(false);
        // add new data and save
        await dossierAuthoringPage.actionOnToolbar('Add Data');
        await dossierAuthoringPage.actionOnSubmenu('Existing Dataset...');
        await dossierAuthoringPage.searchSelectDataset('Auto_Advanced_hierarchy');
        await dossierAuthoringPage.waitForCurtainDisappear();
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await botAuthoring.saveAsBot({ name: AdvancedBotSaved.name });
        await aibotChatPanel.goToLibrary();

        // check saved bot
        await libraryPage.editBotByUrl({ projectId: AdvancedBotSaved.project.id, botId: AdvancedBotSaved.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('dataset count should be #{expected}, instead we have #{actual}')
        .expect (await aibotDatasetPanel.getDatasetCount()).toBe(2);
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('dataset count in AD mode should be #{expected}, instead we have #{actual}')
        .expect (await datasetsPanel.getDatasetCount()).toBe(3);
        await dossierEditorUtility.checkVIBoxPanel('advancedMode/TC95825', 'vi configuration panel');
    });

    it('[TC95825_2] check context menu', async () => {
        await libraryPage.editBotByUrl({ projectId: AdvancedBotSaved.project.id, botId: AdvancedBotSaved.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        // Check Dataset panel context menu
        const dsMenuBtn = await dossierAuthoringPage.getDatasetOptionBtn('Revenue Cube');
        await dossierAuthoringPage.openMenuByClick(dsMenuBtn);
        await since('Dataset menu item count should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getMenueItemCount()).toBe(11);

        await datasetsPanel.rightClickAttributeMetric('Category');
        await since('RMC dataset Category item count should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getMenueItemCount()).toBe(12);
        await dossierAuthoringPage.actionOnSubmenu('Add to Filter');
        await dossierEditorUtility.checkVIBoxPanel('advancedMode/TC95825', 'filter panel');

        const attrMetric = ['Category', 'Revenue', 'Region'];
        await datasetsPanel.multiSelectAttributeMetric(attrMetric);
        await since('Multi select elements in datasets item count should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getMenueItemCount()).toBe(2);

        // Check Visualization context menu
        await baseVisualization.rightClickTitleBoxNoWait('Data Preview 1');
        await since('RMC visualization title context menu appear should be #{expected}, instead we have #{actual}')
        .expect (await baseVisualization.getContextMenuByLevel(0).isDisplayed()).toBe(false);
        const vizMenuBtn = await baseVisualization.getVisualizationMenuButton('Data Preview 1');
        await dossierAuthoringPage.openMenuByClick(vizMenuBtn);
        await since('Grid menu item count should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getMenueItemCount()).toBe(15);
        await dossierAuthoringPage.actionOnSubmenu('Show Totals');
        await grid.openGridElmContextMenu({
            title: 'Data Preview 1',
            headerName: 'Quarter', 
            agGrid: true 
        });
        await since('Attribute header Quarter menu item count should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getMenueItemCount()).toBe(11);
        await grid.openGridElmContextMenu({
            title: 'Data Preview 1',
            headerName: 'Revenue', 
            agGrid: true 
        });
        await since('Metric header menu item count should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getMenueItemCount()).toBe(18);

    });

    it('[TC95827] tree view and pushdown', async () => {
        await libraryPage.editBotByUrl({ projectId: AdvancedBot4.project.id, botId: AdvancedBot4.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        // Check parameter doesn't exist in dataset panel
        await since('parameter disaplayed should be #{expected}, instead we have #{actual}')
        .expect (await datasetsPanel.getAttributeMetric('elementlist-year').isDisplayed())
        .toBe(false);
        await since('parameter disaplayed should be #{expected}, instead we have #{actual}')
        .expect (await datasetsPanel.getAttributeMetric('value-number').isDisplayed())
        .toBe(false);
        // take screenshot of datset panel
        await checkElementByImageComparison(
            dossierAuthoringPage.getDatasetPanel(),
            'advancedMode/TC95827',
            'tree view and no parameter in advanced mode'
        );
    });
});
