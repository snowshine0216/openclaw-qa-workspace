import BaseContainer from '../authoring/BaseContainer.js';
//import DocAuthBasePage from '../base/DocAuthBasePage.js';
import Dropdown from '../transactionSQLEditor/TXNSQLEditorDropdown.js';
//import utils from '../base/Utils.js';

//const docAuthBasePage = new DocAuthBasePage();
const dropDown = new Dropdown();

export default class InsertData extends BaseContainer {
    async getAllInsertRowsCount() {
        return $$('.txn-insert-row').count();
    }

    getInsertRows() {
        return $$('.txn-insert-row');
    }

    async getInsertRow(rowIndex) {
        const rows = await this.getInsertRows();
        const idx = parseInt(rowIndex, 10);
        return rows[idx];
    }

    async getInsertColumns(rowIndex) {
        const row = await this.getInsertRow(rowIndex);
        await row.waitForDisplayed({ timeout: 5000 });
        return await row.$$('.txn-insert-col');
    }

    async getInsertColumn(rowIndex, columnIndex) {
        const columns = await this.getInsertColumns(rowIndex);
        return columns[columnIndex];
    }

    getDeleteRowButton(row) {
        return $$(`.delete-column-container .txn-insert-remove`).get(parseInt(row, 10) - 1);
    }

    getHeaderElements() {
        return $$('.txn-insert-headers');
    }

    async getHeaderIdx(headerText) {
        const headers = await this.getHeaderElements();
        let headerIdx = -1;

        for (let i = 0; i < headers.length; i++) {
            const text = await headers[i].getText();
            if (text.trim() === headerText) {
                headerIdx = i;
                break;
            }
        }
        return headerIdx;
    }

    getInlineInsertContainer(containerName) {
        return this.getContainer(containerName).$(`.mstrmojo-TransactionsInlineDialog.visible`);
    }

    async getInsertTextBox(headerText, row, className, tagName = 'span') {
        const insertRow = await this.getInsertRow(row);
        const columns = await insertRow.$$('.txn-insert-col');
        const headerIdx = await this.getHeaderIdx(headerText);
        if (className) {
            return columns[headerIdx].$(`${tagName}.${className}`);
        }
        return columns[headerIdx].$(`input, textarea`);
    }

    async clickHeaderElement(headerText) {
        const headerIdx = await this.getHeaderIdx(headerText);
        const headerElements = await this.getHeaderElements();
        if (headerIdx !== -1) {
            await this.clickOnElement(headerElements[headerIdx]);
        }
    }

    getDropdownInsertTextBox(headerIdx, row) {
        const insertRow = this.getInsertRow(row);
        const columns = insertRow.$$('.txn-insert-col');
        return columns.get(headerIdx).$('.ant-select-selection-item');
    }

    getCurtainNode(containerName) {
        return this.getContainer(containerName).$('.txn-inline-insert-Curtain');
    }

    getInsertContainer(containerName) {
        return this.getContainer(containerName).$('.mstrmojo-insert-txn-container');
    }

    getInsertDialog(containerName) {
        return this.getContainer(containerName).$('.inline-txn-insert-dialog');
    }

    async inputInsertTextBox(inputText, inputElement) {
        await inputElement.waitForDisplayed({ timeout: 5000 });
        await this.scrollIntoView(inputElement);
        await this.clickOnElement(inputElement);
        await this.clearTextByBackSpace(inputElement);
        await browser.keys(inputText);
    }

    async waitForSliderDisappear(IsHidden = true) {
        const slider = await this.getInsertSliderWithoutClick();
        await slider.waitForDisplayed({ timeout: 10000, reverse: IsHidden });
    }

    async typeInsertTextBox(inputText, inputElement) {
        if (inputElement) {
            await this.sleep(1000);
            await inputElement.waitForClickable({ timeout: 5000 });
            await this.clickOnElement(inputElement);
        }
        await browser.keys(inputText);
    }

    async inputInsertTextBoxWithEnter(inputText, inputElement) {
        await inputElement.waitForDisplayed({ timeout: 5000 });
        await this.scrollIntoView(inputElement, 'horizontal');
        await docAuthBasePage.replaceTextByClickingOnElement(inputElement, inputText);
        await browser.keys('Enter');
    }

    async getInsertDropdown(headerText, row) {
        const headerIdx = await this.getHeaderIdx(headerText);
        const insertcell = await this.getInsertColumn(row, headerIdx);
        return insertcell.$('.ant-select-selector');
    }

    async clickOnInsertDropdown(headerIdx, row) {
        const insertDropdown = this.getInsertDropdown(headerIdx, row);
        await this.clickOnElement(insertDropdown);
    }

