import InputConfiguration from './InputConfiguration.js';
import TXNSQLEditorDropdown from './TXNSQLEditorDropdown.js';
import TXNSQLEditorCheckbox from './TXNSQLEditorCheckbox.js';
import TXNSQLEditorInputNumField from './TXNSQLEditorInputNumField.js';
import TXNSQLEditorTextField from './TXNSQLEditorTextField.js';
import { Key } from 'webdriverio';

const dropdown = new TXNSQLEditorDropdown();
const checkbox = new TXNSQLEditorCheckbox();
const inputNumField = new TXNSQLEditorInputNumField();
const textField = new TXNSQLEditorTextField();

export default class TXNSQLEditorPopup extends InputConfiguration {
    getPopup(title) {
        return this.getTitle(title).$(`.//ancestor::div[contains(@class, 'txn-popover-content')]`);
    }

    get popup() {
        return $(`//div[contains(@class,'txn-popover-content') and not(contains(@class,'hidden'))]`);
    }

    getTitle(name) {
        return this.popup.$(
            `.//div[@class='ant-popover-content']//div[contains(@class, 'txn-popover-title')][text()='${name}']`
        );
    }

    getLabelPath(label) {
        return `.//div[@class='calculated-first-string' or @class='dataset-first-string' or @class='first-line-string' or @class='subtitle' or @class='validation-string' or @class='switch-string'][text()='${label}']`;
    }

    getLabel(title, label) {
        return this.getPopup(title).$(`${this.getLabelPath(label)}`);
    }

    getRootWithLabel(title, label) {
        return this.getPopup(title).$(
            `${this.getLabelPath(
                label
            )}//parent::div[@class='ant-space-item'][1]/following-sibling::div[@class='ant-space-item'][1]`
        );
    }

    getRootWithLabelForCheckbox(title, label) {
        return this.getPopup(title).$(
            `.//span[text()='${label}']//ancestor::label[contains(@class,'ant-checkbox-wrapper')][1]`
        );
    }

    getColumnHeaderOnPopUp(title, header) {
        return this.getPopup(title).$(`.//div[contains(@class, 'manual-string') and text()='${header}']`);
    }

    getConfigurationLabelForDataset(title, header) {
        return this.getPopup(title).$(`.//div[contains(@class, 'dataset-first-string') and text()='${header}']`);
    }

    getManualInputGrid(title) {
        return this.getPopup(title).$(`.//div[contains(@class,'manual-grid-options')]`);
    }

    getManualInputRow(title, index) {
        return this.getManualInputGrid(title).$(
            `.//div[@class='ant-space-item'][${index}]/div[@class='manual-option-layout']`
        );
    }

    getManualInputRowCloseIcon(title, rowIndex) {
        return this.getManualInputRow(title, rowIndex).$(`./div[@class='manual-close-icon']`);
    }

    getManualInputCell(title, rowIndex, colIndex) {
        return this.getManualInputRow(title, rowIndex).$(`.//input[contains(@class,'ant-input')][${colIndex}]`);
    }

    getManualInputErrorCell(title, rowIndex, inputType, txnType = 'SQL') {
        if (txnType === 'python') {
            return this.getManualInputRow(title, rowIndex).$(
                `./div[contains(@class,'ant-input') and contains(@class, 'manual-${inputType}') and contains(@class, 'input-empty-error') or contains(@class, 'input-duplicate-error')]`
            );
        } else {
            return this.getManualInputRow(title, rowIndex).$(
                `./input[contains(@class,'ant-input') and contains(@class, 'manual-${inputType}') and contains(@class, 'input-empty-error') or contains(@class, 'input-duplicate-error')]`
            );
        }
    }

    getDisabledManualInputCell(title, rowIndex, colIndex) {
        return this.getManualInputRow(title, rowIndex).$(
            `./input[contains(@class,'ant-input') and contains(@class, 'disabled')][${colIndex}]`
        );
    }

