import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';

// npm run regression -- --spec=specs/regression/bot2/ADCAuthoring_EditorPanel.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 ADC authoring other manipulations', () => {
    const { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage,
        aibotDatasetPanel,
        botAuthoring, 
        adc,
        datasetPanel,
        agGridVisualization,
        editorPanelForGrid,
        dossierAuthoringPage,
        baseContainer,
        showDataDialog,
        loadingDialog,
        dossierMojo,
        vizPanelForGrid,
        toolbar,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const aibot = {
        id: '6B3CBB7AC4444B89BB6663F698E94E61',
        name: 'AUTO_2Datasets_autoLinked',
        project: project
    };

    const airline_mtdi = {
        id: '7FF232885D410AFA716FFCA025C1C961',
        name: 'AUTO_Airline_MTDI (Year map)',
        project: project
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser2);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99173_1] Editor Panel: show totals, remove data, object context menu', async () => {
        
        infoLog('add 2 attributes and 2 merics');
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', airline_mtdi.name);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', airline_mtdi.name);
        await datasetPanel.addObjectToVizByDoubleClick('Number of Flights', 'metric', airline_mtdi.name);
        await datasetPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', airline_mtdi.name);
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC99173_01',
            'Editor panel with 2 attributes and 2 metrics'
        );
        infoLog('show totals from editor panel');
        await editorPanelForGrid.showTotal();
        await since('The ag-grid cell in "Data Preview 1" at "2", "1" should have text "Total", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Data Preview 1", "Total"))
            .toBe(true);
        await since('The ag-grid cell in "Data Preview 1" at "2", "3" should have text "473435", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Data Preview 1", "473435"))
            .toBe(true);
    
        infoLog('remove all objects from editor panel');
        await editorPanelForGrid.removeAllObjects();
        await takeScreenshotByElement(
            editorPanelForGrid.editorPanel,
            'TC99173_02',
            'Remove data from editor panel'
        );

        await dossierAuthoringPage.actionOnToolbar('Undo');
        infoLog('check attribute RMC menu, sort, subtotal, replace with');
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        await since('The ag-grid cell in "Data Preview 1" at "3", "1" should have text "US Airways Inc.", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 1, "Data Preview 1", "US Airways Inc."))
            .toBe(true);

        await editorPanelForGrid.createSubtotalsFromEditorPanel('Airline Name', 'attribute', 'Average');
        await since('The ag-grid cell in "Data Preview 1" at "3", "1" should have text "Average", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 1, "Data Preview 1", "Average"))
            .toBe(true);
        await since('The ag-grid cell in "Data Preview 1" at "3", "3" should have text "16325", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 3, "Data Preview 1", "16325"))
            .toBe(true);
        
        await editorPanelForGrid.removeFromDropZone('Airline Name', 'attribute');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Origin Airport',
            'attribute',
            airline_mtdi.name,
            'Rows',
            'above',
            'Year'
        );
        await since('The ag-grid cell in "Data Preview 1" at "2", "1" should have text "BWI", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Data Preview 1", "BWI"))
            .toBe(true);
        
        infoLog('check metric RMC menu, aggregate by, shortcut metric');
        await editorPanelForGrid.secondaryMenuOnEditorObject('Number of Flights', 'metric', 'Aggregate By', 'Average');
        await since('The ag-grid cell in "Data Preview 1" at "1", "4" should have text "Avg (Number of Flights)", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 4, "Data Preview 1", "Avg (Number of Flights)"))
            .toBe(true);
        await editorPanelForGrid.secondaryMenuOnEditorObject('Flights Delayed', 'metric', 'Shortcut Metric', 'Rank');
        await since('The ag-grid cell in "Data Preview 1" at "1", "6" should have text "Rank (Flights Delayed)", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 6, "Data Preview 1", "Rank (Flights Delayed)"))
            .toBe(true);
    });

    it('[TC99173_2] Grid manipulation and toolbar', async () => {
        
        infoLog('add attributes and merics and enter pause mode');
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', airline_mtdi.name);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', airline_mtdi.name);
        await datasetPanel.addObjectToVizByDoubleClick('Number of Flights', 'metric', airline_mtdi.name);
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await since('You should see the "Freezing" image for "Data Preview 1"')
            .expect(await baseContainer.getContainerImgOverlay('freezing', 'Data Preview 1').isDisplayed())
            .toBe(true);
        await since('Refresh button is disabled on toolbar should be #{expected}, instead we have #{actual}')
            .expect (await toolbar.isButtonDisabled('Refresh') )
            .toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');

        infoLog('check Visualization context menu, show data, duplicate, rename, delete');
        await agGridVisualization.openContextMenu('Data Preview 1');
        await agGridVisualization.selectContextMenuOption('Show Data');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierMojo.getMojoEditorWithTitle('Show Data').waitForDisplayed();
        await showDataDialog.closeShowDataDialog();

        await agGridVisualization.openContextMenu('Data Preview 1');
        await agGridVisualization.selectContextMenuOption('Duplicate');
        await since('The container "Data Preview 1 copy" should be dispalyed')
            .expect(await agGridVisualization.getContainer('Data Preview 1 copy').isDisplayed())
            .toBe(true);
        await vizPanelForGrid.renameVisualizationByContextMenu('Data Preview 1 copy', 'AG grid 2')
        await since('The container "AG grid 2" should be dispalyed')
            .expect(await agGridVisualization.getContainer('AG grid 2').isDisplayed())
            .toBe(true);
        await agGridVisualization.openContextMenu('AG grid 2');
        await agGridVisualization.selectContextMenuOption('Delete');
        await since('The container "AG grid 2" should be dispalyed')
            .expect(await agGridVisualization.getContainer('AG grid 2').isDisplayed())
            .toBe(false);
        
        infoLog('grid header context menu, show totals, remove');
        await agGridVisualization.toggleShowTotalsFromMetric('Number of Flights', 'Data Preview 1')
        await since('The ag-grid cell in "Data Preview 1" at "2", "1" should have text "Total", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Data Preview 1", "Total"))
            .toBe(true);
        await since('The ag-grid cell in "Data Preview 1" at "2", "3" should have text "473435", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 3, "Data Preview 1", "473435"))
            .toBe(true);
        await agGridVisualization.openContextMenuItemForHeader('Year', 'Remove', 'Data Preview 1');
        await since('The ag-grid cell in "Data Preview 1" at "1", "2" should have text "Number of Flights", instead we have #{actual}')
            .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 2, "Data Preview 1", "Number of Flights"))
            .toBe(true);

        infoLog('add ag grid from toolbar');
        await dossierAuthoringPage.actionOnToolbar('Add Grid');
        await since('The container "Data Preview 2" should be dispalyed')
            .expect(await agGridVisualization.getContainer('Data Preview 2').isDisplayed())
            .toBe(true);

        infoLog('exit adc');
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();

    });

});
