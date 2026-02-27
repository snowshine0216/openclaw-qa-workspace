'use strict';

import BasePage from '../base/BasePage.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
// let BaseContainer = new (require('./BaseContainer.js'))();

const VIZMAP = {
    Grid: 'Grid',
    'Compound Grid': 'Grid',
    'Grid (Modern)': 'Grid',
    'Vertical Bar Chart': 'Bar',
    'Horizontal Bar Chart': 'Bar',
    'Vertical Clustered Bar Chart': 'Bar',
    'Horizontal Clustered Bar Chart': 'Bar',
    'Vertical Stacked Bar Chart': 'Bar',
    'Horizontal Stacked Bar Chart': 'Bar',
    'Vertical Percent Bar Chart': 'Bar',
    'Horizontal Percent Bar Chart': 'Bar',
    'Synchronized Axis Bar Chart': 'Bar',
    'Matrix Bar Chart': 'Bar',
    'Combo Chart': 'Bar',
    'Line Chart': 'Line',
    'Dual Axis Line Chart': 'Line',
    'Stacked Area Chart': 'Line',
    'Absolute Area Chart': 'Line',
    'Pie Chart': 'Pie',
    'Ring Chart': 'Pie',
    'Geospatial Service': 'Map',
    Map: 'Map',
    KPI: 'KPI',
    Waterfall: 'More',
    'Heat Map': 'More',
    'Bubble Chart': 'More',
    Histogram: 'More',
    'Box Plot': 'More',
    Network: 'More',
    'D3 WordCloud': 'Custom',
    'Google Timeline': 'Custom',
    'Sequences Subburst': 'Custom',
    'Sankey Diagram': 'More',
};

/**
 * Page representing the new Visualization Gallery Panel implemented in 11.3RC
 * @extends BasePage
 * @author Fang Suo <fsuo@microstrategy.com>
 */
export default class NewGalleryPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    // Element locators

    get NewGalleryPanel() {
        return this.$('.mstrmojo-galleryPanel-new');
    }

    getCategoryPanel(cat) {
        return this.NewGalleryPanel.$(`.gallery-content .category.${cat}`);
    }

    getVizInternalName(viz) {
        const VizBtn_MAP = {
            Grid: 'ic-VisGrid',
            'Compound Grid': 'ic-VisMultiGrid',
            'Grid (Modern)': 'ic-VisMultiAgGrid',
            'Vertical Bar Chart': 'ic-VerticalBarChart',
            'Horizontal Bar Chart': 'ic-HorizontalBarChart',
            'Vertical Clustered Bar Chart': 'ic-VerticalClusteredBarChart',
            'Horizontal Clustered Bar Chart': 'ic-HorizontalClusteredBarChart',
            'Vertical Stacked Bar Chart': 'ic-VerticalStackedBarChart',
            'Horizontal Stacked Bar Chart': 'ic-HorizontalStackedBarChart',
            'Vertical Percent Bar Chart': 'ic-VerticalPercentBarChart',
            'Horizontal Percent Bar Chart': 'ic-HorizontalPercentBarChart',
            'Synchronized Axis Bar Chart': 'ic-SynchronizedAxisBarChart',
            'Matrix Bar Chart': 'ic-MatrixBarChart',
            'Combo Chart': 'ic-ComboChart',
            'Line Chart': 'ic-LineChart',
            'Dual Axis Line Chart': 'ic-DualAxisLineChart',
            'Stacked Area Chart': 'ic-StackedAreaChart',
            'Absolute Area Chart': 'ic-AbsoluteAreaChart',
            'Pie Chart': 'ic-PieChart',
            'Ring Chart': 'ic-RingChart',
            'Geospatial Service': 'ic-MapboxVisualizationStyle',
            Map: 'ic-GoogleMapVisualizationStyle',
            KPI: 'ic-KPICardVisualizationStyle',
            Waterfall: 'ic-Waterfall',
            'Heat Map': 'ic-VIHeatMapVisualizationStyle',
            'Bubble Chart': 'ic-BubbleChart',
            Histogram: 'ic-Histogram',
            'Box Plot': 'ic-BoxPlot',
            Network: 'ic-NetworkVisualizationStyle',
            'D3 WordCloud': 'ic-D3WordCloud',
            'Google Timeline': 'ic-GoogleTimeline',
            'Sequences Subburst': 'ic-SequencesSunburst',
            'Sankey Diagram': 'ic-Sankey',
        };
        if (!(viz in VizBtn_MAP)) {
            throw 'Incorrect button name';
        }
        return VizBtn_MAP[viz];
    }

    getVizItem(vizName) {
        let a = this.getVizInternalName(vizName);
        return this.NewGalleryPanel.$(`.${a}`);
    }

    get CloseBtn() {
        return this.NewGalleryPanel.$('.close');
    }

    // Action Helpers

    // select a viz from the gallery panel
    async selectViz(vizName) {
        // Hover mouse on category
        await this.hoverOnCategory(VIZMAP[vizName]);
        // Click on viz
        await this.clickOnViz(vizName);
    }

    async hoverOnCategory(category) {
        let el = await this.getCategoryPanel(category);
        await this.hover({ elem: el });
    }

    async clickOnViz(vizName) {
        let el2 = this.getVizItem(vizName);
        await this.waitForElementVisible(el2);
        await this.click({ elem: el2 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async closeChangeViz() {
        let el = this.CloseBtn;
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        let el2 = this.NewGalleryPanel;
        await this.waitForElementInvisible(el2);
    }
}
