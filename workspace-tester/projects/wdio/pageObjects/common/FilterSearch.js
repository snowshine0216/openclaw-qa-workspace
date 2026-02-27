import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class FilterSearch extends BasePage {
    // Element locator

    getFilterSearchBox() {
        return this.$('.mstrd-FilterSearchBox');
    }

    getSearchBox() {
        return this.getFilterSearchBox().$('#search-box');
    }

    getSearchBoxWithKeyword(keyword) {
        return this.getFilterSearchBox().$(`#search-box[value='${keyword}']`);
    }

    getSearchWarningMsg() {
        return this.$('.mstrd-FilterItemsList-warn-msg');
    }

    getClearSearchIcon() {
        return this.getFilterSearchBox().$('.icon-clearsearch');
    }

    getSearchResults() {
        return this.$('.mstrd-SearchStyleFilterDetailsPanel-result');
    }

    getEmptySearchImage() {
        return this.$('.mstrd-SearchStyleFilterItemsList-image');
    }

    // Action helper

    async search(keyword) {
        await this.getSearchBox().setValue(keyword);
        await this.waitForElementVisible(this.getSearchBoxWithKeyword(keyword), {
            timeout: 5000,
            msg: 'Rendering search keyword takes too long.',
        });
        await this.sleep(1000); // wait for search warning msg appear
        await this.waitForElementInvisible(this.getSearchWarningMsg(), {
            timeout: 5000,
            msg: 'Updating element list takes too long.',
        });
    }

    async clearSearch() {
        await this.getClearSearchIcon().click();
        return this.waitForElementInvisible(this.getClearSearchIcon(), {
            timeout: 5000,
            msg: 'Clearing search takes too long.',
        });
    }

    // Assertion helper

    async keyword() {
        const value = await getAttributeValue(this.getSearchBox(), 'value');
        return value;
    }

    async isClearSearchIconPresent() {
        return this.getClearSearchIcon().isDisplayed();
    }

    async isEmptySearchDisplayed() {
        await this.waitForElementVisible(this.getEmptySearchImage(), {
            timeout: 5000,
            msg: 'Rendering search image takes too long.',
        });
        return this.getEmptySearchImage().isDisplayed();
    }

    async searchboxPlaceholder() {
        const value = await getAttributeValue(this.getSearchBox(), 'placeholder');
        return value;
    }

    async searchResults() {
        await this.sleep(3000); // Wait for the count getting updated
        await this.waitForElementVisible(this.getSearchResults(), {
            timeout: 5000,
            msg: 'Search result is not displayed',
        });
        return this.getSearchResults().getText();
    }

    async isSearchWarningMsgPresent() {
        return this.getSearchWarningMsg().isDisplayed();
    }
}
