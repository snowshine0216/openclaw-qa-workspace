export const vizUser = {
    credentials: {
        username: 'viztester',
        password: 'newman1#',
    },
};

export const vizUser_chn = {
    credentials: {
        username: 'i18n_c',
        password: '',
    },
};

export const autoUser = {
    credentials: {
        username: 'automation',
        password: '',
    },
};

export const txnAutoUser = {
    credentials: {
        username: 'txnAutoUser',
        password: '',
    },
};

export const noHTML = {
    credentials: {
        username: 'noHTML',
        password: '',
    },
};

export const oneHTML1 = {
    credentials: {
        username: 'oneHTML1',
        password: '',
    },
};

export const analystUser = {
    credentials: {
        username: 'tester_analyst',
        password: 'newman1#',
    },
};

export const tqmsUser = {
    credentials: {
        username: 'tqmsuser',
        password: 'ddset',
    },
};

export const noSort = {
    credentials: {
        username: 'noSort',
        password: 'newman1#',
    },
};

export const vizAdmin = {
    credentials: {
        username: 'administrator2',
        password: '',
    },
};

export const vizBotHRData = {
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    data: {
        datasets: [
            {
                id: '7DF612376B498C810E99FA9DE47B2086',
                name: 'HRData',
            },
        ],
        isBot: true,
        overwrite: true,
        name: 'vizBotHRData',
        description: '',
        folderId: '926566BFDC4542A76278ECAA5D5E52E8',
    },
};

export const vizBotSalesData = {
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    data: {
        datasets: [
            {
                id: '8E8DEFC8FF42F42769154AA7C5E33C71',
                name: 'StoreSalesData',
            },
        ],
        isBot: true,
        overwrite: true,
        name: 'vizBotSalesData',
        description: '',
        folderId: '926566BFDC4542A76278ECAA5D5E52E8',
    },
};

export const vizBotSalesData2 = {
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    data: {
        datasets: [
            {
                id: '8E8DEFC8FF42F42769154AA7C5E33C71',
                name: 'StoreSalesData',
            },
        ],
        isBot: true,
        overwrite: true,
        name: 'vizBotSalesData2',
        description: '',
        folderId: '926566BFDC4542A76278ECAA5D5E52E8',
    },
};

export const ddaSalesData = {
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    data: {
        datasets: [
            {
                id: '2CF776611847926C61CF2FAE6BD68A1D',
                name: 'ddaSalesData',
            },
        ],
        isBot: true,
        overwrite: true,
        name: 'vizBotDDASalesData',
        description: '',
        folderId: '926566BFDC4542A76278ECAA5D5E52E8',
    },
};

export const publishInfoViz = {
    type: 'document_definition',
    recipients: [
        {
            id: '8C1C5AE5964F3A03286601BD51CF6C38',
        },
    ],
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
};

export const HRDataQuestions = {
    grid: 'show me a grid for the top 4 applicants and their corresponding hire costs',
    barChart: 'show me a bar graph for the top 4 applicants and their corresponding hire costs',
    lineChart: 'show me a line graph for the top 4 applicants and their corresponding hire costs',
    pieChart: 'show me a pie graph for the top 4 applicants and their corresponding hire costs',
    heatMap: 'show me heatmap for the top 4 applicants and their corresponding hire costs',
    multiMetricKPI: 'show me KPI visualization for average Hire Cost',
    mapBox: 'show me a map for Hire Cost by State',
    insightLineChartTrend: 'show me the trend for Hire Cost over DOB',
    insightLineChartForecast: 'show me 4 forecast points for Hire Cost over DOB',
    keyDriver: 'show me key driver for Hire Cost by analyze Gender and Applicant Status',
    histograms: 'show me a Histogram for Hire Cost over different regions',
};

