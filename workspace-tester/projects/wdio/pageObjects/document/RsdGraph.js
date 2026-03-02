import BaseComponent from '../base/BaseComponent.js';
import RsdContextMenu from './RsdContextMenu.js';

export default class RsdGraph extends BaseComponent {
    constructor(_cssSelector = null) {
        super(null, _cssSelector);
        this.contextMenu = new RsdContextMenu();
        this._cssSelector = _cssSelector;
    }

    getGraph(index) {
        return this.$$('.mstrmojo-DocXtabGraph')[index - 1];
    }

    getGraphCells(index) {
        return this.getGraph(index).$$(`area[shape="rect"]`);
    }

    createGraphByIdContains(idContains) {
        const cssSelector = `div.mstrmojo-DocXtabGraph[id*="${idContains}"]`;
        const graph = new RsdGraph(cssSelector);
        graph._cssSelector = cssSelector;
        return graph;
    }

    findGraphByIdContains(idContains) {
        return this.createGraphByIdContains(idContains);
    }

    getRectArea() {
        return this.$(this._cssSelector).$$(`area[shape="rect"]`);
    }

    getGraphLoadingIndicator() {
        return this.$(`.mstrmojo-DocXtabGraph img.mstrmojo-DocXtabGraph[src*=gif]`);
    }

    /**
     * Click the rect shape area in graph
     * @param {array} item the input category of rect shape area
     * @param {string} category to search rect shape area
     */
    async selectContextMenuOnRectArea(item, menuPaths) {
        const category = item.join(' ');
        const rectArea = await this.getRectArea();

        for (const [, el] of rectArea.entries()) {
            if ((await el.getAttribute('ttl')).includes(category)) {
                const coordsAttr = await el.getAttribute('coords');
                let [, , bottomRightX, bottomRightY] = coordsAttr.split(',');
                bottomRightX = parseInt(bottomRightX, 10);
                bottomRightY = parseInt(bottomRightY, 10);
                const size = await this.$(this._cssSelector).getSize();
                const height = Math.round(size.height / 2);
                const width = Math.round(size.width / 2);
                await this.rightClick({
                    elem: this.$(this._cssSelector),
                    offset: { x: -width + bottomRightX - 1, y: -height + bottomRightY - 1 },
                });
                await this.contextMenu.select(menuPaths);
                break;
            }
        }
        return this.waitForCurtainDisappear();
    }

    async rightClickOnRectArea(item) {
        const category = item.join(' ');
        const rectArea = await this.getRectArea();

        for (const [, el] of rectArea.entries()) {
            if ((await el.getAttribute('ttl')).includes(category)) {
                const coordsAttr = await el.getAttribute('coords');
                let [, , bottomRightX, bottomRightY] = coordsAttr.split(',');
                bottomRightX = parseInt(bottomRightX, 10);
                bottomRightY = parseInt(bottomRightY, 10);
                const size = await this.$(this._cssSelector).getSize();
                const height = Math.round(size.height / 2);
                const width = Math.round(size.width / 2);
                await this.rightClick({
                    elem: this.$(this._cssSelector),
                    offset: { x: -width + bottomRightX - 1, y: -height + bottomRightY - 1 },
                });
                return this.waitForItemLoading();
            }
        }
    }

    async clickGraphCell(graphIndex, cellText) {
        const targets = await this.getGraphCells(graphIndex);
        for (const [, el] of targets.entries()) {
            if ((await el.getAttribute('ttl')).includes(cellText)) {
                await this.click({ elem: el });
                break;
            }
        }
        await this.waitForItemLoading();
        return this.waitForCurtainDisappear();
    }

    async clickOnRectArea(item) {
        const category = item.join(' ');
        const rectArea = await this.getRectArea();

        for (const [, el] of rectArea.entries()) {
            if ((await el.getAttribute('ttl')).includes(category)) {
                const coordsAttr = await el.getAttribute('coords');
                let [, , bottomRightX, bottomRightY] = coordsAttr.split(',');
                bottomRightX = parseInt(bottomRightX, 10);
                bottomRightY = parseInt(bottomRightY, 10);
                const size = await this.$(this._cssSelector).getSize();
                const height = Math.round(size.height / 2);
                const width = Math.round(size.width / 2);
                await this.click({
                    elem: this.$(this._cssSelector),
                    offset: { x: -width + bottomRightX - 1, y: -height + bottomRightY - 1 },
                });
                return this.waitForItemLoading();
            }
        }
    }

    async waitForGraphLoading() {
        await this.waitForElementStaleness(this.getGraphLoadingIndicator());
    }

    async getTooltipOnRectArea(item) {
        const category = item.join(' ');
        const rectArea = await this.getRectArea();

        for (const [, el] of rectArea.entries()) {
            if ((await el.getAttribute('ttl')).includes(category)) {
                const attr = await el.getAttribute('ttl');
                return attr;
            }
        }
    }

    async IsMenuPresentOnContextMenu(item, menuPaths) {
        const category = item.join(' ');
        const rectArea = await this.getRectArea();

        for (const [, el] of rectArea.entries()) {
            if ((await el.getAttribute('ttl')).includes(category)) {
                const coordsAttr = await el.getAttribute('coords');
                let [, , bottomRightX, bottomRightY] = coordsAttr.split(',');
                bottomRightX = parseInt(bottomRightX, 10);
                bottomRightY = parseInt(bottomRightY, 10);
                const size = await this.$(this._cssSelector).getSize();
                const height = Math.round(size.height / 2);
                const width = Math.round(size.width / 2);
                await this.rightClick({
                    elem: this.$(this._cssSelector),
                    offset: { x: -width + bottomRightX - 1, y: -height + bottomRightY - 1 },
                });
                return this.contextMenu.isMenuPathPresent(menuPaths);
            }
        }
    }

    async isRsdGraphPresent() {
        return this.getGraph(1).isDisplayed();
    }
}
