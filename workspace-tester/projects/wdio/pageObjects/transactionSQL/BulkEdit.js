import BaseContainer from '../authoring/BaseContainer.js';
import { scrollIntoView } from '../../utils/scroll.js';
import { Key } from 'webdriverio';
export default class BulkEdit extends BaseContainer {
    getBulkModeOption(bulkMode) {
        return $(`//div[contains(@class, 'mtxt') and contains(text(), '${bulkMode}')]`);
    }

    getBulkTxnContainerPath(bulkMode) {
        return `//div[contains(@class, 'mstrmojo-TransactionsInlineDialog')]//div[text()='${bulkMode}']/ancestor::div[contains(@class, 'mstrmojo-UnitContainer-SplitterHost')][1]`;
    }

    getBulkTxnGridCellByPosition(row, col, bulkMode, hasError = false) {
        const childBase = `//div[contains(@class, 'ag-') and @r='${row}' and @c='${col}']`;
        if (hasError) {
            return $(`${this.getBulkTxnContainerPath(bulkMode)}${childBase}/span`);
        } else {
            return $(`${this.getBulkTxnContainerPath(bulkMode)}${childBase}`);
        }
    }

    async getBulkTxnGridCellErrorByPosition(row, col, bulkMode) {
        const cell = (await this.getBulkTxnGridCellByPosition(row, col, bulkMode)).$(`.//div[contains(@class, 'hasEditableText')]`);
        const classAttr = await cell.getAttribute('class');
        return classAttr.includes('txn-textarea-error');
    }

    getBulkTxnGridColumnResizeBarByPosition(col, bulkMode) {
        return this.getBulkTxnGridCellByPosition('0', col, bulkMode).$(
            `./div[contains(@class, 'ag-header-cell-resize')]`
        );
    }

    getBulkEditToolbar(containerName) {
        return this.getBulkEditContainer(containerName).$(`.//div[contains(@class, 'win mstrmojo-bar')]`);
    }

    async clickBulkTxnGridCellByPosition(row, col, bulkMode, hasError) {
        await this.sleep(1000);
        const cell = this.getBulkTxnGridCellByPosition(row, col, bulkMode, hasError);
        await scrollIntoView(cell, 'both');
        await this.clickOnElement(cell);
    }

    getVisualizationInlineEditMenuButton(containerName) {
        return $(
            `${this.getContainerPath(
                containerName
            )}//div[contains(@class, 'hover-txn-btn') and @aria-label='Enter Transaction Mode']`
        );
    }

    getVisualizationMaximumButton(containerName) {
        return $(
            `${this.getContainerPath(
                containerName
            )}//div[contains(@class, 'hover-max-restore-btn') and @aria-label='Maximize']`
        );
    }

    getVisualizationContextMenuButton(containerName) {
        return $(
            `${this.getContainerPath(
                containerName
            )}//div[contains(@class, 'hover-menu-btn') and @aria-label='Visualization Options']`
        );
    }

    getBulkEditContainer(containerName) {
        return this.getContainer(containerName).$(
            `./descendant::div[contains(@class, 'mstrmojo-TransactionsInlineDialog')]`
        );
    }

    async getBulkEditSubmitButton(containerName, transactionMode) {
        return this.getBulkEditContainer(containerName).$(
            `.//div[contains(@class, 'mstrmojo-bar-button')]//div[text()='${transactionMode}']`
        );
    }

    async clickOnBulkEditSubmitButton(containerName, transactionMode) {
        const submitButton = await this.getBulkEditSubmitButton(containerName, transactionMode);
        await scrollIntoView(submitButton, 'both');
        await this.clickOnElement(submitButton);
    }

    async getBulkEditSubmitButtonEnabled(containerName, transactionMode) {
        const button = await this.getBulkEditSubmitButton(containerName, transactionMode);
        return button.$(`.//ancestor::div[contains(@class, 'mstrmojo-WebButton')]`);
    }

    async getTxnNodesToChange(containerName, text) {
        const container = this.getBulkEditContainer(containerName);
        return container.$(`.//div[contains(@class, 'mstrmojo-bar-button')]//div[text()='${text}']`);
    }

    async getTxnChangeText(containerName) {
        const container = this.getBulkEditContainer(containerName);
        return container.$(
            `//div[contains(@class, 'mstrmojo-bar-button')]//div[contains(@class, 'mstrmojo-Label deltaLabel')]`
        );
    }

    async enterBulkTxnMode(bulkMode, visName) {
        await this.clickBulkTxnModeIcon(visName);
        const menuItem = this.getBulkModeOption(bulkMode);
        await this.clickOnElement(menuItem);
    }

    async clickBulkTxnModeIcon(visName) {
        await this.hoverOnVisualizationContainer(visName);
        const el = await this.getVisualizationInlineEditMenuButton(visName);
        await this.sleep(1000);
        await this.clickOnElement(el);
    }

    async IsMenuButtonValid(visName, buttonName) {
        await this.hoverOnVisualizationContainer(visName);

        let el;
        if (buttonName === 'Edit Transaction') {
            el = await this.getVisualizationInlineEditMenuButton(visName);
        } else if (buttonName === 'Maximize') {
            el = await this.getVisualizationMaximumButton(visName);
        } else if (buttonName === 'Context Menu') {
            el = await this.getVisualizationContextMenuButton(visName);
        } else {
            return false;
        }
        const classAttr = await el.getAttribute('class');
        return classAttr.includes('invalid');
    }

    async clickBulkMode(bulkMode) {
        const menuItem = this.getBulkModeOption(bulkMode);
        await this.clickOnElement(menuItem);
    }

    async getVisualizationTxnButton(visualizationName) {
        return $(
            `//div[@class='mstrmojo-VIDocLayout']//div[contains(@class, 'mstrmojo-VITitleBar') and .//div[text()='${visualizationName}']]/../../div[contains(@class,'hover-txn-btn')]`
        );
    }

    async resizeColumn(col, xPixels, bulkMode) {
        const cellResizeBar = this.getBulkTxnGridColumnResizeBarByPosition(col, bulkMode);
        await browser.wait(EC.presenceOf(cellResizeBar), browser.params.timeout.waitDOMNodePresentTimeout5);
        await DocAuthBasePage.mouseDown(cellResizeBar);
        await DocAuthBasePage.mouseMove(xPixels, 0);
        await DocAuthBasePage.mouseUp();
        await this.loadingDialog.waitLibraryLoadingIsNotDisplayed(
            10,
            `Library Loading Data pop up still displayed after 10 seconds`
        );
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }

    async InputValueInBulkTxnGridCell(row, col, bulkMode, value) {
        const cell = (await this.getBulkTxnGridCellByPosition(row, col, bulkMode)).$(`.//div[contains(@class, 'hasEditableText')]`);
        await cell.click();
        await browser.keys([Key.Backspace]);
        await cell.setValue(value);
        await browser.keys([Key.Enter]);
        await this.sleep(2000);
    }

}