export const SalesDataQuestions = {
    grid: 'Show me the revenue contribution by subcategory over Month',
    gridOf2Row: 'Show me top 2 Category by profit in Grid',
    barChart: 'Show me the graph for Revenue by Subcategory',
    lineChart: 'Show me a line graph over Month in year 2022',
    pieChart: 'Show me the revenue contribution by subcategory in a Pie Chart',
    heatMap: 'Show me the revenue contribution by subcategory over Region using a tree map',
    multiMetricKPI: 'Show me the total revenue using KPI',
    mapBox: 'Show me the Revenue over geospatial distribution of Customer State',
    insightLineChartTrend:
        'Identify any significant upward or downward trends in Revenue based on Month over the past three years',
    insightLineChartForecast: 'Show me 5 forecast for Revenue  based on Month',
    keyDriver: 'what drives revenue',
};

export const CHNDataQuestions = {
    grid: '请用一个表格呈现top10 制造厂名称和总质量',
    barChart: '请用一个柱状图呈现top10 制造厂名称和总质量',
    lineChart: '请用一个折线图呈现top10 制造厂名称和总质量',
    pieChart: '请用一个圆饼图呈现top10 制造厂名称和总质量',
    heatMap: '请用一个热力图呈现top 5 制造厂名称和总质量',
    multiMetricKPI: '请用KPI 呈现平均总质量以及总体总质量',
    insightLineChartTrend: '请呈现总质量基于登记年月的趋势图',
    insightLineChartForecast: '请预测一下基于登记年月的总质量',
    keyDriver: '哪些燃料种类和车辆类型驱动了总质量',
};

export const codeCoverage = {
    vizDebugBundles: 'mojo-dossier,mojo-map,vi-kpi,vi-network,vi-heatmap,vi-gm,vi-ngm',
    vizOutputFolder: 'Z:/MojoJS/production/code/mojo/js/code_coverage/nyc_output',
};

export const BarDZRuleQuestions = {
    Object_1A1M: 'Show me a bar chart for category, profit',
    Object_1A2M: 'Show me a bar chart for category, profit, revenue, sort by category name',
    Object_1A3M: 'Show me a bar chart for category, profit, revenue, cost, sort by category name',
    Object_2A1M: 'Show me a bar chart for category, region, profit',
    Object_2A2M: 'Show me a bar chart for category, region, profit, revenue',
    Object_3A1M: 'Show me a bar chart for category, region, year, profit',
    Object_3A2M_Hori: 'Show me a horizontal bar chart for category, region, year, profit, revenue',
};

export const LineDZRuleQuestions = {
    Object_1A1M: 'Show me a line chart for category, profit, sorting descending',
    Object_1A3M: 'Show me a line chart for category, profit, revenue, cost',
    Object_2A2M: 'Show me a line chart for category, region, profit, revenue',
    Object_3A1M: 'Show me a line chart for category, region, year, profit',
    Object_3A2M_Hori: 'Show me a horizontal line chart for category, region, year, profit, revenue',
    Object_1TimeAttribute: 'Show me the revenue for subcategory over month',
    Object_2TimeAttribute: 'Show me the revenue for month and year',
};

export const PieDZRuleQuestions = {
    Object_0A3M: 'Show me a pie for profit, revenue, cost.',
    Object_1A0M: 'Show me a pie for category',
    Object_1A1M: 'Show me a pie for category, profit',
    Object_1A2M: 'Show me a pie for category, profit, revenue',
    Object_2A1M: 'Show me a pie for category, region, profit',
    Object_2A2M: 'Show me a pie for category, region, profit, revenue',
    Object_3A1M: 'Show me a pie for category, region, year, profit',
};

export const HeatMapDZRuleQuestions = {
    Object_1A0M: 'Show me a heatmap visualization for category',
    Object_1A1M: 'Show me a heatmap visualization for category, profit',
    Object_1A3M: 'Show me a heatmap visualization for category, profit, revenue, cost',
    Object_2A1M: 'Show me a heatmap visualization for category, region, profit',
    Object_2A2M: 'Show me a heatmap visualization for category, region, profit, revenue',
};

