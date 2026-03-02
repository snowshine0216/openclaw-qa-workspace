import AgGrid from './AgGrid.js';
//import utils from '../base/Utils.js';

export default class TxnSwitch extends AgGrid {
    get switchString() {
        return 'switch';
    }

    getTextPath(text) {
        if (!text) {
            return 'not(normalize-space(text()))';
        }
        return utils.getElementText(text);
    }

    getSwitch(row, col, visualizationName) {
        const cell = this.getGridCellByPosition(row, col, visualizationName);
        return cell.$(`.//div[contains(@class, 'mstrmojo-ag-ui-TxnSwitch')]`);
    }

    getSwitchByLabelAndStatus(row, col, visualizationName, isOn, label) {
        const cell = this.getGridCellByPosition(row, col, visualizationName);
        const switchComponent = cell.$(
            `.//div[contains(@class, 'mstrmojo-ag-ui-TxnSwitch') and contains(@aria-checked, '${isOn}') and not(contains(@class, 'unset'))]`
        );
        const textPath = this.getTextPath(label);
        return switchComponent.$(`.//div[contains(@class, 'label') and ${textPath}]`);
    }

    getUnsetSwitchOrCheckbox(row, col, visualizationName) {
        const cell = this.getGridCellByPosition(row, col, visualizationName);
        return cell.$(`.//div[contains(@class, 'mstrmojo-ag-ui-TxnSwitchComponent') and contains(@class, 'unset')]`);
    }

    getCheckboxRoot(row, col, visualizationName) {
        const cell = this.getGridCellByPosition(row, col, visualizationName);
        return cell.$(`.//div[contains(@class, 'mstrmojo-ag-ui-TxnCheckbox')]`);
    }

    getCheckboxByLabelAndStatus(row, col, visualizationName, isOn, label) {
        const checkbox = this.getCheckboxRoot(row, col, visualizationName);
        const textPath = this.getTextPath(label);
        return checkbox.$(
            `.//div[contains(@role, 'checkbox') and contains(@aria-checked, '${isOn}')]//following-sibling::div[contains(@class, 'label') and ${textPath}]`
        );
    }

    async clickSwitch(row, col, visualizationName, switchStyle) {
        let component;

        if (switchStyle === this.switchString) {
            component = this.getSwitch(row, col, visualizationName).$(`.//div[contains(@class, 'container')]`);
        } else {
            component = this.getCheckboxRoot(row, col, visualizationName).$(
                `.//div[contains(@class, 'mstrmojo-ui-Checkbox')]`
            );
        }

        await this.clickOnElement(component);
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
