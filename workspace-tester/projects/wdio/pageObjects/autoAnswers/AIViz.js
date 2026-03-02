import AIAssistant from './AIAssistant.js';

export default class AIViz extends AIAssistant {
    // Element locator

    // including bar chart, pie chart, etc
    getGMVizContainers(focusMode = false) {
        if (focusMode) {
            return this.getChatBotVizFocusModal().$$('.gm-main-container');
        }
        return this.getAssistantContainer().$$('.gm-main-container');
    }

    getGMVizContainerByIndex(index = 1, focusMode = false) {
        return this.getGMVizContainers(focusMode)[index - 1];
    }

    getBarsInBarChart(index = 1, focusMode = false) {
        return this.getGMVizContainerByIndex(index, focusMode).$$('.gm-shape-bar');
    }

    getCellInBartChart(index = 1, focusMode = false) {
        return this.getGMVizContainerByIndex(index, focusMode).$('.gm-xaxis-cell');
    }

    getTextSpanInGMViz(index = 1, focusMode = false) {
        return this.getGMVizContainerByIndex(index, focusMode).$('.gm-container');
    }

    getInsightLinechartContainers(focusMode = false) {
        if (focusMode) {
            return this.getChatBotVizFocusModal().$$('.insightlinechart-container');
        }
        return this.getAssistantContainer().$$('.insightlinechart-container');
    }

    getHeatMapContainers(focusMode = false) {
        if (focusMode) {
            return this.getChatBotVizFocusModal().$$('.insightheatmap-container');
        }
        return this.getAssistantContainer().$$('.heatmap-canvas-container');
    }

    getInsightLinechartContainerByIndex(index = 1, focusMode = false) {
        return this.getInsightLinechartContainers(focusMode)[index - 1];
    }

    getHeatMapContainersByIndex(index = E2EAQ_1, focusMode = false) {
        return this.getHeatMapContainers(focusMode)[index - 1];
    }

    getInfoIconInLinechart(index = 1) {
        return this.getInsightLinechartContainerByIndex(index).$('.insightlinechart-info-icon');
    }

    getInsightLineChartInfoTooltip() {
        return this.$$('.insightlinechart-info-icon-tooltip-container').filter((elem) => elem.isDisplayed())[0];
    }

    getInsightLineChartVeticalLabel(index = 1, focusMode = false) {
        return this.getInsightLinechartContainerByIndex(index, focusMode).$('.vertical-labels');
    }

    getVizBackgroundColor(index = 1) {
        return this.getAssistantContainer().$$('.mstrmojo-VIVizPanel')[index - 1].getAttribute('style');
    }

    getKPIContainers(focusMode = false) {
        if (focusMode) {
            return this.getChatBotVizFocusModal().$$('.MultiMetricKPI');
        }
        return this.getAssistantContainer().$$('.MultiMetricKPI');
    }

    getKPIContainerByIndex(index = 1, focusMode = false) {
        return this.getKPIContainers(focusMode)[index - 1];
    }

    getMapboxContainers(focusMode = false) {
        if (focusMode) {
            return this.getChatBotVizFocusModal().$$('.mstrmojo-Map ');
        }
        return this.getAssistantContainer().$$('.mstrmojo-Map ');
    }

    getMapboxContainersByIndex(index = 1, focusMode = false) {
        return this.getMapboxContainers(focusMode)[index - 1];
    }

    getRightBoxOnMapbox(index = 1, focusMode = false) {
        return this.getMapboxContainersByIndex(index, focusMode)
            .$$('.mapboxgl-ctrl-bottom-right')
            .filter((elem) => elem.isDisplayed())[0];
    }

    // Action helper

    async hoverInfoIconInLinechart(index = 1) {
        await this.hover({ elem: this.getInfoIconInLinechart(index) });
        return this.waitForElementVisible(this.getInsightLineChartInfoTooltip());
    }

    async hoverLatestInfoIconInLinechart() {
        const count = await this.getInsightLinechartCount();
        await this.hoverInfoIconInLinechart(count);
    }

    async hoverMapbox(index = 1, focusMode = false) {
        await this.hover({ elem: this.getMapboxContainersByIndex(index, focusMode) });
    }

    // Assetion helper
    async getBarsCountInBarChart(index = 1, focusMode = false) {
        return this.getBarsInBarChart(index, focusMode).length;
    }

    async getInsightLinechartCount(focusMode = false) {
        return this.getInsightLinechartContainers(focusMode).length;
    }

    async getHeatMapCount(focusMode = false) {
        return this.getHeatMapContainers(focusMode).length;
    }

    async getKPICount(focusMode = false) {
        return this.getKPIContainers(focusMode).length;
    }

    async getGMVizCount(focusMode = false) {
        return this.getGMVizContainers(focusMode).length;
    }

    async getMapboxCount(focusMode = false) {
        return this.getMapboxContainers(focusMode).length;
    }

    async isInsightLinechartInfoTooltipPresent() {
        return this.getInsightLineChartInfoTooltip().isDisplayed();
    }

    async getInsightLineChartVeticalLabelText(index = 1, focusMode = false) {
        return this.getInsightLineChartVeticalLabel(index, focusMode).getText();
    }

    async getFirstTextInPieChart(index = 1, focusMode = false) {
        return this.getTextSpanInGMViz(index, focusMode).getText();
    }

    async isRightBoxOnMapboxPresent(index = 1, focusMode = false) {
        return this.getRightBoxOnMapbox(index, focusMode).isDisplayed();
    }
}
