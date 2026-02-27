import BasePage from '../base/BasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class ObjectFolderBrowser extends BasePage {
    // locators
    getFolderBrowserContainer() {
        return this.$('.mstr-object-browser-container');
    }

    getCurrentSelection() {
        return this.getFolderBrowserContainer().$('.mstr-object-select .ant-select-selection-item');
    }

    getLoadingIndicatorOnCurrentSelector() {
        return this.getFolderBrowserContainer().$(`.ant-spin-nested-loading [aria-label='loading']`);
    }

    getFolderBrowserDropdown() {
        return this.$(`.ant-select-dropdown.mstr-folder-tree-style`);
    }

    getFolderItems() {
        return this.getFolderBrowserDropdown().$$(`.ant-select-tree-treenode:not([aria-hidden='true'])`);
    }

    getFolderItemByName(name) {
        return this.$(
            `//span[@class='ant-select-tree-title']//span[text()='${name}']//ancestor::div[contains(@class,'ant-select-tree-treenode')]`
        );
    }

    getExpandIconByFolderName(name) {
        return this.getFolderItemByName(name).$('.ant-select-tree-switcher.ant-select-tree-switcher_close');
    }

    getCollapseIconByFolderName(name) {
        return this.getFolderItemByName(name).$('.ant-select-tree-switcher.ant-select-tree-switcher_open');
    }

    getLoadingSubFolderIndicator() {
        return this.$(`.ant-select-tree-switcher-loading-icon`);
    }

    // actions

    async openObjectSelector() {
        await this.waitForElementInvisible(this.getLoadingIndicatorOnCurrentSelector());
        const isDisplayed = await this.getFolderBrowserDropdown().isDisplayed();
        if (isDisplayed) return;
        await this.click({ elem: this.getCurrentSelection() });
        await this.waitForElementVisible(this.getFolderBrowserDropdown());
        await this.sleep(500);
    }

    async openFolderByPath(path) {
        await this.openObjectSelector();
        for (const folderName of path) {
            await this.waitForElementVisible(this.getFolderItemByName(folderName));
            await scrollIntoView(this.getFolderItemByName(folderName));
            const isCollapsed = await this.getExpandIconByFolderName(folderName).isDisplayed();
            if (!isCollapsed) continue;
            await this.click({ elem: this.getExpandIconByFolderName(folderName) });
            await this.waitForElementInvisible(this.getExpandIconByFolderName(folderName));
            await this.waitForElementInvisible(this.getLoadingSubFolderIndicator());
            await this.waitForElementVisible(this.getCollapseIconByFolderName(folderName));
        }
    }

    async chooseFolderByName(name) {
        await this.waitForElementVisible(this.getFolderItemByName(name));
        await scrollIntoView(this.getFolderItemByName(name));
        await this.click({ elem: this.getFolderItemByName(name) });
        await this.waitForElementInvisible(this.getFolderBrowserDropdown());
        await this.waitForTextAppearInElement(this.getCurrentSelection(), name);
    }
}
