import RsdContextMenu from './RsdContextMenu.js';
import { scrollElementToBottom, scrollElementToTop, scrollElementToNextSlice } from '../../utils/scroll.js';
import BaseComponent from '../base/BaseComponent.js';
import { getRowText } from '../../utils/getAttributeValue.js';

export default class RsdGrid extends BaseComponent {
    constructor(container, locator = '.mstrmojo-Xtab') {
        super(container, locator, 'RSD Grid');
        this.contextMenu = new RsdContextMenu();
    }

    static create(id) {
        const el = new RsdGrid(`div[k="${id}"] div[id*="${id}"]`);
        return el;
    }

    /**
     * Create grid by key, this grid will include the all grid related parts, not only the table
     * @param {String} key the key
     * @returns {RsdGrid} RsdGrid instance
     */
    static createByKey(key) {
        const el = new RsdGrid(`div[k="${key}"] div[id*="${key}"]`);
        return el;
    }

    /**
     * Create by key only, to include all: When document converted from dossier, grid has 2 grid tables
     * @param {String} key the key
     * @returns {RsdGrid} RsdGrid instance
     */
    static createByKeyOnly(key) {
        const el = new RsdGrid(`div[k="${key}"]`);
        return el;
    }

    getRsdGrid() {
        return this.$('.mstrmojo-Xtab-content ');
    }

    createNthGrid(nth) {
        const grids = this.$('body').$$('.mstrmojo-Xtab');
        const gridContainer = grids[nth - 1].$('..');
        const el = new RsdGrid(gridContainer);
        return el;
    }

    getRsdGridByKey(key) {
        const gridContainer = this.$$(`div[k="${key}"] div[id*="${key}"]`).filter((el) => el.isDisplayed())[0];
        const el = new RsdGrid(gridContainer);
        return el;
    }

    getElement() {
        super.initial();
        return this.container ? this.container : this.locator;
    }

    getGridTable() {
        return this.getElement().$$('table[role="grid"]')[0];
    }

    getContextMenuContainer() {
        return this.getElement().$('.mstrmojo-ListBase.mstrmojo-ui-Menu');
    }

    getOptionFromContextMenu(firstOption) {
        return this.$('.mstrmojo-ui-Menu')
            .$$('.item.mstrmojo-ui-Menu-item')
            .filter(async (elem) => {
                const menuName = await elem.getText();
                return menuName === firstOption;
            })[0];
    }

    /**
     * Find the first cell by cell text
     * @param {string} cellText The cell text
     * @returns {ElementFinder} The cell
     */
    findCell(cellText) {
        return this.getElement()
            .$$('td')
            .filter(async (elem) => {
                const menuName = await getRowText(elem);
                return this.escapeRegExp(menuName) === this.escapeRegExp(cellText);
            })[0];
    }

    /**
     * Find all cells by the cell text
     * @param {string} cellText The cell text
     * @returns {ElementArrayFinder} The cells
     */
    findCells(cellText) {
        return this.getElement()
            .$$('td')
            .filter(async (elem) => {
                const menuName = await elem.getText();
                return this.escapeRegExp(menuName) === this.escapeRegExp(cellText);
            });
    }

    findCellFromLocation(row, column) {
        return this.getGridTable().$$(`tbody > tr:nth-child(${row}) > td:nth-child(${column})`)[0];
    }

    findTextAreaButtonFromLocation(row, column) {
        return this.locator
            .$$(`tbody > tr:nth-child(${row}) > td:nth-child(${column})`)[0]
            .$('.mstrmojo-ElasticTextAreaButton-boxNode');
    }

    getWaitOverlay() {
        return this.locator.$('.mstrmojo-Xtab-overlay.wait');
    }

    getGridColumnWidth() {
        return this.getElement().$$('.xrsz');
    }

