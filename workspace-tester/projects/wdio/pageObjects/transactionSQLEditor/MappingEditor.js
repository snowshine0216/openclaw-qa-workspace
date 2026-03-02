import TransactionConfigEditor from './TransactionConfigEditor.js';
import Dropdown from './TXNSQLEditorDropdown.js';

const dropdown = new Dropdown();

export default class MappingEditor extends TransactionConfigEditor {
    get mappingEditor() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[contains(@class, 'mapping-editor-section')]//div[contains(@class, 'mapping-editor-layout')]`
        );
    }

    get mappingItemRows() {
        return this.mappingEditor.$$(`.//div[contains(@class, 'mapping-item-row')]`);
    }

    getMappingItemRow(index) {
        return this.mappingItemRows.get(index);
    }

    getMappingEditorTitle(title) {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[contains(@class, 'mapping-editor-section')]//div[contains(@class, 'header-text') and text()='${title}']`
        );
    }

    getWhereClauseMissingMessage(title) {
        const [leftString, rightString] = title.split('"###"');
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[contains(@class, 'mapping-editor-section')]//div[contains(@class, 'message-missing-clause') and text()[contains(.,'${leftString}')] and text()[contains(.,'${rightString}')]]`
        );
    }

    getMappingItemDataTypeIconByIndexAndType(index, type) {
        return this.getMappingItemRow(index).$(
            `.//div[contains(@class, 'data-type-icon')][contains(@class, '${type}')]`
        );
    }

    getMappingItemNameByIndexAndName(index, name) {
        return this.getMappingItemRow(index).$(
            `.//div[contains(@class, 'item-name')]//span[contains(@class, 'item-name-text') and text()='${name}']`
        );
    }

    getMappingItemConditionStatusByIndex(index) {
        return this.getMappingItemRow(index).$(`.//div[contains(@class, 'where-clause-button')]`);
    }

    getMappingItemValueFieldByIndex(index) {
        return this.getMappingItemRow(index).$(`./div[@class='ant-space-item']/div[contains(@class, 'ant-select')]`);
    }

    getMappingItemRowByColumnName(columnName) {
        return this.mappingEditor.$(
            `.//div[@class='ant-space-item']/div[contains(@class, 'table-column-item')]//div[contains(@class, 'txn-data-type-section')]//span[contains(@class, 'item-name-text') and text()='${columnName}']//ancestor::div[contains(@class, 'mapping-item-row')]`
        );
    }

    getMappingItemValueByColumnName(columnName) {
        return this.getMappingItemRowByColumnName(columnName).$(
            `./div[@class='ant-space-item']/div[contains(@class, 'ant-select')]`
        );
    }

    getWhereClauseButton(columnName) {
        return this.getMappingItemRowByColumnName(columnName).$(
            `./div[@class='ant-space-item']//div[contains(@class, 'where-clause-button')]`
        );
    }

    getDeleteButton(columnName) {
        return this.getMappingItemRowByColumnName(columnName).$(
            `./div[@class='ant-space-item']//div[contains(@class, 'delete-mapping-item')]`
        );
    }

    getCurrentSelectionInDropdown(columnName, currentSelection) {
        return dropdown.getCurrentSelectionForInputValue(
            this.getMappingItemValueByColumnName(columnName),
            currentSelection
        );
    }

    getOptionInDropDownList(option) {
        return dropdown.getSelectionForInputValue(option);
    }

    getPlaceholderElementByText(column, text) {
        const rootElement = this.getMappingItemValueByColumnName(column);
        return rootElement.$(
            `.//div[@class='ant-select-selector']//span[@class='ant-select-selection-placeholder' and text()='${text}']`
        );
    }

    async setDropdown(columnName, currentSelection, option) {
        await dropdown.setSelectionForElement(
            this.getCurrentSelectionInDropdown(columnName, currentSelection),
            this.getOptionInDropDownList(option)
        );
    }

    async setWritebackCondition(columnName, isActionCheck) {
        const el = this.getWhereClauseButton(columnName);
        const isStatusChecked = await el.getAttribute('class').then((text) => text.indexOf('checked') !== -1);
        if (isActionCheck !== isStatusChecked) {
            await this.clickOnElement(el);
        }
    }

    getWhereClauseTooltip(text) {
        return $(`//div[contains(@class, 'txn-input-cfg-tooltip') and string()='${text}']`);
    }

    async deleteMappingItemRow(columnName) {
        const el = this.getDeleteButton(columnName);
        await this.clickOnElement(el);
    }

    getInputValueHeaderByText(text) {
        return this.mappingEditor.$(
            `.//div[@class='ant-space-item']/div[contains(@class, 'header-text')]/div[text()='${text}']`
        );
    }

    async validateDataTypeIcon(index, type) {
        const el = this.getMappingItemDataTypeIconByIndexAndType(index, type);
        expect(await this.checkVisibility(el, true)).equal(true);
    }

    async validatTableColumnName(index, columnName) {
        const el = this.getMappingItemNameByIndexAndName(index, columnName);
        expect(await this.checkVisibility(el, true)).equal(true);
    }

    async validateDropdown(columnName, currentSelection) {
        const el = this.getCurrentSelectionInDropdown(columnName, currentSelection);
        expect(await this.checkVisibility(el, true)).equal(true);
    }

    async validateConditionStatus(index, status) {
        const el = this.getMappingItemConditionStatusByIndex(index);
        expect(await el.getAttribute('aria-checked')).equal(status);
    }

    async getDropdownOptions(columnName, currentSelection = 'placeholder') {
        const currentSelectionNode = this.getCurrentSelectionInDropdown(columnName, currentSelection);
        await dropdown.clickOnElement(currentSelectionNode);
        const optionNames = await dropdown.getAllOptionNames();
        return optionNames;
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
