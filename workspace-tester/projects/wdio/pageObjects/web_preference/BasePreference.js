import WebBasePage from '../base/WebBasePage.js';
import ToolBar from './ToolBar.js';
import NavigationBar from './NavigationBar.js';
import { getInputValue, getCheckedStatus } from '../../utils/getAttributeValue.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class BasePreference extends WebBasePage {
    constructor() {
        super();
        this.toolBar = new ToolBar();
        this.navigationBar = new NavigationBar();
    }

    // element locator
    getPreferencePanel() {
        return this.$('.mstrPanelPortrait');
    }

    getPreferencesBody() {
        return this.$('.mstrPanelBody');
    }

    getPreferenceToolbar() {
        return this.$('.mstrToolbarGroup');
    }

    getDefaultStartPage(index) {
        return this.$$('[name="startPageSource"]')[index];
    }

    getPanelButtonBar() {
        return this.$('.mstrPanelButtonBar');
    }

    getApplyBtn() {
        return this.getPanelButtonBar().$(`input[value='Apply']`, `input[value='Zastosuj']`);
    }

    getLoadDefaultValueBtn() {
        return this.getPanelButtonBar().$(
            `input[value='Load Default Values'], input[value='Załaduj wartości domyślne']`
        );
    }

    getUpdateConfirmation() {
        return this.$('.mstrPrefUpdateConfirmation');
    }

    getErrorAlert() {
        return this.$('.mstrAlertTitle');
    }

    getConfirmMessage() {
        return this.$('.mstrPrefUpdateConfirmation, .mstrAlertTitle');
    }

    getApplyToDropdown() {
        return this.getPanelButtonBar().$('select[name="allProjects"]');
    }

    getDropdownItem(name) {
        return this.$(`select[name='${name}']`);
    }

    getCheckboxItem(name) {
        return this.$(`input[name='${name}']`);
    }

    getInputboxItem(name) {
        return this.$(`input[name='${name}']`);
    }

    getAlertDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-alert.modal');
    }

    getDropdown(value) {
        return this.getPreferencesBody()
            .$$('td')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0]
            .$('select');
    }

    getPreferenceSection(section) {
        return this.getPreferencePanel()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(section);
            })[0];
    }

    getCheckbox(value) {
        const item = this.getPreferencesBody()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];
        return item.$(`input[type='checkbox']`);
    }

    getInputbox(label) {
        const child = this.getPreferencesBody()
            .$$('span')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(label);
            })[0];
        const section = this.getParent(child);
        return section.$(`input[type='text']`);
    }

    getLabel(label) {
        return this.getPreferencesBody()
            .$$('span')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(label);
            })[0];
    }

    // action helper

    async applyChanges() {
        await this.toolBar.applyChanges();
    }

    async closePreferencePage() {
        await this.toolBar.close();
    }

    async apply() {
        await this.click({ elem: this.getApplyBtn() });
    }

    async clickLoadDefaultValueBtn() {
        await this.click({ elem: this.getLoadDefaultValueBtn() });
    }

    async loadDefaultValue(level, page) {
        await this.clickLevelPreferencePage(level, page);
        await this.waitForElementVisible(this.getPreferencePanel());
        const exist = await this.isLoadDefaultValueBtnExisted();
        if (exist === true) {
            await this.clickLoadDefaultValueBtn();
            await this.applyChanges();
            await this.waitForElementVisible(this.getPreferencePanel());
        }
    }

    async check(el) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const select = await el.isSelected();
        if (select === false) {
            await this.click({ elem: el });
        }
    }

    async checkSetting(value) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const select = await this.getCheckbox(value).isSelected();
        if (select === false) {
            await this.click({ elem: this.getCheckbox(value) });
        }
    }

    async uncheck(el) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const select = await el.isSelected();
        if (select === true) {
            await this.click({ elem: el });
        }
    }

    async uncheckSetting(value) {
        await this.waitForElementVisible(this.getPreferencePanel());
        const select = await this.getCheckbox(value).isSelected();
        if (select === true) {
            await this.click({ elem: this.getCheckbox(value) });
        }
    }

    async inputSetting(label, value) {
        await this.waitForElementVisible(this.getPreferencePanel());
        await this.waitForElementVisible(this.getInputbox(label));
        await this.click({ elem: this.getInputbox(label) });
        await this.clear({ elem: this.getInputbox(label) });
        await this.getInputbox(label).setValue(value);
    }

    async clickChangePasswordBtn() {
        await this.click({ elem: this.navigationBar.getChangePassordBtn() });
    }

    async waitForComfirmMessageAppear() {
        await this.waitForElementVisible(this.getConfirmMessage());
    }

    async scrollPreferenceIntoView() {
        const el = this.$('.mstrWeb');
        await scrollIntoView(el);
    }

    /**
     * Open preference page by Preferences Level and Preferences in lefttoolbar
     * @param {string} level The preferences level including User Preferences level and Project Defaults Level
     * @param {string} page The preference page including General, Folder Browsing etc.
     */

    async clickLevelPreferencePage(level, page) {
        await this.navigationBar.clickLevelPreferencePage(level, page);
    }

    async setValueForDropdown(dropdown, value) {
        await this.click({ elem: dropdown });
        const item = await dropdown.$$('option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(value);
        })[0];
        await this.waitForElementVisible(item);
        await item.click();
    }

    async setValueForDropdownsetting(value, option) {
        await this.click({ elem: this.getDropdown(value) });
        const item = await this.getDropdown(value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(option);
            })[0];
        await this.click({ elem: item });
    }

    async setApplyTo(value) {
        await this.setValueForDropdown(this.getApplyToDropdown(), value);
    }

    // assertion helper

    async getUpdateConfirmationText() {
        await this.waitForElementVisible(this.getUpdateConfirmation());
        return this.getUpdateConfirmation().getText();
    }

    async getErrorAlertText() {
        await this.waitForElementVisible(this.getErrorAlert());
        return this.getErrorAlert().getText();
    }

    async isLoadDefaultValueBtnExisted() {
        await this.scrollWebPageToBottom();
        return this.getLoadDefaultValueBtn().isDisplayed();
    }

    async clickDefaultStartPage(index) {
        await this.click({ elem: this.getDefaultStartPage(index) });
    }

    async isSettingChecked(value) {
        await scrollIntoView(this.getCheckbox(value));
        return getCheckedStatus(this.getCheckbox(value));
    }

    async isDropdownOptionSelected(value, option) {
        const item = await this.getDropdown(value)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(option);
            })[0];
        return item.isSelected();
    }

    async getInputboxText(label) {
        const text = await getInputValue(this.getInputbox(label));
        return text;
    }

    async getCellCssValue(label, cssName) {
        const attributeText = await this.getLabel(label).getCSSProperty(cssName);
        return attributeText.value;
    }
}