    /**
     * Click the cell
     * @param {string|WebElement} cell The cell text or the cell element
     * @param {String|WebElement} linkLocator  The element link to be exactly clicked
     */
    async clickCell(cell) {
        const el = typeof cell === 'string' ? this.findCell(cell) : cell;
        await this.waitForElementVisible(el);
        // Try to find the links
        const links = await el.$$('a,span');
        const element = links.length ? links[0] : el;
        // <span> click is not supported on safari, use js to simulate
        await this.clickForSafari(element);
    }

    async rightClickCell(cell) {
        const el = typeof cell === 'string' ? this.findCell(cell) : cell;
        await this.rightClick({ elem: el, offset: { x: 0, y: 0 } });
    }

    async clickCellFromLocation(row, column) {
        await this.waitForElementVisible(this.getGridTable());
        const cell = this.findCellFromLocation(row, column);
        await this.waitForElementVisible(cell);
        const link = cell.$$('a,span')[0];
        await this.click({ elem: link });
    }

    async scrollInGridToBottom() {
        await scrollElementToBottom(this.getElement());
    }

    async scrollInGridToTop() {
        await this.waitForElementVisible(this.getElement());
        await scrollElementToTop(this.getElement());
    }

    async scrollGridCellIntoView(cell) {
        let flag = await this.isGridCellPresent(cell);
        let count = 1;
        while (!flag) {
            await scrollElementToNextSlice(this.getElement(), count);
            flag = await this.isGridCellPresent(cell);
            count++;
            await this.sleep(500);
        }
        return this.sleep(1000);
    }

