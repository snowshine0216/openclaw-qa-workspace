import TransactionConfigEditor from './TransactionConfigEditor.js';
import Dropdown from './TXNSQLEditorDropdown.js';
import Checkbox from './TXNSQLEditorCheckbox.js';
import { scrollIntoView, scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

const CONFIG_TYPE = {
    dataType: 'dataType',
    editType: 'isRequired',
    controlType: 'controlType',
};

export default class InputConfiguration extends TransactionConfigEditor {
    constructor() {
        super();
        this.dropdown = new Dropdown();
        this.checkbox = new Checkbox();
    }

    getTabContainer() {
        return $(
            `//div[contains(@class, 'ant-tabs-tabpane') and contains(@class, 'ant-tabs-tabpane-active')]//div[@class= 'txn-editor-tab']`
        );
    }

    getInputConfig() {
        return this.getTabContainer().$(`.//div[contains(@class, 'txn-input-cfg-layout')]`);
    }

    getInputConfigPanel() {
        return this.tabContainer.$(
            `.//div[contains(@class, 'txn-input-cfg-layout')]//div[contains(@class, 'ant-collapse-content-active')]`
        );
    }

    getCollapseHeader() {
        return this.inputConfig.$(`.//div[@class='ant-collapse-header']`);
    }

    getInputConfigHeaderByText(text) {
        return this.inputConfig.$(`.//div[@class='input-cfg-expand-title' and text()='${text}']`);
    }

    getInputConfigHeaderSideText(text) {
        return this.inputConfig.$(`.//div[@class='input-cfg-expand-title-side-text' and text()='${text}']`);
    }

    getColHeader(index) {
        return this.inputConfig.$(
            `.//div[contains(@class, 'ag-header-cell')][@role='columnheader'][${index}]//div[@class='input-cfg-data-type-header']`
        );
    }

    getExpandIcon() {
        return this.getInputConfig().$(`.//span[contains(@class, 'input-cfg-expand-icon')]`);
    }

    getInputValueRow(value, txnType = 'SQL') {
        if (txnType == 'python') {
            return this.pythonTxnConfigEditor.$(
                `.//div[text()='${value}']/ancestor::tr[contains(@class, 'ant-table-row')]`
            );
        } else {
            return this.getInputConfig().$(
                `.//div[@col-id='gridFields']//text()[contains(.,'${value}')]/ancestor::div[@role='row'][1]`
            );
        }
    }

    getInputValueRowByIndex(index) {
        return this.inputConfig.$(`.//div[@role='rowgroup']/div[@role='row'][${index}]`);
    }

    getCellByTypeAndInputValue(type, value) {
        let colId;
        switch (type.toLowerCase()) {
            case 'data type':
                colId = CONFIG_TYPE.dataType;
                break;
            case 'editable':
            case 'required':
                colId = CONFIG_TYPE.editType;
                break;
            case 'control type':
                colId = CONFIG_TYPE.controlType;
                break;
            default:
                throw 'Invalid Input Value Type for Dossier Transaction Input Configuration!';
        }
        return this.getInputValueRow(value).$(`.//div[@role='gridcell'][@col-id='${colId}']`);
    }

    getControlTypeSettingButton(value, txnType = 'SQL') {
        if (txnType == 'python') {
            return this.getInputValueRow(value, 'python').$(`.//div[contains(@class,'txn-settings-button')]`);
        } else {
            return this.getCellByTypeAndInputValue('control type', value).$(
                `.//div[contains(@class,'txn-settings-button')]`
            );
        }
    }

    getControlTypeSettingErrorButton(value, txnType = 'SQL') {
        if (txnType == 'python') {
            return this.getInputValueRow(value, 'python').$(
                `.//div[contains(@class,'txn-settings-button') and contains(@class, 'button-error')]`
            );
        } else {
            return this.getCellByTypeAndInputValue('control type', value).$(
                `.//div[contains(@class,'txn-settings-button') and contains(@class, 'button-error')]`
            );
        }
    }

    async isInputConfigPanelDisplayed() {
        return await this.getInputConfigPanel().isDisplayed();
    }

    async clickExpandIcon() {
        const el = this.getExpandIcon();
        await this.clickOnElement(el);
    }

    async clickControlTypeSettingButton(value, txnType = 'SQL') {
        const el = this.getControlTypeSettingButton(value, txnType);
        await this.clickOnElement(el);
    }

    getDropdownListContent() {
        return this.dropdown.getDropdownListContent();
    }

    async getDropdownOptionsCount() {
        return this.dropdown.scrollAndCountOptions();
    }

    getCurrentSelectionInDropdown(type, value, selection) {
        return this.dropdown.getCurrentSelection(this.getCellByTypeAndInputValue(type, value), selection);
    }

    getOptionInDropDownList(option) {
        return this.dropdown.getSelection(option);
    }

    async setDropdown(type, value, currentSelection, option) {
        await this.dropdown.setSelection(this.getCellByTypeAndInputValue(type, value), currentSelection, option);
    }

    async clickDropdown(type, value, currentOption) {
        await this.dropdown.clickOnDropdown(this.getCellByTypeAndInputValue(type, value), currentOption);
    }

    async clickDropdownOption(type, value, option) {
        const ddItem = this.dropdown.getSelection(this.getCellByTypeAndInputValue(type, value), option);
        await this.dropdown.clickOption(this.getCellByTypeAndInputValue(type, value), ddItem);
    }

    async isDropdownDisabled(type, value, expectedFlag) {
        const el = this.dropdown.getDisabledDropdown(this.getCellByTypeAndInputValue(type, value));
        return this.checkVisibility(el, expectedFlag);
    }

    //Python TXN
    async getControlTypeForPython(value) {
        const rowSelector = `.//div[text()='${value}']/ancestor::tr[contains(@class, 'ant-table-row')]`;
        const buttonSelector = `.//div[contains(@class, 'ant-select-selector')]`;

        const row = await this.pythonTxnConfigEditor.$(rowSelector);
        const button = (await row.$$(buttonSelector))[1];

        if (!(await button.isExisting())) {
            throw new Error(`Control type selector not found for row: ${value}`);
        }
        return button;
    }

    async getControlTypeTextForPython(value) {
        const controlTypeButton = await this.getControlTypeForPython(value);
        if (!(await controlTypeButton.isExisting())) {
            throw new Error(`Control type button not found for value: ${value}`);
        }
        return await controlTypeButton.$('.ant-select-selection-item').getText();
    }

    async clickControlType(value) {
        const button = await this.getControlTypeForPython(value);
        await this.clickOnElement(button);
    }

    async isControlTypeAvailable(value) {
        const dropdownContainer = await this.dropdown.getDropdownListContent();
        const options = await dropdownContainer.$$(`.//div[contains(@class, 'ant-select-item-option-content')]`);
        const optionTexts = [];
        for (let i = 0; i < options.length; i++) {
            const text = await options[i].getText();
            optionTexts.push(text);
        }
        return optionTexts.includes(value);
    }

    async setControlType(type) {
        const dropdownContainer = await this.dropdown.getDropdownListContent();
        await this.clickOnElement(dropdownContainer.$(`.//div[@label="${type}"]`));
    }

    async setControlTypeForVariable(type, value) {
        await this.clickControlType(value);
        await (await this.dropdown.getDropdownListContent()).isDisplayed();
        await this.setControlType(type);
    }

    async setGridFieldForPython(value, currentSelection, option) {
        const fieldDropdown = await this.getInputValueRow(value, 'python').$(`.//div[contains(@class, 'grid-field')]`);
        await this.clickOnElement(fieldDropdown);
        const dropdownContainer = await this.dropdown.getDropdownListContent();
        await this.clickOnElement(dropdownContainer.$(`.//div[@label='${option}']`));
    }

    getCheckbox(type, value) {
        return this.checkbox.getCheckbox(this.getCellByTypeAndInputValue(type, value));
    }

    getCheckboxStatusNode(type, value, status) {
        return this.checkbox.getStatusNode(this.getCellByTypeAndInputValue(type, value), status);
    }

    async setCheckbox(type, value, isActionCheck) {
        await this.checkbox.setCheckbox(this.getCellByTypeAndInputValue(type, value), isActionCheck);
    }

    async validateDropdown(type, value, currentSelection, isDisabled) {
        let el;
        if (isDisabled) {
            expect(await this.isDropdownDisabled(type, value, 'true')).to.equal(true);
        } else {
            el = this.getCurrentSelectionInDropdown(type, value, currentSelection);
            await browser.executeScript('arguments[0].scrollIntoView()', el);
            expect(await this.checkVisibility(el, true)).to.equal(true);
        }
    }

    async validateCheckbox(type, value, expectedEditStatus) {
        let el, expectedFlag;
        switch (expectedEditStatus.toLowerCase()) {
            case 'checked':
            case 'unchecked':
                expectedFlag = expectedEditStatus.toLowerCase() === 'checked';
                el = this.getCheckboxStatusNode(type, value, 'checked');
                break;
            case 'disabled':
            case 'enabled':
                expectedFlag = expectedEditStatus.toLowerCase() === 'disabled';
                el = this.getCheckboxStatusNode(type, value, 'disabled');
                break;
            default:
                throw 'Invalid checkbox status in Input Configuration!';
        }
        expect(await this.checkVisibility(el, expectedFlag)).to.equal(true);
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
