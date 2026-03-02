import AgGridVisualization from './../agGrid/AgGridVisualization.js';
import TXNSQLEditorPopup from './../transactionSQLEditor/TXNSQLEditorPopup.js';
import { Key } from 'webdriverio';

const editorPopup = new TXNSQLEditorPopup();

export default class InlineEdit extends AgGridVisualization {
    getEditGridCellAtPosition(row, col, visualizationName) {
        const path = `${this.getContainerPath(visualizationName)}//div[contains(@class,'ag-cell-inline-editing') and @r = '${row}' and @c = '${col}']`;
        return $(path);
    }

    getGridCell(elementName, visualizationName) {
        let path = `${this.getContainerPath(visualizationName)}//div[contains(@class, 'ag-cell')]`;
        path += elementName !== '' ? `//span[text()='${elementName}']` : `//span[not(text())]`;
        return $(path);
    }

    getGridCellByName(elementName, visualizationName) {
        return this.getGridCell(elementName, visualizationName);
    }

    getInputField(row, col, visualizationName) {
        return this.getEditGridCellAtPosition(row, col, visualizationName).$(
            `.//textarea[contains(@class, 'txn-textarea')] | .//span[contains(@class, 'txn-textbox-input')]//input[contains(@class, 'ant-input')] | .//div[contains(@class, 'hasEditableText')]`
        );
    }

    getBadInput(row, col, visualizationName) {
        return this.getEditGridCellAtPosition(row, col, visualizationName).$(
            `.//textarea[contains(@class, 'txn-textarea-error')] | .//span[contains(@class, 'txn-input-error')]//input[contains(@class, 'ant-input')] | .//div[contains(@class, 'txn-textarea-error')]`
        );
    }

    getInputErrorIcon(row, col, visualizationName) {
        return this.getBadInput(row, col, visualizationName).$(
            `.//div[contains(@class, 'transaction-input-error-icon')]`
        );
    }

    getConfirmContainer(row, col, visualizationName) {
        return this.getEditGridCellAtPosition(row, col, visualizationName).$(
            `.//div[contains(@class, 'transaction-editor-confirm-container')] | ./ancestor::*[3]/div[contains(@class, 'transaction-editor-confirm-container')]`
        );
    }

    getConfirmContainerByName(elementName, visualizationName) {
        return this.getGridCellByName(elementName, visualizationName).$(
            `.//div[contains(@class, 'transaction-editor-confirm-container')]`
        );
    }

    getConfirmContainerIcon(row, col, visualizationName, iconName) {
        return this.getConfirmContainer(row, col, visualizationName).$(
            `.//div[contains(@class, '${iconName.toLowerCase()}-transaction-edit')]`
        );
    }

    getSliderForInlineEdit() {
        return this.$(
            `//div[@class='mstrmojo-PopupList ctrl-popup-list mstrmojo-scrollbar-host' and contains(@style, 'display: block')]`
        );
    }

    async waitForSliderForInlineEdit() {
        const slider = await this.getSliderForInlineEdit();
        await slider.waitForDisplayed({ timeout: 10000 });
    }

    async clickConfirmContainerIcon(row, col, visualizationName, iconName) {
        await this.clickOnElement(this.getConfirmContainerIcon(row, col, visualizationName, iconName));
    }

    getSearchableDropdownInputField(row, col, visualizationName) {
        return this.getEditGridCellAtPosition(row, col, visualizationName).$(
            `.//div[contains(@class, 'mstrmojo-ui-SearchablePulldown')]//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    async replaceTextInGridCellAndEnter(row, col, visualizationName, value) {
        const el = this.getInputField(row, col, visualizationName);
        await editorPopup.replaceTextByClickingOnElement(el, value);
        await browser.keys([Key.Enter]);
    }

    async replaceTextInGridCell(row, col, visualizationName, value) {
        const el = this.getInputField(row, col, visualizationName);
        await editorPopup.replaceTextByClickingOnElement(el, value);
    }

    async typeTextInGridCell(row, col, visualizationName, value) {
        const el = this.getInputField(row, col, visualizationName);
        await this.typeTextInElementAfterClickByScript(el, value);
    }

    async replaceTextInSearchableDropdownEditor(row, col, visualizationName, value) {
        const el = await this.getSearchableDropdownInputField(row, col, visualizationName);
        await editorPopup.replaceTextByClickingOnElement(el, value);
    }

    async getAgGridCellPulldownOptionCountByPosition(row, col, visualizationName) {
        return await this.getGridCellByPosition(row, col, visualizationName).$$(
            `.//div[contains(@class, 'mstrmojo-ui-Pulldown')]//div[contains(@class, 'mstrmojo-popupList-scrollBar')]/div/div[contains(@class, 'item')]`
        ).length;
    }

    async doubleClickGridCellByPosition(row, col, visualizationName) {
        const el = await this.getGridCellByPosition(row, col, visualizationName);
        await el.waitForClickable({ timeout: 5000 });
        await el.doubleClick();
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
