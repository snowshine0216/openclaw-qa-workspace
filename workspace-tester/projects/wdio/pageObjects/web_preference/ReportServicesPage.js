import BasePreference from './BasePreference.js';

export default class ReportServicesPage extends BasePreference {
    // element locator
    getDPIInputBox() {
        return this.$('#dpiConversion');
    }

    getGridDensityDropdown() {
        return this.getDropdownItem('gridDensity');
    }

    getSelectionBehaviorDropdown() {
        return this.getDropdownItem('marqueeSelectionStyle');
    }

    getRsdWidthModeDropdown() {
        return this.getDropdownItem('documentWidthMode');
    }

    getRsdSectionHeightModeDropdown() {
        return this.getDropdownItem('documentSectionHeightMode');
    }

    getOfficeExportRefreshCheckbox() {
        return this.getCheckboxItem('officeExportRefresh');
    }

    getFloatingApplySelectorCheckbox() {
        return this.getCheckboxItem('floatingApplySelectorButton');
    }

    getEmbedFontDropdown() {
        return this.getDropdownItem('embedFontsIVEFlash');
    }

    getDefaultThemeDropdown() {
        return this.getDropdownItem('defaultThemeForAnalysis');
    }

    getRsdExecutionModeDropdown() {
        return this.getDropdownItem('documentExecMode');
    }

    getContentAlignmentDropdown() {
        return this.getDropdownItem('documentLayoutAlignMode');
    }

    getPingServerTimeInputBox() {
        return this.getInputboxItem('keepAlive');
    }

    getUseNLPCheckbox() {
        return this.getCheckboxItem('useNaturalLanguage');
    }

    // action helper
    async inputDotPerInch(text) {
        await this.clear({ elem: this.getDPIInputBox() });
        await this.getDPIInputBox().setValue(text);
    }

    async setGridDensity(value) {
        await this.setValueForDropdown(this.getGridDensityDropdown(), value);
    }

    async setSelectionBehavior(value) {
        await this.setValueForDropdown(this.getSelectionBehaviorDropdown(), value);
    }

    async setRsdWidthMode(value) {
        await this.setValueForDropdown(this.getRsdWidthModeDropdown(), value);
    }

    async setRsdSectionHeightMode(value) {
        await this.setValueForDropdown(this.getRsdSectionHeightModeDropdown(), value);
    }

    async uncheckOfficeExportRefresh() {
        await this.uncheck(this.getOfficeExportRefreshCheckbox());
    }

    async uncheckFloatingApplySelector() {
        await this.uncheck(this.getFloatingApplySelectorCheckbox());
    }

    async setEmbedFontMode(value) {
        await this.setValueForDropdown(this.getEmbedFontDropdown(), value);
    }

    async setDefaultTheme(value) {
        await this.setValueForDropdown(this.getDefaultThemeDropdown(), value);
    }

    async inputPingServerTime(text) {
        await this.clear({ elem: this.getPingServerTimeInputBox() });
        await this.getPingServerTimeInputBox().setValue(text);
    }

    async setRsdExecutionMode(value) {
        await this.setValueForDropdown(this.getRsdExecutionModeDropdown(), value);
    }

    async setContentAlignment(value) {
        await this.setValueForDropdown(this.getContentAlignmentDropdown(), value);
    }

    async uncheckUseNLP() {
        await this.uncheck(this.getUseNLPCheckbox());
    }

    // assertion helper
    async getDPIText() {
        return this.getDPIInputBox().getAttribute('value');
    }

    async getGridDensityText() {
        return this.getGridDensityDropdown().$('option[selected]').getText();
    }

    async getSelectionBehaviorText() {
        return this.getSelectionBehaviorDropdown().$('option[selected]').getText();
    }

    async getRsdWidthModeText() {
        return this.getRsdWidthModeDropdown().$('option[selected]').getText();
    }

    async getRsdSectionHeightModeText() {
        return this.getRsdSectionHeightModeDropdown().$('option[selected]').getText();
    }

    async isOfficeExportRefreshChecked() {
        return this.getOfficeExportRefreshCheckbox().isSelected();
    }

    async isFloatingApplySelectorChecked() {
        return this.getFloatingApplySelectorCheckbox().isSelected();
    }

    async getEmbedFontModeText() {
        return this.getEmbedFontDropdown().$('option[selected]').getText();
    }

    async getDefaultThemeText() {
        return this.getDefaultThemeDropdown().$('option[selected]').getText();
    }

    async getPingServerTimeText() {
        return this.getPingServerTimeInputBox().getAttribute('value');
    }

    async getRsdExecutionModeText() {
        return this.getRsdExecutionModeDropdown().$('option[selected]').getText();
    }

    async getContentAlignmentText() {
        return this.getContentAlignmentDropdown().$('option[selected]').getText();
    }

    async isUseNLPChecked() {
        return this.getUseNLPCheckbox().isSelected();
    }
}
