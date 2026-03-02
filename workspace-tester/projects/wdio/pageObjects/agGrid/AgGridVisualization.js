import BaseContainer from '../authoring/BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import MicrochartConfigDialog from './MicrochartConfigDialog.js';
import VizPanelForGrid from '../authoring/VizPanelForGrid.js';
import DatasetPanel from '../authoring/DatasetPanel.js';
import DatasetsPanel from '../dossierEditor/DatasetsPanel.js';
import ReportGridView from '../report/reportEditor/ReportGridView.js';
import Common from '../authoring/Common.js';
import DossierPage from '../dossier/DossierPage.js';
import {
    scrollIntoView,
    scrollElement,
    scrollHorizontally,
    scrollElementToBottom,
    scrollElementToMiddle,
    scrollElementToNextSlice,
    scrollHorizontallyToNextSlice,
} from '../../utils/scroll.js';
import BaseVisualization from '../base/BaseVisualization.js';

const visualizationContextMenuItem = {
    SHOW_TOTALS: 'Show Totals',
    SHOW_DATA: 'Show Data',
    REMOVE_DATA: 'Remove Data',
    DATA_SOURCE: 'Data Source',
    ADVANCED_SORT: 'Advanced Sort ...',
    CUSTOM_SORT: 'Custom Sort...',
    THRESHOLDS: 'Thresholds...',
    CREATE_CONTEXTUAL_LINK: 'Create Contextual Link',
    MORE_OPTIONS: 'More Options...',
};

