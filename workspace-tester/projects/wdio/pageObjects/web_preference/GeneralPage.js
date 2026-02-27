import BasePreference from './BasePreference.js';
import { getCheckedStatus, getInputValue } from '../../utils/getAttributeValue.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class GeneralPage extends BasePreference {
    // element locator
    getGeneralDropdown(value) {
        const dropdown = this.getPreferencesBody()
            .$$('td')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];
        const parent = this.getParent(dropdown);
        return parent.$('select');
    }

    getDropdownInSection(section, value) {
        const item = this.getPreferenceSection(section)
            .$('table')
            .$$('td')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];
        const parent = this.getParent(item);
        return parent.$('select');
    }

    getGeneralCheckbox(value) {
        const item = this.getPreferencesBody()
            .$$('span')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];
        const parent = this.getParent(item);
        return parent.$('input[type="checkbox"]');
    }

    getCustomFontRadiobutton() {
        return this.$$('input#fontFamilyOption')[1];
    }

    getAvailableFonts() {
        return this.$('#availableFonts');
    }

    getAvailableFontsItems(font) {
        return this.getAvailableFonts()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === font;
            })[0];
    }

    getAddButton() {
        return this.$('#addFont').$('img');
    }

    getRemoveButton() {
        return this.$('#removeFont').$('img');
    }

    getSelectedFonts() {
        return this.$('#selectedFonts');
    }

    getSelectedFontsItems() {
        return this.getSelectedFonts().$$('option');
    }

    getMoveFontUpButton() {
        return this.$('#moveFontUp').$('img');
    }

    getUseDefaultFontRadioButton() {
        return this.$$('#fontFamilyOption')[0];
    }

    getUseDefaultFontSizeRadiobutton() {
        return this.$$('#fontSizeOption')[0];
    }

    getCustomFontSizeRadiobutton() {
        return this.$$('input#fontSizeOption')[1];
    }

    getCustomFontSizeInputBox() {
        return this.$('#fontSize');
    }

    getMSTRLibraryConfigInputBox() {
        return this.$('#consumerWebBaseURL');
    }

    getMSTRLibraryConfigExample() {
        return this.$('#consumerWebBaseURL_label');
    }

    getLinkToDocBtn() {
        return this.$('.preferenceList tr a');
    }

    getLinkToCommunitySection() {
        return this.getPreferencePanel()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Link to Community Connectors:');
            })[0];
    }

    getConnectorsUrlInputBox() {
        return this.$('#connectorWebBaseURL');
    }

    getSearchAutoCompleteDelayInputbox() {
        return this.getInputboxItem('searchAutoCompleteDelay');
    }

    getAvailableBox() {
        return this.$('#availableObjectsList');
    }

    getSelectedBox() {
        return this.$('#selectedObjectsList');
    }

    getAvailableItem(value) {
        return this.getAvailableBox()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === value;
            })[0];
    }

    getSeletedItem(value) {
        return this.getSelectedBox()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === value;
            })[0];
    }

    getRemoveFromSelectedButton() {
        return this.$('.mstrIcon-btn.mstrIcon-btnArrowLeft');
    }

    getAllowQuickSearchCheckbox() {
        return this.getCheckboxItem('enableQuickSearch');
    }

    getAllowAutoSubmitSearchCheckbox() {
        return this.getCheckboxItem('enableSearchAutoComplete');
    }

    getAllowGridViewSearchCheckbox() {
        return this.getCheckboxItem('enableGridViewSearch');
    }

    getSearchObjectTypeCheckbox(value) {
        const parent = this.getPreferenceSection('Search Page:')
            .$$('.mstr-prefs-grid-search-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];
        return parent.$('input');
    }

    getRerunAgainstWarehouseRadioButton() {
        return this.$$('input#reportReexecute')[1];
    }

    getAdminInfoInputbox() {
        return this.$(`textarea[name='${'adminInfo'}']`);
    }

    getMaxSortNumberInputbox() {
        return this.getInputboxItem('maxSort');
    }

    getLocaleDropdown() {
        return this.$('#locale');
    }

    // action helper
    async setValueForGeneralDropdown(value, option) {
        await this.click({ elem: this.getGeneralDropdown(value) });
        const item = await this.getGeneralDropdown(value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
        await this.waitForElementVisible(item);
        await this.waitForElementEnabled(item);
        await item.click();
    }

    async setValueForDropdownInSection(section, value, option) {
        await this.click({ elem: this.getDropdownInSection(section, value) });
        const item = await this.getDropdownInSection(section, value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
        await this.waitForElementVisible(item);
        await this.waitForElementEnabled(item);
        await item.click();
    }

    async checkGeneralSetting(value) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const select = await this.getGeneralCheckbox(value).isSelected();
        // const select = await this.isSelected(this.getGeneralCheckbox(value));
        if (select === false) {
            await this.click({ elem: this.getGeneralCheckbox(value) });
        }
    }

    async uncheckGeneralSetting(value) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const select = await this.getGeneralCheckbox(value).isSelected();
        if (select === true) {
            await this.click({ elem: this.getGeneralCheckbox(value) });
        }
    }

    async setCustomFont(font) {
        await this.click({ elem: this.getCustomFontRadiobutton() });
        await this.click({ elem: this.getAvailableFontsItems(font) });
        await this.click({ elem: this.getAddButton() });
        const count = await this.getSelectedFontsItems().length;
        for (let i = 0; i < count; i++) {
            await this.click({ elem: this.getMoveFontUpButton() });
        }
    }

    async setCustomFontSize(text) {
        await this.click({ elem: this.getCustomFontSizeRadiobutton() });
        await this.click({ elem: this.getCustomFontSizeInputBox() });
        await this.clear({ elem: this.getCustomFontSizeInputBox() });
        await this.getCustomFontSizeInputBox().setValue(text);
    }

    async linkToDoc() {
        await this.click({ elem: this.getLinkToDocBtn() });
    }

    async inputLibraryConfigUrl(text) {
        // await this.getMSTRLibraryConfigInputBox().clear().setValue(text);
        await this.click({ elem: this.getMSTRLibraryConfigInputBox() });
        await this.clear({ elem: this.getMSTRLibraryConfigInputBox() });
        await this.getMSTRLibraryConfigInputBox().setValue(text);
    }

    async inputConnectorUrl(text) {
        // await this.getConnectorsUrlInputBox().clear().setValue(text);
        await this.click({ elem: this.getConnectorsUrlInputBox() });
        await this.clear({ elem: this.getConnectorsUrlInputBox() });
        await this.getConnectorsUrlInputBox().setValue(text);
    }

    async setSearchAutoCompleteDelay(value) {
        // await this.getSearchAutoCompleteDelayInputbox().clear().setValue(value);
        await this.click({ elem: this.getSearchAutoCompleteDelayInputbox() });
        await this.clear({ elem: this.getSearchAutoCompleteDelayInputbox() });
        await this.getSearchAutoCompleteDelayInputbox().setValue(value);
    }

    async removeFromSelected(value) {
        await this.click({ elem: this.getSeletedItem(value) });
        await this.click({ elem: this.getRemoveFromSelectedButton() });
    }

    async uncheckAllowQuickSearch() {
        await this.uncheck(this.getAllowQuickSearchCheckbox());
    }

    async checkAllowQuickSearch() {
        await this.check(this.getAllowQuickSearchCheckbox());
    }

    async uncheckAllowAutoSubmitSearch() {
        await this.uncheck(this.getAllowAutoSubmitSearchCheckbox());
    }

    async uncheckAllowGridViewSearch() {
        await this.uncheck(this.getAllowGridViewSearchCheckbox());
    }

    async uncheckSearchObjectType(value) {
        await this.uncheck(this.getSearchObjectTypeCheckbox(value));
    }

    async setRerunAgainstWarehouse() {
        await this.click({ elem: this.getRerunAgainstWarehouseRadioButton() });
    }

    async setAdminInfo(text) {
        await this.click({ elem: this.getAdminInfoInputbox() });
        await this.clear({ elem: this.getAdminInfoInputbox() });
        await this.getAdminInfoInputbox().setValue(text);
    }

    async setValueForDropDownWithID(id, value) {
        const section = await this.getPreferenceSection('Language');
        const dropdown = section.$(id);
        await this.click({ elem: dropdown });
        const item = await dropdown.$$('option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === value;
        })[0];
        await item.click();
    }

    async setLanguage(value) {
        return this.setValueForDropDownWithID('#locale', value);
    }

    async setLanguageSection(value, unit, timezone) {
        await this.setLanguage(value);
        await this.showAdvancedOptions();
        await this.setNumberDate(value);
        await this.setMetadata(value);
        await this.setWHData(value);
        await this.setIServerMsg(value);
        await this.setUnits(unit);
        await this.setTimeZone(timezone);
    }

    async showAdvancedOptions() {
        const section = await this.getPreferenceSection('Language');
        const btn = section.$('.mstrButton');
        await this.click({ elem: btn });
    }

    async setNumberDate(value) {
        return this.setValueForDropDownWithID('#sLoc', value);
    }

    async setMetadata(value) {
        return this.setValueForDropDownWithID('#localeMD', value);
    }

    async setWHData(value) {
        return this.setValueForDropDownWithID('#localeWHD', value);
    }

    async setIServerMsg(value) {
        return this.setValueForDropDownWithID('#localeMsgs', value);
    }

    async setUnits(value) {
        return this.setValueForDropDownWithID('#units', value);
    }

    async setTimeZone(value) {
        return this.setValueForDropDownWithID('#timeZone', value);
    }

    async inputMaxSortNumber(value) {
        await this.waitForElementClickable(this.getMaxSortNumberInputbox());
        await this.click({ elem: this.getMaxSortNumberInputbox() });
        await this.clear({ elem: this.getMaxSortNumberInputbox() });
        await this.getMaxSortNumberInputbox().setValue(value);
    }

    // assertion helper
    async isGeneralDropdownOptionSelected(value, option) {
        await scrollIntoView(this.getGeneralDropdown(value));
        const item = this.getGeneralDropdown(value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
        return item.isSelected();
    }

    async isDropdownOptionSelectedInSection(section, value, option) {
        const itemInSection = this.getDropdownInSection(section, value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
        return itemInSection.isSelected();
    }

    async isGeneralSettingChecked(value) {
        return this.getGeneralCheckbox(value).isSelected();
    }

    async isUseDefaultFontSelected() {
        return this.getUseDefaultFontRadioButton().isSelected();
    }

    async isUseDefaultFontSizeSelected() {
        return this.getUseDefaultFontSizeRadiobutton().isSelected();
    }

    async getLibraryConfigText() {
        return this.getMSTRLibraryConfigInputBox().getAttribute('value');
    }

    async getMSTRLibraryConfigExampleText() {
        return this.getMSTRLibraryConfigExample().getText();
    }

    async getConnectorsUrlText() {
        return this.getConnectorsUrlInputBox().getAttribute('value');
    }

    async getSearchAutoCompleteDelayText() {
        return getInputValue(this.getSearchAutoCompleteDelayInputbox());
    }

    async isItemExistInAvailableList(value) {
        return this.getAvailableItem(value).isDisplayed();
    }

    async isRerunAgainstWarehouseSelected() {
        return this.getRerunAgainstWarehouseRadioButton().isSelected();
    }

    async localeText() {
        const options = await this.getLocaleDropdown().$('option:checked');
        return options.getText();
    }
}
