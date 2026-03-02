import BasePreference from './BasePreference.js';

export default class GraphDisplayPage extends BasePreference {
    // element locator
    getUseSettingStoredRadioButton() {
        return this.$$(`input[name='graphSize']`)[0];
    }

    getUseCustomSettingRadioButton() {
        return this.$$(`input[name='graphSize']`)[1];
    }

    getGraphWidthInputbox() {
        return this.getInputboxItem('graphWidth');
    }

    getGraphHeightInputbox() {
        return this.getInputboxItem('graphHeight');
    }

    getGraphShowGridGraphCheckbox() {
        return this.getCheckboxItem('graphShowGridGraph');
    }

    getImageFormatDropdown() {
        return this.getDropdownItem('graphImageFormat');
    }

    // action helper
    async setUseSettingStored() {
        await this.click({ elem: this.getUseSettingStoredRadioButton() });
    }

    async setUseCustomSetting() {
        await this.click({ elem: this.getUseCustomSettingRadioButton() });
    }

    async inputWidth(width) {
        await this.waitForElementClickable(this.getGraphWidthInputbox());
        await this.click({ elem: this.getGraphWidthInputbox() });
        await this.clear({ elem: this.getGraphWidthInputbox() });
        await this.getGraphWidthInputbox().setValue(width);
    }

    async inputHeight(height) {
        await this.waitForElementClickable(this.getGraphHeightInputbox());
        await this.click({ elem: this.getGraphHeightInputbox() });
        await this.clear({ elem: this.getGraphHeightInputbox() });
        await this.getGraphHeightInputbox().setValue(height);
    }

    async checkGraphShowGridGraph() {
        await this.check(this.getGraphShowGridGraphCheckbox());
    }

    async setImageFormat(value) {
        await this.setValueForDropdown(this.getImageFormatDropdown(), value);
    }

    // assertion helper
    async isUseSettingStoredSelected() {
        return this.getUseSettingStoredRadioButton().isSelected();
    }

    async isUseCustomSettingSelected() {
        return this.getUseCustomSettingRadioButton().isSelected();
    }

    async getWidthText() {
        return this.getGraphWidthInputbox().getAttribute('value');
    }

    async getHeightText() {
        return this.getGraphHeightInputbox().getAttribute('value');
    }

    async isGraphShowGridGraphChecked() {
        return this.getGraphShowGridGraphCheckbox().isSelected();
    }

    async getImageFormatText() {
        return this.getImageFormatDropdown().$('option[selected]').getText();
    }
}
