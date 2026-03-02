import BaseVisualization from '../base/BaseVisualization.js';

export default class Waterfall extends BaseVisualization {

    constructor() {
        super();
    }

    getYAxisLabel(vizName) {
        return this.getContainerByTitle(vizName).$$('.g-ytitle0-left')[0];
    }

    async clickOnYAxisLabel(vizName) {
        const item = this.getYAxisLabel(vizName);
        await item.click();
    }

    async selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption }) {
        return this.selectContextMenuOptions({
            elem: this.getYAxisLabel(vizName),
            firstOption,
            secondOption,
            thirdOption,
        });
    }
}
