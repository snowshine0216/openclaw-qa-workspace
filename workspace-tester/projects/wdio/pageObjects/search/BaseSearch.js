import BasePage from '../base/BasePage.js';

export default class BaseSearch extends BasePage {
    constructor() {
        super();
        this.searchTimeout = this.DEFAULT_TIMEOUT + 10000;
    }

    // Element locators

    getSearchIcon() {
        return this.$('.icon-search_tb_box');
    }

    getSearchContainer() {
        return this.$('.mstrd-SearchNavItemContainer-container .mstrd-SearchBox');
    }

    getSearchInput() {
        return this.getSearchContainer().$('input[type="search"]');
    }

    getSearchSuggestion() {
        return this.$('.mstrd-SearchSuggestionTextView');
    }

    getDeleteIcon() {
        return this.$('.icon-clearsearch');
    }

    getQuickSearchView() {
        return this.$('.mstrd-QuickSearchDropDownView');
    }

    isQuickSearchViewPresent() {
        return this.getQuickSearchView().isDisplayed();
    }

    // Action helpers

    async openSearchSlider() {
        await this.click({ elem: this.getSearchInput() });
        return this.waitForElementVisible(this.getSearchContainer());
    }

    async clickSearchSlider() {
        await this.click({ elem: this.getSearchInput() });
    }

    async inputText(text) {
        await this.inputTextWithoutWait(text);
        await this.sleep(800); // search suggestion will be retrieved every 0.3s
        await this.waitForElementVisible(this.getSearchSuggestion());
    }

    async inputTextWithoutWait(text) {
        // open search slider if it's not present when in homepage (exclude search results page)
        if (!(await this.isSearchBarPresent())) {
            if (await this.isSearchIconPresent()) {
                await this.openSearchSlider();
            }
        }
        await this.sleep(1000); // to avoid duplicate issue which doesn't have fix plan in server
        const inputBox = this.getSearchInput();
        await inputBox.setValue(text);
    }
    async inputTextAndSearch(text) {
        await this.inputTextWithoutWait(text);
        await this.enter();
        await this.waitForDynamicElementLoading();
        await this.waitForCurtainDisappear();
    }

    async clearInput() {
        await this.getSearchInput().click();
        await this.click({ elem: this.getDeleteIcon() });
        await this.waitForElementInvisible(this.getSearchSuggestion());
    }

    // Assertion helper
    async isSearchIconPresent() {
        return this.getSearchIcon().isDisplayed();
    }

    async isSearchBarPresent() {
        return this.getSearchContainer().isDisplayed();
    }
}