export const MultiMetricKPIDZRuleQuestions = {
    Object_0A1M: 'Show me a KPI visualization for profit',
    Object_0A3M: 'Show me a KPI visualization for profit, revenue, cost',
    Object_1A0M: 'Show me a KPI visualization for month',
    Object_1A2M: 'Show me a KPI visualization for year, profit, revenue',
    Object_2A2M: 'Show me a KPI visualization for region, year, profit, revenue',
    Object_3A1M: 'Show me a KPI visualization for category, region, year, profit',
};

export const MapBoxDZRuleQuestions = {
    Object_1A0M: 'Show me a map visualization for customer state',
    Object_1A1M: 'Show me a map visualization for customer state, profit',
    Object_2A2M: 'Show me a map visualization for customer state, region, profit, revenue',
};

export const BubbleChartDZRuleQuestions = {
    Object_0A2M: 'Show me a bubble chart for profit, revenue',
    Object_0A3M: 'Show me a bubble chart for profit, revenue, cost',
    Object_1A2M: 'Show me a bubble chart for category, profit, revenue',
    Object_1A3M: 'Show me a bubble chart for category, profit, revenue, cost',
    Object_2A2M: 'Show me a bubble chart for category, year, profit, revenue',
    Object_3A2M: 'Show me a bubble chart for category, region, year, profit, revenue',
};

export const ComboChartDZRuleQuestions = {
    Object_1A2M: 'Show me a combo chart for category, profit, revenue, sort by Profit descending',
    Object_2A1M: 'Show me a combo chart for category, year, profit',
    Object_2A2M: 'Show me a combo chart for category, year, profit, revenue',
    Object_3A2M: 'Show me a combo chart for category, region, year, profit, revenue',
};

export const InsightLineTrendDZRuleQuestions = {
    Object_0A1M: 'Show me a trend for profit',
    Object_0A2M: 'Show me a trend for profit, revenue',
    Object_1A0M: 'Show me a trend for month',
    Object_1A1M: 'Show me a trend for month, profit',
    Object_2A1M: 'Show me a trend for profit by month break by Region',
};

export const InsightLineForecastDZRuleQuestions = {
    Object_0A1M: 'Show me a forecast for profit',
    Object_0A2M: 'Show me a forecast for profit, revenue',
    Object_1A0M: 'Show me a forecast for month',
    Object_1A1M: 'Show me a forecast for month, profit',
    Object_2A1M: 'Show me a forecast for profit by month break by Region',
};

export const KeyDriverDZRuleQuestions = {
    Object_0A1M: 'Show me a key driver for profit',
    Object_1A0M: 'Show me a key driver for category',
    Object_2A1M: 'Show me a key driver for category, region, profit',
};

export const GridDZRuleQuestions = {
    Object_2A3M: 'Show me a grid for category, region, profit, revenue, cost',
};

export const HistogramsQuestions = {
    Object_1A2M: 'Show me a Histogram for revenue and profit over different regions',
    Object_2A1M: 'Show me a Histogram for revenue over different regions and subcategories',
    Object_3A1M: 'Show me a Histogram for revenue over different regions, cateogiries and subcategories',
};

export const VizSubtypeSQL_1 = {
    Bar_Horizontal_1A2M: 'Show me a horizontal bar for category, Profit, Revenue ',
    Bar_XMetric_YAttribute: 'Show me a bar chart with category in Y axis, revenue in x axis',
    Line_DualAixs: 'Show me a dual axis line chart for subcategory, revenue, profit.',
    Bar_KeyWordSort: 'Show me a bar for revenue by subcategory, sorting ascending',
    Bubble_SizeCost_ColorRegion_BreakBCategory:
        'Show me a bubble chart for profit, revenue, size by cost, color by region, break by category',
    Histograms: 'Show me a Histogram for revenue over different regions',
};

