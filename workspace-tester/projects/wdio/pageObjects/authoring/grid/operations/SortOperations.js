import LoadingDialog from '../../../dossierEditor/components/LoadingDialog.js';
import ColumnSetOperations from './ColumnSetOperations.js';
import BaseContainer from '../../BaseContainer.js';
import EditorPanelForGrid from '../../EditorPanelForGrid.js';
import ContextMenuOperations from './ContextMenuOperations.js';
import Common from '../../Common.js';

/**
 * Sorting operations for grid
 */
export default class SortOperations extends BaseContainer {
    constructor(selectors) {
        super();
        this.selectors = selectors;
        this.loadingDialog = new LoadingDialog();
        this.columnSetOperations = new ColumnSetOperations(selectors);
        this.editorPanelForGrid = new EditorPanelForGrid(selectors);
        this.contextMenuOperations = new ContextMenuOperations(selectors);
        this.common = new Common();
    }

    // Sort editor selectors
    getSortRowByOrder(order) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${order}]//button[contains(@class,'mstr-advanced-sort-order')]`
        );
    }

    getMetricSortIcon(order) {
        // order should be desc or asc or clr
        return this.$(`.mstrmojo-ui-Menu-item-container .item.xt.btn.${order}.mstrmojo-ui-Menu-item .micn`);
    }

    getMetricSortDescendingIcon() {
        return this.getMetricSortIcon('desc');
    }

    getMetricSortAscendingIcon() {
        return this.getMetricSortIcon('asc');
    }

    getSortEditorSwitchButton(buttonName) {
        return this.$(`//div[contains(@class,'mstr-toggle-group')]//button[text()='${buttonName}']`);
    }

    getSortObjectPulldown(columnOrder) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${columnOrder}]//div[contains(@class,'mstr-advanced-sort-orderSelect')]`
        );
    }

    getSortOrderPulldown(columnOrder) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${columnOrder}]//div[contains(@class,'mstr-advanced-sort-sortSelect')]`
        );
    }

    getSortObjectPopList(objectName) {
        return this.$(
            `//div[contains(@class,'mstr-advanced-sort-orderSelect-dropdown__dropdown-list')]//span[text()='${objectName}']`
        );
    }

    getSortDeleteRowButton(columnOrder) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${columnOrder}]//button[contains(@class,'mstr-advanced-sort-delete')]`
        );
    }

    getSortOrderPopList(sortOrder) {
        const sortOrderName = sortOrder.toLowerCase() === 'descending' ? 'Descending' : 'Ascending';

        return this.$(
            `//div[contains(@class,'mstr-advanced-sort-sortSelect-dropdown__dropdown-list')]//span[text()='${sortOrderName}']`
        );
    }

    getSortEditorButton(buttonName) {
        return this.$(`//div[contains(@class,'mstr-advanced-sort-actions')]//button[text()='${buttonName}']`);
    }

    getAdvancedSortEditorScrollBar(orientation) {
        orientation = orientation.toLowerCase();
        return this.$(
            `//div[contains(@class,'mstrmojo-AdvancedSortEditor-RulesPanel mstrmojo-scrollNode')]/following-sibling::div[contains(@class,'scrolltrack')]/div[@class = 'mstrmojo-scrollbar ${orientation}']`
        );
    }

    getAdvancedSortEditorRulesPanel() {
        return this.$(
            `//ul[contains(@class,'mstr-advanced-sort-rulesPanel')]`
        );
    }

    /** Get sort rule object pulldown, depending if it is enabled/disabled
     * @param {string} columnOrder the order of the sort criteria in the advanced sort editor
     * @param {Boolean} isEnabled true if element is enabled
     */
    getSortRuleObjectPulldown(columnOrder, isEnabled) {
        if (isEnabled) {
            return this.getSortObjectPulldown(columnOrder).$(`./parent::div[not(contains(@class, 'disabled'))]`);
        } else {
            return this.getSortObjectPulldown(columnOrder).$(`./parent::div[contains(@class, 'disabled')]`);
        }
    }

    /**
     * Sort ascending
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async sortAscending(objectName, visualizationName) {
        await this.contextMenuOperations.selectContextMenuOptionFromHeader({
            objectName,
            option: 'Sort Ascending',
            visualizationName,
        });
    }

    /**
     * Sort descending
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {boolean} waitForLoadingDialog - Whether to wait for loading dialog
     */
    async sortDescending({ objectName, visualizationName = 'Visualization 1' }) {
        await this.contextMenuOperations.selectContextMenuOptionFromHeader({
            objectName,
            option: 'Sort Descending',
            visualizationName,
        });
    }

    async sortMetric({ order }) {
        await this.selectors.click({ elem: this.getMetricSortIcon(order) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async sortMetricFromDropZone({ objectName, order }) {
        let obj = await this.editorPanelForGrid.getObjectWithoutType(objectName);
        await this.selectors.rightClick({ elem: obj });
        await this.selectors.click({ elem: this.getMetricSortIcon(order) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Metric sort from visualization
     */
    async metricSortFromViz({ objectName, visualizationName, order }) {
        let objectElement = await this.selectors.getGridObject(objectName, visualizationName);
        try {
            await this.selectors.rightClickWithJavaScript(objectElement);
        } catch (error) {
            await this.selectors.rightClick({ elem: objectElement, checkClickable: false });
        }
        await this.selectors.click({ elem: this.getMetricSortIcon(order) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Open advanced sort editor from grid
     * @param {string} objectName - name of object to open the advanced sort editor from
     * @param {string} visualizationName - Name of the visualization
     */
    async openAdvancedSortEditor({ objectName, visualizationName = 'Visualization 1' }) {
        let objectElement = await this.selectors.getObjectHeader(objectName, visualizationName);
        await this.selectors.clickByForce({ elem: objectElement });
        await this.selectors.rightClick({ elem: objectElement, checkClickable: false });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Advanced Sort ...') });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
        await this.selectors.waitForElementVisible(this.selectors.advancedSortWindow);
    }

    /**
     * Open custom sort editor from grid
     * @param {string} objectName - name of object to open the custom sort editor from
     * @param {string} visualizationName - Name of the visualization
     */
    async openCustomSortEditor(objectName, visualizationName) {
        let objectElement = await this.selectors.getObjectHeader(objectName, visualizationName);
        await this.selectors.rightClick({ elem: objectElement });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Custom Sort...') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Add parameter to advanced sort editor
     */
    async addAdvancedSortParameter({ columnOrder, objectName, sortOrder }) {
        // select sort by
        await this.selectors.click({ elem: this.getSortObjectPulldown(columnOrder) });
        await this.selectors.click({ elem: this.getSortObjectPopList(objectName) });

        // select sort order

        await this.selectors.click({ elem: this.getSortOrderPulldown(columnOrder) });
        await this.selectors.click({ elem: this.getSortOrderPopList(sortOrder) });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    /**
     * Save and close sort editor
     */
    async saveAndCloseSortEditor() {
        await this.selectors.click({ elem: this.getSortEditorButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Close sort editor without saving
     */
    async closeSortEditor() {
        await this.selectors.click({ elem: this.getSortEditorButton('Cancel') });
    }
    /**
     * Switch sort rows position in the Advanced Sort Editor
     * @param {string} srcSortRow
     * @param {string} desPosition "above" or "below"
     * @param {string} desSortRow
     */
    async dragSortRowWithPositionInAdvancedSortEditor({ srcSortRow, desPosition, desSortRow }) {
        let srcElement = await this.getSortRowByOrder(srcSortRow);
        await this.selectors.waitForElementVisible(srcElement);
        let desElement = await this.getSortRowByOrder(desSortRow);
        await this.selectors.waitForElementVisible(desElement);
        await this.columnSetOperations.moveToSpecificLocationAndWait(desPosition, srcElement, desElement);
    }

    /**
     * Switch between rows and columns in sort editor
     */
    async switchRowColumnInSortEditor(buttonName) {
        await this.selectors.click({ elem: this.getSortEditorSwitchButton(buttonName) });
    }

    /**
     * Click delete row button in sort editor
     */
    async clickSortDeleteRowButton(columnOrder) {
        let el = this.selectors.getSortDeleteRowButton(columnOrder);
        await this.selectors.click({ elem: el });
    }

    async createAndSaveAdvancedSort({ rowOrders, columnOrders, dragSortActions }) {
        if (rowOrders) {
            await this.switchRowColumnInSortEditor('Rows');
            for (const rowOrder of rowOrders) {
                await this.addAdvancedSortParameter({
                    columnOrder: rowOrder.columnOrder,
                    objectName: rowOrder.objectName,
                    sortOrder: rowOrder.sortOrder,
                });
            }
        }
        if (columnOrders) {
            await this.switchRowColumnInSortEditor('Columns');
            for (const columnOrder of columnOrders) {
                await this.addAdvancedSortParameter({
                    columnOrder: columnOrder.columnOrder,
                    objectName: columnOrder.objectName,
                    sortOrder: columnOrder.sortOrder,
                });
            }
        }
        if (dragSortActions) {
            for (const dragSortAction of dragSortActions) {
                await this.dragSortRowWithPositionInAdvancedSortEditor({
                    srcSortRow: dragSortAction.srcSortRow,
                    desPosition: dragSortAction.desPosition,
                    desSortRow: dragSortAction.desSortRow,
                });
            }
        }
        await this.saveAndCloseSortEditor();
    }
    async sortDescendingFromDropZone(objectName) {
        await this.sortMetricFromDropZone({ objectName, order: 'desc' });
    }
    async sortAscendingFromDropZone(objectName) {
        await this.sortMetricFromDropZone({ objectName, order: 'asc' });
    }

    async clearSortFromDropZone(objectName) {
        await this.sortMetricFromDropZone({ objectName, order: 'clr' });
    }

    async clearSortFromViz({ objectName, visualizationName }) {
        await this.metricSortFromViz({ objectName, visualizationName, order: 'clr' });
    }

    async sortAscendingFromViz({ objectName, visualizationName }) {
        await this.metricSortFromViz({ objectName, visualizationName, order: 'asc' });
    }

    async sortDescendingFromViz({ objectName, visualizationName }) {
        await this.metricSortFromViz({ objectName, visualizationName, order: 'desc' });
    }

    async sortWithinAttributeFromDropZone({ objectName, sortAttr }) {
        let obj = await this.editorPanelForGrid.getObjectWithoutType(objectName);
        await this.selectors.rightClick({ elem: obj });
        await this.selectors.click({ elem: this.common.getContextMenuItem('Sort Within an Attribute') });
        await this.selectors.click({ elem: this.common.getContextMenuItem(sortAttr) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
