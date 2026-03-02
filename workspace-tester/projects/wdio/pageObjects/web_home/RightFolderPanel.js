import BaseComponent from '../base/BaseComponent.js';
import PrimarySearch from './PrimarySearch.js';
/**
 * This object is used to handle all manipulations happened on the right folder panel
 */
export default class RightFolderPanel extends BaseComponent {
    constructor(locator = '#folderAllModes') {
        super(null, locator, 'Create right folder panel');
        this.sortTypes = {
            NAME: 'Name',
            OWNER: 'Owner',
            MODIFIED: 'Modified',
            DESCRIPTION: 'Description'
        };
        this.primarySearch = new PrimarySearch();
    }

    getCreateItem(item) {
        return this.$$(`#dktpSectionCreate .mstr-dskt-nm`).filter(async el => (await el.getText()).includes(item))[0];
    }

    async getFolderItem(itemName) {
        const className = await this.$('#tbListView').getAttribute('class');
        if (className.indexOf('selected') >= 0) {
            return this.getElement().$(`.mstrListViewNameInfo a[title="${itemName}"]`);
        }

        return this.getIconViewItem(itemName).$('.mstrLargeIconViewItemLink');
    }

    /**
     * Get the item with related all elements, including the Name, Owner, Modified, Description
     * @param {String} itemName item name
     * @returns {ElementFinder} return the elemnet
     */
    getIconViewItem(itemName) {
    
        return this.getElement()
            .$$('.mstrLargeIconViewItem')
            .filter(item => item.$$(`a[title="${itemName}"]`).length.then(count => count > 0))
            [0];
    }

    /**
     * Get the item with related all elements, including the Name, Owner, Modified, Description
     * @param {String} itemName item name
     * @returns {ElementFinder} return the elemnet
     */
    getListViewItem(itemName) {
        return this.getElement().$$('tr').filter(async (item) => {
            const itemCount  = await item.$$(`.mstrListViewNameInfo a[title="${itemName}"]`).length;
            return itemCount > 0;
        })[0];
    }

    getRightClickMenu() {
        return this.$('#folderAllModes_cmm1');
    }

    getRightClickSecondaryMenu() {
        return this.$('#folderAllModes_cmm2');
    }

    getSortLocator(sortType) {
        return this.$('.mstrListView-locked #FolderList').$$('thead td').filter(async (el) => (await el.getText()).includes(sortType))[0];
    }

    async isListView() {
        const className = await this.$('#tbListView').getAttribute('class');
        return className.indexOf('selected') >= 0;
    }

    // Action Helper

    async hoverToItem(text) {
        let item = await this.getFolderItem(text);
        if (await this.isListView()) {
            item = this.getListViewItem(text);
        }
        return this.hover({ elem: item });
    }

    async rightClickItem(text) {
        let el = null;
        if (await this.isListView()) {
            el = this.getListViewItem(text).$$('td')[1];
        } else {
            el = await this.getFolderItem(text);
        }

        await this.rightClick({ elem: el });
        await this.waitForElementVisible(this.getRightClickMenu());
    }

    async clickItem(text) {
        await this.click({ elem: await this.getFolderItem(text) });
    }

    /**
     * Click menu item
     * @example
     * Right click on an folder, there will be pop up,
     * you can call as openMenu(['New','Prompt','Create Prompt...']) to execute 'New' > 'Prompt' > 'Create Prompt...'
     * @param {String[]} menuPaths menu path array
     */
    async openMenu(menuPaths) {
        for (const [level, menuItem] of menuPaths.entries()) {
            const currentMenuId = '#folderAllModes_cmm' + (level + 1);
            const currentMenuItem = (await this.$(currentMenuId)).$$('td').filter(async (el) => (await el.getText()).includes(menuItem))[0];
            this.click({ elem: currentMenuItem });
        }
    }

    async share(text) {
        let rmcMenu = this.getRightClickMenu();
        while (true) {
            try {
                await this.rightClickItem(text);
                rmcMenu = this.getRightClickMenu();
                await this.waitForElementVisible(rmcMenu);
                break;
            } catch (e) {
                console.log('[Info]: context menu is now shown after right click');
            }
        }
        const shareOption = rmcMenu.$$('td').filter(async el => (await el.getText()).includes('Share'))[0];
        await this.click({ elem: shareOption });
        await this.waitForElementVisible($('#sharingEditor,.mstrmojo-di-permissions'));
    }

