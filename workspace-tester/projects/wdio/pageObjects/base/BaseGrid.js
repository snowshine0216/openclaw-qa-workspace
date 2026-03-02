import BasePage from './BasePage.js';
import RsdGridContextMenu from '../web_report/ReportGridContextMenu.js';

/**
 * The base grid component used by the report grid and rsd grid.
 */
export default class BaseGrid extends BasePage {
    constructor(locator) {
        super(locator);
        this.contextMenu = new RsdGridContextMenu();
    }

    getGrid() {
        return this.$('#table_UniqueReportID');
    }

    /**
     * Find the first cell by cell text
     * @param {string} cellText The cell text
     * @returns {ElementFinder} The cell
     */
    findCell(cellText) {
        // solve metric grid cell with $ key word
        const newcellText = this.escapeRegExp(cellText);
        const text = new RegExp(`^${newcellText}$`);
        return this.getGrid()
            .$$('td')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    /**
     * Find all cells by the cell text
     * @param {string} cellText The cell text
     * @returns {ElementArrayFinder} The cells
     */
    findCells(cellText) {
        // solve metric grid cell with $ key word
        const newcellText = this.escapeRegExp(cellText);
        return this.locator.all(by.cssContainingText('td', new RegExp(`^${newcellText}$`)));
    }

    findCellFromLocation(row, column) {
        return this.locator.$$(`tbody > tr:nth-child(${row}) > td:nth-child(${column})`)[0];
    }

    findTextAreaButtonFromLocation(row, column) {
        return this.locator
            .$$(`tbody > tr:nth-child(${row}) > td:nth-child(${column})`)[0]
            .$('.mstrmojo-ElasticTextAreaButton-boxNode');
    }

    /**
     * Click the cell
     * @param {string|WebElement} cell The cell text or the cell element
     * @param {String|WebElement} linkLocator  The element link to be exactly clicked
     */
    async clickCell(cell, index = 1) {
        const el = typeof cell === 'string' ? await this.findCells(cell)[index - 1] : cell;

        // wait the render process in browser client, which won't be influenced by network
        await this.sleep(500);

        // Try to find the links
        const links = await el.$$('a,span');
        if (links.length) {
            await this.clickCellLink(links[0]);
        } else {
            await this.click({ elem: el });
        }
    }

    async clickCellFromLocation(row, column) {
        const cell = this.findCellFromLocation(row, column);
        const link = cell.$$('a,span')[0];
        await this.click({ elem: link });
    }

    async clickCellLink(link) {
        const tagName = await this.getElement().getTagName();
        // Try to auto scroll the link to visible area if the element is div
        if (tagName === 'div') {
            const offsetTop = await browser.driver.executeScript(
                'return arguments[0].offsetTop + arguments[0].offsetParent.offsetTop',
                link.getWebElement()
            );
            const { height: gridHeight } = await this.getElement().getSize();
            const scrollValue = Math.max(0, offsetTop - gridHeight / 2);
            await scrollElement(this.getElement(), scrollValue);
        }
        await this.click({ elem: link });
    }

    /**
     * Open context menu on cell and select the specified menu items.
     * @param {string|WebElement} cell The cell text or the cell element
     * @param {string[]} menuPaths The context menu items
     */
    async selectContextMenuOnCell(cell, menuPaths) {
        const el = typeof cell === 'string' ? await this.findCell(cell) : cell;

        await this.rightClick({ elem: el, checkClickable: false });
        await this.contextMenu.select(menuPaths);
    }

    async selectContextMenuOnCells(cells, menuPaths) {
        let lastCellElement = null;
        for (const cell of cells) {
            const el = typeof cell === 'string' ? await this.findCell(cell) : cell;
            await this.ctrlClick({ elem: el });
            lastCellElement = el;
        }

        await this.rightClick({ elem: lastCellElement });
        await this.contextMenu.select(menuPaths);
    }

    async getTableWidth() {
        const tableSize = await this.getElement().$('tbody').getSize();
        return tableSize.width;
    }

    async getColumnWidth(cellContent) {
        const columnSize = await this.findCell(cellContent).getSize();
        return columnSize.width;
    }

    getData(opts = {}) {
        const { rowOffset = 0 } = opts;

        function getCellValue(cell) {
            return cell.getText().then((text) => text.trim());
        }

        function getRowData(row) {
            return row.$$('td').map(getCellValue);
        }

        return this.getGrid()
            .$$(`tbody > tr:nth-child(n+${rowOffset + 1})`)
            .map(getRowData);
    }

    async getCellData(row, column) {
        const cell = this.findCellFromLocation(row, column);
        const text = await cell.getText();
        return text.trim();
    }

    getOneRowInGrid(row) {
        return this.getGrid().$(`tbody > tr:nth-child(${row})`);
    }

    async getOneRowData(row) {
        // await this.waitForElementVisible(this.locator);
        await this.waitForElementVisible(this.getOneRowInGrid(row));
        const rowCells = this.getOneRowInGrid(row).$$('td');
        const text = await rowCells.map((cell) => cell.getText());
        const rowText = await text.map((cell) => cell.trim());
        return rowText;
    }

    async getOneRowDataFromBottom(row) {
        const rowCells = this.getElement().$(`tbody > tr:nth-last-child(${row})`).$$('td');
        const text = await rowCells.map((cell) => cell.getText());
        const rowText = await text.map((cell) => cell.trim());
        return rowText;
    }

    getCellImg(row, column) {
        return this.findCellFromLocation(row, column).$('img');
    }

    async getCellCssValue(row, column, cssName) {
        const el = this.findCellFromLocation(row, column);
        const attributeText = await el.getCSSProperty(cssName);
        return attributeText;
    }

    async openContextMenu(cell) {
        const el = typeof cell === 'string' ? await this.findCell(cell) : cell;
        await this.rightClick({ elem: el });
    }

    async IsMenuPresentOnContextMenu(cell, menuPaths) {
        const el = typeof cell === 'string' ? await this.findCell(cell) : cell;

        await this.rightClick({ elem: el });
        return this.contextMenu.isMenuPathPresent(menuPaths);
    }

    async waitForGridLoaded() {
        return this.waitForElementVisible(this.getOneRowInGrid(1));
    }

    async getRowCount() {
        return this.locator.all(by.css('tr')).length;
    }

    async isCellClickable(cell, index = 1) {
        const el = typeof cell === 'string' ? await this.findCells(cell)[index - 1] : cell;
        const exist = await el.$('a').isDisplayed();
        return exist;
    }

    async isCellDisplayed(name) {
        await this.waitForGridLoaded();
        return this.findCell(name).isDisplayed();
    }
}