    async getInsertDropdownOverlay(dropdown) {
        await dropdown.waitForClickable({ timeout: 5000 });
        await this.clickOnElement(dropdown);
        return $('.txn-insert-dropdown-overlay:not(.ant-select-dropdown-hidden)');
    }

    async getInsertSlider(slider) {
        await slider.waitForClickable({ timeout: 5000 });
        await this.clickOnElement(slider);
        return $('.txn-insert-slider-dropdown:not(.ant-select-dropdown-hidden)');
    }

    getInsertSliderWithoutClick() {
        return $('.txn-insert-slider-dropdown:not(.ant-select-dropdown-hidden)');
    }

    // action helper
    /*async dragSliderForInsertData(toOffset) {
        await this.dragAndDrop({
            fromElem: (await this.getInsertSliderWithoutClick()).$('.ant-slider-handle'),
            toElem: (await this.getInsertSliderWithoutClick()).$('.ant-slider-rail'),
            toOffset: toOffset,
        });
    }*/

    getInsertDropdownOverlayWithoutClick() {
        return $('.txn-insert-dropdown-overlay:not(.ant-select-dropdown-hidden)');
    }

    getSearchableDropdownIcon(headerIdx, row) {
        const insertRow = this.getInsertRow(row);
        const columns = insertRow.$$('.txn-insert-col');
        const dropdown = columns.get(headerIdx).$('.txn-insert-dropdown');
        return dropdown.$('.anticon-search');
    }

    getInsertDropdownOption(option) {
        return dropDown.getSelection(option);
    }

    getAllInsertDropdownOptions() {
        const dropdownEl = dropDown.getDropdownListContent();
        return dropdownEl.$$('.ant-select-item-option-content');
    }

    async chooseInsertDropdownOption(option) {
        const ddItem = await dropDown.getSelection(option);
        await dropDown.clickOption(ddItem, 256);
    }

    getInsertInputElements() {
        return $$('.txn-insert-cell, .txn-insert-headers');
    }

    getErrorTooltip(message) {
        return $(`.tooltip-message:contains("${message}")`);
    }

    getErrorStatus(headerIdx, row) {
        return this.getInsertTextBox(headerIdx, row, 'txn-insert-error');
    }

    getButton(button) {
        return $(`.mstrmojo-Button[aria-label="${button}"]`);
    }

    async clickButton(button) {
        const buttonElement = $(`.mstrmojo-Button:not(.disabled) .mstrmojo-Button:contains('${button}')`);
        await this.scrollIntoView(buttonElement, 'both');
        await this.clickOnElement(buttonElement);
    }

    getSuccessMessage(message) {
        return $(`div:contains("${message}")`);
    }

    async addNewRow() {
        const buttonElement = $('.txn-insert-add');
        await this.clickOnElement(buttonElement);
    }

    getNewRowLabelByText(text) {
        return $(`.add-button-text:contains('${text}')`);
    }

    async getNumberOfRows() {
        return (await this.getAllInsertRowsCount()) - 1;
    }

    async deleteRow(row) {
        const el = this.getDeleteRowButton(row);
        await this.clickOnElement(el);
    }

    getInsertSwitch(row, headerIdx) {
        const cell = this.getInsertColumn(row, headerIdx);
        return cell.$(
            `.txn-insert-switch-layout button, .txn-insert-switch-layout label.txn-insert-switch, .txn-insert-switch-layout label.txn-insert-checkbox`
        );
    }

    getInsertSwitchByLabelAndStatus(row, headerIdx, isOn, label) {
        const cell = this.getInsertColumn(row, headerIdx);
        if (label) {
            const text = utils.getElementText(label);
            const switchComponent = cell.$(`.txn-insert-switch-layout[aria-checked='${isOn}']`);
            return switchComponent.$(`.txn-insert-switch-label:contains(${text})`);
        } else {
            return cell.$(`.txn-insert-switch-layout[aria-checked='${isOn}']:not(.txn-insert-switch-label)`);
        }
    }

    async clickSwitchCell(row, headerIdx) {
        const switchCell = this.getInsertSwitch(row, headerIdx);
        await this.clickOnElement(switchCell);
    }

    async clickInsertDataCell(headerIdx, row) {
        const el = await this.getInsertTextBox(headerIdx, row);
        await this.clickOnElement(el);
    }

    async clickDropdownInsertTextBox(headerIdx, row) {
        const el = this.getDropdownInsertTextBox(headerIdx, row);
        await this.clickOnElement(el);
    }
}
