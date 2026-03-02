import DossierPage from '../dossier/DossierPage.js';
import BaseSearch from './BaseSearch.js';

export default class QuickSearch extends BaseSearch {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
    }

    // Element locator

    getSearchSuggestionTextView() {
        return this.$('.mstrd-SearchSuggestionTextView');
    }

    getSearchSuggestionShortcuts() {
        return this.$('.mstrd-SearchSuggestionShortcuts');
    }

    getRecentlySearchedView() {
        return this.getQuickSearchView().$('.mstrd-RecentlySearchedView');
    }

    getRecentlyViewedShortcuts() {
        return this.getQuickSearchView().$('.mstrd-RecentlyViewedShortcuts');
    }

    getSearchSuggestionTextItems() {
        return this.getSearchSuggestionTextView().$$('.mstrd-SearchSuggestionTextView-suggestion');
    }

    getSearchSuggestionText(index) {
        return this.getSearchSuggestionTextItems()[index - 1];
    }

    getSearchSuggestionShortcutsItems() {
        return this.getSearchSuggestionShortcuts().$$('.mstrd-QuickSearchShortcutItem');
    }

    getSearchSuggestionShortcutLink(index) {
        return this.getSearchSuggestionShortcutsItems()[index - 1].$('.mstrd-QuickSearchShortcutItem-name');
    }

    getViewAllResults() {
        return this.getQuickSearchView().$('.mstrd-QuickSearchDropDownView-viewAll');
    }

    getSearchResultsContainer() {
        return this.$('.mstrd-SearchResultsListContainer');
    }

    getRecentlySearchedKeywords() {
        return this.getRecentlySearchedView().$('.mstrd-RecentlySearchedView-keywords');
    }

    getRecentlySearchedKeywordsItems() {
        return this.getRecentlySearchedKeywords().$$('.ant-tag');
    }

    getRecentSearchedTextByIndex(index) {
        return this.getRecentlySearchedKeywordsItems()[index - 1].getText();
    }

    getRecentlyViewedShortcutsItems() {
        return this.getRecentlyViewedShortcuts().$$('.mstrd-QuickSearchShortcutItem');
    }

    getRecentlyViewedShortcutsNameByIndex(index) {
        return this.getRecentlyViewedShortcuts().$$('.mstrd-QuickSearchShortcutItem-name')[index - 1].getText();
    }

    getShortcutLinkByName(el, name) {
        return el
            .$$('.mstrd-QuickSearchShortcutItem')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text.includes(name);
            })[0]
            .$('.mstrd-QuickSearchShortcutItem-details');
    }

    getSearchSuggestionShortcutLinkByName(name) {
        return this.getShortcutLinkByName(this.getSearchSuggestionShortcuts(), name);
    }

    getRecentlyViewedShortcutLinkByName(name) {
        return this.getShortcutLinkByName(this.getRecentlyViewedShortcuts(), name);
    }

    getClearIcon(el) {
        return el.$('.mstrd-Button.mstrd-Button--clear.mstrd-Button--primary');
    }

    getRecentlyViewedShortcutName(index) {
        return this.getRecentlyViewedShortcutsItems()[index - 1].$('.mstrd-QuickSearchShortcutItem-name').getText();
    }

    getSearchSuggestionObjectTypeIcon(name) {
        return this.getSearchSuggestionShortcutLinkByName(name).$('.mstr-icons-lib-icon');
    }

    getSearchSuggestionRunAsIcon(name) {
        return this.getSearchSuggestionShortcutLinkByName(name).$('.mstrd-RunAsIcon');
    }

    //  Action helper
    async openQuickSearchView() {
        await this.click({ elem: this.getSearchContainer() });
        await this.waitForElementVisible(this.getQuickSearchView());
    }

    async clickViewAll() {
        await this.click({ elem: this.getViewAllResults() });
        await this.waitForElementVisible(this.getSearchResultsContainer());
    }

    async clickSearchSuggestionText(index) {
        await this.click({ elem: this.getSearchSuggestionTextItems()[index - 1] });
        await this.waitForElementVisible(this.getSearchResultsContainer());
    }

    async openDossierFromSearchSuggestion(index) {
        await this.click({ elem: this.getSearchSuggestionShortcutLink(index) });
        return this.dossierPage.waitForDossierLoading();
    }

    async openDossierFromSearchSuggestionByName(name) {
        await this.waitForElementVisible(this.getSearchSuggestionShortcutsItems()[0], { timeout: this.searchTimeout });
        await this.click({ elem: this.getSearchSuggestionShortcutLinkByName(name) });
        return this.dossierPage.waitForDossierLoading();
    }

    async openDossierFromRecentlyViewedByName(name) {
        await this.waitForElementVisible(this.getRecentlyViewedShortcuts(), { timeout: this.searchTimeout });
        await this.click({ elem: this.getRecentlyViewedShortcutLinkByName(name) });
        return this.dossierPage.waitForDossierLoading();
    }

    async clearRencentlySearchedAndReviewed() {
        const isSearchBarPresent = await this.isQuickSearchViewPresent();
        if (!isSearchBarPresent) {
            await this.openSearchSlider();
        }
        if (await this.getRecentlySearchedView().isDisplayed()) {
            await this.click({ elem: this.getClearIcon(this.getRecentlySearchedView()) });
        }
        // if (await this.getRecentlyViewedShortcuts().isDisplayed()) {
        //     await this.click({ elem: this.getClearIcon(this.getRecentlyViewedShortcuts()) });
        // }
    }

    // Assertion helper
    async getRecentlySearchedKeywordsCount() {
        await this.waitForElementVisible(this.getRecentlySearchedKeywords());
        return this.getRecentlySearchedKeywordsItems().length;
    }

    async getRencentlyViewedShortcutCount() {
        await this.waitForElementVisible(this.getRecentlyViewedShortcuts());
        return this.getRecentlyViewedShortcutsItems().length;
    }

    async isKeywordExisted(item) {
        await this.waitForElementVisible(this.getRecentlySearchedKeywords());
        const el = await this.getRecentlySearchedKeywordsItems();
        return this.isExisted(item, el, 'text');
    }

    async waitForSuggestionResponse() {
        await this.waitForElementVisible(this.getSearchSuggestionTextView(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Suggestions does not show.',
        });
        await this.waitForElementVisible(this.getSearchSuggestionShortcuts(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Suggestions does not show.',
        });
    }

    async waitForSearchResultsContainer() {
        return this.waitForElementVisible(this.getSearchResultsContainer());
    }

    async isSearchSuggestionObjectTypeIconDisplayed(name) {
        return this.getSearchSuggestionObjectTypeIcon(name).isDisplayed();
    }

    async isSearchSuggestionRunAsIconDisplayed(name) {
        return this.getSearchSuggestionRunAsIcon(name).isDisplayed();
    }

    async isQuickSearchShortcutItemCoverImageGrayedOut(index) {
        const elem = this.getSearchSuggestionShortcutsItems()[index - 1];
        const cls = await elem.$('.mstrd-QuickSearchShortcutItem-cover').getAttribute('class');
        return cls.includes('mstrd-QuickSearchShortcutItem-cover--grayscale');
    }

    async isSearchSuggestionDisplay() {
        return this.getSearchSuggestionShortcuts().isDisplayed();
    }
}
