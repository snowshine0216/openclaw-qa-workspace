import BasePage from '../base/BasePage.js';
import BaseFilter from '../base/BaseFilter.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class FilterSummaryBar extends BasePage {
    constructor() {
        super();
        this.filterpage = new BaseFilter();
    }

    // Element locator
    getFilterSummaryPanel() {
        return this.$('.mstrd-FilterSummaryPanel');
    }

    getFilterSummaryBarContainer() {
        return this.$('.mstrd-FilterSummary-barContainer');
    }

    getFilterSummaryItemTitleList() {
        return this.$$('.mstrd-FilterSummaryBarItem-title');
    }

    getFilterSummaryItemsList() {
        return this.$$('ul.mstrd-FilterSummaryPanel-items li');
    }

    getViewAllButton() {
        return this.$('.mstrd-FilterSummaryBar-right');
    }

    getViewLessButton() {
        return this.$('.mstrd-FilterSummaryViewButton--expanded');  
    }

    getExpandedFilterSummaryItems() {
        return this.$('.mstrd-FilterSummaryPanel-items');
    }

    getFilterSummaryBar() {
        return this.$('.mstrd-FilterSummaryBar');
    }

    getFilterSummaryBarNoFilterLabel() {
        return this.$('.mstrd-FilterSummaryBar-noFilter');
    }

    getFilterBarItem() {
        return this.$('.mstrd-FilterSummaryBar-items');
    }

    getFilterItems() {
        return this.$$('.mstrd-FilterSummaryBarItem-content');
    }

    getFilterByName(name, index = 0) {
        return this.$$('.mstrd-FilterSummaryBarItem h5')
            .filter(async (elem) => {
                const linkName = await elem.getText();
                return linkName.includes(name);
            })[index]
            .parentElement();
        // const items = this.$$('.mstrd-FilterSummaryBarItem').all(by.cssContainingText('h5', name));
        // return items.first().element(by.xpath('..'));
    }

    getPencilIconByName(name) {
        return this.getExpandedFilterByName(name).$('.icon-pencil');
    }

    getExpandedFilterByName(name, index = 0) {
        return this.$$('.mstrd-FilterSummaryPanelItem h5')
            .filter(async (elem) => {
                const linkName = await elem.getText();
                return linkName.includes(name);
            })[index]
            .parentElement();
    }

    getFilterPanelItemsByName(name, index = 0) {
        return this.getExpandedFilterByName(name, index).$$('.summary-content');
    }

    getTruncateDots(name) {
        return this.getExpandedFilterByName(name).$('.mstrd-FilterSummaryPanelItem-truncateDots');
    }

    // Assertion helper
    async isFilterSummaryPresent() {
        return this.getFilterSummaryBarContainer().isDisplayed();
    }

    async filterSummaryBarText() {
        return this.getFilterBarItem().getText();
    }

    async viewAllButtonisDisplayed() {
        return this.getViewAllButton().isDisplayed();
    }

    async isPencilIconPresent(name) {
        return this.getPencilIconByName(name).isDisplayed();
    }

    async isTruncateDotsPresent(name) {
        return this.getTruncateDots(name).isDisplayed();
    }

    async viewAllButtonIsPresent() {
        return this.getViewAllButton().isDisplayed();
    }

    async filterItems(name, index = 0) {
        await this.waitForElementVisible(this.getFilterSummaryBar());
        // getAttribute('innerText') is used instead of getText() to retrieve text which is not displayed due to truncation
        const el = this.getFilterByName(name, index).$('.mstrd-FilterSummaryBarItem-content');
        const value = await getAttributeValue(el, 'innerText');
        return value;
    }

    async filterPanelItems(name, index = 0) {
        const items = this.getFilterPanelItemsByName(name, index);
        const text = await items.map((cell) => cell.getText());
        return text.join(',');
    }

    async filterCountString() {
        return this.$('.mstrd-FilterSummaryBar-filterCount').getText();
    }

    async filterBarItemCount() {
        return this.$$('ul.mstrd-FilterSummaryBar-items li').length;
    }

    async filterItemCountExpanded() {
        return this.getFilterSummaryItemsList().length;
    }

    async filterPanelItemsCount(name) {
        return this.getFilterPanelItemsByName(name).length;
    }

    async isFilterExcludedinExpandedView(name) {
        const textDecoCss = (await this.getFilterPanelItemsByName(name)[0].getCSSProperty('text-decoration')).value;
        return textDecoCss.includes('line-through');
    }

    // Action method

    async clickPencilIconByName(name) {
        await this.getPencilIconByName(name).click();
        return this.waitForElementVisible(this.filterpage.getSecondaryPanel(), {
            timeout: 5000,
            msg: 'Filter secondary panel was not displayed.',
        });
    }

    async viewAllFilterItems() {
        await this.getViewAllButton().click();
        return this.waitForElementVisible(this.getExpandedFilterSummaryItems(), {
            timeout: 5000,
            msg: 'Filter summary expanded view was not displayed.',
        });
    }

    async collapseViewAllItems() {
        await this.getViewLessButton().click();
        return this.waitForElementInvisible(this.getExpandedFilterSummaryItems(), {
            timeout: 5000,
            msg: 'Filter summary expanded view was not collapsed.',
        });
    }
}
