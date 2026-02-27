import BasePage from '../base/BasePage.js';
import SearchBox from '../common/SearchBox.js';
import SearchPage from './SearchPage.js';

export default class LibrarySearch extends BasePage {
    constructor() {
        super();
        this.searchBox = new SearchBox();
        this.searchPage = new SearchPage();
    }

    // Element locator
    getResults() {
        return this.$('.mstrd-QuickSearchDropDownView');
    }

    getResultSections() {
        return this.getResults().$$('section');
    }

    getResultSection(section) {
        return this.getResultSections().filter(async (elem) => {
            const elemName = await elem.$('.mstrd-QuickSearchResultHeading-title').getText();
            return elemName === section;
        })[0];
    }

    getResultItem({ section, index }) {
        return this.getResultSection(section).$$('li.focusable')[index];
    }

    getSectionMatch(section) {
        return this.getResultSection(section).$('.mstrd-QuickSearchResultHeading-matches');
    }

    // Action helper
    async executeRecentlySearchedItem(index) {
        await this.searchBox.getRecentlySearchedItem(index).click();
        return this.dossierPage.waitForPageLoading();
    }

    async clearRecentlySearchedItem(index) {
        return this.searchBox.clearRecentlySearchedItem(index);
    }

    async clearAllRecentlySearchedItems() {
        return this.searchBox.clearAllRecentlySearchedItems();
    }

    async openSearchBox() {
        if (!(await this.searchBox.isSearchBoxOpened())) {
            await this.searchBox.getSearchIcon().click();
            return this.waitForElementVisible(this.searchBox.getInputBox(), {
                msg: 'Open search input box takes too long.',
            });
        }
    }

    async search(text) {
        await this.searchBox.search(text);
        await this.waitForElementVisible(this.getResults(), { msg: 'Result does not show up.' });
        // wait for content to be populated
        return this.sleep(1000);
    }

    async localSearch(text) {
        await this.openSearchBox();
        await this.searchBox.search(text);
        await this.searchBox.pressEnter();
        return this.sleep(1000);
    }

    async executeResultItem({ section, index }) {
        await this.getResultItem({ section, index }).click();
        return this.dossierPage.waitForPageLoading();
    }

    async checkMatchItems(section) {
        await this.getSectionMatch(section).click();
        return this.waitForElementVisible(this.searchPage.getResultListContainer(), {
            msg: 'Search result page was not displayed.',
        });
    }

    async clearSearch() {
        return this.searchBox.clearSearch();
    }

    async pressEnter() {
        await this.searchBox.pressEnter();
        await this.waitForElementVisible(this.searchPage.getResultListContainer(), {
            msg: 'Search result page was not displayed.',
        });
        // wait for animation to complete
        return this.sleep(1000);
    }

    async dismissSearch() {
        await this.click({ elem: this.libraryPage.getLibraryCurtain() });
        await this.waitForElementInvisible(this.searchBox.getInputBox(), { msg: 'Dismiss search box takes too long.' });
        // wait for animation to complete
        return this.sleep(500);
    }

    //Assertion helper
    async isInputBoxEmpty() {
        return this.searchBox.isInputBoxEmpty();
    }

    async isRecentlySearchedListPresent() {
        return this.searchBox.isRecentlySearchedPresent();
    }

    async recentlySearchedItemCount() {
        return this.searchBox.getRecentlySearchedList().length;
    }

    async recentlySearchedItem(index) {
        return this.searchBox.getRecentlySearchedItem(index).getText();
    }

    async isRecentlySearchedResultEmpty() {
        return this.searchBox.isRecentlySearchedResultEmpty();
    }

    async isClearSearchIconDisplayed() {
        return this.searchBox.getClearSearchIcon().isDisplayed();
    }

    async isResultEmpty() {
        const elem = this.$('.mstrd-SearchNavItemContainer-results--empty');
        const elemDisplayed = await elem.isDisplayed();
        const elemText = await elem.getText();
        return elemDisplayed && elemText === 'No results found';
    }

    async isTextHighlighted(text) {
        return text === (await this.$$('.mstrd-QuickSearchResultRow-highlight')[0].getAttribute('innerText'));
    }

    async isUserProfileDisplayed() {
        return this.$$('.mstrd-UserPhoto-container')[0].isDisplayed();
    }

    async isSectionPresent(section) {
        return this.getResultSection(section).isDisplayed();
    }

    async resultItem({ section, index }) {
        return this.getResultItem({ section, index }).$$('p')[0].getAttribute('innerText');
    }

    async dossierNameInResultItem({ section, index }) {
        return this.getResultItem({ section, index }).$('.mstrd-QuickSearchResultRow-dossierTitle').getText();
    }

    async objectNameInResultItemByIndex({ section, index, objectIndex }) {
        return this.getResultItem({ section, index })
            .$$('.mstrd-QuickSearchResultRow-vizItem')
            [objectIndex].getAttribute('innerText');
    }

    async attributeCount({ section, index }) {
        return this.getResultItem({ section, index }).$$('.icon-attribute').length;
    }

    async metricCount({ section, index }) {
        return this.getResultItem({ section, index }).$$('.icon-metric').length;
    }

    async matchCount(section) {
        return this.getSectionMatch(section).getText();
    }
}
