import BasePage from '../base/BasePage.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class SearchBox extends BasePage {
    // Element locator: Search Box
    getSearchBox() {
        return this.$('.mstrd-SearchBox');
    }

    getSearchIcon() {
        return this.$('.mstrd-SearchNavItemContainer .icon-search_tb_box');
    }

    getInputBox() {
        return this.getSearchBox().$('input');
    }

    getClearSearchIcon() {
        return this.getSearchBox().$('.icon-clearsearch');
    }

    // Element locator: Recently Searched List (opened)
    getRecentlySearchedContainer() {
        return this.$('.mstrd-SearchNavItemContainer-results--recent');
    }

    getRecentlySearchedList() {
        return this.getRecentlySearchedContainer().$$('li.focusable');
    }

    getRecentlySearchedItem(index) {
        return this.getRecentlySearchedList()[index];
    }

    // Action method
    async search(text) {
        if (!(await this.isSearchBoxOpened())) {
            await this.getSearchIcon().click();
            await this.waitForElementClickable(this.getInputBox(), {
                timeout: 2000,
                msg: 'Input Box is not editable.',
            });
        }
        const inputBox = this.getInputBox();
        await inputBox.setValue(text);
        return this.waitForTextPresentInElementValue(this.getInputBox(), text, {
            timeout: 2000,
            msg: 'Text does not show up in input box',
        });
    }

    async clearSearch() {
        await this.getClearSearchIcon().click();
        await browser.waitUntil(
            async () => {
                let isinputBoxEmpty = await this.isInputBoxEmpty();
                return isinputBoxEmpty;
            },
            {
                timeout: 1000,
                timeoutMsg: 'Text is not cleared in input box',
            }
        );
        return this.waitForElementClickable(this.getSearchIcon(), {
            timeout: 2000,
            msg: 'Search Icon is not clickable.',
        });
    }

    async pressEnter() {
        await this.getInputBox().click();
        return this.enter();
    }

    async clearRecentlySearchedItem(index) {
        const elem = this.getRecentlySearchedItem(index);
        const elemText = await elem.getText();
        await this.hover({ elem });
        await elem.$('.icon-clearsearch.show').click();
        return this.waitForTextAppearInElement(this.getRecentlySearchedContainer(), elemText, {
            timeout: 2000,
            msg: 'Recently Searched item is not cleared',
        });
    }

    async clearAllRecentlySearchedItems() {
        await this.getRecentlySearchedContainer().$('.mstrd-QuickSearchResultHeading-matches').click();
        await browser.waitUntil(
            async () => {
                let isrecentSearchEmpty = await this.isRecentlySearchedResultEmpty();
                return isrecentSearchEmpty;
            },
            {
                timeout: 2000,
                timeoutMsg: 'Recently Searched items are not cleared',
            }
        );
    }

    // Assertion helper
    async isInputBoxEmpty() {
        const searchText = await getInputValue(this.getInputBox());
        return searchText === '';
    }

    async isClearSearchIconDisplayed() {
        return this.getClearSearchIcon().isDisplayed();
    }

    async isRecentlySearchedPresent() {
        return this.getRecentlySearchedContainer().isDisplayed();
    }

    async recentlySearchedItemCount() {
        return this.getRecentlySearchedList().length;
    }

    async isRecentlySearchedResultEmpty() {
        const elem = this.$('.mstrd-SearchNavItemContainer-results--empty');
        const elemDisplayed = await elem.isDisplayed();
        const elemText = await elem.getText();
        return elemDisplayed && elemText === 'No recent search history';
    }

    async isSearchBoxOpened() {
        return this.getSearchBox().isDisplayed();
    }
}
