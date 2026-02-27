import BasePage from '../base/BasePage.js';

export default class Search extends BasePage {
    // Element locators

    getSearchIcon() {
        return this.$('.icon-search_tb_box');
    }

    getSearchContainer() {
        return this.$('.mstrd-SearchNavItemContainer-container .mstrd-SearchBox');
    }

    getSearchButton() {
        return this.getSearchContainer().$('.icon-search_tb_box');
    }

    getSearchInput() {
        return this.getSearchContainer().$('input[type="search"]');
    }

    getFilterOptionsContainer() {
        return this.$('.mstrd-SearchFilter');
    }

    getDossierFilterOption() {
        return this.$('.mstrd-SearchFilter-option.icon-dossier_rs');
    }

    _getSearchResultItems() {
        return this.$$('.mstrd-SearchResultListItem');
    }

    _getSearchResultItemByTitle(title) {
        return this._getSearchResultItems().filter(async (searchResultItem) => {
            const searchResultItemsTitle = await searchResultItem
                .$('.mstrd-SearchResultListItem-titleIcon .highlighted-title')
                .getText();
            return searchResultItemsTitle === title;
        })[0];
    }

    getSearchSuggestion() {
        return this.$('.mstrd-SearchSuggestionTextView');
    }

    getClearIcon() {
        return this.$('.icon-clearsearch');
    }

    getQuickSearchView() {
        return this.$('.mstrd-QuickSearchDropDownView');
    }

    // Action helpers

    async openSearchSlider() {
        await this.click({ elem: this.getSearchIcon() });
    }

    async clickSearchResultInfoIcon(title) {
        await this.sleep(1000);
        await this.waitForElementVisible(this._getSearchResultItemByTitle(title));
        await this._getSearchResultItemByTitle(title).$('.mstrd-DossierInfoIcon').click();
        return this.waitForDynamicElementLoading();
    }

    async clickDossierFilterOption() {
        await this.waitForElementVisible(this.getDossierFilterOption(), {
            msg: 'Dossier filter option does not show.',
        });
        await this.getDossierFilterOption().click();
        return this.waitForDynamicElementLoading();
    }

    // Move this to base
    async inputTextAndOpenSearchPage(text) {
        await this.getSearchInput().setValue(text);
        await this.sleep(1000);
        await this.enter();
        return this.waitForDynamicElementLoading();
    }

    async inputText(text) {
        await this.getSearchInput().setValue(text);
        await this.waitForElementVisible(this.getSearchSuggestion());
        await this.sleep(500); // search suggestion will be retrieved every 0.3s
    }

    async inputTextAndSearch(text) {
        await this.inputText(text);
        await this.enter();
        return this.waitForDynamicElementLoading();
    }

    async clearInput() {
        await this.click({ elem: this.getClearIcon() });
        await this.waitForElementInvisible(this.getSearchSuggestion());
    }

    // Assertion helper
    async isSearchIconPresent() {
        return this.getSearchIcon().isDisplayed();
    }
}
