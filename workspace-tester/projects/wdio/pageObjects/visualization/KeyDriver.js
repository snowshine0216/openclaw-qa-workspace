import VisualizationPanel from '../dossierEditor/VisualizationPanel.js';
import BaseVisualization from '../base/BaseVisualization.js';

export default class KeyDriver extends BaseVisualization {
    constructor() {
        super();
        this.vizPanel = new VisualizationPanel();
    }

    getBar(index) {
        return this.vizPanel.getDisplayedPage().$$('.factor-bar')[index];
    }

    getIncreaseBar(index) {
        return this.vizPanel.getDisplayedPageInConsumtpion().$$('.factor-bar')[index];
    }

    getDecreaseBar(index) {
        return this.vizPanel.getDisplayedPageInConsumtpion().$$('.factor-bar.factor-bar-decrease')[index];
    }

    async hoverOnBar(index = 0) {
        await this.hover({ elem: this.getBar(index) });
    }

    //Hover on increase bar in consumption
    async hoverOnIncreaseBar(index = 0) {
        await this.hover({ elem: this.getIncreaseBar(index) });
    }

    //Hover on decrease bar in consumption
    async hoverOnDecreaseBar(index = 0) {
        await this.hover({ elem: this.getDecreaseBar(index) });
    }

    async clickBar(index = 0) {
        await this.click({ elem: this.getBar(index) });
    }
}
