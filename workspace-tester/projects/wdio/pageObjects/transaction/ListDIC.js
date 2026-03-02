import BaseComponent from '../base/BaseComponent.js';

export default class ListDIC extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-ListDIC .mstrmojo-Pulldown', 'List DIC for TXN');
    }

    getSearchableListInputNode() {
        return this.locator.$('.mstrmojo-SearchableDropDownList-inputNode');
    }

    getSearchableListIconNode() {
        return this.locator.$('.mstrmojo-InputNodeBar').$('.mstrmojo-DropDownButton-iconNode.mstrmojo-Pulldown-iconNode');
    }

    async getListItem(name) {
        // Find the visible dropdown from the whole page and it should be the dropdown opened by ListDIC
        const visibleDropdown = this.$$('.mstrmojo-Pulldown-Popup').filter((item) => item.isDisplayed())[0];
        return visibleDropdown.$$('.mstrmojo-Pulldown-listItem .mstrmojo-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === name.toString();
        })[0];
    }

    async clickSearchableListIconNode() {
        await this.click({ elem: this.getSearchableListIconNode() });
    }

    // action helpers
    async selectListItem(name) {
        await this.waitForElementVisible(this.locator);
        await this.scrollIntoView();
        await this.click({ elem: this.locator });
        await this.click({ elem: await this.getListItem(name) });
        await this.waitDataLoaded();
    }

    async selectSearchableListItem(name) {
        await this.click({ elem: this.getSearchableListIconNode() });
        await this.click({ elem: await this.getListItem(name) });
        await this.waitDataLoaded();
    }

    async selectSearchableListItemBySearch(value) {
        const input = this.getSearchableListInputNode();
        await this.clear({ elem: input });
        await input.setValue(value);
        await this.click({ elem: await this.getListItem(value) });
        await this.waitDataLoaded();
    }

    // assertion helper
    async getListSelection() {
        await this.waitForElementVisible(this.locator);
        return this.locator.$$('.mstrmojo-Pulldown-iconNode')[0].getText();
    }

    async isListDropdownPresent() {
        await this.click({ elem: this.getSearchableListIconNode() });
        const visibleDropdown = this.$$('.mstrmojo-Pulldown-Popup').filter((item) => item.isDisplayed())[0];
        const value = await visibleDropdown.isDisplayed();
        return value;
    }

    async getSelectedTxt() {
        const el = this.locator.$('.mstrmojo-DropDownButton-iconNode.mstrmojo-Pulldown-iconNode');
        return el.getText();
    }

    async getSearchableListSelectedTxt() {
        const el = this.getSearchableListInputNode();
        return el.getAttribute('value');
    }
}