    async selectGridContextMenuOption(cell, optionText) {
        const el = typeof cell === 'string' ? this.findCell(cell) : cell;
        await this.rightClick({ elem: el, offset: { x: 0, y: 0 } });
        await this.waitForElementVisible(this.getOptionFromContextMenu(optionText), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Opening context menu takes too long.',
        });
        const option = this.getOptionFromContextMenu(optionText);
        await option.click();
    }

    async selectGridContextMenuOptionByOffset({ cell, optionText, x = 0, y = 0, checkClickable = true }) {
        const el = typeof cell === 'string' ? this.findCell(cell) : cell;
        // await this.rightClick({ elem: el, offset: { x: 0, y: 0 }, checkClickable: isCheckClickable });
        await this.rightClickByXYPosition({ elem: el, x, y, checkClickable });
        await this.waitForElementVisible(this.getOptionFromContextMenu(optionText), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Opening context menu takes too long.',
        });
        const option = this.getOptionFromContextMenu(optionText);
        await option.click();
    }

    async selectContextMenuOnCell(cell, menuPaths) {
        const el = typeof cell === 'string' ? await this.findCell(cell) : cell;
        await this.rightClick({ elem: el, offset: { x: 0, y: 0 } });
        await this.contextMenu.select(menuPaths);
    }

    async selectContextMenuOnCells(cells, menuPaths) {
        let lastCellElement = null;
        for (const cell of cells) {
            const el = typeof cell === 'string' ? await this.findCell(cell) : cell;
            await this.ctrlClick({ elem: el, offset: { x: 0, y: 0 } });
            lastCellElement = el;
        }

        await this.rightClick({ elem: lastCellElement, offset: { x: 0, y: 0 } });
        await this.contextMenu.select(menuPaths);
    }

    async dragGridColumnWidth(index, toOffsetParam) {
        const el = this.getGridColumnWidth()[index - 1];
        await this.dragAndDrop({
            fromElem: el,
            toElem: this.locator,
            toOffset: toOffsetParam,
        });
    }

    async getData(opts = {}) {
        const { rowOffset = 0 } = opts;

        function getCellValue(cell) {
            return cell.getText().then((text) => text.trim());
        }

        function getRowData(row) {
            return row.$$('td').map(getCellValue);
        }

        return this.$$(`tbody > tr:nth-child(n+${rowOffset + 1})`).map(getRowData);
    }

    getOneRowInGrid(row) {
        return this.getElement().$(`tbody > tr:nth-child(${row})`);
    }

    async getOneRowData(row) {
        await this.waitForElementVisible(this.getElement());
        await this.waitForElementVisible(this.getOneRowInGrid(row));
        const rowCells = this.getOneRowInGrid(row).$$('td');
        const text = await rowCells.map((cell) => cell.getText());
        const rowText = await text.map((cell) => {
            const trimText = cell.trim();
            return trimText;
        });
        return rowText;
    }

    /**
     * Drag lines next to a column to adjust column width
     *
     * @param {Number} index the nth column line, start from 1
     * @param {Number} toOffset the left offset compared to the column line
     */
    async adjustColumnWidth(index, toOffset) {
        const vline = this.getGridColumnWidth()[index - 1];
        // Move to the clumn line, shift a little bit
        await this.moveToElement(vline, { x: 0, y: 5 });
        await browser.action('pointer').down({ button: 0 }).perform();
        // await browser.actions().mouseMove(vline, { x: 0, y: 5 }).perform();
        // await browser.actions().mouseDown().perform();
        // This is a hack solution to handle the drag by trigger mouseMove(*) 3 times
        // There is a fucntion: onMoveDuringCheck(*) in dnd.js which will intercept mouseMove event
        // and the movement is calculated as var c = ++$DND.ctxt.moveCount, and the minmum value to trigger drag is 3
        // so we have to manully trigger mouseMove event 3 times to trigger the drag, and related adjustment can really applied
        const offset = Math.round(toOffset / 3);
        await browser
            .action('pointer')
            .move({ duration: 0, x: offset, y: 0 })
            .move({ duration: 0, x: offset, y: 0 })
            .move({ duration: 0, x: offset, y: 0 })
            .up({ button: 0 })
            .perform();
        await this.waitForCurtainDisappear();
    }

    async getTableWidth() {
        const table = await this.getElement().$('tbody');
        const width = await table.getSize('width');
        return width;
    }

    async IsMenuPresentOnContextMenu(cell, menuPaths) {
        const el = typeof cell === 'string' ? await this.findCell(cell) : cell;

        await this.rightClick({ elem: el, offset: { x: 0, y: 0 } });
        return this.contextMenu.isMenuPathPresent(menuPaths);
    }

    async isCellClickable(cell, index = 1) {
        const el = typeof cell === 'string' ? await this.findCells(cell)[index - 1] : cell;
        //hover on the element to show the title attribute
        await this.hover({ elem: el });
        const attr = await el.getAttribute('title');
        if (attr === '' || attr === null) {
            return false;
        }
        return true;
    }

    async selectCellInOneRow(row, startColumn, endColumn) {
        return this.getOneRowData(row).then((text) => text.slice(startColumn - 1, endColumn));
    }

    async waitForGridLoaded() {
        return this.waitForElementVisible(this.getOneRowInGrid(1));
    }

    async isGridCellPresent(cell) {
        const el = this.findCell(cell);
        return el.isDisplayed();
    }

    async waitForLoaddingDisappear() {
        await this.waitForElementInvisible(this.getWaitOverlay());
    }

    async isCellDisplayed(name) {
        await this.waitForGridLoaded();
        const el = this.findCell(name);
        try {
            await this.waitForElementVisible(el);
            return true;
        } catch {
            return false;
        }
    }

    async getFirstGridCell() {
        return this.getGridCellInRow(2, 1);
    }

    async getFirstGridCellInRow(row) {
        return this.getGridCellInRow(row, 1);
    }

    async getGridRows() {
        await this.waitForElementVisible(this.getElement());
        return this.getElement().$$('tbody > tr');
    }

    async getTotalRows() {
        const rows = await this.getGridRows();
        return rows.length;
    }

    async getGridCellInRow(row, column) {
        await this.waitForElementVisible(this.getElement());
        return this.findCellFromLocation(row, column).getText();
    }

    async isGridCellInRowPresent(row, column) {
        await this.waitForElementVisible(this.getElement());
        const el = this.findCellFromLocation(row, column);
        return el.isDisplayed();
    }

    async isGridPresnt() {
        return this.getGridTable().isDisplayed();
    }
}
