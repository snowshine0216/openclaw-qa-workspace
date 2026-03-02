import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('library Viz Sanity SaaS', () => {
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

    const SaaSTestUser = {
        credentials: {
            username: 'saastest.authoring@microstrategy.com',
            password: 'newman1#',
        },
    };

    beforeAll(async () => {
        await loginPage.saasLogin(SaaSTestUser.credentials);
        await setWindowSize(browserWindowCustom);
        await libraryPage.executeScript('window.pendo.stopGuides();');
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await loginPage.disableTutorial();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98366] E2E | Library | Run sanity tests for KPIs, Bar, Line Chart and Pie Chart in different environments', async () => {
        // Create a dossier from library
        await libraryAuthoringPage.createBlankDashboard();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleDataSaaS(4);

        // Create KPI
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('KPI', 'KPI');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanitySaaS', '0101_KPI');

        // Create Multi-Metric KPI
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'KPI', 'Multi-Metric KPI');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle(
            'Visualization 1',
            'viz/vizSanitySaaS',
            '0102_Multi-MetricKPI'
        );

        // Create Comparison KPI
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'KPI', 'Comparison KPI');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Supplier');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0103_ComparisonKPI');

        // Create Gauge
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'KPI', 'Gauge');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0104_Gauge');

        // Create Bar
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Bar', 'Vertical Bar Chart');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle(
            'Visualization 1',
            'viz/vizSanitySaaS',
            '0201_VerticalBarChart'
        );

        //Create Line
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Line', 'Line Chart');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0301_LineChart');

        //Create Pie
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Pie', 'Pie Chart');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0401_PieChart');
    });

    it('[TC98367] E2E | Library | Run sanity tests for Maps, More in different environments', async () => {
        // Create a dossier from library
        await libraryAuthoringPage.createBlankDashboard();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleDataSaaS(4);
        // Create Map
        // Create Geospatial Service
        await baseVisualization.changeVizType('Visualization 1', 'Map', 'Geospatial Service');
        await dossierPage.sleep(3000);
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle(
            'Visualization 1',
            'viz/vizSanitySaaS',
            '0501_GeospatialService'
        );

        // Create ESRI Map
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Map', 'Map');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0502_ESRIMap');

        //Create More
        //Create Waterfall
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Waterfall');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0601_Waterfall');

        //Create Heat Map
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Heat Map');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0602_HeatMap');

        //Create Bubble Chart
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Bubble Chart');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0603_BubbleChart');

        //Create Histogram
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Histogram');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0604_Histogram');

        //Create Box Plot
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Box Plot');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0605_BoxPlot');

        //Create Network
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Network');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0606_Network');

        //Create Sankey Diagram
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'More', 'Sankey Diagram');
        await datasetsPanel.doubleClickAttributeMetric('City');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(2000);
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(3000);
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0607_SankeyDiagram');

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
        await baseVisualization.checkVizContainerByTitle('Visualization 1', 'viz/vizSanitySaaS', '0608_TimeSeries');

        //Create Custom
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await baseVisualization.changeVizType('Visualization 1', 'Custom', 'Sequences Sunburst');
        await datasetsPanel.doubleClickAttributeMetric('Month');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle(
            'Visualization 1',
            'viz/vizSanitySaaS',
            '0701_SequencesSunburst'
        );
    });

    it('[TC98368] E2E | Library | Run sanity tests for Insight Visualizations in different environments', async () => {
        // Create a dossier from library
        await libraryAuthoringPage.createBlankDashboard();
        // Import a dataset from sample files
        await dossierAuthoringPage.addNewSampleDataSaaS(4);
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
        await dossierEditorUtility.checkVIDoclayout('viz/vizSanitySaaS', '0801_AutoNarratives');

        // Create Forecast Line Chart
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Insight', 'Forecast Line Chart');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle(
            'Visualization 2',
            'viz/vizSanitySaaS',
            '0802_ForecastLineChart'
        );

        // Create Linear Trend Line Chart
        await contentsPanel.clickOptionOnChapterMenu('Chapter 1', 'Insert Page');
        await vizGallery.clickOnInsertVI();
        await vizGallery.changeVizType('Insight', 'Linear Trend Line Chart');
        await datasetsPanel.doubleClickAttributeMetricByName('Date');
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await dossierPage.sleep(1000);
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanitySaaS', '0803_TrendLineChart');

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
        await baseVisualization.checkVizContainerByTitle('Visualization 2', 'viz/vizSanitySaaS', '0804_KeyDriver');
    });
});
