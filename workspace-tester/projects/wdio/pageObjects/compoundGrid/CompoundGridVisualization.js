import BasePage from '../base/BasePage.js';

export default class CompoundGridVisualization extends BasePage {
    get rowCount() {
        return this._rowCount;
    }

    get colCount() {
        return this._colCount;
    }

    get csPos() {
        return this._csLen;
    }

    get columnSetIndex() {
        return this._csIdx;
    }

    set columnSetIndex(value) {
        this._csIdx = value;
    }

    getGridRoot(visualizationName) {
        return this.$(
            `//div[text()='${visualizationName}']/ancestor::div[contains(@class, 'mstrmojo-UnitContainer-ContentBox')]//table[@role='grid']`
        );
    }

    getGridCellByPosition(row, column, visualizationName) {
        return this.getGridRoot(visualizationName).$$(`//tbody//tr[${row}]//td[${column}]`)[0];
    }

    get gridRoot() {
        return this.$("//table[@role='grid']/parent::div/parent::div[contains(@style, 'z-index: 1')]//table");
    }

    getCellByPosition(row = 0, column = 0) {
        return this.gridRoot.$(`./tbody/tr[${row}]/td[${column}]`);
    }

    get titleCell() {
        return this.getTitleCellByPosition();
    }

    getTitleCellByPosition(row = 1, column = 1) {
        return this.getCellByPosition(row, column);
    }
    
    async getGridCellTextByPosition(row, col, visualizationName) {
        const el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.waitForElementVisible(el);
        let text = await el.getText();
        return text;
    }

    get columnHeaderCell() {
        return this.getColumnHeaderCellByPosition();
    }

    getColumnHeaderCellByPosition(row = 1, column = 1) {
        return this.getCellByPosition(row, column + this.csPos[this.columnSetIndex]);
    }

    get rowHeaderCell() {
        return this.getRowHeaderCellByPosition();
    }

    getRowHeaderCellByPosition(row = 1, column = 1) {
        return this.getCellByPosition(row + this.colCount, column);
    }

    get valueCell() {
        return this.getValueCellByPosition();
    }

    getValueCellByPosition(row = 1, column = 1) {
        return this.getCellByPosition(row + this.colCount, column + this.csPos[this.columnSetIndex]);
    }

    initializeRowAndColumnCount(rowCount, colCount) {
        this._rowCount = parseInt(rowCount, 10);
        this._colCount = parseInt(colCount, 10);
        this.columnSetIndex = 0;
    }

    initializeColumnSets(colSetLenArr) {
        colSetLenArr.unshift(0);
        this._csLen = colSetLenArr.map((numCols) => this.rowCount + numCols);
    }
}
