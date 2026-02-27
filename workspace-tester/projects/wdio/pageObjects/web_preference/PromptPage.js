import BasePreference from './BasePreference.js';

export default class PromptPage extends BasePreference {
    // Element locator
    getSeparatePageRadioButton() {
        return this.$$('input[name="promptsMode"]')[1];
    }

    getPreserveWhiteSpaceCheckbox() {
        return this.getCheckboxItem('promptsPreserveWhiteSpace');
    }

    getPromptsRequiredFirstCheckbox() {
        return this.getCheckboxItem('promptsRequiredFirst');
    }

    getShowPromptDetailsCheckbox() {
        return this.getCheckboxItem('showPromptDetails');
    }

    getPromptsMatchCaseSensitivityCheckbox() {
        return this.getCheckboxItem('promptsMatchCaseSensitivity');
    }

    getPromptsRenameReportCheckbox() {
        return this.getCheckboxItem('promptsRenameReport');
    }

    getShowObjectDescriptionCheckbox() {
        return this.getCheckboxItem('showObjectDescription');
    }

    getPersonalAnswerCheckbox() {
        return this.getCheckboxItem('ProjectAnswerRestriction');
    }

    getTrimWarehouseDataCheckbox() {
        return this.getCheckboxItem('trimWarehouseData');
    }

    getMQDefaultOperatorDropDown() {
        return this.getDropdownItem('MQDefaultOperator');
    }

    getAQHQDefaultOperatorDropDown() {
        return this.getDropdownItem('AQHQDefaultOperator');
    }

    // Action helper
    async selectSeparatePage(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getSeparatePageRadioButton() });
        await this.applyChanges();
    }

    async checkPreserveWhiteSpace(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getPreserveWhiteSpaceCheckbox());
        await this.applyChanges();
    }

    async checkPromptsRequiredFirst(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getPromptsRequiredFirstCheckbox());
        await this.applyChanges();
    }

    async checkShowPromptDetails(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getShowPromptDetailsCheckbox() });
        await this.applyChanges();
    }

    async checkPromptsMatchCaseSensitivity(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getPromptsMatchCaseSensitivityCheckbox() });
        await this.applyChanges();
    }

    async checkPromptsRenameReport(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getPromptsRenameReportCheckbox() });
        await this.applyChanges();
    }

    async checkShowObjectDescription(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getShowObjectDescriptionCheckbox());
        await this.applyChanges();
    }

    async checkPersonalAnswer(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.click({ elem: this.getPersonalAnswerCheckbox() });
        await this.applyChanges();
    }

    async checkTrimWarehouseData(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.check(this.getTrimWarehouseDataCheckbox());
        await this.applyChanges();
    }

    async setMQDefaultOperatorDropDown(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getMQDefaultOperatorDropDown(), value);
        await this.applyChanges();
    }

    async setAQHQDefaultOperatorDropDown(level, page, value) {
        await this.clickLevelPreferencePage(level, page);
        await this.setValueForDropdown(this.getAQHQDefaultOperatorDropDown(), value);
        await this.applyChanges();
    }
}
