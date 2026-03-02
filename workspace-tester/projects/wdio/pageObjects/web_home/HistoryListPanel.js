import BaseComponent from '../base/BaseComponent.js';

export default class HistoryList extends BaseComponent {
    constructor() {
        super(null, '.mstrDockCenter', 'Listory List Panel');
    }

    // Element locator
    getObjectLinkByName(name) {
        return this.locator.$$('.mstrLink').filter(async (item) => (await item.getText()).includes(name))[0];
    }

    getContextMenu() {
        return this.$('.mstrContextMenuRight');
    }

    // Action Helper
    async openObjectInHistoryList(name) {
        return this.getObjectLinkByName(name).click(); // may raise error popup when open object, so cannot use this.click()
    }

    async OpenObjectContextMenuInHistoryList(name) {
        return this.rightClick({ elem: this.getObjectLinkByName(name) });
    }
 
    async isContextMenuPresent() {
        return this.getContextMenu().isDisplayed();
    }

    // Assertion Helper
    async isObjectInHistoryListPresent(name) {
        const value = await this.getObjectLinkByName(name).isDisplayed();
        return value;
    }
}
