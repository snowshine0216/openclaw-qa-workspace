import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';

// npm run regression -- --spec=specs/regression/bot2/ADCAuthoring_DatasetPanel.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 Authoring in ADC, dataset panel', () => {
    const { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage,
        aibotDatasetPanel,
        botAuthoring, 
        adc,
        datasetPanel,
        baseContainer,
        dossierMojo,
        reportDerivedMetricEditor,
        showDataDialog,
        vizPanelForGrid,
        agGridVisualization,
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

    const retail_mtdi = {
        id: 'D6885DFA8E4049C79A05D59CC6CE7BEB',
        name: 'AUTO_Retail_MTDI',
        project: project
    };

    const airline_mtdi = {
        id: '7FF232885D410AFA716FFCA025C1C961',
        name: 'AUTO_Airline_MTDI (Year map)',
        project: project
    };

    const product_olap = {
        id: '1DC91C155B4B64B29627BEA792B7BFA9',
        name: 'AUTO_Product_OLAP',
        project: project
    };

    const product_subset = {
        id: '511B02D47044C164EFDC00A625307D8E',
        name: 'AUTO_Product_SubsetReport',
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
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99114_1] ADC dataset panel - add/delete/replace dataset', async () => {
        infoLog('enter ADC editing page');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);
        infoLog('take screenshot for ADC dataset panel');
        await takeScreenshotByElement(datasetPanel.datasetsPanel,'TC99114_1','ADC dataset panel');

        infoLog('add dataset from dataset panel context menu');
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(retail_mtdi.name);
        await since(`The dataset panel should display dataset "${retail_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(retail_mtdi.name))
            .toBe(true);
        
        infoLog('delete dataset from dataset context menu');
        await datasetPanel.deleteDataset(airline_mtdi.name);
        await since(`The dataset panel should not have the dataset "${airline_mtdi.name}", expected: #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(airline_mtdi.name))
            .toBe(false);

        infoLog('replace dataset from dataset context menu');
        await datasetPanel.chooseDatasetContextMenuOption(retail_mtdi.name, "Replace Dataset With -> Existing Dataset...");
        await adc.selectDatasetAddReplace(airline_mtdi.name);
        await dossierMojo.clickBtnOnMojoEditor("OK");
        await since(`The dataset panel should not have the dataset "${retail_mtdi.name}", expected: #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(retail_mtdi.name))
            .toBe(false);
        await since(`The dataset panel should display dataset "${airline_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(airline_mtdi.name))
            .toBe(true);

        infoLog('replace all datasets from dataset panel context menu');
        await datasetPanel.selectFromDatasetsPanelContextMenu('Replace All Datasets');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(product_subset.name);
        await dossierMojo.clickBtnOnMojoEditor("OK");
        await since(`The dataset panel should display dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(product_subset.name))
            .toBe(true);
        await since(`The dataset panel should not have the dataset "${airline_mtdi.name}", expected: #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(airline_mtdi.name))
            .toBe(false);
        await since(`The dataset panel should not have the dataset "${product_olap.name}", expected: #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(product_olap.name))
            .toBe(false);
    });

    it('[TC99114_2] ADC dataset panel - search', async () => {
        infoLog('enter ADC editing page');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);
        
        infoLog('search all');
        await datasetPanel.searchOnDatasetsPanel("Year");
        let actualCount = await datasetPanel.matchedObjects.length;
        await since('The number of matched objects should be 2, but got #{actual}')
            .expect(actualCount)
            .toBe(2);
        await datasetPanel.clearSearch();
        await datasetPanel.searchOnDatasetsPanel("or");
        actualCount = (await datasetPanel.matchedObjects).length;
        await since('The number of matched objects should be 3, but got #{actual}')
            .expect(actualCount)
            .toBe(3);
        await datasetPanel.clearSearch();

        infoLog('search attribute');
        await datasetPanel.selectFromSearchPulldown("All Attributes");
        await datasetPanel.searchOnDatasetsPanel("cost");
        actualCount = (await datasetPanel.matchedObjects).length;
        await since('The number of matched objects should be 0, but got #{actual}')
            .expect(actualCount)
            .toBe(0);
        await datasetPanel.clearSearch();
        await datasetPanel.searchOnDatasetsPanel("air");
        actualCount = (await datasetPanel.matchedObjects).length;
        await since('The number of matched objects should be 2, but got #{actual}')
            .expect(actualCount)
            .toBe(2);
        await datasetPanel.clearSearch();

        infoLog('search metric');
        await datasetPanel.selectFromSearchPulldown("All Metrics");
        await datasetPanel.searchOnDatasetsPanel("flights");
        actualCount = (await datasetPanel.matchedObjects).length;
        await since('The number of matched objects should be 3, but got #{actual}')
            .expect(actualCount)
            .toBe(3);
        await datasetPanel.clearSearch();

        infoLog('search in specific dataset');
        await datasetPanel.selectFromSearchPulldown("Data Source");
        await baseContainer.selectSecondaryContextMenuOption('AUTO_Product_OLAP');
        await datasetPanel.searchOnDatasetsPanel("o");
        await since(`The dataset panel should not have the dataset "${airline_mtdi.name}", expected: #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.getDatasetElement(airline_mtdi.name).isDisplayed())
            .toBe(false);
        actualCount = (await datasetPanel.matchedObjects).length;
        await since('The number of matched objects should be 4, but got #{actual}')
            .expect(actualCount)
            .toBe(4);
        await datasetPanel.clearSearch();
    });

    it('[TC99114_3] ADC dataset panel - create metric', async () => {
        infoLog('enter ADC editing page');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('create a derived metric');
        await datasetPanel.createDMorDA(airline_mtdi.name, "Metric");
        await since('Metric editor is present should be #{expected}, instead we have #{actual}')
            .expect(await reportDerivedMetricEditor.isMetricEditorDisplayed())
            .toBe(true);
        await reportDerivedMetricEditor.selectFunctionsSelectionFromDMEditor();
        await reportDerivedMetricEditor.selectFunctionFromList("Avg");
        await reportDerivedMetricEditor.selectObjectsSelectionFromDMEditor();
        await reportDerivedMetricEditor.selectObjFromList("Number of Flights");
        await reportDerivedMetricEditor.saveMetric();
        await since('Metric editor is present should be #{expected}, instead we have #{actual}')
            .expect(await reportDerivedMetricEditor.isMetricEditorDisplayed())
            .toBe(false);
        await since('New Metric displays on dataset panel, should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("New Metric", "derived metric", airline_mtdi.name))
            .toBe(true);

        infoLog('edit the derived metric');
        await datasetPanel.actionOnObjectFromDataset("New Metric", "derived metric", airline_mtdi.name, "Edit...");
        await since('Metric editor is present should be #{expected}, instead we have #{actual}')
            .expect(await reportDerivedMetricEditor.isMetricEditorDisplayed())
            .toBe(true);
        await reportDerivedMetricEditor.setMetricNameOpenFromEdit("Avg Num of Flights");
        await reportDerivedMetricEditor.saveMetricEditorOpenFromEdit();
        await since('Metric editor is present should be #{expected}, instead we have #{actual}')
            .expect(await reportDerivedMetricEditor.isMetricEditorDisplayed())
            .toBe(false);
        await since('Avg Num of Flights displays on dataset panel, should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("Avg Num of Flights", "derived metric", airline_mtdi.name))
            .toBe(true);  
    });

    it('[TC99114_4] ADC dataset panel - context menu ', async () => {
        infoLog('enter ADC editing page');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('test dataset context menu');
        infoLog('dataset context menu - show data');
        await datasetPanel.chooseDatasetContextMenuOption(product_olap.name, "Show Data...");
        await since('Show data dialog is present should be #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.isShowDataDialogDisplayed())
            .toBe(true);
        await since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(72);
        await dossierMojo.closeEditor();
        await since('Show data dialog is present should be #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.isShowDataDialogDisplayed())
            .toBe(false);

        infoLog('dataset context menu - republish cube');
        await datasetPanel.chooseDatasetContextMenuOption(airline_mtdi.name, "Republish Cube...");
        await dossierMojo.clickBtnOnMojoEditor("Refresh");
        await dossierMojo.clickBtnOnMojoEditor("Done");

        infoLog('sort descending in particular dataset');
        await datasetPanel.chooseDatasetContextMenuOption(airline_mtdi.name, "Sort Descending");
        await since(`Dataset object "Year" in "${airline_mtdi.name}" should have index #{expected}, instead we have #{actual}`)
            .expect(await datasetPanel.getIndexForObjectinDS(airline_mtdi.name, 0, "Year"))
            .toBe(0);
        await since(`Dataset object "Airline Name" in "${airline_mtdi.name}" should have index #{expected}, instead we have #{actual}`)
            .expect(await datasetPanel.getIndexForObjectinDS(airline_mtdi.name, 5, "Airline Name"))
            .toBe(5);
        await since(`Dataset object "Avg Delay (min)" in "${airline_mtdi.name}" should have index #{expected}, instead we have #{actual}`)
            .expect(await datasetPanel.getIndexForObjectinDS(airline_mtdi.name, 11, "Avg Delay (min)"))
            .toBe(11);

        infoLog('change join behavior in particular dataset');
        await datasetPanel.chooseDatasetContextMenuOption(airline_mtdi.name, "Join Behavior");
        await since('The current selected join behavior should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.currentCheckedItemFromCM())
            .toBe("Primary (outer join)");
        await baseContainer.selectSecondaryContextMenuOption('Secondary (inner join)');
        await datasetPanel.chooseDatasetContextMenuOption(airline_mtdi.name, "Join Behavior");
        await since('The current selected join behavior should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.currentCheckedItemFromCM())
            .toBe("Secondary (inner join)");
    });

    it('[TC99114_5] ADC dataset panel - metric context menu ', async () => {
        infoLog('enter ADC editing page');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('metric context menu - aggregate by');
        await datasetPanel.secondaryCMOnObjectFromDataset("Avg Delay (min)", "metric", airline_mtdi.name, "Aggregate By", "Sum");
        await since('Sum (Avg Delay (min)) displays on dataset panel, should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("Sum (Avg Delay (min))", "derived metric", airline_mtdi.name))
            .toBe(true);

        infoLog('metric context menu - rename');
        await datasetPanel.renameObject("Number of Flights", "metric", airline_mtdi.name, "Num Flights")
        await since('Num Flights displays on dataset panel, should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("Num Flights", "metric", airline_mtdi.name))
            .toBe(true);
        await since('Number of Flights displays on dataset panel, should be #{expected}, instead we have #{actual}')
            .expect(await datasetPanel.isObjectFromDSdisplayed("Number of Flights", "metric", airline_mtdi.name))
            .toBe(false);
        
        infoLog('metric context menu - number format');
        await datasetPanel.actionOnObjectFromDataset("On-Time", "metric", airline_mtdi.name, "Number Format");
        await vizPanelForGrid.clickNfShortcutIcon("currency");
        await vizPanelForGrid.clickContextMenuButton("OK");
        await datasetPanel.addObjectToVizByDoubleClick("On-Time", "metric", airline_mtdi.name);
        await since('The ag grid cell row 2, col 1 has text "$299,253.00"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Data Preview 1'))
            .toBe('$299,253.00');
    });
});
