import VisualizationFilter from './VisualizationFilter.js';
import LineChart from '../visualization/LineChart.js';

export default class ChartVisualizationFilter extends VisualizationFilter {
    constructor() {
        super();
        this.lineChart = new LineChart();
    }

    getXAxisElementList() {
        return this.$$(
            `//div[@class='mstrd-VisFilterDetailsPanel-Body']//div[@class='gm-xaxis']//*[name()='text']`
        );
    }

    getChartElementByOrder(index, chartType) {
        if (chartType == 'LineChart') {
            return this.$$('.gm-shape-scircle')[index];
        }
        if (chartType == 'BarChart') {
            return this.$$('.gm-shape-bar')[index];
        }
        if (chartType == 'BubbleChart') {
            return this.$$('.gm-shape-circle')[index];
        }
        if (chartType == 'AreaChart') {
            return this.$$('.gm-shape-scircle')[index];
        }
        if (chartType == 'PieChart') {
            return this.$$('.gm-shape-pie')[index];
        }
    }

    getDataValueTextForElement(index) {
        return this.element.all(by.xpath(`//div[@class='gm-chart']//*[name()='svg']//*[name()='text']`))[index];
    }

    async getChartElementByName(elementName, chartType) {
        const index = await this.elementIndexInXAxisByName(elementName);
        return this.getChartElementByOrder(index, chartType);
    }

    async elementIndexInXAxisByName(eleName) {
        let theIndex = -1;
        await this.getXAxisElementList().forEach(async (elem, index) => {
            const composedName = await this.lineChart.composeElementName(elem);
            if (composedName === eleName) {
                theIndex = index;
            }
        });
        return theIndex;
    }

    async valueOfToolTipInChart(elementName, chartType) {
        const circleElement = await this.getChartElementByName(elementName, chartType);
        return this.lineChart.valueOfToolTip(circleElement);
    }

    async selectElementsInAreaByName(elementName, chartType) {
        const index = await this.elementIndexInXAxisByName(elementName);
        return this.selectElementsInAreaByIndex(index, chartType);
    }

    async selectElementsInAreaByIndex(index, chartType) {
        await browser.action('pointer')
            .move({ duration: 0, origin: this.getChartElementByOrder(index, chartType), x: 10, y: 10 })
            .down({button: 0})
            .move({ duration: 0, origin: this.getChartElementByOrder(index, chartType), x: -10, y: -10 })
            .up({button: 0})
            .perform();
        return this.sleep(3000);
    }

    async clickChartElementByIndex(index, chartType) {
        const el = this.getChartElementByOrder(index, chartType);
        await browser.action('pointer')
            .move({ duration: 0, origin: this.getChartElementByOrder(index, chartType), x: 0, y: 0 })
            .down({button: 0})
            .up({button: 0})
            .perform();
        return this.sleep(2000);
    }

    async selectOrDeselectChartElementByName(elementName, chartType) {
        const index = await this.elementIndexInXAxisByName(elementName);
        return this.clickChartElementByIndex(index, chartType);
    }
}
