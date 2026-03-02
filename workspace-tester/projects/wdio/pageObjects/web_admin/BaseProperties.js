import BaseComponent from '../base/BaseComponent.js';
import { scrollIntoView } from '../../utils/scroll.js';
import AdminPage from './WebAdminPage.js';

/**
 * This components will shown when mstrWebAdmin page
 * Default Properties
 */
export default class BaseProperties extends BaseComponent {
    constructor() {
        super('#mstrWeb_content', 'Admin Properties');
    }

    // Locator

    getButtonBar() {
        return this.$('.adminButtonBar');
    }

    getSaveButton() {
        return this.getButtonBar().$('input[value="Save"]');
    }

    getLoadDefaultValuesButton() {
        return this.getButtonBar().$('input[value="Load Default Values"]');
    }

    getRefreshButton() {
        return this.getButtonBar().$('input[value="Refresh"]');
    }

    getButton(value) {
        return this.getButtonBar().$(`input[value=${value}]`);
    }

    getAdminProperties() {
        return this.$('.mstrAdminProperties');
    }

    getPropertyByName(name, index = 1) {
        const elm = this.getAdminProperties()
            .$$('.mstrAdminPropertiesValue, .mstrAdminPropertiesName')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[index - 1];
        return this.getParent(elm);
    }

    getPropertyByValue(value, index = 1) {
        const elm = this.$$('.mstrAdminPropertiesValue, .mstrAdminPropertiesName').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(value);
        })[index - 1];
        return this.getParent(elm);
    }

    getPropertyValueBtn(value, type) {
        return this.getPropertyByValue(value).$(`input[type=${type}]`);
    }

    getPropertyValueRadioBtn(value) {
        return this.getPropertyValueBtn(value, 'radio');
    }

    getPropertyValueCheckboxBtn(value) {
        return this.getPropertyValueBtn(value, 'checkbox');
    }

    getPropertyValueBox(name) {
        return this.getPropertyByName(name).$('input');
    }

    getPropertyValueText(name) {
        return this.getPropertyValueBox(name).getAttribute('value');
    }

    getPropertyValueDropdown(name) {
        return this.getPropertyByName(name).$('.mstrAdminPropertiesValue select');
    }

    getPropertyValueDropdownItem(name, item) {
        return this.getPropertyValueDropdown(name)
            .$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(item);
            })[0];
    }

    // Action helper

    async btnAction(value) {
        await scrollIntoView(this.getButton(value), true);
        await this.click({ elem: this.getButton(value) });
        await this.waitForCurtainDisappear();
    }

    async save() {
        await this.btnAction('Save');
        // return this.waitForElementPresence(adminPage.getAddServerForm(), 'Admin page is not displayed.');
        await this.waitForCurtainDisappear();
    }

    async cancel() {
        const adminPage = new AdminPage();
        await this.btnAction('Cancel');
        return this.waitForElementPresence(adminPage.getAddServerForm(), 'Admin page is not displayed.');
    }

    async loadDefaultValues(checkIntoView = true) {
        if (checkIntoView) {
            await scrollIntoView(this.getLoadDefaultValuesButton(), true);
        }
        await this.click({ elem: this.getLoadDefaultValuesButton() });
        await this.waitForCurtainDisappear();
    }

    async refresh() {
        await this.click({ elem: this.getRefreshButton() });
        await this.waitForCurtainDisappear();
    }

    async saveChange() {
        await this.btnAction('Save');
    }

    async inputPropertyValue(name, value) {
        await this.click({ elem: this.getPropertyValueBox(name) });
        await this.clear({ elem: this.getPropertyValueBox(name) });
        await this.getPropertyValueBox(name).setValue(value);
    }

    async selectPropertyBtn(value, type) {
        if (!(await this.isBtnSelected(value, type))) {
            return this.click({ elem: this.getPropertyValueBtn(value, type) });
        }
    }

    async deselectPropertyBtn(value, type) {
        if (await this.isBtnSelected(value, type)) {
            return this.click({ elem: this.getPropertyValueBtn(value, type) });
        }
    }

    async selectPropertyRadioBtn(value) {
        return this.selectPropertyBtn(value, 'radio');
    }

    async selectPropertyCheckboxBtn(value) {
        return this.selectPropertyBtn(value, 'checkbox');
    }

    async deselectPropertyCheckboxBtn(value) {
        return this.deselectPropertyBtn(value, 'checkbox');
    }

    async openPropertyDropdown(name) {
        await this.click({ elem: this.getPropertyValueDropdown(name) });
    }

    async selectPropertyDropdownItem(name, item) {
        await this.click({ elem: this.getPropertyValueDropdownItem(name, item) });
    }

    // Assertion helper
    async isBtnSelected(value, type) {
        return this.getPropertyValueBtn(value, type).isSelected();
    }

    async isCheckboxBtnSelected(value) {
        return this.isBtnSelected(value, 'checkbox');
    }

    async isRadioBtnSelected(value) {
        return this.isBtnSelected(value, 'radio');
    }

    async propertyDropdownValue(name) {
        return this.getPropertyValueDropdown(name).$('option:selected').getText();
    }
}