export const VizSubtypeSQL_2 = {
    Bubble_ColorByProfit: 'Show me a bubble for revenue, color by profit, for regions',
    Bubble_XProfit_YRevenue: 'Show me a bubble chart with revenue in Y axis, profit in X axis, break by subcategory',
    ComboChart_DualAxis: 'Show me dual axis chart for profit, revenue, by subcategory.',
    ComboChart_LineRevenue_BarProfit: 'Please show me revenue in line and profit in bars for different regions.',
    Heatmap_ColorbyCost: 'Show me a heatmap for region, color by cost.',
    Map_Area: 'Show me a map for customer country, Profit',
    Map_SizeBy: 'Show me a map for customer State, size by Profit',
};

export const VizSubtypeSQL_3 = {
    Bar_Cluster_BreakbyRegion: 'Show me a bar chart for category, Profit, Revenue, break by region',
    Bar_2AonXaxis: 'Show me a bar chart for revenue with category, region in X axis',
    Bubble_YProfit_XRevenue: 'Show me a bubble chart with revenue in x axis, profit in Y axis, break by subcategory',
    ComboChart_LProfit_RRevnue: 'Show me a combo chart for subcategory, profit on left, revenue on right',
    Map_Bubble: 'Show me a bubble map for customer State, Profit',
};

export const VizSubtypeMultiPassSQL_1 = {
    Bar_Horizontal_1A2M:
        'Show me a horizontal bar for categories by Profit and Revenue, show top 3 categories by Profit ',
    Bar_Cluster_BreakbyRegion:
        'Show me a bar chart for for categories by Profit, Revenue, break by region, show top 3 regions by Profit',
    Bar_2AonXaxis: 'Show me a bar chart for revenue with category, region in X axis, show top 3 regions by Profit',
    Bar_XMetric_YAttribute:
        'Show me a bar chart with category in Y axis, revenue in x axis, show top 3 categories by Profit',
    Line_DualAixs:
        'Show me a dual axis line chart for subcategories, revenue, profit, show top 3 subcategories by Profit ',
    Bar_KeyWordSort: 'Show me a bar for revenue by subcategory, sorting ascending, show top 3 subcategories by Profit ',
    Bubble_SizeCost_ColorRegion_BreakByCategory:
        'Show me a bubble chart for profit, revenue, size by cost, color by region, break by category, show top 5 regions by Profit',
};

export const VizSubtypeMultiPassSQL_2 = {
    Bubble_YProfit_XRevenue:
        'Show me a bubble chart with revenue in x axis, profit in Y axis, break by subcategory, show top 5 subcategories by  Profit',
    ComboChart_LProfit_RRevnue:
        'Show me a combo chart for subcategories, profit on left, revenue on right, show top 3 subcategories by Profit',
    ComboChart_DualAxis: 'Show me dual axis chart for profit, revenue, show top 3 subcategories by Profit',
    ComboChart_LineRevenue_BarProfit:
        'Show me revenue in line and profit in bars for different regions, show top 3 regions by profit',
    Heatmap_ColorbyCost: 'Show me a heatmap for regions, color by profit, show top 3 regions by Profit',
    Map_Area: 'Show me an Area map for customer State, Profit, show top 3 customer state by Profit',
};

export const VizSubtypeMultiPassSQL_3 = {
    Bubble_SizeProfit: 'Show me a bubble chart for regions and revenue, size by profit, show top 5 regions by Profit ',
    Bubble_ColorByProfit:
        'Show me a bubble chart for regions and revenue, color by profit, show top 5 regions by Profit',
    Map_Bubble: 'Show me a bubble map for customer State, Profit, show top 3 customer state by Profit',
    Map_SizeBy: 'Show me a map for customer State, size by Profit, show top 3 customer state by Profit',
};

