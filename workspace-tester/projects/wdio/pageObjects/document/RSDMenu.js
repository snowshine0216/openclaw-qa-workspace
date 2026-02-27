import BasePage from '../base/BasePage.js';

/* Menu bar on RSD page  */
export default class RSDMenu extends BasePage {
    constructor() {
        super('#mstrHamburger', 'Menu on RSD navigation bar');
    }

    // element locator

    findMenuItem(menuItem) {
        return this.$$('.item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(menuItem);
        })[0];
    }

    getToolbar() {
        return this.$('#mstrHamburger');
    }

    getToolbarList() {
        return this.$('#mstrToolbarList');
    }

    getToolbarListItems() {
        return this.getToolbarList().$$('a');
    }

    getZoomPopup() {
        return this.getContainer().$('#mstrZoomPopup');
    }

    getZoomPopupItems() {
        return this.getZoomPopup().$$('a');
    }

    getSaveConfirmButton() {
        return this.$('#dialogBeforeSave').element(by.cssContainingText('.mstrmojo-Button', 'OK'));
    }

    getPopupContent() {
        return this.getToolbarList().$('.mstrmojo-Popup-content');
    }

    // Action helper

    async confirmSave() {
        await this.click({ elem: this.getSaveConfirmButton() });
    }

    /**
     * open menu by path.
     * @param {string[]} menuPaths The menu path
     */
    async openMenu(menuPaths) {
        await this.sleep(500);
        await this.click({ elem: this.getToolbar() });
        await this.waitForElementVisible(this.getPopupContent());
        for (const menuItem of menuPaths) {
            try {
                const el = this.findMenuItem(menuItem);
                await this.click({ elem: el });
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    async openToolBarList() {
        await this.click({ elem: this.getToolbar() });
    }

    async closeToolBarList() {
        await this.getToolbar().click();
        return this.waitForElementDisappear(this.getToolbarListItems()[0]);
    }

    /**
     * Click Nth item of toolbar list
     * @param {*} text the name of text of the item you are going to click, the parameter is reserved for better understanding about the nth item you are going to click
     * @param {*} index the index of the item, which start from 1
     */
    async clickNthItemOfToolbarList(text, index) {
        return this.click(this.getToolbarListItems()[[index - 1]]);
    }

    /**
     * Click Nth item of zoom popup
     * @param {*} text the name of text of the item you are going to click, the parameter is reserved for better understanding about the nth item you are going to click
     * @param {*} index the index of the item, which start from 1
     */
    async clickNthItemOfZoomPopup(text, index) {
        return this.click(this.getZoomPopupItems()[[index - 1]]);
    }

    async isMenuItemPresent(item) {
        return this.findMenuItem(item).isDisplayed();
    }
}
