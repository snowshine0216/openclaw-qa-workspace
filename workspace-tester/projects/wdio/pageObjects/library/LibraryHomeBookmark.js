/* eslint-disable prettier/prettier */

import BasePage from '../base/BasePage.js';

export default class LibraryHomeBookmark extends BasePage {
    // Element locators
    getBookmarkEntry() {
        return this.$('.mstrd-DropDown .mstrd-DropDownButton');
    }

    getBookmarkEntryLabel() {
        return this.getBookmarkEntry().$('.mstrd-DropDownButton-label');
    }

    getBookmarkDropdown(){
        return this.$('.mstrd-DropDown-content .mstrd-DropDown-children');
    }

    getDefaultOption() {
        return this.$$('.mstrd-Option').filter(async (elem) => {
            return (await elem.getText()).includes('Default');
        })[0];
    }

    getMyBookmarkGroupLabel(){
        return this.$('//li[@class="mstrd-OptGroup"]//div[contains(text(), "MY BOOKMARKS")]');
    }

    getSharedBookmarkGroupLabel(){
        return this.$('//li[@class="mstrd-OptGroup"]//div[contains(text(), "SHARED WITH ME")]');
    }

    getBookmarkOptionByName(bookmarkName) {
        return this.$(`//div[@role="option"]//div[contains(text(), "${bookmarkName}")]//ancestor::div[@role="option"]`)
    }

    // Action helpers

    async openBookmarkDropdown() {
        await this.click({ elem: this.getBookmarkEntry()});
        await this.waitForElementVisible(this.getBookmarkDropdown(), {
            timeout: 3000,
            msg: 'Bookmark dropdown is not displayed in 3 seconds',
        });
        await this.sleep(500); // Time buffer for full loading
    }

    async clickDefaultOption() {
        await this.click({ elem: this.getDefaultOption()});
        await this.waitForElementStaleness(this.getBookmarkDropdown(), {
            msg: 'Bookmark dropdown is not dismissed',
        });
    }

    async applyBookmark(bookmarkName) {
        await this.click({ elem: this.getBookmarkOptionByName(bookmarkName)});
        await this.waitForElementStaleness(this.getBookmarkDropdown(), {
            msg: 'Bookmark dropdown is not dismissed',
        });
    }

    async clickMyBookmarkLabel() {
        await this.click({ elem: this.getMyBookmarkGroupLabel()});
        return this.sleep(300);
    }

    // Assertion helpers

    async isBookmarkEntryDisplayed() {
        return this.getBookmarkEntry().isDisplayed();
    }

    async isBookmarkDropdownDisplayed() {
        return this.getBookmarkDropdown().isDisplayed();
    }

    async isSharedBookmarkDisplayed() {
        return this.getSharedBookmarkGroupLabel().isDisplayed();
    }

}
