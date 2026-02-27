import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('Library Visualization Sanity', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        allViz: {
            id: '33BB0E5F49D88DF3E583C2B3C6FBBF3A',
            name: 'AllViz_CSPCompliant_23.12_ABA',
        },
        testName: 'LibraryVisualizationSanity',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        libraryAuthoringPage,
        datasetsPanel,
        vizGallery,
        dossierEditorUtility,
        autoNarratives,
        contentsPanel,
        dossierAuthoringPage,
        baseVisualization,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await loginPage.disablePendoTutorial();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98366] E2E | Library | Run sanity tests for KPIs, Bar, Line Chart and Pie Chart in different environments', async () => {
        // Create a dossier from library
        await libraryAuthoringPage.createBlankDashboard();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleData(6);

        // Create KPI
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('KPI', 'KPI');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanity', '0101_KPI');

        // Create Multi-Metric KPI
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'KPI', 'Multi-Metric KPI');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0102_Multi-MetricKPI');

        // Create Comparison KPI
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'KPI', 'Comparison KPI');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0103_ComparisonKPI');

        // Create Gauge
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'KPI', 'Gauge');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0104_Gauge');

        // Create Bar
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Bar', 'Vertical Bar Chart');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0201_VerticalBarChart');

        //Create Line
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Line', 'Line Chart');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0301_LineChart');

        //Create Pie
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Pie', 'Pie Chart');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0401_PieChart');
    });

    it('[TC98367] E2E | Library | Run sanity tests for Maps, More in different environments', async () => {
        // Create a dossier from library
        await libraryAuthoringPage.createBlankDashboard();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleData(6);
        // Create Map
        // Create Geospatial Service
        await baseVisualization.changeVizType('Visualization 1', 'Map', 'Geospatial Service');
        await dossierPage.sleep(3000);
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0501_GeospatialService');

        // Create ESRI Map
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Map', 'Map');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0502_ESRIMap');

        //Create More
        //Create Waterfall
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Waterfall');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0601_Waterfall');

        //Create Heat Map
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Heat Map');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0602_HeatMap');

        //Create Bubble Chart
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Bubble Chart');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0603_BubbleChart');

        //Create Histogram
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Histogram');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0604_Histogram');

        //Create Box Plot
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Box Plot');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0605_BoxPlot');

        //Create Network
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Network');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0606_Network');

        //Create Sankey Diagram
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Sankey Diagram');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(3000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0607_SankeyDiagram');

        //Create Time Series
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Time Series');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetricByName('Cost');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetricByName('Revenue');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetricByName('Price');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetricByName('Available');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetricByName('Sold');
        await dossierPage.sleep(2000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0608_TimeSeries');

        //Create Custom
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Custom', 'Sequences Sunburst');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanity', '0701_SequencesSunburst');
    });

    it('[TC98368] E2E | Library | Run sanity tests for Insight Visualizations in different environments', async () => {
        // Create a dossier from library
        await libraryAuthoringPage.createBlankDashboard();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleData(6);
        // Create Insight
        // Create Auto Narratives
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Auto Narratives');
        await autoNarratives.setInstruction([
            'show the top city by average cost in bellow format: Top city for average cost City: Value:',
        ]);
        await dossierPage.sleep(5000);
        await dossierEditorUtility.checkVIDoclayout('viz/vizSanity', 'AutoNarratives_Image');

        // Create Forecast Line Chart
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Insight', 'Forecast Line Chart');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanity', '0802_ForecastLineChart');

        // Create Linear Trend Line Chart
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Insight', 'Linear Trend Line Chart');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanity', '0803_TrendLineChart');

        // Create Key Driver
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Insight', 'Key Driver');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanity', '0804_KeyDriver');
    });
});
