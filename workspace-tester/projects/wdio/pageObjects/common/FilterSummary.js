import BaseFilter from '../base/BaseFilter.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class FilterSummary extends BaseFilter {
    // Element locator

    getViewAllButton() {
        return this.$('.mstrd-FilterSummaryBar-right');
    }

    getExpandedFilterByName(name) {
        return this.$$('ul.mstrd-FilterSummaryPanel-items li').filter(async (elem) => {
            const text = await elem.$('.mstrd-FilterSummaryPanelItem-title').getText();
            return text.slice(0, -1) === name; // Trim ':' at the end of the filter name
        })[0];
    }

    getExpandedSummaryItems() {
        return this.$('.mstrd-FilterSummaryPanel-items');
    }

    getFilterCount() {
        return this.$('.mstrd-FilterSummaryBar').$('.mstrd-FilterSummaryBar-filterCount');
    }

    getEditIcon() {
        return this.$('.mstrd-FilterSummaryBar').$('.mstrd-FilterSummaryPanelItem-edit');
    }

    // Action method

    getFilterByName(name) {
        const xpathCommand = this.getCSSContainingText('mstrd-FilterSummaryBarItem', name);
        return this.$('.mstrd-FilterSummaryBar-items').$(`${xpathCommand}`);
    }

    getExcludeLabel(name) {
        return this.getFilterByName(name).$('.mstrd-FilterSummaryBarItem-content').$('.summary-content.exclude-label');
    }

    async viewAllFilterItems() {
        await this.getViewAllButton().click();
        return this.waitForElementVisible(this.getExpandedSummaryItems(), {
            timeout: 5000,
            msg: 'Filter summary expanded view was not displayed.',
        });
    }

    async hoverOnFilterSummary(filterName) {
        await this.hover({ elem: this.getFilterByName(filterName) });
        return this.waitForElementVisible(this.getTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    // Assertion helper

    async isFilterExcluded(name) {
        return this.getExcludeLabel(name).isDisplayed();
    }

    async filterItems(name) {
        await this.waitForDynamicElementLoading();
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(this.getFilterByName(name));
        // getAttribute('innerText') is used instead of getText() to retrieve text which is not displayed due to truncation
        const value = await getAttributeValue(
            this.getFilterByName(name).$('.mstrd-FilterSummaryBarItem-content'),
            'innerText'
        );
        return value;
    }

    async expandedFilterItems(name) {
        // getAttribute('innerText') is used instead of getText() to retrieve text which is not displayed due to truncation
        const value = await getAttributeValue(
            this.getExpandedFilterByName(name).$('.mstrd-FilterSummaryPanelItem-filterItem').$('.summary-content'),
            'innerText'
        );
        return value;
    }

    async filterCount() {
        let count = await this.getFilterCount().getText();
        return count.substring(count.indexOf('(') + 1, count.indexOf(')')); //extracting count from the returned string :FILTER (COUNT)
    }
}
