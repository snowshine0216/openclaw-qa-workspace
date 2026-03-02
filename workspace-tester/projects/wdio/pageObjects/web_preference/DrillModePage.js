import BasePreference from './BasePreference.js';

export default class DrillModePage extends BasePreference {
    // Element locator
    getKeepParentDropdown() {
        return this.getDropdownItem('drillRetainParent');
    }

    getKeepThresholdsDropDown() {
        return this.getDropdownItem('drillRetainThresholds');
    }

    getOpenInNewWindowCheckbox() {
        return this.getCheckboxItem('drillOpenInNewWindow');
    }

    getDrillWithinBehaviorDropdown() {
        return this.getDropdownItem('rwDrillWithinMode');
    }

    getGroupDrillOptionsCheckbox() {
        return this.getCheckboxItem('groupContextMenuDrillPathsByType');
    }

    getSortDrillPathCheckbox() {
        return this.getCheckboxItem('sortSetNamesAndDrillPaths');
    }

    getDisableHyperLinkCheckbox() {
        return this.getCheckboxItem('drillDisableHyperlinkDrill');
    }

    getReportDrillOptionsDropdown() {
        return this.getDropdownItem('drillOption');
    }

    getRsdDrillOptionsDropdown() {
        return this.getDropdownItem('rwDrillOption');
    }

    getEnableContextMenuDrillingCheckbox() {
        return this.getCheckboxItem('drillEnableContextMenuDrill');
    }

    getLinkToAdvancedRadioButton() {
        return this.getCheckboxItem('advancedDrillingContextMenuDisplay');
    }

    getSubMenuesRadioButton() {
        return this.$$('input[name="advancedDrillingContextMenuDisplay"]')[1];
    }

    // Action helper
    async setKeepParent(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getKeepParentDropdown(), value);
        await this.applyChanges();
    }

    async setKeepThresholds(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getKeepThresholdsDropDown(), value);
        await this.applyChanges();
    }

    async checkOpenInNewWindow(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getOpenInNewWindowCheckbox());
        await this.applyChanges();
    }

    async setDrillWithinBehavior(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getDrillWithinBehaviorDropdown(), value);
        await this.applyChanges();
    }

    async checkGroupDrill(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getGroupDrillOptionsCheckbox());
        await this.applyChanges();
    }

    async checkSortDrillPath(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getSortDrillPathCheckbox());
        await this.applyChanges();
    }

    async checkDisableHyperLink(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getDisableHyperLinkCheckbox());
        await this.applyChanges();
    }

    async setReportDrillOption(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getReportDrillOptionsDropdown(), value);
        await this.applyChanges();
    }

    async uncheckEnableContextMenuDrilling(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getEnableContextMenuDrillingCheckbox() });
        await this.applyChanges();
    }

    async selectDisplayAdvancedDrillAsSubMenus(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getSubMenuesRadioButton() });
        await this.applyChanges();
    }

    async setRsdDrillOption(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getRsdDrillOptionsDropdown(), value);
        await this.applyChanges();
    }
    // assersion helper
}