    async findDependents(text) {
        await this.rightClickItem(text);
        await this.openMenu(['Find Dependents...']);
        await this.primarySearch.waitForSearchResults();
    }

    async openRunAs() {
        await this.openMenu(['Run as']);
        await this.waitForElementVisible(this.getRightClickSecondaryMenu());
    }

    async openInLibrary(text) {
        await this.rightClickItem(text);
        const el = this.$$('.menu-item').filter(async (elem) => (await elem.getText()).includes('Open in Library'))[0];
        await this.click({ elem: el });
    }

    /**
     * Click list headers to sort folder by sortType
     * @param {String} sortType sortType shoule be 'Name', 'Owner', 'Modified', 'Description'
     */
    async sortFolderBy(sortType) {
        return this.click({ elem: this.getSortLocator(sortType) });
    }

    // Assersion helper

    async getFolderItemNamTextWidth(name) {
        const elem = await this.getFolderItem(name);
        const parent = this.getParent(elem);
        const size = await parent.getSize();
        return size.width;
    }

    async isItemWithLargeIcon(text) {
        return this.$(`.mstrLargeIconViewItem a[title="${text}"]`).isDisplayed();
    }

    async isItemInRightPanel(itemName) {
        const isListView = await this.isListView();
        let itemNum = 0;
        if (isListView) {
            itemNum = await this.getElement().$$(`.mstrListViewNameInfo a[title="${itemName}"]`).length;
        } else {
            itemNum = await this.getIconViewItem(itemName).$$('.mstrLargeIconViewItemLink').length;
        }
        return itemNum > 0;
    }

    async isItemsDisplayedAsList() {
        const n = await this.$$('#FolderList').length;
        return n > 0;
    }

    async getItemDescription(itemName) {
        const isListView = await this.isListView();
        if (isListView) {
            return this.getListViewItem(itemName).$('.desc').getText();
        }
        return this.getIconViewItem(itemName).$('.mstrLargeIconViewItemDescription').getText();
    }

    /**
     * Resize folder header
     * @param {String} headerName header name
     * @param {Number} toOffsetParam y axis offset
     */
    async dragHeaderColumnWidth(headerName, toOffsetParam) {
        // There are 2 FolderList, we need to move to the second to get the focus
        const header = this.$$('#FolderList')[0].$$('thead td').filter(async el => (await el.getText()).includes(headerName))[0];

        // IE can only use executeScript to trigger mstrListView-rzHandle
        const el = header;
        const eventData = await this._patchMouseEvent(el);
        /* eslint-disable */
        await browser.driver.executeScript(function injectedScript(el, eventData) {
            var e = document.createEvent('MouseEvent');
            e.initMouseEvent('mousedown', true, true, window, 0,
                eventData.screenX, eventData.screenY,
                eventData.clientX, eventData.clientY,
                false, false, false, false, 0, null);
            el.dispatchEvent(e);
        }, el.getWebElement(), eventData);
        /* eslint-enable */

        await browser.actions().mouseDown().perform();
        // The resize handler locator will not attached to DOM for the first time
        // so it's safe to declare the element here after resize handler triggered
        const resizeHandler = this.$('.mstrListView-rzHandle');
        // Drap the resize handler
        await browser.actions().mouseMove(resizeHandler).perform();
        await browser.actions().mouseMove({ x: toOffsetParam, y: 0 }).perform();
        await browser.actions().mouseUp().perform();
    }

    async isCreateItemDisabled(item) {
        const value = await this.isDisabled(this.getCreateItem(item));
        return value;
    }

    async isCreateItemPresent(item) {
        return this.getCreateItem(item).isDisplayed();
    }

    async isSubscribeDisabled(name) {
        let item = await this.getFolderItem(name);
        if (await this.isListView()) {
            item = this.getListViewItem(name);
        }
        const el = item.$('#tbSubscribe');
        let value = await el.isDisplayed();
        if (value) {
            value = await this.isDisabled(el);
        } else {
            value = true;
        }
        return value;
    }

    async isSendNowDisabled(name) {
        let item = await this.getFolderItem(name);
        if (await this.isListView()) {
            item = this.getListViewItem(name);
        }
        const el = item.$('#tbSend');
        let value = await el.isDisplayed();
        if (value) {
            value = await this.isDisabled(el);
        } else {
            value = true;
        }
        return value;
    }
}