    getAddValueButton(title) {
        return this.getPopup(title).$(`.//button[contains(@class,'manual-add-button')]`);
    }

    async replaceTextByClickingOnElement(element, newValue) {
        await this.clickOnElement(element);
        await this.clear({ elem: element });
        await this.sleep(1000);
        return await element.setValue(newValue);  
    }

    async setManualInputCell(title, rowIndex, colIndex, newValue) {
        const el = this.getManualInputCell(title, rowIndex, colIndex);
        await this.replaceTextByClickingOnElement(el, newValue);
        await browser.keys([Key.Enter]);
    }

    async clickAddValueButton(title) {
        const el = this.getAddValueButton(title);
        await this.clickOnElement(el);
    }

    async clickManualInputRowCloseIcon(title, rowIndex) {
        const el = this.getManualInputRowCloseIcon(title, rowIndex);
        await this.clickOnElement(el);
    }

    getSwitchRow(title, row) {
        return this.getPopup(title).$(
            `.//span[contains(@class, 'txn-switch-grid-first-column') and text()='${row}']//ancestor::div[contains(@class,'txn-switch-grid-layout')]`
        );
    }

    async getSwitchInputCell(title, row, col) {
        const columnNumber = col === 'value' ? 'second' : 'third';
        let input = this.getSwitchRow(title, row).$(
            `.//div[contains(@class, 'txn-switch-grid-${columnNumber}-column')]/*[local-name()='input' or local-name()='div'][contains(@class, 'txn-switch-input')]`
        );
        const numberInput = input.$(`.//input`);
        const isNumberInputPresent = await numberInput.isPresent();
        if (isNumberInputPresent) {
            input = numberInput;
        }
        return input;
    }

    async getSwitchErrorCell(title, row, col) {
        const inputCell = await this.getSwitchInputCell(title, row, col);
        return inputCell.$(
            `.//ancestor::div/*[local-name()='input' or local-name()='div'][contains(@class, 'txn-switch-input') and contains(@class, 'input-number-error') or contains(@class, 'input-string-error')]`
        );
    }

    async setSwitchInputCell(title, row, col, newValue) {
        const el = await this.getSwitchInputCell(title, row, col);
        if (newValue) {
            await this.replaceTextBySelectingElement(el, newValue);
        } else {
            await this.replaceTextByClickingOnElement(el, newValue);
        }
    }

    async getInputErrorTooltip(tooltipMessage) {
        return $(
            `.//div[contains(@class,'txn-input-cfg-tooltip') and not(contains(@class, 'ant-tooltip-hidden'))]//div[text() = '${tooltipMessage}']`
        );
    }

    getDropdownListContent() {
        return dropdown.getDropdownListContent();
    }

    async getDropdownOptionsCount() {
        return dropdown.scrollAndCountOptions();
    }

    getCurrentSelectionInDropdown(title, label, selection) {
        return dropdown.getCurrentSelection(this.getRootWithLabel(title, label), selection);
    }

    getCurrentSelectionInDropdownWithIcon(title, label, selection) {
        return dropdown.getCurrentSelectionWithIcon(this.getRootWithLabel(title, label), selection);
    }

    getCurrentSelectionForDatasetProperty(title, label, currentSelection) {
        return dropdown.getCurrentSelectionForDatasetProperty(
            this.getRootWithLabel(title, label),
            label,
            currentSelection
        );
    }

    async getDropdownOptionsForDatasetProperty(title, label) {
        const options = dropdown.getDropdownOptionsForDatasetProperty(this.getRootWithLabel(title, label), label);
        const count = await options.count();
        const names = [];
        for (let i = 0; i < count; i++) {
            const text = await options.get(i).getText();
            if (text.length) {
                names.push(text);
            }
        }
        return names;
    }

    getDropdownForDatasetProperty(title, label) {
        return dropdown.getDropdownForDatasetProperty(this.getRootWithLabel(title, label));
    }