export default class AgGridVisualization extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.microchartConfigDialog = new MicrochartConfigDialog();
        this.visualizationForGrid = new VizPanelForGrid();
        this.datasetPanel = new DatasetPanel();
        this.datasetsPanel = new DatasetsPanel();
        this.common = new Common();
        this.reportGridView = new ReportGridView();
        this.baseVisualization = new BaseVisualization();
        this.dossierPage = new DossierPage();
    }

    get agGridAddColumnSetIcon() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIPanel')]//div[contains(@class, 'mstrmojo-VITitleBar')]//div[contains(@class, 'right-toolbar')]//div[contains(@class, 'item') and contains(@class, 'add')]//div[@class='icn']`
        );
    }

    getEnterTXNModeBtn() {
        return this.$('div[aria-label="Enter Transaction Mode"]');
    }

    get contextMenu() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]`);
    }

    agGridHeader(visualizationName) {
        const path = `${this.getContainerPath(visualizationName)}//div[contains(@class, 'ag-header')]`;
        return this.$(path);
    }

    getSetAtPosition(index) {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-MicroChartList')]//div[${Utils.containsExactClass(
                'mstrmojo-VIPanel'
            )}])[${index}]`
        );
    }

    getColumnBorder(colNum, visualizationName) {
        const path = `(${this.getContainerPath(
            visualizationName
        )}//div[@role='columnheader' and @aria-colindex='${colNum}']//div[@class='ag-header-cell-resize'])[1]`;
        return this.$(path);
    }

    getGroupHeader(text) {
        return $(`//div[contains(@class, 'ag-header-group-cell')]//span[text()='${text}']/..`);
    }

    getGroupHeaderCell(text, visualizationName, index = 1) {
        const path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-header')]//span[text()='${text}'])[${index}]/..`;
        return this.$(path);
    }

    getGroupHeaderCellText(text, visualizationName, index = 1) {
        const path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-header')]//span[text()='${text}'])[${index}]`;
        return this.$(path);
    }

    getGridCell(elementName, visualizationName) {
        let path = `${this.getContainerPath(visualizationName)}//div[contains(@class, 'ag-cell')]`;
        path += elementName !== '' ? `//span[text()='${elementName}']/..` : `//span[not(text())]/..`;
        return this.$$(path)[0];
    }

    // getGridCellByPosition(row, col, visualizationName) {
    //     const path = `${this.getContainerPath(
    //         visualizationName
    //     )}//div[contains(@class, 'ag-') and @r = '${row}' and @c = '${col}']`;
    //     return $$(path).first();
    // }

    // row/col is index from 1
    getGridCellByPosition(row, col, visualizationName) {
        return this.$(
            `${this.getContainerPath(visualizationName)}//div[@aria-rowindex='${row}']//div[@aria-colindex='${col}']`
        );
    }

    // row/col is index from 0
    getGridCellByPos(row, col, visualizationName) {
        return this.$(`${this.getContainerPath(visualizationName)}//div[@r = '${row}' and @c = '${col}']`);
    }

    // row/col is index from 1
    async getGridCellTextByPosition(row, col, visualizationName) {
        const el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.waitForElementVisible(el);
        let txt = await el.getText();
        return txt;
    }

    // row/col is index from 0
    async getGridCellTextByPos(row, col, visualizationName) {
        const el = await this.getGridCellByPos(row, col, visualizationName);
        await this.waitForElementVisible(el);
        return el.getText();
    }

    getMicrochartCellByPosition(row, col, visualizationName) {
        col = parseInt(col) + 1;
        const path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-microchart') and @r = '${row}' and @aria-colindex = '${col}']`;
        return this.$$(path)[0];
    }

    getGridCellChildSpanByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$(`.//span`);
    }

    getGridCellImgByPos(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$(`.//img`);
    }

    getAgGridCellChildWarningIconByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$(`.//span[@class="htmlEnc"]`);
    }

    getAgGridCellChildSVGByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$(`.//*[name() = "svg"]`);
    }

    getRowOfCellByPosition(row, col, visualizationName) {
        const rowIndex = row - 1;
        return this.getGridCellByPosition(row, col, visualizationName).$(
            `.//parent::div[contains(@class, 'ag-row') and @row-index = '${rowIndex}']`
        );
    }

    getAgGridColsContainer(visualization) {
        return this.$(
            `//div[text()='${visualization}']//ancestor::div[contains(@class,'mstrmojo-UnitContainer-ContentBox')]//descendant::div[contains(@class, 'ag-center-cols-container')]`
        );
    }
    getAgGridViewPort(visualization) {
        return this.$(
            `//div[text()='${visualization}']//ancestor::div[contains(@class,'mstrmojo-UnitContainer-ContentBox')]//descendant::div[contains(@class, 'ag-body-viewport')]`
        );
    }

    getAgGridHorizontalViewPort(visualization) {
        return this.$(
            `//div[text()='${visualization}']//ancestor::div[contains(@class,'mstrmojo-UnitContainer-ContentBox')]//descendant::div[contains(@class, 'ag-body-horizontal-scroll-viewport')]`
        );
    }

    getHorizontalScrollBar(visualizationName) {
        return this.getContainer(visualizationName).$(`.//div[@class = 'ag-body-horizontal-scroll-viewport']`);
    }

    getVerticalScrollContent(visualizationName) {
        return this.getContainer(visualizationName).$$(`//div[contains(@class,'ag-body-viewport')]`).first();
    }

    getSortIcon(sortOrder) {
        return this.$(`//a[contains(@class, 'sort-${sortOrder}')]`);
    }

    getAllAgGridObject(visualizationName) {
        const path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-')]//div[contains(@class, 'ag-center')]//div[contains(@class, 'ag-row') and not(contains(@class, 'ag-spanned-row'))]`;
        return this.$$(path);
    }

    getAllAgGridObjectCount(visualizationName) {
        return this.getAllAgGridObject(visualizationName).length;
    }

    getGridCellWrapperByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$(`.//div[contains(@class, 'ag-cell-wrapper')]`);
    }

    getGridCellValueByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$(`.//span[contains(@class, 'ag-cell-value')]`);
    }

    getColHeaderCellInFrozenArea(headerName, visualizationName) {
        return this.$(
            `${this.getContainerPath(
                visualizationName
            )}//div[contains(@class, 'ag-pinned-left-header')]//div[contains(concat(' ', normalize-space(@class), ' '), ' ag-header-cell ')]//span[text()='${headerName}']`
        );
    }

    getGroupColHeaderCellInFrozenArea(headerName, visualizationName) {
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-pinned-left-header')]//div[contains(@class, 'ag-header-group-cell')]//span[text()='${headerName}']`;

        return this.$(path);
    }

    getColHeaderCellInRightPinArea(headerName, visualizationName) {
        return this.$(
            `${this.getContainerPath(
                visualizationName
            )}//div[contains(@class, 'ag-pinned-right-header')]//div[contains(concat(' ', normalize-space(@class), ' '), ' ag-header-cell ')]//span[text()='${headerName}']`
        );
    }

    getColHeaderByPinIdx(index = 1, pinArea, visualizationName) {
        const path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-pinned-${pinArea}-header')]//div[contains(concat(' ', normalize-space(@class), ' '), ' ag-header-cell ')]//span)[${index}]`;
        return this.$(path);
    }

    getGroupColHeaderByPinIdx(index = 1, pinArea, visualizationName) {
        const path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-pinned-${pinArea}-header')]//div[contains(concat(' ', normalize-space(@class), ' '), ' ag-header-cell ')]//span)[${index}]`;
        return this.$(path);
    }

    getValueCellByPinIdx(index = 1, pinArea, visualizationName) {
        const path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'ag-pinned-${pinArea}-cols-container')]//span[contains(@class, 'ag-cell-value')]//span)[${index}]`;
        return this.$(path);
    }

    async getAGGridLoadingIcon() {  
        return this.$(`//div[contains(@class, 'ag-icon-loading')]`);
    }

    async getColumnsCount(isLeftPinArea, visualizationName) {
        let pinnedColumns = await this.getFirstOrLastPinnedColumns(isLeftPinArea, visualizationName);
        let column_count = pinnedColumns.length;
        return column_count;
    }

    async getFirstOrLastPinnedColumns(isLeftPinArea, visualizationName) {
        const path = `${this.getContainerPath(visualizationName)}//div[contains(@class, 'ag-pinned-${
            isLeftPinArea ? 'left' : 'right'
        }-header')]//div[contains(concat(' ', normalize-space(@class), ' '), ' ag-header-cell ')]//span`;
        return this.$$(path);
    }

    async getFirstOrLastPinnedColumn(isLeftPinArea, visualizationName) {
        let len = await this.getColumnsCount(isLeftPinArea, visualizationName);
        if (len === 0) return undefined;
        const path = `${this.getContainerPath(visualizationName)}//div[contains(@class, 'ag-pinned-${
            isLeftPinArea ? 'left' : 'right'
        }-header')]//div[contains(concat(' ', normalize-space(@class), ' '), ' ag-header-cell ')]//span`;
        let el = this.$$(path);
        return isLeftPinArea ? el[len - 1] : el[0];
    }

    async getPinnedAreaIndicator(isLeftPinArea, visualizationName) {
        let column = await this.getFirstOrLastPinnedColumn(isLeftPinArea, visualizationName);
        //if (typeof column === 'undefined') return column;

        return column;
        // return (await this.getFirstOrLastPinnedColumn(isLeftPinArea, visualizationName)).$(
        //     `.//ancestor::div[contains(@class, 'ag-header-cell ')]`
        // );
    }

    get columnLimitEditor() {
        return this.$('.mstrmojo-ui-MenuEditor.displayForms');
    }

    getcolumnLimitEditorBtn(btn) {
        return this.columnLimitEditor.$(
            `//div[@class ='me-buttons']//div[contains(@class, 'mstrmojo-Button') and @aria-label = '${btn}']`
        );
    }

    get setColumnLimitLabel() {
        return this.columnLimitEditor.$('.me-content .mstrmojo-ui-column-limit-label');
    }

    get columnLimitEditorMinMaxInput() {
        return async function (input) {
            let xpath;

            // input can be "min" or "max"
            if (input === 'min') {
                xpath = `(//div[@class ='me-content']//input[contains(@class, 'mstrmojo-ui-width-limit-input')])[1]`;
            } else if (input === 'max') {
                xpath = `(//div[@class ='me-content']//input[contains(@class, 'mstrmojo-ui-width-limit-input')])[2]`;
            } else {
                throw new Error(`Invalid input: ${input}. Use 'min' or 'max'.`);
            }

            return this.columnLimitEditor.$(xpath);
        };
    }

    async getGridCellStyle(row, col, visualizationName, style) {
        let el = this.getGridCellByPosition(row, col, visualizationName);
        await this.waitForElementVisible(el);
        let computedStyle = await el.getCSSProperty(style);
        let actualValue = computedStyle.value;
        return actualValue;
    }

    async addColumnSet() {
        await this.clickOnElement(this.agGridAddColumnSetIcon);
        // to dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
        const el = this.common.getContextMenuItem('Column Set');
        await this.waitForElementVisible(el, 3 * 1000);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addMicrochartSet() {
        await this.clickOnElement(this.agGridAddColumnSetIcon);
        // to dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
        await this.clickOnElement(this.common.getContextMenuItem('Microchart'));
        await this.waitForElementVisible(this.microchartConfigDialog.windowRoot);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * enable subtotals for metric in the grid
     * @param {string} objectName
     * @param {string} visualizationName - Name of the visualization
     */
    async toggleShowTotalsFromMetric(objectName, visualizationName) {
        const el = await this.getGroupHeaderCell(objectName, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem(visualizationContextMenuItem.SHOW_TOTALS));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleShowTotalsByContextMenu(visualizationName) {
        await this.openContextMenu(visualizationName);
        let el = await this.getContextMenuOption(visualizationContextMenuItem.SHOW_TOTALS);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openMoreOptionsDialog(visualizationName) {
        await this.openContextMenu(visualizationName);
        let el = await this.getContextMenuOption(visualizationContextMenuItem.MORE_OPTIONS);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setIncrementalFetchValue(value) {
        let incrementalFetchInput = $(
            `//div[contains(@class, 'mstr-moreOptions-inputBox')]//input`
        );
        await this.clickOnElement(incrementalFetchInput);
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        await browser.keys('Delete');
        await incrementalFetchInput.setValue(value);
    }

    async hoverIncrementalFetchHelpIcon() {
        let el = $(`//div[contains(@class, 'mstr-moreOptions-helpIcon')]`);
        await this.hoverMouseOnElement(el);
    }

    async applyIncrementalFetchSuggestedValue() {
        let el = $(`//button[@class="mstr-moreOptions-recommended-btn" and @aria-label="Apply"]`);
        await this.clickOnElement(el);
    }

    async saveAndCloseMoreOptionsDialog() {
        let el = $(`//div[contains(@class, 'mstr-moreOptions-buttonBar')]//button[@aria-label='Save']`);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async cancelAndCloseMoreOptionsDialog() {
        let el = $(`//div[contains(@class, 'mstr-moreOptions-buttonBar')]//button[@aria-label='Cancel']`);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnColumnHeaderElement(elementName, visualizationName) {
        const el = this.getGroupHeaderCell(elementName, visualizationName);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnColumnHeaderElementTextArea(elementName, visualizationName) {
        const el = this.getGroupHeaderCellText(elementName, visualizationName);
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openContextMenuItemForHeader(elementName, menuItem, visualizationName) {
        const el = this.getGroupHeaderCell(elementName, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async rightMouseClickOnElement(elem) {
        await this.rightClick({ elem });
    }

    async metricSortFromAgGrid(objectName, visualizationName, order) {
        let objectElement = this.getGroupHeaderCell(objectName, visualizationName);
        const status = await objectElement.isPresent();
        if (!status) {
            objectElement = this.getGridCell(objectName, visualizationName);
        }
        await this.rightMouseClickOnElement(objectElement);
        let cntxt;
        if (order.toLowerCase() === 'ascending') {
            cntxt = visualizationForGrid.metricSortAscendingIcon;
        } else if (order.toLowerCase() === 'descending') {
            cntxt = visualizationForGrid.metricSortDescendingIcon;
        } else if (order.toLowerCase() === 'clear') {
            cntxt = visualizationForGrid.metricSortClearIcon;
        } else {
            throw 'Invalid operation';
        }
        await this.clickOnElement(cntxt);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async RMConColumnHeaderElement(elementName, visualizationName) {
        const el = this.getGroupHeaderCell(elementName, visualizationName);
        await this.rightMouseClickOnElement(el);
    }

    async openContextMenuItemForDZUnit(elementName, elementType, setName, menuItem) {
        await this.openMenuItem(elementName, menuItem, visualizationName);
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnSubMenuItem(menuItem, subMenuItem) {
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        let breakIt = false;
        for (let i = 0; !breakIt && i < 5; i++) {
            try {
                const el = this.common.getSecondaryContextMenu(subMenuItem);
                await this.sleep(0.5);
                await el.click();
                breakIt = true;
            } catch (err) {
                switch (typeof err) {
                    case 'object':
                    case 'string':
                        breakIt = JSON.stringify(err).indexOf('element is not attached') === -1;
                        break;
                    default:
                        breakIt = true;
                }
            }
        }

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openAndClickSubMenuItemForElement(el, menuItem, subMenuItem) {
        await this.clickOnElement(el);
        await this.clickOnSubMenuItem(menuItem, subMenuItem);
    }

    async openContextSubMenuItemForElement(el, menuItem, subMenuItem) {
        await this.rightMouseClickOnElement(el);
        await this.clickOnSubMenuItem(menuItem, subMenuItem);
    }

    async openContextSubMenuItemForHeader(elementName, menuItem, subMenuItem, visualizationName) {
        const el = await this.getGroupHeaderCell(elementName, visualizationName);
        await this.openContextSubMenuItemForElement(el, menuItem, subMenuItem);
    }

    async openContextSubMenuItemForCell(elementName, menuItem, subMenuItem, visualizationName) {
        const el = await this.getGridCell(elementName, visualizationName);
        await this.openContextSubMenuItemForElement(el, menuItem, subMenuItem);
    }

    async clickOnSecondaryContextMenu(submenu) {
        await this.clickOnElement(this.common.getContextMenuItem(submenu));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnAGGridCell(elementName, visualizationName) {
        await this.click({
            elem: await this.getGridCell(elementName, visualizationName),
        });
    }

    async hoverOnAGGridCell(elementName, visualizationName) {
        await this.hover({
            elem: await this.getGridCell(elementName, visualizationName),
        });
    }

    async clickOnAGGridCells(elementNames, visualizationName) {
        const arrString = elementNames.split(', ');
        const arrElements = [];
        for (const name of arrString) {
            await arrElements.push(this.getGridCell(name, visualizationName));
        }
        await this.moveAndClickByOffsetFromMultiElements({ elements: arrElements });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async doubleClickOnAGGridCells(elementNames, visualizationName, waitForLoadingDialog) {
        const arrString = elementNames !== null ? elementNames.split(', ') : [''];
        const arrElements = [];
        for (const name of arrString) {
            arrElements.push(this.getGridCell(name, visualizationName));
        }
        await this.moveAndDoubleClickByOffsetFromMultiElements(arrElements, 1, 1, waitForLoadingDialog);
    }

    async openContextMenuItemForValue(elementName, menuItem, visualizationName, waitForLoadingDialog = true) {
        let el = await this.getGridCell(elementName, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async openContextMenuItemForCellAtPosition(row, col, menuItem, visualizationName, waitForLoadingDialog = true) {
        const cell = this.getGridCellByPos(row, col, visualizationName);
        await this.rightMouseClickOnElement(cell);
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async openRMCMenuForValue(elementName, visualizationName) {
        const el = await this.getGridCell(elementName, visualizationName);
        await this.rightClick({ elem: el });
    }

    async openRMCMenuForCellAtPosition(row, col, visualizationName) {
        const el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.rightMouseClickOnElement(el);
    }

    async openRMCMenuForCellAtPositionAndSelectFromCM(row, col, visualizationName, option) {
        await this.openRMCMenuForCellAtPosition(row, col, visualizationName);
        await this.clickOnElement(this.common.getContextMenuItem(option));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openRMCMenuForMicrochartAtPositionAndSelectFromCM(row, col, visualizationName, option) {
        const el = await this.getMicrochartCellByPosition(row, col, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem(option));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openContextMenuItemForValues(elementNames, menuItem, visualizationName) {
        const arrString = elementNames.split(', ');
        const arrElements = [];
        for (const name of arrString) {
            arrElements.push(this.getGridCell(name, visualizationName));
        }
        await this.moveAndClickByOffsetFromMultiElements({ elements: arrElements });
        await this.rightClick({ elem: arrElements[0] });
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openContextMenuItemForHeaders(elementNames, menuItem, visualizationName) {
        const arrString = elementNames.split(', ');
        const arrElements = [];
        for (const name of arrString) {
            arrElements.push(this.getGroupHeaderCell(name, visualizationName));
        }
        await this.moveAndClickByOffsetFromMultiElements({ elements: arrElements });
        await this.rightClick({ elem: arrElements[0] });
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openMenuItem(elementName, menuItem, visualizationName) {
        const el = await this.getGroupHeaderCell(elementName, visualizationName);
        await this.rightClick({ elem: el });
        if (
            menuItem === 'Add Thresholds...' ||
            menuItem === 'Edit Thresholds...' ||
            menuItem === 'Add Bars...' ||
            menuItem === 'Edit Bars...'
        ) {
            const conditionalFormat = await this.common.getContextMenuItem('Conditional Formatting');
            const isPresent = await conditionalFormat.isExisting();
            if (isPresent) await this.clickOnElement(conditionalFormat);
        } else if (menuItem === 'Thresholds' || menuItem === 'Bars') {
            const conditionalFormat = await this.common.getContextMenuItem('Clear Conditional Formatting');
            const isPresent = await conditionalFormat.isExisting();
            if (isPresent) await this.clickOnElement(conditionalFormat);
        }
        await this.clickOnElement(await this.common.getContextMenuItem(menuItem));
    }

    async isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName) {
        // Locate the cell by its text
        const cell = await this.getGroupHeaderCell(cellText, visualizationName);

        // Right-click on the cell to open the context menu
        await cell.click({ button: 'right' });

        // Check if the context menu option exists
        const menuOptionElement = await this.getContextMenuOption(menuOption);
        return await menuOptionElement.isExisting();
    }

    async isPinIndicatorVisible(pinArea, visualization) {
        let isLeftPinArea = pinArea === 'left';
        const headerCell = await this.getPinnedAreaIndicator(isLeftPinArea, visualization);
        if (typeof headerCell === 'undefined') return false;
        else {
            return true;
        }
    }

    async sortAscendingBySortIcon(elementName, visualizationName) {
        let el = await this.getGroupHeaderCell(elementName, visualizationName);
        await this.click({ elem: el });
        await this.rightClick({ elem: el });
        await this.clickSortIcon('asc');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async sortDescendingBySortIcon(elementName, visualizationName) {
        let el = await this.getGroupHeaderCell(elementName, visualizationName);
        await this.click({ elem: el });
        await this.rightClick({ elem: el });
        await this.clickSortIcon('desc');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clearSortBySortIcon(elementName, visualizationName) {
        let el = await this.getGroupHeaderCell(elementName, visualizationName);
        await this.click({ elem: el });
        await this.rightClick({ elem: el });
        await this.clickSortIcon('clear');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickSortIcon(sortOrder) {
        await this.click({ elem: this.getSortIcon(sortOrder) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * enable subtotals for attribute in the grid
     * @param {string} objectName
     * @param {string} visualizationName - Name of the visualization
     * @param {String} subtotalOptions - options available in Show Totals submenu
     */
    async toggleShowTotalsFromAttribute(objectName, visualizationName, subtotalOptions) {
        let subtotalSplit = subtotalOptions.split(',');
        let el = await this.getGroupHeaderCell(objectName, visualizationName);
        await this.waitForElementVisible(el);
        await this.rightMouseClickOnElement(el);

        // wait for menu to appear
        let menu = await this.common.getContextMenuItem(visualizationContextMenuItem.SHOW_TOTALS);
        await this.waitForElementVisible(menu);
        await this.clickOnElement(menu);

        for (let i = 0; i < subtotalSplit.length; i++) {
            let cntxt = await this.common.getSecondaryContextMenu(subtotalSplit[i]);
            await this.clickOnElement(cntxt);
        }
        await this.clickOnElement(
            $("//div[contains(@class,'mstrmojo-ui-MenuPopup') and contains(@style,'block')]//div[text()='OK']")
        );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async scrollVertically(direction, pixels, vizName) {
        direction = direction.toLowerCase();
        let content = this.getAgGridViewPort(vizName);
        let numOfPixels = parseInt(direction === 'up' ? -pixels : pixels);
        await scrollElement(content, numOfPixels);
        await browser.pause(5000);
        await this.waitForAgGridLoadingIconNotDisplayed();
    }

    async scrollVerticallyDownToNextSlice(number, vizName) {
        let content = this.getAgGridViewPort(vizName);
        await scrollElementToNextSlice(content, number);
        await browser.pause(5000);
        await this.waitForAgGridLoadingIconNotDisplayed();
    }

    async scrollVerticallyToMiddle(vizName) {
        let content = this.getAgGridViewPort(vizName);
        await scrollElementToMiddle(content);
        await browser.pause(10000); // wait for scroll finished
        await this.waitForAgGridLoadingIconNotDisplayed();
    }

    async scrollVerticallyToBottom(vizName) {
        let content = this.getAgGridViewPort(vizName);
        await scrollElementToBottom(content);
        await browser.pause(10000); // wait for scroll finished
        await this.waitForAgGridLoadingIconNotDisplayed();
    }

    async scrollHorizontally(direction, pixels, vizName) {
        direction = direction.toLowerCase();
        let content = this.getAgGridHorizontalViewPort(vizName);
        let numOfPixels = parseInt(direction === 'left' ? -pixels : pixels);
        await scrollHorizontally(content, numOfPixels);
        await browser.pause(5000);
        await this.waitForAgGridLoadingIconNotDisplayed();
    }

    async scrollHorizontallyToNextSlice(number, vizName) {
        let content = this.getAgGridHorizontalViewPort(vizName);
        await scrollHorizontallyToNextSlice(content, number);
        await browser.pause(5000);
        await this.waitForAgGridLoadingIconNotDisplayed();
    }

    /**
     * Move horizontal scroll bar
     *
     * @param {"left"|"right"} direction moving direction
     * @param {int} pixels number of pixels to move
     * @param {string} vizName host viz name
     */
    async moveHorizontalScrollBar(direction, pixels, vizName) {
        direction = direction.toLowerCase();
        let scrollbar = await this.getHorizontalScrollBar(vizName),
            numOfPixels = direction === 'left' ? -pixels : pixels;

        await this.dragAndDropByPixel(scrollbar, numOfPixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Scroll grid vertically by pixels
     *
     * @param {"up"|"down"} direction moving direction
     * @param {int} pixels number of pixels to move
     * @param {string} vizName host viz name
     */
    async moveVerticalScrollBar(direction, pixels, vizName) {
        direction = direction.toLowerCase();
        let content = this.getVerticalScrollContent(vizName);
        let numOfPixels = parseInt(direction === 'up' ? -pixels : pixels);
        let currentOffset = parseInt(await content.getAttribute('scrollTop'));

        await browser.executeScript('arguments[0].scrollTop = arguments[1];', content, currentOffset + numOfPixels);
    }

    /**
     * Scroll Grid vertically to a specific position
     *
     * @param {string} vizName host viz name
     * @param {"middle"|"bottom"} pos target position
     */
    async moveVerticalScrollBarToBottom(vizName, pos) {
        let content = this.getVerticalScrollContent(vizName);
        let targetPos = parseInt(await content.getAttribute('scrollHeight'));

        if (pos === 'middle') {
            targetPos /= 2;
        }

        await browser.executeScript('arguments[0].scrollTop = arguments[1];', content, targetPos);
    }

    async scrollToGridCell(visualizationName, elementName) {
        let el = this.getGridCell(elementName, visualizationName);
        await this.scrollIntoView(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Action to select(single or multiple) element(s) in grid
     * @param {string} elements     the list of elements
     * @param {string} visualizationName - Name of the visualization
     */
    async selectMultipleElements(elements, visualizationName, waitForLoadingDialog = true) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridCell(arrString[i], visualizationName));
        }
        await this.moveAndClickByOffsetFromMultiElements({ elements: arrElements });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
        return arrElements;
    }

    async expandGroupCell(el) {
        let icon = el.$(`.//span[contains(@class, 'ag-icon-tree-closed')]`);
        await this.clickOnElement(icon);
    }

    async selectGroupHeaderUsingShift(elements_1, elements_2, menuItem, visualizationName) {
        let obj1 = await this.getGroupHeaderCell(elements_1, visualizationName);
        let obj2 = await this.getGroupHeaderCell(elements_2, visualizationName);
        await this.moveAndClickByOffsetFromMultiElements({ elements: [obj1, obj2] });
        await this.rightMouseClickOnElement(obj2);
        await this.clickOnElement(this.common.getContextMenuItem(menuItem));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async collapseGroupCell(el) {
        let icon = el.$(`.//span[contains(@class, 'ag-icon-tree-open')]`);
        await this.clickOnElement(icon);
    }

    async getGridCellIconByPos(row, col, iconName, visualizationName) {
        const el = await this.getGridCellByPos(row, col, visualizationName);
        await this.waitForElementVisible(el);
        const icon = el.$(`.//span[contains(@class, 'ag-icon-tree-${iconName}')]`);
        // await this.waitForElementVisible(icon);
        return icon.isDisplayed();
    }

    async getGridCellExpandIconByPos(row, col, visualizationName) {
        return this.getGridCellIconByPos(row, col, 'open', visualizationName);
    }

    async getGridCellCollapseIconByPos(row, col, visualizationName) {
        return this.getGridCellIconByPos(row, col, 'closed', visualizationName);
    }

    /**
     * Open the threshold editor by clicking on a cell in the visualization
     * @param {string} objectName
     * @param {string} visualizationName
     */
    async openThresholdEditorFromViz(objectName, visualizationName) {
        await this.RMConColumnHeaderElement(objectName, visualizationName);
        let option = await this.common.getContextMenuItem('Thresholds...');
        const isPresent = await option.isExisting();
        if (!isPresent) {
            option = await this.common.getContextMenuItem('Edit Thresholds...');
        }
        await this.clickOnElement(option);
    }

    /**
     * Get the dialog for displaying attribute forms
     */
    get displayAttributeFormsDialog() {
        return $(`.//div[contains(@class, 'mstrmojo-ui-MenuPopup') and contains (@class, 'displayForms')]`);
    }

    /**
     * Get a context menu item from the ag grid visualization
     * @param {string} menuItem
     */
    getContextMenuItem(menuItem) {
        return this.common.getContextMenuItem(menuItem);
    }

    async dragHeaderCellToRow(objectToDrag, position, targetHeader) {
        const headerEl = await this.getGroupHeaderCell(objectToDrag);
        const targetEl = await this.getGridCell(targetHeader);
        const width = parseInt((await targetEl.getCSSProperty('width')).value) / 2;
        const pixels = position === 'left' ? -(width - 12) : width - 12;
        await this.baseVisualization.dragAndDropObjectWithExtraMove(headerEl, targetEl, Math.round(pixels), 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragHeaderCellToCol(objectToDrag, position, targetHeader) {
        const headerEl = await this.getGroupHeaderCell(objectToDrag);
        const targetEl = await this.getGroupHeaderCell(targetHeader);
        let offsetX = 0;
        let offsetY = 0;
        if (position === 'top' || position === 'bottom') {
            const height = parseInt((await headerEl.getCSSProperty('height')).value);
            offsetY = position === 'top' ? 0 : height;
        } else if (position === 'left' || position === 'right') {
            const width = parseInt((await targetEl.getCSSProperty('width')).value, 10) / 2;
            const pixels = position === 'left' ? -(width - 12) : (width - 12);
            offsetX = Math.round(pixels);
            offsetY = 0;
        } else {
            throw new Error(`Unsupported position: ${position}`);
        }
        await this.baseVisualization.dragAndDropObjectWithExtraMove(headerEl, targetEl, offsetX, offsetY, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Check the alignment of the cell
     * @param {Object} cell cell whose position is getting checked
     * @returns {'right' | 'left' | 'center'} string version of the alignment
     */
    async getCellAlignment(cell) {
        const flex = await cell.getCssValue('justify-content');
        switch (flex) {
            case 'center':
                return 'center';
            case 'flex-start':
                return 'left';
            case 'flex-end':
                return 'right';
        }
    }

    /**
     * Get the inner part of the ag grid cell. This is to ensure that the dom
     * structure is correct and has not been altered.
     * @param {Object} cell
     */
    getInnerCell(cell) {
        return cell.$(`.//span[text()!=""]`);
    }

    async dragDSObjectToAGGridWithPositionInRow(
        objectName,
        objectTypeName,
        datasetName,
        desPosition,
        elementInRow,
        vizName
    ) {
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);

        let row = await this.getGridCell(elementInRow, vizName);
        await this.waitForElementVisible(row);
        let x = 0;
        let y = 0;
        // above: y=12, below:y=-12
        // left: x=-12, right:x=12
        if (desPosition.toLowerCase() === 'above' || desPosition.toLowerCase() === 'below') {
            y = desPosition.toLowerCase() === 'above' ? 12 : -12;
        }
        if (desPosition.toLowerCase() === 'left' || desPosition.toLowerCase() === 'right') {
            x = desPosition.toLowerCase() === 'left' ? -12 : 12;
        }
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: row,
            toOffset: { x: x, y: y },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragDSObjectToAGGridWithPositionInColumnHeader(
        objectName,
        objectTypeName,
        datasetName,
        desPosition,
        elementInRow,
        vizName
    ) {
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);

        let row = await this.getGroupHeaderCell(elementInRow, vizName);
        await this.waitForElementVisible(row);

        let x = 0;
        let y = 0;
        // above: y=12, below:y=-12
        // left: x=-12, right:x=12
        if (desPosition.toLowerCase() === 'above' || desPosition.toLowerCase() === 'below') {
            y = desPosition.toLowerCase() === 'above' ? -12 : 12;
        }
        if (desPosition.toLowerCase() === 'left' || desPosition.toLowerCase() === 'right') {
            x = desPosition.toLowerCase() === 'left' ? -12 : 12;
        }
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: row,
            toOffset: { x: x, y: y },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async moveObjectToAGGridWithPositionInRow(objectName, desPosition, elementInRow, vizName) {
        let srcel = await this.getGroupHeaderCell(objectName, vizName);
        await this.waitForElementVisible(srcel);

        let row = await this.getGroupHeaderCell(elementInRow, vizName);
        await this.waitForElementVisible(row);

        let x = 0;
        let y = 0;

        // above: y=12, below:y=-12
        // left: x=-12, right:x=12
        if (desPosition.toLowerCase() === 'above' || desPosition.toLowerCase() === 'below') {
            y = desPosition.toLowerCase() === 'above' ? -12 : 12;
        }
        if (desPosition.toLowerCase() === 'left' || desPosition.toLowerCase() === 'right') {
            x = desPosition.toLowerCase() === 'left' ? -12 : 12;
        }
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: row,
            toOffset: { x: x, y: y },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickSaveButtonOnGroup() {
        let el = this.$(
            `//div[contains(@class, 'mstrmojo-rename-editor')]//div[contains(@class, 'buttons')]//div[@role='button' and @aria-label='Save']`
        );
        await this.clickOnElement(el);
    }

    async isAgGridCellHasTextDisplayed(row, col, visualizationName, text) {
        let el = await this.getGridCellByPosition(row, col, visualizationName);
        await scrollIntoView(el);
        await this.waitForElementVisible(el);
        let actualText = await el.getText();
        return text === actualText;
    }

    async moveAttributeFormColumnToLeftFromContextMenu(row, col, visualizationName) {
        let el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem('Move Left'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async moveAttributeFormColumnToRightFromContextMenu(row, col, visualizationName) {
        let el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem('Move Right'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getGridCellStyleByPos(row, col, style) {
        const el = await this.getGridCellByPos(row, col);
        await this.waitForElementVisible(el);
        const cssProperty = await el.getCSSProperty(style);
        return cssProperty && cssProperty.value ? cssProperty.value.toString() : '';
    }

    async getGridCellStyleByCols(rowStart, rowEnd, col, style) {
        const els = [];
        for (let row = rowStart; row <= rowEnd; row++) {
            els.push(await this.getGridCellStyleByPos(row, col, style));
        }
        return els;
    }

    async getGridCellStyleByRows(colStart, colEnd, row, style) {
        const els = [];
        for (let col = colStart; col <= colEnd; col++) {
            els.push(await this.getGridCellStyleByPos(row, col, style));
        }
        return els;
    }

    async clickButtonInColumnLimitEditor(btn) {
        let el = this.getcolumnLimitEditorBtn(btn);
        await el.waitForClickable({ timeout: 5000 });
        await el.click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setColumnLimitInputBox(minOrMax, txt) {
        let inputbox = await this.columnLimitEditorMinMaxInput(minOrMax);
        await inputbox.waitForExist();
        await inputbox.waitForDisplayed();
        await inputbox.click();
        await browser.execute(function (element) {
            element.value = '';
        }, inputbox);
        await inputbox.setValue(txt);

        // click on label to confirm the input
        await this.clickSetColumnLimitLabel();
    }

    async resizeAgColumnByMovingBorder(colIndex, pixels, direction, vizName) {
        let columnBorder = await this.getColumnBorder(colIndex, vizName);
        let numOfPixels = direction.toLowerCase() === 'left' ? -pixels : pixels;

        await this.dragAndDropByPixel(columnBorder, numOfPixels, 0, true);
    }

    async clickSetColumnLimitLabel() {
        let el = this.setColumnLimitLabel;
        await el.waitForClickable({ timeout: 5000 });
        await el.click();
    }

    /**
     * RMC on cell to change where subtotals are positioned
     * @param {string} cellToClick "Total, Average, Minimun, etc"
     * @param {string} newPosition "Move to top, bottom, left, right"
     * @param {string} visualizationName - Name of the visualization
     * @param {boolean} isHeader optional param
     */
    async changeSubtotalPosition(cellToClick, newPosition, visualizationName, isHeader) {
        let el = isHeader
            ? this.getGroupHeaderCell(cellToClick, visualizationName)
            : this.getGridCell(cellToClick, visualizationName);
        await this.rightMouseClickOnElement(el);
        await this.clickOnElement(this.common.getContextMenuItem(newPosition));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // RA
    getRAExpandIcon(elementName, visualizationName) {
        return this.getGridCell(elementName, visualizationName).$('.raBtn.iconRA-expand');
    }

    getRAExpandIconOnColumnHeader(headerName, visualizationName) {
        return this.getGroupHeaderCell(headerName, visualizationName).$('.raBtn.iconRA-expand');
    }

    getRACollapseIcon(elementName, visualizationName) {
        return this.getGridCell(elementName, visualizationName).$('.raBtn.iconRA-collapse');
    }

    getRACollapseIconOnColumnHeader(headerName, visualizationName) {
        return this.getGroupHeaderCell(headerName, visualizationName).$('.raBtn.iconRA-collapse');
    }

    async expandRA(elementName, visualizationName) {
        await this.click({ elem: this.getRAExpandIcon(elementName, visualizationName) });
        await this.waitForCurtainDisappear();
        return this.waitForDynamicElementLoading();
    }

    async expandRAOnColumnHeader(headerName, visualizationName) {
        await this.click({ elem: this.getRAExpandIconOnColumnHeader(headerName, visualizationName) });
        await this.waitForCurtainDisappear();
        return this.waitForDynamicElementLoading();
    }

    async collapseRA(elementName, visualizationName) {
        await this.click({ elem: this.getRACollapseIcon(elementName, visualizationName) });
        await this.waitForCurtainDisappear();
        return this.waitForDynamicElementLoading();
    }

    async collapseRAOnColumnHeader(headerName, visualizationName) {
        await this.click({ elem: this.getRACollapseIconOnColumnHeader(headerName, visualizationName) });
        await this.waitForCurtainDisappear();
        return this.waitForDynamicElementLoading();
    }

    async getRowIndexByCellText(cellText, visualizationName) {
        await this.waitForDynamicElementLoading();
        const cell = await this.$(
            `${this.getContainerPath(
                visualizationName
            )}//div[contains(@class, 'ag-cell')]//span[contains(text(), "${cellText}")]/ancestor::div[contains(@class, 'ag-cell')]`
        );
        const row = await cell.$('./ancestor::div[@role="row"]');
        const index = await row.getAttribute('aria-rowindex');
        return Number(index) + 1;
    }

    async drillfromAttributeHeader(attributeName, drillToItem, visualizationName) {
        await this.openContextSubMenuItemForHeader(attributeName, 'Drill', drillToItem, visualizationName);
        await this.dossierPage.waitForDossierLoading();
        await this.sleep(2000);
    }

    async drillfromAttributeElement(elementName, drillToItem, visualizationName) {
        await this.openContextSubMenuItemForCell(elementName, 'Drill', drillToItem, visualizationName);
        await this.dossierPage.waitForDossierLoading();
        await this.sleep(2000);
    }

    async waitForAgGridLoadingIconNotDisplayed() {
        await this.waitForElementInvisible(await this.getAGGridLoadingIcon());
    }

    async isCellInGridDisplayed(cellText, visualizationName) {
        const cell = this.getGridCell(cellText, visualizationName);
        return cell.isDisplayed();
    }
}
