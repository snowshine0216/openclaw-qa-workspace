import BaseVisualization from '../base/BaseVisualization.js';

export default class GraphMatrix extends BaseVisualization {
    // Element locators
    getBoxPlotContainer() {
        return this.$('.boxlayer');
    }

    getBoxPlotElements() {
        return this.$$('.trace.boxes');
    }

    getBoxPlotBackgroundColor(index = 0) {
        // Get the path element from the specific box plot
        const boxPath = this.getBoxPlotElements()[index].$('.box');
        return boxPath.getCSSProperty('fill');
    }

    async getBoxPlotFillColor(index = 0) {
        const fillProperty = await this.getBoxPlotBackgroundColor(index);
        // This will return the CSS value in the format rgba(r, g, b, a)
        return fillProperty.value;
    }
}