export const VizSubtypeMap = {
    Map_Area: 'Show me an area map for State , Profit and Arbituary Number',
    Map_Marker: 'Show me a Map for State Latitude , State Longitude, color by Profit',
    Map_Area_Multi: 'Show me an area Map for top 5 Profit and Arbituary Number by state',
    Map_Marker_Multi: 'Show me a Map for top 5 profit by State Latitude , State Longitude, color by Profit',
};

export const VizDropzoneSanity = {
    Bar_Hori2A2M: 'Show me a horizontal bar chart for category, region, profit, revenue',
    Bar_2A2M: 'Show me a bar chart for category, region, profit, revenue',
    Line_2A2M: 'Show me a line chart for category, region, profit, revenue',
    Pie_2A2M: 'Show me a pie chart for category, region, profit, revenue',
    HeatMap_2A2M: 'Show me a heatmap for category, region, profit, color by profit',
    BubbleChart_2A2M: 'Show me a bubble chart for Category, region, profit, revenue',
    ComboChart_2A2M: 'Show me a combo chart for category, region, profit, revenue',
    MultiMetricKPI_1A2M: 'Show me a KPI visualization for month, region, profit, revenue',
    MapBox_1A1M: 'Show me a map for top 5 customer state by revenue',
    Trend_2A1M: 'Show me a trend for profit by month, break by category',
    Forecaset_2A1M: 'Show me a forecast for profit by month, break by category',
    Histogram_1A1M: 'Show me a histogram for profit by region',
};

export const E2EAQ_1 = {
    BubbleChart:
        'Visualizing subcategory sales where the X-axis represents revenue, the Y-axis represents profit, and the bubble size represents the cost',
    HorizontalBarChart_TopN:
        'Displaying the top 10 best-selling subcategories,showcasing the products ranked from highest to lowest revenue',
    VerticalClusterBar: 'Analyzing "Cost" versus "Revenue" across various "Regions" using bar chart',
    ComboChart_2MetricsOverMnnth: 'Representing monthly revenue and profit across the same time period.',
    LineChart_1MetricOverMonth: 'Visualizing the monthly revenue',
};

export const E2EAQ_2 = {
    Bubble_Correlation: 'What is the correlation between Profit and Revenue over different regions',
    Most: 'What Regions have the most revenue',
    Compare3M_Bar: 'Compare Revenue, profit, cost by Region',
    Pie_Distribution: 'Show me the distribution for Cost over regions in Year 2020.',
    YOY: 'Show me the revenue year-over-year',
};

export const I18NAQ_1 = {
    BubbleChart_CHN: '可视化产品子类的销售情况,其中x轴表示营业额,y轴表示利润,气泡大小表示成本',
    BubbleChart_GE:
        'Visualisierung der verkäufe "subcategory", bei denen "x achse" "revenue" und "y-achse" "profit margin" repräsentieren, Die größe der blase stellt "cost" dar.',
    HorizontalBarChart_CHN: '显示前10个最畅销的产品子类，按利润升序排列',
    HorizontalBarChart_GE:
        'Die 10 meistverkauften Unterkategorien anzeigen, wobei die Produkte nach dem höchsten bis zum niedrigsten Umsatz geordnet sind.',
    VerticalClusterBar_CHN: '分析不同区域的的销售额与成本.',
    VerticalClusterBar_GE: 'Anna: eine analyse der "Cost" und der "Revenue" Von verschiedenen "Regions".',
};

export const I18NAQ_2 = {
    ComboChart_CHN: '展示给我一个产品子类组合图表的呈现利润和销售额.',
    LineChart_CHN: '使用折线图可视化每个月的的销售额，并且按区域划分.',
    DualAxis_CHN: '展示给我一个有关产品子类的双轴折线图，呈现销售额，利润以及成本.',
    Map_CHN: '请展现一下销售额在客户所在州的分布地图.',
    TopN_CHN: '按销售额排名前5的产品子类是什么',
};
