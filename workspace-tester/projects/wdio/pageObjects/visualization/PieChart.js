import { getRowText } from '../../utils/getAttributeValue.js';
import BaseVisualization from '../base/BaseVisualization.js';
import Legend from '../common/Legend.js';

export default class PieChart extends BaseVisualization {
    constructor() {
        super();
        this.legend = new Legend();
    }

    //Element locator

    getPieChartNode(title) {
        return this.getContainerByTitle(title).$$('.gm-chart')[0];
    }

    getSlicePath(title, index) {
        return this.getPieChartNode(title).$$('path')[index];
    }

    getSliceText(title) {
        return this.getPieChartNode(title).$$('text');
    }

    getSliceByName(title, slice) {
        return this.getSliceText(title).filter(async (elem) => {
            let name = await elem.$('tspan').getText();
            if (browsers.params.browser && browsers.params.browser.browserName == 'msedge') {
                name = await getRowText(elem);
            }
            return name === slice;
        });
    }

    async getIndexByName(title, slice) {
        let sliceIndex = 0;
        await this.getPieChartNode(title)
            .$$('tspan')
            .forEach(async (elem, index) => {
                let sliceName = await elem.getText();
                if (browsers.params.browser && browsers.params.browser.browserName == 'msedge') {
                    sliceName = await getRowText(elem);
                }
                if (sliceName === slice) {
                    sliceIndex = index;
                }
            });
        return sliceIndex;
    }

    //Action helper

    async sliceLabel({ title, index }) {
        return this.getSliceText(title)[index].$('tspan').getText();
    }

    async hoverOnSlice({ title, slice }) {
        let index = await this.getIndexByName(title, slice);
        await this.hover({
            elem: this.getSlicePath(title, index),
        });
        await this.waitForElementVisible(this.getVizTooltipContainer(), {
            timeout: 3000,
            msg: 'Tooltip is not displayed after hovering the pie slice.',
        });
    }

    async keepOnly({ title, slice }) {
        let index = await this.getIndexByName(title, slice);
        return this.selectContextMenuOptions({
            elem: this.getSlicePath(title, index),
            firstOption: 'Keep Only',
        });
    }

    async exclude({ title, slice }) {
        let index = await this.getIndexByName(title, slice);
        return this.selectContextMenuOptions({
            elem: this.getSlicePath(title, index),
            firstOption: 'Exclude',
        });
    }

    async drillTo({ title, slice, drillTarget, singleSelection }) {
        let index = await this.getIndexByName(title, slice);
        if (singleSelection) {
            return this.selectContextMenuOptions({
                elem: this.getSlicePath(title, index),
                firstOption: `Drill to ${drillTarget}`,
            });
        } else {
            return this.selectContextMenuOptions({
                elem: this.getSlicePath(title, index),
                firstOption: 'Drill',
                secondOption: drillTarget,
            });
        }
    }

    async openPieChartElmContextMenu({ title, slice }) {
        let index = await this.getIndexByName(title, slice);
        const elem = await this.getSlicePath(title, index);
        return this.openContextMenu({ elem });
    }

    async linkToTargetByPiechartContextMenu({ title, slice }) {
        await this.waitForCurtainDisappear();
        let index = await this.getIndexByName(title, slice);
        const linkText = 'Go to';
        return this.selectContextMenuOptions({
            elem: this.getSlicePath(title, index),
            firstOption: linkText,
        });
    }

    async setDataLabels({ title, index, option }) {
        return this.selectContextMenuOptions({
            elem: this.getSlicePath(title, index),
            firstOption: 'Data Labels',
            secondOption: option,
        });
    }

    async expandLegend(title) {
        await this.waitForElementVisible(this.getContainerByTitle(title));
        return this.legend.expandLegendBox(this.getContainerByTitle(title));
    }

    async collapseLegend(title) {
        return this.legend.collapseLegendBox(this.getContainerByTitle(title));
    }

    async hideLegend(title) {
        return this.legend.hideLegendBox(this.getContainerByTitle(title));
    }

    async showLegend(title) {
        return this.selectContextMenuOptions({
            elem: this.getTitleBox(title),
            offset: { x: 50, y: 50 },
            firstOption: 'Show Legend',
        });
    }

    // Assertion helper

    async sliceCount(title) {
        return this.getPieChartNode(title).$$('path, circle').length;
    }

    async legendCount(title) {
        return this.legend.getLegends(this.getContainerByTitle(title)).length;
    }

    async legendData({ title, index }) {
        return this.legend.getLegends(this.getContainerByTitle(title))[index].getText();
    }

    async isLegendMinimized(title) {
        return this.legend.isLegendMinimized(this.getContainerByTitle(title));
    }

    async isLegendPresent(title) {
        return this.legend.isLegendPresent(this.getContainerByTitle(title));
    }

    async isSlicePresent({ title, label }) {
        return (await this.getSliceByName(title, label)).length > 0;
    }

    async isDataLabelDisplayed({ title, label }) {
        return this.isSlicePresent({ title, label });
    }
}
