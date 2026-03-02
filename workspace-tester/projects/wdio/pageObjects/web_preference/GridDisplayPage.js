import BasePreference from './BasePreference.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class GridDisplayPage extends BasePreference {
    // element locator
    getGridStyleDropdown() {
        return this.getDropdownItem('useBuiltInFormat');
    }

    getDefaultGridStyleDropdown() {
        return this.getDropdownItem('defGridStyleID');
    }

    getMaxRowInputbox() {
        return this.getInputboxItem('maxRow');
    }

    getMaxColumnInputbox() {
        return this.getInputboxItem('maxCol');
    }

    getShowAttrDropdown() {
        return this.getDropdownItem('showSubtitle');
    }

    getShowPivotButtonCheckbox() {
        return this.getCheckboxItem('showPivot');
    }

    getShowSortButtonCheckbox() {
        return this.getCheckboxItem('sSrt');
    }

    getShowUnusedAttrCheckbox() {
        return this.getCheckboxItem('showUnusedAttributes');
    }

    getDisplayAxesCheckbox() {
        return this.getCheckboxItem('showEmptyGridAxesInViewMode');
    }

    getEnableWSFormsSortingCheckbox() {
        return this.getCheckboxItem('enableWSFormsSorting');
    }

    getAutoPageByCheckbox() {
        return this.getCheckboxItem('autoPageBy');
    }

    getShowPageByCheckbox() {
        return this.getCheckboxItem('showPageBy');
    }

    getUseImageForOutlineModeCheckbox() {
        return this.getCheckboxItem('useImagesForOutlineMode');
    }

    getWrapRowHeaderCheckbox() {
        return this.getCheckboxItem('wrapRowHeader');
    }

    getWrapMetricValueCheckbox() {
        return this.getCheckboxItem('wrapMetricValue');
    }

    getShowDescriptionAsTooltipCheckbox() {
        return this.getCheckboxItem('showDescriptionAsTooltip');
    }

    getAllowLinkDrillingOnHeaderCheckbox() {
        return this.getCheckboxItem('allowLinkDrillingOnHeader');
    }

    getcheckBoxOption(name) {
        return this.$$('td')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0]
            .$$('input')[0];
    }

    getPageTitle() {
        return this.$$('.mstrPanelTitleBar').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes('Grid display');
        })[0];
    }

    // action helper
    async setGridStyle(value) {
        await this.setValueForDropdown(this.getGridStyleDropdown(), value);
    }

    async setDefaultGridStyle(value) {
        await this.setValueForDropdown(this.getDefaultGridStyleDropdown(), value);
    }

    async inputMaxRows(text) {
        await this.waitForElementClickable(this.getMaxRowInputbox());
        await this.click({ elem: this.getMaxRowInputbox() });
        await this.clear({ elem: this.getMaxRowInputbox() });
        await this.getMaxRowInputbox().setValue(text);
    }

    async inputMaxColumns(text) {
        await this.waitForElementClickable(this.getMaxColumnInputbox());
        await this.click({ elem: this.getMaxColumnInputbox() });
        await this.clear({ elem: this.getMaxColumnInputbox() });
        await this.getMaxColumnInputbox().setValue(text);
    }

    async setShowAttr(value) {
        await this.setValueForDropdown(this.getShowAttrDropdown(), value);
    }

    async checkShowPivot() {
        await this.check(this.getShowPivotButtonCheckbox());
    }

    async checkShowSort() {
        await this.check(this.getShowSortButtonCheckbox());
    }

    async checkShowUnusedAttr() {
        await this.check(this.getShowUnusedAttrCheckbox());
    }

    async uncheckDisplayAxes() {
        await this.uncheck(this.getDisplayAxesCheckbox());
    }

    async uncheckEnableWSFormsSorting() {
        await this.uncheck(this.getEnableWSFormsSortingCheckbox());
    }

    async uncheckAutoPageBy() {
        await this.uncheck(this.getAutoPageByCheckbox());
    }

    async checkShowPageBy() {
        await this.check(this.getShowPageByCheckbox());
    }

    async uncheckUseImageForOutlineMode() {
        await this.uncheck(this.getUseImageForOutlineModeCheckbox());
    }

    async uncheckWrapRowHeader() {
        await this.uncheck(this.getWrapRowHeaderCheckbox());
    }

    async checkWrapMetricValue() {
        await this.check(this.getWrapMetricValueCheckbox());
    }

    async checkShowDescriptionAsTooltip() {
        await this.check(this.getShowDescriptionAsTooltipCheckbox());
    }

    async uncheckAllowLinkDrillingOnHeader() {
        await this.uncheck(this.getAllowLinkDrillingOnHeaderCheckbox());
    }

    async chooseGridOption(name, isChecked) {
        const flag = await this.isOptionChecked(name);
        console.log(' checked status is:' + flag);
        if (isChecked) {
            if (!flag) {
                await this.click({ elem: this.getcheckBoxOption(name) });
            }
        } else if (flag) {
            console.log('unchecked option');
            await this.click({ elem: this.getcheckBoxOption(name) });
        }
        await this.click({ elem: this.getApplyBtn() });
    }

    async isOptionChecked(name) {
        await this.waitForElementVisible(this.getPageTitle());
        const value = await getAttributeValue(this.getcheckBoxOption(name), 'checked');
        return value;
    }

    // assertion helper
    async getGridStyleText() {
        return this.getGridStyleDropdown().$('option[selected]').getText();
    }

    async getDefaultGridStyleText() {
        return this.getDefaultGridStyleDropdown().$('option[selected]').getText();
    }

    async getMaxRowText() {
        return this.getMaxRowInputbox().getAttribute('value');
    }

    async getMaxColumnText() {
        return this.getMaxColumnInputbox().getAttribute('value');
    }

    async getShowAttrText() {
        return this.getShowAttrDropdown().$('option[selected]').getText();
    }

    async isShowPivotButtonChecked() {
        return this.getShowPivotButtonCheckbox().isSelected();
    }

    async isShowSortButtonChecked() {
        return this.getShowSortButtonCheckbox().isSelected();
    }

    async isShowUnusedAttrChecked() {
        return this.getShowUnusedAttrCheckbox().isSelected();
    }

    async isDisplayAxesChecked() {
        return this.getDisplayAxesCheckbox().isSelected();
    }

    async isEnableWSFormsSortingChecked() {
        return this.getEnableWSFormsSortingCheckbox().isSelected();
    }

    async isAutoPageByChecked() {
        return this.getAutoPageByCheckbox().isSelected();
    }

    async isShowPageByChecked() {
        return this.getShowPageByCheckbox().isSelected();
    }

    async isUseImageForOutlineModeChecked() {
        return this.getUseImageForOutlineModeCheckbox().isSelected();
    }

    async isWrapRowHeaderChecked() {
        return this.getWrapRowHeaderCheckbox().isSelected();
    }

    async isWrapMetricValueChecked() {
        return this.getWrapMetricValueCheckbox().isSelected();
    }

    async isShowDescriptionAsTooltipChecked() {
        return this.getShowDescriptionAsTooltipCheckbox().isSelected();
    }

    async isAllowLinkDrillingOnHeaderChecked() {
        return this.getAllowLinkDrillingOnHeaderCheckbox().isSelected();
    }
}
