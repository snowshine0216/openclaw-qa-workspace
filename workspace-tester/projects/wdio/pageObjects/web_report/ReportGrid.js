import WebBaseGrid from '../base/BaseGrid.js';
/**
 * The Grid component used in the Report
 */
export default class ReportGrid extends WebBaseGrid {
    getGrid() {
        return this.$('#table_UniqueReportID');
    }

    getGraph() {
        return this.$('.graphImgContainer');
    }

    getReportGrid() {
        return this.$('#reportViewAllModes');
    }

    findCell(cellText) {
        // solve metric grid cell with $ key word
        const newcellText = this.escapeRegExp(cellText);
        return this.getGrid()
            .$$('td')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === newcellText;
            })[0];
    }

    findMobileAlertEditor() {
        return new AlertEditor('mobileAlertsEditor_MobileAlertsReportEditorStyle');
    }

    findEmailAlertEditor() {
        return new AlertEditor('alertsEditor_AlertsReportEditorStyle');
    }

    // Assertion helper

    async getCellValueByPosition(row, column) {
        return this.locator.$$(`tr[o="${row}"] td`)[column - 1].getText();
    }

    async getHeaderSortIcon(cellText) {
        const el = await this.findCell(cellText);
        return el.$('a img');
    }

    async clickHeaderSortIcon(cellText) {
        const el = await this.getHeaderSortIcon(cellText);
        await this.click({ elem: el });
    }

    async isCellOnGrid(cellText) {
        const el = await this.findCell(cellText);
        return el.isDisplayed();
    }

    async getSortIconTitle(cellText) {
        const el = await this.getHeaderSortIcon(cellText);
        const value = await getTitle(el);
        return value;
    }

    async getGridMode() {
        await browser.waitUntil(async () => {
            const grid = await this.getGrid().isDisplayed();
            const graph = await this.getGraph().isDisplayed();
            return grid || graph;
        },
        {
            timeout: this.defaultWaitTimeout,
            timeoutMsg: 'report grid is not displayed in' + this.defaultWaitTimeout + 'seconds'
        });
        
        const gridMode = await this.getGrid().isDisplayed();
        const graphMode = await this.getGraph().isDisplayed();
        let value = '';
        if (gridMode && !graphMode) {
            value = 'Grid';
        }
        if (!gridMode && graphMode) {
            value = 'Graph';
        }
        if (gridMode && graphMode) {
            value = 'GridGraph';
        }
        return value;
    }
}