    getOptionInDropDownList(option) {
        return dropdown.getSelection(option);
    }

    async setDropdown(title, label, currentSelection, option) {
        await dropdown.setSelection(this.getRootWithLabel(title, label), currentSelection, option);
    }

    async setDropdownWithIcon(title, label, currentSelection, option) {
        await dropdown.setSelectionWithIcon(this.getRootWithLabel(title, label), currentSelection, option);
    }

    async setDropdownWithError(title, label, option) {
        await dropdown.setSelectionWithError(this.getRootWithLabel(title, label), option);
    }

    async clickDropdown(title, label, currentOption) {
        await dropdown.clickOnDropdown(this.getRootWithLabel(title, label), currentOption);
    }

    async clickDropdownOption(option) {
        const ddItem = dropdown.getSelection(option);
        await dropdown.clickOption(ddItem);
    }

    async isDropdownDisabled(title, label, expectedFlag) {
        const el = dropdown.getDisabledDropdown(this.getRootWithLabel(title, label));
        return this.checkVisibility(el, expectedFlag);
    }

    getCheckbox(title, label) {
        return checkbox.getCheckbox(this.getRootWithLabelForCheckbox(title, label));
    }

    getCheckboxStatusNode(title, label, status) {
        return checkbox.getStatusNode(this.getRootWithLabelForCheckbox(title, label), status);
    }

    async setCheckbox(title, label, isActionCheck) {
        await checkbox.setCheckbox(this.getRootWithLabelForCheckbox(title, label), isActionCheck);
    }

    async validateDropdown(title, label, currentSelection, isDisabled) {
        let el;
        if (isDisabled) {
            expect(await this.isDropdownDisabled(title, label, 'true')).equal(true);
        } else {
            el = this.getCurrentSelectionInDropdown(title, label, currentSelection);
            expect(await this.checkVisibility(el, true)).equal(true);
        }
    }

    async validateCheckbox(title, label, expectedEditStatus) {
        let el, expectedFlag;
        switch (expectedEditStatus.toLowerCase()) {
            case 'checked':
            case 'unchecked':
                expectedFlag = expectedEditStatus.toLowerCase() === 'checked';
                el = this.getCheckboxStatusNode(title, label, 'checked');
                break;
            case 'disabled':
            case 'enabled':
                expectedFlag = expectedEditStatus.toLowerCase() === 'disabled';
                el = this.getCheckboxStatusNode(title, label, 'disabled');
                break;
            default:
                throw 'Invalid checkbox status in Input Configuration!';
        }
        expect(await this.checkVisibility(el, expectedFlag)).equal(true);
    }

    getInputNumField(title, label) {
        return inputNumField.getInputNumField(this.getRootWithLabel(title, label));
    }

    getErrorInputNumField(title, label) {
        return inputNumField.getErrorInputNumField(this.getRootWithLabel(title, label));
    }

    async setInputNumField(title, label, newValue) {
        await inputNumField.setInputNumField(this.getRootWithLabel(title, label), newValue);
    }

    async hoverOnErrorInputNumField(title, label) {
        const element = await this.getErrorInputNumField(title, label);
        await this.hover({ elem: element });
        await this.sleep(2000); // wait for tooltip to appear
    }

    getRootForDisplayMsgInput(title) {
        return this.getPopup(title).$(`.//div[@class='display-message-layout']`);
    }

    getDisplayMsgInput(title) {
        return textField.getTextField(this.getRootForDisplayMsgInput(title));
    }

    async setDisplayMsgInput(title, newValue) {
        await textField.setTextField(this.getRootForDisplayMsgInput(title), newValue);
    }

    getTextField(title, label) {
        return textField.getTextField(this.getRootWithLabel(title, label));
    }

    async setTextField(title, label, newValue) {
        await textField.setTextField(this.getRootWithLabel(title, label), newValue);
    }
}
