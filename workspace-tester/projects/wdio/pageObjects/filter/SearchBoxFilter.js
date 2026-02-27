import BaseFilter from '../base/BaseFilter.js';
import FilterElement from '../common/FilterElement.js';
import FilterSearch from '../common/FilterSearch.js';
import Checkbox from '../common/Checkbox.js';
import { getScrollTopValue, scrollElement, scrollElementToBottom } from '../../utils/scroll.js';

export default class SearchBoxFilter extends BaseFilter {
    constructor() {
        super();
        this.fElement = new FilterElement();
        this.fSearch = new FilterSearch();
    }

    getCheckboxes() {
        return Checkbox.findAll(this.getSecondaryPanel());
    }

    async getCheckboxByName(name) {
        const checkboxes = await this.getCheckboxes();
        for (const checkbox of checkboxes) {
            if ((await checkbox.getLabelText()) === name) {
                return checkbox;
            }
        }
    }

    async selectCheckboxByName(name) {
        const checkbox = await this.getCheckboxByName(name);
        await checkbox.click();
    }

    async isCheckboxSelected(name) {
        const checkbox = await this.getCheckboxByName(name);
        return checkbox.isChecked();
    }

    async getCheckboxLabelByIndex(index) {
        const checkboxes = await this.getCheckboxes();
        return checkboxes[index].getLabelText();
    }

    // Element locator

    // Action helper

    async selectElementByName(name) {
        await this.fElement.selectSearchElementByName(name);
        return this.sleep(2000);
    }

    async selectElementsByNames(names) {
        for (const name of names) {
            await this.selectElementByName(name);
        }
    }

    async scrollFilterToBottom() {
        await scrollElementToBottom(this.fElement.getSearchElementList());
        const currentTopValue = await getScrollTopValue(this.fElement.getSearchElementList());
        await scrollElement(this.fElement.getSearchElementList(), currentTopValue - 10);
        return this.sleep(1000);
    }
    
    async keepOnly(name) {
        return this.fElement.keepOnlyForSearchElement(name);
    }

    async hoverOnElement(name) {
        return this.fElement.hoverOnSearchElement(name);
    }

    async toggleViewSelectedOption() {
        return this.fElement.toggleViewSelectedOption();
    }

    async toggleViewSelectedOptionOn() {
        return this.fElement.toggleViewSelectedOptionOn();
    }

    async selectAll() {
        return this.fElement.selectAll();
    }

    async clearAll() {
        return this.fElement.clearAll();
    }

    async search(keyword) {
        return this.fSearch.search(keyword);
    }

    async clearSearch() {
        return this.fSearch.clearSearch();
    }

    async clearSelection() {
        return this.fElement.bulkSelection('Clear Selection');
    }

    // Assertion helper

    async isElementPresent(name) {
        return this.fElement.isElementPresent(name);
    }

    async isElementSelected(name) {
        return this.fElement.isSearchElementSelected(name);
    }

    async elementByOrder(index) {
        return this.fElement.elementByOrder(index);
    }

    async visibleElementCount() {
        return this.fElement.visibleSearchElementCount();
    }

    async visibleSelectedElementCount() {
        return this.fElement.visibleSearchSelectedElementCount();
    }

    async searchboxPlaceholder() {
        return this.fSearch.searchboxPlaceholder();
    }

    async searchResults() {
        return this.fSearch.searchResults();
    }

    async getSearchResultsText(isWaitSearchResults = false) {
        if (isWaitSearchResults) {
            await this.waitForElementVisible(this.fSearch.getSearchResults());
        }
        return this.fElement.getSearchResultsText();
    }

    async isEmptySearchDisplayed() {
        return this.fSearch.isEmptySearchDisplayed();
    }


    async message() {
        return this.fElement.message();
    }

    async isSelectAllEnabled() {
        return this.fElement.isSelectAllEnabled();
    }

    async isClearAllEnabled() {
        return this.fElement.isClearAllEnabled();
    }

    async isKeepOnlyLinkDisplayed(name) {
        return this.fElement.isKeepOnlyLinkDisplayedForSearchElement(name);
    }

    async getElementIndexInSearchResults(name) {
        await this.waitForElementVisible(this.fSearch.getSearchResults());
        return this.fElement.getElementIndex(name);
    }
}
